var FileTools = {};
FileTools.mntdir = "/mnt";
FileTools.root = "/storage/emulated/0/";
FileTools.moddir = "/storage/emulated/0/games/horizon/packs/Inner_Core_Test/innercore/mods/";
FileTools.mkdir = function(dir) {
	return null;
};
FileTools.mkworkdirs = function() {
	return null;
};
FileTools.getFullPath = function(path) {
	return {};
};
FileTools.isExists = function(path) {
	return false;
};
FileTools.WriteText = function(file, text, add) {
	return null;
};
FileTools.ReadText = function(file) {
	return "some text\n";
};
FileTools.WriteImage = function(file, bitmap) {
	/* TypeError: Cannot call method "compress" of undefined */
};
FileTools.ReadImage = function(file) {
	return null;
};
FileTools.ReadTextAsset = function(name) {
	/* TypeError: Cannot find function getBytes in object [object Object]. */
};
FileTools.ReadImageAsset = function(name) {
	/* TypeError: Cannot find function getBytes in object [object Object]. */
};
FileTools.ReadBytesAsset = function(name) {
	/* TypeError: Cannot find function getBytes in object [object Object]. */
};
FileTools.GetListOfDirs = function(path) {
	return [];
};
FileTools.GetListOfFiles = function(path, ext) {
	return [];
};
FileTools.ReadKeyValueFile = function(dir, specialSeparator) {
	return {
		id: "1",
		data: "0"
	};
};
FileTools.WriteKeyValueFile = function(dir, data, specialSeparator) {
	return null;
};
FileTools.ReadJSON = function(dir) {
	return {
		name: "Dump Creator",
		author: "Nernar",
		version: "1.0",
		description: "Dump Core Engine API."
	};
};
FileTools.WriteJSON = function(dir, obj, beautify) {
	return null;
};
