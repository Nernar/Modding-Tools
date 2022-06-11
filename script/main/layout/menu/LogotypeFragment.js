const LogotypeFragment = function() {
	ImageFragment.apply(this, arguments);
	this.resetContainer();
};

LogotypeFragment.prototype = new ImageFragment;

LogotypeFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(context);
	this.setContainerView(container);
	
	let layout = new android.widget.LinearLayout(context);
	layout.setGravity(Interface.Gravity.CENTER);
	container.addView(layout);
	
	let logotype = new android.widget.ImageView(context);
	logotype.setTag("logotype");
	let params = new android.widget.LinearLayout.LayoutParams
		(Interface.getY(320), Interface.getY(320));
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
