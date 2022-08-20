const Dirs = {};
Dirs.EXTERNAL = android.os.Environment.getExternalStorageDirectory() + "/";
Dirs.INTERNAL_UI = __dir__ + "textures/";
Dirs.ASSET = __dir__ + "assets/";
Dirs.PROJECT = __dir__ + "projects/";
Dirs.PROJECT_AUTOSAVE = Dirs.PROJECT + ".autosaves/";
Dirs.LOGGING = __dir__ + ".logging/";
Dirs.SCRIPT = __dir__ + "script/";
Dirs.SCRIPT_ADAPTIVE = Dirs.SCRIPT + "adaptive/";
Dirs.SCRIPT_REVISION = Dirs.SCRIPT + "revision/";
Dirs.SCRIPT_TESTING = Dirs.SCRIPT + "testing/";
Dirs.EVALUATE = __dir__ + ".eval/";
Dirs.TODO = __dir__ + ".todo/";
Dirs.BACKUP = Dirs.EXTERNAL + "Nernar/" + __name__ + "/";

if (isHorizon) {
	Dirs.DATA = android.os.Environment.getDataDirectory() + "/data/" + getContext().getPackageName() + "/";
	try {
		Dirs.MOD = __modpack__.getDirectoryOfType("MODS");
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
