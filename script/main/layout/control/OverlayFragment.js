const OverlayFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
};

OverlayFragment.prototype = new TextFragment;

OverlayFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);
	
	let text = new android.widget.TextView(getContext());
	text.setTextSize(getRelativeDisplayPercentWidth(22));
	text.setGravity($.Gravity.CENTER);
	text.setTextColor($.Color.WHITE);
	typeface && text.setTypeface(typeface);
	text.setPadding(getDisplayPercentHeight(32), getDisplayPercentHeight(16),
		getDisplayPercentHeight(32), getDisplayPercentHeight(16));
	text.setTag("overlayInformation");
	container.addView(text);
};

OverlayFragment.prototype.getTextView = function() {
	return this.findViewByTag("overlayInformation");
};
