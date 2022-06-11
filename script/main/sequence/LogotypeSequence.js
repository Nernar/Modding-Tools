const LogotypeSequence = function(obj) {
	Sequence.apply(this, arguments);
};

LogotypeSequence.prototype = new Sequence;

LogotypeSequence.prototype.getForegroundImage = function() {
	return requireLogotype();
};

LogotypeSequence.prototype.getBackgroundImage = function() {
	return requireInvertedLogotype();
};

LogotypeSequence.prototype.getCancellationBackground = function(error) {
	if (error && error.message == "java.lang.InterruptedException: null") {
		return "popupSelectionQueued";
	}
	return "popupSelectionLocked";
};

LogotypeSequence.prototype.getExpirationTime = function() {
	return 1500;
};

LogotypeSequence.prototype.getWindow = function() {
	return this.window || null;
};

LogotypeSequence.prototype.create = function() {
	let logotype = new LogotypeWindow();
	logotype.setForegroundImage(this.getForegroundImage());
	logotype.setBackgroundImage(this.getBackgroundImage());
	logotype.show();
	this.window = logotype;
};

LogotypeSequence.prototype.setProgress = function(progress) {
	let logotype = this.getWindow();
	if (logotype === null) return false;
	logotype.setProgress(progress);
	return true;
};

LogotypeSequence.prototype.process = function(index) {
	if (index == 1) {
		Interface.sleepMilliseconds(this.getExpirationTime());
		this.updated = true;
	}
	return index;
};

LogotypeSequence.prototype.update = function(progress, index) {
	if (progress > 0) this.setProgress(progress);
};

LogotypeSequence.prototype.cancel = function(error) {
	let logotype = this.getWindow();
	if (logotype !== null) {
		let content = logotype.getContainer();
		if (content !== null) {
			let background = this.getCancellationBackground(error);
			if (!(background instanceof Drawable)) {
				background = Drawable.parseJson.call(this, background);
			}
			background.attachAsBackground(content);
		}
	}
	this.handleDismiss(2);
	Sequence.prototype.cancel.apply(this, arguments);
};

LogotypeSequence.prototype.handleDismiss = function(modifier) {
	let sequence = this;
	if (modifier === undefined) {
		modifier = 1;
	}
	handle(function() {
		let logotype = sequence.getWindow();
		if (logotype !== null) {
			logotype.hide();
			delete sequence.window;
		}
	}, this.getExpirationTime() * modifier);
};

LogotypeSequence.prototype.complete = function(active) {
	this.setProgress(100);
	this.handleDismiss();
};
