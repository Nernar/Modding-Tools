const ImageFactory = {
	loaded: new Object(),
	drawables: new Object(),
	resizes: new Object(),
	tiles: new Object()
};
ImageFactory.resourcesCount = 0;
ImageFactory.loadFromFile = function(key, path) {
	try {
		if (LoadingTipUtils.hasEncounter()) {
			LoadingTipUtils.updateCounter(++this.resourcesCount);
		}
		let params = new android.graphics.BitmapFactory.Options();
		params.inPreferredConfig = android.graphics.Bitmap.Config.RGB_565;
		let file = path instanceof java.io.File ? path : new java.io.File(Dirs.ASSET, path);
		if (file == null || !file.exists()) {
			return null;
		}
		let readed = Files.readBytes(file);
		if (!readed || readed.length == 0) {
			return null;
		}
		Encyption.updateKey("nernar", "editorResource");
		let base64 = Encyption.decrypt(readed);
		if (!base64 || base64.length == 0) {
			return null;
		}
		let bytes = Base64.decode(base64);
		if (!bytes || bytes.length == 0) {
			return null;
		}
		this.loaded[key] = android.graphics.BitmapFactory.decodeByteArray
			(bytes, 0, bytes.length, params);
		this.checkAndResize(key);
		this.checkAndRetile(key);
		return key;
	} catch (e) {
		__code__.startsWith("develop") && reportError(e);
		Logger.Log("Can't decode resource " + key, "Warning");
	}
	return null;
};
ImageFactory.encode = function(file) {
	if (!file || !file.exists()) {
		return null;
	}
	let bytes = Files.readBytes(file);
	if (!bytes || bytes.length == 0) {
		return null;
	}
	let base64 = Base64.encode(bytes);
	if (!base64 || base64.length == 0) {
		return null;
	}
	Encyption.updateKey("nernar", "editorResource");
	let result = Encyption.encrypt(base64);
	if (!result || result.length == 0) {
		return null;
	}
	return result;
};
ImageFactory.encodeFile = function(file, out) {
	if (!file || !file.exists() || !out) {
		return;
	}
	let encoded = this.encode(file);
	if (!encoded) {
		return;
	}
	Files.createNewWithParent(out.getPath());
	Files.writeBytes(out, encoded);
};
ImageFactory.encodeFolder = function(folder, out, explore) {
	if (!folder || !folder.exists() || !out) {
		return;
	}
	let sources = Files.listFiles(folder);
	for (let i = 0; i < sources.length; i++) {
		let name = Files.getNameWithoutExtension(sources[i].getName()),
			file = new java.io.File(out, name + ".dnr");
		this.encodeFile(sources[i], file);
	}
	if (explore) {
		let folders = Files.listDirectories(folder);
		for (let i = 0; i < folders.length; i++) {
			let file = new java.io.File(out, folders[i].getName());
			MCSystem.setLoadingTip("Encoding " + folders[i].getPath().replace(Dirs.IMAGE, ""));
			this.encodeFolder(folders[i], file, explore);
		}
	}
};
ImageFactory.checkSize = function(file) {
	let options = new android.graphics.BitmapFactory.Options();
	options.inJustDecodeBounds = true;
	android.graphics.BitmapFactory.decodeFile(file, options);
	return options.outWidth + "x" + options.outHeight;
};
ImageFactory.getCountByTag = function(tag) {
	let count = 0;
	for (let item in this.loaded) {
		if (item.indexOf(tag) != -1) {
			count++;
		}
	}
	return count;
};
ImageFactory.getBitmap = function(key) {
	return this.loaded[key];
};
ImageFactory.getDrawable = function(key) {
	if (this.drawables[key]) {
		return this.drawables[key];
	}
	let drawable = new android.graphics.drawable.BitmapDrawable(this.getBitmap(key));
	drawable.setFilterBitmap(false)
	return drawable;
};
ImageFactory.resizeBitmap = function(key, dx, dy) {
	let bitmap = this.getBitmap(key);
	if (!bitmap) {
		return;
	}
	if (!dy) {
		dy = dx;
	}
	let width = bitmap.getWidth(), height = bitmap.getHeight();
	this.loaded[key] = android.graphics.Bitmap.createScaledBitmap
		(android.graphics.Bitmap.createBitmap(bitmap, 0, 0, width, height), dx, dy, false);
};
ImageFactory.compressBitmap = function(key, min, max) {
	let bitmap = this.getBitmap(key);
	if (!bitmap) {
		return;
	}
	let size = Ui.Display.HEIGHT > 480 ? Ui.Display.HEIGHT < 1080 ?
			min + Ui.Display.HEIGHT / 1560 * (max - min) : max : min,
		width = bitmap.getWidth(), height = bitmap.getHeight(),
		dx = Math.ceil(width * size), dy = Math.ceil(height * size);
	this.resizeBitmap(key, dx, dy);
};
ImageFactory.loadFileFrames = function(name, keysOrPath, time, oneshot) {
	if (keysOrPath == undefined || keysOrPath == null) {
		return null;
	}
	if (typeof keysOrPath == "string") {
		keysOrPath = this.loadDirectory(name, keysOrPath);
	}
	let animation = new android.graphics.drawable.AnimationDrawable(),
		timeInFrames = typeof time != "number";
	if (oneshot) {
		animation.setOneShot(true);
	}
	for (let i = 0; i < keysOrPath.length; i++) {
		if (!keysOrPath[i]) {
			continue;
		}
		let drawable = this.getDrawable(keysOrPath[i]), 
			ms = timeInFrames ? time[i] : time;
		animation.addFrame(drawable, ms);
	}
	return animation;
};
ImageFactory.loadDirectory = function(key, pathOrExplore, explore) {
	if (key == undefined) {
		key = new String();
		pathOrExplore = new String();
		explore = true;
	} else if (pathOrExplore == undefined && explore == undefined) {
		pathOrExplore = new String();
		explore = true;
	} else if (typeof pathOrExplore == "boolean") {
		explore = pathOrExplore;
		pathOrExplore = new String();
	}
	let file = new java.io.File(Dirs.ASSET, pathOrExplore);
	if (!file.exists()) {
		return null;
	}
	let list = file.listFiles(), keys = new Array();
	for (let i = 0; i < list.length; i++) {
		let name = list[i].getName(), path = pathOrExplore.length == 0 ? name : pathOrExplore + "/" + name;
		name = Files.getNameWithoutExtension(name) || name;
		let current = key.length == 0 ? name : key;
		if (!current.toLowerCase().endsWith(name.toLowerCase())) {
			name = name.substring(0, 1).toUpperCase() + name.substring(1);
			current += name;
		}
		if (list[i].isDirectory()) {
			if (explore) {
				this.loadDirectory(current, path, explore);
			}
		} else if (list[i].getName().endsWith(".dnr")) {
			keys.push(this.loadFromFile(current, path));
		}
	}
	return keys;
};
ImageFactory.prepareParams = function(key, dx, dy) {
	this.resizes[key] = [dx, typeof dy != "number" ? dx : dy];
};
ImageFactory.checkAndResize = function(key) {
	for (let i in this.resizes) {
		let size = this.resizes[i];
		if (key.startsWith(i)) {
			this.resizeBitmap(key, size[0], size[1]);
		}
	}
};
ImageFactory.prepareTileMode = function(key, xt, yt) {
	this.tiles[key] = new Array();
	typeof xt != "undefined" && this.tiles[key].push(xt);
	typeof yt != "undefined" && this.tiles[key].push(yt);
};
ImageFactory.checkAndRetile = function(key) {
	for (let i in this.tiles) {
		let tile = this.tiles[i];
		if (key.startsWith(i)) {
			let drawable = this.getDrawable(key);
			tile.length >= 1 && drawable.setTileModeX(tile[0]);
			tile.length >= 2 && drawable.setTileModeY(tile[1]);
			this.drawables[key] = drawable;
		}
	}
};

const AssetFactory = {
	loaded: new Object()
};
AssetFactory.loadAsset = function(key, path) {
	return (this.loaded[key] = new java.io.File(__dir__ + "assets", path));
};
AssetFactory.createFont = function(key) {
	let loaded = this.getFile(key + "Font"), exists = loaded && loaded.exists();
	return exists ? android.graphics.Typeface.createFromFile(loaded) : android.graphics.Typeface.MONOSPACE;
};
AssetFactory.getFile = function(key) {
	return this.loaded[key];
};
