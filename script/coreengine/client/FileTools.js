var FileTools = {};
FileTools.mntdir = "/mnt";
FileTools.root = "/storage/emulated/0/";
FileTools.moddir = "/storage/emulated/0/games/horizon/packs/Inner_Core_Test/innercore/mods/";
FileTools.mkdir = function(dir) {};
FileTools.mkworkdirs = function() {};
FileTools.getFullPath = function(path) {
	return null;
};
FileTools.isExists = function(path) {};
FileTools.WriteText = function(file, text, add) {};
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
	return null;
};
FileTools.GetListOfFiles = function(path, ext) {
	return null;
};
FileTools.ReadKeyValueFile = function(dir, specialSeparator) {
	return null;
};
FileTools.WriteKeyValueFile = function(dir, data, specialSeparator) {};
FileTools.ReadJSON = function(dir) {
	return null;
};
FileTools.WriteJSON = function(dir, obj, beautify) {};
