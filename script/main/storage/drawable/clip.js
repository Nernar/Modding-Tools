const ClipDrawable = function(drawable, location, side) {
	if (drawable !== undefined) {
		this.setDrawable(drawable);
	}
	if (location !== undefined) {
		this.setLocation(location);
	}
	if (side !== undefined) {
		this.setSide(side);
	}
	ScheduledDrawable.call(this);
};

ClipDrawable.prototype = new ScheduledDrawable;

ClipDrawable.prototype.process = function() {
	let drawable = this.getDrawable();
	if (drawable !== undefined) {
		if (drawable instanceof ScheduledDrawable) {
			if (!drawable.isProcessed()) {
				drawable.toDrawable();
				while (drawable.isProcessing()) {
					java.lang.Thread.yield();
				}
			}
		}
		if (drawable instanceof Drawable) {
			drawable = drawable.toDrawable();
		}
	}
	return new android.graphics.drawable.ClipDrawable(drawable, this.getLocation(), this.getSide());
};

ClipDrawable.prototype.getDrawable = function() {
	return this.drawable !== undefined ? this.drawable : null;
};

ClipDrawable.prototype.setDrawable = function(drawable) {
	if (drawable !== undefined) {
		this.drawable = drawable;
	} else delete this.drawable;
	this.invalidate();
};

ClipDrawable.prototype.getLocation = function() {
	return this.location !== undefined ? this.location : Interface.Gravity.LEFT;
};

ClipDrawable.prototype.setLocation = function(location) {
	if (typeof location == "string") {
		location = Interface.Gravity.parse(location);
	}
	this.location = Number(location);
	this.invalidate();
};

ClipDrawable.prototype.getSide = function() {
	return this.side !== undefined ? this.side : ClipDrawable.Side.HORIZONTAL;
};

ClipDrawable.prototype.setSide = function(side) {
	if (typeof side == "string") {
		if (ClipDrawable.Side.hasOwnProperty(side)) {
			side = ClipDrawable.Side[side];
		}
	}
	this.side = Number(side);
	this.invalidate();
};

ClipDrawable.prototype.toString = function() {
	return "[ClipDrawable " + this.getDrawable() + "@" + this.getLocation() + ":" + this.getSide() + "]";
};

ClipDrawable.Side = new Object();
ClipDrawable.Side.HORIZONTAL = 1;
ClipDrawable.Side.VERTICAL = 2;

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
