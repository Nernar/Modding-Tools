const LogotypeFragment = function() {
	Fragment.apply(this, arguments);
	this.resetContainer();
};

LogotypeFragment.prototype = new Fragment;

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

LogotypeFragment.prototype.getLogotypeView = function() {
	return this.findViewByTag("logotype");
};

LogotypeFragment.prototype.getIcon = function() {
	return this.drawable || null;
};

LogotypeFragment.prototype.setIcon = function(drawable) {
	let logotype = this.getLogotypeView();
	if (logotype == null) return this;
	logotype.setImageDrawable(drawable);
	this.drawable = drawable;
	return this;
};

LogotypeFragment.prototype.setLevel = function(level) {
	let logotype = this.getLogotypeView();
	if (logotype == null) return this;
	logotype.setImageLevel(level);
	return this;
};
