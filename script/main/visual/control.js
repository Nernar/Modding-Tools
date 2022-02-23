const ControlButton = function() {
	let window = UniqueWindow.apply(this, arguments);
	window.resetContent();
	window.setBackground("popupButton");

	let actor = new android.transition.Fade();
	actor.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	actor.setDuration(400);
	window.setEnterTransition(actor);

	actor = new android.transition.Slide(Interface.Gravity.LEFT);
	actor.setInterpolator(new android.view.animation.AccelerateInterpolator());
	actor.setDuration(400);
	window.setExitTransition(actor);
	return window;
};

ControlButton.prototype = new UniqueWindow;
ControlButton.prototype.TYPE = "ControlButton";

ControlButton.prototype.unclose = true;

ControlButton.prototype.resetContent = function() {
	let scope = this,
		views = this.views = new Object();
	let content = new android.widget.FrameLayout(context);
	this.setContent(content);

	views.layout = new android.widget.LinearLayout(context);
	views.layout.setOrientation(Interface.Orientate.VERTICAL);
	views.layout.setOnClickListener(function(view) {
		scope.isCloseableOutside() && scope.hide();
		scope.__click && scope.__click();
	});
	views.layout.setOnLongClickListener(function(view) {
		RuntimeCodeEvaluate.showSpecifiedDialog();
		return true;
	});
	let params = android.widget.FrameLayout.LayoutParams(Interface.Display.WRAP, Interface.Display.WRAP);
	params.setMargins(Interface.getY(20), Interface.getY(20), 0, 0);
	content.addView(views.layout, params);

	views.button = new android.widget.ImageView(context);
	views.button.setPadding(Interface.getY(15), Interface.getY(15), Interface.getY(15), Interface.getY(15));
	params = android.widget.LinearLayout.LayoutParams(Interface.getY(100), Interface.getY(100));
	views.layout.addView(views.button, params);
};

ControlButton.prototype.setBackground = function(drawable) {
	let layout = this.views.layout;
	if (!(drawable instanceof Drawable)) {
		drawable = Drawable.parseJson.call(this, drawable);
	}
	drawable.attachAsBackground(layout);
	this.background = drawable;
};

ControlButton.prototype.getBackground = function() {
	return this.background || null;
};

ControlButton.prototype.setIcon = function(drawable) {
	let button = this.views.button;
	if (!(drawable instanceof Drawable)) {
		drawable = Drawable.parseJson.call(this, drawable);
	}
	drawable.attachAsImage(button);
	this.icon = drawable;
};

ControlButton.prototype.getIcon = function() {
	return this.icon || null;
};

ControlButton.prototype.setOnClickListener = function(listener) {
	this.__click = function() {
		tryout(listener);
	};
};

ControlButton.prototype.isCloseableOutside = function() {
	return this.unclose;
};

ControlButton.prototype.setCloseableOutside = function(state) {
	this.unclose = !!state;
};

const ControlWindow = function() {
	let window = UniqueWindow.apply(this, arguments);
	window.setFragment(new FrameFragment());
	window.resetContent();
	window.setButtonBackground("popupButton");
	return window;
};

ControlWindow.prototype = new UniqueWindow;
ControlWindow.prototype.TYPE = "ControlWindow";

