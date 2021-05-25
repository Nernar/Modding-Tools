let ExecutableSupport = {
	mods: new Object(),
	getClassLoader: function() {
		return context.getClassLoader();
	},
	updateClassReference: function(name) {
		return name.startsWith("zhekasmirnov.launcher.") ? 
			"com.zhekasmirnov.innercore." + name.substring(22) : name;
	},
	newInstance: function(name, initialize) {
		try {
			return java.lang.Class.forName(isHorizon ? this.updateClassReference(name) :
				name, initialize || false, this.getClassLoader()).newInstance();
		} catch (e) {
			__code__.startsWith("develop") && reportError(e);
		}
		return null;
	},
	getSupportable: function(name) {
		return this.mods[name] || null;
	},
	getModBuilder: function() {
		return this.newInstance("zhekasmirnov.launcher.mod.build.ModBuilder");
	},
	checkDirectory: function(dir, isNative) {
		if (!dir.endsWith("/")) {
			dir += "/";
		}
		dir = isNative ? dir : Dirs.SUPPORT + "/" + dir;
		let file = new java.io.File(dir);
		if (file.exists()) {
			return dir;
		}
		Logger.Log("Can't find executable directory " + file.getName() + ", ignoring", "Dev-Core");
		return null;
	},
	isModuleMissed: function() {
		return !isInstant && this.getModBuilder();
	},
	buildDirectory: function(dir, isNative) {
		if (!(dir = this.checkDirectory(dir, isNative))) {
			return null;
		}
		let builder = this.getModBuilder(), name = new java.io.File(dir).getName();
		if (!builder) {
			throw Error("Submodule supportable " + name + " load cancelled");
		}
		let mod = builder.buildModForDir(dir);
		if (!mod) {
			throw Error("Build mod directory " + name + " failed, api disabled");
		}
		mod.onImport();
		this.mods[mod.getName()] = mod;
		return mod.getName();
	},
	launchMod: function(name) {
		let mod = this.getSupportable(name);
		if (!mod) {
			throw Error("Can't launch mod " + name);
		}
		mod.RunPreloaderScripts();
		mod.RunLauncherScripts();
		Logger.Log("Injected mod supportable " + name + " prepared", "Dev-Core");
	},
	getProperty: function(name, property) {
		let mod = this.getSupportable(name);
		if (!mod) {
			return null;
		}
		try {
			return "" + mod.getInfoProperty(property);
		} catch (e) {
			__code__.startsWith("develop") && reportError(e);
		}
		return null;
	},
	evaluateAtExecutable: function(source, action) {
		try {
			return source.evaluateStringInScope(action);
		} catch (e) {
			Logger.Log("Failed to run exec source " + (source ?
				source.name : "unknown") + ", ignoring", "Dev-Core");
			__code__.startsWith("develop") && reportError(e);
		}
		return null;
	},
	actionToString: function(action) {
		return "(" + action + ")();";
	},
	injectCustomEval: function(name, action) {
		let mod = this.getSupportable(name);
		if (!mod) {
			throw Error("Can't find mod " + name);
		}
		let results = new Array(), ats = this.actionToString(action);
		for (let i = 0; i < mod.compiledModSources.size(); i++) {
			let source = mod.compiledModSources.get(i);
			results.push(this.evaluateAtExecutable(source, ats));
		}
		return results;
	},
	buildSupportable: function(name) {
		return function(action) {
			try {
				return ExecutableSupport.injectCustomEval(name, action);
			} catch (e) {
				__code__.startsWith("develop") && reportError(e);
			}
			return null;
		};
	},
	getAndLoadIcon: function(name) {
		try {
			let upper = name.substring(0, 1).toUpperCase() + name.substring(1);
			if (ImageFactory.getCountByTag("support" + upper) > 0) {
				return "support" + upper;
			}
			let file = new java.io.File(Dirs.SUPPORT, name);
			if (file != null && file.exists()) {
				let icon = new java.io.File(file.getPath(), "mod_icon.png");
				if (icon != null && icon.exists()) {
					let output = new java.io.File(Dirs.ASSET, "support/" + name + ".dnr");
					REQUIRE("recompress.js")(icon, output);
					ImageFactory.loadFromFile("support" + name, output);
					return "support" + name;
				}
			}
		} catch (e) {
			Logger.Log("Failed to attempt icon load for " + name, "Dev-Core");
			__code__.startsWith("develop") && reportError(e);
		}
		return "support";
	},
	refreshIcon: function(supportable) {
		if (supportable) {
			supportable.icon = this.getAndLoadIcon(supportable.modName);
		}
	},
	isEnabled: function(name) {
		let mod = this.getSupportable(name);
		if (!mod) {
			throw Error("Can't find mod " + name);
		}
		return loadSupportables && mod.isEnabled;
	},
	uninstall: function(name) {
		Files.deleteDir(Dirs.SUPPORT + "/" + name);
		Logger.Log("Uninstalling " + name, "Dev-Core")
		delete this.mods[name];
	}
};

const importMod = function(dir, action) {
	try {
		let name = ExecutableSupport.buildDirectory(dir);
		if (name && ExecutableSupport.isEnabled(name)) {
			ExecutableSupport.launchMod(name);
			let supportable = ExecutableSupport.buildSupportable(name);
			supportable.description = ExecutableSupport.getProperty(name, "description");
			supportable.version = ExecutableSupport.getProperty(name, "version");
			supportable.author = ExecutableSupport.getProperty(name, "author");
			supportable.result = action ? ExecutableSupport.injectCustomEval(name, action)[0] : true;
			supportable.modName = name;
			return supportable;
		}
	} catch (e) {
		reportError(e);
	}
	return null;
};

const isNotSupported = function(obj) {
	if (obj.result == true) {
		Logger.Log("Supportable " + obj.modName + " module works fine, has been activated", "Dev-Editor");
	} else if (obj.result == false) {
		Logger.Log(obj.modName + " supportable module outdated and will be disabled", "Dev-Editor");
	} else if (obj.result instanceof Error && __code__.startsWith("develop")) {
		reportError(obj.result);
	} else if (__code__.startsWith("develop")) {
		Logger.Log("Can't resolve modification with invalid result: " + obj.result, obj.modName);
	} else {
		Logger.Log("Supportable ignored for some reason, contact with developer", obj.modName);
	}
	return obj.result != true;
};
