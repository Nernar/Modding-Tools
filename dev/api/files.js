MCSystem.setLoadingTip("Preparing APIs");

const Dirs = {
	EXTERNAL: android.os.Environment.getExternalStorageDirectory(),
	DATA: android.os.Environment.getDataDirectory() + "/data/" + (isHorizon ? context.getPackageName() : "com.zhekasmirnov.innercore"),
	IMAGE: __dir__ + "gui", ASSET: __dir__ + "assets", EXPORT: __dir__ + "saves", CACHE: __dir__ + "assets/cache",
	AUTOSAVE: __dir__ + "saves/.autosave", LOGGING: __dir__ + "saves/.logging", SUPPORT: __dir__ + "support",
	MOD: isHorizon ? __packdir__  + "innercore/mods" : "/games/com.mojang/mods",
	WORLD: isHorizon ? __packdir__ + "worlds" : "/games/com.mojang/innercoreWorlds",
	OPTION: isHorizon ? "/games/horizon/minecraftpe/options.txt" : "/games/com.mojang/minecraftpe/options.txt",
	RESOURCE: isHorizon ? __packdir__ + "assets/resource_packs/vanilla" : "/games/com.mojang/resource_packs/innercore-resources"
};

(function() {
	for (let i in Dirs) {
		if (i != "EXTERNAL" && i != "DATA") {
			if (!Dirs[i].startsWith(Dirs.EXTERNAL)) {
				Dirs[i] = new String(Dirs.EXTERNAL + Dirs[i]);
			}
		}
	}
})();

function formatSize(size) {
	// Rounds file sizes (per 2^10 bytes)
	return size < 100 ? new Number(size).toFixed(2) :
	    size < 1000 ? new Number(size).toFixed(1) :
		size < 1024 ? new Number(size).toFixed() : "?";
}

const MediaTypes = { // Claimed by system media
	AUDIO: ["3gp", "mp4", "m4a", "aac", "ts", "flac", "gsm", "mid", "xmf",
	    "mxmf", "rtttl", "rtx", "ota", "imy", "mp3", "mkv", "wav", "ogg"],
	VIDEO: ["3gp", "mp4", "ts", "webm", "mkv"],
	IMAGE: ["bmp", "gif", "jpg", "jpeg", "png", "webp", "heic", "heif"]
};

