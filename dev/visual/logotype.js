const LogotypeWindow = function(foreground, background) {
	UniqueWindow.call(this);
	this.setGravity(Interface.Gravity.CENTER);
	this.setWidth(Interface.Display.MATCH);
	this.setHeight(Interface.Display.MATCH);
	this.setFragment(new LogotypeFragment());
	this.setTouchable(false);
	
	let enter = new FadeActor();
	enter.setInterpolator(new DecelerateInterpolator());
	enter.setDuration(2000);
	this.setEnterActor(enter);
	
	let exit = new FadeActor();
	exit.setInterpolator(new AccelerateInterpolator());
	exit.setDuration(500);
	this.setExitActor(exit);
	
	if (foreground !== undefined) this.setForegroundIcon(foreground);
	if (background !== undefined) this.setBackgroundIcon(background);
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
	if (ImageFactory.isLoaded(src)) {
		this.foregroundIcon = src;
		if (this.isOpened()) this.updateProgress();
	}
};

LogotypeWindow.prototype.getBackgroundIcon = function() {
	return this.backgroundIcon || null;
};

LogotypeWindow.prototype.setBackgroundIcon = function(src) {
	if (ImageFactory.isLoaded(src)) {
		this.backgroundIcon = src;
		if (this.isOpened()) {
			this.updateProgress();
		}
	}
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
	UniqueWindow.prototype.show.call(this);
};
