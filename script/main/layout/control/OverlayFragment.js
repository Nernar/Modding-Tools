const OverlayFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
};

OverlayFragment.prototype = new TextFragment;

OverlayFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);
	
	let text = new android.widget.TextView(getContext());
	text.setTextSize(Interface.getFontSize(22));
	text.setGravity(Interface.Gravity.CENTER);
	text.setTextColor(Interface.Color.WHITE);
	typeface && text.setTypeface(typeface);
	text.setPadding(Interface.getY(32), Interface.getY(16),
		Interface.getY(32), Interface.getY(16));
	text.setTag("overlayInformation");
	container.addView(text);
};

OverlayFragment.prototype.getTextView = function() {
	return this.findViewByTag("overlayInformation");
};
