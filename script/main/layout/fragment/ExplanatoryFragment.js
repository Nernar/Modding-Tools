const ExplanatoryFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
};

ExplanatoryFragment.prototype = new TextFragment;
ExplanatoryFragment.prototype.TYPE = "ExplanatoryFragment";

ExplanatoryFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(context);
	view.setPadding(Interface.getY(20), Interface.getY(16), Interface.getY(20), Interface.getY(16));
	view.setTextSize(Interface.getFontSize(15));
	view.setTextColor(Interface.Color.LTGRAY);
	view.setGravity(Interface.Gravity.CENTER);
	view.setTypeface(typeface);
	view.setLayoutParams(new android.view.ViewGroup.
		LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP));
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
