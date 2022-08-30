var Level = {};
Level.addFarParticle = function(id, dx, dy, dz, vx, vy, vz, data) {};
Level.addParticle = function(id, dx, dy, dz, vx, vy, vz, data) {};
Level.biomeIdToName = function(id) {};
Level.clip = function(x1, y1, z1, x2, y2, z2, mode) {};
Level.destroyBlock = function(x, y, z, particlesEnabled) {};
Level.dropItem = function(dx, dy, dz, id, count, data, number, obj) {};
Level.explode = function(dx, dy, dz, double, bool) {};
Level.getBiome = function(x, z) {};
Level.getBiomeMap = function(x, z) {};
Level.getBrightness = function(x, y, z) {};
Level.getChunkState = function(x, z) {};
Level.getChunkStateAt = function(x, y, z) {};
Level.getData = function(x, y, z) {};
Level.getDifficulty = function() {};
Level.getGameMode = function() {};
Level.getGrassColor = function(x, z) {};
Level.getLightningLevel = function() {};
Level.getRainLevel = function() {};
Level.getSeed = function() {};
Level.getTemperature = function(x, y, z) {};
Level.getTile = function(x, y, z) {};
Level.getTileAndData = function(x, y, z) {};
Level.getTileEntity = function(x, y, z) {
	return {
    	getCompoundTag: function() {},
    	getSize: function() {},
    	getSlot: function(slot) {},
    	getType: function() {},
    	setCompoundTag: function(compound) {},
    	setSlot: function(slot, itemInstanceOrId, optCount, optData, optObj) {}
	};
};
Level.getTime = function() {};
Level.getWorldDir = function() {};
Level.getWorldName = function() {};
Level.isChunkLoaded = function(x, z) {};
Level.isChunkLoadedAt = function(x, y, z) {};
Level.playSound = function(dx, dy, dz, sound, pitch, value) {};
Level.playSoundEnt = function(who, sound, pitch, value) {};
Level.resetCloudColor = function() {};
Level.resetFogColor = function() {};
Level.resetFogDistance = function() {};
Level.resetSkyColor = function() {};
Level.resetSunsetColor = function() {};
Level.resetUnderwaterFogColor = function() {};
Level.resetUnderwaterFogDistance = function() {};
Level.setBiome = function(x, z, biome) {};
Level.setBiomeMap = function(x, z, biomeMap) {};
Level.setBlockChangeCallbackEnabled = function(id, bool) {};
Level.setCloudColor = function(r, g, b) {};
Level.setDifficulty = function(number) {};
Level.setFogColor = function(r, g, b) {};
Level.setFogDistance = function(double1, double2) {};
Level.setGameMode = function(number) {};
Level.setGrassColor = function(x, z, color) {};
Level.setLightningLevel = function(double) {};
Level.setNightMode = function(bool) {};
Level.setRainLevel = function(double) {};
Level.setRespawnCoords = function(x, y, z) {};
Level.setSkyColor = function(r, g, b) {};
Level.setSpawn = function(x, y, z) {};
Level.setSunsetColor = function(r, g, b) {};
Level.setTile = function(x, y, z, id, data) {};
Level.setTime = function(time) {};
Level.setUnderwaterFogColor = function(r, g, b) {};
Level.setUnderwaterFogDistance = function(double1, double2) {};
Level.spawnExpOrbs = function(dx, dy, dz, count) {};
Level.spawnMob = function(dx, dy, dz, type, str) {};
