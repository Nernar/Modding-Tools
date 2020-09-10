let HintAlert = function() {
	this.setGravity(Ui.Gravity.CENTER | Ui.Gravity.BOTTOM);
	this.setWidth(Ui.Display.MATCH);
	this.setTouchable(false);
	
	let actor = new SlideActor(Ui.Gravity.BOTTOM),
		interpolator = new DecelerateInterpolator();
	actor.setInterpolator(interpolator);
	actor.setDuration(400);
	this.setEnterActor(actor);
	
	let actor = new ActorSet(),
		slide = new SlideActor(Ui.Gravity.BOTTOM),
		fade = new FadeActor(FadeActor.OUT);
	actor.setOrdering(ActorSet.TOGETHER);
	actor.addActor(slide);
	actor.addActor(fade);
	actor.setDuration(400);
	this.setExitActor(actor);
	
	this.reset();
};
HintAlert.prototype = new UniqueWindow();
HintAlert.prototype.TYPE = "HintAlert";
HintAlert.prototype.time = 3000;
HintAlert.prototype.reset = function() {
	let views = (this.views = {});
	let content = new android.widget.FrameLayout(context);
	this.setContent(content);
	
	views.layout = new android.widget.LinearLayout(context);
	views.layout.setPadding(Ui.getY(32), Ui.getY(16), Ui.getY(32), Ui.getY(16));
	views.layout.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
	views.layout.setOrientation(Ui.Orientate.VERTICAL);
	views.layout.setGravity(Ui.Gravity.CENTER);
	views.layout.setMinimumWidth(Ui.getY(360));
	content.addView(views.layout);
	
	views.text = new android.widget.TextView(context);
	views.text.setSingleLine();
	views.text.setTextSize(Ui.getFontSize(22));
	views.text.setText(translate("Nothing"));
	views.text.setGravity(Ui.Gravity.CENTER);
	views.text.setTextColor(Ui.Color.WHITE);
	typeface && views.text.setTypeface(typeface);
	views.layout.addView(views.text);
};
HintAlert.prototype.forever = false;
HintAlert.prototype.isPinned = function() {
	return this.forever;
};
HintAlert.prototype.pin = function() {
	this.forever = true;
};
HintAlert.prototype.unpin = function() {
	this.forever = false;
};
HintAlert.prototype.stackable = false;
HintAlert.prototype.stack = new Array();
HintAlert.prototype.isStackable = function() {
	return this.stackable;
};
HintAlert.prototype.setStackable = function(enabled) {
	this.stackable = !!enabled;
};
HintAlert.prototype.addToStack = function(hint) {
	this.isStackable() && this.stack.push(hint);
};
HintAlert.prototype.hasMoreStack = function() {
	return this.isStackable() ? this.stack.length > 0 : false;
};
HintAlert.prototype.addActionForHint = function(hint, action) {
	let scope = this;
	action && handle(function() {
		try { scope.isOpened() && scope.action &&
			action && action(scope); }
		catch(e) { reportError(e); }
	}, this.getTimeForHint(hint) + 50);
};
HintAlert.prototype.getTimeForNextHint = function() {
	return this.action ? this.action.getLeftTime() : 0;
};
HintAlert.prototype.getTimeForHint = function(hint) {
	if (this.alreadyHasHint(hint)) {
		if (this.views.text.getText() == hint) return 0;
		let action = this.action ? this.action.getLeftTime() : 0;
		return this.stack.indexOf(hint) * this.time + action;
	}
	return 0;
};
// TODO: Why this function if text != hint ALWAYS return false
HintAlert.prototype.alreadyHasHint = function(hint) {
	let stacked = this.isStackable() ? this.stack.indexOf(hint) != -1 : false;
	return this.views.text.getText() == hint || stacked;
};
HintAlert.prototype.clearStack = function() {
	this.stack = new Array();
};
HintAlert.prototype.autoReawait = true;
HintAlert.prototype.hasAutoReawait = function() {
	return this.autoReawait;
};
HintAlert.prototype.setAutoReawait = function(enabled) {
	this.autoReawait = !!enabled;
};
HintAlert.prototype.replayHint = function(hint) {
	this.addActionForHint(hint, function(scope) {
		let actor = new FadeActor();
		actor.setInterpolator(new CycleInterpolator(1.3));
		actor.setDuration(scope.time / 8);
		scope.views.text.setVisibility(Ui.Visibility.INVISIBLE);
		scope.beginDelayedActor(actor);
		scope.views.text.setVisibility(Ui.Visibility.VISIBLE);
	});
};
HintAlert.prototype.setHintForce = function(hint) {
	let actor = new FadeActor();
	actor.setInterpolator(new OvershootInterpolator());
	actor.setDuration(this.time / 8);
	this.views.text.setVisibility(Ui.Visibility.INVISIBLE);
	this.views.text.setText("" + hint);
	this.beginDelayedActor(actor);
	this.views.text.setVisibility(Ui.Visibility.VISIBLE);
};
HintAlert.prototype.setHint = function(hint, force) {
	this.alreadyHasHint(hint) ? this.replayHint(hint) : this.isOpened() &&
		this.isStackable() ? this.addToStack(hint) : this.setHintForce(hint);
	if (force || (this.hasAutoReawait() && force != false &&
		(this.isStackable() ? !this.hasMoreStack() : true)))
			this.reawait();
};
HintAlert.prototype.setColor = function(color) {
	color && this.views.text.setTextColor(color);
};
HintAlert.prototype.setTime = function(ms) {
	ms > 0 && (this.time = ms);
	this.isOpened() && this.reawait();
};
HintAlert.prototype.reawait = function() {
	this.action && this.action.setCurrentTick(0);
};
HintAlert.prototype.__showHA = HintAlert.prototype.show;
HintAlert.prototype.show = function() {
	let scope = this;
	if (!this.action) {
		this.action = handleAction(function() {
			handle(function() {
				if (scope.hasMoreStack()) {
					scope.setHintForce(scope.stack.shift());
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
		this.__showHA && this.__showHA();
	} else this.reawait();
};
HintAlert.prototype.__dismissHA = HintAlert.prototype.dismiss;
HintAlert.prototype.dismiss = function() {
	this.action && this.action.destroy();
	delete this.action;
	this.__dismissHA && this.__dismissHA();
};

// Some useful code; warnings and information
function showHint(hint, color, reawait) {
	if (showHint.launchStacked) {
		showHint.launchStacked.push({
			hint: hint,
			color: color,
			reawait: reawait
		});
		return;
	}
	showHint.countedHints++;
	if (maximumHints > 0 && showHint.countedHints > maximumHints) {
		print(translate("Too many hints (%s)", showHint.countedHints));
		return;
	}
	context.runOnUiThread(function() {
		try {
			let window = new HintAlert();
			if (window.isAttached())
				window = UniqueHelper.getWindow(window);
			window.setStackable(!hintStackableDenied);
			hint && window.setHint(hint, reawait);
			if (!window.isOpened()) window.show();
			window.addActionForHint(hint, function() {
				window.setColor(color ? color : Ui.Color.WHITE);
			});
		} catch(e) {
			reportError(e);
		}
	});
	if (!showHint.isHandled) {
		showHint.handleCounter();
		showHint.isHandled = true;
	}
}
showHint.countedHints = 0;
showHint.handleCounter = function() {
	handle(function() {
		showHint.countedHints = 0;
		delete showHint.isHandled;
	}, HintAlert.prototype.time);
};
showHint.launchStacked = new Array();
showHint.unstackLaunch = function() {
	let stack = this.launchStacked;
	delete this.launchStacked;
	delete this.unstackLaunch;
	for (let i = 0; i < stack.length; i++)
		showHint(stack[i].hint, stack[i].color, stack[i].reawait);
};
