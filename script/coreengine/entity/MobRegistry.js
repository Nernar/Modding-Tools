var MobRegistry = {};
MobRegistry.customEntities = {};
MobRegistry.loadedEntities = [];
MobRegistry.registerEntity = function(name) {
	return null;
};
MobRegistry.registerUpdatableAsEntity = function(updatable) {};
MobRegistry.spawnEntityAsPrototype = function(typeName, coords, extraData) {
	/* TypeError: Cannot read property "x" from undefined */
};
MobRegistry.getEntityUpdatable = function(entity) {
	return null;
};
MobRegistry.registerNativeEntity = function(entity) {};
MobRegistry.registerEntityRemove = function(entity) {};
MobRegistry.resetEngine = function() {};

function CustomEntity(nameId) {}
var ENTITY_UNLOAD_DISTANCE = 56;
var CustomEntityConfig = {};
CustomEntityConfig.unloaded_despawn_time_in_secs = 600;
CustomEntityConfig.despawn_unloaded_entities = true;
