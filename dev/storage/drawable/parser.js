const DrawableFactory = new Object();

DrawableFactory.setAlpha = function(drawable, alpha) {
	drawable.setAlpha(Number(alpha));
};

DrawableFactory.setAntiAlias = function(drawable, enabled) {
	drawable.setAntiAlias(Boolean(enabled));
};

DrawableFactory.setAutoMirrored = function(drawable, enabled) {
	drawable.setAutoMirrored(Boolean(enabled));
};

DrawableFactory.setFilterBitmap = function(drawable, enabled) {
	drawable.setFilterBitmap(Boolean(enabled));
};

DrawableFactory.setTintColor = function(drawable, color) {
	color = ColorDrawable.parseColor(color);
	if (android.os.Build.VERSION.SDK_INT >= 29) {
		let filter = new android.graphics.BlendModeColorFilter(color, android.graphics.BlendMode.SRC_ATOP);
		drawable.setColorFilter(filter);
		return;
	}
	drawable.setColorFilter(color, android.graphics.PorterDuff.Mode.SRC_ATOP);
};

DrawableFactory.setMipMap = function(drawable, enabled) {
	drawable.setMipMap(Boolean(enabled));
};

DrawableFactory.setColorFilter = function(drawable, filter) {
	drawable.setColorFilter(filter);
};

DrawableFactory.setTileMode = function(drawable, modesOrX, y) {
	if (Array.isArray(modesOrX)) {
		y = modesOrX[1];
		modesOrX = modesOrX[0];
	}
	if (modesOrX === undefined) {
		modesOrX = Interface.TileMode.CLAMP;
	}
	if (y !== undefined) {
		drawable.setTileModeX(modesOrX);
		drawable.setTileModeY(y);
		return;
	}
	drawable.setTileModeXY(modesOrX);
};

DrawableFactory.setGravity = function(drawable, gravity) {
	drawable.setGravity(Number(gravity));
};

DrawableFactory.setLayoutDirection = function(drawable, direction) {
	drawable.setLayoutDirection(Number(direction));
};

DrawableFactory.setXfermode = function(drawable, mode) {
	drawable.setXfermode(mode);
};

DrawableFactory.setLevel = function(drawable, level) {
	return drawable.setLevel(Number(level));
};

DrawableFactory.setState = function(drawable, states) {
	if (!Array.isArray(states)) states = [states];
	states = states.map(function(state) {
		return Number(state);
	});
	return drawable.setState(states);
};

DrawableFactory.setVisible = function(drawable, first, second) {
	if (Array.isArray(first)) {
		second = first[1];
		first = first[0];
	}
	if (second === undefined) {
		second = first;
	}
	return drawable.setVisible(Boolean(first), Boolean(second));
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
		return new LayerDrawable(json);
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
