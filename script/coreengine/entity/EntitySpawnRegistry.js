var EntitySpawnRegistry = {};
EntitySpawnRegistry.spawnData = [];
EntitySpawnRegistry.registerSpawn = function(entityType, rarity, condition, denyNaturalDespawn) {};
EntitySpawnRegistry.getRandomSpawn = function(rarityMultiplier) {};
EntitySpawnRegistry.getRandPosition = function() {
	return null;
};
EntitySpawnRegistry.executeSpawn = function(spawn, position) {
	/* TypeError: Cannot read property "condition" from undefined */
};
EntitySpawnRegistry.counter = 1000;
EntitySpawnRegistry.tick = function() {};
EntitySpawnRegistry.onChunkGenerated = function(x, z) {};

var ENTITY_MAX_SPAWN_DIS = 63;
var ENTITY_MIN_SPAWN_DIS = 32;
