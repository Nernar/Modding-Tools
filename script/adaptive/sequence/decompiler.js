const $ = new JavaImporter();
$.importPackage(findCorePackage().mod.build);
$.importPackage(findCorePackage().mod.executable);
$.importPackage(Packages.dalvik.system);

if (!(TARGET instanceof $.Mod)) {
	MCSystem.throwException("Modification instance must be passed");
}

// Are you really want to comment these?
somethingNeededToDenyRetrubution(TARGET);

/**
 * Returns Dirs.DATA + "cache/classes" to cache
 * loaded odexated files for specified source.
 */
const getCachedOdexFile = function(source) {
	let tmp = java.lang.System.getProperty("java.io.tmpdir", ".");
	return new java.io.File(tmp, "classes/" + source.getName() + ".odex");
};

/**
 * Investigates [[DexFile]] entries to found available rhino
 * script entry and deletes unused cached dex file.
 */
const loadClassNameFromDex = function(file) {
	let odex = getCachedOdexFile(file);
	let dex = $.DexFile.loadDex(file, odex.getAbsolutePath(), 0);
	let result = tryout(function() {
		let className = null;
		let iterator = dex.entries();
		while (iterator.hasMoreElements()) {
			let name = iterator.nextElement();
			if (className != null) {
				MCSystem.throwException("invalid compiled js dex file: more than one class entries (" + className + ", " + name + ")");
			}
			className = name;
		}
		if (className == null) {
			MCSystem.throwException("invalid compiled js dex file: no class entries found");
		}
		return className;
	}, null);
	odex.delete();
	return result;
};

const findRhinoClassLoader = function() {
	return getClass(com.faendir.rhino_android.AndroidContextFactory).getClassLoader();
};

const instantiateRhinoScript = function(name) {
	// Doesn't affects already loaded in Executable runtime code, only specified script
	return java.lang.Class.forName(name, false, findRhinoClassLoader()).newInstance();
};

const decompileScript = function(context, script) {
	return context.decompileScript(script, 0);
};

const findAnyAvailabledBuildableDir = function(buildConfig, source) {
	let dirs = buildConfig.buildableDirs;
	for (let i = 0; i < dirs.size(); i++) {
		let buildable = dirs.get(i);
		if (buildable.targetSource == source) {
			return buildable.dir;
		}
	}
	return null;
};

const buildableDirIsNotUsed = function(buildConfig, source) {
	let dirs = buildConfig.buildableDirs;
	for (let i = 0; i < dirs.size(); i++) {
		let buildable = dirs.get(i);
		if (buildable.dir == source) {
			return false;
		}
	}
	return true;
};

const BuildableDir = function(dir, targetSource) {
	this.dir = String(dir).endsWith("/") ? dir : dir + "/";
	this.targetSource = targetSource;
};

BuildableDir.prototype.toJSON = function() {
	let object = new org.json.JSONObject();
	object.put("dir", this.dir);
	object.put("targetSource", this.targetSource);
	return object;
};

const DEFAULT_PATHES = {
	"main.js": "dev/",
	"launcher.js": "launch/",
	"preloader.js": "pre/"
};

const checkoutAvailabledBuildableDir = function(dir, buildConfig, source) {
	if (DEFAULT_PATHES.hasOwnProperty(source)) {
		let path = DEFAULT_PATHES[source];
		if (buildableDirIsNotUsed(buildConfig, path)) {
			let based = new java.io.File(dir, path);
			if (!based.exists()) return path;
		}
	}
	source = Files.getNameWithoutExtension(source);
	let file = new java.io.File(dir, source);
	if (!file.exists()) return source;
	return source + "-" + random(0, Number.MAX_SAFE_INTEGER);
};

/**
 * Simplifies [[package.Mod_source_js_file_js_x_y_index]] to [[file-x.js]] or
 * from [[package.hash_x_y_index]] to [[hash-x.js]], where's [[x]] used to
 * save different classes uniqal indexation to recognize.
 * @param {string} name class to simplify
 * @returns {string} simplified name
 */
const simplifyScriptName = function(name) {
	name = String(name).substring(27);
	let index = name.indexOf("_js_");
	if (index != -1) name = name.substring(index + 4);
	let last = name.lastIndexOf("_");
	if (last != -1) name = name.substring(0, last);
	let previous = name.lastIndexOf("_");
	if (previous != -1) name = name.substring(0, previous);
	return name.replace(/_js_|_/g, "-");
};

let context = $.Compiler.assureContextForCurrentThread();
let compiledSources = TARGET.createCompiledSources();
// There's no another way to access JSONObject without parsing
let sourceList = sources.getClass().getDeclaredField("sourceList");
sourceList.setAccessible(true);
sourceList = list.get(sources);
let buildConfig = TARGET.buildConfig;

// Iterates source names in .dex/ modification dir
let iterator = sourceList.keys();
let collectedBuildableDirs = new Array();
while (iterator.hasNext()) {
	let source = iterator.next();
	let files = compiledSources.getCompiledSourceFilesFor(source);
	Logger.Log("Scanning source " + source + " for potential " + files.length + " dexes", "DECOMPILER");
	// Scanning build.config for any availabled dir if developer wouldn't remove it
	let output = findAnyAvailabledBuildableDir(buildConfig, source);
	let wasRequiresIncludes = true;
	if (output === null) {
		if (files.length > 1) {
			output = checkoutAvailabledBuildableDir(TARGET.dir, buildConfig, source);
			collectedBuildableDirs.push(new BuildableDir(output, source));
		} else {
			wasRequiresIncludes = false;
			output = source;
		}
	}
	Logger.Log("Decompiling " + source + " to " + output + " " + (wasRequiresIncludes ? "with" : "without") + " .includes", "DECOMPILER");
	output = new java.io.File(TARGET.dir, output);
	// Only source or root files in directory will be deleted
	Files.deleteRecursive(output.getPath(), false);
	let includes = new java.io.File(output.getPath(), ".includes");
	if (wasRequiresIncludes) {
		Files.createNewWithParent(includes.getPath());
		Files.write(includes, "# Auto-generated " + source);
	}
	for (let i = 0; i < files.length; i++) {
		let className = loadClassNameFromDex(files[i]);
		if (className === null) continue;
		let script = instantiateRhinoScript(className);
		let name = simplifyScriptName(className) + ".js";
		let file = new java.io.File(output.getPath(), name);
		if (!wasRequiresIncludes) file = output;
		Files.createNewWithParent(file.getPath());
		script = String(decompileScript(context, script));
		// Export without every firstly empty line breaker
		Files.write(file, script.substring(1));
		if (wasRequiresIncludes) Files.addText(includes, "\n" + name);
		Logger.Log("Decompiled " + className + " to " + name, "DECOMPILER");
	}
}

if (collectedBuildableDirs.length > 0 && buildConfig.isValid()) {
	let json = buildConfig.getClass().getDeclaredField("configJson");
	json.setAccessible(true);
	json = json.get(buildConfig);
	json = json.optJSONArray("buildDirs");
	collectedBuildableDirs.forEach(function(dir) {
		json.put(dir.toJSON());
	});
	Logger.Log("Added missed " + collectedBuildableDirs.length + " buildable directories", "DECOMPILER");
	if (buildConfig.read()) buildConfig.save();
}
