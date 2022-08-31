var WorldGenerationUtils = {};
WorldGenerationUtils.isTerrainBlock = function(id) {
	return true;
};
WorldGenerationUtils.isTransparentBlock = function(id) {};
WorldGenerationUtils.canSeeSky = function(x, y, z) {
	return true;
};
WorldGenerationUtils.randomXZ = function(cx, cz) {
	return null;
};
WorldGenerationUtils.randomCoords = function(cx, cz, lowest, highest) {
	return null;
};
WorldGenerationUtils.findSurface = function(x, y, z) {
	return null;
};
WorldGenerationUtils.findHighSurface = function(x, z) {
	return null;
};
WorldGenerationUtils.findLowSurface = function(x, z) {
	return null;
};
WorldGenerationUtils.__lockedReal = {};
WorldGenerationUtils.__lockedReal.id = 0;
WorldGenerationUtils.__lockedReal.data = 0;
WorldGenerationUtils.lockInBlock = function(id, data, checkerTile, checkerMode) {};
WorldGenerationUtils.setLockedBlock = function(x, y, z) {};
WorldGenerationUtils.genMinable = function(x, y, z, params) {};
WorldGenerationUtils.generateOre = function(x, y, z, id, data, amount, noStoneCheck) {};
WorldGenerationUtils.generateOreCustom = function(x, y, z, id, data, amount, whitelist, blocks) {};
WorldGenerationUtils.getPerlinNoise = function() {};
