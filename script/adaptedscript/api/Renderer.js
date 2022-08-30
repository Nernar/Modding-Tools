var Renderer = {};
Renderer.createHumanoidRenderer = function(double) {
	return Renderer.getRendererById(0);
};
Renderer.createItemSpriteRenderer = function(id) {
	return Renderer.getRendererById(0);
};
Renderer.createRendererWithSkin = function(str, double) {
	return Renderer.getRendererById(0);
};
Renderer.getItemModel = function(int1, int2, int3, double1, double2, double3, double3, bool) {
	return Renderer.getRendererById(0);
};
Renderer.getRendererById = function(id) {
	return {
    	addFinalizeCallback: function(finalizeCallback) {},
    	getModel: function() {},
    	getPointer: function() {},
    	getRenderType: function() {},
    	getScale: function() {},
    	release: function() {},
    	setFinalizeable: function(bool) {},
    	setScale: function(scale) {},
    	setSkin: function(str) {}
	};
};
