decompileDexScript = function(path) {
	if (arguments.length < 1) {
		MCSystem.throwException("decompileDexScript: Usage: <scriptFile>");
	}

	log("decompileDexScript: " + path);

	let $ = new JavaImporter();
	$.importPackage(InnerCorePackages.mod.build);
	$.importPackage(InnerCorePackages.mod.executable);
	$.importPackage(Packages.dalvik.system);
	let context = $.Compiler.assureContextForCurrentThread();

	/**
	 * Returns Dirs.DATA + "cache/classes" to cache
	 * loaded odexated files for specified source.
	 */
	function getCachedOdexFile(source) {
		let tmp = java.lang.System.getProperty("java.io.tmpdir", ".");
		return new java.io.File(tmp, "classes/" + source.getName() + ".odex");
	}

	/**
	 * Investigates [[DexFile]] entries to found available rhino
	 * script entry and deletes unused cached dex file.
	 */
	function loadClassFromDex(file) {
		let odex = getCachedOdexFile(Files.of(file));
		let result;
		try {
			let dex = $.DexFile.loadDex(file, odex.getAbsolutePath(), 0);
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
			result = dex.loadClass(className, findRhinoClassLoader());
		} catch(e) {
			Logger.Log("decompileDexScript: " + e, "ERROR");
		}
		odex.delete();
		return result.newInstance();
	}

	function findRhinoClassLoader() {
		return com.faendir.rhino_android.AndroidContextFactory.global.getClass().getClassLoader();
	}

	function decompileScript(context, script) {
		return context.decompileScript(script, 0).substring(1);
	}

	let output = "" + path;
	if (output.endsWith(".dex")) {
		output = output.substring(0, output.length - 4);
	}
	Files.write(output + ".js", decompileScript(context, loadClassFromDex(path)));
};
