var GameObjectRegistry = {};
GameObjectRegistry.gameObjectTypes = {};
GameObjectRegistry.activeGameObjects = {};
GameObjectRegistry.genUniqueName = function(name) {
	return "test";
};
GameObjectRegistry.registerClass = function(gameObjectClass) {};
GameObjectRegistry.deployGameObject = function(gameobject) {
	/* JavaException: java.lang.IllegalArgumentException: cannot add updatable object: <obj>.update must be a function, not class org.mozilla.javascript.UniqueTag org.mozilla.javascript.UniqueTag@206c49b: NOT_FOUND */
};
GameObjectRegistry.addGameObject = function(gameobject) {};
GameObjectRegistry.removeGameObject = function(gameobject) {};
GameObjectRegistry.resetEngine = function() {};
GameObjectRegistry.getAllByType = function(type, clone) {
	return null;
};
GameObjectRegistry.callForType = function() {};
GameObjectRegistry.callForTypeSafe = function() {};
