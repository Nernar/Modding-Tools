var BlockRegistry = {};
BlockRegistry.idSource = {};
BlockRegistry.clickFunctions = {};
BlockRegistry.dropFunctions = {};
BlockRegistry.popResourceFunctions = {};
BlockRegistry.entityInsideFunctions = {};
BlockRegistry.entityStepOnFunctions = {};
BlockRegistry.neighbourChangeFunctions = {};
BlockRegistry.getNumericId = function(id) {
	return 1;
};
BlockRegistry.createBlock = function(namedID, defineData, blockType) {
	return true;
};
BlockRegistry.createLiquidBlock = function(nameID, defineData, blockType) {};
BlockRegistry.createBlockWithRotation = function(namedID, defineData, blockType) {
	/* TypeError: Cannot read property "0" from undefined */
};
BlockRegistry.isNativeTile = function(id) {
	return true;
};
BlockRegistry.convertBlockToItemId = function(id) {
	return 1;
};
BlockRegistry.convertItemToBlockId = function(id) {
	return 1;
};
BlockRegistry.registerClickFunctionForID = function(numericID, clickFunc) {
	return true;
};
BlockRegistry.registerClickFunction = function(namedID, clickFunc) {
	return true;
};
BlockRegistry.registerDropFunctionForID = function(numericID, dropFunc, level) {
	return true;
};
BlockRegistry.registerDropFunction = function(namedID, dropFunc, level) {
	return true;
};
BlockRegistry.defaultDropFunction = function(blockCoords, blockID, blockData, diggingLevel) {
	return null;
};
BlockRegistry.registerPopResourcesFunctionForID = function(numericID, func) {
	return true;
};
BlockRegistry.registerPopResourcesFunction = function(nameID, func) {
	return true;
};
BlockRegistry.registerEntityInsideFunctionForID = function(numericID, func) {
	return true;
};
BlockRegistry.registerEntityInsideFunction = function(nameID, func) {
	return true;
};
BlockRegistry.registerEntityStepOnFunctionForID = function(numericID, func) {
	return true;
};
BlockRegistry.registerEntityStepOnFunction = function(nameID, func) {
	return true;
};
BlockRegistry.registerNeighbourChangeFunctionForID = function(numericID, func) {
	return true;
};
BlockRegistry.registerNeighbourChangeFunction = function(nameID, func) {
	return true;
};
BlockRegistry.getDropFunction = function(id) {
	return 3;
};
BlockRegistry.setDestroyLevelForID = function(id, level, resetData) {};
BlockRegistry.setDestroyLevel = function(namedID, level, resetData) {};
BlockRegistry.setDestroyTime = function(namedID, time) {};
BlockRegistry.getMaterial = function(numericID) {
	return 3;
};
BlockRegistry.isSolid = function(numericID) {
	return true;
};
BlockRegistry.canContainLiquid = function(numericID) {};
BlockRegistry.canBeExtraBlock = function(numericID) {
	return true;
};
BlockRegistry.getDestroyTime = function(numericID) {
	return 1.5;
};
BlockRegistry.getExplosionResistance = function(numericID) {
	return 30;
};
BlockRegistry.getFriction = function(numericID) {
	return 0.6000000238418579;
};
BlockRegistry.getTranslucency = function(numericID) {};
BlockRegistry.getLightLevel = function(numericID) {};
BlockRegistry.getLightOpacity = function(numericID) {
	return 15;
};
BlockRegistry.getRenderLayer = function(numericID) {
	return 3;
};
BlockRegistry.getRenderType = function(numericID) {};
BlockRegistry.getBlockAtlasTextureCoords = function(name, id) {
	return null;
};
BlockRegistry.setTempDestroyTime = function(numericID, time) {};
BlockRegistry.setBlockMaterial = function(namedID, material, level) {
	return true;
};
BlockRegistry.getMapColor = function(numericID) {};
BlockRegistry.setRedstoneTile = function(namedID, data, isRedstone) {};
BlockRegistry.setupAsRedstoneReceiver = function(namedID, connectToRedstone) {};
BlockRegistry.setupAsRedstoneEmitter = function(namedID, connectToRedstone) {};
BlockRegistry.setupAsNonRedstoneTile = function(namedID) {};
BlockRegistry.onBlockClicked = function(coords, item, block, player) {};
BlockRegistry.onBlockDestroyed = function(coords, fullTile, byHand, isDropAllowed, blockSource, player, item) {};
BlockRegistry.onBlockPoppedResources = function(coords, block, region, f, i) {};
BlockRegistry.onEventEntityInside = function(coords, block, entity) {};
BlockRegistry.onEventEntityStepOn = function(coords, block, entity) {};
BlockRegistry.onEventNeigbourChanged = function(coords, block, changeCoords, region) {};
BlockRegistry.getBlockDropViaItem = function(block, item, coords, blockSource) {
	return null;
};
BlockRegistry.placeFuncs = [];
BlockRegistry.registerPlaceFunctionForID = function(block, func) {};
BlockRegistry.registerPlaceFunction = function(namedID, func) {};
BlockRegistry.getPlaceFunc = function(block) {
	return function() {};
};
BlockRegistry.setBlockShape = function(id, pos1, pos2, data) {};
BlockRegistry.setShape = function(id, x1, y1, z1, x2, y2, z2, data) {};
BlockRegistry.createSpecialType = function(description, nameKey) {
	return "key";
};
BlockRegistry.setRandomTickCallback = function(id, callback) {};
BlockRegistry.setAnimateTickCallback = function(id, callback) {};
BlockRegistry.TYPE_BASE = "createBlock";
BlockRegistry.TYPE_ROTATION = "createBlockWithRotation";
BlockRegistry.setPrototype = function(namedID, Prototype) {};
BlockRegistry.__func = function(blockCoords, blockID, blockData, diggingLevel) {
	return null;
};

var BLOCK_BASE_PROTOTYPE = {};
BLOCK_BASE_PROTOTYPE.__validBlockTypes = {};
BLOCK_BASE_PROTOTYPE.__validBlockTypes.createBlock = true;
BLOCK_BASE_PROTOTYPE.__validBlockTypes.createBlockWithRotation = true;
BLOCK_BASE_PROTOTYPE.__define = function(item) {};
BLOCK_BASE_PROTOTYPE.__describe = function(item) {};
BLOCK_BASE_PROTOTYPE.init = function() {};
BLOCK_BASE_PROTOTYPE.getVariations = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.getSpecialType = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.getCategory = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.getEnchant = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.getProperties = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.isStackedByData = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.isEnchanted = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.getMaterial = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.getDestroyLevel = function(item) {};
BLOCK_BASE_PROTOTYPE.getShape = function(item) {
	return null;
};
BLOCK_BASE_PROTOTYPE.getDrop = null;
BLOCK_BASE_PROTOTYPE.onPlaced = null;
BLOCK_BASE_PROTOTYPE.onItemUsed = null;
