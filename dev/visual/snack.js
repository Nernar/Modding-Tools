const HintAlert = function() {
	this.setGravity(Ui.Gravity.LEFT | Ui.Gravity.BOTTOM);
	this.setWidth(Ui.Display.MATCH);
	this.setTouchable(false);

	let actor = new SlideActor(Ui.Gravity.BOTTOM),
		interpolator = new DecelerateInterpolator();
	actor.setInterpolator(interpolator);
	actor.setDuration(this.time / 6);
	this.setEnterActor(actor);

	actor = new ActorSet();
	actor.setOrdering(ActorSet.TOGETHER);
	let slide = new SlideActor(Ui.Gravity.BOTTOM),
		fade = new FadeActor(FadeActor.OUT);
	actor.addActor(slide);
	actor.addActor(fade);
	actor.setDuration(this.time / 6);
	this.setExitActor(actor);

	this.reset();
	this.clearStack();
};

HintAlert.prototype = assign(UniqueWindow.prototype);
HintAlert.prototype.TYPE = "HintAlert";

HintAlert.prototype.maximumHieracly = 3;
HintAlert.prototype.autoReawait = true;
HintAlert.prototype.consoleMode = false;
HintAlert.prototype.stackable = true;
HintAlert.prototype.forever = false;
HintAlert.prototype.time = 3000;

HintAlert.prototype.reset = function() {
	let content = new android.widget.LinearLayout(context);
	content.setGravity(Ui.Gravity.LEFT | Ui.Gravity.BOTTOM);
	content.setOrientation(Ui.Orientate.VERTICAL);
	this.setContent(content);
};

HintAlert.prototype.attachMessage = function(hint, color, background) {
	if (this.canStackedMore()) {
		let layout = new android.widget.LinearLayout(context);
		layout.setPadding(Ui.getY(48), Ui.getY(16), Ui.getY(48), Ui.getY(16));
		layout.setBackgroundDrawable(background !== undefined ? background instanceof java.lang.Object ?
			background : ImageFactory.getDrawable(background) : ImageFactory.getDrawable("popupBackground"));
		layout.setOrientation(Ui.Orientate.VERTICAL);
		layout.setGravity(Ui.Gravity.CENTER);
		let content = this.getContent(),
			params = new android.widget.LinearLayout.LayoutParams(Ui.Display.WRAP, Ui.Display.WRAP);
		layout.setVisibility(Ui.Visibility.GONE);
		content.addView(layout, params);

		let text = new android.widget.TextView(context);
		text.setTextSize(Ui.getFontSize(22));
		text.setText(hint !== undefined ? String(hint) : translate("Nothing"));
		if (!this.inConsoleMode()) text.setGravity(Ui.Gravity.CENTER);
		text.setTextColor(color || Ui.Color.WHITE);
		typeface && text.setTypeface(typeface);
		text.setMinimumWidth(Ui.getY(405));
		layout.addView(text);

		let actor = new ActorSet();
		actor.setOrdering(ActorSet.TOGETHER);
		let bounds = new BoundsActor(),
			fade = new FadeActor();
		actor.setInterpolator(new OvershootInterpolator());
		actor.setDuration(this.time / 8);
		actor.addActor(bounds);
		actor.addActor(fade);
		this.beginDelayedActor(actor);
		layout.setVisibility(Ui.Visibility.VISIBLE);
		return layout;
	}
	return null;
};

HintAlert.prototype.getMaximumStackedLimit = function() {
	return this.maximumHieracly != 0 ? this.maximumHieracly : 1;
};

HintAlert.prototype.getStackedCount = function() {
	return this.getContent().getChildCount();
};

HintAlert.prototype.toInfinityStack = function() {
	this.setMaximumStacked(-1);
};

HintAlert.prototype.setMaximumStacked = function(count) {
	if (count == -1 || count > 0) {
		this.maximumHieracly = count;
	}
};

HintAlert.prototype.canStackedMore = function() {
	let limit = this.getMaximumStackedLimit();
	if (limit == -1) {
		let height = this.getContent().getHeight();
		if (Ui.Display.HEIGHT - height < Ui.getY(90)) {
			limit = 0;
		}
	}
	return limit == -1 || (this.getStackedCount() < limit);
};

