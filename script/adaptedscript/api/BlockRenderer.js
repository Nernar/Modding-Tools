var BlockRenderer = {};
BlockRenderer.addRenderCallback = function(number, func) {};
BlockRenderer.createModel = function() {
	return {
    	addBlock: function(id, optData, optBool) {},
    	addBox: function(x1, y1, z1, x2, y2, z2, texturesOrIdOrTexture1, optDataOrMeta1, optTexture2, optMeta2, optTexture3, optMeta3, optTexture4, optMeta4, optTexture5, optMeta5, optTexture6, optMeta6) {},
    	addMesh: function(renderMesh) {},
    	buildGuiModel: function(bool) {},
    	clear: function() {}
	};
};
BlockRenderer.createTexturedBlock = function(textures) {
	return BlockRenderer.createModel();
};
BlockRenderer.createTexturedBox = function(x1, y1, z1, x2, y2, z2, textures) {
	return BlockRenderer.createModel();
};
BlockRenderer.disableCustomRender = function(id, obj) {};
BlockRenderer.enableCoordMapping = function(id, obj1, obj2) {};
BlockRenderer.enableCustomRender = function(id, obj) {};
BlockRenderer.forceRenderRebuild = function(x, y, z, mode) {};
BlockRenderer.mapAtCoords = function(x, y, z, obj, bool) {};
BlockRenderer.mapCollisionAndRaycastModelAtCoords = function(x, y, z, mode, obj) {};
BlockRenderer.mapCollisionModelAtCoords = function(x, y, z, mode, obj) {};
BlockRenderer.mapRaycastModelAtCoords = function(x, y, z, mode, obj) {};
BlockRenderer.setCustomCollisionAndRaycastShape = function(id, obj1, obj2) {};
BlockRenderer.setCustomCollisionShape = function(id, obj1, obj2) {};
BlockRenderer.setCustomRaycastShape = function(id, obj1, obj2) {};
BlockRenderer.setStaticICRender = function(id, obj1, obj2) {};
BlockRenderer.unmapAtCoords = function(x, y, z, bool) {};
BlockRenderer.unmapCollisionAndRaycastModelAtCoords = function(x, y, z, mode) {};
BlockRenderer.unmapCollisionModelAtCoords = function(x, y, z, mode) {};
BlockRenderer.unmapRaycastModelAtCoords = function(x, y, z, mode) {};
