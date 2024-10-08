const Dirs = {};
if (isAndroid()) {
	Dirs.EXTERNAL = android.os.Environment.getExternalStorageDirectory() + "/";
} else {
	Dirs.EXTERNAL = Packages.com.zhekasmirnov.horizon.compiler.packages.Environment.getSdCardDir() + "/";
}
Dirs.INTERNAL_UI = __dir__ + "textures/";
Dirs.ASSET = __dir__ + "assets/";
Dirs.PROJECT = __dir__ + "projects/";
Dirs.PROJECT_AUTOSAVE = Dirs.PROJECT + ".autosaves/";
Dirs.LOGGING = __dir__ + ".logging/";
Dirs.SCRIPT = __dir__ + "script/";
Dirs.SCRIPT_ADAPTIVE = Dirs.SCRIPT + "adaptive/";
Dirs.SCRIPT_REVISION = Dirs.SCRIPT + "revision/";
Dirs.EVALUATE = __dir__ + ".eval/";
Dirs.TODO = __dir__ + ".todo/";
Dirs.BACKUP = Dirs.EXTERNAL + "Nernar/" + __name__ + "/";

if (isHorizon || isCLI()) {
	if (isAndroid()) {
		Dirs.DATA = android.os.Environment.getDataDirectory() + "/data/" + getContext().getPackageName() + "/";
	} else {
		Dirs.DATA = Packages.com.zhekasmirnov.horizon.compiler.packages.Environment.getDataDirFile() + "/";
	}
	try {
		Dirs.MOD = __packdir__ + __modpack__.getDirectoryOfType("MODS") + "/";
	} catch (e) {
		Dirs.MOD = __packdir__ + "innercore/mods/";
	}
	Dirs.WORLD = __packdir__ + "worlds/";
	Dirs.OPTION = Dirs.EXTERNAL + "games/horizon/minecraftpe/options.txt";
	Dirs.RESOURCE = __packdir__ + "assets/resource_packs/vanilla/";
} else {
	Dirs.DATA = android.os.Environment.getDataDirectory() + "/data/com.zhekasmirnov.innercore/";
	Dirs.MOD = Dirs.EXTERNAL + "games/com.mojang/mods/";
	Dirs.WORLD = Dirs.EXTERNAL + "games/com.mojang/innercoreWorlds/";
	Dirs.OPTION = Dirs.EXTERNAL + "games/com.mojang/minecraftpe/options.txt";
	Dirs.RESOURCE = Dirs.EXTERNAL + "games/com.mojang/resource_packs/innercore-resources/";
}

/**
 * Rounds file sizes (per 2^10 bytes).
 */
const formatSize = function(size) {
	return size < 100 ? Number(size).toFixed(2) :
		size < 1000 ? Number(size).toFixed(1) :
		size < 1024 ? Number(size).toFixed() : "?";
};

/**
 * Claimed by system media.
 */
const MediaTypes = {
	AUDIO: ["3gp", "mp4", "m4a", "aac", "ts", "flac", "gsm", "mid", "xmf",
		"mxmf", "rtttl", "rtx", "ota", "imy", "mp3", "mkv", "wav", "ogg"],
	VIDEO: ["3gp", "mp4", "ts", "webm", "mkv"],
	IMAGE: ["bmp", "gif", "jpg", "jpeg", "png", "webp", "heic", "heif", "ico"]
};

