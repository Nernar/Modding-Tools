var StaticRenderer = {};
StaticRenderer.createStaticRenderer = function(type, dx, dy, dz) {
	return {
    	exists: function() {},
    	getShaderUniforms: function() {},
    	remove: function() {},
    	resetBlockLightPos: function() {},
    	setBlockLightPos: function(x, y, z) {},
    	setIgnoreBlocklight: function(bool) {},
    	setInterpolationEnabled: function(bool) {},
    	setMaterial: function(str) {},
    	setMesh: function(renderMesh) {},
    	setPos: function(x, y, z) {},
    	setRenderer: function(idOrRenderer) {},
    	setScale: function(scale) {},
    	setSkin: function(str) {}
	};
};
