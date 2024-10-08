function ControlWindow() {
	let window = UniqueWindow.apply(this, arguments);
	window.setFragment(new FrameFragment());
	if (isAndroid()) {
		window.resetContent();
	}
	window.setButtonBackground("popupButton");
	window.setLogotypeBackground("popupControl");
	return window;
}

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
		instance.onButtonClick && instance.onButtonClick(instance);
		if (instance.isHideableInside()) instance.dismiss();
	});
	collapsed.setOnClickListener(function() {
		instance.onCollapsedButtonClick && instance.onCollapsedButtonClick(instance);
	});
	button.setOnHoldListener(function() {
		return (instance.onButtonHold && instance.onButtonHold(instance)) == true;
	});
	collapsed.setOnHoldListener(function() {
		return (instance.onCollapsedButtonHold && instance.onCollapsedButtonHold(instance)) == true;
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
	let transform = this.getQueueTransition();
	this.setTransition(behold, queue, transform);
	this.setTransition(collapse, queue, transform);
	let unqueue = this.getBeholdTransition();
	this.setTransition(queue, behold, unqueue);
	this.setTransition(queue, collapse, unqueue);
};

ControlWindow.prototype.getButtonFragment = function() {
	return this.button || null;
};

ControlWindow.prototype.getCollapsedButtonFragment = function() {
	return this.collapsed || null;
};

ControlWindow.prototype.getButtonFragments = function() {
	let array = [], button;
	(button = this.getButtonFragment()) && array.push(button);
	(button = this.getCollapsedButtonFragment()) && array.push(button);
	return array;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getLogotypeFragment = function() {
	return this.queued || null;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getBeholdScene = function() {
	return this.behold || null;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getCollapseScene = function() {
	return this.collapse || null;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getEntranceSide = function() {
	return (this.gravity & $.Gravity.RIGHT) != 0 ?
		$.Gravity.RIGHT : $.Gravity.LEFT;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getQueueScene = function() {
	return this.queue || null;
};

/**
 * @requires `isAndroid()`
 */
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

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getButtonEnterTransition = function() {
	let slide = new android.transition.Slide(this.getEntranceSide());
	slide.setInterpolator(new android.view.animation.DecelerateInterpolator());
	slide.setDuration(600);
	return slide;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getButtonExitTransition = function() {
	let actor = new android.transition.Slide(this.getEntranceSide());
	actor.setInterpolator(new android.view.animation.AccelerateInterpolator());
	actor.setDuration(400);
	return actor;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getLogotypeEnterTransition = function() {
	let actor = new android.transition.Fade();
	actor.setInterpolator(new android.view.animation.DecelerateInterpolator());
	actor.setDuration(800);
	return actor;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getLogotypeExitTransition = function() {
	let actor = new android.transition.Fade();
	actor.setInterpolator(new android.view.animation.AccelerateInterpolator());
	actor.setDuration(400);
	return actor;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getQueueTransition = function() {
	let bounds = new android.transition.ChangeBounds();
	bounds.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	bounds.setDuration(800);
	return bounds;
};

/**
 * @requires `isAndroid()`
 */
ControlWindow.prototype.getBeholdTransition = function() {
	let slide = this.getButtonEnterTransition();
	slide.setMode(android.transition.Slide.MODE_IN);
	return slide;
};

/**
 * @requires `isAndroid()`
 */
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

ControlWindow.prototype.getImage = function() {
	let fragment = this.getFragment();
	if (fragment === null) return null;
	return fragment.getImage();
};

ControlWindow.prototype.getForegroundImage = function() {
	return this.foregroundImage || null;
};

ControlWindow.prototype.setForegroundImage = function(src) {
	this.foregroundImage = src;
	if (this.isOpened()) this.updateProgress();
};

ControlWindow.prototype.getBackgroundImage = function() {
	return this.backgroundImage || null;
};

ControlWindow.prototype.setBackgroundImage = function(src) {
	this.backgroundImage = src;
	if (this.isOpened()) this.updateProgress();
};

ControlWindow.prototype.updateProgress = function(force) {
	let fragment = this.getLogotypeFragment();
	if (fragment === null) return false;
	let drawable = ImageFactory.clipAndMerge(this.getBackgroundImage(), this.getForegroundImage(), this.getLevel(), this.getOrientation());
	fragment.setImage(drawable);
	if (drawable instanceof android.graphics.drawable.ClipDrawable) {
		if (!force) return this.updateLevel();
	}
	return true;
};

ControlWindow.prototype.updateLevel = function() {
	let fragment = this.getLogotypeFragment();
	if (fragment === null) return false;
	if (this.getBackgroundImage() !== null && this.getForegroundImage() !== null) {
		this.updateProgress(true);
	} else if (this.getBackgroundImage() !== null) {
		fragment.setLevel(10001 - this.getLevel());
	} else {
		fragment.setLevel(this.getLevel());
	}
	return true;
};

ControlWindow.prototype.setButtonImage = function(src) {
	let founded = this.getButtonFragments();
	for (let i = 0; i < founded.length; i++) {
		founded[i].setImage(src);
	}
	this.buttonImage = src;
};

ControlWindow.prototype.getButtonImage = function() {
	return this.buttonImage || null;
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
	this.onButtonClick = action;
	return true;
};

ControlWindow.prototype.setOnCollapsedButtonClickListener = function(action) {
	if (typeof action != "function") {
		return delete this.onCollapsedButtonClick;
	}
	this.onCollapsedButtonClick = action;
	return true;
};

ControlWindow.prototype.setOnButtonHoldListener = function(action) {
	if (typeof action != "function") {
		return delete this.onButtonHold;
	}
	this.onButtonHold = action;
	return true;
};

ControlWindow.prototype.setOnCollapsedButtonHoldListener = function(action) {
	if (typeof action != "function") {
		return delete this.onCollapsedButtonHold;
	}
	this.onCollapsedButtonHold = action;
	return true;
};

ControlWindow.prototype.isHideableInside = function() {
	return this.unclose !== undefined ? this.unclose : false;
};

ControlWindow.prototype.setHideableInside = function(enabled) {
	this.unclose = !!enabled;
};

ControlWindow.prototype.transformButton = function() {
	if (isAndroid()) {
		this.setEnterTransition(this.getButtonEnterTransition());
		this.setExitTransition(this.getButtonExitTransition());
	}
	this.setFragment(this.getButtonFragment());
};

ControlWindow.prototype.transformCollapsedButton = function() {
	if (isAndroid()) {
		this.setEnterTransition(this.getButtonEnterTransition());
		this.setExitTransition(this.getButtonExitTransition());
	}
	this.setFragment(this.getCollapsedButtonFragment());
};

ControlWindow.prototype.transformLogotype = function() {
	if (isAndroid()) {
		this.setEnterTransition(this.getLogotypeEnterTransition());
		this.setExitTransition(this.getLogotypeExitTransition());
	}
	this.setFragment(this.getLogotypeFragment());
};

ControlWindow.prototype.attach = function() {
	if (this.getBackgroundImage() != null || this.getForegroundImage() != null) {
		this.updateProgress();
	}
	UniqueWindow.prototype.attach.apply(this, arguments);
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
		instanceOrJson.setForegroundImage(calloutOrParse(json, json.logotypeProgress, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("logotypeOutside")) {
		instanceOrJson.setBackgroundImage(calloutOrParse(json, json.logotypeOutside, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("logotype")) {
		instanceOrJson.setButtonImage(calloutOrParse(json, json.logotype, [this, instanceOrJson]));
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
