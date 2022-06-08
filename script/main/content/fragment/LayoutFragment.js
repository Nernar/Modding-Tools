const LayoutFragment = function() {
	BaseFragment.apply(this, arguments);
	this.fragments = [];
};

LayoutFragment.prototype = new BaseFragment;
LayoutFragment.prototype.TYPE = "LayoutFragment";

LayoutFragment.prototype.getContainerLayout = function() {
	return this.getContainer();
};

LayoutFragment.prototype.addElementFragment = function(fragment, params) {
	if (params === undefined) {
		this.getContainerLayout().addView(fragment.getContainer());
	} else {
		this.getContainerLayout().addView(fragment.getContainer(), params);
	}
	return this.fragments.push(fragment) - 1;
};

LayoutFragment.prototype.addElementView = function(container, params) {
	let fragment = new Fragment();
	fragment.setContainerView(container);
	return this.addElementFragment(fragment, params);
};

LayoutFragment.prototype.getElementCount = function() {
	return this.fragments.length;
};

LayoutFragment.prototype.getElementFragment = function(index) {
	if (this.fragments.length > index || index < 0) {
		log("ModdingTools: not found LayoutFragment element at index " + index);
		return null;
	}
	return this.fragments[index];
};

LayoutFragment.prototype.removeElementAt = function(index) {
	if (this.fragments.length > index || index < 0) {
		log("ModdingTools: not found LayoutFragment element at index " + index);
		return false;
	}
	let fragment = this.fragments[index];
	this.getContainerLayout().removeView(fragment.getContainer());
	this.fragments.splice(index, 1);
	return true;
};
