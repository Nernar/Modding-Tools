const ImageFragment = function() {
	BaseFragment.apply(this, arguments);
};

ImageFragment.prototype = new BaseFragment;
ImageFragment.prototype.TYPE = "ImageFragment";

ImageFragment.prototype.getImageView = function() {
	MCSystem.throwException("Dev Editor: " + this.TYPE + ".getImageView must be implemented");
};

ImageFragment.prototype.getImage = function() {
	return this.image || null;
};

ImageFragment.prototype.setImage = function(src) {
	let image = this.getImageView();
	if (image == null) return this;
	if (!(src instanceof Drawable)) {
		src = Drawable.parseJson.call(this, src);
	}
	$.ViewCompat.setTransitionName(image, src);
	src.attachAsImage(image);
	this.image = src;
	return this;
};

ImageFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ImageFragment)) {
		json = instanceOrJson;
		instanceOrJson = new ImageFragment();
	}
	instanceOrJson = BaseFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("icon")) {
		instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
	}
	return instanceOrJson;
};
