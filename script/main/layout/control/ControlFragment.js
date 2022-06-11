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
	let container = new android.widget.FrameLayout(context);
	this.setContainerView(container);
	
	let layout = new android.widget.LinearLayout(context);
	layout.setOrientation(Interface.Orientate.VERTICAL);
	layout.setTag("logotypeBackground");
	Interface.setTransitionName(layout, "logotypeBackground");
	let params = android.widget.FrameLayout.LayoutParams
		(Interface.Display.WRAP, Interface.Display.WRAP);
	params.setMargins(Interface.getY(20), Interface.getY(20), 0, 0);
	container.addView(layout, params);
	
	let button = new android.widget.ImageView(context);
	button.setPadding(Interface.getY(15), Interface.getY(15), Interface.getY(15), Interface.getY(15));
	button.setTag("logotypeForeground");
	Interface.setTransitionName(button, "logotypeForeground");
	params = android.widget.LinearLayout.LayoutParams
		(Interface.getY(100), Interface.getY(100));
	layout.addView(button, params);
};

ControlFragment.CollapsedButton = function() {
	ControlFragment.Button.apply(this, arguments);
	this.setOffset(Interface.getX(50));
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
	let container = new android.widget.FrameLayout(context),
		params = android.widget.FrameLayout.LayoutParams
			(Interface.Display.MATCH, Interface.Display.MATCH);
	container.setLayoutParams(params);
	this.setContainerView(container);
	
	let layout = new android.widget.LinearLayout(context);
	layout.setGravity(Interface.Gravity.CENTER);
	layout.setTag("logotypeBackground");
	Interface.setTransitionName(layout, "logotypeBackground");
	container.addView(layout);
	
	let logotype = new android.widget.ImageView(context);
	logotype.setTag("logotypeForeground");
	Interface.setTransitionName(logotype, "logotypeForeground");
	params = new android.widget.LinearLayout.LayoutParams
		(Interface.getY(320), Interface.getY(320));
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
