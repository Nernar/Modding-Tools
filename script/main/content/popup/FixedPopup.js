const FixedPopup = function() {
	FocusablePopup.apply(this, arguments);
	this.setFragment(new FixedFragment());
	this.fragments = [];
};

FixedPopup.prototype = new FocusablePopup;
FixedPopup.prototype.TYPE = "FixedPopup";

FixedPopup.prototype.addElement = function(fragment, params) {
	return this.getFragment().addElementFragment(fragment, params);
};

FixedPopup.prototype.getElementCount = function() {
	return this.getFragment().getElementCount();
};

FixedPopup.prototype.getElement = function(index) {
	return this.getFragment().getElementFragment(index);
};

FixedPopup.prototype.removeElementAt = function(index) {
	return this.getFragment().removeElementAt(index);
};
