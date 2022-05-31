MCSystem.setLoadingTip(NAME + ": Preparing APIs");

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
	Dirs.DATA = android.os.Environment.getDataDirectory() + "/data/" + context.getPackageName() + "/";
	Dirs.MOD = tryout(function() {
		return __modpack__.getDirectoryOfType("MODS");
	}, function(e) {
		return __packdir__ + "innercore/mods/";
	});
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

const Files = {};

Files.createFile = function(path, name) {
	if (name == undefined) let file = new java.io.File(path);
	else file = new java.io.File(path, name);
	if (!file.exists()) file.createNewFile();
};

Files.createNewWithParent = function(path, name) {
	if (name == undefined) let file = new java.io.File(path);
	else file = new java.io.File(path, name);
	file.getParentFile().mkdirs();
	file.createNewFile();
};

/**
 * Filters files by extension.
 */
Files.checkFormats = function(list, formats) {
	let formatted = [];
	if (!Array.isArray(formats)) {
		formats = [formats];
	}
	for (let item in formats) {
		for (let name in list) {
			if (list[name].endsWith(formats[item])) {
				formatted.push(list[name]);
			}
		}
	}
	return formatted;
};

Files.getNameExtension = function(name) {
	let index = name.lastIndexOf(".");
	if (index <= 0) return null;
	return name.substring(index + 1);
};

Files.getNameWithoutExtension = function(name) {
	let index = name.lastIndexOf(".");
	if (index <= 0) return name;
	return name.substring(0, index);
};

Files.getExtension = function(file) {
	let name = file.getName(),
		index = name.lastIndexOf(".");
	if (file.isDirectory() || index <= 0) {
		return null;
	}
	return name.substring(index + 1);
};

