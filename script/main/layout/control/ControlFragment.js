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
	params.setMargins(toComplexUnitDip(12), toComplexUnitDip(12), 0, 0);
	container.addView(layout, params);
	
	let button = new android.widget.ImageView(getContext());
	button.setPadding(toComplexUnitDip(10), toComplexUnitDip(10),
		toComplexUnitDip(10), toComplexUnitDip(10));
	button.setTag("logotypeForeground");
	$.ViewCompat.setTransitionName(button, "logotypeForeground");
	layout.addView(button, new android.widget.LinearLayout.LayoutParams
		(toComplexUnitDip(60), toComplexUnitDip(60)));
};

ControlFragment.CollapsedButton = function() {
	ControlFragment.Button.apply(this, arguments);
	this.setOffset(toComplexUnitDip(40));
};

ControlFragment.CollapsedButton.prototype = new ControlFragment.Button;

ControlFragment.CollapsedButton.prototype.setOffset = function(x, y) {
	let layout = this.getContainerRoot();
	if (x !== undefined) layout.setX(-x);
	if (y !== undefined) layout.setY(-y);
};

ControlFragment.Logotype = function() {
	ControlFragment.apply(this, arguments);
};

ControlFragment.Logotype.prototype = new ControlFragment;

ControlFragment.Logotype.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	container.setLayoutParams(new android.widget.FrameLayout.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));
	this.setContainerView(container);
	
	let layout = new android.widget.LinearLayout(getContext());
	layout.setGravity($.Gravity.CENTER);
	layout.setTag("logotypeBackground");
	layout.setMinimumWidth(getDisplayWidth());
	layout.setMinimumHeight(getDisplayHeight());
	$.ViewCompat.setTransitionName(layout, "logotypeBackground");
	container.addView(layout, new android.widget.FrameLayout.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));
	
	let logotype = new android.widget.ImageView(getContext());
	logotype.setTag("logotypeForeground");
	$.ViewCompat.setTransitionName(logotype, "logotypeForeground");
	layout.addView(logotype, new android.widget.LinearLayout.LayoutParams
		(toComplexUnitDip(208), toComplexUnitDip(208)));
};

ControlFragment.Logotype.prototype.setLevel = function(level) {
	let logotype = this.getLogotypeView();
	if (logotype == null) return this;
	logotype.setImageLevel(level);
	return this;
};

ControlFragment.prototype.resetContainer = function() {
	MCSystem.throwException("Dev Editor: ControlFragment must be superclass only");
};
