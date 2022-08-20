var createBlock_mappedIds = {};
var createBlock_mappedMod = "CoreEngine";
var createBlock_reportedCacheGroup = false;
var createBlock_confirmedModChanged = false;

var createBlock_map = function(namedID, variation, defineData) {
	if (typeof defineData == "object") {
		if (defineData.hasOwnProperty("textures") || defineData.hasOwnProperty("texture")) {
			if (!createBlock_mappedIds.hasOwnProperty(createBlock_mappedMod)) {
				createBlock_mappedIds[createBlock_mappedMod] = {};
			}
			if (!createBlock_mappedIds[createBlock_mappedMod].hasOwnProperty(namedID)) {
				createBlock_mappedIds[createBlock_mappedMod][namedID] = [];
			}
			defineData = defineData.textures || defineData.texture;
			createBlock_mappedIds[createBlock_mappedMod][namedID][variation] = (function(who) {
				return Array.isArray(who) ? who[0] + "_" + (typeof who[1] == "number" ? who[1] : 0) : who;
			})(Array.isArray(defineData) ? defineData.length > 1 ? defineData[1] :
				defineData.length == 1 ? defineData[0] : "missing" : defineData);
		}
	}
};

var Block_createBlock_AdaptedScript = Block.createBlock;
Block.createBlock = function(numericID, namedID, defineData, blockType) {
	if (!Array.isArray(defineData)) {
		defineData = [defineData];
	}
	for (var element in defineData) {
		createBlock_map(namedID, parseInt(element), defineData[element]);
	}
	return Block_createBlock_AdaptedScript(numericID, namedID, defineData, blockType);
};
var Block_createLiqudBlock_AdaptedScript = Block.createLiquidBlock;
Block.createLiquidBlock = function(idStill, nameIdStill, idFlowing, nameIdFlowing, defineData, blockType, tickDelay, isRenewable) {
	if (!Array.isArray(defineData)) {
		defineData = [defineData];
	}
	for (var element in defineData) {
		createBlock_map(nameIdStill, parseInt(element), defineData[element]);
		createBlock_map(nameIdFlowing, parseInt(element), defineData[element]);
	}
	return Block_createLiqudBlock_AdaptedScript(idStill, nameIdStill, idFlowing, nameIdFlowing, defineData, blockType, tickDelay, isRenewable);
};

Callback.addCallback("BlocksDefined", function() {
	var now = Date.now();
	for (var modName in createBlock_mappedIds) {
		FileTools.WriteText("/storage/emulated/0/Android/media/io.spck/modding-tools/assets/colormap/" + modName + ".json", JSON.stringify(createBlock_mappedIds[modName], null, "\t"));
	}
	log("CoreEngine: completed collecting block atlas in " + (Date.now() - now) + "ms");
});

var createBlock_legacyModList = (function(list) {
	var legacy = [];
	for (var i = 0; i < list.size(); i++) {
		var apparatus = list.get(i);
		if (apparatus instanceof Packages.com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod) {
			legacy.push(apparatus.getLegacyModInstance().getName());
		}
	}
	return legacy;
})(Packages.com.zhekasmirnov.apparatus.modloader.ApparatusModLoader.getSingleton().getAllMods());
var createBlock_legacyModPointer = 0;

Packages.com.zhekasmirnov.innercore.api.log.ICLog.setupEventHandlerForCurrentThread({
	onDebugEvent: function(prefix, message) {
		if (prefix == "ItemModelCache") {
			message = "" + message;
			if (message.startsWith("set current cache group ")) {
				message = message.substring(24, message.length);
				if (createBlock_reportedCacheGroup) {
					if (message == "null") {
						if (createBlock_confirmedModChanged) {
							createBlock_reportedCacheGroup = false;
							createBlock_confirmedModChanged = false;
						}
					}
				} else {
					if (message == "null") {
						createBlock_reportedCacheGroup = true;
					}
				}
			}
			return;
		}
		if (createBlock_reportedCacheGroup) {
			// new executable will be added when mod changed
			if (prefix == "INNERCORE-API") {
				if (!createBlock_confirmedModChanged) {
					createBlock_mappedMod = createBlock_legacyModList[createBlock_legacyModPointer++];
					createBlock_confirmedModChanged = true;
				}
			}
		}
	}
});
