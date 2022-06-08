const ImageFragment = function() {
	BaseFragment.apply(this, arguments);
};

ImageFragment.prototype = new BaseFragment;
ImageFragment.prototype.TYPE = "ImageFragment";

ImageFragment.prototype.getImageView = function() {
	MCSystem.throwException("ModdingTools: " + this.TYPE + ".getImageView must be implemented");
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
	Interface.setTransitionName(image, src);
	src.attachAsImage(image);
	this.image = src;
	return this;
};
