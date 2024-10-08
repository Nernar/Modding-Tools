function ExplanatoryFragment() {
	TextFragment.apply(this, arguments);
};

ExplanatoryFragment.prototype = new TextFragment;
ExplanatoryFragment.prototype.TYPE = "ExplanatoryFragment";

ExplanatoryFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(getContext());
	view.setPadding(toComplexUnitDip(14), toComplexUnitDip(10),
		toComplexUnitDip(14), toComplexUnitDip(10));
	view.setTextSize(toComplexUnitDp(6));
	view.setTextColor($.Color.LTGRAY);
	view.setGravity($.Gravity.CENTER);
	view.setTypeface(typeface);
	view.setLayoutParams(new android.view.ViewGroup.
		LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
	this.setContainerView(view);
};

ExplanatoryFragment.prototype.getTextView = function() {
	return this.getContainer();
};

ExplanatoryFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ExplanatoryFragment)) {
		json = instanceOrJson;
		instanceOrJson = new ExplanatoryFragment();
	}
	return TextFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("explanatory", ExplanatoryFragment);
