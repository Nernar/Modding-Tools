var Dimensions = {};
Dimensions.getAllRegisteredCustomBiomes = function() {};
Dimensions.getDimensionById = function(id) {
	return {
    	getGenerator: function() {},
    	hasSkyLight: function() {},
    	resetCloudColor: function() {},
    	resetFogColor: function() {},
    	resetFogDistance: function() {},
    	resetSkyColor: function() {},
    	resetSusetColor: function() {},
    	setCloudColor: function(r, g, b) {},
    	setFogColor: function(r, g, b) {},
    	setFogDistance: function(float1, float2) {},
    	setGenerator: function(generator) {},
    	setHasSkyLight: function(bool) {},
    	setSkyColor: function(r, g, b) {},
    	setSunsetColor: function(r, g, b) {}
	};
};
Dimensions.getDimensionByName = function(str) {
	return Dimensions.getDimensionById(0);
};
Dimensions.isLimboId = function(number) {};
Dimensions.overrideGeneratorForVanillaDimension = function(number, obj) {};
Dimensions.transfer = function(who, number) {};
