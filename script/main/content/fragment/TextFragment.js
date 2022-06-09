const TextFragment = function() {
	BaseFragment.apply(this, arguments);
};

TextFragment.prototype = new BaseFragment;
TextFragment.prototype.TYPE = "TextFragment";

TextFragment.prototype.getTextView = function() {
	MCSystem.throwException("ModdingTools: " + this.TYPE + ".getTextView must be implemented");
};

TextFragment.prototype.getText = function() {
	let view = this.getTextView();
	if (view === null) return;
	return "" + view.getText();
};

TextFragment.prototype.appendText = function(text) {
	let view = this.getTextView();
	if (view === null) return this;
	view.append("" + text);
	return this;
};

TextFragment.prototype.setText = function(text) {
	let view = this.getTextView();
	if (view === null) return this;
	view.setText("" + text);
	return this;
};

TextFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof TextFragment)) {
		json = instanceOrJson;
		instanceOrJson = new TextFragment();
	}
	instanceOrJson = BaseFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("text")) {
		instanceOrJson.setText(calloutOrParse(json, json.text, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("append")) {
		instanceOrJson.appendText(calloutOrParse(json, json.append, [this, instanceOrJson]));
	}
	return instanceOrJson;
};
