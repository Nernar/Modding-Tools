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

ImageFactory.getDrawable = function(key) {
	if (key) return new Drawable().toDrawable();
	MCSystem.throwException("Deprecated method");
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
