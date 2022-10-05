const AsyncSnackSequence = function(who) {
	Sequence.apply(this, arguments);
};

AsyncSnackSequence.prototype = new Sequence;
AsyncSnackSequence.prototype.color = $.Color.WHITE;
AsyncSnackSequence.prototype.background = "popup";
AsyncSnackSequence.prototype.foreground = "popupSelectionSelected";
AsyncSnackSequence.prototype.queueBackground = "popupSelectionQueued";
AsyncSnackSequence.prototype.interruptBackground = "popupSelectionLocked";

AsyncSnackSequence.prototype.getProgressionHint = function(progress, index) {
	return this.message + " (" + preround(progress, 1) + "%)";
};

AsyncSnackSequence.prototype.getProgressionBackground = function(progress, index) {
	let level = preround(progress * 100, 0) + 1;
	return ImageFactory.clipAndMerge(this.background, this.foreground, level);
};

AsyncSnackSequence.prototype.getCancellationHint = function(error) {
	if (error && error.message == "java.lang.InterruptedException: null") {
		return this.queueMessage;
	}
	return this.interruptMessage;
};

AsyncSnackSequence.prototype.getCancellationBackground = function(error) {
	if (error && error.message == "java.lang.InterruptedException: null") {
		return this.queueBackground;
	}
	return this.interruptBackground;
};

AsyncSnackSequence.prototype.getCompletionHint = function(active) {
	return this.completionMessage + " " + translate("as %ss", preround(active / 1000, 1));
};

AsyncSnackSequence.prototype.getCompletionBackground = function(active) {
	return this.foreground;
};

AsyncSnackSequence.prototype.getMessage = function() {
	return this.widget !== undefined ? this.widget : null;
};

AsyncSnackSequence.prototype.isRequiredProgress = function() {
	return showProcesses && this.requiresProgress !== false &&
		(showHint.launchStacked === undefined || this.requiresProgress === true);
};

AsyncSnackSequence.prototype.setIsRequiredProgress = function(requires) {
	this.requiresProgress = Boolean(requires);
};

AsyncSnackSequence.prototype.create = function(value, active) {
	if (this.isRequiredProgress()) {
		let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (snack === null) snack = new HintAlert();
		snack.setStackable(!hintStackableDenied);
		if (!snack.canStackedMore()) {
			snack.removeFirstStacked();
		}
		snack.pin();
		SnackSequence.addProcess(this);
		this.widget = snack.attachMessage(this.startupMessage, this.color, this.queueBackground);
		if (!snack.isOpened()) snack.attach();
	}
};

AsyncSnackSequence.prototype.setHintAndBackground = function(hint, background) {
	let content = this.getMessage();
	if (content === null) return false;
	let text = content.getChildAt(0);
	text.setText(String(hint));
	if (!(background instanceof Drawable)) {
		background = Drawable.parseJson.call(this, background);
	}
	background.attachAsBackground(content);
	return true;
};

AsyncSnackSequence.prototype.prepare = function(hint, background) {
	return acquire.call(this, function() {
		return this.setHintAndBackground(hint, background);
	});
};

AsyncSnackSequence.prototype.update = function(progress, index) {
	if (this.getMessage() !== null) {
		this.setHintAndBackground(this.getProgressionHint(progress, index),
			this.getProgressionBackground(progress, index));
	}
};

AsyncSnackSequence.prototype.cancel = function(error) {
	if (this.getMessage() !== null) {
		this.setHintAndBackground(this.getCancellationHint(error),
			this.getCancellationBackground(error));
	}
	this.handleCompletion();
	Sequence.prototype.cancel.apply(this, arguments);
};

AsyncSnackSequence.prototype.handleCompletion = function() {
	SnackSequence.removeProcess(this);
	if (!SnackSequence.hasMoreProcesses()) {
		let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		snack !== null && snack.unpin();
	}
	delete this.widget;
};

AsyncSnackSequence.prototype.complete = function(active) {
	if (this.getMessage() !== null) {
		this.setHintAndBackground(this.getCompletionHint(active),
			this.getCompletionBackground(active));
	} else {
		showHint(this.getCompletionHint(active));
	}
	this.handleCompletion();
};

AsyncSnackSequence.access = function(where, who, post) {
	let sequence = new AsyncSnackSequence();
	sequence.message = translate("Working");
	sequence.startupMessage = translate("Preparing");
	sequence.completionMessage = translate("Completed");
	sequence.queueMessage = translate("Interrupted");
	sequence.interruptMessage = translate("Something happened");
	let encountedSequences = 0;
	sequence.process = function(next, entry, index) {
		encountedSequences++;
		if (encountedSequences > 1) {
			MCSystem.throwException("Dev Editor: invalid sequence length: " + index + ".." + sequence.getFixedCount());
		}
		let scriptable = AsyncSnackSequence.initScriptable(sequence, entry),
			wrapped = UNWRAP("sequence/" + where, scriptable);
		post && post(wrapped, sequence.getFixedCount());
		return sequence.getFixedCount();
	};
	sequence.execute(who);
	return sequence;
};

