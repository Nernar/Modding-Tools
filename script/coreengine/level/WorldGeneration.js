var WorldGeneration = {};
WorldGeneration.generatorUpdatable = {};
WorldGeneration.generatorUpdatable.age = 0;
WorldGeneration.generatorUpdatable.delay = 3;
WorldGeneration.generatorUpdatable.surface_radius = 3;
WorldGeneration.generatorUpdatable.underground_radius = 1;
WorldGeneration.generatorUpdatable.thread_optimization = false;
WorldGeneration.generatorUpdatable.generation_priority = 0;
WorldGeneration.generatorUpdatable.ticking_priority = 0;
WorldGeneration.generatorUpdatable.debug = false;
WorldGeneration.generatorUpdatable.debug_max_time = 0;
WorldGeneration.generatorUpdatable.update = function() {
	return null;
};
WorldGeneration.checkTile = function(x, z) {
	return false;
};
WorldGeneration.execGeneration = function(chunk, dimension, underground) {
	/* TypeError: Cannot read property "x" from undefined */
};
WorldGeneration.processChunk = function(chunk, origin, dimension) {
	/* TypeError: Cannot read property "x" from undefined */
};
WorldGeneration.resetEngine = function() {
	return null;
};
