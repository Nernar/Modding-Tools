const BitmapFactory = new Object();

BitmapFactory.decodeBytes = function(bytes, options) {
	return tryout.call(this, function() {
		if (options !== undefined) {
			return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
		}
		return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
	}, function(e) {
		Logger.Log("BitmapFactory failed to decode bytes " + bytes, "WARNING");
	}, null);
};

BitmapFactory.decodeResource = function(bytes, options) {
	return tryout.call(this, function() {
		let decoded = decodeResource(bytes);
		return this.decodeBytes(decoded, options);
	}, function(e) {
		Logger.Log("BitmapFactory failed to decode resource " + bytes, "WARNING");
	}, null);
};

BitmapFactory.decodeFile = function(path, options) {
	let file = path instanceof java.io.File ? path : new java.io.File(path);
	return tryout.call(this, function() {
		if (file.getName().endsWith(".dnr")) {
			let bytes = Files.readBytes(file);
			return this.decodeResource(bytes, options);
		}
		if (options !== undefined) {
			return android.graphics.BitmapFactory.decodeFile(file, options);
		}
		return android.graphics.BitmapFactory.decodeFile(file);
	}, function(e) {
		Logger.Log("BitmapFactory failed to decode file " + file.getName(), "WARNING");
	}, null);
};

BitmapFactory.decodeAsset = function(path, options) {
	return tryout.call(this, function() {
		let file = new java.io.File(Dirs.ASSET, path);
		if (!file.exists() || file.isDirectory()) {
			file = new java.io.File(file.getPath() + ".dnr");
		}
		return this.decodeFile(file, options);
	}, function(e) {
		Logger.Log("BitmapFactory failed to decode asset " + path, "WARNING");
	}, null);
};

BitmapFactory.createScaled = function(bitmap, dx, dy) {
	if (dy === undefined) dy = dx;
	let width = bitmap.getWidth(),
		height = bitmap.getHeight();
	bitmap = android.graphics.Bitmap.createBitmap(bitmap, 0, 0, width, height);
	if (dy === undefined) return bitmap;
	return android.graphics.Bitmap.createScaledBitmap(bitmap, dx, dy, false);
};

BitmapFactory.createCompressed = function(bitmap, min, max) {
	if (max === undefined) max = min;
	let size = Interface.Display.HEIGHT > 480 ? Interface.Display.HEIGHT < 1080 ?
			min + Interface.Display.HEIGHT / 1560 * (max - min) : max : min,
		width = bitmap.getWidth(),
		height = bitmap.getHeight(),
		dx = Math.ceil(width * size),
		dy = Math.ceil(height * size);
	return this.createScaled(bitmap, dx, dy);
};

BitmapFactory.getBoundsDecodeOptions = function() {
	let options = new android.graphics.BitmapFactory.Options();
	options.inJustDecodeBounds = true;
	return options;
};

BitmapFactory.getPotatoOptions = function() {
	let options = new android.graphics.BitmapFactory.Options();
	options.inPreferredConfig = android.graphics.Bitmap.Config.ARGB_4444;
	return options;
};

const ImageFactory = new Object();

ImageFactory.loaded = new Object();
ImageFactory.drawables = new Object();
ImageFactory.tiles = new Object();
ImageFactory.resourcesCount = 0;

ImageFactory.loadFromAsset = function(key, path) {
	return tryoutSafety.call(this, function() {
		let potato = BitmapFactory.getPotatoOptions();
		let decoded = BitmapFactory.decodeAsset(path, potato);
		if (decoded === null) return decoded;
		this.loaded[key] = decoded;
		this.checkAndRetile(key);
		return key;
	}, function(e) {
		Logger.Log("ImageFactory failed to decode resource " + key, "WARNING");
	}, null);
};

ImageFactory.loadFromFile = function(key, path) {
	return tryoutSafety.call(this, function() {
		let potato = BitmapFactory.getPotatoOptions();
		let decoded = BitmapFactory.decodeFile(path, potato);
		if (decoded === null) return decoded;
		this.loaded[key] = decoded;
		this.checkAndRetile(key);
		return key;
	}, function(e) {
		Logger.Log("ImageFactory failed to decode file " + key, "WARNING");
	}, null);
};

ImageFactory.checkSize = function(file) {
	return tryoutSafety.call(this, function() {
		let options = BitmapFactory.getBoundsDecodeOptions();
		BitmapFactory.decodeFile(file, options);
		return [options.outWidth, options.outHeight];
	}, null);
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
	return this.loaded[key] || null;
};

ImageFactory.getDrawable = function(key) {
	if (this.drawables.hasOwnProperty(key)) {
		return this.drawables[key];
	}
	if (key instanceof android.graphics.drawable.Drawable) {
		return key;
	}
	let bitmap = this.getBitmap(key);
	if (bitmap === null) return null;
	let drawable = new android.graphics.drawable.BitmapDrawable(bitmap);
	drawable.setFilterBitmap(false);
	return drawable;
};

