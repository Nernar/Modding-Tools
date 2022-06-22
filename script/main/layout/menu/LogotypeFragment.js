const LogotypeFragment = function() {
	ImageFragment.apply(this, arguments);
	this.resetContainer();
};

LogotypeFragment.prototype = new ImageFragment;

LogotypeFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);
	
	let layout = new android.widget.LinearLayout(getContext());
	layout.setGravity($.Gravity.CENTER);
	container.addView(layout);
	
	let logotype = new android.widget.ImageView(getContext());
	logotype.setTag("logotype");
	let params = new android.widget.LinearLayout.LayoutParams
		(getDisplayPercentHeight(320), getDisplayPercentHeight(320));
	layout.addView(logotype, params);
};

LogotypeFragment.prototype.getImageView = function() {
	return this.findViewByTag("logotype");
};

LogotypeFragment.prototype.setLevel = function(level) {
	let logotype = this.getImageView();
	if (logotype == null) return this;
	logotype.setImageLevel(level);
	return this;
};
