const FocusableWindow = new Function();
FocusableWindow.prototype.TYPE = "FocusableWindow";
FocusableWindow.prototype.getContent = function() {
	return this.content || null;
};
FocusableWindow.prototype.setContent = function(content) {
	this.content = content;
};
FocusableWindow.prototype.touchable = true;
FocusableWindow.prototype.isTouchable = function() {
	return this.touchable;
};
FocusableWindow.prototype.setTouchable = function(touchable) {
	this.touchable = !!touchable;
};
FocusableWindow.prototype.focusable = false;
FocusableWindow.prototype.isFocusable = function() {
	return this.focusable;
};
FocusableWindow.prototype.setFocusable = function(focusable) {
	this.focusable = !!focusable;
};
FocusableWindow.prototype.isFullscreen = function() {
	return (this.width == Ui.Display.MATCH || this.width == Ui.Display.WIDTH) &&
		(this.height == Ui.Display.MATCH || this.height == Ui.Display.HEIGHT);
};
FocusableWindow.prototype.getParams = function(flags) {
	let params = new android.view.WindowManager.LayoutParams(this.width, this.height,
		this.x, this.y, 1000, flags || WindowProvider.BASE_WINDOW_FLAGS, -3);
	return (params.gravity = this.gravity, params);
};
FocusableWindow.prototype.gravity = Ui.Gravity.NONE;
FocusableWindow.prototype.getGravity = function() {
	return this.gravity;
};
FocusableWindow.prototype.setGravity = function(gravity) {
	this.gravity = gravity;
};
FocusableWindow.prototype.x = 0;
FocusableWindow.prototype.y = 0;
FocusableWindow.prototype.getX = function() {
	return this.x;
};
FocusableWindow.prototype.getY = function() {
	return this.y;
};
FocusableWindow.prototype.setX = function(x) {
	this.x = parseInt(x);
};
FocusableWindow.prototype.setY = function(y) {
	this.y = parseInt(y);
};
FocusableWindow.prototype.width = Ui.Display.WRAP;
FocusableWindow.prototype.height = Ui.Display.WRAP;
FocusableWindow.prototype.getWidth = function() {
	return this.width;
};
FocusableWindow.prototype.getHeight = function() {
	return this.height;
};
FocusableWindow.prototype.setWidth = function(width) {
	this.width = parseInt(width);
};
FocusableWindow.prototype.setHeight = function(height) {
	this.height = parseInt(height);
};
FocusableWindow.prototype.setOnShowListener = function(listener) {
	this.__show = function() {
		try { listener && listener(); }
		catch (e) { reportError(e); }
	};
};
FocusableWindow.prototype.setOnUpdateListener = function(listener) {
	this.__update = function() {
		try { listener && listener(); }
		catch (e) { reportError(e); }
	};
};
FocusableWindow.prototype.setOnHideListener = function(listener) {
	this.__hide = function() {
		try { listener && listener(); }
		catch (e) { reportError(e); }
	};
};
FocusableWindow.prototype.setOnCloseListener = function(listener) {
	this.__close = function() {
		try { listener && listener(); }
		catch (e) { reportError(e); }
	};
};
FocusableWindow.prototype.isOpened = function() {
	return !!this.popupId;
};
FocusableWindow.prototype.getPopup = function() {
	return WindowProvider.getByPopupId(this.popupId);
};
FocusableWindow.prototype.setEnterActor = function(actor) {
	if (this.isOpened()) WindowProvider.setEnterActor(this.popupId, actor);
	actor && (this.enterActor = actor);
};
FocusableWindow.prototype.setExitActor = function(actor) {
	if (this.isOpened()) WindowProvider.setEnterActor(this.popupId, actor);
	actor && (this.exitActor = actor);
};
FocusableWindow.prototype.show = function() {
	WindowProvider.prepareActors(this);
	this.getContent().setVisibility(Ui.Visibility.VISIBLE);
	if (!this.isOpened()) WindowProvider.openWindow(this);
	this.__show && this.__show();
};
FocusableWindow.prototype.update = function() {
	WindowProvider.updateWindow(this);
	this.__update && this.__update();
};
FocusableWindow.prototype.hide = function() {
	WindowProvider.prepareActors(this);
	this.getContent().setVisibility(Ui.Visibility.GONE);
	this.__hide && this.__hide();
};
FocusableWindow.prototype.dismiss = function() {
	WindowProvider.closeWindow(this);
	this.__close && this.__close();
};
