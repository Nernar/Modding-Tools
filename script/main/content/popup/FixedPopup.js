const FixedPopup = function() {
	FocusablePopup.apply(this, arguments);
	this.setFragment(new FixedFragment());
	this.fragments = [];
};

FixedPopup.prototype = new FocusablePopup;
FixedPopup.prototype.TYPE = "FixedPopup";

FixedPopup.prototype.addElementFragment = function(fragment, params) {
	if (params === undefined) {
		this.getFragment().getContainerLayout().addView(fragment.getContainer());
	} else {
		this.getFragment().getContainerLayout().addView(fragment.getContainer(), params);
	}
	return this.fragments.push(fragment) - 1;
};

FixedPopup.prototype.addElementView = function(container, params) {
	let fragment = new Fragment();
	fragment.setContainerView(container);
	return this.addElementFragment(fragment, params);
};

FixedPopup.prototype.getElementCount = function() {
	return this.fragments.length;
};

FixedPopup.prototype.getElementFragment = function(index) {
	if (this.fragments.length > index || index < 0) {
		log("ModdingTools: not found FixedPopup element at index " + index);
		return null;
	}
	return this.fragments[index];
};

FixedPopup.prototype.removeElementAt = function(index) {
	if (this.fragments.length > index || index < 0) {
		log("ModdingTools: not found FixedPopup element at index " + index);
		return false;
	}
	let fragment = this.fragments[index];
	this.getFragment().getContainerLayout().removeView(fragment.getContainer());
	this.fragments.splice(index, 1);
	return true;
};
