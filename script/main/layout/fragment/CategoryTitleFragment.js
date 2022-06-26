const CategoryTitleFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
};

CategoryTitleFragment.prototype = new TextFragment;
CategoryTitleFragment.prototype.TYPE = "CategoryTitleFragment";

CategoryTitleFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(getContext());
	view.setPadding(toComplexUnitDip(10), toComplexUnitDip(10),
		toComplexUnitDip(10), toComplexUnitDip(5));
	view.setTextSize(toComplexUnitSp(7));
	view.setTextColor($.Color.WHITE);
	view.setTypeface(typeface);
	view.setLayoutParams(new android.view.ViewGroup.
		LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
	this.setContainerView(view);
};

CategoryTitleFragment.prototype.getTextView = function() {
	return this.getContainer();
};

CategoryTitleFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof CategoryTitleFragment)) {
		json = instanceOrJson;
		instanceOrJson = new CategoryTitleFragment();
	}
	return TextFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("categoryTitle", CategoryTitleFragment);
