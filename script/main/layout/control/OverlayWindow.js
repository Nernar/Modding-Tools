/**
 * @type
 */
const OverlayWindow = function() {
	return UniqueWindow.apply(this, arguments);
};

OverlayWindow.prototype = new UniqueWindow;
OverlayWindow.prototype.TYPE = "OverlayWindow";

OverlayWindow.prototype.resetWindow = function() {
	UniqueWindow.prototype.resetWindow.apply(this, arguments);
	this.setTouchable(false);
	this.setX(toComplexUnitDip(96));
	this.setFragment(new OverlayFragment());

	let slide = new android.transition.Slide($.Gravity.TOP);
	slide.setInterpolator(new android.view.animation.DecelerateInterpolator());
	slide.setDuration(400);
	this.setEnterTransition(slide);

	slide = new android.transition.Slide($.Gravity.TOP);
	slide.setInterpolator(new android.view.animation.AccelerateInterpolator());
	slide.setDuration(400);
	this.setExitTransition(slide);

	this.setBackground("popup");
}

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
