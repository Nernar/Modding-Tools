var EntityDataRegistry = {};
EntityDataRegistry.isLevelLoaded = false;
EntityDataRegistry.entityData = {};
EntityDataRegistry.entityDataTyped = {};
EntityDataRegistry.getAllData = function() {
	return {};
};
EntityDataRegistry.getDataForType = function(type) {
	return {};
};
EntityDataRegistry.entityAdded = function(entity) {
	return null;
};
EntityDataRegistry.entityRemoved = function(entity) {
	return null;
};
EntityDataRegistry.resetEngine = function() {
	return null;
};
EntityDataRegistry.getData = function(entity) {
	return {
		type: 0,
		name: "none"
	};
};
EntityDataRegistry.getType = function(entity) {
	return 0;
};
EntityDataRegistry.delayedAddCallbacks = [];