const Files = {
	createFile: function(path, name) {
		if (name == undefined) let file = new java.io.File(path);
		else file = new java.io.File(path, name);
		if (!file.exists()) {
			file.createNewFile();
		}
	},
	createNewWithParent: function(path, name) {
		if (name == undefined) let file = new java.io.File(path);
		else file = new java.io.File(path, name);
		file.getParentFile().mkdirs();
		file.createNewFile();
	},
	checkFormats: function(list, formats) {
		// Filters files by extension
		let formatted = new Array();
		if (!Array.isArray(formats)) {
			formats = [formats];
		}
		for (let i in formats) {
			for (let l in list) {
				if (list[l].endsWith(formats[i])) {
					formatted.push(list[l]);
				}
			}
		}
		return formatted;
	},
	getNameExtension: function(name) {
		let index = name.lastIndexOf(".");
		if (index <= 0) {
			return null;
		}
		return name.substring(index + 1);
	},
	getNameWithoutExtension: function(name) {
		let index = name.lastIndexOf(".");
		if (index <= 0) {
			return name;
		}
		return name.substring(0, index);
	},
	getExtension: function(file) {
		let name = file.getName(), index = name.lastIndexOf(".");
		if (file.isDirectory() || index <= 0) {
			return null;
		}
		return name.substring(index + 1);
	},
	getExtensionType: function(file) {
		if (file.isDirectory()) {
			return "folder";
		}
		let name = file.getName(), type = this.getExtension(file);
		if (type) {
			type = new String(type).toLowerCase();
		}
		return (type == "zip" || type == "tar" || type == "rar" || type == "7z"
				|| type == "mcpack" || type == "apk" || type == "aar" || type == "script"
				|| type == "odex" || type == "vdex" || type == "zipp" || type == "rarr"
				|| type == "gz" || type == "bz2" || type == "dex" || type == "jar"
				|| type == "xz" || type == "icmod" || type == "mcworld") ? "archive" :
			(type == "json" || type == "config" || type == "info" || type == "proguard-rules.pro"
			    || name == "manifest" || name == ".staticids" || type == ".profig.os"
			    || name == "saves-info" || name == ".installation_info"
				|| name == "cfg" || name == "info" || type == "gradle") ? "json" :
			(type == "txt" || type == "text" || type == "log" || type == "csv") ? "text" :
			(name == "order.txt" || name == ".includes" || type == "nproj"
				|| type == "yml" || type == "md" || type == "xml"
				|| type == "dat" || type == "dat_old" || type == "ldb") ? "order" :
			(type == "js" || type == "ts" || type == "cpp" || type == "css" || type == "bsh"
			    || type == "h" || type == "java" || type == "html" || type == "cs") ? "script" :
			(type == "dnp" || type == "ndb" || type == "nds") ? "project":
			(type == "ttf" || type == "otf" || type == "wotf") ? "font" :
			type ? MediaTypes.VIDEO.indexOf(type) != -1 ? "video" :
			    MediaTypes.IMAGE.indexOf(type) != -1 ? "image" :
	            MediaTypes.AUDIO.indexOf(type) != -1 ? "audio" :
			name == "icon" ? "image" : "unknown" : "none";
	},
	prepareSize: function(file) {
		let size = file.length();
		// Used to display dimensions in explorer
		return this.prepareFormattedSize(size);
	},
	prepareFormattedSize: function(size) {
		return size <= 0 ? translate("Empty") : size < 1024 ? translate("%s bytes", size) :
		    size < 1024 * 1024 ? translate("%s KB", formatSize(size / 1024)) :
			size < 1024 * 1024 * 1024 ? translate("%s MB", formatSize(size / (1024 * 1024))) :
		    size < 1024 * 1024 * 1024 * 1024 ? translate("%s GB", formatSize(size / (1024 * 1024 * 1024))) :
			translate("%s TB", formatSize(size / (1024 * 1024 * 1024 * 1024)));
	},
	listFiles: function(path, explore) {
		let files = new Array(),
			file = new java.io.File(path),
			list = file.listFiles();
		for (let i in list) {
			if (list[i].isFile()) {
				files.push(list[i]);
			} else if (explore) {
				files = files.concat(this.listFiles(list[i], explore));
			}
		}
		return files.sort();
	},
	listDirectories: function(path, explore) {
		let directories = new Array(),
			file = new java.io.File(path),
			list = file.listFiles();
		for (let i in list) {
			if (list[i].isDirectory()) {
				directories.push(list[i]);
				if (explore) {
					directories = directories.concat(this.listDirectories(list[i], explore));
				}
			}
		}
		return directories.sort();
	},
	listFileNames: function(path, explore, root) {
		if (!("" + path).endsWith("/")) {
			path += "/";
		}
		let files = new Array(),
			file = new java.io.File(path),
			list = file.listFiles();
		if (root == undefined) {
			root = path;
		}
		for (let i = 0; i < list.length; i++) {
			if (list[i].isFile()) {
				files.push(("" + list[i]).replace(root, ""));
			} else if (explore) {
				files = files.concat(this.listFileNames(list[i], explore, root));
			}
		}
		return files.sort();
	},
	listDirectoryNames: function(path, explore, root) {
		if (!("" + path).endsWith("/")) {
			path += "/";
		}
		let directories = new Array(),
			file = new java.io.File(path),
			list = file.listFiles();
		if (root == undefined) {
			root = path;
		}
		for (let i = 0; i < list.length; i++) {
			if (list[i].isDirectory()) {
				directories.push(("" + list[i]).replace(root, ""));
				if (explore) {
					directories = directories.concat(this.listDirectoryNames(list[i], explore, root));
				}
			}
		}
		return directories.sort();
	},
	filesCount: function(path) {
		return new java.io.File(path).list().length;
	},
	deleteDir: function(path, include, exclude, root) {
		// Recursive file deletion
		let file = new java.io.File(path);
		if (file.isDirectory()) {
			let list = file.listFiles();
			for (let i = 0; i < list.length; i++) {
				this.deleteDir(list[i].getPath());
			}
		}
		file.delete();
	},
	getFromAssets: function(name) {
		let assets = context.getAssets();
		return assets.open(name);
	},
	readKey: function(a, b) {
		b = b || "=";
        let d = this.read(a, true), e = new Object();
        for (let f = 0; f < d.length; f++) {
            let g = d[f].split(b);
            if (g.length == 2) {
            	e[g[0]] = g[1];
            }
        }
        return e;
    },
    writeKey: function(a, b, c) {
        c = c || "=";
        let d = new Array();
        for (let e in b) {
			d.push(e + c + b[e]);
		}
        this.write(a, d.join("\n"));
    },
	read: function(file, massive) {
		if (!file.exists()) {
			return massive ? new Array() : null;
		}
		let reader = java.io.BufferedReader(new java.io.FileReader(file)), result = new Array();
		while (line = reader.readLine()) {
			result.push(line);
		}
		return massive ? result : result.join("\n");
	},
	readLine: function(file, index) {
		if (!file.exists()) {
			return null;
		}
		let reader = java.io.BufferedReader(new java.io.FileReader(file)), count = -1;
		while (count < index && (line = reader.readLine())) {
			count++;
		}
		return count == index ? line : null;
	},
	readLines: function(file, startInd, endInd) {
		if (!file.exists()) {
			return null;
		}
		let reader = java.io.BufferedReader(new java.io.FileReader(file)), count = -1, result = new Array();
		while (count <= endInd && (line = reader.readLine())) {
			if (count >= startInd) {
				result.push(line);
			}
			count++;
		}
		return result.length > 0 ? result : null;
	},
	readBytes: function(file) {
		if (!file.exists()) {
			return null;
		}
		let stream = new java.io.FileInputStream(file);
		let output = new java.io.ByteArrayOutputStream();
		let arr = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
		while (true) {
			let read = stream.read(arr);
			if (read < 0) {
				return output.toByteArray();
			}
			output.write(arr, 0, read);
		}
	},
	writeBytes: function(file, bytes) {
		file.createNewFile();
		let stream = new java.io.FileOutputStream(file);
		stream.write(bytes);
		stream.close();
	},
	write: function(file, text) {
		Files.writeBytes(file, java.lang.String(text).getBytes());
	},
	addText: function(file, text) {
		Files.write(file, Files.read(file) + text);
	},
	sendMail: function(file) {
		// Tries send a message to users (likes Gmail, etc.)
		let intent = new android.content.Intent("android.intent.action.SEND");
		intent.setType("text/plain");
		intent.putExtra("android.intent.extra.TEXT", Files.read(file));
		context.startActivity(intent);
	},
	linesCount: function(file) {
		return Files.read(file, true).length;
	},
	runScript: function(file) {
		eval(Files.read(file));
	},
	copy: function(file, path) {
		let result = new java.io.File(path);
		if (!result.exists()) {
			result.createNewFile();
		}
		Files.write(result, Files.read(file));
	},
	cut: function(file, path) {
		Files.copy(file, path);
		file.delete();
	},
	createFromBase64: function(file, code) {
		file.createNewFile();
		Files.writeBytes(file, android.util.Base64.decode(code, 0));
	}
};