ControlWindow.prototype.resetContent = function() {
	let button = new ControlFragment.Button(),
		collapsed = new ControlFragment.CollapsedButton(),
		queued = new ControlFragment.Logotype();
	this.button = button;
	this.collapsed = collapsed;
	this.queued = queued;
	let instance = this;
	button.setOnClickListener(function() {
		instance.onButtonClick && instance.onButtonClick();
		if (instance.isHideableInside()) instance.hide();
	});
	collapsed.setOnClickListener(function() {
		instance.onCollapsedButtonClick && instance.onCollapsedButtonClick();
	});
	button.setOnHoldListener(function() {
		return instance.onButtonHold && instance.onButtonHold();
	});
	collapsed.setOnHoldListener(function() {
		return instance.onCollapsedButtonHold && instance.onCollapsedButtonHold();
	});
	let behold = this.makeScene(button.getContainer()),
		collapse = this.makeScene(collapsed.getContainer()),
		queue = this.makeScene(queued.getContainer());
	this.behold = behold;
	this.collapse = collapse;
	this.queue = queue;
	let minimize = this.getCollapseTransition();
	this.setTransition(behold, collapse, minimize);
	this.setTransition(collapse, behold, minimize);
	let transform = this.getTransformTransition();
	this.setTransition(behold, queue, transform);
	this.setTransition(behold, collapse, transform);
	let actor = this.getTransformTransition();
	actor.addListener({
		onTransitionEnd: function() {
			tryout(function() {
				if (instance.isMayTouched()) {
					UniqueWindow.prototype.setTouchable.call(instance, true);
				}
				instance.setWidth(Interface.Display.WRAP);
				instance.setHeight(Interface.Display.WRAP);
			});
		}
	});
	this.setTransition(queue, behold, actor);
	this.setTransition(queue, collapse, actor);
};

ControlWindow.prototype.getButtonFragment = function() {
	return this.button || null;
};

ControlWindow.prototype.getCollapsedButtonFragment = function() {
	return this.collapsed || null;
};

ControlWindow.prototype.getButtonFragments = function() {
	let array = new Array();
	array.push(this.getButtonFragment());
	array.push(this.getCollapsedButtonFragment());
	return array;
};

ControlWindow.prototype.getLogotypeFragment = function() {
	return this.queued || null;
};

ControlWindow.prototype.getBeholdScene = function() {
	return this.behold || null;
};

ControlWindow.prototype.getCollapseScene = function() {
	return this.collapse || null;
};

ControlWindow.prototype.getQueueScene = function() {
	return this.queue || null;
};

ControlWindow.prototype.makeContainerScene = function() {
	let fragment = this.getFragment();
	if (fragment == this.getButtonFragment()) {
		return this.getBeholdScene();
	} else if (fragment == this.getCollapsedButtonFragment()) {
		return this.getCollapseScene();
	} else if (fragment == this.getLogotypeFragment()) {
		return this.getQueueScene();
	}
	return UniqueWindow.prototype.makeContainerScene.apply(this, arguments);
};

ControlWindow.prototype.getButtonEnterTransition = function() {
	let actor = new android.transition.Fade();
	actor.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	actor.setDuration(400);
	return actor;
};

ControlWindow.prototype.getButtonExitTransition = function() {
	let actor = new android.transition.Slide(Interface.Gravity.LEFT);
	actor.setInterpolator(new android.view.animation.AccelerateInterpolator());
	actor.setDuration(400);
	return actor;
};

ControlWindow.prototype.getLogotypeEnterTransition = function() {
	let actor = new android.transition.Fade();
	actor.setInterpolator(new android.view.animation.DecelerateInterpolator());
	actor.setDuration(2000);
	return actor;
};

ControlWindow.prototype.getLogotypeExitTransition = function() {
	let actor = new android.transition.Fade();
	actor.setInterpolator(new android.view.animation.AccelerateInterpolator());
	actor.setDuration(500);
	return actor;
};

ControlWindow.prototype.getTransformTransition = function() {
	let actor = new android.transition.TransitionSet(),
		bounds = new android.transition.ChangeBounds();
	bounds.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	bounds.setDuration(1000);
	actor.addTransition(bounds);
	let transform = new android.transition.ChangeTransform();
	transform.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	transform.setDuration(1000);
	actor.addTransition(transform);
	return actor;
};

ControlWindow.prototype.getCollapseTransition = function() {
	let actor = new android.transition.ChangeTransform();
	actor.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	actor.setDuration(600);
	return actor;
};

