const SnackSequence = function(obj) {
	Sequence.apply(this, arguments);
};

SnackSequence.prototype = new Sequence;

SnackSequence.prototype.getColor = new Function();

SnackSequence.prototype.getBackground = function() {
	return "popup";
};

SnackSequence.prototype.getForeground = function() {
	return this.getCompletionBackground(-1);
};

SnackSequence.prototype.getPreprogressHint = function() {
	return translate("Working");
};

SnackSequence.prototype.getPrecompleteHint = function() {
	return translate("Completed");
};

SnackSequence.prototype.getCreationHint = function() {
	return translate("Preparing");
};

SnackSequence.prototype.getCreationBackground = function() {
	return "popupSelectionQueued";
};

SnackSequence.prototype.getProgressionHint = function(progress, index) {
	return this.getPreprogressHint() + " (" + preround(progress, 1) + "%)";
};

SnackSequence.prototype.getProgressionBackground = function(progress, index) {
	let level = preround(progress * 100, 0) + 1;
	return ImageFactory.clipAndMerge(this.getBackground(), this.getForeground(), level);
};

SnackSequence.prototype.getCancellationHint = function(error) {
	if (error && error.message == "java.lang.InterruptedException: null") {
		return translate("Interrupted");
	}
	return translate("Something happened");
};

SnackSequence.prototype.getCancellationBackground = function(error) {
	if (error && error.message == "java.lang.InterruptedException: null") {
		return "popupSelectionQueued";
	}
	return "popupSelectionLocked";
};

SnackSequence.prototype.getCompletionHint = function(active) {
	return this.getPrecompleteHint() + " " + translate("as %ss", preround(active / 1000, 0));
};

SnackSequence.prototype.getCompletionBackground = function(active) {
	return "popupSelectionSelected";
};

SnackSequence.prototype.getMessage = function() {
	return this.message !== undefined ? this.message : null;
};

SnackSequence.prototype.isRequiredProgress = function() {
	return showProcesses && this.requiresProgress !== false && (showHint.launchStacked === undefined || this.requiresProgress === true);
};

SnackSequence.prototype.setIsRequiredProgress = function(requires) {
	this.requiresProgress = Boolean(requires);
};

SnackSequence.prototype.create = function(value, active) {
	if (this.isRequiredProgress()) {
		let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (snack === null) snack = new HintAlert();
		snack.setStackable(!hintStackableDenied);
		if (!snack.canStackedMore()) {
			snack.removeFirstStacked();
		}
		snack.pin();
		SnackSequence.addProcess(this);
		this.message = snack.attachMessage(this.getCreationHint(), this.getColor(), this.getCreationBackground());
		if (!snack.isOpened()) snack.show();
	}
};

