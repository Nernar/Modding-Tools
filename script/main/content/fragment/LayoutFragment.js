/**
 * @type
 */
const LayoutFragment = function() {
	BaseFragment.apply(this, arguments);
	this.fragments = [];
};

LayoutFragment.prototype = new BaseFragment;
LayoutFragment.prototype.TYPE = "LayoutFragment";

LayoutFragment.prototype.getContainerLayout = function() {
	return this.getContainer();
};

LayoutFragment.prototype.getFragments = function() {
	return this.fragments || null;
};

/**
 * @requires `isAndroid()`
 */
LayoutFragment.prototype.addViewDirectly = function(view, params) {
	let container = this.getContainerLayout();
	if (container != null) {
		if (params == null) {
			container.addView(view);
		} else {
			container.addView(view, params);
		}
	}
};

LayoutFragment.prototype.addFragment = function(fragment, params) {
	if (!(fragment instanceof Fragment)) {
		Logger.Log("Modding Tools: You tried to add an element that is not a fragment to addFragment!", "WARNING");
		return -1;
	}
	if (isAndroid()) {
		this.addViewDirectly(fragment.getContainer(), params);
	}
	let length = this.fragments.push(fragment);
	fragment.attach(this);
	return length - 1;
};

/**
 * @requires `isAndroid()`
 */
LayoutFragment.prototype.addView = function(container, params) {
	if (!(container instanceof android.view.View)) {
		MCSystem.throwException("Modding Tools: Illegal view passed to LayoutFragment.addView!");
	}
	let fragment = new Fragment();
	fragment.setContainerView(container);
	return this.addFragment(fragment, params);
};

LayoutFragment.prototype.getFragmentCount = function() {
	return this.fragments.length;
};

LayoutFragment.prototype.getFragmentAt = function(index) {
	if (index >= this.fragments.length || index < 0) {
		Logger.Log("Modding Tools: Not found LayoutFragment element at index " + index + "!", "WARNING");
		return null;
	}
	return this.fragments[index];
};

LayoutFragment.prototype.indexOf = function(fragmentOrView) {
	if (fragmentOrView instanceof android.view.View) {
		for (let index = 0; index < this.fragments.length; index++) {
			let fragment = this.fragments[index];
			if (fragment.getContainer() == fragmentOrView) {
				return index;
			}
		}
		return -1;
	}
	return this.fragments.indexOf(fragmentOrView);
};

LayoutFragment.prototype.obtain = (function() {
	let obtain = function(on, what, when) {
		if (typeof when != "function" || when(on)) {
			what(on);
		}
		if (on instanceof LayoutFragment) {
			let fragments = on.getFragments();
			for (let index = 0; index < fragments.length; index++) {
				obtain(fragments[index], what, when);
			}
		}
	};
	return function(what, when) {
		obtain(this, what, when);
	};
})();

LayoutFragment.prototype.updateLayout = function() {
	return BaseFragment.prototype.update.apply(this, arguments);
};

LayoutFragment.prototype.update = function() {
	let optionals = arguments;
	this.obtain(function(fragment) {
		if (fragment instanceof LayoutFragment) {
			fragment.updateLayout.apply(fragment, optionals);
		} else {
			fragment.update.apply(fragment, optionals);
		}
	});
};

LayoutFragment.prototype.updateWith = function(when) {
	let optionals = Array.prototype.slice.call(arguments, 1);
	this.obtain(function(fragment) {
		if (fragment instanceof LayoutFragment) {
			fragment.updateLayout.apply(fragment, optionals);
		} else {
			fragment.update.apply(fragment, optionals);
		}
	}, when);
};

LayoutFragment.prototype.removeViewDirectly = function(view) {
	let container = this.getContainerLayout();
	container != null && container.removeView(view);
};

LayoutFragment.prototype.removeFragment = function(indexOrFragment) {
	if (indexOrFragment instanceof Fragment) {
		indexOrFragment = this.indexOf(indexOrFragment);
	}
	if (typeof indexOrFragment != "number" || indexOrFragment >= this.fragments.length || indexOrFragment < 0) {
		Logger.Log("Modding Tools: Not found LayoutFragment element at index " + indexOrFragment + "!", "WARNING");
		return false;
	}
	let fragment = this.fragments[indexOrFragment];
	if (isAndroid()) {
		this.removeViewDirectly(fragment.getContainer());
	}
	this.fragments.splice(indexOrFragment, 1);
	fragment.deattach();
	return true;
};

