var ExecutableSupport = {
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
		} catch(e) {
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
		if (!dir.endsWith("/")) dir += "/";
		dir = isNative ? dir : Dirs.SUPPORT + "/" + dir;
		var file = new java.io.File(dir);
		if (file.exists()) return dir;
		Logger.Log("Can't find executable directory " + file.getName() + ", ignoring", "Dev-Core");
		return null;
	},
	isModuleMissed: function() {
		return !isInstant && this.getModBuilder();
	},
	buildDirectory: function(dir, isNative) {
		if (!(dir = this.checkDirectory(dir, isNative))) return null;
		var builder = this.getModBuilder(), name = new java.io.File(dir).getName();
		if (!builder) throw "Submodule supportable " + name + " load cancelled";
		var mod = builder.buildModForDir(dir);
		if (!mod) MCSystem.throwException("Build mod directory " + name + " failed, api disabled");
		return (mod.onImport(), this.mods[mod.getName()] = mod, mod.getName());
	},
	launchMod: function(name) {
		var mod = this.getSupportable(name);
		if (!mod) throw "Can't launch mod " + name;
		mod.RunPreloaderScripts(), mod.RunLauncherScripts();
		Logger.Log("Injected mod supportable " + name + " prepared", "Dev-Core");
	},
	getProperty: function(name, property) {
		var mod = this.getSupportable(name);
		if(!mod) return null;
		try {
			return "" + mod.getInfoProperty(property);
		} catch(e) {
			__code__.startsWith("develop") && reportError(e);
		}
		return null;
	},
	evaluateAtExecutable: function(source, action) {
		try {
			return source.evaluateStringInScope(action);
		} catch(e) {
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
		var mod = this.getSupportable(name);
		if (!mod) throw "Can't find mod " + name;
		var results = [], ats = this.actionToString(action);
		for (var i = 0; i < mod.compiledModSources.size(); i++) {
			var source = mod.compiledModSources.get(i);
			results.push(this.evaluateAtExecutable(source, ats));
		}
		return results;
	},
	buildSupportable: function(name) {
		return function(action) {
			try {
				return ExecutableSupport.injectCustomEval(name, action);
			} catch(e) {
				__code__.startsWith("develop") && reportError(e);
			}
			return null;
		};
	},
	getAndLoadIcon: function(name) {
		try {
			if (ImageFactory.getCountByTag(name) > 0) {
				return "support" + name;
			}
			let file = new java.io.File(Dirs.SUPPORT, name);
			if (file != null && file.exists()) {
				let icon = new java.io.File(file.getPath(), "mod_icon.png");
				if (icon != null && icon.exists()) {
					let output = new java.io.File(Dirs.CACHE, name + ".dnr");
					ImageFactory.encodeFile(icon, output);
					ImageFactory.loadFromFile("cache:" + name, output);
					return "cache:" + name;
				}
			}
			return "support";
		} catch (e) {
			Logger.Log("Failed to attempt icon load for " + name, "Dev-Core");
			Logger.LogError(e);
		}
		return null;
	},
	isEnabled: function(name) {
		var mod = this.getSupportable(name);
		if (!mod) throw "Can't find mod " + name;
		return loadSupportables && mod.isEnabled;
	}
};

function importMod(dir, action) {
	try {
		var name = ExecutableSupport.buildDirectory(dir);
		if (name && ExecutableSupport.isEnabled(name)) {
			ExecutableSupport.launchMod(name);
			var supportable = ExecutableSupport.buildSupportable(name);
			supportable.description = ExecutableSupport.getProperty(name, "description");
			supportable.version = ExecutableSupport.getProperty(name, "version");
			supportable.author = ExecutableSupport.getProperty(name, "author");
			supportable.result = action ? ExecutableSupport.injectCustomEval(name, action)[0] : true;
			supportable.icon = ExecutableSupport.getAndLoadIcon(name);
			return (supportable.modName = name, supportable);
		}
	} catch(e) {
		reportError(e);
	}
	return null;
}

function isNotSupported(obj) {
	if (obj.result == true) Logger.Log("Supportable " + obj.modName + " module works fine, has been activated", "Dev-Editor");
	else if (obj.result == false) Logger.Log(obj.modName + " supportable module outdated and will be disabled", "Dev-Editor");
	else if (obj.result instanceof Error && __code__.startsWith("develop")) reportError(obj.result);
	else if (__code__.startsWith("develop")) Logger.Log("Can't resolve modification with invalid result: " + obj.result, obj.modName);
	else Logger.Log("Supportable ignored for some reason, contact with developer", obj.modName);
	return obj.result != true;
}
