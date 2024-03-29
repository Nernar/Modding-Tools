var LiquidRegistry = {};
LiquidRegistry.liquidStorageSaverId = 1306847136;
LiquidRegistry.liquids = {};
LiquidRegistry.liquids.water = {};
LiquidRegistry.liquids.water.key = "water";
LiquidRegistry.liquids.water.name = "water";
LiquidRegistry.liquids.water.uiTextures = [ "_liquid_water_texture_0" ];
LiquidRegistry.liquids.water.uiCache = {};
LiquidRegistry.liquids.water.modelTextures = [];
LiquidRegistry.liquids.water.blockId = 8;
LiquidRegistry.liquids.water.staticBlockId = 9;
LiquidRegistry.liquids.water.addUITexture = function(name) {
	return null;
};
LiquidRegistry.liquids.water.addModelTexture = function(name) {
	return null;
};
LiquidRegistry.liquids.lava = {};
LiquidRegistry.liquids.lava.key = "lava";
LiquidRegistry.liquids.lava.name = "lava";
LiquidRegistry.liquids.lava.uiTextures = [ "_liquid_lava_texture_0" ];
LiquidRegistry.liquids.lava.uiCache = {};
LiquidRegistry.liquids.lava.modelTextures = [];
LiquidRegistry.liquids.lava.blockId = 10;
LiquidRegistry.liquids.lava.staticBlockId = 11;
LiquidRegistry.liquids.lava.addUITexture = function(name) {
	return null;
};
LiquidRegistry.liquids.lava.addModelTexture = function(name) {
	return null;
};
LiquidRegistry.liquids.milk = {};
LiquidRegistry.liquids.milk.key = "milk";
LiquidRegistry.liquids.milk.name = "milk";
LiquidRegistry.liquids.milk.uiTextures = [ "_liquid_milk_texture_0" ];
LiquidRegistry.liquids.milk.uiCache = {};
LiquidRegistry.liquids.milk.modelTextures = [];
LiquidRegistry.liquids.milk.blockId = 0;
LiquidRegistry.liquids.milk.staticBlockId = 0;
LiquidRegistry.liquids.milk.addUITexture = function(name) {
	return null;
};
LiquidRegistry.liquids.milk.addModelTexture = function(name) {
	return null;
};
LiquidRegistry.registerLiquid = function(key, name, uiTextures, modelTextures) {
	return null;
};
LiquidRegistry.getLiquidData = function(key) {
	return {
		key: "lava",
		name: "test",
		uiTextures: "lava_ui",
		uiCache: {},
		modelTextures: "lava",
		blockId: 0,
		staticBlockId: 0,
		addUITexture: (function (name) {this.uiTextures.push(name);}),
		addModelTexture: (function (name) {this.modelTextures.push(name);})
	};
};
LiquidRegistry.isExists = function(key) {
	return true;
};
LiquidRegistry.getLiquidName = function(key) {
	return "test";
};
LiquidRegistry.getLiquidUITexture = function(key, width, height) {
	return "missing_texture";
};
LiquidRegistry.getLiquidUIBitmap = function() {};
LiquidRegistry.LiquidByBlock = {};
LiquidRegistry.LiquidByBlock[8] = "water";
LiquidRegistry.LiquidByBlock[9] = "water";
LiquidRegistry.LiquidByBlock[10] = "lava";
LiquidRegistry.LiquidByBlock[11] = "lava";
LiquidRegistry.registerBlock = function(liquid, blockId, isDynamic) {
	return null;
};
LiquidRegistry.getLiquidByBlock = function(blockId) {
	return null;
};
LiquidRegistry.getBlockByLiquid = function(liquid, isStatic) {
	return 0;
};
LiquidRegistry.FullByEmpty = {};
LiquidRegistry.FullByEmpty["325:0:water"] = {};
LiquidRegistry.FullByEmpty["325:0:water.id"] = 850;
LiquidRegistry.FullByEmpty["325:0:water.data"] = 0;
LiquidRegistry.FullByEmpty["374:0:water"] = {};
LiquidRegistry.FullByEmpty["374:0:water.id"] = 373;
LiquidRegistry.FullByEmpty["374:0:water.data"] = 0;
LiquidRegistry.FullByEmpty["325:0:lava"] = {};
LiquidRegistry.FullByEmpty["325:0:lava.id"] = 843;
LiquidRegistry.FullByEmpty["325:0:lava.data"] = 0;
LiquidRegistry.FullByEmpty["325:0:milk"] = {};
LiquidRegistry.FullByEmpty["325:0:milk.id"] = 876;
LiquidRegistry.FullByEmpty["325:0:milk.data"] = 0;
LiquidRegistry.EmptyByFull = {};
LiquidRegistry.EmptyByFull["850:0"] = {};
LiquidRegistry.EmptyByFull["850:0.id"] = 325;
LiquidRegistry.EmptyByFull["850:0.data"] = 0;
LiquidRegistry.EmptyByFull["850:0.liquid"] = "water";
LiquidRegistry.EmptyByFull["373:0"] = {};
LiquidRegistry.EmptyByFull["373:0.id"] = 374;
LiquidRegistry.EmptyByFull["373:0.data"] = 0;
LiquidRegistry.EmptyByFull["373:0.liquid"] = "water";
LiquidRegistry.EmptyByFull["843:0"] = {};
LiquidRegistry.EmptyByFull["843:0.id"] = 325;
LiquidRegistry.EmptyByFull["843:0.data"] = 0;
LiquidRegistry.EmptyByFull["843:0.liquid"] = "lava";
LiquidRegistry.EmptyByFull["876:0"] = {};
LiquidRegistry.EmptyByFull["876:0.id"] = 325;
LiquidRegistry.EmptyByFull["876:0.data"] = 0;
LiquidRegistry.EmptyByFull["876:0.liquid"] = "milk";
LiquidRegistry.registerItem = function(liquid, empty, full) {
	return null;
};
LiquidRegistry.getEmptyItem = function(id, data) {
	return null;
};
LiquidRegistry.getItemLiquid = function(id, data) {
	return null;
};
LiquidRegistry.getFullItem = function(id, data, liquid) {
	return null;
};
LiquidRegistry.Storage = function(tileEntity) {
	return null;
};
