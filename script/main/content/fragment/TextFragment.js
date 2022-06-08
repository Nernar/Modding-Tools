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
