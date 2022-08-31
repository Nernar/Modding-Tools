var WorldAPI = {};
WorldAPI.isLoaded = true;
WorldAPI.setLoaded = function(isLoaded) {
	return null;
};
WorldAPI.isWorldLoaded = function() {
	return true;
};
WorldAPI.getThreadTime = function() {
	return 999;
};
WorldAPI.getRelativeCoords = function(x, y, z, side) {
	return {
		x: 0,
		y: 0,
		z: 0
	};
};
WorldAPI.getVectorByBlockSide = function(side) {
	return null;
};
WorldAPI.getInverseBlockSide = function(side) {
	return 1;
};
WorldAPI.canTileBeReplaced = function(id, data) {
	return false;
};
WorldAPI.doesVanillaTileHasUI = function(id) {
	return null;
};
WorldAPI.setBlockUpdateType = function() {};
WorldAPI.setBlockUpdateAllowed = function() {};
WorldAPI.setBlockChangeCallbackEnabled = function(id, enabled) {
	return null;
};
WorldAPI.blockChangeCallbacks = [];
WorldAPI.registerBlockChangeCallback = function(ids, callback) {
	return null;
};
WorldAPI.onBlockChanged = function(coords, block1, block2, region, int1, int2) {
	/* TypeError: Cannot read property "id" from null */
};
WorldAPI.addGenerationCallback = function(targetCallback, callback, uniqueHashStr) {
	return null;
};
WorldAPI.__inworld = {};
WorldAPI.__inworld.nativeSetBlock = function(x, y, z, id, data) {
	return null;
};
WorldAPI.__inworld.nativeGetBlockID = function(x, y, z) {
	return 1;
};
WorldAPI.__inworld.nativeGetBlockData = function(x, y, z) {
	return 0;
};
WorldAPI.__inworld.setBlock = function() {};
WorldAPI.__inworld.setFullBlock = function(x, y, z, fullTile) {
	return null;
};
WorldAPI.__inworld.getBlock = function(x, y, z) {
	return {
		id: 0,
		data: 0
	};
};
WorldAPI.__inworld.getBlockID = function() {};
WorldAPI.__inworld.getBlockData = function() {};
WorldAPI.__inworld.destroyBlock = function(x, y, z, drop, player) {
	return null;
};
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
WorldAPI.__inworld.removeTileEntity = function(x, y, z, blockSource) {
	return false;
};
WorldAPI.__inworld.getContainer = function(x, y, z, blockSource) {
	return null;
};
WorldAPI.__inworld.getWorldTime = function() {};
WorldAPI.__inworld.setWorldTime = function(time) {
	return null;
};
WorldAPI.__inworld.setDayMode = function(day) {
	return null;
};
WorldAPI.__inworld.setNightMode = function(night) {
	return null;
};
WorldAPI.__inworld.getWeather = function() {
	return {
		rain: 0,
		thunder: 0
	};
};
WorldAPI.__inworld.setWeather = function(weather) {
	return null;
};
WorldAPI.__inworld.clip = function(x1, y1, z1, x2, y2, z2, mode) {
	return {
		entity: -1,
		side: 0,
		collision: false,
		pos: {
			x: 4,
			y: 32,
			z: 4
		},
		pos_limit: {
			x: 4,
			y: 32,
			z: 4
		},
		normal: {
			x: 0,
			y: -1,
			z: 0
		}
	};
};
WorldAPI.__inworld.drop = function() {};
WorldAPI.__inworld.explode = function(x, y, z, power, someBoolean) {
	return null;
};
WorldAPI.__inworld.setBiomeMap = function(x, z, biome) {
	return null;
};
WorldAPI.__inworld.getBiomeMap = function(x, z) {
	return 0;
};
WorldAPI.__inworld.setBiome = function(x, z, biome) {
	return null;
};
WorldAPI.__inworld.getBiome = function(x, z) {
	return 0;
};
WorldAPI.__inworld.getBiomeName = function(x, z) {
	return "ocean";
};
WorldAPI.__inworld.getBiomeNameById = function(biome) {
	return "ocean";
};
WorldAPI.__inworld.getTemperature = function() {};
WorldAPI.__inworld.getGrassColor = function(x, z) {
	return -5614988;
};
WorldAPI.__inworld.setGrassColor = function(x, z, color) {
	return null;
};
WorldAPI.__inworld.getGrassColorRGB = function(x, z) {
	return {
		r: 255,
		g: 255,
		b: 255
	};
};
WorldAPI.__inworld.setGrassColorRGB = function(x, z, rgb) {
	return null;
};
WorldAPI.__inworld.canSeeSky = function(x, y, z) {
	return false;
};
WorldAPI.__inworld.playSound = function(x, y, z, name, volume, pitch) {
	return null;
};
WorldAPI.__inworld.playSoundAtEntity = function(entity, name, volume, pitch) {
	return null;
};
WorldAPI.__inworld.getWorldDir = function() {
	return "UKYOYwgsAgA=";
};
WorldAPI.__inworld.getSeed = function() {};
WorldAPI.__inmenu = {};
WorldAPI.__inmenu.nativeSetBlock = function() {
	return null;
};
WorldAPI.__inmenu.nativeGetBlockID = function() {
	return 0;
};
WorldAPI.__inmenu.nativeGetBlockData = function(x, y, z) {
	return 0;
};
WorldAPI.__inmenu.setBlock = function(x, y, z, id, data) {
	return null;
};
WorldAPI.__inmenu.setFullBlock = function(x, y, z, fullTile) {
	return null;
};
WorldAPI.__inmenu.getBlock = function(x, y, z) {
	return {
		id: 0,
		data: 0
	};
};
WorldAPI.__inmenu.getBlockID = function(x, y, z) {
	return 0;
};
WorldAPI.__inmenu.getBlockData = function(x, y, z) {
	return 0;
};
WorldAPI.__inmenu.destroyBlock = function(x, y, z, drop) {
	return null;
};
WorldAPI.__inmenu.getLightLevel = function(x, y, z) {
	return 0;
};
WorldAPI.__inmenu.isChunkLoaded = function(x, z) {
	return false;
};
WorldAPI.__inmenu.isChunkLoadedAt = function(x, y, z) {
	return false;
};
WorldAPI.__inmenu.getTileEntity = function(x, y, z) {
	return null;
};
WorldAPI.__inmenu.addTileEntity = function(x, y, z) {
	return null;
};
WorldAPI.__inmenu.removeTileEntity = function(x, y, z) {
	return false;
};
WorldAPI.__inmenu.getContainer = function(x, y, z) {
	return null;
};
WorldAPI.__inmenu.getWorldTime = function() {
	return 0;
};
WorldAPI.__inmenu.setWorldTime = function(time) {
	return null;
};
WorldAPI.__inmenu.setDayMode = function(day) {
	return null;
};
WorldAPI.__inmenu.setNightMode = function(night) {
	return null;
};
WorldAPI.__inmenu.getWeather = function() {
	return {
		rain: 0,
		thunder: 0
	};
};
WorldAPI.__inmenu.setWeather = function(weather) {
	return null;
};
WorldAPI.__inmenu.drop = function(x, y, z, id, count, data, extra) {
	return null;
};
WorldAPI.__inmenu.explode = function(x, y, z, power, someBoolean) {
	return null;
};
WorldAPI.__inmenu.getBiome = function(x, z) {
	return -1;
};
WorldAPI.__inmenu.getBiomeName = function(x, z) {
	return "error: level not loaded";
};
WorldAPI.__inmenu.getGrassColor = function(x, z) {
	return 0;
};
WorldAPI.__inmenu.setGrassColor = function(x, z, color) {
	return null;
};
WorldAPI.__inmenu.getGrassColorRGB = function(x, z) {
	return {
		r: 0,
		g: 0,
		b: 0
	};
};
WorldAPI.__inmenu.setGrassColorRGB = function(x, z, rgb) {
	return null;
};
WorldAPI.__inmenu.canSeeSky = function(x, y, z) {
	return false;
};
WorldAPI.__inmenu.playSound = function(x, y, z, name, volume, pitch) {
	return null;
};
WorldAPI.__inmenu.playSoundAtEntity = function(entity, name, volume, pitch) {
	return null;
};
WorldAPI.nativeSetBlock = function(x, y, z, id, data) {
	return null;
};
WorldAPI.nativeGetBlockID = function(x, y, z) {
	return 1;
};
WorldAPI.nativeGetBlockData = function(x, y, z) {
	return 0;
};
WorldAPI.setBlock = function() {};
WorldAPI.setFullBlock = function(x, y, z, fullTile) {
	return null;
};
WorldAPI.getBlock = function(x, y, z) {
	return {
		id: 0,
		data: 0
	};
};
WorldAPI.getBlockID = function() {};
WorldAPI.getBlockData = function() {};
WorldAPI.destroyBlock = function(x, y, z, drop, player) {
	return null;
};
WorldAPI.getLightLevel = function() {};
WorldAPI.isChunkLoaded = function(x, z) {
	return true;
};
WorldAPI.isChunkLoadedAt = function(x, y, z) {
	return true;
};
WorldAPI.getTileEntity = function(x, y, z, blockSource) {
	return null;
};
WorldAPI.addTileEntity = function(x, y, z, blockSource) {
	return null;
};
WorldAPI.removeTileEntity = function(x, y, z, blockSource) {
	return false;
};
WorldAPI.getContainer = function(x, y, z, blockSource) {
	return null;
};
WorldAPI.getWorldTime = function() {};
WorldAPI.setWorldTime = function(time) {
	return null;
};
WorldAPI.setDayMode = function(day) {
	return null;
};
WorldAPI.setNightMode = function(night) {
	return null;
};
WorldAPI.getWeather = function() {
	return {
		rain: 0,
		thunder: 0
	};
};
WorldAPI.setWeather = function(weather) {
	return null;
};
WorldAPI.drop = function() {};
WorldAPI.explode = function(x, y, z, power, someBoolean) {
	return null;
};
WorldAPI.getBiome = function(x, z) {
	return 0;
};
WorldAPI.getBiomeName = function(x, z) {
	return "ocean";
};
WorldAPI.getGrassColor = function(x, z) {
	return -16777216;
};
WorldAPI.setGrassColor = function(x, z, color) {
	return null;
};
WorldAPI.getGrassColorRGB = function(x, z) {
	return {
		r: 255,
		g: 255,
		b: 255
	};
};
WorldAPI.setGrassColorRGB = function(x, z, rgb) {
	return null;
};
WorldAPI.canSeeSky = function(x, y, z) {
	return false;
};
WorldAPI.playSound = function(x, y, z, name, volume, pitch) {
	return null;
};
WorldAPI.playSoundAtEntity = function(entity, name, volume, pitch) {
	return null;
};
WorldAPI.getChunkState = function(x, z) {
	return 9;
};
WorldAPI.getChunkStateAt = function(x, y, z) {
	return 9;
};
WorldAPI.clip = function(x1, y1, z1, x2, y2, z2, mode) {
	return {
		entity: -1,
		side: 0,
		collision: false,
		pos: {
			x: 4,
			y: 32,
			z: 4
		},
		pos_limit: {
			x: 4,
			y: 32,
			z: 4
		},
		normal: {
			x: 0,
			y: -1,
			z: 0
		}
	};
};
WorldAPI.setBiomeMap = function(x, z, biome) {
	return null;
};
WorldAPI.getBiomeMap = function(x, z) {
	return 0;
};
WorldAPI.setBiome = function(x, z, biome) {
	return null;
};
WorldAPI.getBiomeNameById = function(biome) {
	return "ocean";
};
WorldAPI.getTemperature = function() {};
WorldAPI.getWorldDir = function() {
	return "UKYOYwgsAgA=";
};
WorldAPI.getSeed = function() {};
