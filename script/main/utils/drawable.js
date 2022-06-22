BitmapFactory.createCompressed = function(bitmap, min, max) {
	if (max === undefined) max = min;
	let size = getDisplayHeight() > 480 ? getDisplayHeight() < 1080 ?
			min + getDisplayHeight() / 1560 * (max - min) : max : min,
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

let BITSET_PATCH = {};

const registerBitsetUi = function(json) {
	if (json == null || typeof json != "object") {
		MCSystem.throwException("Registered bitset must be object { moduleBitset: .. }");
	}
	for (let element in json) {
		if (BITSET_PATCH.hasOwnProperty(element)) {
			Logger.Log("Bitset " + element + " already registered", "WARNING");
			continue;
		}
		BITSET_PATCH[element] = "" + json[element];
	}
};

const ImageFactory = {};

ImageFactory.getDrawable = function(key) {
	if (key) return new Drawable().toDrawable();
	MCSystem.throwException("Deprecated method");
};

ImageFactory.clipAndMerge = function(background, foreground, level, orientate) {
	if (!(foreground instanceof android.graphics.drawable.Drawable)) {
		foreground = Drawable.parseJson(foreground);
	}
	if (!(background instanceof android.graphics.drawable.Drawable)) {
		background = Drawable.parseJson(background);
	}
	if (background === null && foreground == null) {
		return null;
	}
	if (orientate === undefined) orientate = 1;
	if (foreground !== null) {
		foreground = new ClipDrawable(foreground,
			orientate == 1 ? $.Gravity.LEFT : $.Gravity.BOTTOM,
			orientate || 0);
		DrawableFactory.setLevel(foreground.toDrawableInThread(), preround(level, 0) || 1);
		if (background === null) return foreground;
	}
	if (background !== null) {
		background = new ClipDrawable(background,
			orientate == 1 ? $.Gravity.RIGHT : $.Gravity.TOP,
			orientate || 0);
		DrawableFactory.setLevel(background.toDrawableInThread(), preround(10001 - level, 0) || 10000);
		if (foreground === null) return background;
	}
	return LayerDrawable.parseJson([background, foreground]);
};

const AssetFactory = {};

AssetFactory.loaded = {};

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

LayerDrawable.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof LayerDrawable)) {
		json = instanceOrJson;
		instanceOrJson = new LayerDrawable();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (Array.isArray(json)) {
		for (let i = 0; i < json.length; i++) {
			let layer = calloutOrParse(json, json[i], [this, instanceOrJson]);
			instanceOrJson.addLayer(Drawable.parseJson.call(this, layer));
		}
		return instanceOrJson;
	}
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("layers")) {
		let layers = calloutOrParse(json, json.layers, [this, instanceOrJson]);
		if (layers !== null && typeof layers == "object") {
			if (!Array.isArray(layers)) layers = [layers];
			for (let i = 0; i < layers.length; i++) {
				let layer = calloutOrParse(layers, layers[i], [this, json, instanceOrJson]);
				instanceOrJson.addLayer(Drawable.parseJson.call(this, layer));
			}
		}
	}
	return instanceOrJson;
};

