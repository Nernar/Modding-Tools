function TextFragment() {
	BaseFragment.apply(this, arguments);
	if (!isAndroid()) {
		this.text = "";
	}
};

TextFragment.prototype = new BaseFragment;
TextFragment.prototype.TYPE = "TextFragment";

TextFragment.prototype.getTextView = function() {
	MCSystem.throwException("ModdingTools: " + this.TYPE + ".getTextView must be implemented");
};

/**
 * @requires `isCLI()`
 */
TextFragment.prototype.render = function(hovered) {
	return this.text;
};

TextFragment.prototype.getText = function() {
	if (isAndroid()) {
		let view = this.getTextView();
		if (view === null) return null;
		return "" + view.getText();
	}
	return this.text || null;
};

TextFragment.prototype.appendText = function(text) {
	if (isAndroid()) {
		let view = this.getTextView();
		if (view === null) return this;
		view.append("" + text);
	} else {
		this.text += text;
	}
	return this;
};

TextFragment.prototype.setText = function(text) {
	if (isAndroid()) {
		let view = this.getTextView();
		if (view === null) return this;
		view.setText("" + text);
	} else {
		this.text = "" + text;
	}
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
