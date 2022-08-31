var EntityRenderGlobalCache = {};
EntityRenderGlobalCache.globalCache = {};
EntityRenderGlobalCache.globalCache.test = {};
EntityRenderGlobalCache.globalCache.test.renderer = null;
EntityRenderGlobalCache.globalCache.test.renderId = null;
EntityRenderGlobalCache.globalCache.test.model = null;
EntityRenderGlobalCache.globalCache.test.parts = null;
EntityRenderGlobalCache.globalCache.test.isChangeable = null;
EntityRenderGlobalCache.saveRenderAPI = function(api, name, isLocal) {
	/* TypeError: Cannot find function toCache in object CoreEngine. */
};
EntityRenderGlobalCache.loadRenderAPI = function(api, name, isLocal) {
	/* TypeError: Cannot find function fromCache in object CoreEngine. */
};

var EntityVisualController = {};
EntityVisualController.modelWatchers = {};
EntityVisualController.modelWatcherStack = [];
EntityVisualController.getModels = function() {
	/* ReferenceError: "ce_default_entity_model" is not defined. */
};
EntityVisualController.createModelWatchers = function() {
	/* ReferenceError: "ce_default_entity_model" is not defined. */
};
EntityVisualController.getModelWatcher = function(name) {
	return null;
};
EntityVisualController.setModel = function(name, ticks) {
	return null;
};
EntityVisualController.resetModel = function() {
	return null;
};
EntityVisualController.resetAllAnimations = function() {
	return null;
};
EntityVisualController.getCurrentModelName = function() {
	return {
		name: "main",
		ticks: -1
	};
};
EntityVisualController.loaded = function() {
	/* ReferenceError: "ce_default_entity_model" is not defined. */
};
EntityVisualController.update = function() {
	return null;
};
EntityVisualController.save = function() {
	return [];
};
EntityVisualController.read = function(data) {
	return null;
};
