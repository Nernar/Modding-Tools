var GameObjectRegistry = {};
GameObjectRegistry.gameObjectTypes = {};
GameObjectRegistry.activeGameObjects = {};
GameObjectRegistry.genUniqueName = function(name) {
	return "test";
};
GameObjectRegistry.registerClass = function(gameObjectClass) {
	return null;
};
GameObjectRegistry.deployGameObject = function(gameobject) {
	/* JavaException: java.lang.IllegalArgumentException: cannot add updatable object: <obj>.update must be a function, not class org.mozilla.javascript.UniqueTag org.mozilla.javascript.UniqueTag@ef371: NOT_FOUND */
};
GameObjectRegistry.addGameObject = function(gameobject) {
	return null;
};
GameObjectRegistry.removeGameObject = function(gameobject) {
	return null;
};
GameObjectRegistry.resetEngine = function() {
	return null;
};
GameObjectRegistry.getAllByType = function(type, clone) {
	return [];
};
GameObjectRegistry.callForType = function() {
	return null;
};
GameObjectRegistry.callForTypeSafe = function() {
	return null;
};