Files.typeof = function(pathOrFile) {
	if ((pathOrFile = this.of(pathOrFile)).isDirectory()) {
		return "folder";
	}
	let name = this.basename(pathOrFile),
		type = this.extension(pathOrFile);
	if (type) type = ("" + type).toLowerCase();
	return (type == "zip" || type == "tar" || type == "rar" || type == "7z" ||
			type == "mcpack" || type == "apk" || type == "aar" || type == "script" ||
			type == "odex" || type == "vdex" || type == "zipp" || type == "rarr" ||
			type == "gz" || type == "bz2" || type == "dex" || type == "jar" ||
			type == "xz" || type == "icmod" || type == "mcworld") ? "archive" :
		(type == "json" || type == "config" || type == "info" || name == "proguard-rules.pro" ||
			name == "manifest" || name == ".staticids" || name == ".profig.os" ||
			name == "saves-info" || name == ".installation_info" ||
			name == "cfg" || name == "info" || type == "gradle") ? "json" :
		(type == "txt" || type == "text" || type == "log" || type == "csv") ? "text" :
		(name == "order.txt" || name == ".includes" || type == "nproj" ||
			type == "yml" || type == "md" || type == "xml" ||
			type == "dat" || type == "dat_old" || type == "ldb") ? "order" :
		(type == "js" || type == "ts" || type == "cpp" || type == "css" || type == "bsh" ||
			type == "h" || type == "java" || type == "html" || type == "cs") ? "script" :
		(type == "dnp" || type == "ndb" || type == "nds") ? "project" :
		(type == "ttf" || type == "otf" || type == "wotf") ? "font" :
		type ? MediaTypes.VIDEO.indexOf(type) != -1 ? "video" :
		MediaTypes.IMAGE.indexOf(type) != -1 ? "image" :
		MediaTypes.AUDIO.indexOf(type) != -1 ? "audio" :
		name == "icon" ? "image" : "unknown" : "none";
};

Files.ExtensionType = {};
Files.ExtensionType.FOLDER = "folder";
Files.ExtensionType.ARCHIVE = "archive";
Files.ExtensionType.JSON = "json";
Files.ExtensionType.TEXT = "text";
Files.ExtensionType.ORDER = "order";
Files.ExtensionType.SCRIPT = "script";
Files.ExtensionType.PROJECT = "project";
Files.ExtensionType.FONT = "font";
Files.ExtensionType.IMAGE = "image";
Files.ExtensionType.VIDEO = "video";
Files.ExtensionType.AUDIO = "audio";
Files.ExtensionType.UNKNOWN = "unknown";
Files.ExtensionType.NONE = "none";

/**
 * Used to display dimensions in explorer.
 */
Files.prepareSize = function(pathOrFile) {
	return this.prepareFormattedSize(this.of(pathOrFile).length());
};

Files.prepareFormattedSize = function(size) {
	return size <= 0 ? translate("Empty") : size < 1024 ? translate("%s bytes", size) :
		size < 1024 * 1024 ? translate("%s KiB", formatSize(size / 1024)) :
		size < 1024 * 1024 * 1024 ? translate("%s MiB", formatSize(size / (1024 * 1024))) :
		size < 1024 * 1024 * 1024 * 1024 ? translate("%s GiB", formatSize(size / (1024 * 1024 * 1024))) :
		translate("%s TiB", formatSize(size / (1024 * 1024 * 1024 * 1024)));
};

Files.prepareBounds = function(pathOrFile) {
	let options = BitmapFactory.getBoundsDecodeOptions();
	BitmapFactory.decodeFile(this.of(pathOrFile), options);
	return [options.outWidth, options.outHeight];
};

Files.getThumbnailOptions = function(required, real, file) {
	let options = BitmapFactory.getPotatoOptions();
	if ((real instanceof java.io.File) || typeof real == "string") {
		file = real;
		delete real;
	}
	if (typeof real != "number") {
		if (!Array.isArray(real)) real = this.prepareBounds(file);
		real = Math.max(real[0], real[1]);
	}
	if (required === undefined) required = maximumThumbnailBounds;
	options.inSampleSize = Math.floor(real / required) + Number(real % required > 0);
	return options;
};

/**
 * @requires `isAndroid()`
 */
Files.createTypefaceWithFallback = function(pathOrFile) {
	pathOrFile = this.of(pathOrFile);
	try {
		return android.graphics.Typeface.createFromFile(pathOrFile);
	} catch (e) {
		Logger.Log("Modding Tools: Not found '" + pathOrFile.getName() + "' typeface, or it was failed to load", "WARNING");
		Logger.Log("Modding Tools: Files.createTypefaceWithFallback: " + e, "WARNING");
	}
	return typeface || android.graphics.Typeface.MONOSPACE;
};
