function ThinButtonFragment() {
	TextFragment.apply(this, arguments);
	if (isAndroid()) {
		this.resetContainer();
	}
	this.setIsSelectable(true);
};

ThinButtonFragment.prototype = new TextFragment;
ThinButtonFragment.prototype.TYPE = "ThinButtonFragment";

ThinButtonFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(getContext());
	view.setPadding(toComplexUnitDip(16), toComplexUnitDip(6),
		toComplexUnitDip(16), toComplexUnitDip(6));
	view.setTextSize(toComplexUnitSp(8));
	view.setGravity($.Gravity.CENTER);
	view.setTextColor($.Color.WHITE);
	view.setTypeface(typeface);
	view.setLayoutParams(new android.view.ViewGroup.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
	this.setContainerView(view);
};

ThinButtonFragment.prototype.getTextView = function() {
	return this.getContainer();
};

ThinButtonFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ThinButtonFragment)) {
		json = instanceOrJson;
		instanceOrJson = new ThinButtonFragment();
	}
	return TextFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("thinButton", ThinButtonFragment);