HintAlert.prototype.inConsoleMode = function() {
	return this.consoleMode;
};

HintAlert.prototype.setConsoleMode = function(mode) {
	this.consoleMode = !!mode;
};

HintAlert.prototype.forceAddMessage = function(hint, color, force) {
	if (!this.inConsoleMode() && this.findStackedHint(hint)) {
		this.flashHint(hint, color);
	} else if (this.canStackedMore()) {
		this.attachMessage(hint, color);
	} else if ((!this.isPinned() && this.inConsoleMode()) || (!this.isPinned() && !this.alreadyHasHint(hint))) {
		this.addToStack(hint, color);
	} else if (!this.isStackable() || (this.isPinned() && this.inConsoleMode())) {
		this.removeFirstStacked();
		this.attachMessage(hint, color);
	}
	if (force || (this.hasAutoReawait() && force !== false &&
			(this.isStackable() ? !this.hasMoreStack() : true)))
		this.reawait();
};

HintAlert.prototype.addMessage = function(hint, color, force) {
	if (this.getStackedCount() > 0 && (this.inConsoleMode() && !this.isPinned())) {
		this.addToStack(hint, color);
		if (force) this.reawait();
	} else this.forceAddMessage(hint, color, force);
};

HintAlert.prototype.removeFirstStacked = function() {
	let actor = new FadeActor();
	actor.setDuration(this.time / 12);
	this.beginDelayedActor(actor);
	let content = this.getContent();
	content.removeViewAt(0);
};

HintAlert.prototype.next = function(force) {
	if (!force) this.reawait();
	if (this.hasMoreStack()) {
		let message = this.stack.shift();
		if (!this.canStackedMore()) {
			this.removeFirstStacked();
		}
		this.forceAddMessage(message[0], message[1]);
		return true;
	} else if (this.getStackedCount() > 0) {
		this.removeFirstStacked();
		return true;
	}
	return false;
};

HintAlert.prototype.isPinned = function() {
	return this.forever;
};

HintAlert.prototype.pin = function() {
	this.forever = true;
};

HintAlert.prototype.unpin = function() {
	this.forever = false;
};

HintAlert.prototype.isStackable = function() {
	return this.stackable;
};

HintAlert.prototype.setStackable = function(enabled) {
	this.stackable = !!enabled;
};

HintAlert.prototype.addToStack = function(hint, color) {
	if (maximumHints == -1 || this.stack.length > maximumHints - 1) {
		this.stack.pop();
	}
	this.isStackable() && this.stack.push([String(hint), color]);
};

HintAlert.prototype.stackIndex = function(hint) {
	if (!this.isStackable()) return -1;
	for (let i = 0; i < this.stack.length; i++) {
		if (this.stack[i][0] == String(hint)) return i;
	}
	return -1;
};

HintAlert.prototype.findStackedHint = function(hint) {
	let content = this.getContent();
	for (let i = 0; i < content.getChildCount(); i++) {
		let view = content.getChildAt(i);
		if (view !== null && view.getChildCount() > 0) {
			let text = view.getChildAt(0);
			if (text !== null && text.getText() == String(hint)) {
				return text;
			}
		}
	}
	return null;
};

HintAlert.prototype.hasMoreStack = function() {
	return this.isStackable() ? this.stack.length > 0 : false;
};

HintAlert.prototype.alreadyHasHint = function(hint) {
	let stacked = this.stackIndex(hint) != -1;
	return stacked || this.findStackedHint(hint) !== null;
};

HintAlert.prototype.clearStack = function() {
	this.stack = new Array();
};

HintAlert.prototype.hasAutoReawait = function() {
	return this.autoReawait;
};

HintAlert.prototype.setAutoReawait = function(enabled) {
	this.autoReawait = !!enabled;
};

