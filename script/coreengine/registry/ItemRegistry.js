var ItemRegistry = {};
ItemRegistry.idSource = {};
ItemRegistry.useFunctions = {};
ItemRegistry.throwableFunctions = {};
ItemRegistry.getNumericId = function(id) {
	return 1;
};
ItemRegistry.getItemById = function(id) {
	return null;
};
ItemRegistry.createItem = function(namedID, name, texture, params) {
	return false;
};
ItemRegistry.createFoodItem = function(namedID, name, texture, params) {
	return null;
};
ItemRegistry.createFuelItem = function(namedID, name, texture, params) {
	/* JavaException: java.lang.RuntimeException: creation of fuel items is not yet supported */
};
ItemRegistry.createArmorItem = function(namedID, name, texture, params) {
	return null;
};
ItemRegistry.createThrowableItem = function(namedID, name, texture, params) {
	return false;
};
ItemRegistry.isNativeItem = function(id) {
	return true;
};
ItemRegistry.getMaxDamage = function(id) {
	return 0;
};
ItemRegistry.getMaxStack = function(id, data) {
	return 64;
};
ItemRegistry.getName = function(id, data, extra) {
	return "Камень";
};
ItemRegistry.isValid = function(id, data) {
	return true;
};
ItemRegistry.addToCreative = function(id, count, data, extra) {
	return null;
};
ItemRegistry.addCreativeGroup = function(name, displayedName, ids) {
	return null;
};
ItemRegistry.describeItem = function(numericID, description) {
	/* TypeError: Cannot call method "setHandEquipped" of null */
};
ItemRegistry.setCategory = function(id, category) {
	return null;
};
ItemRegistry.setEnchantType = function(id, enchant, value) {
	/* TypeError: Cannot call method "setEnchantType" of null */
};
ItemRegistry.setArmorDamageable = function(id, val) {
	/* TypeError: Cannot call method "setArmorDamageable" of null */
};
ItemRegistry.addRepairItemIds = function(id, items) {
	return null;
};
ItemRegistry.setToolRender = function(id, enabled) {
	/* TypeError: Cannot call method "setHandEquipped" of null */
};
ItemRegistry.setMaxDamage = function(id, maxdamage) {
	/* TypeError: Cannot call method "setMaxDamage" of null */
};
ItemRegistry.setGlint = function(id, enabled) {
	/* TypeError: Cannot call method "setGlint" of null */
};
ItemRegistry.setLiquidClip = function(id, enabled) {
	/* TypeError: Cannot call method "setLiquidClip" of null */
};
ItemRegistry.setStackedByData = function(id, enabled) {
	/* TypeError: Cannot call method "setStackedByData" of null */
};
ItemRegistry.setAllowedInOffhand = function(id, allowed) {
	/* TypeError: Cannot call method "setAllowedInOffhand" of null */
};
ItemRegistry.setProperties = function(id, props) {
	/* TypeError: Cannot call method "setProperties" of null */
};
ItemRegistry.setUseAnimation = function(id, animType) {
	/* TypeError: Cannot call method "setUseAnimation" of null */
};
ItemRegistry.setMaxUseDuration = function(id, duration) {
	/* TypeError: Cannot call method "setMaxUseDuration" of null */
};
ItemRegistry.registerUseFunctionForID = function(numericID, useFunc) {
	return true;
};
ItemRegistry.registerUseFunction = function(namedID, useFunc) {
	return false;
};
ItemRegistry.onItemUsed = function(coords, item, block, player) {
	return null;
};
ItemRegistry.registerThrowableFunctionForID = function(numericID, useFunc) {
	return true;
};
ItemRegistry.registerThrowableFunction = function(namedID, useFunc) {
	return false;
};
ItemRegistry.onProjectileHit = function(projectile, item, target) {
	return null;
};
ItemRegistry.iconOverrideFunctions = {};
ItemRegistry.registerIconOverrideFunction = function(namedID, func) {
	return false;
};
ItemRegistry.onIconOverride = function(item, isModUi) {
	return null;
};
ItemRegistry.nameOverrideFunctions = {};
ItemRegistry.setItemNameOverrideCallbackForced = function() {};
ItemRegistry.registerNameOverrideFunction = function(namedID, func, preventForcing) {
	return false;
};
ItemRegistry.onNameOverride = function(item, name, translation) {
	return null;
};
ItemRegistry.noTargetUseFunctions = {};
ItemRegistry.registerNoTargetUseFunction = function(namedID, func) {
	return false;
};
ItemRegistry.onUseNoTarget = function(item, player) {
	return null;
};
ItemRegistry.usingReleasedFunctions = {};
ItemRegistry.registerUsingReleasedFunction = function(namedID, func) {
	return false;
};
ItemRegistry.onUsingReleased = function(item, ticks, player) {
	return null;
};
ItemRegistry.usingCompleteFunctions = {};
ItemRegistry.registerUsingCompleteFunction = function(namedID, func) {
	return false;
};
ItemRegistry.onUsingComplete = function(item, player) {
	return null;
};
ItemRegistry.dispenseFunctions = {};
ItemRegistry.registerDispenseFunction = function(namedID, func) {
	return false;
};
ItemRegistry.onDispense = function(coords, item, region, slot) {
	return null;
};
ItemRegistry.TYPE_BASE = "createItem";
ItemRegistry.TYPE_FOOD = "createFoodItem";
ItemRegistry.TYPE_ARMOR = "createArmorItem";
ItemRegistry.TYPE_THROWABLE = "createThrowableItem";
ItemRegistry.setPrototype = function(namedID, Prototype) {
	return null;
};
ItemRegistry.invokeItemUseOn = function(coords, item, noModCallback, entity) {
	return null;
};
ItemRegistry.invokeItemUseNoTarget = function(item, noModCallback) {};
ItemRegistry.__func = null;

var ITEM_BASE_PROTOTYPE = {};
ITEM_BASE_PROTOTYPE.__validItemTypes = {};
ITEM_BASE_PROTOTYPE.__validItemTypes.createItem = true;
ITEM_BASE_PROTOTYPE.__validItemTypes.createFoodItem = true;
ITEM_BASE_PROTOTYPE.__validItemTypes.createArmorItem = true;
ITEM_BASE_PROTOTYPE.__validItemTypes.createThrowableItem = true;
ITEM_BASE_PROTOTYPE.__define = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.__describe = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.init = function() {
	return null;
};
ITEM_BASE_PROTOTYPE.getName = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getTexture = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getDefineParams = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getMaxDamage = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getCategory = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getEnchant = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getUseAnimation = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getMaxUseDuration = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getProperties = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.isToolRender = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.isStackedByData = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.isEnchanted = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.getToolMaterial = function() {
	return null;
};
ITEM_BASE_PROTOTYPE.getToolTarget = function() {
	return null;
};
ITEM_BASE_PROTOTYPE.getToolPrototype = function() {
	return null;
};
ITEM_BASE_PROTOTYPE.getArmorFuncs = function() {
	return null;
};
ITEM_BASE_PROTOTYPE.onUsed = function(coords, item, block) {
	return null;
};
ITEM_BASE_PROTOTYPE.onTick = function(item) {
	return null;
};
ITEM_BASE_PROTOTYPE.onThrowableImpact = function(projectile, item, target) {
	return null;
};