AsyncSnackSequence.initScriptable = function(sequence, who) {
	return {
		TARGET: who,
		INSTANCE: AsyncSnackSequence,
		SELF: sequence,
		sleep: function(ms) {
			java.lang.Thread.sleep(ms);
		},
		setStartupMessage: function(message) {
			sequence.startupMessage = message;
			sequence.require();
		},
		setCompletionMessage: function(message) {
			sequence.completionMessage = message;
			sequence.require();
		},
		setQueueMessage: function(message) {
			sequence.queueMessage = message;
			sequence.require();
		},
		setInterruptMessage: function(message) {
			sequence.interruptMessage = message;
			sequence.require();
		},
		setMessage: function(message) {
			sequence.message = message;
			sequence.require();
		},
		setQueueBackground: function(background) {
			sequence.queueBackground = background;
			sequence.require();
		},
		setInterruptBackground: function(background) {
			sequence.interruptBackground = background;
			sequence.require();
		},
		setForeground: function(background) {
			sequence.foreground = background;
			sequence.require();
		},
		setBackground: function(background) {
			sequence.background = background;
			sequence.require();
		},
		setProgressBackground: function(background, foreground) {
			background !== undefined && this.setBackground(background);
			foreground !== undefined && this.setForeground(foreground);
		},
		setPriority: function(priority) {
			sequence.setPriority(priority);
		},
		setReportingEnabled: function(enabled) {
			sequence.setReportingEnabled(enabled);
		},
		setSynchronizeTime: function(ms) {
			sequence.setSynchronizeTime(ms);
		},
		prepare: function(message, color) {
			sequence.prepare(message, color);
		},
		encount: function(count) {
			sequence.setFixedCount(count);
		},
		require: function(index, count) {
			sequence.require(index, count);
		},
		seek: function(message, addition) {
			sequence.message = message;
			if (addition !== undefined) {
				sequence.require(sequence.index + addition);
			}
		},
		shrink: function(addition) {
			sequence.shrink(addition);
		}
	};
};

const AsyncStackedSnackSequence = function(obj) {
	Sequence.apply(this, arguments);
};

AsyncStackedSnackSequence.prototype = new AsyncSnackSequence;
AsyncStackedSnackSequence.prototype.maximumStacked = 7;
AsyncStackedSnackSequence.prototype.interruptColor = $.Color.RED;
AsyncStackedSnackSequence.prototype.creationColor = $.Color.WHITE;
AsyncStackedSnackSequence.prototype.completionColor = $.Color.WHITE;

AsyncStackedSnackSequence.prototype.getProgressionBackground = function(progress, index) {
	if (progress >= 100) {
		return this.foreground;
	} else if (this.count !== undefined) {
		let level = preround(progress * 100, 0) + 1;
		return ImageFactory.clipAndMerge(this.background, this.foreground, level);
	} else {
		return this.queueBackground;
	}
};

AsyncStackedSnackSequence.prototype.getProgressionHint = function(message, progress, index) {
	return message + " (" + preround(progress, 1) + "%)";
};

AsyncStackedSnackSequence.prototype.getSnackWindow = function() {
	return this.snack || null;
};

AsyncStackedSnackSequence.prototype.getStack = function() {
	return this.stack || null;
};

AsyncStackedSnackSequence.prototype.create = function(value, active) {
	if (this.isRequiredProgress()) {
		let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (snack === null) snack = new HintAlert();
		snack.setMaximumStacked(this.maximumStacked);
		snack.setConsoleMode(true);
		snack.pin();
		if (!snack.canStackedMore()) {
			snack.removeFirstStacked();
		}
		this.widget = snack.attachMessage(this.creationMessage,
			this.creationColor, this.queueBackground);
		snack.attach();
		this.snack = snack;
		SnackSequence.addProcess(this);
	}
	this.stack = [];
};

AsyncStackedSnackSequence.prototype.update = function(progress, index) {
	let snack = this.getSnackWindow();
	if (snack !== null) {
		let stack = this.getStack();
		for (let i = 0; i < stack.length; i++) {
			let element = stack[i];
			if (!snack.canStackedMore()) {
				snack.removeFirstStacked();
			}
			this.widget = snack.attachMessage(this.getProgressionHint(element.message, progress, index),
				element.color, this.getProgressionBackground(progress, index));
			stack.splice(i, 1);
			i--;
		}
		snack.attach();
	}
};

AsyncStackedSnackSequence.prototype.change = function(message, color) {
	let stack = this.getStack();
	if (stack !== null) {
		stack.push({
			message: message !== undefined ? message : this.message,
			color: color !== undefined ? color : this.color
		});
		this.updated = true;
	}
};

