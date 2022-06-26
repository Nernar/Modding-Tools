const OverlayWindow = function() {
	let window = UniqueWindow.apply(this, arguments);
	window.setTouchable(false);
	window.setX(toComplexUnitDip(96));
	window.setFragment(new OverlayFragment());
	
	let slide = new android.transition.Slide($.Gravity.TOP);
	slide.setInterpolator(new android.view.animation.DecelerateInterpolator());
	slide.setDuration(400);
	window.setEnterTransition(slide);
	
	slide = new android.transition.Slide($.Gravity.TOP);
	slide.setInterpolator(new android.view.animation.AccelerateInterpolator());
	slide.setDuration(400);
	window.setExitTransition(slide);
	
	window.setBackground("popup");
	return window;
};

OverlayWindow.prototype = new UniqueWindow;
OverlayWindow.prototype.TYPE = "OverlayWindow";

OverlayWindow.prototype.appendText = function(text) {
	this.getFragment().appendText(text);
};

OverlayWindow.prototype.setText = function(text) {
	this.getFragment().setText(text);
};

OverlayWindow.prototype.getText = function() {
	return this.getFragment().getText();
};

OverlayWindow.prototype.setBackground = function(drawable) {
	this.getFragment().setBackground(drawable);
};

OverlayWindow.prototype.getBackground = function() {
	return this.getFragment().getBackground();
};
