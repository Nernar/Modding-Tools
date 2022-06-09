const ThinButtonFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
	this.setIsSelectable(true);
};

ThinButtonFragment.prototype = new TextFragment;
ThinButtonFragment.prototype.TYPE = "ThinButtonFragment";

ThinButtonFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(context);
	view.setPadding(Interface.getY(24), Interface.getY(8), Interface.getY(24), Interface.getY(8));
	view.setTextSize(Interface.getFontSize(21));
	view.setGravity(Interface.Gravity.CENTER);
	view.setTextColor(Interface.Color.WHITE);
	view.setTypeface(typeface);
	view.setLayoutParams(new android.view.ViewGroup.
		LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP));
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
