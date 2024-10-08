/*

   Mod Executable Handler with Runtime Await Proxy
   Copyright 2022-2024 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

	   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

LIBRARY({
	name: "Mehwrap",
	version: 1,
	shared: true,
	api: "AdaptedScript"
});

(function() {
	const EXECUTOR = java.util.concurrent.Executors.newCachedThreadPool();
	const MINECRAFT_VERSION_CODE = (function() {
		try {
			let version = MCSystem.getMinecraftVersion();
			return parseInt(version.toString().split(".")[1]);
		} catch (e) {
			let version = MCSystem.getInnerCoreVersion();
			return (parseInt(version.toString().split(".")[0]) - 1) * 12;
		}
	})();
	
	const $ = new JavaImporter();
	if (MINECRAFT_VERSION_CODE == 0) {
		$.importPackage(Packages.zhekasmirnov.launcher.api.log);
		$.importPackage(Packages.zhekasmirnov.launcher.api.runtime);
		$.importPackage(Packages.zhekasmirnov.launcher.mod.executable.library);
		$.importPackage(Packages.zhekasmirnov.launcher.mod.build);
		$.importPackage(Packages.zhekasmirnov.launcher.mod.executable);
	} else {
		$.importPackage(Packages.com.zhekasmirnov.innercore.api.log);
		$.importPackage(Packages.com.zhekasmirnov.innercore.api.runtime);
		$.importPackage(Packages.com.zhekasmirnov.innercore.mod.executable.library);
		$.importPackage(Packages.com.zhekasmirnov.apparatus.modloader);
		$.importPackage(Packages.com.zhekasmirnov.innercore.mod.build);
		$.importPackage(Packages.com.zhekasmirnov.innercore.mod.executable);
	}
	
	const Mod = function(instance) {
		let apparatus = (function() {
			if (MINECRAFT_VERSION_CODE == 0) {
				return null;
			}
			if (instance instanceof $.Mod) {
				return Mehwrap.findLegacyInnerCoreModByMod(instance);
			}
			if (instance instanceof $.LegacyInnerCoreMod) {
				let self = instance;
				instance = instance.getLegacyModInstance();
				return self;
			}
			return null;
		})();
		if (!(instance instanceof $.Mod)) {
			MCSystem.throwException("Mehwrap#Mod: Illegal mod " + instance + ", please consider what you are using");
		}
		this.getMod = function() {
			return instance;
		};
		this.getApparatusMod = function() {
			return apparatus;
		};
		this.getConfig = function() {
			try {
				return instance.getConfig();
			} catch (e) {
				return instance.config;
			}
		};
		this.isEnabled = function() {
			if (apparatus != null) {
				return !!apparatus.isEnabledAndAbleToRun();
			}
			if (MINECRAFT_VERSION_CODE == 0) {
				return !!instance.isEnabled;
			}
			return !!instance.getConfig().getBool("enabled");
		};
		this.isMultiplayerSupported = function() {
			if (apparatus != null) {
				return !!apparatus.getInfo().getBoolean("multiplayer_supported");
			}
			try {
				return !!instance.isConfiguredForMultiplayer();
			} catch (e) {
				return false;
			}
		};
		this.isClientOnly = function() {
			if (apparatus != null) {
				return !!apparatus.getInfo().getBoolean("client_only");
			}
			try {
				return !!instance.isClientOnly();
			} catch (e) {
				return true;
			}
		};
		this.getName = function() {
			if (apparatus != null) {
				return "" + apparatus.getInfo().getString("name");
			}
			try {
				return "" + instance.getMultiplayerName();
			} catch (e) {
				return this.getDisplayedName();
			}
		};
		this.getDisplayedName = function() {
			if (apparatus != null) {
				return "" + apparatus.getInfo().getString("displayed_name");
			}
			return "" + instance.getName();
		};
		this.getVersion = function() {
			if (apparatus != null) {
				return "" + apparatus.getInfo().getString("version");
			}
			try {
				return "" + instance.getMultiplayerVersion();
			} catch (e) {
				try {
					return "" + instance.getVersion();
				} catch (e) {
					return "" + instance.getInfoProperty("version");
				}
			}
		};
		this.getDescription = function() {
			if (apparatus != null) {
				return "" + apparatus.getInfo().getString("description");
			}
			return "" + instance.getInfoProperty("description");
		};
		this.getDeveloper = function() {
			if (apparatus != null) {
				return "" + apparatus.getInfo().getString("developer");
			}
			return "" + instance.getInfoProperty("author");
		};
		this.getIconPath = function() {
			if (apparatus != null) {
				return "" + apparatus.getInfo().getString("icon_path");
			}
			return instance.dir + "icon.png";
		};
		this.getIconName = function() {
			if (apparatus != null) {
				return "" + apparatus.getInfo().getString("icon_name");
			}
			return "" + instance.getGuiIcon();
		};
		this.getDirectory = function() {
			if (apparatus != null) {
				return "" + apparatus.getInfo().getString("directory_root");
			}
			return "" + instance.dir;
		};
		this.getModState = function() {
			if (MINECRAFT_VERSION_CODE == 0) {
				return Mod.State.UNKNOWN;
			}
			let state = mod.getModState();
			if (state == $.ApparatusMod.ModState.RUNNING) {
				return Mod.State.RUNNING;
			} else if (state == $.ApparatusMod.ModState.PREPARED) {
				return Mod.State.PREPARED;
			} else if (state == $.ApparatusMod.ModState.ENVIRONMENT_SETUP) {
				return Mod.State.ENVIRONMENT_SETUP;
			} else if (state == $.ApparatusMod.ModState.INITIALIZED) {
				return Mod.State.INITIALIZED;
			}
			return Mod.State.UNKNOWN;
		};
		this.configureMultiplayer = function(isClientOnly, name, version) {
			try {
				instance.configureMultiplayer(name || null, version || null, isClientOnly || false);
			} catch (e) {
				Logger.Log("Mehwrap#Mod.configureMultiplayer: Is not supported", "INFO");
			}
		};
		this.getBuildType = function() {
			return "" + instance.getBuildType().toString();
		};
		this.setBuildType = function(type) {
			instance.setBuildType(type);
		};
		this.getDebugInfo = function() {
			return instance.getDebugInfo();
		};
		this.runCustomSource = function(what, scope) {
			return instance.runCustomSource(what, scope);
		};
		this.getAllExecutables = function() {
			let conversion = [];
			try {
				let executables = instance.getAllExecutables();
				for (let i = executables.size() - 1; i >= 0; i--) {
					conversion.push(executables.get(i));
				}
			} catch (e) {
				Logger.Log("Mehwrap#Mod.getAllExecutables: " + e, "WARNING");
			}
			return conversion;
		};
		this.getAllExecutableProxies = function() {
			return this.getAllExecutables().map(function(who) {
				return new Executable(who);
			});
		};
		this.getAllLibraries = function() {
			let conversion = [];
			try {
				let libraries = instance.compiledLibs;
				for (let i = executables.size() - 1; i >= 0; i--) {
					libraries.push(libraries.get(i));
				}
			} catch (e) {
				Logger.Log("Mehwrap#Mod.getAllLibraries: " + e, "WARNING");
			}
			return conversion;
		};
		this.getAllLibraryProxies = function() {
			return this.getAllLibraries().map(function(who) {
				return new Library(who);
			});
		};
		this.getAllCustomSources = function() {
			let sources = {};
			try {
				let iterator = instance.compiledCustomSources.keySet().iterator();
				while (iterator.hasNext()) {
					let key = iterator.next();
					sources[key] = instance.compiledCustomSources.get(key);
				}
			} catch (e) {
				Logger.Log("Mehwrap#Mod.getAllCompiledSources: " + e, "WARNING");
			}
			return sources;
		};
		this.getAllCustomSourceProxies = function() {
			let sources = this.getAllCustomSources();
			for (let element in sources) {
				sources[element] = new Executable(sources[element]);
			}
			return sources;
		};
	};
	
	Mod.State = {
		UNKNOWN: -1,
		INITIALIZED: 0,
		ENVIRONMENT_SETUP: 1,
		PREPARED: 2,
		RUNNING: 3
	};
	
	Mod.BuildType = {
		RELEASE: "release",
		DEVELOP: "develop"
	};
	
	const Executable = function(instance) {
		if (!(instance instanceof $.Executable)) {
			MCSystem.throwException("Mehwrap#Executable: Illegal executable " + instance + ", please consider what you are using");
		}
		let scope = instance.getScope();
		this.getScope = function() {
			return scope;
		};
		this.getApiInstance = function() {
			return instance.apiInstance;
		};
		this.getCompilerConfig = function() {
			return instance.compilerConfig;
		};
		this.getName = function() {
			return "" + instance.name;
		};
		this.getScript = function() {
			return instance.script;
		};
		this.getParentContext = function() {
			return instance.parentContext;
		};
		this.getParentMod = function() {
			return instance.getParentMod();
		};
		this.isLoadedFromDex = function() {
			return !!instance.isLoadedFromDex;
		};
		this.isRunning = function() {
			return !!instance.isRunning();
		};
		this.getLastRunException = function() {
			return instance.getLastRunException();
		};
		this.run = function() {
			instance.run();
		};
		this.runForResult = function() {
			return instance.runForResult();
		};
		this.evaluateStringInScope = function(what) {
			return instance.evaluateStringInScope(what);
		};
	};
	
	const Library = function(instance) {
		if (!(instance instanceof $.Library)) {
			MCSystem.throwException("Mehwrap#Library: Illegal library " + instance + ", please consider what you are using");
		}
		Executable.apply(this, arguments);
		this.getLibName = function() {
			return "" + instance.getLibName();
		};
		this.getVersionCode = function() {
			return instance.getVersionCode() - 0;
		};
		this.isShared = function() {
			return !!instance.isShared();
		};
		this.isInvalid = function() {
			return !!instance.isInvalid();
		};
		this.isPrepared = function() {
			return !!instance.isPrepared();
		};
		this.isInitialized = function() {
			return !!instance.isInitialized();
		};
		this.isLoaded = function() {
			return !!instance.isLoaded();
		};
		this.isLoadingInProgress = function() {
			return !!instance.isLoadingInProgress();
		};
		this.getExportNames = function() {
			if (instance.isLoadingInProgress()) {
				MCSystem.throwException("Mehwrap#Library.getExportNames: Ilya found");
			}
			let names = [];
			try {
				let iterator = instance.getExportNames().iterator();
				while (iterator.hasNext()) {
					names.push("" + iterator.next());
				}
			} catch (e) {
				Logger.Log("Mehwrap#Library.getExportNames: " + e, "WARNING");
			}
			return names;
		};
		this.getDependencies = function() {
			let conversion = [];
			try {
				let dependencies = instance.getDependencies();
				for (let i = dependencies.size(); i >= 0; i--) {
					conversion.push(dependencies.get(i));
				}
			} catch (e) {
				Logger.Log("Mehwrap#Library.getDependencies: " + e, "WARNING");
			}
			return conversion;
		};
		this.getExportForDependency = function(dependency, name) {
			return instance.getExportForDependency(dependency, name);
		};
	};
	
	try {
		Library.prototype = new Executable(__mod__.getAllExecutables().get(0));
	} catch (e) {
		Logger.Log("Mehwrap#Library.prototype: " + e, "WARNING");
	}
	
	const invokeSafety = function(who, consumes) {
		try {
			if (typeof who == "function") {
				return who.apply(null, consumes);
			} else if (typeof who == "object") {
				return who.when.apply(typeof who.on == "function" ? who.on() : who.on, consumes);
			}
		} catch (e) {
			Logger.Log("Mehwrap#invoke: " + e, "WARNING");
		}
		return null;
	};
	
	let asyncStateFutures = {};
	const notifyStateChanged = function(who) {
		if (!asyncStateFutures.hasOwnProperty(who)) {
			return;
		}
		while (asyncStateFutures[who].length > 0) {
			invokeSafety(asyncStateFutures[who].pop(), Array.prototype.slice.call(arguments, 1));
		}
		delete asyncStateFutures[who];
	};
	
	const Stage = {
		UNKNOWN: -1,
		IDLE: 0,
		START: 1,
		RESOURCES_LOADING: 2,
		MODS_PRELOAD: 3,
		MCPE_STARTING: 4,
		MCPE_INITIALIZING: 5,
		FINAL_LOADING: 6,
		COMPLETE: 7
	};
	
	let modsList = [];
	
	const Mehwrap = {
		getLoadingStage: function() {
			return stage;
		},
		requireLegacyInnerCoreModByMod: function(instance) {
			let where = $.ApparatusModLoader.getSingleton().getAllMods();
			for (let i = where.size() - 1; i >= 0; i--) {
				let mod = where.get(i);
				if (mod instanceof $.LegacyInnerCoreMod) {
					if (mod.getLegacyModInstance() == instance) {
						return mod;
					}
				}
			}
			MCSystem.throwException("Mehwrap#requireLegacyInnerCoreModByMod: Not found " + instance);
		},
		findLegacyInnerCoreModByMod: function(instance) {
			try {
				return this.requireLegacyInnerCoreModByMod(instance);
			} catch (e) {
				Logger.Log("Mehwrap#findLegacyInnerCoreModByMod: " + e, "DEBUG");
			}
			return null;
		},
		getRawModList: function() {
			let raw = [];
			try {
				let where = $.ApparatusModLoader.getSingleton().getAllMods();
				for (let i = where.size() - 1; i >= 0; i--) {
					let mod = where.get(i);
					if (mod instanceof $.LegacyInnerCoreMod) {
						raw.push(mod.getLegacyModInstance());
					}
				}
			} catch (e) {
				let where = $.ModLoader.instance.modsList;
				for (let i = where.size() - 1; i >= 0; i--) {
					raw.push(where.get(i));
				}
			}
			return raw;
		},
		getApparatusModList: function() {
			let raw = [];
			let where = $.ApparatusModLoader.getSingleton().getAllMods();
			for (let i = where.size() - 1; i >= 0; i--) {
				raw.push(where.get(i));
			}
			return raw;
		},
		forceReloadList: function() {
			try {
				let where = $.ApparatusModLoader.getSingleton().getAllMods();
				for (let i = where.size() - 1; i >= 0; i--) {
					let found = false;
					let apparatus = where.get(i);
					for (let a = 0; a < modsList.length; a++) {
						if (modsList[a].getApparatusMod() == apparatus) {
							found = true;
							break;
						}
					}
					if (!found) {
						modsList.push(new Mod(apparatus));
					}
				}
			} catch (e) {
				let where = $.ModLoader.instance.modsList;
				for (let i = where.size() - 1; i >= 0; i--) {
					let found = false;
					let mod = where.get(i);
					for (let a = 0; a < modsList.length; a++) {
						if (modsList[a].getMod() == mod) {
							found = true;
							break;
						}
					}
					if (!found) {
						modsList.push(new Mod(mod));
					}
				}
			}
			return this;
		},
		getModProxyList: function() {
			return modsList;
		}
	};
	
	let stage = Stage.IDLE;
	
	// The same thread is used to run all mods and log accordingly,
	// it is advisable not to take main log, and calling in another
	// thread is fraught with ignoring necessary message.
	// Not recommended, but can be commented by replacing with
	// `execute` in executor below to achieve non-immediate results.
	
	$.ICLog.setupEventHandlerForCurrentThread({
		onImportantEvent: function(prefix, message) {
			try {
				if (prefix != "PROFILING") {
					return;
				}
				let onto = stage;
				if (message == "switched into new loading stage: stage=STAGE_COMPLETE") {
					stage = Stage.COMPLETE;
				} else if (message == "switched into new loading stage: stage=STAGE_FINAL_LOADING") {
					stage = Stage.FINAL_LOADING;
				} else if (message == "switched into new loading stage: stage=STAGE_MCPE_INITIALIZING") {
					stage = Stage.MCPE_INITIALIZING;
				} else if (message == "switched into new loading stage: stage=STAGE_MCPE_STARTING") {
					stage = Stage.MCPE_STARTIMG;
				} else if (message == "switched into new loading stage: stage=STAGE_MODS_PRELOAD") {
					stage = Stage.MODS_PRELOAD;
				} else if (message == "switched into new loading stage: stage=STAGE_RESOURCES_LOADING") {
					stage = Stage.RESOURCES_LOADING;
				} else if (message == "switched into new loading stage: stage=STAGE_START") {
					stage = Stage.START;
				} else if (message == "switched into new loading stage: stage=STAGE_IDLE") {
					stage = Stage.IDLE;
				}
				if (onto != stage) {
					for (let i = onto; i <= stage; i++) {
						notifyStateChanged(i);
					}
				}
			} catch (e) {
				Logger.Log("Mehwrap#onStageChanged: " + e, "ERROR");
			}
		}
	});
	
	// EXECUTOR.execute(function() {
		// try {
			// while (stage < Stage.COMPLETE) {
				// let next = parseInt($.LoadingStage.getStage());
				// if (next != stage) {
					// stage = next;
					// for (let i = 0; i <= next; i++) {
						// notifyStateChanged(i);
					// }
				// }
				// java.lang.Thread.yield();
			// }
		// } catch (e) {
			// Logger.Log("Mehwrap#onStageChanged: " + e, "ERROR");
		// }
	// });
	
	(function(when) {
		if (MINECRAFT_VERSION_CODE <= 12) {
			Callback.addCallback("InstantLoaded", when);
			Callback.addCallback("AddRuntimePacks", when);
			Callback.addCallback("PreBlocksDefined", when);
		} else {
			Callback.addCallback("InstantLoaded", when, Number.MAX_VALUE);
			Callback.addCallback("AddRuntimePacks", when, Number.MAX_VALUE);
			Callback.addCallback("PreBlocksDefined", when, Number.MAX_VALUE);
		}
	})(function() {
		Mehwrap.forceReloadList();
	});
	
	Mehwrap.Request = function() {
		let pendingMod = null;
		this.when = function(type, obj, what) {
			switch (type) {
				case Mehwrap.Request.STAGE:
					if (!asyncStateFutures.hasOwnProperty(type)) {
						asyncStateFutures[type] = [];
					}
					asyncStateFutures[type].push(what);
					break;
				case Mehwrap.Request.MOD:
					pendingMod = null;
					break;
				case Mehwrap.Request.API:
					
					break;
				case Mehwrap.Request.MOD_API:
					
					break;
				default:
					Logger.Log("Mehwrap.Request: Unresolved property type " + type + " in when()", "INFO");
			}
			return this;
		};
		this.then = function(type, obj, what) {
			if (pendingMod == null) {
				MCSystem.throwException("Mehwrap.Request: then() must be called after when(Mehwrap.Request.MOD, ..)");
			}
			switch (type) {
				case Mehwrap.Request.EXECUTABLE:
					
					break;
				case Mehwrap.Request.LIBRARY:
					
					break;
				default:
					Logger.Log("Mehwrap.Request: Unresolved property type " + type + " in then()", "INFO");
			}
			return this;
		};
	};
	
	Mehwrap.Request.STAGE = 0;
	Mehwrap.Request.MOD = 1;
	Mehwrap.Request.API = 2;
	Mehwrap.Request.MOD_API = 3;
	Mehwrap.Request.EXECUTABLE = 4;
	Mehwrap.Request.LIBRARY = 5;
	
	EXPORT("Mehwrap", Mehwrap);
	EXPORT("LoadingStage", Stage);
	EXPORT("ModProxy", Mod);
	EXPORT("ExecutableProxy", Executable);
	EXPORT("LibraryProxy", Library);
})();
