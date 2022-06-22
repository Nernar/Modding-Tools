const PropertyInputFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
};

PropertyInputFragment.prototype = new TextFragment;
PropertyInputFragment.prototype.TYPE = "PropertyInputFragment";

PropertyInputFragment.prototype.resetContainer = function() {
	let view = new android.widget.EditText(getContext());
	view.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
		android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
		android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	view.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
		android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
	view.setPadding(getDisplayPercentHeight(18), getDisplayPercentHeight(18), getDisplayPercentHeight(18), getDisplayPercentHeight(18));
	view.setHintTextColor($.Color.LTGRAY);
	view.setTextSize(getRelativeDisplayPercentWidth(19));
	view.setTextColor($.Color.WHITE);
	view.setSingleLine(false);
	view.setTypeface(typeface);
	view.setHorizontallyScrolling(true);
	view.setFocusableInTouchMode(true);
	view.setOnClickListener(function(view) {
		view.requestFocus();
		let ims = getContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
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

PropertyInputFragment.prototype.isRequiresFocusable = function() {
	return true;
};

PropertyInputFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof PropertyInputFragment)) {
		json = instanceOrJson;
		instanceOrJson = new PropertyInputFragment();
	}
	instanceOrJson = TextFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("hint")) {
		instanceOrJson.setHint(calloutOrParse(json, json.hint, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

registerFragmentJson("propertyInput", PropertyInputFragment);