ControlWindow.prototype.level = 10000;

ControlWindow.prototype.getLevel = function() {
	return this.level !== undefined ? this.level : 10000;
};

ControlWindow.prototype.setLevel = function(level) {
	if (level == this.getLevel()) return;
	this.level = preround(level, 0);
	if (this.isOpened()) this.updateLevel();
};

ControlWindow.prototype.orientate = 2;

ControlWindow.prototype.getOrientation = function() {
	return this.orientate !== undefined ? this.orientate : 2;
};

ControlWindow.prototype.setOrientation = function(orientate) {
	this.orientate = preround(Number(orientate), 0);
	if (this.isOpened()) this.updateProgress();
};

ControlWindow.prototype.getProgress = function() {
	return preround(this.getLevel() / 100, 2);
};

ControlWindow.prototype.setProgress = function(progress) {
	this.setLevel(Number(progress) * 100);
};

ControlWindow.prototype.getIcon = function() {
	let fragment = this.getFragment();
	if (fragment === null) return null;
	return fragment.getIcon();
};

ControlWindow.prototype.getForegroundIcon = function() {
	return this.foregroundIcon || null;
};

ControlWindow.prototype.setForegroundIcon = function(src) {
	this.foregroundIcon = src;
	if (this.isOpened()) this.updateProgress();
};

ControlWindow.prototype.getBackgroundIcon = function() {
	return this.backgroundIcon || null;
};

ControlWindow.prototype.setBackgroundIcon = function(src) {
	this.backgroundIcon = src;
	if (this.isOpened()) this.updateProgress();
};

ControlWindow.prototype.updateProgress = function(force) {
	let fragment = this.getLogotypeFragment();
	if (fragment === null) return false;
	let drawable = ImageFactory.clipAndMerge(this.getBackgroundIcon(), this.getForegroundIcon(), this.getLevel(), this.getOrientation());
	fragment.setIcon(drawable);
	if (drawable instanceof android.graphics.drawable.ClipDrawable) {
		if (!force) return this.updateLevel();
	}
	return true;
};

ControlWindow.prototype.updateLevel = function() {
	let fragment = this.getLogotypeFragment();
	if (fragment === null) return false;
	if (this.getBackgroundIcon() !== null && this.getForegroundIcon() !== null) {
		this.updateProgress(true);
	} else if (this.getBackgroundIcon() !== null) {
		fragment.setLevel(10001 - this.getLevel());
	} else fragment.setLevel(this.getLevel());
	return true;
};

ControlWindow.prototype.setButtonIcon = function(src) {
	let founded = this.getButtonFragments();
	for (let i = 0; i < founded.length; i++) {
		founded[i].setIcon(src);
	}
	this.buttonIcon = src;
};

ControlWindow.prototype.getButtonIcon = function() {
	return this.buttonIcon || null;
};

ControlWindow.prototype.setButtonBackground = function(src) {
	let founded = this.getButtonFragments();
	for (let i = 0; i < founded.length; i++) {
		founded[i].setBackground(src);
	}
	this.buttonBackground = src;
};

ControlWindow.prototype.getButtonBackground = function() {
	return this.buttonBackground || null;
};

ControlWindow.prototype.setLogotypeBackground = function(src) {
	let fragment = this.getLogotypeFragment();
	if (fragment === null) return;
	fragment.setBackground(src);
	this.logotypeBackground = src;
};

ControlWindow.prototype.getLogotypeBackground = function() {
	return this.logotypeBackground || null;
};

ControlWindow.prototype.setOnButtonClickListener = function(action) {
	if (typeof action != "function") {
		return delete this.onButtonClick;
	}
	this.onButtonClick = function() {
		tryout.call(this, action);
	};
	return true;
};

ControlWindow.prototype.setOnCollapsedButtonClickListener = function(action) {
	if (typeof action != "function") {
		return delete this.onCollapsedButtonClick;
	}
	this.onCollapsedButtonClick = function() {
		tryout.call(this, action);
	};
	return true;
};

