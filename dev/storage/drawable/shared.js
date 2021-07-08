const HashedDrawableMap = new Object();
HashedDrawableMap.attachedViews = new Object();
HashedDrawableMap.attachedAsImage = new Object();
HashedDrawableMap.attachedAsBackground = new Object();

HashedDrawableMap.isImageAttachedToView = function(view) {
	return this.attachedAsImage.hasOwnProperty(view);
};

HashedDrawableMap.isBackgroundAttachedToView = function(view) {
	return this.attachAsBackground.hasOwnProperty(view);
};

HashedDrawableMap.isAttachedToView = function(view) {
	return this.attachedViews.hasOwnProperty(view);
};

HashedDrawableMap.getDrawableAttachedToViewAsImage = function(view) {
	return this.attachedAsImage[view] || null;
};

HashedDrawableMap.getDrawableAttachedToViewAsBackground = function(view) {
	return this.attachedAsBackground[view] || null;
};

HashedDrawableMap.getAttachedViewsInMap = function(map, drawable) {
	let attached = new Array();
	if (map === null || typeof map != "object") {
		return attached;
	}
	for (let element in map) {
		if (map[element] == drawable) {
			let view = this.attachedViews[element];
			if (view != null) attached.push(view);
		}
	}
	return attached;
};

HashedDrawableMap.getAsImageAttachedViews = function(drawable) {
	return this.getAttachedViewsInMap(this.attachedAsImage, drawable);
};

HashedDrawableMap.getAsBackgroundAttachedViews = function(drawable) {
	return this.getAttachedViewsInMap(this.attachedAsBackground, drawable);
};

HashedDrawableMap.attachInMap = function(map, view, drawable) {
	let attached = false;
	if (!this.isAttachedToView(view)) {
		this.attachedViews[view] = view;
		attached = true;
	}
	if (!map.hasOwnProperty(view) || map[view] != drawable) {
		map[view] = drawable;
		return true;
	}
	return attached;
};

HashedDrawableMap.attachAsImage = function(view, drawable) {
	return this.attachInMap(this.attachedAsImage, view, drawable);
};

HashedDrawableMap.attachAsBackground = function(view, drawable) {
	return this.attachInMap(this.attachedAsBackground, view, drawable);
};

HashedDrawableMap.deattachInMap = function(map, view) {
	let deattached = false;
	if (map.hasOwnProperty(view)) {
		delete map[view];
		deattached = true;
	}
	if (!this.isAttachedToAsImage(view) && !this.isAttachedToAsBackground(view)) {
		delete this.attachedViews[view];
		return true;
	}
	return deattached;
};

HashedDrawableMap.deattachAsImage = function(view) {
	return this.deattachInMap(this.attachedAsImage, view);
};

HashedDrawableMap.deattachAsBackground = function(view) {
	return this.deattachInMap(this.attachedAsBackground, view);
};

const Drawable = new Function();

Drawable.prototype.isAttachedAsImage = function(view) {
	return HashedDrawableMap.getDrawableAttachedToViewAsImage(view) == this;
};

Drawable.prototype.isAttachedAsBackground = function(view) {
	return HashedDrawableMap.getDrawableAttachedToViewAsBackground(view) == this;
};

Drawable.prototype.toDrawable = function() {
	return null;
};

Drawable.prototype.attachAsImage = function(view, force) {
	if (view && view.setImageDrawable !== undefined) {
		if (force || HashedDrawableMap.attachAsImage(view, this)) {
			view.setImageDrawable(this.toDrawable());
			return true;
		}
	}
	return false;
};

Drawable.prototype.deattachAsImage = function(view) {
	if (view && view.setImageDrawable !== undefined) {
		if (HashedDrawableMap.getDrawableAttachedToViewAsImage(view) == this) {
			if (HashedDrawableMap.deattachAsImage(view)) {
				view.setImageDrawable(null);
				return true;
			}
		}
		return false;
	}
	let attached = HashedDrawableMap.getAsImageAttachedViews(this);
	for (let i = 0; i < attached.length; i++) {
		this.deattachAsImage(attached[i]);
	}
	return attached.length > 0;
};

Drawable.prototype.attachAsBackground = function(view, force) {
	if (view && view.setBackgroundDrawable !== undefined) {
		if (force || HashedDrawableMap.attachAsBackground(view, this)) {
			view.setBackgroundDrawable(this.toDrawable());
			return true;
		}
	}
	return false;
};

