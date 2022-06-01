const FocusablePopup = function() {
	TransitionWindow.apply(this, arguments);
	let fadeIn = new android.transition.Fade(),
		fadeOut = new android.transition.Fade();
	fadeIn.setInterpolator(new android.view.animation.DecelerateInterpolator());
	fadeIn.setDuration(400);
	this.setEnterTransition(fadeIn);
	fadeOut.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	fadeOut.setDuration(400);
	this.setExitTransition(fadeOut);

	let place = Popups.getAvailablePlace();
	this.setX(place.x);
	this.setY(place.y);
	this.setGravity(Interface.Gravity.LEFT | Interface.Gravity.TOP);

	this.reset();
};

FocusablePopup.prototype = new TransitionWindow;
FocusablePopup.prototype.TYPE = "FocusablePopup";

FocusablePopup.prototype.reset = function() {
	let views = this.views = {};
	views.layout = new android.widget.LinearLayout(context);
	new BitmapDrawable("popup").attachAsBackground(views.layout);
	views.layout.setOrientation(Interface.Orientate.VERTICAL);
	this.setContent(views.layout);

	views.title = new android.widget.TextView(context);
	views.title.setPadding(Interface.getY(30), Interface.getY(18), Interface.getY(30), Interface.getY(18));
	new BitmapDrawable("popup").attachAsBackground(views.title);
	views.title.setTextSize(Interface.getFontSize(24));
	views.title.setGravity(Interface.Gravity.CENTER);
	views.title.setTextColor(Interface.Color.WHITE);
	views.title.setTypeface(typeface);
	let instance = this;
	views.title.setOnTouchListener(function(view, event) {
		return tryoutSafety(function() {
			return instance.handleTouch(event);
		}, false);
	});
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = .1;
	views.layout.addView(views.title, params);

	views.scroll = new android.widget.ScrollView(context);
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = 16.;
	views.layout.addView(views.scroll, params);

	views.content = new android.widget.LinearLayout(context);
	views.content.setOrientation(Interface.Orientate.VERTICAL);
	views.content.setGravity(Interface.Gravity.CENTER);
	views.scroll.addView(views.content);
};

FocusablePopup.prototype.handleTouch = function(event) {
	switch (event.getAction()) {
		case 0:
			if (this.isMayDragged()) {
				this.dx = event.getX();
				this.dy = event.getY();
			}
			if (this.isMayCollapsed() || !this.isExpanded()) {
				if (this.expandable && this.expandable.isActive()) {
					if (this.expand) {
						this.expand();
						// ProjectProvider.getProject().updatePopupExpanded(this.name, this.isExpanded());
					}
					this.expandable.destroy();
				} else {
					if (this.expandable) {
						this.expandable.destroy();
					}
					this.expandable = new Action(500);
					this.expandable.create().run();
				}
			}
			if (this.isMayDismissed()) {
				if (this.closeable) {
					this.closeable.destroy();
				}
				this.closeable = new Action(750);
				this.closeable.create().run();
			}
			break;
		case 1:
			if (this.isMayDismissed()) {
				if (this.closeable && this.closeable.getThread() && this.closeable.getLeftTime() == 0) {
					this.closeable.destroy();
					Popups.closeIfOpened(this.name);
				} // else ProjectProvider.getProject().updatePopupLocation(this.name, event.getRawX() - this.dx, event.getRawY() - this.dy);
			}
			break;
		case 2:
			let x = event.getX() - this.dx,
				y = event.getY() - this.dy;
			if (this.isMayDragged()) {
				this.setX(event.getRawX() - this.dx);
				this.setY(event.getRawY() - this.dy);
				this.update();
			}
			if (x > 0 || y > 0) {
				if (this.closeable) {
					this.closeable.destroy();
				}
				if (this.expandable) {
					this.expandable.destroy();
				}
			}
			break;
	}
	return true;
};

FocusablePopup.prototype.setTitle = function(title) {
	this.views.title.setText(title);
};

FocusablePopup.prototype.expanded = true;

FocusablePopup.prototype.isExpanded = function() {
	return this.expanded;
};

FocusablePopup.prototype.expand = function() {
	if (this.isExpanded()) {
		this.minimize();
	} else this.maximize();
};

FocusablePopup.prototype.minimize = function() {
	let actor = new android.transition.Fade();
	actor.setDuration(200);
	this.beginDelayedTransition(actor);
	this.views.scroll.setVisibility(Interface.Visibility.GONE);
	this.expanded = false;
};

FocusablePopup.prototype.maximize = function() {
	let actor = new android.transition.Fade();
	actor.setDuration(400);
	this.beginDelayedTransition(actor);
	this.views.scroll.setVisibility(Interface.Visibility.VISIBLE);
	this.expanded = true;
};

FocusablePopup.prototype.mayDismissed = true;

FocusablePopup.prototype.isMayDismissed = function() {
	return this.mayDismissed;
};

FocusablePopup.prototype.setIsMayDismissed = function(enabled) {
	this.mayDismissed = Boolean(enabled);
};

FocusablePopup.prototype.mayCollapsed = true;

FocusablePopup.prototype.isMayCollapsed = function() {
	return this.mayCollapsed;
};

FocusablePopup.prototype.setIsMayCollapsed = function(enabled) {
	this.mayCollapsed = Boolean(enabled);
};

FocusablePopup.prototype.mayDragged = true;

FocusablePopup.prototype.isMayDragged = function() {
	return this.mayDragged;
};

FocusablePopup.prototype.setIsMayDragged = function(enabled) {
	this.mayDragged = Boolean(enabled);
};
