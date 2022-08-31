var SaverAPI = {};
SaverAPI.addSavesScope = function(name, loadFunc, saveFunc) {};
SaverAPI.registerScopeSaver = function(name, saver) {};
SaverAPI.registerObjectSaver = function(name, saver) {
	return 3556500;
};
SaverAPI.registerObject = function(obj, saverId) {
	/* JavaException: java.lang.IllegalArgumentException: no saver found for id 0 use only registerObjectSaver return values */
};
SaverAPI.setObjectIgnored = function(obj, ignore) {};
SaverAPI.serializeToString = function(obj) {
	return "{\"key\":\"value\",\"_json_ignore\":false}";
};
SaverAPI.serialize = function(obj) {
	return null;
};
SaverAPI.deserializeFromString = function(str) {
	/* JavaException: java.lang.RuntimeException: Unterminated object at character 17 of {"a": hardcoded test} */
};
SaverAPI.deserialize = function(obj) {
	return null;
};
