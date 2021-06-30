const OverlayWindow = function() {
	UniqueWindow.apply(this, arguments);
	this.setTouchable(false);
	this.setX(Interface.getY(140));
	this.setFragment(new OverlayFragment());
	let slide = new SlideActor(Interface.Gravity.TOP);
	slide.setInterpolator(new DecelerateInterpolator());
	slide.setDuration(400);
	this.setEnterActor(slide);
	slide = new SlideActor(Interface.Gravity.TOP);
	slide.setInterpolator(new AccelerateInterpolator());
	slide.setDuration(400);
	this.setExitActor(slide);
	this.setBackground("popup");
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
