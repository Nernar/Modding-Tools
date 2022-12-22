function FocusableWindow() {};

FocusableWindow.prototype.TYPE = "FocusableWindow";

FocusableWindow.prototype.touchable = true;
FocusableWindow.prototype.focusable = false;
FocusableWindow.prototype.x = 0;
FocusableWindow.prototype.y = 0;

if (isAndroid()) {
	FocusableWindow.prototype.gravity = $.Gravity.NO_GRAVITY;
	FocusableWindow.prototype.width = $.ViewGroup.LayoutParams.WRAP_CONTENT;
	FocusableWindow.prototype.height = $.ViewGroup.LayoutParams.WRAP_CONTENT;
}

FocusableWindow.prototype.reattach = function() {
	if (this.isOpened()) {
		this.dismiss();
	}
	this.attach();
};

FocusableWindow.prototype.getContent = function() {
	if (this.content) return this.content;
	let fragment = this.getFragment();
	if (fragment != null) {
		let container = fragment.getContainer();
		if (container != null) return container;
	}
	return null;
};

FocusableWindow.prototype.setContent = function(content) {
	this.content = content;
	if (this.isOpened()) this.update();
};

FocusableWindow.prototype.getFragment = function() {
	return this.fragment || null;
};

FocusableWindow.prototype.setFragment = function(fragment) {
	let content = this.getContent();
	this.fragment = fragment;
	if (this.isOpened() && content != this.getContent()) {
		this.update();
	}
};

FocusableWindow.prototype.isTouchable = function() {
	return this.touchable;
};

FocusableWindow.prototype.setTouchable = function(touchable) {
	this.touchable = !!touchable;
	if (this.isOpened()) this.update();
};

FocusableWindow.prototype.isFocusable = function() {
	return this.getContent() && this.focusable;
};

FocusableWindow.prototype.setFocusable = function(focusable) {
	this.focusable = !!focusable;
	if (this.isOpened()) this.update();
};

FocusableWindow.prototype.isFullscreen = function() {
	return (this.width == $.ViewGroup.LayoutParams.MATCH_PARENT || this.width == getDisplayWidth()) &&
		(this.height == $.ViewGroup.LayoutParams.MATCH_PARENT || this.height == getDisplayHeight());
};

/**
 * @requires `isAndroid()`
 */
FocusableWindow.prototype.getParams = function(flags) {
	let params = new android.view.WindowManager.LayoutParams
		(this.width, this.height, this.x, this.y, 1000, flags || WindowProvider.BASE_WINDOW_FLAGS, -3);
	return (params.gravity = this.gravity, params);
};

FocusableWindow.prototype.getGravity = function() {
	return this.gravity;
};

FocusableWindow.prototype.setGravity = function(gravity) {
	this.gravity = gravity;
	if (this.isOpened()) this.update();
};

FocusableWindow.prototype.getX = function() {
	return this.x;
};

FocusableWindow.prototype.getY = function() {
	return this.y;
};

FocusableWindow.prototype.setX = function(x) {
	this.x = parseInt(x);
	if (this.isOpened()) this.update();
};

FocusableWindow.prototype.setY = function(y) {
	this.y = parseInt(y);
	if (this.isOpened()) this.update();
};

FocusableWindow.prototype.getWidth = function() {
	return this.width;
};

FocusableWindow.prototype.getHeight = function() {
	return this.height;
};

FocusableWindow.prototype.setWidth = function(width) {
	this.width = parseInt(width);
	if (this.isOpened()) this.update();
};

FocusableWindow.prototype.setHeight = function(height) {
	this.height = parseInt(height);
	if (this.isOpened()) this.update();
};

FocusableWindow.prototype.setOnAttachListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onAttach;
	}
	this.onAttach = listener;
	return true;
};

FocusableWindow.prototype.setOnUpdateListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onUpdate;
	}
	this.onUpdate = listener;
	return true;
};

FocusableWindow.prototype.setOnDismissListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onClose;
	}
	this.onClose = listener;
	return true;
};

