var UI = {};
UI.getContext = function() {};
UI.getScreenHeight = function() {};
UI.getScreenRelativeHeight = function() {};
UI.TextureSource = {};
UI.TextureSource.get = function(str) {};
UI.TextureSource.getNullable = function(str) {};
UI.TextureSource.put = function(str, what) {};
UI.FrameTextureSource = {};
UI.FrameTextureSource.get = function(str) {
	return {
    	draw: function(canvas, rectF, float, number, sides) {},
    	expand: function(x, y, mode, optSides) {},
    	expandAndScale: function(float1, float2, float3, number, optSides) {},
    	expandSide: function(x, y) {},
    	getCentralColor: function() {},
    	getSideSource: function(number) {},
    	getSource: function() {}
	};
};
