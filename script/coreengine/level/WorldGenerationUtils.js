var WorldGenerationUtils = {};
WorldGenerationUtils.isTerrainBlock = function(id) {
	return true;
};
WorldGenerationUtils.isTransparentBlock = function(id) {
	return false;
};
WorldGenerationUtils.canSeeSky = function(x, y, z) {
	return false;
};
WorldGenerationUtils.randomXZ = function(cx, cz) {
	return {
		x: 1,
		z: 13
	};
};
WorldGenerationUtils.randomCoords = function(cx, cz, lowest, highest) {
	return {
		x: 4,
		z: 12,
		y: 21
	};
};
WorldGenerationUtils.findSurface = function(x, y, z) {
	return {
		x: 0,
		y: -1,
		z: 0
	};
};
WorldGenerationUtils.findHighSurface = function(x, z) {
	return {
		x: 0,
		y: 3,
		z: 0
	};
};
WorldGenerationUtils.findLowSurface = function(x, z) {
	return {
		x: 0,
		y: 3,
		z: 0
	};
};
WorldGenerationUtils.__lockedReal = {};
WorldGenerationUtils.__lockedReal.id = 0;
WorldGenerationUtils.__lockedReal.data = 0;
WorldGenerationUtils.lockInBlock = function(id, data, checkerTile, checkerMode) {
	return null;
};
WorldGenerationUtils.setLockedBlock = function(x, y, z) {
	return null;
};
WorldGenerationUtils.genMinable = function(x, y, z, params) {
	return null;
};
WorldGenerationUtils.generateOre = function(x, y, z, id, data, amount, noStoneCheck) {
	return null;
};
WorldGenerationUtils.generateOreCustom = function(x, y, z, id, data, amount, whitelist, blocks) {
	return null;
};
WorldGenerationUtils.getPerlinNoise = function() {};
