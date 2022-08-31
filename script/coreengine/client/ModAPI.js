var ModAPI = {};
ModAPI.modAPIs = {};
ModAPI.registerAPI = function(name, api, descr) {};
ModAPI.requireAPI = function(name) {
	return "CoreEngine";
};
ModAPI.requireGlobal = function(name) {
	return null;
};
ModAPI.requireAPIdoc = function(name) {
	return null;
};
ModAPI.requireAPIPropertyDoc = function(name, prop) {
	return null;
};
ModAPI.getModByName = function(modName) {
	return null;
};
ModAPI.isModLoaded = function(modName) {};
ModAPI.addAPICallback = function(apiName, func) {};
ModAPI.addModCallback = function(modName, func) {};
ModAPI.getModList = function() {
	return null;
};
ModAPI.getModPEList = function() {
	return null;
};
ModAPI.addTexturePack = function(path) {};
ModAPI.cloneAPI = function(api, deep) {
	return null;
};
ModAPI.inheritPrototypes = function(source, target) {
	/* InternalError: Java class "java.lang.Long" has no public instance field or method named "who". (Core Engine#367) */
};
ModAPI.cloneObject = function(source, deep, rec) {
	return null;
};
ModAPI.debugCloneObject = function(source, deep, rec) {
	return null;
};
