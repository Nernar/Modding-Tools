const ExpandablePopup = function() {
	let self = this;
	FixedPopup.apply(this, arguments);
	let fragment = new ExpandableFragment();
	fragment.getTitleView().setOnTouchListener(function(view, event) {
		return tryoutSafety(function() {
			return self.handleTouch(event);
		}, false);
	});
	this.setFragment(fragment);
};

ExpandablePopup.prototype = new FixedPopup;
ExpandablePopup.prototype.TYPE = "ExpandablePopup";

ExpandablePopup.prototype.setTitle = function(title) {
	this.getFragment().getTitleView().setText(title);
};

ExpandablePopup.prototype.handleTouch = function(event) {
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

ExpandablePopup.prototype.expanded = true;

ExpandablePopup.prototype.isExpanded = function() {
	return this.expanded;
};

ExpandablePopup.prototype.expand = function() {
	if (this.isExpanded()) {
		this.minimize();
	} else this.maximize();
};

ExpandablePopup.prototype.minimize = function() {
	let actor = new android.transition.Fade();
	actor.setDuration(200);
	this.beginDelayedTransition(actor);
	this.getFragment().getContainerScroll().setVisibility(Interface.Visibility.GONE);
	this.expanded = false;
};

ExpandablePopup.prototype.maximize = function() {
	let actor = new android.transition.Fade();
	actor.setDuration(400);
	this.beginDelayedTransition(actor);
	this.getFragment().getContainerScroll().setVisibility(Interface.Visibility.VISIBLE);
	this.expanded = true;
};

ExpandablePopup.prototype.mayCollapsed = true;

ExpandablePopup.prototype.isMayCollapsed = function() {
	return this.mayCollapsed;
};

ExpandablePopup.prototype.setIsMayCollapsed = function(enabled) {
	this.mayCollapsed = Boolean(enabled);
};

ExpandablePopup.prototype.mayDragged = true;

ExpandablePopup.prototype.isMayDragged = function() {
	return this.mayDragged;
};

ExpandablePopup.prototype.setIsMayDragged = function(enabled) {
	this.mayDragged = Boolean(enabled);
};
