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

	let fragment = new FrameFragment();
	fragment.setBackground("popup");
	this.setFragment(fragment);
	let place = Popups.getAvailablePlace();
	this.setX(place.x);
	this.setY(place.y);
	this.setGravity(Interface.Gravity.LEFT | Interface.Gravity.TOP);
};

FocusablePopup.prototype = new TransitionWindow;
FocusablePopup.prototype.TYPE = "FocusablePopup";

FocusablePopup.prototype.mayDismissed = true;

FocusablePopup.prototype.isMayDismissed = function() {
	return this.mayDismissed;
};

FocusablePopup.prototype.setIsMayDismissed = function(enabled) {
	this.mayDismissed = Boolean(enabled);
};

FocusablePopup.prototype.showInternal = function() {
	return TransitionWindow.prototype.show.apply(this, arguments);
};

FocusablePopup.prototype.show = function() {
	Popups.open(this, this.id);
};

FocusablePopup.prototype.dismissInternal = function() {
	return TransitionWindow.prototype.dismiss.apply(this, arguments);
};

FocusablePopup.prototype.dismiss = function() {
	if (this.isMayDismissed()) {
		Popups.closeIfOpened(this.id);
	}
};
