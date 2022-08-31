var EntitySpawnRegistry = {};
EntitySpawnRegistry.spawnData = [];
EntitySpawnRegistry.registerSpawn = function(entityType, rarity, condition, denyNaturalDespawn) {
	return null;
};
EntitySpawnRegistry.getRandomSpawn = function(rarityMultiplier) {
	return null;
};
EntitySpawnRegistry.getRandPosition = function() {
	return {
		x: 30.478764620339074,
		z: 29.89585627376611
	};
};
EntitySpawnRegistry.executeSpawn = function(spawn, position) {
	/* TypeError: Cannot read property "condition" from undefined */
};
EntitySpawnRegistry.counter = 1000;
EntitySpawnRegistry.tick = function() {
	return null;
};
EntitySpawnRegistry.onChunkGenerated = function(x, z) {
	return null;
};

var ENTITY_MAX_SPAWN_DIS = 63;
var ENTITY_MIN_SPAWN_DIS = 32;