FocusableWindow.prototype.isOpened = function() {
	if (isAndroid()) {
		return WindowProvider.hasOpenedPopup(this);
	}
	return ShellObserver.includes(this);
};

FocusableWindow.prototype.getPopup = function() {
	if (isAndroid()) {
		return WindowProvider.getByPopupId(this.popupId);
	}
	return ShellObserver.layers.indexOf(this);
};

/**
 * @requires `isAndroid()`
 */
FocusableWindow.prototype.getEnterTransition = function() {
	return this.enterTransition || null;
};

/**
 * @requires `isAndroid()`
 */
FocusableWindow.prototype.setEnterTransition = function(actor) {
	if (isAndroid() && this.isOpened()) {
		WindowProvider.setEnterTransition(this.popupId, actor);
	}
	this.enterTransition = actor;
};

/**
 * @requires `isAndroid()`
 */
FocusableWindow.prototype.getExitTransition = function() {
	return this.exitTransition || null;
};

/**
 * @requires `isAndroid()`
 */
FocusableWindow.prototype.setExitTransition = function(actor) {
	if (isAndroid() && this.isOpened()) {
		WindowProvider.setExitTransition(this.popupId, actor);
	}
	this.exitTransition = actor;
};

FocusableWindow.prototype.attach = function() {
	if (!this.isOpened()) {
		let fragment = this.getFragment();
		if (fragment != null && fragment.isRequiresFocusable()) {
			this.focusable = true;
		}
		if (isAndroid()) {
			WindowProvider.openWindow(this);
		} else {
			ShellObserver.push(this);
		}
		this.onAttach && this.onAttach();
		return true;
	} else {
		Logger.Log("ModdingTools: Attaching window " + this.TYPE + " called on already opened window", "INFO");
	}
	return false;
};

FocusableWindow.prototype.update = function() {
	let fragment = this.getFragment();
	if (fragment != null && fragment.isRequiresFocusable()) {
		this.focusable = true;
	}
	this.onUpdate && this.onUpdate();
	if (isAndroid()) {
		WindowProvider.updateWindow(this);
	}
};

FocusableWindow.prototype.dismiss = function() {
	if (this.isOpened()) {
		if (isAndroid()) {
			WindowProvider.closeWindow(this);
		} else {
			ShellObserver.dismiss(this);
		}
		this.onClose && this.onClose();
	} else {
		Logger.Log("ModdingTools: Dismissing window " + this.TYPE + " called on already closed window", "INFO");
	}
};

FocusableWindow.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof FocusableWindow)) {
		json = instanceOrJson;
		instanceOrJson = new FocusableWindow();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("touchable")) {
		instanceOrJson.setTouchable(calloutOrParse(json, json.touchable, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("focusable")) {
		instanceOrJson.setFocusable(calloutOrParse(json, json.focusable, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("gravity")) {
		instanceOrJson.setGravity(calloutOrParse(json, json.gravity, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("width")) {
		instanceOrJson.setWidth(calloutOrParse(json, json.width, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("height")) {
		instanceOrJson.setHeight(calloutOrParse(json, json.height, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("x")) {
		instanceOrJson.setX(calloutOrParse(json, json.x, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("y")) {
		instanceOrJson.setY(calloutOrParse(json, json.y, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("content")) {
		instanceOrJson.setContent(calloutOrParse(json, json.content, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("fragment")) {
		instanceOrJson.setFragment(calloutOrParse(json, json.fragment, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("onAttach")) {
		instanceOrJson.setOnAttachListener(parseCallback(json, json.onAttach, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("onUpdate")) {
		instanceOrJson.setOnUpdateListener(parseCallback(json, json.onUpdate, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("onDismiss")) {
		instanceOrJson.setOnAttachListener(parseCallback(json, json.onDismiss, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("enterTransition")) {
		instanceOrJson.setEnterTransition(calloutOrParse(json, json.enterTransition, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("exitTransition")) {
		instanceOrJson.setExitTransition(calloutOrParse(json, json.exitTransition, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

registerWindowJson("window", FocusableWindow);
registerWindowJson("focusable", FocusableWindow);