const Archives = {
	getFile: function(zip) {
		return new java.util.zip.ZipFile(zip);
	},
	getEntry: function(zip, name) {
		return new java.util.zip.ZipFile(zip).getEntry(name);
	},
	contains: function(zip, name) {
		return Archives.getEntry(zip, name) != null;
	},
	unpack: function(file, path) {
		// A lot of high level code
		let zip = new java.util.zip.ZipFile(file),
			elements = zip.entries();
		new java.io.File(path).mkdirs();

		while (elements.hasMoreElements()) {
			let element = elements.nextElement(),
				source = zip.getInputStream(element),
				result = new java.io.File(path, element.getName()),
				bis = new java.io.BufferedInputStream(source);
			
			if (element.isDirectory()) {
				result.mkdir();
			} else {
				result.getParentFile().mkdir();
				let bos = new java.io.BufferedOutputStream(new java.io.FileOutputStream(result)),
					buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
				let line = 0;
				while ((line = bis.read(buf)) >= 0) {
					bos.write(buf, 0, line);
				}
				bis.close();
				bos.close();
			}
		}
		zip.close();
	}
};

const Options = {
	getValue: function(key) {
		let file = new java.io.File(Dirs.OPTION),
			reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file))),
			line = new String(), result = new String();
		while ((line = reader.readLine()) != null) {
			if (line.split(":")[0] == key) {
				result = line.split(":")[1];
				break;
			}
		}
		reader.close();
		return result;
	},
	setValue: function(name, key) {
		let file = new java.io.File(Dirs.OPTION),
			reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file))),
			line = new String(), result = new Array();
		while ((line = reader.readLine()) != null) {
			if (line.split(":")[0] == name) {
				result.push(name + ":" + key);
			} else {
				result.push(line);
			}
		}
		Files.write(file, result.join("\n"));
	}
};
