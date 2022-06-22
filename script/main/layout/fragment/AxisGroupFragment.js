const AxisGroupFragment = function() {
	LayoutFragment.apply(this, arguments);
	this.resetContainer();
	this.setBackground("popup");
};

AxisGroupFragment.prototype = new LayoutFragment;
AxisGroupFragment.prototype.TYPE = "AxisGroupFragment";

AxisGroupFragment.prototype.resetContainer = function() {
	let content = new android.widget.LinearLayout(getContext());
	content.setPadding(getDisplayPercentHeight(10), getDisplayPercentHeight(10), getDisplayPercentHeight(10), getDisplayPercentHeight(10));
	this.setContainerView(content);
	
	let axis = new android.widget.TextView(getContext());
	axis.setPadding(getDisplayPercentHeight(16), getDisplayPercentHeight(10), getDisplayPercentHeight(16), getDisplayPercentHeight(10));
	axis.setTextSize(getRelativeDisplayPercentWidth(32));
	axis.setTextColor($.Color.WHITE);
	axis.setTypeface(typeface);
	axis.setMaxLines(1);
	axis.setTag("groupAxis");
	content.addView(axis);
	
	let container = new android.widget.LinearLayout(getContext());
	container.setOrientation($.LinearLayout.VERTICAL);
	container.setTag("containerGroup");
	content.addView(container);
};

AxisGroupFragment.prototype.getContainerRoot = function() {
	return this.findViewByTag("containerGroup");
};

AxisGroupFragment.prototype.getContainerLayout = function() {
	return this.getContainerRoot();
};

AxisGroupFragment.prototype.getTextView = function() {
	return this.findViewByTag("groupAxis");
};

AxisGroupFragment.prototype.getAxis = function() {
	return TextFragment.prototype.getText.apply(this, arguments);
};

AxisGroupFragment.prototype.appendAxis = function(text) {
	return TextFragment.prototype.appendText.apply(this, arguments);
};

AxisGroupFragment.prototype.setAxis = function(text) {
	return TextFragment.prototype.setText.apply(this, arguments);
};

AxisGroupFragment.parseJson = function(instanceOrJson, json, preferredElement) {
	if (!(instanceOrJson instanceof AxisGroupFragment)) {
		json = instanceOrJson;
		instanceOrJson = new AxisGroupFragment();
	}
	instanceOrJson = LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredElement !== undefined ? preferredElement : "slider");
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("text")) {
		instanceOrJson.setAxis(calloutOrParse(json, json.text, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("append")) {
		instanceOrJson.appendAxis(calloutOrParse(json, json.append, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

registerFragmentJson("axisGroup", AxisGroupFragment);
