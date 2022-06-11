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
	if (!(fragment instanceof Fragment)) {
		Logger.Log("ModdintTools: trying adding non-fragment element passed to addElementFragment", "INFO");
		return -1;
	}
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
	if (!(instanceOrJson instanceof LayoutFragment)) {
		json = instanceOrJson;
		instanceOrJson = new LayoutFragment();
	}
	instanceOrJson = BaseFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	while (instanceOrJson.getElementCount() > 0) {
		instanceOrJson.removeElementAt(0);
	}
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
					let fragment = Fragment.parseJson.call(this, item, item, preferredElement);
					if (fragment != null) {
						instanceOrJson.addElementFragment(fragment);
					}
				}
			}
		}
	}
	return instanceOrJson;
};

LayoutFragment.prototype.addCategoryTitle = function(text) {
	let fragment = new CategoryTitleFragment();
	if (text !== undefined) {
		fragment.setText(text);
	}
	this.addElementFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addExplanatory = function(text) {
	let fragment = new ExplanatoryFragment();
	if (text !== undefined) {
		fragment.setText(text);
	}
	this.addElementFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addAxisGroup = function(axis) {
	let fragment = new AxisGroupFragment();
	if (axis !== undefined) {
		fragment.setAxis(axis);
	}
	this.addElementFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addSlider = function(value, change, modifiers, modifier) {
	let fragment = new SliderFragment();
	if (value !== undefined) {
		fragment.setValue(value);
	}
	if (change !== undefined) {
		fragment.setOnChangeListener(change);
	}
	if (modifiers !== undefined) {
		fragment.setModifiers(modifiers);
	}
	if (modifier !== undefined) {
		fragment.setModifier(modifier);
	}
	this.addElementFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addCounter = function(value, change, modifiers, modifier) {
	let fragment = new CounterFragment();
	if (value !== undefined) {
		fragment.setValue(value);
	}
	if (change !== undefined) {
		fragment.setOnChangeListener(change);
	}
	if (modifiers !== undefined) {
		fragment.setModifiers(modifiers);
	}
	if (modifier !== undefined) {
		fragment.setModifier(modifier);
	}
	this.addElementFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addPropertyInput = function(text, hint) {
	let fragment = new PropertyInputFragment();
	if (text !== undefined) {
		fragment.setText(text);
	}
	if (hint !== undefined) {
		fragment.setHint(hint);
	}
	this.addElementFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addSolidButton = function(text, click) {
	let fragment = new SolidButtonFragment();
	if (text !== undefined) {
		fragment.setText(text);
	}
	if (click !== undefined) {
		fragment.setOnClickListener(click);
	}
	this.addElementFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addThinButton = function(text, click) {
	let fragment = new ThinButtonFragment();
	if (text !== undefined) {
		fragment.setText(text);
	}
	if (click !== undefined) {
		fragment.setOnClickListener(click);
	}
	this.addElementFragment(fragment);
	return fragment;
};
