const FocusableWindow = new Function();

FocusableWindow.prototype.TYPE = "FocusableWindow";

FocusableWindow.prototype.touchable = true;
FocusableWindow.prototype.focusable = false;
FocusableWindow.prototype.gravity = Interface.Gravity.NONE;
FocusableWindow.prototype.width = Interface.Display.WRAP;
FocusableWindow.prototype.height = Interface.Display.WRAP;
FocusableWindow.prototype.x = 0;
FocusableWindow.prototype.y = 0;

FocusableWindow.prototype.reattach = function() {
	if (this.isOpened()) {
		this.dismiss();
	}
	this.show();
};

FocusableWindow.prototype.getContent = function() {
	if (this.content) return this.content;
	let fragment = this.getFragment();
	if (fragment != null) {
		let container = fragment.getContainer();
		if (container != null) return container;
	}
	let frame = this.getFrame();
	if (frame != null) {
		let container = frame.getContainer();
		if (container != null) return container;
	}
	return null;
};

FocusableWindow.prototype.setContent = function(content) {
	this.content = content;
	if (this.isOpened()) this.reattach();
	else if (content !== null) {
		content.setVisibility(Interface.Visibility.GONE);
	}
};

FocusableWindow.prototype.getFragment = function() {
	if (this.fragment) return this.fragment;
	let frame = this.getFrame();
	if (frame == null) return null;
	return frame.getFragment();
};

FocusableWindow.prototype.setFragment = function(fragment) {
	this.fragment = fragment;
	let content = this.getContent();
	if (this.isOpened()) this.reattach();
	else if (content !== null) {
		content.setVisibility(Interface.Visibility.GONE);
	}
};

FocusableWindow.prototype.getFrame = function() {
	return this.frame || null;
};

FocusableWindow.prototype.setFrame = function(frame) {
	this.frame = frame;
	let content = this.getContent();
	if (this.isOpened()) this.reattach();
	else if (content !== null) {
		content.setVisibility(Interface.Visibility.GONE);
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
	return (this.width == Interface.Display.MATCH || this.width == Interface.Display.WIDTH) &&
		(this.height == Interface.Display.MATCH || this.height == Interface.Display.HEIGHT);
};

FocusableWindow.prototype.getParams = function(flags) {
	let params = new android.view.WindowManager.LayoutParams(this.width, this.height,
		this.x, this.y, 1000, flags || WindowProvider.BASE_WINDOW_FLAGS, -3);
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

FocusableWindow.prototype.setOnShowListener = function(listener) {
	this.__show = function() {
		tryout(listener);
	};
};

FocusableWindow.prototype.setOnUpdateListener = function(listener) {
	this.__update = function() {
		tryout(listener);
	};
};

FocusableWindow.prototype.setOnHideListener = function(listener) {
	this.__hide = function() {
		tryout(listener);
	};
};

FocusableWindow.prototype.setOnCloseListener = function(listener) {
	this.__close = function() {
		tryout(listener);
	};
};

FocusableWindow.prototype.isOpened = function() {
	return WindowProvider.hasOpenedPopup(this);
};

FocusableWindow.prototype.getPopup = function() {
	return WindowProvider.getByPopupId(this.popupId);
};

FocusableWindow.prototype.setEnterActor = function(actor) {
	if (this.isOpened()) {
		WindowProvider.setEnterActor(this.popupId, actor);
	}
	this.enterActor = actor;
};

FocusableWindow.prototype.setExitActor = function(actor) {
	if (this.isOpened()) {
		WindowProvider.setExitActor(this.popupId, actor);
	}
	this.exitActor = actor;
};

FocusableWindow.prototype.show = function() {
	let content = this.getContent();
	content && content.setVisibility(Interface.Visibility.VISIBLE);
	if (!this.isOpened()) WindowProvider.openWindow(this);
	this.__show && this.__show();
};

FocusableWindow.prototype.update = function() {
	WindowProvider.updateWindow(this);
	this.__update && this.__update();
};

FocusableWindow.prototype.hide = function() {
	let content = this.getContent();
	content && content.setVisibility(Interface.Visibility.GONE);
	this.__hide && this.__hide();
};

FocusableWindow.prototype.dismiss = function() {
	WindowProvider.closeWindow(this);
	let content = this.getContent();
	content && content.setVisibility(Interface.Visibility.GONE);
	this.__close && this.__close();
};
