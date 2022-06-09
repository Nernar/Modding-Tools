const PropertyInputFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
};

PropertyInputFragment.prototype = new TextFragment;
PropertyInputFragment.prototype.TYPE = "PropertyInputFragment";

PropertyInputFragment.prototype.resetContainer = function() {
	let view = new android.widget.EditText(context);
	view.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
		android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
		android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	view.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
		android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
	view.setPadding(Interface.getY(18), Interface.getY(18), Interface.getY(18), Interface.getY(18));
	view.setHintTextColor(Interface.Color.LTGRAY);
	view.setTextSize(Interface.getFontSize(19));
	view.setTextColor(Interface.Color.WHITE);
	view.setSingleLine(false);
	view.setTypeface(typeface);
	view.setHorizontallyScrolling(true);
	view.setFocusableInTouchMode(true);
	view.setOnClickListener(function(view) {
		view.requestFocus();
		let ims = context.getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
		ims.showSoftInput(view, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
	});
	this.setContainerView(view);
};

PropertyInputFragment.prototype.getTextView = function() {
	return this.getContainer();
};

PropertyInputFragment.prototype.setHint = function(who) {
	this.getTextView().setHint("" + who);
	return this;
};

PropertyInputFragment.parseJson = function(instanceOrJson, json) {
	if (!instanceOrJson instanceof PropertyInputFragment) {
		json = instanceOrJson;
		instanceOrJson = new PropertyInputFragment();
	}
	instanceOrJson = TextFragment.parseJson(instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("hint")) {
		instanceOrJson.setHint(calloutOrParse(json, json.hint, [this, instanceOrJson]));
	}
	return instanceOrJson;
};
