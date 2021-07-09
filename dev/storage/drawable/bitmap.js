const BitmapDrawableFactory = new Object();
BitmapDrawableFactory.required = new Object();
BitmapDrawableFactory.mapped = new Object();

BitmapDrawableFactory.getMappedFileByKey = function(key) {
	return this.mapped[key] || null;
};

BitmapDrawableFactory.requireByKey = function(key, options) {
	if (this.isRequired(key)) {
		return this.required[key];
	}
	if (this.mapped.hasOwnProperty(key)) {
		let file = this.getMappedFileByKey(key);
		this.required[key] = BitmapFactory.decodeFile(file, options);
		return this.requireByKey(key);
	}
	return null;
};

BitmapDrawableFactory.findMappedByTag = function(tag) {
	let mapped = new Array();
	for (let key in this.mapped) {
		if (tag == "*") {
			mapped.push(key);
			continue;
		}
		let element = String(key).toLowerCase();
		if (element.indexOf(tag) != -1) {
			mapped.push(key);
		}
	}
	return mapped;
};

BitmapDrawableFactory.getRequiredCount = function() {
	let count = 0;
	for (let element in this.required) {
		count++;
	}
	return count;
};

BitmapDrawableFactory.isRequired = function(key) {
	return this.required.hasOwnProperty(key);
};

BitmapDrawableFactory.generateKeyFor = function(path, root) {
	if (root === undefined) {
		let parent = new java.io.File(path).getParentFile();
		root = String(parent.getPath());
	}
	if (root != false) {
		path = Files.shrinkPathes(root, path);
	}
	let splited = String(path).split("/");
	let key, previous;
	do {
		let next = splited.shift();
		if (splited.length == 0) {
			next = Files.getNameWithoutExtension(next);
		}
		if (key === undefined) {
			key = next;
		} else if (previous != next) {
			key += next.charAt(0).toUpperCase();
			if (next.length > 1) {
				key += next.substring(1);
			}
		}
		previous = next;
	} while (splited.length > 0);
	if (key !== undefined) {
		return key.replace(/\W/g, new String());
	}
	MCSystem.throwException("Invalid path passed to BitmapDrawableFactory");
};

BitmapDrawableFactory.getMappedCount = function() {
	let count = 0;
	for (let element in this.mapped) {
		count++;
	}
	return count;
};

BitmapDrawableFactory.isMapped = function(key) {
	return this.mapped.hasOwnProperty(key);
};

BitmapDrawableFactory.map = function(file, root) {
	if (file instanceof java.io.File) {
		file = file.getPath();
	}
	if (root === undefined) root = file;
	let key = this.generateKeyFor(file, root);
	return this.mapAs(key, file);
};

BitmapDrawableFactory.mapAs = function(key, file) {
	if (!(file instanceof java.io.File)) {
		file = new java.io.File(file);
	}
	this.mapped[key] = file;
	return key;
};

BitmapDrawableFactory.mapDirectory = function(file, explore, root) {
	let mapped = new Array();
	if (file instanceof java.io.File) {
		file = file.getPath();
	}
	if (root === undefined) root = file;
	let entries = Files.listFileNames(file, explore, root);
	entries = Files.checkFormats(entries, [".dnr", ".png", ".jpg"]);
	for (let i = 0; i < entries.length; i++) {
		let entry = new java.io.File(root, entries[i]);
		mapped.push(this.map(entry, root));
	}
	return mapped;
};

BitmapDrawableFactory.require = function(value, options) {
	if (value instanceof android.graphics.Bitmap) {
		if (this.isRequired(value)) return this.required[value];
		return this.required[value] = value;
	} else if (String(value).endsWith(".dnr")) {
		if (this.isRequired(value)) return this.required[value];
		let asset = BitmapFactory.decodeAsset(value, options);
		return this.required[value] = asset;
	} else if (String(value).indexOf("/") != -1 || (value instanceof java.io.File)) {
		if (this.isRequired(value)) return this.required[value];
		let file = BitmapFactory.decodeFile(value, options);
		return this.required[value] = file;
	}
	return this.requireByKey(value, options);
};

