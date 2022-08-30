var ItemModel = {};
ItemModel.getAllModels = function() {};
ItemModel.getEmptyMeshFromPool = function() {
	return {
    	addMesh: function(renderMesh, optFloat1, optFloat2, optFloat3, optFloat4, optFloat5, optFloat6) {},
    	addVertex: function(x, y, z, u, v) {},
    	clear: function() {},
    	clone: function() {},
    	clone: function() {},
    	fitIn: function(x1, y1, z1, x2, y2, z2, optBool) {},
    	getPtr: function() {},
    	getReadOnlyVertexData: function() {},
    	importFromFile: function(path, type, params) {},
    	invalidate: function() {},
    	newGuiRenderMesh: function() {},
    	rebuild: function() {},
    	resetColor: function() {},
    	resetTexture: function() {},
    	rotate: function(float1, float2, float3, optFloat4, optFloat5, optFloat6) {},
    	scale: function(x, y, z) {},
    	setBlockTexture: function(texture, meta) {},
    	setColor: function(float1, float2, float3, optFloat4) {},
    	setFoliageTinted: function(optNumber) {},
    	setGrassTinted: function() {},
    	setLightDir: function(x, y, z) {},
    	setLightIgnore: function(bool1, bool2) {},
    	setLightParams: function(float1, float2, float3) {},
    	setLightPos: function(x, y, z) {},
    	setNoTint: function() {},
    	setNormal: function(float1, float2, float3) {},
    	setWaterTinted: function() {},
    	translate: function(x, y, z) {}
	};
};
ItemModel.getFor = function(id, data) {
	return ItemModel.newStandalone();
};
ItemModel.getForWithFallback = function(id, data) {
	return ItemModel.newStandalone();
};
ItemModel.getItemMeshTextureFor = function(id, data) {};
ItemModel.getItemRenderMeshFor = function(int1, int2, int3, bool) {
	return ItemModel.getEmptyMeshFromPool();
};
ItemModel.newStandalone = function() {
	return {
    	addToMesh: function(renderMesh, x, y, z) {},
    	getCacheKey: function() {},
    	getGuiBlockModel: function() {},
    	getGuiRenderMesh: function() {},
    	getIconBitmap: function() {},
    	getIconBitmapNoReload: function() {},
    	getItemRenderMesh: function(id, bool) {},
    	getMeshTextureName: function() {},
    	getModelForItemInstance: function(int1, int2, int3, itemInstanceExtra) {},
    	getShaderUniforms: function() {},
    	getSpriteMesh: function() {},
    	getUiGlintMaterialName: function() {},
    	getUiMaterialName: function() {},
    	getUiTextureName: function() {},
    	getWorldBlockModel: function() {},
    	getWorldGlintMaterialName: function() {},
    	getWorldMaterialName: function() {},
    	getWorldTextureName: function() {},
    	isEmpty: function() {},
    	isEmptyInUi: function() {},
    	isEmptyInWorld: function() {},
    	isNonExisting: function() {},
    	isSpriteInUi: function() {},
    	isSpriteInWorld: function() {},
    	isUsingOverrideCallback: function() {},
    	occupy: function() {},
    	overridesHand: function() {},
    	overridesUi: function() {},
    	queueReload: function(optIconRebuildListener) {},
    	releaseIcon: function() {},
    	reloadIcon: function(optBool) {},
    	reloadIconIfDirty: function() {},
    	removeModUiSpriteTexture: function() {},
    	setCacheGroup: function(str) {},
    	setCacheKey: function(str) {},
    	setGlintMaterial: function(str) {},
    	setHandGlintMaterial: function(str) {},
    	setHandMaterial: function(str) {},
    	setHandModel: function(blockModelOrMesh, optStr1, optStr2) {},
    	setHandTexture: function(str) {},
    	setItemTexture: function(str, number) {},
    	setItemTexturePath: function(str) {},
    	setMaterial: function(str) {},
    	setModUiSpriteBitmap: function(bitmap) {},
    	setModUiSpriteName: function(str, number) {},
    	setModUiSpritePath: function(str) {},
    	setModel: function(blockModelOrMesh, optStr1, optStr2) {},
    	setModelOverrideCallback: function(overrideCallback) {},
    	setSpriteUiRender: function(bool) {},
    	setTexture: function(str) {},
    	setUiBlockModel: function(guiBlockModel) {},
    	setUiGlintMaterial: function(str) {},
    	setUiMaterial: function(str) {},
    	setUiModel: function(blockModelOrMesh, optStr1, optStr2) {},
    	setUiTexture: function(str) {},
    	setWorldBlockModel: function(guiBlockModel) {},
    	updateCacheGroupToCurrent: function() {},
    	updateForBlockVariant: function(blockVariant) {}
	};
};
ItemModel.releaseMesh = function(obj) {};
ItemModel.setCurrentCacheGroup = function(str1, str2) {};
ItemModel.tryReleaseModelBitmapsOnLowMemory = function(number) {};
