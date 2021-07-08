const BitmapDrawableFactory = new Object();
BitmapDrawableFactory.required = new Object();
BitmapDrawableFactory.mapped = new Object();

BitmapDrawableFactory.getMappedFileByKey = function(key) {
	return this.mapped[key] || null;
};

BitmapDrawableFactory.requireByKey = function(key) {
	if (this.required.hasOwnProperty(key)) {
		return this.required[key];
	}
	if (this.mapped.hasOwnProperty(key)) {
		let file = this.getMappedFileByKey(key);
		this.required[key] = BitmapFactory.decodeFile(file);
		return this.requireByKey(key);
	}
	return null;
};

BitmapDrawableFactory.generateKeyFor = function(path, root) {
	if (root === undefined) {
		let parent = new java.io.File(path).getParentFile();
		root = String(parent.getPath());
	}
	path = Files.shrinkPathes(root, path);
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

BitmapDrawableFactory.map = function(file, root) {
	if (file instanceof java.io.File) {
		file = file.getPath();
	}
	if (root === undefined) root = file;
	let key = this.generateKeyFor(file, root);
	this.mapped[key] = new java.io.File(file);
};

BitmapDrawableFactory.mapDirectory = function(file, explore, root) {
	if (file instanceof java.io.File) {
		file = file.getPath();
	}
	if (root === undefined) root = file;
	let entries = Files.listFileNames(file, explore, root);
	entries = Files.checkFormats(entries, [".dnr", ".png", ".jpg"]);
	for (let i = 0; i < entries.length; i++) {
		let entry = new java.io.File(root, entries[i]);
		this.map(entry, root);
	}
};

BitmapDrawableFactory.require = function(value) {
	if (value instanceof android.graphics.Bitmap) {
		return BitmapFactory.createScaled(value);
	} else if (value instanceof java.io.File) {
		return BitmapFactory.decodeFile(value);
	} else if (value.indexOf("/") != -1) {
		return BitmapFactory.decodeAsset(value);
	}
	return this.requireByKey(value);
};

const BitmapDrawable = function(bitmap) {
	if (bitmap !== undefined) {
		this.setBitmap(bitmap);
	}
	ScheduledDrawable.call(this);
};

BitmapDrawable.prototype = new ScheduledDrawable;

BitmapDrawable.prototype.process = function() {
	let bitmap = this.getBitmap();
	if (!(bitmap instanceof android.graphics.Bitmap)) {
		bitmap = BitmapDrawableFactory.require(bitmap);
	}
	return new android.graphics.drawable.BitmapDrawable(bitmap);
};

BitmapDrawable.prototype.describe = function(drawable) {
	drawable.setFilterBitmap(false);
	ScheduledDrawable.prototype.describe.apply(this, arguments);
};

BitmapDrawable.prototype.getBitmap = function() {
	return this.bitmap || null;
};

BitmapDrawable.prototype.setBitmap = function(bitmap) {
	if (bitmap !== undefined) {
		this.bitmap = bitmap;
	} else delete this.bitmap;
	this.invalidate();
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
	return instanceOrJson;
};