BitmapDrawableFactory.wrap = function(value, options) {
	let required = this.require(value, options);
	if (required === null) return required;
	return BitmapFactory.createScaled(required);
};

BitmapDrawableFactory.sameAs = function(from, to) {
	if (to instanceof android.graphics.Bitmap) {
		if (from instanceof android.graphics.Bitmap) {
			return from.sameAs(to);
		}
	}
	if (from instanceof java.io.File) {
		from = from.getPath();
	}
	if (to instanceof java.io.File) {
		to = to.getPath();
	}
	return from == to;
};

BitmapDrawableFactory.recycle = function(key) {
	if (this.isRequired(key)) {
		let required = this.required[key];
		if (required && !required.isRecycled()) {
			required.recycle();
		}
		return delete this.required[key];
	}
	return false;
};

BitmapDrawableFactory.recycleRequired = function() {
	for (let key in this.required) {
		this.recycle(key);
	}
};

const BitmapDrawable = function(bitmap, options) {
	if (bitmap !== undefined) {
		this.setBitmap(bitmap);
	}
	if (options !== undefined) {
		this.setOptions(options);
	}
	ScheduledDrawable.call(this);
};

BitmapDrawable.prototype = new ScheduledDrawable;

BitmapDrawable.prototype.process = function() {
	let bitmap = this.getBitmap(),
		options = this.getOptions();
	// TODO: this.recycle();
	if (bitmap !== null) {
		bitmap = BitmapDrawableFactory.wrap(bitmap, options);
		if (!(bitmap instanceof android.graphics.Bitmap)) {
			bitmap = this.getCorruptedThumbnail();
			if (bitmap !== null) {
				bitmap = BitmapDrawableFactory.wrap(bitmap, options);
			}
		}
		this.wrapped = bitmap;
	}
	return new android.graphics.drawable.BitmapDrawable(bitmap);
};

BitmapDrawable.prototype.describe = function(drawable) {
	drawable.setFilterBitmap(false);
	drawable.setAntiAlias(false);
	ScheduledDrawable.prototype.describe.apply(this, arguments);
};

BitmapDrawable.prototype.getBitmap = function() {
	return this.bitmap || null;
};

BitmapDrawable.prototype.setBitmap = function(bitmap) {
	if (BitmapDrawableFactory.sameAs(this.bitmap, bitmap)) {
		return;
	}
	if (bitmap !== undefined) {
		this.bitmap = bitmap;
	} else delete this.bitmap;
	this.invalidate();
};

BitmapDrawable.prototype.getWrappedBitmap = function() {
	return this.wrapped || null;
};

BitmapDrawable.prototype.getOptions = function() {
	return this.options || null;
};

BitmapDrawable.prototype.setOptions = function(options) {
	if (options !== undefined) {
		this.options = options;
	} else delete this.options;
};

BitmapDrawable.prototype.getCorruptedThumbnail = function() {
	return this.corrupted !== undefined ? this.corrupted : "menuBoardWarning";
};

BitmapDrawable.prototype.setCorruptedThumbnail = function(bitmap) {
	if (BitmapDrawableFactory.sameAs(this.corrupted, bitmap)) {
		return;
	}
	if (bitmap !== undefined) {
		this.corrupted = bitmap;
	} else delete this.corrupted;
	this.invalidate();
};

BitmapDrawable.prototype.recycle = function() {
	let wrapped = this.getWrappedBitmap();
	if (wrapped !== null) wrapped.recycle();
	delete this.wrapped;
};

BitmapDrawable.prototype.requestDeattach = function() {
	let state = ScheduledDrawable.prototype.requestDeattach.call(this);
	if (!this.isAttached()) {
		delete this.source;
		this.recycle();
		return true;
	}
	return state;
};

BitmapDrawable.prototype.toString = function() {
	return "[BitmapDrawable " + this.getBitmap() + "]";
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
