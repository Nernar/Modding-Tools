const LogotypeWindow = function(foreground, background) {
	let window = UniqueWindow.apply(this, arguments);
	window.setGravity(Interface.Gravity.CENTER);
	window.setWidth(Interface.Display.MATCH);
	window.setHeight(Interface.Display.MATCH);
	window.setFragment(new LogotypeFragment());
	window.setTouchable(false);
	
	let enter = new FadeActor();
	enter.setInterpolator(new DecelerateInterpolator());
	enter.setDuration(2000);
	window.setEnterActor(enter);
	
	let exit = new FadeActor();
	exit.setInterpolator(new AccelerateInterpolator());
	exit.setDuration(500);
	window.setExitActor(exit);
	
	if (foreground !== undefined) window.setForegroundIcon(foreground);
	if (background !== undefined) window.setBackgroundIcon(background);
	return window;
};

LogotypeWindow.prototype = new UniqueWindow;
LogotypeWindow.prototype.TYPE = "LogotypeWindow";

LogotypeWindow.prototype.level = 10000;
LogotypeWindow.prototype.orientate = 2;

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

LogotypeWindow.prototype.getIcon = function() {
	let fragment = this.getFragment();
	if (fragment === null) return null;
	return fragment.getIcon();
};

LogotypeWindow.prototype.getForegroundIcon = function() {
	return this.foregroundIcon || null;
};

LogotypeWindow.prototype.setForegroundIcon = function(src) {
	this.foregroundIcon = src;
	if (this.isOpened()) this.updateProgress();
};

LogotypeWindow.prototype.getBackgroundIcon = function() {
	return this.backgroundIcon || null;
};

LogotypeWindow.prototype.setBackgroundIcon = function(src) {
	this.backgroundIcon = src;
	if (this.isOpened()) this.updateProgress();
};

LogotypeWindow.prototype.updateProgress = function(force) {
	let fragment = this.getFragment();
	if (fragment === null) return false;
	let drawable = ImageFactory.clipAndMerge(this.getBackgroundIcon(), this.getForegroundIcon(), this.getLevel(), this.getOrientation());
	fragment.setIcon(drawable);
	if (drawable instanceof android.graphics.drawable.ClipDrawable) {
		if (!force) return this.updateLevel();
	}
	return true;
};

LogotypeWindow.prototype.updateLevel = function() {
	let fragment = this.getFragment();
	if (fragment === null) return false;
	if (this.getBackgroundIcon() !== null && this.getForegroundIcon() !== null) {
		this.updateProgress(true);
	} else if (this.getBackgroundIcon() !== null) {
		fragment.setLevel(10001 - this.getLevel());
	} else fragment.setLevel(this.getLevel());
	return true;
};

LogotypeWindow.prototype.show = function() {
	if (this.getBackgroundIcon() !== null || this.getForegroundIcon() !== null) {
		this.updateProgress();
	}
	UniqueWindow.prototype.show.apply(this, arguments);
};
