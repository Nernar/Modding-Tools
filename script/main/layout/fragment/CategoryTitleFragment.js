const CategoryTitleFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
};

CategoryTitleFragment.prototype = new TextFragment;
CategoryTitleFragment.prototype.TYPE = "CategoryTitleFragment";

CategoryTitleFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(context);
	view.setPadding(Interface.getY(16), Interface.getY(16), Interface.getY(16), Interface.getY(8));
	view.setTextSize(Interface.getFontSize(18));
	view.setTextColor(Interface.Color.WHITE);
	view.setTypeface(typeface);
	view.setLayoutParams(new android.view.ViewGroup.
		LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP));
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
