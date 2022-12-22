/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 * @requires `isAndroid()`
 */
function LogotypeWindow(foreground, background) {
	let window = UniqueWindow.apply(this, arguments);
	if (foreground !== undefined) window.setForegroundImage(foreground);
	if (background !== undefined) window.setBackgroundImage(background);
	return window;
};

LogotypeWindow.prototype = new UniqueWindow;
LogotypeWindow.prototype.TYPE = "LogotypeWindow";

LogotypeWindow.prototype.level = 10000;
LogotypeWindow.prototype.orientate = 2;


OverlayWindow.prototype.resetWindow = function() {
	UniqueWindow.prototype.resetWindow.apply(this, arguments);
	this.setGravity($.Gravity.CENTER);
	this.setWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
	this.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);
	this.setFragment(new LogotypeFragment());
	this.setTouchable(false);

	let enter = new android.transition.Fade();
	enter.setInterpolator(new android.view.animation.DecelerateInterpolator());
	enter.setDuration(2000);
	this.setEnterTransition(enter);

	let exit = new android.transition.Fade();
	exit.setInterpolator(new android.view.animation.AccelerateInterpolator());
	exit.setDuration(500);
	this.setExitTransition(exit);
};

LogotypeWindow.prototype.getLevel = function() {
	return this.level !== undefined ? this.level : 10000;
};

LogotypeWindow.prototype.setLevel = function(level) {
	if (level == this.getLevel()) return;
	this.level = preround(level, 0);
	if (this.isOpened()) this.updateLevel();
};

LogotypeWindow.prototype.getOrientation = function() {
	return this.orientate !== undefined ? this.orientate : 2;
};

LogotypeWindow.prototype.setOrientation = function(orientate) {
	this.orientate = preround(orientate, 0);
	if (this.isOpened()) this.updateProgress();
};

LogotypeWindow.prototype.getProgress = function() {
	return preround(this.getLevel() / 100, 2);
};

LogotypeWindow.prototype.setProgress = function(progress) {
	this.setLevel(progress * 100);
};

LogotypeWindow.prototype.getImage = function() {
	let fragment = this.getFragment();
	if (fragment === null) return null;
	return fragment.getImage();
};

LogotypeWindow.prototype.getForegroundImage = function() {
	return this.foregroundImage || null;
};

LogotypeWindow.prototype.setForegroundImage = function(src) {
	this.foregroundImage = src;
	if (this.isOpened()) this.updateProgress();
};

LogotypeWindow.prototype.getBackgroundImage = function() {
	return this.backgroundImage || null;
};

LogotypeWindow.prototype.setBackgroundImage = function(src) {
	this.backgroundImage = src;
	if (this.isOpened()) this.updateProgress();
};

LogotypeWindow.prototype.updateProgress = function(force) {
	let fragment = this.getFragment();
	if (fragment === null) return false;
	let drawable = ImageFactory.clipAndMerge(this.getBackgroundImage(), this.getForegroundImage(), this.getLevel(), this.getOrientation());
	fragment.setImage(drawable);
	if (drawable && !force) {
		return this.updateLevel();
	}
	return true;
};

LogotypeWindow.prototype.updateLevel = function() {
	let fragment = this.getFragment();
	if (fragment === null) return false;
	if (this.getBackgroundImage() !== null && this.getForegroundImage() !== null) {
		this.updateProgress(true);
	} else if (this.getBackgroundImage() !== null) {
		fragment.setLevel(10001 - this.getLevel());
	} else fragment.setLevel(this.getLevel());
	return true;
};

LogotypeWindow.prototype.attach = function() {
	if (this.getBackgroundImage() !== null || this.getForegroundImage() !== null) {
		this.updateProgress();
	}
	UniqueWindow.prototype.attach.apply(this, arguments);
};
