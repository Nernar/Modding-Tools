/**
 * @type
 */
const SnackSequence = function(obj) {
	AsyncSequence.apply(this, arguments);
};

SnackSequence.prototype = new AsyncSequence;

SnackSequence.prototype.getWindow = function() {
	return this.window || null;
};

SnackSequence.prototype.getView = function() {
	return this.view || null;
};

SnackSequence.prototype.getStacked = function() {
	return this.stacked || null;
};

SnackSequence.prototype.getMode = function() {
	return this.mode !== undefined ? this.mode : SnackSequence.Mode.INLINE;
};

SnackSequence.prototype.setMode = function(mode) {
	if (mode !== undefined) {
		this.mode = mode;
	} else {
		delete this.mode;
	}
};

SnackSequence.prototype.getStackedSize = function() {
	return this.maximumStacked !== undefined ? this.maximumStacked : 7;
};

SnackSequence.prototype.setStackedSize = function(limit) {
	if (limit !== undefined) {
		this.maximumStacked = limit;
	} else {
		delete this.maximumStacked;
	}
};

SnackSequence.prototype.isRequiredProgress = function() {
	return AsyncSequence.prototype.isRequiredProgress.apply(this, arguments) && (showHint.launchStacked === undefined || this.requiresProgress === true);
};

SnackSequence.prototype.getMessage = function(progress, index, custom) {
	let phrase = custom !== undefined ? custom : this.message !== undefined ? this.message : translate("Working");
	return this.count !== undefined ? phrase + " (" + preround(progress, 1) + "%)" : phrase;
};

SnackSequence.prototype.getBackground = function(progress, index, custom) {
	return custom !== undefined ? custom : this.background !== undefined ? this.background : ImageFactory.clipAndMerge(this.getClippedBackground(), this.getClippedForeground(), preround(progress * 100, 0) + 1);
};

SnackSequence.prototype.getColor = function(progress, index, custom) {
	return custom !== undefined ? custom : this.color !== undefined ? this.color : null;
};

SnackSequence.prototype.getClippedBackground = function() {
	return this.clippedBackground !== undefined ? this.clippedBackground : "popup";
};

SnackSequence.prototype.getClippedForeground = function() {
	return this.clippedForeground !== undefined ? this.clippedForeground : "popupSelectionSelected";
};

SnackSequence.prototype.getStartupMessage = function(value, active) {
	return this.startupMessage !== undefined ? this.startupMessage : translate("Preparing");
};

SnackSequence.prototype.getStartupBackground = function(value, active) {
	return this.startupBackground !== undefined ? this.startupBackground : "popupSelectionQueued";
};

SnackSequence.prototype.getStartupColor = function(value, active) {
	return this.startupColor !== undefined ? this.startupColor : null;
};

SnackSequence.prototype.getCancellationMessage = function(error, active) {
	if (error != null && typeof error == "object" && error.message == "java.lang.InterruptedException: null") {
		return this.queueMessage !== undefined ? this.queueMessage : translate("Interrupted");
	}
	return this.interruptMessage !== undefined ? this.interruptMessage : translate("Something happened");
};

SnackSequence.prototype.getCancellationBackground = function(error, active) {
	if (error != null && typeof error == "object" && error.message == "java.lang.InterruptedException: null") {
		return this.queueBackground !== undefined ? this.queueBackground : "popupSelectionQueued";
	}
	return this.interruptBackground !== undefined ? this.interruptBackground : "popupSelectionLocked";
};

SnackSequence.prototype.getCancellationColor = function(error, active) {
	if (error != null && typeof error == "object" && error.message == "java.lang.InterruptedException: null") {
		return this.queueColor !== undefined ? this.queueColor : null;
	}
	return this.interruptColor !== undefined ? this.interruptColor : $.Color.RED;
};

SnackSequence.prototype.getCompletionMessage = function(ellapsed, active) {
	let phrase = this.completionMessage !== undefined ? this.completionMessage : translate("Completed");
	return phrase + " " + translate("as %ss", preround(ellapsed / 1000, 1));
};

SnackSequence.prototype.getCompletionBackground = function(ellapsed, active) {
	return this.completionBackground !== undefined ? this.completionBackground : "popupSelectionSelected";
};

