const OverlayFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
};

OverlayFragment.prototype = new TextFragment;

OverlayFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);
	
	let text = new android.widget.TextView(getContext());
	text.setTextSize(toComplexUnitSp(8));
	text.setGravity($.Gravity.CENTER);
	text.setTextColor($.Color.WHITE);
	typeface && text.setTypeface(typeface);
	text.setPadding(toComplexUnitDip(20), toComplexUnitDip(10),
		toComplexUnitDip(20), toComplexUnitDip(10));
	text.setTag("overlayInformation");
	container.addView(text);
};

OverlayFragment.prototype.getTextView = function() {
	return this.findViewByTag("overlayInformation");
};
