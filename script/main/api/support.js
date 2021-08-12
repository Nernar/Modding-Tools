const ExecuteableSupport = {
	mods: new Object(),
	getClassLoader: function() {
		return context.getClassLoader();
	},
	updateClassReference: function(name) {
		return name.startsWith("zhekasmirnov.launcher.") ?
			"com.zhekasmirnov.innercore." + name.substring(22) : name;
	},
	newInstance: function(name, initialize) {
		return tryoutSafety.call(this, function() {
			return java.lang.Class.forName(isHorizon ? this.updateClassReference(name) :
				name, initialize || false, this.getClassLoader()).newInstance();
		}, null);
	},
	getSupportable: function(name) {
		return this.mods[name] || null;
	},
	getModList: function() {
		let array = new Array();
		for (let name in this.mods) {
			array.push(this.mods[name]);
		}
		return array;
	},
	getModBuilder: function() {
		return this.newInstance("zhekasmirnov.launcher.mod.build.ModBuilder");
	},
	checkDirectory: function(dir, isNative) {
		if (!dir.endsWith("/")) {
			dir += "/";
		}
		dir = isNative ? dir : Dirs.SUPPORT + dir;
		let file = new java.io.File(dir);
		if (file.exists()) {
			return dir;
		}
		Logger.Log("Can't find executable directory " + file.getName() + ", ignoring", "DEV-CORE");
		return null;
	},
	isModuleMissed: function() {
		return this.getModBuilder();
	},
	buildDirectory: function(dir, isNative) {
		if (!(dir = this.checkDirectory(dir, isNative))) {
			return null;
		}
		let builder = this.getModBuilder(),
			name = new java.io.File(dir).getName();
		if (!builder) MCSystem.throwException("Submodule supportable " + name + " load cancelled");
		let mod = builder.buildModForDir(dir);
		if (!mod) MCSystem.throwException("Build mod directory " + name + " failed, api disabled");
		mod.onImport();
		this.mods[mod.getName()] = mod;
		return String(mod.getName());
	},
	launchMod: function(name) {
		let mod = this.getSupportable(name);
		if (!mod) MCSystem.throwException("Can't launch mod " + name);
		mod.RunPreloaderScripts();
		mod.RunLauncherScripts();
		Logger.Log("Injected mod supportable " + name + " prepared", "DEV-CORE");
	},
	getProperty: function(name, property) {
		let mod = this.getSupportable(name);
		if (!mod) return null;
		return tryoutSafety(function() {
			return String(mod.getInfoProperty(property));
		}, null);
	},
	evaluateAtExecutable: function(source, action) {
		return tryoutSafety(function() {
			return source.evaluateStringInScope(action);
		}, function(e) {
			Logger.Log("Failed to run exec source " + (source ?
				source.name : "unknown") + ", ignoring", "DEV-CORE");
		}, null);
	},
	actionToString: function(action) {
		return "(" + action + ")();";
	},
	injectCustomEval: function(name, action) {
		let mod = this.getSupportable(name);
		if (!mod) MCSystem.throwException("Can't find mod " + name);
		let results = new Array(),
			ats = this.actionToString(action);
		for (let i = 0; i < mod.compiledModSources.size(); i++) {
			let source = mod.compiledModSources.get(i);
			results.push(this.evaluateAtExecutable(source, ats));
		}
		return results;
	},
	buildSupportable: function(name) {
		return function(action) {
			return tryoutSafety(function() {
				return ExecuteableSupport.injectCustomEval(name, action);
			}, null);
		};
	},
	getAndLoadIcon: function(name) {
		return tryoutSafety(function() {
			let key = BitmapDrawableFactory.generateKeyFor("support/" + name, false);
			if (BitmapDrawableFactory.isMapped(key)) {
				return key;
			}
			let file = new java.io.File(Dirs.SUPPORT, name);
			if (file != null && file.exists()) {
				let icon = new java.io.File(file.getPath(), "mod_icon.png");
				if (icon != null && icon.exists()) {
					return BitmapDrawableFactory.mapAs(key, icon);
				}
			}
		}, function(e) {
			Logger.Log("Failed to attempt icon load for " + name, "DEV-CORE");
		}) || "support";
	},
	refreshIcon: function(supportable) {
		if (supportable) {
			supportable.icon = this.getAndLoadIcon(supportable.directory);
		}
	},
	isEnabled: function(name) {
		let mod = this.getSupportable(name);
		if (!mod) MCSystem.throwException("Can't find mod " + name);
		return loadSupportables && mod.isEnabled;
	},
	uninstall: function(name) {
		let mod = this.getSupportable(name);
		if (!mod) MCSystem.throwException("Can't find mod " + name);
		Logger.Log("Uninstalling supportable " + name, "WARNING")
		Files.deleteRecursive(mod.dir);
		delete this.mods[name];
	}
};

const importMod = function(dir, action) {
	return tryout(function() {
		let name = ExecuteableSupport.buildDirectory(dir);
		if (name && ExecuteableSupport.isEnabled(name)) {
			ExecuteableSupport.launchMod(name);
			let supportable = ExecuteableSupport.buildSupportable(name);
			supportable.description = ExecuteableSupport.getProperty(name, "description");
			supportable.version = ExecuteableSupport.getProperty(name, "version");
			supportable.author = ExecuteableSupport.getProperty(name, "author");
			supportable.result = Boolean(!action || ExecuteableSupport.injectCustomEval(name, action)[0]);
			supportable.directory = dir;
			supportable.modName = name;
			return supportable;
		}
	}, null);
};

const isNotSupported = function(obj) {
	if (obj.result == true) {
		Logger.Log("Supportable " + obj.modName + " module works fine, has been activated", "DEV-EDITOR");
	} else if (obj.result == false) {
		Logger.Log(obj.modName + " supportable module outdated and will be disabled", "DEV-EDITOR");
	} else if (obj.result.lineNumber !== undefined && REVISION.startsWith("develop")) {
		retraceOrReport(obj.result);
	} else if (REVISION.startsWith("develop")) {
		Logger.Log("Can't resolve modification with invalid result: " + obj.result, obj.modName);
	} else Logger.Log("Supportable ignored for some reason, contact with developer", obj.modName);
	return obj.result != true;
};
