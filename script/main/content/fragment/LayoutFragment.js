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

LayoutFragment.parseJson = function(instanceOrJson, json, preferredElement) {
	if (!instanceOrJson instanceof ImageFragment) {
		json = instanceOrJson;
		instanceOrJson = new ImageFragment();
	}
	instanceOrJson = BaseFragment.parseJson(instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("elements")) {
		let elements = calloutOrParse(json, json.elements, [this, instanceOrJson]);
		if (elements !== null && typeof elements == "object") {
			if (!Array.isArray(elements)) elements = [elements];
			for (let i = 0; i < elements.length; i++) {
				let item = calloutOrParse(elements, elements[i], [this, json, instanceOrJson]);
				if (item !== null && typeof item == "object") {
					// TODO
				}
			}
		}
	}
	return instanceOrJson;
};
