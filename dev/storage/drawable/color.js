const ColorDrawable = function(color) {
	if (color !== undefined) {
		this.setColor(color);
	}
	CachedDrawable.call(this);
};

ColorDrawable.prototype = new CachedDrawable;

ColorDrawable.prototype.cacheWhenCreate = true;

ColorDrawable.prototype.process = function() {
	return new android.graphics.drawable.ColorDrawable(this.getColor());
};

ColorDrawable.prototype.getColor = function() {
	return this.color !== undefined ? this.color : Interface.Color.TRANSPARENT;
};

ColorDrawable.prototype.setColor = function(color) {
	if (color !== undefined) {
		this.color = ColorDrawable.parseColor(color);
	} else delete this.color;
	this.invalidate();
};

ColorDrawable.prototype.toString = function() {
	return "[ColorDrawable " + this.getColor() + "]";
};

ColorDrawable.parseColor = function(value) {
	if (typeof value == "number") {
		return value;
	} else if (value) {
		let stroke = String(value);
		if (stroke.startsWith("#")) {
			return Interface.Color.parse(stroke);
		}
		stroke = stroke.toUpperCase();
		if (Interface.Color.hasOwnProperty(stroke)) {
			return Interface.Color[stroke];
		}
	}
	return null;
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
