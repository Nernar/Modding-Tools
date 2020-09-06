function load() {
	try {
		// Creates a nonexistent project folder
		MCSystem.setLoadingTip("Making Directories");
		FileTools.assureDir(Dirs.EXPORT);
		FileTools.assureDir(Dirs.LOGGING);
		updateSettings();
	} catch(e) {
		reportError(e);
	}
	
	try {
		MCSystem.setLoadingTip("Loading Assets");
		AssetFactory.loadAsset("minecraftFont", "font.ttf");
		typeface = AssetFactory.createFont("minecraft");
	} catch(e) {
		reportError(e);
	}
	
	try {
		var list = Files.listFileNames(Dirs.ASSET, true),
			count = Files.checkFormats(list, ".dnr").length;
		LoadingTipUtils.setEncounter("Loading Resources [%count/" + count + "]");
		ImageFactory.loadDirectory(), LoadingTipUtils.resetEncounter();
		if (debugAnimationsEnabled) {
			ImageFactory.prepareParams("message", Ui.getY(456), Ui.getY(228));
			ImageFactory.prepareTileMode("message", Ui.TileMode.CLAMP, Ui.TileMode.REPEAT);
		}
	} catch(e) {
		reportError(e);
	}
	
	try {
		refreshSupportablesIcons();
	} catch(e) {
		reportError(e);
	}
}

if (isInstant) load();

Callback.addCallback("ModsLoaded", function() {
	if (!isInstant) load();
});

Callback.addCallback("CoreConfigured", function(config) {
	try {
		if (loadSupportables) {
			if (supportSupportables) {
				MCSystem.setLoadingTip("Checking Supportables");
				if (UIEditor && isNotSupported(UIEditor)) UIEditor = null;
				if (Setting && isNotSupported(Setting)) Setting = null;
				if (DumpCreator && isNotSupported(DumpCreator)) DumpCreator = null;
				if (InstantRunner && isNotSupported(InstantRunner)) InstantRunner = null;
				if (WorldEdit && isNotSupported(WorldEdit)) WorldEdit = null;
				if (UtilsPlus && isNotSupported(UtilsPlus)) UtilsPlus = null;
				if (TPSMeter && isNotSupported(TPSMeter)) TPSMeter = null;
			} else showHint(translate("Supportables isn't supported and disabled"));
		}
	} catch(e) {
		reportError(e);
	}
});

Callback.addCallback("PreBlocksDefined", function() {
	try {
		// Loads all textures from the cache of engine (game + mods)
		MCSystem.setLoadingTip("Requesting Textures");
		var path = Dirs.RESOURCE + "/textures/terrain_texture.json";
		if (FileTools.exists(path)) {
			var text = FileTools.readFileText(path);
			if (text && text.length > 0) {
				var object = compileData(text, "object");
				if (object && object instanceof Object) {
					var terrain = object.texture_data;
					if (terrain && terrain.length > 0) {
						var index = addTextureMod(translate("All list"));
						for (var i = 0; i < terrain.length; i++) {
							var element = terrain[i];
							if (!element) continue;
							var items = element.textures;
							if (!items) continue;
							if (Array.isArray(items)) {
								for (var t = 0; t < items.length; t++) {
									var name = items[t];
									if (name instanceof Object) {
										var source = name.path;
										if (!source) continue;
										addTexture(index, name.path, t);
									} else {
										addTexture(index, name, t);
									}
								}
							} else {
								addTexture(index, items, 0);
							}
						}
					}
				}
			}
		}
	} catch(e) {
		reportError(e);
	}
	
	try {
		// Loads pre-generated game textures
		var path = Dirs.ASSET + (isHorizon ? "/blocks-12" : "/blocks-0") + ".json";
		if (FileTools.exists(path)) {
			var data = FileTools.readFileText(path);
			if (data && (data = compileData(data, "object"))) {
				var index = addTextureMod(translate("Minecraft"));
				textures[index].items = data;
			}
		}
	} catch(e) {
		reportError(e);
	}
	
	try {
		// Checks config of each mod for loading textures
		var mods = Files.listDirectories(Dirs.MOD);
		for (var m = 0; m < mods.length; m++) {
			var path = mods[m].getPath() + "/build.config";
			if (!FileTools.exists(path)) continue;
			try {
				var text = FileTools.readFileText(path),
					config = compileData(text, "object"),
					resources = config && config.resources ? config.resources : null;
				if (!resources || resources.length == 0) continue;
				var index = addTextureMod(mods[m].getName());
				for (var i = 0; i < resources.length; i++) {
					var resource = resources[i];
					if (resource && resource.resourceType == "resource") {
						var path = mods[m] + "/" + resource.path + "terrain-atlas";
						if (!FileTools.exists(path)) continue;
						var files = Files.listFileNames(path, true);
						files = Files.checkFormats(files, "png");
						for (var t = 0; t < files.length; t++) {
							var name = files[t];
							if (!name || name.length == 0) continue;
							name = Files.getNameWithoutExtension(name);
							var slash = name.lastIndexOf("/");
							if (slash != -1) name = name.substring(slash + 1); 
							var begin = name.indexOf(resource.path);
							if (begin != -1) name = name.substring(begin);
							var underscore = name.lastIndexOf("_");
							if (underscore != -1) {
								addTexture(index, name.substr(0, underscore), name.substr(underscore + 1));
							} else {
								addTexture(index, name, 0);
							}
						}
					}
				}
			} catch(e) {
				reportError(e);
			}
		}
	} catch(e) {
		reportError(e);
	}
});

function initialize() {
	checkValidate(function() {
		try {
			MCSystem.setLoadingTip("Creating Interface");
			if (__code__.startsWith("develop")) checkNotLocalized();
			(checkUpdate(), checkExecute());
		} catch(e) {
			reportError(e);
		}
		
		context.runOnUiThread(function() {
			try {
				StartEditor.create();
				showHint.unstackLaunch();
			} catch(e) {
				reportError(e);
			}
		});
	});
}

if (isInstant) initialize();

Callback.addCallback("PostLoaded", function() {
	if (!isInstant) initialize();
	isInstant = false;
});

var ModelConverter;
(function() {
	var file = new java.io.File(Dirs.SUPPORT, "ModelConverter/src/index.js");
	if (file.exists()) ModelConverter = FileTools.readFileText(file.getPath());
})();
