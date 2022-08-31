var WorldAPI = {};
WorldAPI.isLoaded = true;
WorldAPI.setLoaded = function(isLoaded) {};
WorldAPI.isWorldLoaded = function() {};
WorldAPI.getThreadTime = function() {
	return 999;
};
WorldAPI.getRelativeCoords = function(x, y, z, side) {
	return null;
};
WorldAPI.getVectorByBlockSide = function(side) {};
WorldAPI.getInverseBlockSide = function(side) {
	return 1;
};
WorldAPI.canTileBeReplaced = function(id, data) {};
WorldAPI.doesVanillaTileHasUI = function(id) {};
WorldAPI.setBlockUpdateType = function() {};
WorldAPI.setBlockUpdateAllowed = function() {};
WorldAPI.setBlockChangeCallbackEnabled = function(id, enabled) {};
WorldAPI.blockChangeCallbacks = [];
WorldAPI.registerBlockChangeCallback = function(ids, callback) {};
WorldAPI.onBlockChanged = function(coords, block1, block2, region, int1, int2) {
	/* TypeError: Cannot read property "id" from null */
};
WorldAPI.addGenerationCallback = function(targetCallback, callback, uniqueHashStr) {};
WorldAPI.__inworld = {};
WorldAPI.__inworld.nativeSetBlock = function(x, y, z, id, data) {};
WorldAPI.__inworld.nativeGetBlockID = function(x, y, z) {
	return 1;
};
WorldAPI.__inworld.nativeGetBlockData = function(x, y, z) {};
WorldAPI.__inworld.setBlock = function() {};
WorldAPI.__inworld.setFullBlock = function(x, y, z, fullTile) {};
WorldAPI.__inworld.getBlock = function(x, y, z) {
	return null;
};
WorldAPI.__inworld.getBlockID = function() {};
WorldAPI.__inworld.getBlockData = function() {};
WorldAPI.__inworld.destroyBlock = function(x, y, z, drop, player) {};
WorldAPI.__inworld.getLightLevel = function() {};
WorldAPI.__inworld.isChunkLoaded = function(x, z) {
	return true;
};
WorldAPI.__inworld.isChunkLoadedAt = function(x, y, z) {
	return true;
};
WorldAPI.__inworld.getChunkState = function(x, z) {
	return 9;
};
WorldAPI.__inworld.getChunkStateAt = function(x, y, z) {
	return 9;
};
WorldAPI.__inworld.getTileEntity = function(x, y, z, blockSource) {
	return null;
};
WorldAPI.__inworld.addTileEntity = function(x, y, z, blockSource) {
	return null;
};
WorldAPI.__inworld.removeTileEntity = function(x, y, z, blockSource) {};
WorldAPI.__inworld.getContainer = function(x, y, z, blockSource) {
	return null;
};
WorldAPI.__inworld.getWorldTime = function() {};
WorldAPI.__inworld.setWorldTime = function(time) {};
WorldAPI.__inworld.setDayMode = function(day) {};
WorldAPI.__inworld.setNightMode = function(night) {};
WorldAPI.__inworld.getWeather = function() {
	return null;
};
WorldAPI.__inworld.setWeather = function(weather) {};
WorldAPI.__inworld.clip = function(x1, y1, z1, x2, y2, z2, mode) {
	return null;
};
WorldAPI.__inworld.drop = function() {};
WorldAPI.__inworld.explode = function(x, y, z, power, someBoolean) {};
WorldAPI.__inworld.setBiomeMap = function(x, z, biome) {};
WorldAPI.__inworld.getBiomeMap = function(x, z) {};
WorldAPI.__inworld.setBiome = function(x, z, biome) {};
WorldAPI.__inworld.getBiome = function(x, z) {};
WorldAPI.__inworld.getBiomeName = function(x, z) {
	return "ocean";
};
WorldAPI.__inworld.getBiomeNameById = function(biome) {
	return "ocean";
};
WorldAPI.__inworld.getTemperature = function() {};
WorldAPI.__inworld.getGrassColor = function(x, z) {
	return -8421505;
};
WorldAPI.__inworld.setGrassColor = function(x, z, color) {};
WorldAPI.__inworld.getGrassColorRGB = function(x, z) {
	return null;
};
WorldAPI.__inworld.setGrassColorRGB = function(x, z, rgb) {};
WorldAPI.__inworld.canSeeSky = function(x, y, z) {
	return true;
};
WorldAPI.__inworld.playSound = function(x, y, z, name, volume, pitch) {};
WorldAPI.__inworld.playSoundAtEntity = function(entity, name, volume, pitch) {};
WorldAPI.__inworld.getWorldDir = function() {
	return "dhUNY9W4AgA=";
};
WorldAPI.__inworld.getSeed = function() {};
WorldAPI.__inmenu = {};
WorldAPI.__inmenu.nativeSetBlock = function() {};
WorldAPI.__inmenu.nativeGetBlockID = function() {};
WorldAPI.__inmenu.nativeGetBlockData = function(x, y, z) {};
WorldAPI.__inmenu.setBlock = function(x, y, z, id, data) {};
WorldAPI.__inmenu.setFullBlock = function(x, y, z, fullTile) {};
WorldAPI.__inmenu.getBlock = function(x, y, z) {
	return null;
};
WorldAPI.__inmenu.getBlockID = function(x, y, z) {};
WorldAPI.__inmenu.getBlockData = function(x, y, z) {};
WorldAPI.__inmenu.destroyBlock = function(x, y, z, drop) {};
WorldAPI.__inmenu.getLightLevel = function(x, y, z) {};
WorldAPI.__inmenu.isChunkLoaded = function(x, z) {};
WorldAPI.__inmenu.isChunkLoadedAt = function(x, y, z) {};
WorldAPI.__inmenu.getTileEntity = function(x, y, z) {
	return null;
};
WorldAPI.__inmenu.addTileEntity = function(x, y, z) {
	return null;
};
WorldAPI.__inmenu.removeTileEntity = function(x, y, z) {};
WorldAPI.__inmenu.getContainer = function(x, y, z) {
	return null;
};
WorldAPI.__inmenu.getWorldTime = function() {};
WorldAPI.__inmenu.setWorldTime = function(time) {};
WorldAPI.__inmenu.setDayMode = function(day) {};
WorldAPI.__inmenu.setNightMode = function(night) {};
WorldAPI.__inmenu.getWeather = function() {
	return null;
};
WorldAPI.__inmenu.setWeather = function(weather) {};
WorldAPI.__inmenu.drop = function(x, y, z, id, count, data, extra) {
	return null;
};
WorldAPI.__inmenu.explode = function(x, y, z, power, someBoolean) {};
WorldAPI.__inmenu.getBiome = function(x, z) {
	return -1;
};
WorldAPI.__inmenu.getBiomeName = function(x, z) {
	return "error: level not loaded";
};
WorldAPI.__inmenu.getGrassColor = function(x, z) {};
WorldAPI.__inmenu.setGrassColor = function(x, z, color) {};
WorldAPI.__inmenu.getGrassColorRGB = function(x, z) {
	return null;
};
WorldAPI.__inmenu.setGrassColorRGB = function(x, z, rgb) {};
WorldAPI.__inmenu.canSeeSky = function(x, y, z) {};
WorldAPI.__inmenu.playSound = function(x, y, z, name, volume, pitch) {};
WorldAPI.__inmenu.playSoundAtEntity = function(entity, name, volume, pitch) {};
WorldAPI.nativeSetBlock = function() {};
WorldAPI.nativeGetBlockID = function() {};
WorldAPI.nativeGetBlockData = function(x, y, z) {};
WorldAPI.setBlock = function(x, y, z, id, data) {};
WorldAPI.setFullBlock = function(x, y, z, fullTile) {};
WorldAPI.getBlock = function(x, y, z) {
	return null;
};
WorldAPI.getBlockID = function(x, y, z) {};
WorldAPI.getBlockData = function(x, y, z) {};
WorldAPI.destroyBlock = function(x, y, z, drop) {};
WorldAPI.getLightLevel = function(x, y, z) {};
WorldAPI.isChunkLoaded = function(x, z) {};
WorldAPI.isChunkLoadedAt = function(x, y, z) {};
WorldAPI.getTileEntity = function(x, y, z) {
	return null;
};
WorldAPI.addTileEntity = function(x, y, z) {
	return null;
};
WorldAPI.removeTileEntity = function(x, y, z) {};
WorldAPI.getContainer = function(x, y, z) {
	return null;
};
WorldAPI.getWorldTime = function() {};
WorldAPI.setWorldTime = function(time) {};
WorldAPI.setDayMode = function(day) {};
WorldAPI.setNightMode = function(night) {};
WorldAPI.getWeather = function() {
	return null;
};
WorldAPI.setWeather = function(weather) {};
WorldAPI.drop = function(x, y, z, id, count, data, extra) {
	return null;
};
WorldAPI.explode = function(x, y, z, power, someBoolean) {};
WorldAPI.getBiome = function(x, z) {
	return -1;
};
WorldAPI.getBiomeName = function(x, z) {
	return "error: level not loaded";
};
WorldAPI.getGrassColor = function(x, z) {};
WorldAPI.setGrassColor = function(x, z, color) {};
WorldAPI.getGrassColorRGB = function(x, z) {
	return null;
};
WorldAPI.setGrassColorRGB = function(x, z, rgb) {};
WorldAPI.canSeeSky = function(x, y, z) {};
WorldAPI.playSound = function(x, y, z, name, volume, pitch) {};
WorldAPI.playSoundAtEntity = function(entity, name, volume, pitch) {};
WorldAPI.getChunkState = function(x, z) {
	return 9;
};
WorldAPI.getChunkStateAt = function(x, y, z) {
	return 9;
};
WorldAPI.clip = function(x1, y1, z1, x2, y2, z2, mode) {
	return null;
};
WorldAPI.setBiomeMap = function(x, z, biome) {};
WorldAPI.getBiomeMap = function(x, z) {};
WorldAPI.setBiome = function(x, z, biome) {};
WorldAPI.getBiomeNameById = function(biome) {
	return "ocean";
};
WorldAPI.getTemperature = function() {};
WorldAPI.getWorldDir = function() {
	return "dhUNY9W4AgA=";
};
WorldAPI.getSeed = function() {};
