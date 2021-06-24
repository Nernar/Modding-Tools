const OverlayFragment = function() {
	Fragment.apply(this, arguments);
	this.resetContainer();
};

OverlayFragment.prototype = new Fragment;

OverlayFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(context);
	this.setContainerView(container);
	
	let text = new android.widget.TextView(context);
	text.setTextSize(Interface.getFontSize(22));
	text.setGravity(Interface.Gravity.CENTER);
	text.setTextColor(Interface.Color.WHITE);
	typeface && text.setTypeface(typeface);
	text.setPadding(Interface.getY(32), Interface.getY(16),
		Interface.getY(32), Interface.getY(16));
	text.setTag("overlayInformation");
	container.addView(text);
};

OverlayFragment.prototype.getInformationView = function() {
	return this.findViewByTag("overlayInformation");
};

OverlayFragment.prototype.appendText = function(text) {
	let view = this.getInformationView();
	if (view === null) return;
	view.append(String(text));
};

OverlayFragment.prototype.setText = function(text) {
	let view = this.getInformationView();
	if (view === null) return;
	view.setText(String(text));
};

OverlayFragment.prototype.getText = function() {
	let view = this.getInformationView();
	if (view === null) return;
	return String(view.getText());
};

OverlayFragment.prototype.getBackground = function() {
	return this.background || null;
};

OverlayFragment.prototype.setBackground = function(drawable) {
	let background = this.getInformationView();
	if (background === null) return this;
	if (!(drawable instanceof android.graphics.drawable.Drawable)) {
		drawable = ImageFactory.getDrawable(drawable);
	}
	background.setBackgroundDrawable(drawable);
	this.background = drawable;
	return this;
};