Drawable.prototype.deattachAsBackground = function(view) {
	if (view && view.setBackgroundDrawable !== undefined) {
		if (HashedDrawableMap.getDrawableAttachedToViewAsBackground(view) == this) {
			if (HashedDrawableMap.deattachAsBackground(view)) {
				view.setBackgroundDrawable(null);
				return true;
			}
		}
		return false;
	}
	let attached = HashedDrawableMap.getAsBackgroundAttachedViews(this);
	for (let i = 0; i < attached.length; i++) {
		this.deattachAsBackground(attached[i]);
	}
	return attached.length > 0;
};

Drawable.prototype.requestDeattach = function(view) {
	let deattached = this.deattachAsImage(view);
	return this.deattachAsBackground(view) || deattached;
};

Drawable.prototype.reattachAsImage = function(view) {
	if (view && view.setImageDrawable !== undefined) {
		return this.attachAsImage(view, true);
	}
	let attached = HashedDrawableMap.getAsImageAttachedViews();
	for (let i = 0; i < attached.length; i++) {
		this.attachAsImage(attached[i], true);
	}
	return attached.length > 0;
};

Drawable.prototype.reattachAsBackground = function() {
	if (view && view.setBackgroundDrawable !== undefined) {
		return this.attachAsBackground(view, true);
	}
	let attached = HashedDrawableMap.getAsBackgroundAttachedViews();
	for (let i = 0; i < attached.length; i++) {
		this.attachAsBackground(attached[i], true);
	}
	return attached.length > 0;
};

Drawable.prototype.requestReattach = function(view) {
	let attached = this.reattachAsImage(view);
	return this.reattachAsBackground(view) || attached;
};

Drawable.prototype.toString = function() {
	return "[Drawable " + this.toDrawable() + "]";
};

const CachedDrawable = function() {
	Drawable.call(this);
	if (this.cacheWhenCreate) {
		this.toDrawable();
	}
};

CachedDrawable.prototype = new Drawable;

CachedDrawable.prototype.cacheWhenCreate = false;

CachedDrawable.prototype.toDrawable = function() {
	if (!this.isProcessed()) {
		tryout.call(this, function() {
			this.source = this.process();
			this.describe(this.source);
		}, function(e) {
			Logger.Log("Failed to process drawable: " + e, "DEV-CORE");
		});
	}
	return this.source || null;
};

CachedDrawable.prototype.isProcessed = function() {
	return this.source !== undefined;
};

CachedDrawable.prototype.process = function() {
	MCSystem.throwException("CachedDrawable.process must be implemented");
};

CachedDrawable.prototype.getDescriptor = function() {
	return this.descriptor || null;
};

CachedDrawable.prototype.setDescriptor = function(descriptor) {
	if (descriptor !== null && typeof descriptor == "object") {
		this.descriptor = descriptor;
		this.requireDescribe();
	} else delete this.descriptor;
};

CachedDrawable.prototype.describe = function(drawable) {
	let descriptor = this.getDescriptor();
	if (descriptor !== null) {
		Drawable.applyDescribe.call(this, drawable, descriptor);
	}
};

CachedDrawable.prototype.requireDescribe = function() {
	if (this.isProcessed()) {
		this.describe(this.toDrawable());
		return;
	}
	this.toDrawable();
};

CachedDrawable.prototype.invalidate = function() {
	delete this.source;
	if (this.cacheWhenCreate) {
		this.toDrawable();
	}
	this.requestReattach();
};

const ScheduledDrawable = function() {
	CachedDrawable.call(this);
};

ScheduledDrawable.prototype = new CachedDrawable;

ScheduledDrawable.prototype.toDrawable = function() {
	let self = this;
	if (!this.isProcessed() && !this.isProcessing()) {
		this.thread = handleThread(function() {
			CachedDrawable.prototype.toDrawable.call(self);
			self.requestReattach();
			delete self.thread;
		});
	}
	return this.source || null;
};

ScheduledDrawable.prototype.getThread = function() {
	return this.thread || null;
};

ScheduledDrawable.prototype.isProcessing = function() {
	return this.thread !== undefined;
};

ScheduledDrawable.prototype.toString = function() {
	return "[ScheduledDrawable object]";
};
