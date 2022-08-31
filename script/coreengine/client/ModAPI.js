var ModAPI = {};
ModAPI.modAPIs = {};
ModAPI.registerAPI = function(name, api, descr) {
	return null;
};
ModAPI.requireAPI = function(name) {
	return "CoreEngine";
};
ModAPI.requireGlobal = function(name) {
	return eval(name);
};
ModAPI.requireAPIdoc = function(name) {
	return {
		name: "test",
		props: {}
	};
};
ModAPI.requireAPIPropertyDoc = function(name, prop) {
	return null;
};
ModAPI.getModByName = function(modName) {
	return null;
};
ModAPI.isModLoaded = function(modName) {
	return false;
};
ModAPI.addAPICallback = function(apiName, func) {
	return null;
};
ModAPI.addModCallback = function(modName, func) {
	return null;
};
ModAPI.getModList = function() {
	return [];
};
ModAPI.getModPEList = function() {
	return [];
};
ModAPI.addTexturePack = function(path) {
	return null;
};
ModAPI.cloneAPI = function(api, deep) {
	return {};
};
ModAPI.inheritPrototypes = function(source, target) {
	/* InternalError: Java class "java.lang.Long" has no public instance field or method named "who". (Core Engine#367) */
};
ModAPI.cloneObject = function(source, deep, rec) {
	return {
		who: "me"
	};
};
ModAPI.debugCloneObject = function(source, deep, rec) {
	return {
		who: "me"
	};
};
