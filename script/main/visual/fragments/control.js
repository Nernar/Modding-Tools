const ControlFragment = function() {
	Fragment.apply(this, arguments);
	this.resetContainer();
};

ControlFragment.prototype = new Fragment;

ControlFragment.prototype.resetContainer = new Function();

ControlFragment.prototype.getLogotypeView = function() {
	return this.findViewByTag("logotypeForeground");
};

ControlFragment.prototype.getBackgroundView = function() {
	return this.findViewByTag("logotypeBackground");
};

ControlFragment.prototype.getIcon = function() {
	return this.drawable || null;
};

ControlFragment.prototype.setIcon = function(drawable) {
	let logotype = this.getLogotypeView();
	if (logotype == null) return this;
	if (!(drawable instanceof Drawable)) {
		drawable = Drawable.parseJson.call(this, drawable);
	}
	drawable.attachAsImage(logotype);
	this.drawable = drawable;
	return this;
};

ControlFragment.prototype.getBackground = function() {
	return this.background || null;
};

ControlFragment.prototype.setBackground = function(drawable) {
	let background = this.getBackgroundView();
	if (background === null) return this;
	if (!(drawable instanceof Drawable)) {
		drawable = Drawable.parseJson.call(this, drawable);
	}
	drawable.attachAsBackground(background);
	this.background = drawable;
	return this;
};

ControlFragment.prototype.setOnClickListener = function(action) {
	let container = this.getLogotypeView();
	if (container === null) return this;
	let instance = this;
	container.setOnClickListener(function() {
		tryout(function() {
			action && action(instance);
		});
	});
	return this;
};

ControlFragment.prototype.setOnHoldListener = function(action) {
	let container = this.getLogotypeView();
	if (container === null) return this;
	let instance = this;
	container.setOnLongClickListener(function() {
		return tryout(function() {
			return action && action(instance);
		}) || false;
	});
	return this;
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
	let layout = this.getBackgroundView();
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