Files.getExtensionType = function(file) {
	if (file.isDirectory()) {
		return "folder";
	}
	let name = file.getName(),
		type = this.getExtension(file);
	if (type) type = String(type).toLowerCase();
	return (type == "zip" || type == "tar" || type == "rar" || type == "7z" ||
			type == "mcpack" || type == "apk" || type == "aar" || type == "script" ||
			type == "odex" || type == "vdex" || type == "zipp" || type == "rarr" ||
			type == "gz" || type == "bz2" || type == "dex" || type == "jar" ||
			type == "xz" || type == "icmod" || type == "mcworld") ? "archive" :
		(type == "json" || type == "config" || type == "info" || type == "proguard-rules.pro" ||
			name == "manifest" || name == ".staticids" || type == ".profig.os" ||
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
Files.prepareSize = function(file) {
	let size = file.length();
	return this.prepareFormattedSize(size);
};

Files.prepareFormattedSize = function(size) {
	return size <= 0 ? translate("Empty") : size < 1024 ? translate("%s bytes", size) :
		size < 1024 * 1024 ? translate("%s KB", formatSize(size / 1024)) :
		size < 1024 * 1024 * 1024 ? translate("%s MB", formatSize(size / (1024 * 1024))) :
		size < 1024 * 1024 * 1024 * 1024 ? translate("%s GB", formatSize(size / (1024 * 1024 * 1024))) :
		translate("%s TB", formatSize(size / (1024 * 1024 * 1024 * 1024)));
};

Files.prepareBounds = function(file) {
	let options = BitmapFactory.getBoundsDecodeOptions();
	BitmapFactory.decodeFile(file, options);
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

Files.listFiles = function(path, explore) {
	let files = [],
		file = new java.io.File(path);
	if (file.isFile()) return [file];
	let list = file.listFiles() || [];
	for (let i = 0; i < list.length; i++) {
		if (list[i].isFile()) {
			files.push(list[i]);
		} else if (explore) {
			files = files.concat(this.listFiles(list[i], explore));
		}
	}
	return files.sort();
};

Files.listDirectories = function(path, explore) {
	let directories = [],
		file = new java.io.File(path);
	if (file.isFile()) return directories;
	let list = file.listFiles() || [];
	for (let i = 0; i < list.length; i++) {
		if (list[i].isDirectory()) {
			directories.push(list[i]);
			if (explore) directories = directories.concat(this.listDirectories(list[i], explore));
		}
	}
	return directories.sort();
};

Files.listFileNames = function(path, explore, root) {
	let files = [],
		file = new java.io.File(path);
	if (root === undefined) root = path;
	if (file.isFile()) return [String(path).replace(root, String())];
	if (!String(root).endsWith("/") && String(root).length > 0) {
		root += "/";
	}
	let list = file.listFiles() || [];
	for (let i = 0; i < list.length; i++) {
		if (list[i].isFile()) {
			files.push(String(list[i]).replace(root, String()));
		} else if (explore) {
			files = files.concat(this.listFileNames(list[i], explore, root));
		}
	}
	return files.sort();
};

Files.listDirectoryNames = function(path, explore, root) {
	let directories = [],
		file = new java.io.File(path);
	if (file.isFile()) return directories;
	let list = file.listFiles() || [];
	if (root === undefined) root = path;
	if (!String(root).endsWith("/") && String(root).length > 0) {
		root += "/";
	}
	for (let i = 0; i < list.length; i++) {
		if (list[i].isDirectory()) {
			directories.push(String(list[i]).replace(root, String()));
			if (explore) directories = directories.concat(this.listDirectoryNames(list[i], explore, root));
		}
	}
	return directories.sort();
};

Files.filesCount = function(path) {
	return new java.io.File(path).list().length;
};

Files.deleteRecursive = function(path, explore) {
	let file = new java.io.File(path);
	if (file.isDirectory()) {
		let list = file.listFiles();
		for (let i = 0; i < list.length; i++) {
			if (explore || !list[i].isDirectory()) {
				this.deleteRecursive(list[i].getPath(), explore);
			}
		}
	}
	file.delete();
};

Files.getFromAssets = function(name) {
	let assets = context.getAssets();
	return assets.open(name);
};

Files.readKey = function(file, separator) {
	separator = separator || "=";
	let text = this.read(file, true),
		obj = {};
	for (let i = 0; i < text.length; i++) {
		let source = text[i].split(separator);
		if (source.length == 2) obj[source[0]] = source[1];
	}
	return obj;
};

Files.writeKey = function(file, obj, separator) {
	separator = separator || "=";
	let result = [];
	for (let item in obj) {
		result.push(item + separator + obj[item]);
	}
	this.write(file, result.join("\n"));
};

Files.read = function(file, massive) {
	if (!file.exists()) return massive ? [] : null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		result = [],
		line;
	while (line = reader.readLine()) {
		result.push(line);
	}
	return massive ? result : result.join("\n");
};

Files.readLine = function(file, index) {
	if (!file.exists()) return null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		count = -1,
		line;
	while (count < index && (line = reader.readLine())) {
		count++;
	}
	return count == index ? line : null;
};

Files.readLines = function(file, startInd, endInd) {
	if (!file.exists()) return null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		result = [],
		count = -1,
		line;
	while (count <= endInd && (line = reader.readLine())) {
		if (count >= startInd) {
			result.push(line);
		}
		count++;
	}
	return result.length > 0 ? result : null;
};

Files.readBytes = function(file) {
	if (!file.exists()) return null;
	let stream = new java.io.FileInputStream(file);
	let output = new java.io.ByteArrayOutputStream();
	let arr = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
	while (true) {
		let read = stream.read(arr);
		if (read < 0) return output.toByteArray();
		output.write(arr, 0, read);
	}
};

Files.writeBytes = function(file, bytes) {
	file.createNewFile();
	let stream = new java.io.FileOutputStream(file);
	stream.write(bytes);
	stream.close();
};

Files.write = function(file, text) {
	Files.writeBytes(file, java.lang.String(text).getBytes());
};

Files.addText = function(file, text) {
	if (!file.exists()) file.createNewFile();
	Files.write(file, Files.read(file) + text);
};

Files.sendMail = function(file) {
	let intent = new android.content.Intent("android.intent.action.SEND");
	intent.setType("text/plain");
	intent.putExtra("android.intent.extra.TEXT", Files.read(file));
	context.startActivity(intent);
};

Files.linesCount = function(file) {
	return Files.read(file, true).length;
};

Files.runScript = function(file) {
	eval(Files.read(file));
};

Files.shrinkPathes = function(source, element) {
	if (source instanceof java.io.File) {
		source = source.getPath();
	}
	if (element instanceof java.io.File) {
		element = element.getPath();
	}
	return String(element).replace(String(source), String());
};

Files.copyRecursive = function(path, output, explore, includeDirectories) {
	let files = this.listFiles(path, explore),
		count = 0;
	if (includeDirectories !== false) {
		let directories = this.listDirectories(path, explore);
		for (let i = 0; i < directories.length; i++) {
			let source = this.shrinkPathes(path, directories[i]);
			if (source.length > 0) {
				let file = new java.io.File(output, source);
				if (!file.exists()) file.mkdirs();
				count++;
			}
		}
	}
	for (let i = 0; i < files.length; i++) {
		let source = this.shrinkPathes(path, files[i]);
		file = new java.io.File(output, source);
		this.copy(files[i], file.getPath());
		count++;
	}
	return count;
};

Files.copy = function(file, path) {
	let result = new java.io.File(path);
	if (!result.exists()) this.createNewWithParent(result);
	this.writeBytes(result, this.readBytes(file));
};

Files.cut = function(file, path) {
	Files.copy(file, path);
	file.delete();
};

Files.asMD5 = function(file, simpleCompare) {
	if (!(file instanceof java.io.File)) {
		file = new java.io.File(file);
	}
	if (simpleCompare) {
		let size = java.lang.String(file.length());
		return Hashable.toMD5(size.getBytes());
	}
	return Hashable.toMD5(this.readBytes(file));
};

Files.compare = function(left, right, simpleCompare) {
	left = this.asMD5(left, simpleCompare);
	right = this.asMD5(right, simpleCompare);
	return left == right;
};

Files.compareRecursive = function(input, target, explore, simpleCompare, includeDirectories) {
	let left = this.listFileNames(input, explore),
		right = this.listFileNames(target, explore),
		changes = [];
	if (includeDirectories !== false) {
		let first = this.listDirectoryNames(input, explore),
			second = this.listDirectoryNames(target, explore);
		for (let i = 0; i < second.length; i++) {
			let output = new java.io.File(target, second[i]);
			if (first.indexOf(second[i]) == -1) {
				changes.push(output);
			}
		}
	}
	for (let i = 0; i < right.length; i++) {
		let output = new java.io.File(target, right[i]);
		if (left.indexOf(right[i]) == -1) {
			changes.push(output);
			continue;
		}
		let file = new java.io.File(input, right[i])
		if (!this.compare(output, file, simpleCompare)) {
			changes.push(output);
		}
	}
	return changes;
};

Files.isCompared = function(input, target, explore, simpleCompare, includeDirectories) {
	return this.compareRecursive(input, target, explore, simpleCompare, includeDirectories).length == 0;
};

Files.isIdentical = function(left, right, explore, simpleCompare, includeDirectories) {
	return this.isCompared(left, right, explore, simpleCompare, includeDirectories) &&
		this.isCompared(right, left, explore, simpleCompare, includeDirectories);
};

Files.copyAndCompare = function(from, to, explore, simpleCompare, includeDirectories) {
	this.copyRecursive(from, to, explore, includeDirectories);
	return this.isCompared(to, from, explore, simpleCompare, includeDirectories);
};

const Archives = {};

Archives.getFile = function(zip) {
	return new java.util.zip.ZipFile(zip);
};

Archives.getEntry = function(zip, name) {
	return new java.util.zip.ZipFile(zip).getEntry(name);
};

Archives.contains = function(zip, name) {
	return Archives.getEntry(zip, name) != null;
};

Archives.unpack = function(file, path) {
	let zip = new java.util.zip.ZipFile(file),
		elements = zip.entries();
	new java.io.File(path).mkdirs();
	while (elements.hasMoreElements()) {
		let element = elements.nextElement(),
			source = zip.getInputStream(element),
			result = new java.io.File(path, element.getName()),
			bis = new java.io.BufferedInputStream(source);
		if (!element.isDirectory()) {
			result.getParentFile().mkdir();
			let bos = new java.io.BufferedOutputStream(new java.io.FileOutputStream(result)),
				buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096),
				line = 0;
			while ((line = bis.read(buf)) >= 0) {
				bos.write(buf, 0, line);
			}
			bis.close();
			bos.close();
		} else result.mkdirs();
	}
	zip.close();
};

const Options = {};

Options.getValue = function(key) {
	let file = new java.io.File(Dirs.OPTION),
		reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file))),
		line = String(),
		result = String();
	while ((line = reader.readLine()) != null) {
		if (line.split(":")[0] == key) {
			result = line.split(":")[1];
			break;
		}
	}
	reader.close();
	return result;
};

Options.setValue = function(name, key) {
	let file = new java.io.File(Dirs.OPTION),
		reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file))),
		result = [],
		line;
	while ((line = reader.readLine()) != null) {
		if (line.split(":")[0] == name) {
			result.push(name + ":" + key);
		} else result.push(line);
	}
	Files.write(file, result.join("\n"));
};