HintAlert.prototype.flashHint = function(hint, color) {
	let view = this.findStackedHint(hint);
	if (view === null) return false;
	let actor = new FadeActor();
	actor.setInterpolator(new CycleInterpolator(1.3));
	actor.setDuration(this.time / 8);
	view.setVisibility(Ui.Visibility.INVISIBLE);
	this.beginDelayedActor(actor);
	if (color !== undefined) view.setTextColor(color);
	view.setVisibility(Ui.Visibility.VISIBLE);
	this.reawait();
	return true;
};

HintAlert.prototype.setTime = function(ms) {
	ms > 0 && (this.time = ms);
	this.isOpened() && this.reawait();
};

HintAlert.prototype.reawait = function() {
	this.action && this.action.setCurrentTick(0);
};

HintAlert.prototype.show = function() {
	let scope = this;
	if (!this.action) {
		this.action = handleAction(function() {
			handle(function() {
				if (scope.next(true)) {
					scope.action.isActive = true;
					return;
				}
				scope.action.destroy();
				delete scope.action;
				scope.dismiss();
			});
		}, function() {
			if (scope.forever) scope.reawait();
			return scope.action && scope.isAttached();
		}, this.time);
		this.action.setOnCancelListener(function() {
			scope.hasMoreStack() && scope.clearStack();
			scope.action.complete();
			scope.action.destroy();
			delete scope.action;
		});
		UniqueWindow.prototype.show.call(this);
	} else this.reawait();
};

HintAlert.prototype.dismiss = function() {
	this.action && this.action.destroy();
	delete this.action;
	UniqueWindow.prototype.dismiss.call(this);
};

/**
 * Some useful code; warnings and information.
 */
const showHint = function(hint, color, reawait) {
	if (showHint.launchStacked) {
		showHint.launchStacked.push({
			hint: hint,
			color: color,
			reawait: reawait
		});
		return;
	}
	handle(function() {
		let window = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (window === null) {
			window = new HintAlert();
		}
		window.setStackable(!hintStackableDenied);
		if (reawait && !window.canStackedMore()) {
			window.removeFirstStacked();
		}
		window.addMessage(hint, color, reawait);
		if (!window.isOpened()) window.show();
	});
};

showHint.launchStacked = new Array();

showHint.unstackLaunch = function() {
	let stack = this.launchStacked;
	delete this.launchStacked;
	delete this.unstackLaunch;
	for (let i = 0; i < stack.length; i++) {
		showHint(stack[i].hint, stack[i].color, stack[i].reawait);
	}
};

/**
 * Creates snack for processes; pins it to foreground.
 */
const createProcess = function(hint, color) {
	let content = null;
	if (!showHint.launchStacked) {
		handle(function() {
			let window = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
			if (window === null) {
				window = new HintAlert();
			}
			window.setStackable(!hintStackableDenied);
			if (!window.canStackedMore()) {
				window.removeFirstStacked();
			}
			window.pin();
			createProcess.processes++;
			content = window.attachMessage(hint, color, "popupSelectionLocked");
			if (!window.isOpened()) window.show();
		});
	}
	return function(process, progress) {
		createProcess.update(content, process, progress);
	};
};

createProcess.processes = 0;

createProcess.update = function(content, hint, progress) {
	handle(function() {
		progress = preround(progress * 100, 0) + 1;
		try {
			if (content === undefined || content === null) {
				if (progress >= 10001) showHint(hint);
				return;
			}
			let text = content.getChildAt(0);
			if (progress < 10001) {
				text.setText(String(hint).replace("%s", preround(progress / 100, 1) + "%"));
				content.setBackgroundDrawable(ImageFactory.clipAndMerge("popupBackground", "popupSelectionSelected", progress));
			} else {
				text.setText(String(hint));
				content.setBackgroundDrawable(ImageFactory.getDrawable("popupSelectionSelected"));
			}
		} catch (e) {
			if (progress >= 10001) {
				showHint(hint, Ui.Color.YELLOW, true);
			}
		}
	});
};

createProcess.complete = function() {
	handle(function() {
		let window = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (createProcess.processes > 0) {
			createProcess.processes--;
		}
		if (createProcess.processes == 0) {
			window !== null && window.unpin();
		}
	});
};