LayoutFragment.prototype.removeFragments = function(condition) {
	if (condition != null) {
		condition = condition.bind(this);
	}
	for (let index = this.fragments.length - 1; index >= 0; index--) {
		let fragment = this.fragments[index];
		if (condition == null || condition(fragment, index)) {
			this.removeFragment(index);
		}
	}
};

LayoutFragment.prototype.isRequiresFocusable = function() {
	for (let i = 0; i < this.fragments.length; i++) {
		if (this.fragments[i].isRequiresFocusable()) {
			return true;
		}
	}
	return this.isLayoutRequiresFocusable && this.isLayoutRequiresFocusable();
};

LayoutFragment.parseLayoutJson = function(instanceOrJson, json, elements, preferredFragment) {
	elements = calloutOrParse(json, elements, [this, instanceOrJson]);
	if (elements != null && typeof elements == "object") {
		Array.isArray(elements) || (elements = [elements]);
		for (let offset = 0; offset < elements.length; offset++) {
			let item = calloutOrParse(elements, elements[offset], [this, json, instanceOrJson]);
			if (item != null && typeof item == "object") {
				let fragment = Fragment.parseJson.call(this, item, item, preferredFragment);
				if (fragment != null) {
					instanceOrJson.addFragment(fragment);
				}
			}
		}
	}
};

LayoutFragment.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof LayoutFragment)) {
		json = instanceOrJson;
		instanceOrJson = new LayoutFragment();
	} else {
		instanceOrJson.removeFragments();
	}
	instanceOrJson = BaseFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json == null || typeof json != "object") {
		return instanceOrJson;
	}
	if (Array.isArray(json)) {
		LayoutFragment.parseLayoutJson.call(this, instanceOrJson, json, json, preferredFragment);
	} else if (json.hasOwnProperty("fragments") || json.hasOwnProperty("elements")) {
		LayoutFragment.parseLayoutJson.call(this, instanceOrJson, json, json.fragments || json.elements, preferredFragment);
	}
	return instanceOrJson;
};

LayoutFragment.prototype.addScroll = function() {
	let fragment = new ScrollFragment();
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addHorizontalScroll = function() {
	let fragment = new HorizontalScrollFragment();
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addCategoryTitle = function(text) {
	let fragment = new CategoryTitleFragment();
	if (text !== undefined) {
		fragment.setText(text);
	}
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addExplanatory = function(text) {
	let fragment = new ExplanatoryFragment();
	if (text !== undefined) {
		fragment.setText(text);
	}
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addAxisGroup = function(axis) {
	let fragment = new AxisGroupFragment();
	if (axis !== undefined) {
		fragment.setAxis(axis);
	}
	this.addFragment(fragment);
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
	this.addFragment(fragment);
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
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addAngleCircle = function(value, change) {
	let fragment = new AngleCircleFragment();
	if (value !== undefined) {
		fragment.setValue(value);
	}
	if (change !== undefined) {
		fragment.setOnChangeListener(change);
	}
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addPropertyInput = function(hint, text) {
	let fragment = new PropertyInputFragment();
	if (hint !== undefined) {
		fragment.setHint(hint);
	}
	if (text !== undefined) {
		fragment.setText(text);
	}
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addAutoCompleteInput = function(hint, text, adapter) {
	let fragment = new AutoCompleteInputFragment();
	if (hint !== undefined) {
		fragment.setHint(hint);
	}
	if (text !== undefined) {
		fragment.setText(text);
	}
	if (adapter !== undefined) {
		fragment.setAdapter(adapter);
	}
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addButton = function(text, click) {
	let fragment = new ButtonFragment();
	if (text !== undefined) {
		fragment.setText(text);
	}
	if (click !== undefined) {
		fragment.setOnClickListener(click);
	}
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addSolidButton = function(text, click) {
	let fragment = new ButtonFragment("solid");
	if (text !== undefined) {
		fragment.setText(text);
	}
	if (click !== undefined) {
		fragment.setOnClickListener(click);
	}
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addThinButton = function(text, click) {
	Logger.Log("Modding Tools: LayoutFragment.addThinButton has been deprecated! Use primary LayoutFragment.addButton instead.", "WARNING");
	return this.addButton.apply(this, arguments);
};

LayoutFragment.prototype.addPopupButton = function(text, click) {
	let fragment = new ButtonFragment("popup");
	if (text !== undefined) {
		fragment.setText(text);
	}
	if (click !== undefined) {
		fragment.setOnClickListener(click);
	}
	this.addFragment(fragment);
	return fragment;
};

LayoutFragment.prototype.addSegmentGroup = function() {
	let fragment = new SegmentGroupFragment();
	this.addFragment(fragment);
	return fragment;
};
