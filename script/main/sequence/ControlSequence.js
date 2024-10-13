/**
 * @type
 */
const ControlSequence = function(obj) {
	Sequence.apply(this, arguments);
};

ControlSequence.prototype = new Sequence;

ControlSequence.prototype.getWindow = function() {
	return this.window || null;
};

ControlSequence.prototype.getForegroundImage = function() {
	return requireLogotype();
};

ControlSequence.prototype.getBackgroundImage = function() {
	return requireInvertedLogotype();
};

ControlSequence.prototype.getExpirationTime = function() {
	return 1500;
};

ControlSequence.prototype.isDismissingWhenCancelled = function() {
	return this.dismissWhenCancelled !== undefined ? this.dismissWhenCancelled : false;
};

ControlSequence.prototype.getCancellationBackground = function(error) {
	if (error == null || (typeof error == "object" && error.message == "java.lang.InterruptedException: null")) {
		return "popupSelectionQueued";
	}
	return "popupSelectionLocked";
};

ControlSequence.prototype.execute = function(value, control) {
	if (control != null) {
		this.window = control;
	} else {
		delete this.window;
		this.inherited = true;
	}
	Sequence.prototype.execute.call(this, value);
};

ControlSequence.prototype.uncount = function(value) {
	java.lang.Thread.sleep(this.getExpirationTime());
	return this.count;
};

ControlSequence.prototype.create = function(value, active) {
	if (this.inherited) {
		this.window = new ControlWindow();
		this.window.setForegroundImage(this.getForegroundImage());
		this.window.setBackgroundImage(this.getBackgroundImage());
		this.window.transformLogotype();
	}
	let window = this.getWindow();
	if (window != null) {
		window.setProgress(0);
		window.attach();
	}
};

ControlSequence.prototype.update = function(progress, index) {
	let window = this.getWindow();
	if (window != null) {
		window.setProgress(progress);
	}
};

ControlSequence.prototype.complete = function(ellapsed, active) {
	this.requestDismiss();
};

ControlSequence.prototype.cancel = function(error, active) {
	let window = this.getWindow();
	if (window != null) {
		window.setLogotypeBackground(this.getCancellationBackground(error));
	}
	Sequence.prototype.cancel.apply(this, arguments);
	this.requestDismiss();
};

ControlSequence.prototype.requestDismiss = function(milliseconds) {
	handle.call(this, function() {
		if (this.inherited) {
			delete this.inherited;
		} else if (!this.isDismissingWhenCancelled() || this.isAlright()) {
			delete this.window;
			return;
		}
		this.window.dismiss();
		delete this.window;
	}, milliseconds !== undefined ? milliseconds : this.getExpirationTime() * 2);
};