SnackSequence.prototype.getCompletionColor = function(ellapsed, active) {
	return this.completionColor !== undefined ? this.completionColor : null;
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setStartupMessage = function(message) {
	if (this.requiresStartupChanging) {
		this.change(0, 0, message);
	}
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setCompletionMessage = function(message) {
	this.finish(0, 0, message);
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setQueueMessage = function(message) {
	this.queueMessage = message;
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setInterruptMessage = function(message) {
	this.interruptMessage = message;
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setQueueBackground = function(message) {
	this.queueBackground = message;
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setInterruptBackground = function(message) {
	this.interruptBackground = message;
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setForeground = function(foreground) {
	this.clippedForeground = foreground;
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setBackground = function(background) {
	this.clippedBackground = background;
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setProgressBackground = function(background, foreground) {
	if (background !== undefined) {
		this.setBackground(background);
	}
	if (foreground !== undefined) {
		this.setForeground(foreground);
	}
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.setMessage = function(message) {
	this.change(0, 0, message);
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.prepare = function(message, color) {
	this.change(0, 0, message, undefined, color);
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
SnackSequence.prototype.seek = function(message, addition) {
	this.change(addition, 0, message);
};

SnackSequence.prototype.execute = function(value, snack) {
	if (this.isRequiredProgress()) {
		if (snack != null) {
			this.window = snack;
		} else {
			delete this.window;
			this.inherited = true;
		}
	}
	this.stacked = [];
	this.requiresStartupChanging = true;
	AsyncSequence.prototype.execute.call(this, value);
};

SnackSequence.prototype.create = function(value, active) {
	let mode = this.getMode();
	if (this.inherited) {
		this.window = new HintAlert();
	}
	let window = this.getWindow();
	if (window != null) {
		window.setMaximumStacked(this.getStackedSize());
		window.setConsoleMode(true);
		if (mode != SnackSequence.Mode.INLINE) {
			window.setStackable(true);
		}
	}
	if (this.getView() != null && mode == SnackSequence.Mode.INLINE) {
		this.updateMessage(
			this.getStartupMessage.apply(this, arguments),
			this.getStartupBackground.apply(this, arguments),
			this.getStartupColor.apply(this, arguments)
		);
	} else {
		this.attachMessage(
			this.getStartupMessage.apply(this, arguments),
			this.getStartupBackground.apply(this, arguments),
			this.getStartupColor.apply(this, arguments)
		);
	}
	if (window != null) {
		if (SnackSequence.locks.indexOf(this) == -1) {
			SnackSequence.locks.push(this);
		}
		window.pin();
		window.attach();
	}
};

SnackSequence.prototype.attachMessage = function(hint, background, color) {
	let window = this.getWindow();
	if (window != null) {
		if (!window.canStackedMore()) {
			window.removeFirstStacked();
		}
		this.view = window.attachMessage.apply(window, arguments);
	}
};

SnackSequence.prototype.updateMessage = function(hint, background, color) {
	let message = this.getView();
	if (message != null) {
		let text = message.getChildAt(0);
		hint !== undefined && (text.setText(hint));
		if (background !== undefined) {
			if (!(background instanceof Drawable)) {
				background = Drawable.parseJson.call(this, background);
			}
			background.attachAsBackground(message);
		}
		color !== undefined && (text.setTextColor(color));
	}
};

SnackSequence.prototype.update = function(progress, index) {
	let stack = this.getStacked();
	if (this.performedStartupChanging) {
		this.updateMessage(
			this.getStartupMessage.apply(this, arguments),
			this.getStartupBackground.apply(this, arguments),
			this.getStartupColor.apply(this, arguments)
		);
		delete this.performedStartupChanging;
		if (stack == null || stack.length == 0) {
			return;
		}
	}
	let mode = this.getMode();
	if (stack == null || stack.length == 0) {
		if (mode != SnackSequence.Mode.VERBOSE) {
			this.updateMessage(
				this.getMessage.apply(this, arguments),
				this.getBackground.apply(this, arguments),
				this.getColor.apply(this, arguments)
			);
		}
		return;
	}
	if (mode == SnackSequence.Mode.INLINE || (mode == SnackSequence.Mode.STACKABLE && this.alreadyAttachedMessage)) {
		let target = mode == SnackSequence.Mode.STACKABLE ? stack.length > 1 ? stack.shift() : stack[0] : stack[stack.length - 1];
		if (target != null) {
			this.shrink(target.count, target.index);
			this.updateMessage(
				this.getMessage(progress, index, target.hint),
				this.getBackground(progress, index, target.background),
				this.getColor(progress, index, target.color)
			);
		}
		if (stack.length <= 1 || mode == SnackSequence.Mode.INLINE) {
			return;
		}
	}
	let window = this.getWindow();
	if (window != null) {
		while (stack.length > 0) {
			let target = stack.length > 1 || mode == SnackSequence.Mode.VERBOSE ? stack.shift() : stack[stack.length - 1];
			this.shrink(target.count, target.index);
			this.attachMessage(
				this.getMessage(progress, index, target.hint),
				this.getBackground(progress, index, target.background),
				this.getColor(progress, index, target.color)
			);
			if (stack.length == 1 && mode == SnackSequence.Mode.STACKABLE) {
				break;
			}
		}
		this.alreadyAttachedMessage = true;
		window.attach();
	}
};

SnackSequence.prototype.section = function(index, count, hint, background, color) {
	let stack = this.getStacked();
	if (stack != null) {
		if (this.getMode() == SnackSequence.Mode.INLINE) {
			if (stack.length > 0) {
				stack.splice(0, stack.length);
			}
		}
		stack.push({
			index: index || 0,
			count: count || 0,
			hint: hint,
			background: background,
			color: color
		});
		this.updated = true;
	}
	delete this.requiresStartupChanging;
};

SnackSequence.prototype.change = function(index, count, hint, background, color) {
	if (this.requiresStartupChanging) {
		this.shrink(count, index);
		hint !== undefined && (this.startupMessage = hint);
		background !== undefined && (this.startupBackground = background);
		color !== undefined && (this.startupColor = color);
		this.performedStartupChanging = true;
		delete this.requiresStartupChanging;
	} else {
		let stack = this.getStacked();
		if (stack == null) {
			return;
		}
		let mode = this.getMode();
		if (stack.length == 0 || mode == SnackSequence.Mode.VERBOSE) {
			this.section.apply(this, arguments);
			return;
		}
		if (mode == SnackSequence.Mode.INLINE) {
			if (stack.length > 1) {
				stack.splice(0, stack.length - 1);
			}
		}
		let target = stack[stack.length - 1];
		if (target != null) {
			index !== undefined && (target.index += index);
			count !== undefined && (target.count += count);
			hint !== undefined && (target.hint = hint);
			background !== undefined && (target.background = background);
			color !== undefined && (target.color = color);
		}
	}
	this.updated = true;
};

SnackSequence.prototype.finish = function(index, count, hint, background, color) {
	AsyncSequence.prototype.finish.call(this, index, count);
	hint !== undefined && (this.completionMessage = hint);
	background !== undefined && (this.completionBackground = background);
	color !== undefined && (this.completionColor = color);
};

SnackSequence.prototype.cancel = function(error, active) {
	if (this.getMode() == SnackSequence.Mode.INLINE) {
		this.updateMessage(
			this.getCancellationMessage.apply(this, arguments),
			this.getCancellationBackground.apply(this, arguments),
			this.getCancellationColor.apply(this, arguments)
		);
	} else {
		this.attachMessage(
			this.getCancellationMessage.apply(this, arguments),
			this.getCancellationBackground.apply(this, arguments),
			this.getCancellationColor.apply(this, arguments)
		);
	}
	delete this.view;
	AsyncSequence.prototype.cancel.apply(this, arguments);
	this.requestUnpinning();
};

SnackSequence.prototype.complete = function(ellapsed, active) {
	if (this.getMode() == SnackSequence.Mode.INLINE) {
		this.updateMessage(
			this.getCompletionMessage.apply(this, arguments),
			this.getCompletionBackground.apply(this, arguments),
			this.getCompletionColor.apply(this, arguments)
		);
	} else {
		this.attachMessage(
			this.getCompletionMessage.apply(this, arguments),
			this.getCompletionBackground.apply(this, arguments),
			this.getCompletionColor.apply(this, arguments)
		);
	}
	delete this.view;
	this.requestUnpinning();
};

SnackSequence.prototype.requestUnpinning = function() {
	let index = SnackSequence.locks.indexOf(this);
	if (index != -1) {
		SnackSequence.locks.splice(index, 1);
	}
	if (this.inherited) {
		let window = this.getWindow();
		if (window != null) {
			window.unpin();
		}
		delete this.inherited;
	} else if (SnackSequence.locks.length == 0) {
		let window = this.getWindow();
		if (window != null) {
			window.setMaximumStacked(HintAlert.prototype.maximumStacked);
			window.setConsoleMode(HintAlert.prototype.consoleMode);
			window.setStackable(!hintStackableDenied);
			window.unpin();
		}
	}
	delete this.requiresStartupChanging;
	delete this.alreadyAttachedMessage;
	delete this.stacked;
	delete this.window;
};

SnackSequence.Mode = {};
SnackSequence.Mode.INLINE = 0;
SnackSequence.Mode.STACKABLE = 1;
SnackSequence.Mode.VERBOSE = 2;

SnackSequence.locks = [];
