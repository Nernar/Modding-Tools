const Frame = new Function();

Frame.prototype.getFragment = function() {
	return this.fragment || null;
};

Frame.prototype.setFragment = function(fragment) {
	let already = this.getFragment();
	if (already != null) MCSystem.throwException("Frame already has fragment");
	this.fragment = fragment;
};

Frame.prototype.getContainer = function() {
	let fragment = this.getFragment();
	if (fragment == null) return null;
	return fragment.getContainer();
};
