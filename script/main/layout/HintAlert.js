/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */

const HintAlert = function() {
	let window = UniqueWindow.apply(this, arguments);
	window.setGravity($.Gravity.LEFT | $.Gravity.BOTTOM);
	window.setWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
	window.setTouchable(false);

	let actor = new android.transition.Slide($.Gravity.BOTTOM),
		interpolator = new android.view.animation.DecelerateInterpolator();
	actor.setInterpolator(interpolator);
	actor.setDuration(window.getTime() / 6);
	window.setEnterTransition(actor);

	actor = new android.transition.TransitionSet();
	let slide = new android.transition.Slide($.Gravity.BOTTOM),
		fade = new android.transition.Fade(android.transition.Visibility.MODE_OUT);
	actor.addTransition(slide);
	actor.addTransition(fade);
	actor.setDuration(window.getTime() / 6);
	window.setExitTransition(actor);

	window.resetContent();
	window.clearStack();
	return window;
};

HintAlert.prototype = new UniqueWindow;
HintAlert.prototype.TYPE = "HintAlert";

HintAlert.prototype.maximumHieracly = 3;
HintAlert.prototype.autoReawait = true;
HintAlert.prototype.consoleMode = false;
HintAlert.prototype.stackable = true;
HintAlert.prototype.forever = false;
HintAlert.prototype.time = 3000;

HintAlert.prototype.resetContent = function() {
	let content = new android.widget.LinearLayout(getContext());
	content.setGravity($.Gravity.LEFT | $.Gravity.BOTTOM);
	content.setOrientation($.LinearLayout.VERTICAL);
	this.setContent(content);
};

HintAlert.prototype.attachMessage = function(hint, color, background) {
	if (this.canStackedMore()) {
		let layout = new android.widget.LinearLayout(getContext());
		layout.setPadding(toComplexUnitDip(32), toComplexUnitDip(10),
			toComplexUnitDip(32), toComplexUnitDip(10));
		try {
			if (background !== undefined) {
				if (!(background instanceof Drawable)) {
					background = Drawable.parseJson.call(this, background);
				}
			} else {
				background = new BitmapDrawable("popup");
			}
		} catch (e) {
			log("Dev Editor: HintAlert.attachMessage: " + e);
		}
		if (background) background.attachAsBackground(layout);
		layout.setOrientation($.LinearLayout.VERTICAL);
		layout.setGravity($.Gravity.CENTER);
		let content = this.getContainer();
		layout.setVisibility($.View.GONE);
		content.addView(layout, new android.widget.LinearLayout.LayoutParams
			($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));

		let text = new android.widget.TextView(getContext());
		text.setTextSize(toComplexUnitSp(8));
		text.setText(hint !== undefined ? String(hint) : translate("Nothing"));
		log("Dev Editor: hint: " + text.getText());
		if (!this.inConsoleMode()) text.setGravity($.Gravity.CENTER);
		text.setTextColor(color || $.Color.WHITE);
		typeface && text.setTypeface(typeface);
		text.setMinimumWidth(toComplexUnitDip(128));
		layout.addView(text);

		let actor = new android.transition.TransitionSet();
		actor.setOrdering(android.transition.TransitionSet.ORDERING_TOGETHER);
		let bounds = new android.transition.ChangeBounds(),
			fade = new android.transition.Fade();
		actor.setInterpolator(new android.view.animation.OvershootInterpolator());
		actor.setDuration(this.getTime() / 8);
		actor.addTransition(bounds);
		actor.addTransition(fade);
		this.beginDelayedTransition(actor);
		layout.setVisibility($.View.VISIBLE);
		return layout;
	}
	return null;
};

HintAlert.prototype.getMaximumStackedLimit = function() {
	return this.maximumHieracly != 0 ? this.maximumHieracly : 1;
};

HintAlert.prototype.getStackedCount = function() {
	return this.getContainer().getChildCount();
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
		let height = this.getContainer().getHeight();
		if (getDisplayHeight() - height < toComplexUnitDip(24)) {
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
	} else if ((!this.isPinned() && this.inConsoleMode()) || (!this.isPinned() && this.isStackable() && !this.alreadyHasHint(hint))) {
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
	let content = this.getContainer();
	if (content.getChildCount() > 0) {
		let actor = new android.transition.Fade();
		actor.setDuration(this.time / 12);
		this.beginDelayedTransition(actor);
		content.removeViewAt(0);
	}
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
	} else {
		this.removeFirstStacked();
		return this.getStackedCount() > 0;
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
	let content = this.getContainer();
	for (let i = 0; i < content.getChildCount(); i++) {
		let view = content.getChildAt(i);
		if (view !== null && view.getChildCount() > 0) {
			let text = view.getChildAt(0);
			if (text !== null && (i === hint || text.getText() == String(hint))) {
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
	this.stack = [];
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
	let actor = new android.transition.Fade();
	actor.setInterpolator(new android.view.animation.CycleInterpolator(1.3));
	actor.setDuration(this.time / 8);
	view.setVisibility($.View.INVISIBLE);
	this.beginDelayedTransition(actor);
	if (color !== undefined) view.setTextColor(color);
	view.setVisibility($.View.VISIBLE);
	log("Dev Editor: flash hint: " + hint);
	this.reawait();
	return true;
};

HintAlert.prototype.getTime = function() {
	return this.time !== undefined ? this.time : 3000;
};

HintAlert.prototype.setTime = function(ms) {
	ms > 0 && (this.time = preround(ms, 0));
	this.isOpened() && this.reawait();
};

HintAlert.prototype.reawait = function() {
	this.action && this.action.setCurrentTick(0);
};

HintAlert.prototype.attach = function() {
	let scope = this;
	if (!this.action) {
		this.action = handleAction(function(action) {
			handle(function() {
				if (scope.next(true)) {
					action.run();
					return;
				}
				scope.dismiss();
			});
		}, function() {
			if (scope.isPinned()) scope.reawait();
			return scope.action && scope.isAttached();
		}, this.getTime());
		this.action.setOnCancelListener(function() {
			scope.hasMoreStack() && scope.clearStack();
			scope.action.complete();
			scope.action.destroy();
			delete scope.action;
		});
		UniqueWindow.prototype.attach.apply(this, arguments);
	} else this.reawait();
};

HintAlert.prototype.dismiss = function() {
	this.action && this.action.destroy();
	delete this.action;
	UniqueWindow.prototype.dismiss.apply(this, arguments);
};