SnackSequence.prototype.setHintAndBackground = function(hint, background) {
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

SnackSequence.prototype.prepare = function(hint, background) {
	return acquire.call(this, function() {
		return this.setHintAndBackground(hint, background);
	});
};

SnackSequence.prototype.update = function(progress, index) {
	if (this.getMessage() !== null) {
		this.setHintAndBackground(this.getProgressionHint(progress, index),
			this.getProgressionBackground(progress, index));
	}
};

SnackSequence.prototype.cancel = function(error) {
	if (this.getMessage() !== null) {
		this.setHintAndBackground(this.getCancellationHint(error),
			this.getCancellationBackground(error));
	}
	this.handleCompletion();
	Sequence.prototype.cancel.apply(this, arguments);
};

SnackSequence.prototype.handleCompletion = function() {
	SnackSequence.removeProcess(this);
	if (!SnackSequence.hasMoreProcesses()) {
		let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		snack !== null && snack.unpin();
	}
	delete this.message;
};

SnackSequence.prototype.complete = function(active) {
	if (this.getMessage() !== null) {
		this.setHintAndBackground(this.getCompletionHint(active),
			this.getCompletionBackground(active));
	} else showHint(this.getCompletionHint(active));
	this.handleCompletion();
};

SnackSequence.processes = [];

SnackSequence.getProcesses = function() {
	return this.processes || null;
}

SnackSequence.hasMoreProcesses = function() {
	let processes = this.getProcesses();
	return processes && processes.length > 0;
};

SnackSequence.addProcess = function(process) {
	let processes = this.getProcesses();
	if (processes == null) return -1;
	let index = processes.indexOf(process)
	if (index != -1) return index;
	return processes.push(process) - 1;
};

SnackSequence.removeProcess = function(process) {
	let processes = this.getProcesses();
	if (processes == null) return false;
	let index = processes.indexOf(process)
	if (index == -1) return false;
	processes.splice(index, 1);
	return true;
};

SnackSequence.interruptAll = function() {
	let processes = this.getProcesses();
	if (processes == null) return false;
	for (let i = 0; i < processes.length; i++) {
		let process = processes[i];
		if (!process.isInterrupted()) process.interrupt();
	}
	return true;
};

const StackedSnackSequence = function(obj) {
	Sequence.apply(this, arguments);
};

StackedSnackSequence.prototype = new Sequence;

StackedSnackSequence.prototype.getCreationColor = new Function();

StackedSnackSequence.prototype.getCancellationColor = new Function();

StackedSnackSequence.prototype.getCompletionColor = new Function();

StackedSnackSequence.prototype.getBackground = function() {
	return "popup";
};

StackedSnackSequence.prototype.getForeground = function() {
	return this.getCompletionBackground(-1);
};

StackedSnackSequence.prototype.getCreationHint = function() {
	return translate("Preparing");
};

StackedSnackSequence.prototype.getPrecompleteHint = function() {
	return translate("Completed");
};

StackedSnackSequence.prototype.getCreationBackground = function() {
	return "popupSelectionQueued";
};

StackedSnackSequence.prototype.getProgressionBackground = function(progress, index) {
	if (progress >= 100) {
		return this.getCompletionBackground();
	} else if (this.count !== undefined) {
		let level = preround(progress * 100, 0) + 1;
		return ImageFactory.clipAndMerge(this.getBackground(), this.getForeground(), level);
	} else return this.getCreationBackground();
};

StackedSnackSequence.prototype.getProgressionHint = function(message, progress, index) {
	return message + " (" + preround(progress, 1) + "%)";
};

StackedSnackSequence.prototype.getCancellationHint = function(error) {
	if (error && error.message == "java.lang.InterruptedException: null") {
		return translate("Interrupted");
	}
	return translate("Something happened");
};

StackedSnackSequence.prototype.getCancellationBackground = function(error) {
	if (error && error.message == "java.lang.InterruptedException: null") {
		return "popupSelectionQueued";
	}
	return "popupSelectionLocked";
};

StackedSnackSequence.prototype.getCompletionHint = function(active) {
	return this.getPrecompleteHint() + " " + translate("as %ss", preround(active / 1000, 0));
};

StackedSnackSequence.prototype.getCompletionBackground = function(active) {
	return "popupSelectionSelected";
};

StackedSnackSequence.prototype.getStackedSize = function() {
	return 9;
};

StackedSnackSequence.prototype.getSnackWindow = function() {
	return this.snack || null;
};

StackedSnackSequence.prototype.getStack = function() {
	return this.stack || null;
};

StackedSnackSequence.prototype.isRequiredProgress = function() {
	return this.requiresProgress !== false && (showHint.launchStacked === undefined || this.requiresProgress === true);
};

StackedSnackSequence.prototype.setIsRequiredProgress = function(requires) {
	this.requiresProgress = Boolean(requires);
};

StackedSnackSequence.prototype.create = function(value, active) {
	if (this.isRequiredProgress()) {
		let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (snack === null) snack = new HintAlert();
		snack.setMaximumStacked(this.getStackedSize());
		snack.setConsoleMode(true);
		snack.pin();
		if (!snack.canStackedMore()) {
			snack.removeFirstStacked();
		}
		snack.attachMessage(this.getCreationHint(),
			this.getCreationColor(), this.getCreationBackground());
		snack.show();
		this.snack = snack;
		SnackSequence.addProcess(this);
	}
	this.stack = [];
};

StackedSnackSequence.prototype.update = function(progress, index) {
	let snack = this.getSnackWindow();
	if (snack !== null) {
		let stack = this.getStack();
		for (let i = 0; i < stack.length; i++) {
			let element = stack[i];
			if (!snack.canStackedMore()) {
				snack.removeFirstStacked();
			}
			snack.attachMessage(this.getProgressionHint(element.message, progress, index),
				element.color, this.getProgressionBackground(progress, index));
			stack.splice(i, 1);
			i--;
		}
		snack.show();
	}
};

StackedSnackSequence.prototype.change = function(message, color) {
	let stack = this.getStack();
	if (stack !== null) {
		stack.push({
			message: message,
			color: color
		});
		this.updated = true;
	}
};

StackedSnackSequence.prototype.cancel = function(error) {
	let snack = this.getSnackWindow();
	if (snack !== null) {
		this.update(this.index / this.count * 100, this.index);
		snack.attachMessage(this.getCancellationHint(error),
			this.getCancellationColor(error), this.getCancellationBackground(error));
		snack.show();
	}
	this.handleCompletion();
	Sequence.prototype.cancel.apply(this, arguments);
};

StackedSnackSequence.prototype.handleCompletion = function() {
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
	delete this.stack;
};

StackedSnackSequence.prototype.complete = function(active) {
	let snack = this.getSnackWindow();
	if (snack !== null) {
		this.update(100, this.count);
		if (!snack.canStackedMore()) {
			snack.removeFirstStacked();
		}
		snack.attachMessage(this.getCompletionHint(active),
			this.getCompletionColor(active), this.getCompletionBackground(active));
		snack.show();
	}
	this.handleCompletion();
};

StackedSnackSequence.prototype.require = function(index, count) {
	if (index !== undefined) {
		this.index = index;
	}
	if (count !== undefined) {
		this.count = count;
	}
};

StackedSnackSequence.prototype.shrink = function(addition) {
	if (addition !== undefined) {
		if (this.count === undefined) {
			this.count = 0;
		}
		this.count += addition;
	}
};