ClipDrawable.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ClipDrawable)) {
		json = instanceOrJson;
		instanceOrJson = new ClipDrawable();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("drawable")) {
		let drawable = calloutOrParse(json, json.drawable, [this, instanceOrJson]);
		instanceOrJson.setDrawable(Drawable.parseJson.call(this, drawable));
	}
	if (json.hasOwnProperty("location")) {
		instanceOrJson.setLocation(calloutOrParse(json, json.location, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("side")) {
		instanceOrJson.setSide(calloutOrParse(json, json.side, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

ColorDrawable.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ColorDrawable)) {
		json = instanceOrJson;
		instanceOrJson = new ColorDrawable();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		if (json !== null && json !== undefined) {
			instanceOrJson.setColor(json);
		}
		return instanceOrJson;
	}
	if (json.hasOwnProperty("color")) {
		instanceOrJson.setColor(calloutOrParse(json, json.color, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

BitmapDrawable.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof BitmapDrawable)) {
		json = instanceOrJson;
		instanceOrJson = new BitmapDrawable();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		if (json !== null && json !== undefined) {
			instanceOrJson.setBitmap(json);
		}
		return instanceOrJson;
	}
	if (json.hasOwnProperty("bitmap")) {
		instanceOrJson.setBitmap(calloutOrParse(json, json.bitmap, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("options")) {
		instanceOrJson.setOptions(calloutOrParse(json, json.options, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("corrupted")) {
		instanceOrJson.setCorruptedBitmap(calloutOrParse(json, json.corrupted, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

AnimationDrawable.applyDescribe = function(drawable, json) {
	if (drawable === null) MCSystem.throwException(null);
	if (json.hasOwnProperty("enterFadeDuration")) {
		AnimationDrawableFactory.setEnterFadeDuration(drawable, calloutOrParse(json, json.enterFadeDuration, this));
	}
	if (json.hasOwnProperty("exitFadeDuration")) {
		AnimationDrawableFactory.setExitFadeDuration(drawable, calloutOrParse(json, json.exitFadeDuration, this));
	}
	if (json.hasOwnProperty("oneShot")) {
		AnimationDrawableFactory.setOneShot(drawable, calloutOrParse(json, json.oneShot, this));
	}
};

AnimationDrawable.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof AnimationDrawable)) {
		json = instanceOrJson;
		instanceOrJson = new AnimationDrawable();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (Array.isArray(json)) {
		for (let i = 0; i < json.length; i++) {
			let frame = calloutOrParse(json, json[i], [this, instanceOrJson]);
			instanceOrJson.addFrame(Drawable.parseJson.call(this, frame));
		}
		return instanceOrJson;
	}
	if (json === null || typeof json != "object") {
		if (typeof json == "number") {
			instanceOrJson.setDefaultDuration(json);
		}
		return instanceOrJson;
	}
	if (json.hasOwnProperty("frames")) {
		let frames = calloutOrParse(json, json.frames, [this, instanceOrJson]);
		if (frames !== null && typeof frames == "object") {
			if (!Array.isArray(frames)) frames = [frames];
			for (let i = 0; i < frames.length; i++) {
				let frame = calloutOrParse(frames, frames[i], [this, json, instanceOrJson]);
				if (frame !== null && typeof frame == "object") {
					if (frame.hasOwnProperty("duration")) {
						let duration = calloutOrParse(frame, frame.duration, [this, json, instanceOrJson]);
						instanceOrJson.addFrame(Drawable.parseJson.call(this, frame), duration);
						continue;
					}
				}
				instanceOrJson.addFrame(Drawable.parseJson.call(this, frame));
			}
		}
	}
	if (json.hasOwnProperty("duration")) {
		instanceOrJson.setDefaultDuration(calloutOrParse(json, json.duration, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("startingWhenProcess")) {
		instanceOrJson.setIsStartingWhenProcess(calloutOrParse(json, json.startingWhenProcess, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("stoppingWhenCompleted")) {
		instanceOrJson.setIsStoppingWhenCompleted(calloutOrParse(json, json.stoppingWhenCompleted, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

Drawable.applyDescribe = function(drawable, json) {
	if (drawable === null) MCSystem.throwException(null);
	if (json.hasOwnProperty("alpha")) {
		DrawableFactory.setAlpha(drawable, calloutOrParse(json, json.alpha, this));
	}
	if (json.hasOwnProperty("alias")) {
		DrawableFactory.setAntiAlias(drawable, calloutOrParse(json, json.alias, this));
	}
	if (json.hasOwnProperty("mirrored")) {
		DrawableFactory.setAutoMirrored(drawable, calloutOrParse(json, json.mirrored, this));
	}
	if (json.hasOwnProperty("interpolation")) {
		DrawableFactory.setFilterBitmap(drawable, calloutOrParse(json, json.interpolation, this));
	}
	if (json.hasOwnProperty("tint")) {
		DrawableFactory.setTintColor(drawable, calloutOrParse(json, json.tint, this));
	}
	if (json.hasOwnProperty("mipmap")) {
		DrawableFactory.setMipMap(drawable, calloutOrParse(json, json.mipmap, this));
	}
	if (json.hasOwnProperty("filter")) {
		DrawableFactory.setColorFilter(drawable, calloutOrParse(json, json.filter, this));
	}
	if (json.hasOwnProperty("tile")) {
		DrawableFactory.setTileMode(drawable, calloutOrParse(json, json.tile, this));
	}
	if (json.hasOwnProperty("gravity")) {
		DrawableFactory.setGravity(drawable, calloutOrParse(json, json.gravity, this));
	}
	if (json.hasOwnProperty("direction")) {
		DrawableFactory.setLayoutDirection(drawable, calloutOrParse(json, json.direction, this));
	}
	if (json.hasOwnProperty("xfermode")) {
		DrawableFactory.setXfermode(drawable, calloutOrParse(json, json.xfermode, this));
	}
	if (json.hasOwnProperty("level")) {
		DrawableFactory.setLevel(drawable, calloutOrParse(json, json.level, this));
	}
	if (json.hasOwnProperty("state")) {
		DrawableFactory.setState(drawable, calloutOrParse(json, json.state, this));
	}
	if (json.hasOwnProperty("visible")) {
		DrawableFactory.setVisible(drawable, calloutOrParse(json, json.visible, this));
	}
};

Drawable.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof Drawable)) {
		json = instanceOrJson;
		instanceOrJson = new Drawable();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		if (json !== null && json !== undefined) {
			let color = ColorDrawable.parseColor(json);
			if (color !== null) return new ColorDrawable(color);
			return new BitmapDrawable(json);
		}
		return instanceOrJson;
	}
	if (Array.isArray(json)) {
		return LayerDrawable.parseJson.call(this, json);
	}
	if (instanceOrJson instanceof BitmapDrawable) {
		instanceOrJson = BitmapDrawable.parseJson.call(this, instanceOrJson, json);
	} else if (instanceOrJson instanceof ColorDrawable) {
		instanceOrJson = ColorDrawable.parseJson.call(this, instanceOrJson, json);
	} else if (instanceOrJson instanceof ClipDrawable) {
		instanceOrJson = ClipDrawable.parseJson.call(this, instanceOrJson, json);
	} else if (instanceOrJson instanceof LayerDrawable) {
		instanceOrJson = LayerDrawable.parseJson.call(this, instanceOrJson, json);
	} else if (instanceOrJson instanceof AnimationDrawable) {
		instanceOrJson = AnimationDrawable.parseJson.call(this, instanceOrJson, json);
	} else {
		if (json.hasOwnProperty("bitmap")) {
			instanceOrJson = BitmapDrawable.parseJson.call(this, json);
		} else if (json.hasOwnProperty("color")) {
			instanceOrJson = ColorDrawable.parseJson.call(this, json);
		} else if (json.hasOwnProperty("side") || json.hasOwnProperty("location")) {
			instanceOrJson = ClipDrawable.parseJson.call(this, json);
		} else if (json.hasOwnProperty("layers")) {
			instanceOrJson = LayerDrawable.parseJson.call(this, json);
		} else if (json.hasOwnProperty("frames")) {
			instanceOrJson = AnimationDrawable.parseJson.call(this, json);
		}
	}
	if (instanceOrJson instanceof CachedDrawable) {
		instanceOrJson.setDescriptor(json);
	}
	return instanceOrJson;
};

BitmapFactory.__decodeFile = BitmapFactory.decodeFile;
BitmapFactory.decodeFile = function(path, options) {
	let file = path instanceof java.io.File ? path : new java.io.File(path);
	let self = this;
	let args = arguments;
	return tryout.call(this, function() {
		if (file.getName().endsWith(".dnr")) {
			let bytes = Files.readBytes(file);
			return this.decodeResource(bytes, options);
		}
		return BitmapFactory.__decodeFile.apply(self, args);
	}, function(e) {
		Logger.Log("BitmapFactory failed to decode file " + file.getName(), "WARNING");
	}, null);
};

BitmapDrawableFactory.MIME_TYPES.push(".dnr");

BitmapFactory.decodeResource = function(bytes, options) {
	return tryout.call(this, function() {
		let decoded = decodeResource(bytes);
		return this.decodeBytes(decoded, options);
	}, function(e) {
		Logger.Log("BitmapFactory failed to decode resource " + bytes, "WARNING");
	}, null);
};

const fetchResourceOverridesIfNeeded = function(path) {
	tryout(function() {
		let file = new java.io.File(path, "bitset.json");
		if (file.exists()) {
			let json = JSON.parse(Files.read(file));
			for (let element in json) {
				if (BITSET_PATCH.hasOwnProperty(element)) {
					continue;
				}
				BITSET_PATCH[element] = "" + json[element];
			}
		}
	});
};

BitmapDrawableFactory.__mapDirectory = BitmapDrawableFactory.mapDirectory;
BitmapDrawableFactory.mapDirectory = function(path, explore, root) {
	fetchResourceOverridesIfNeeded(path);
	return BitmapDrawableFactory.__mapDirectory.apply(this, arguments);
};
