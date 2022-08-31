var TileEntity = {};
TileEntity.tileEntityPrototypes = {};
TileEntity.tileEntityList = [];
TileEntity.tileEntityCacheMap = {};
TileEntity.resetEngine = function() {
	return null;
};
TileEntity.registerPrototype = function(blockID, customPrototype) {
	return null;
};
TileEntity.getPrototype = function() {};
TileEntity.isTileEntityBlock = function(blockID) {
	return true;
};
TileEntity.createTileEntityForPrototype = function() {};
TileEntity.addTileEntity = function(x, y, z, blockSource) {
	return null;
};
TileEntity.addUpdatableAsTileEntity = function(updatable) {
	return null;
};
TileEntity.getTileEntity = function(x, y, z, blockSource) {
	return null;
};
TileEntity.destroyTileEntity = function(tileEntity, fromDestroyBlock, isDropAllowed) {
	/* TypeError: Cannot call method "destroy" of null */
};
TileEntity.destroyTileEntityAtCoords = function(x, y, z, blockSource, isDropAllowed) {
	return false;
};
TileEntity.isTileEntityLoaded = function(tileEntity) {
	/* TypeError: Cannot read property "blockSource" from null */
};
TileEntity.checkTileEntityForIndex = function(index) {
	/* InternalError: Can't find method com.zhekasmirnov.apparatus.mcpe.NativeBlockSource.getDefaultForDimension(org.mozilla.javascript.Undefined). (Core Engine#1098) */
};
TileEntity.tileEntityCheckIndex = 0;
TileEntity.CheckTileEntities = function() {
	/* InternalError: Can't find method com.zhekasmirnov.apparatus.mcpe.NativeBlockSource.getDefaultForDimension(org.mozilla.javascript.Undefined). (Core Engine#1098) */
};
TileEntity.DeployDestroyChecker = function(tileEntity) {
	/* TypeError: Cannot read property "__checkInProgress" from null */
};

var TILE_ENTITY_CHECKER_ITERATIONS = 10;
var TileEntityBasePrototype = {};
TileEntityBasePrototype.remove = false;
TileEntityBasePrototype.isLoaded = false;
TileEntityBasePrototype.__initialized = false;
TileEntityBasePrototype.networkEntityType = null;
TileEntityBasePrototype.networkEntity = null;
TileEntityBasePrototype.defaultValues = {};
TileEntityBasePrototype._runInit = function() {
	/* JavaException: java.lang.IllegalArgumentException: no saver found for id 0 use only registerObjectSaver return values */
};
TileEntityBasePrototype.update = function() {
	return null;
};
TileEntityBasePrototype._to_string = function() {
	return "TileEntity{undefined pos=(undefined, undefined, undefined), dimension=undefined}";
};
TileEntityBasePrototype.created = function() {
	return null;
};
TileEntityBasePrototype.load = function() {
	return null;
};
TileEntityBasePrototype.unload = function() {
	return null;
};
TileEntityBasePrototype.init = function() {
	return null;
};
TileEntityBasePrototype.onCheckerTick = function(isInitialized, isLoaded, wasLoaded) {
	return null;
};
TileEntityBasePrototype.click = function(id, count, data, coords) {
	return false;
};
TileEntityBasePrototype.destroyBlock = function(coords, player) {
	return null;
};
TileEntityBasePrototype.redstone = function(params) {
	return null;
};
TileEntityBasePrototype.projectileHit = function(coords, projectile) {
	return null;
};
TileEntityBasePrototype.destroy = function() {
	return false;
};
TileEntityBasePrototype.getGuiScreen = function() {
	return null;
};
TileEntityBasePrototype.getScreenByName = function(name, container) {
	return null;
};
TileEntityBasePrototype.onItemClick = function(id, count, data, coords, player, extra) {
	/* JavaException: java.lang.IllegalArgumentException: no saver found for id 0 use only registerObjectSaver return values */
};
TileEntityBasePrototype.selfDestroy = function() {
	/* TypeError: Cannot call method "close" of undefined */
};
TileEntityBasePrototype.requireMoreLiquid = function(liquid, amount) {
	return null;
};
TileEntityBasePrototype.sendPacket = function(name, data) {
	/* TypeError: Cannot call method "send" of null */
};
TileEntityBasePrototype.sendResponse = function(name, data) {
	/* TypeError: Cannot call method "respond" of null */
};