AsyncStackedSnackSequence.prototype.cancel = function(error) {
	let snack = this.getSnackWindow();
	if (snack !== null) {
		this.update(this.index / this.count * 100, this.index);
		this.widget = snack.attachMessage(this.getCancellationHint(error),
			this.interruptColor, this.getCancellationBackground(error));
		snack.attach();
	}
	this.handleCompletion();
	Sequence.prototype.cancel.apply(this, arguments);
};

AsyncStackedSnackSequence.prototype.handleCompletion = function() {
	let snack = this.getSnackWindow();
	if (snack !== null) {
		snack.setMaximumStacked(HintAlert.prototype.maximumHieracly);
		snack.setConsoleMode(HintAlert.prototype.consoleMode);
		SnackSequence.removeProcess(this);
		if (!SnackSequence.hasMoreProcesses()) {
			snack.unpin();
		}
		delete this.snack;
	}
	delete this.widget;
	delete this.stack;
};

AsyncStackedSnackSequence.prototype.complete = function(active) {
	let snack = this.getSnackWindow();
	if (snack !== null) {
		this.update(100, this.count);
		if (!snack.canStackedMore()) {
			snack.removeFirstStacked();
		}
		this.widget = snack.attachMessage(this.getCompletionHint(active),
			this.completionColor, this.getCompletionBackground(active));
		snack.attach();
	}
	this.handleCompletion();
};

AsyncStackedSnackSequence.prototype.require = function(index, count) {
	if (index !== undefined) {
		this.index = index;
	}
	if (count !== undefined) {
		this.count = count;
	}
};

AsyncStackedSnackSequence.prototype.shrink = function(addition) {
	if (addition !== undefined) {
		if (this.count === undefined) {
			this.count = 0;
		}
		this.count += addition;
	}
};

AsyncStackedSnackSequence.access = function(where, who, post) {
	let sequence = new AsyncStackedSnackSequence();
	sequence.message = translate("Working");
	sequence.startupMessage = translate("Preparing");
	sequence.completionMessage = translate("Completed");
	sequence.queueMessage = translate("Interrupted");
	sequence.interruptMessage = translate("Something happened");
	let encountedSequences = 0;
	sequence.process = function(next, entry, index) {
		encountedSequences++;
		if (encountedSequences > 1) {
			MCSystem.throwException("Dev Editor: invalid sequence length: " + index + ".." + sequence.getFixedCount());
		}
		let scriptable = AsyncStackedSnackSequence.initScriptable(sequence, entry),
			wrapped = UNWRAP("sequence/" + where, scriptable);
		post && post(wrapped, sequence.getFixedCount());
		return sequence.getFixedCount();
	};
	sequence.execute(who);
	return sequence;
};

AsyncStackedSnackSequence.initScriptable = function(sequence, who) {
	return {
		TARGET: who,
		INSTANCE: AsyncStackedSnackSequence,
		SELF: sequence,
		sleep: function(ms) {
			java.lang.Thread.sleep(ms);
		},
		setStartupMessage: function(message) {
			sequence.startupMessage = message;
		},
		setCompletionMessage: function(message) {
			sequence.completionMessage = message;
		},
		setQueueMessage: function(message) {
			sequence.queueMessage = message;
		},
		setInterruptMessage: function(message) {
			sequence.interruptMessage = message;
		},
		setMessage: function(message) {
			sequence.message = message;
		},
		setQueueBackground: function(background) {
			sequence.queueBackground = background;
		},
		setInterruptBackground: function(background) {
			sequence.interruptBackground = background;
		},
		setForeground: function(background) {
			sequence.foreground = background;
		},
		setBackground: function(background) {
			sequence.background = background;
		},
		setProgressBackground: function(background, foreground) {
			background !== undefined && this.setBackground(background);
			foreground !== undefined && this.setForeground(foreground);
		},
		setColor: function(color) {
			sequence.color = color;
		},
		setCreationColor: function(color) {
			sequence.creationColor = color;
		},
		setInterruptColor: function(color) {
			sequence.interruptColor = color;
		},
		setCompletionColor: function(color) {
			sequence.completionColor = color;
		},
		setPriority: function(priority) {
			sequence.setPriority(priority);
		},
		setReportingEnabled: function(enabled) {
			sequence.setReportingEnabled(enabled);
		},
		setSynchronizeTime: function(ms) {
			sequence.setSynchronizeTime(ms);
		},
		prepare: function(message, color) {
			sequence.prepare(message, color);
		},
		encount: function(count) {
			sequence.setFixedCount(count);
		},
		require: function(index, count) {
			sequence.require(index, count);
		},
		seek: function(message, addition, color) {
			if (addition !== undefined) {
				sequence.require(sequence.index + addition);
			}
			sequence.change(message, color);
		},
		change: function(message, color) {
			sequence.change(message, color);
		},
		shrink: function(addition) {
			sequence.shrink(addition);
		}
	};
};