ImageFactory.getTintDrawable = function(drawable, color) {
	if (!(drawable instanceof android.graphics.drawable.Drawable)) {
		drawable = this.getDrawable(drawable);
	}
	if (drawable === null) return drawable;
	if (android.os.Build.VERSION.SDK_INT >= 29) {
		let filter = new android.graphics.BlendModeColorFilter(color, android.graphics.BlendMode.SRC_ATOP);
		drawable.setColorFilter(filter);
		return drawable;
	}
	drawable.setColorFilter(color, android.graphics.PorterDuff.Mode.SRC_ATOP);
	return drawable;
};

ImageFactory.clipAndMerge = function(background, foreground, level, orientate) {
	if (!(foreground instanceof android.graphics.drawable.Drawable)) {
		foreground = this.getDrawable(foreground);
	}
	if (!(background instanceof android.graphics.drawable.Drawable)) {
		background = this.getDrawable(background);
	}
	if (background === null && foreground == null) {
		return null;
	}
	if (orientate === undefined) orientate = 1;
	if (foreground !== null) {
		foreground = new android.graphics.drawable.ClipDrawable(foreground,
			orientate == 1 ? Interface.Gravity.LEFT : Interface.Gravity.BOTTOM, orientate);
		foreground.setLevel(preround(level, 0) || 1);
		if (background === null) return foreground;
	}
	if (background !== null) {
		background = new android.graphics.drawable.ClipDrawable(background,
			orientate == 1 ? Interface.Gravity.RIGHT : Interface.Gravity.TOP, orientate);
		background.setLevel(preround(10001 - level, 0) || 10000);
		if (foreground === null) return background;
	}
	return new android.graphics.drawable.LayerDrawable([background, foreground]);
};

ImageFactory.isLoaded = function(key) {
	return this.getBitmap(key) !== null;
};

ImageFactory.decodeAsAnimation = function(key, keys, time, oneshot) {
	return tryoutSafety.call(this, function() {
		let animation = new android.graphics.drawable.AnimationDrawable(),
			timeInFrames = typeof time != "number";
		if (oneshot) animation.setOneShot(true);
		for (let i = 0; i < keys.length; i++) {
			let drawable = this.getDrawable(keys[i]),
				ms = timeInFrames ? time[i] : time;
			animation.addFrame(drawable, ms);
		}
		this.drawables[key] = animation;
		this.checkAndRetile(key);
		animation.start();
		return key;
	}, function(e) {
		Logger.Log("ImageFactory failed to create animation for " + key, "WARNING");
	}, null);
};

ImageFactory.loadDirectory = function(key, pathOrExplore, explore) {
	if (key === undefined) {
		key = new String();
		pathOrExplore = new String();
		explore = true;
	} else if (pathOrExplore === undefined && explore == undefined) {
		pathOrExplore = new String();
		explore = true;
	} else if (typeof pathOrExplore == "boolean") {
		explore = pathOrExplore;
		pathOrExplore = new String();
	}
	let file = new java.io.File(Dirs.ASSET, pathOrExplore);
	if (!file.exists()) return null;
	let list = file.listFiles(),
		keys = new Array();
	for (let i = 0; i < list.length; i++) {
		let name = list[i].getName(),
			path = pathOrExplore.length == 0 ? name : pathOrExplore + "/" + name;
		name = Files.getNameWithoutExtension(name) || name;
		let current = key.length == 0 ? name : key;
		if (!current.toLowerCase().endsWith(name.toLowerCase())) {
			name = name.substring(0, 1).toUpperCase() + name.substring(1);
			current += name;
		}
		if (list[i].isDirectory()) {
			if (explore) this.loadDirectory(current, path, explore);
		} else if (list[i].getName().endsWith(".dnr")) {
			keys.push(this.loadFromAsset(current, path));
		}
	}
	return keys;
};

ImageFactory.prepareTileMode = function(key, xt, yt) {
	this.tiles[key] = new Array();
	xt !== undefined && this.tiles[key].push(xt);
	yt !== undefined && this.tiles[key].push(yt);
};

ImageFactory.checkAndRetile = function(key) {
	for (let item in this.tiles) {
		let tile = this.tiles[item];
		if (key.startsWith(item)) {
			let drawable = this.getDrawable(key);
			tile.length >= 1 && drawable.setTileModeX(tile[0]);
			tile.length >= 2 && drawable.setTileModeY(tile[1]);
			this.drawables[key] = drawable;
		}
	}
};

const AssetFactory = new Object();

AssetFactory.loaded = new Object();

AssetFactory.loadAsset = function(key, path) {
	return (this.loaded[key] = new java.io.File(Dirs.ASSET, path));
};

AssetFactory.createFont = function(key) {
	let loaded = this.getFile(key + "Font"),
		exists = loaded && loaded.exists();
	return exists ? android.graphics.Typeface.createFromFile(loaded) : android.graphics.Typeface.MONOSPACE;
};

AssetFactory.getFile = function(key) {
	return this.loaded[key] || null;
};