ControlWindow.prototype.setOnButtonHoldListener = function(action) {
	if (typeof action != "function") {
		return delete this.onButtonHold;
	}
	this.onButtonHold = function() {
		return tryout.call(this, action);
	};
	return true;
};

ControlWindow.prototype.setOnCollapsedButtonHoldListener = function(action) {
	if (typeof action != "function") {
		return delete this.onCollapsedButtonHold;
	}
	this.onCollapsedButtonHold = function() {
		return tryout.call(this, action);
	};
	return true;
};

ControlWindow.prototype.isHideableInside = function() {
	return this.unclose !== undefined ? this.unclose : false;
};

ControlWindow.prototype.setHideableInside = function(enabled) {
	this.unclose = Boolean(enabled);
};

ControlWindow.prototype.mayTouched = true;

ControlWindow.prototype.isMayTouched = function() {
	return this.mayTouched !== undefined ? this.mayTouched : false;
};

ControlWindow.prototype.setTouchable = function(enabled) {
	this.mayTouched = Boolean(enabled);
	UniqueWindow.prototype.setTouchable.apply(this, arguments);
};

ControlWindow.prototype.transformButton = function() {
	this.setEnterTransition(this.getButtonEnterTransition());
	this.setExitTransition(this.getButtonExitTransition());
	this.setFragment(this.getButtonFragment());
};

ControlWindow.prototype.transformCollapsedButton = function() {
	this.setEnterTransition(this.getButtonEnterTransition());
	this.setExitTransition(this.getButtonExitTransition());
	this.setFragment(this.getCollapsedButtonFragment());
};

ControlWindow.prototype.transformLogotype = function() {
	this.setWidth(Interface.Display.WIDTH);
	this.setHeight(Interface.Display.HEIGHT);
	this.setEnterTransition(this.getLogotypeEnterTransition());
	this.setExitTransition(this.getLogotypeExitTransition());
	this.setFragment(this.getLogotypeFragment());
	if (this.isMayTouched()) UniqueWindow.prototype.setTouchable.call(this, false);
};

ControlWindow.prototype.show = function() {
	if (this.getBackgroundIcon() !== null || this.getForegroundIcon() !== null) {
		this.updateProgress();
	}
	UniqueWindow.prototype.show.apply(this, arguments);
};

ControlWindow.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ControlWindow)) {
		json = instanceOrJson;
		instanceOrJson = new ControlWindow();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("orientation")) {
		instanceOrJson.setOrientation(calloutOrParse(json, json.orientation, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("logotypeProgress")) {
		instanceOrJson.setForegroundIcon(calloutOrParse(json, json.logotypeProgress, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("logotypeOutside")) {
		instanceOrJson.setBackgroundIcon(calloutOrParse(json, json.logotypeOutside, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("logotype")) {
		instanceOrJson.setButtonIcon(calloutOrParse(json, json.logotype, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("buttonBackground")) {
		instanceOrJson.setButtonBackground(calloutOrParse(json, json.buttonBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("logotypeBackground")) {
		instanceOrJson.setLogotypeBackground(calloutOrParse(json, json.logotypeBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("buttonClick")) {
		instanceOrJson.setOnButtonClickListener(parseCallback(json, json.buttonClick, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("buttonHold")) {
		instanceOrJson.setOnButtonHoldListener(parseCallback(json, json.buttonHold, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("collapsedClick")) {
		instanceOrJson.setOnCollapsedButtonClickListener(parseCallback(json, json.collapsedClick, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("collapsedHold")) {
		instanceOrJson.setOnCollapsedButtonHoldListener(parseCallback(json, json.collapsedHold, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("hideable")) {
		instanceOrJson.setHideableInside(calloutOrParse(json, json.hideable, [this, instanceOrJson]));
	}
	return instanceOrJson;
};
