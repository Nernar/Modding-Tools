const ControlFragment = function() {
	ImageFragment.apply(this, arguments);
	this.resetContainer();
};

ControlFragment.prototype = new ImageFragment;

ControlFragment.prototype.resetContainer = new Function();

ControlFragment.prototype.getImageView = function() {
	return this.findViewByTag("logotypeForeground");
};

ControlFragment.prototype.getContainerRoot = function() {
	return this.findViewByTag("logotypeBackground");
};

ControlFragment.Button = function() {
	ControlFragment.apply(this, arguments);
};

ControlFragment.Button.prototype = new ControlFragment;

ControlFragment.Button.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);
	
	let layout = new android.widget.LinearLayout(getContext());
	layout.setOrientation($.LinearLayout.VERTICAL);
	layout.setTag("logotypeBackground");
	$.ViewCompat.setTransitionName(layout, "logotypeBackground");
	let params = android.widget.FrameLayout.LayoutParams
		($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	params.setMargins(getDisplayPercentHeight(20), getDisplayPercentHeight(20), 0, 0);
	container.addView(layout, params);
	
	let button = new android.widget.ImageView(getContext());
	button.setPadding(getDisplayPercentHeight(15), getDisplayPercentHeight(15), getDisplayPercentHeight(15), getDisplayPercentHeight(15));
	button.setTag("logotypeForeground");
	$.ViewCompat.setTransitionName(button, "logotypeForeground");
	params = android.widget.LinearLayout.LayoutParams
		(getDisplayPercentHeight(100), getDisplayPercentHeight(100));
	layout.addView(button, params);
};

ControlFragment.CollapsedButton = function() {
	ControlFragment.Button.apply(this, arguments);
	this.setOffset(getDisplayPercentWidth(50));
};

ControlFragment.CollapsedButton.prototype = new ControlFragment.Button;

ControlFragment.CollapsedButton.prototype.setOffset = function(x, y) {
	let layout = this.getContainerRoot();
	if (x !== undefined) layout.setX(-Number(x));
	if (y !== undefined) layout.setY(-Number(y));
};

ControlFragment.Logotype = function() {
	ControlFragment.apply(this, arguments);
};

ControlFragment.Logotype.prototype = new ControlFragment;

ControlFragment.Logotype.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext()),
		params = android.widget.FrameLayout.LayoutParams
			($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT);
	container.setLayoutParams(params);
	this.setContainerView(container);
	
	let layout = new android.widget.LinearLayout(getContext());
	layout.setGravity($.Gravity.CENTER);
	layout.setTag("logotypeBackground");
	$.ViewCompat.setTransitionName(layout, "logotypeBackground");
	container.addView(layout);
	
	let logotype = new android.widget.ImageView(getContext());
	logotype.setTag("logotypeForeground");
	$.ViewCompat.setTransitionName(logotype, "logotypeForeground");
	params = new android.widget.LinearLayout.LayoutParams
		(getDisplayPercentHeight(320), getDisplayPercentHeight(320));
	layout.addView(logotype, params);
};

ControlFragment.Logotype.prototype.setLevel = function(level) {
	let logotype = this.getLogotypeView();
	if (logotype == null) return this;
	logotype.setImageLevel(level);
	return this;
};

ControlFragment.prototype.resetContainer = function() {
	MCSystem.throwException("ControlFragment must be superclass only");
};
