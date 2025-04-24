abstract class LayoutFragment extends BaseFragment {
	readonly TYPE: string = "LayoutFragment";
	constructor() {
		super();
		this.fragments = [];
	}
	override getContainer() {
		return super.getContainer() as android.view.ViewGroup;
	}
	getContainerLayout() {
		return this.getContainer() as android.view.ViewGroup;
	}
	private fragments: Fragment[];
	getFragments() {
		return this.fragments || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	addViewDirectly(view, params) {
		let container = this.getContainerLayout();
		if (container != null) {
			if (params == null) {
				container.addView(view);
			} else {
				container.addView(view, params);
			}
		}
	}
	addFragment(fragment, params) {
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
	}
	/**
	 * @requires `isAndroid()`
	 */
	addView(container, params) {
		if (!(container instanceof android.view.View)) {
			MCSystem.throwException("Modding Tools: Illegal view passed to LayoutFragment.addView!");
		}
		let fragment = new Fragment();
		fragment.setContainerView(container);
		return this.addFragment(fragment, params);
	}
	getFragmentCount() {
		return this.fragments.length;
	}
	getFragmentAt(index) {
		if (index >= this.fragments.length || index < 0) {
			Logger.Log("Modding Tools: Not found LayoutFragment element at index " + index + "!", "WARNING");
			return null;
		}
		return this.fragments[index];
	}
	indexOf(fragmentOrView) {
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
	}
	findFragment(token) {
		for (let index = 0; index < this.getFragmentCount(); index++) {
			let fragment = this.getFragmentAt(index);
			if (fragment.getToken() == token) {
				return fragment;
			}
		}
		return null;
	}
	obtain = (function() {
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
	updateLayout() {
		return BaseFragment.prototype.update.apply(this, arguments);
	}
	update() {
		let optionals = arguments;
		this.obtain(function(fragment) {
			if (fragment instanceof LayoutFragment) {
				fragment.updateLayout.apply(fragment, optionals);
			} else {
				fragment.update.apply(fragment, optionals);
			}
		});
	}
	updateWith(when) {
		let optionals = Array.prototype.slice.call(arguments, 1);
		this.obtain(function(fragment) {
			if (fragment instanceof LayoutFragment) {
				fragment.updateLayout.apply(fragment, optionals);
			} else {
				fragment.update.apply(fragment, optionals);
			}
		}, when);
	}
	removeViewDirectly(view) {
		let container = this.getContainerLayout();
		container != null && container.removeView(view);
	}
	removeFragment(indexOrFragment) {
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
	}
	removeFragments(condition?) {
		for (let index = this.fragments.length - 1; index >= 0; index--) {
			let fragment = this.fragments[index];
			if (condition == null || condition.call(this, fragment, index)) {
				this.removeFragment(index);
			}
		}
	}
	override isRequiresFocusable() {
		for (let i = 0; i < this.fragments.length; i++) {
			if (this.fragments[i].isRequiresFocusable()) {
				return true;
			}
		}
		return this.isLayoutRequiresFocusable && this.isLayoutRequiresFocusable();
	}
}

namespace LayoutFragment {
	export function parseLayoutJson(instanceOrJson, json, elements, preferredFragment) {
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
	}
	export function parseJson(instanceOrJson, json?, preferredFragment?) {
		if (!(instanceOrJson instanceof LayoutFragment)) {
			MCSystem.throwException("LayoutFragment.parseJson is callable only with non-abstract instances!");
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
	}
}

interface ILayoutFragment<ABC = ILayoutFragment<any>> extends IBaseFragment<ABC> {
	elements?: CallableJsonProperty1<ABC, CallableJsonProperty2<ABC, object, IBaseFragment> | CallableJsonProperty2<ABC, object, IBaseFragment>[]>;
	fragments?: CallableJsonProperty1<ABC, CallableJsonProperty2<ABC, object, IBaseFragment> | CallableJsonProperty2<ABC, object, IBaseFragment>[]>;
}

interface LayoutFragment {
	addScroll(): ScrollFragment;
	addHorizontalScroll(): HorizontalScrollFragment;
	addCategoryTitle(text?: string): CategoryTitleFragment;
	addExplanatory(text?: string): ExplanatoryFragment;
	addAxisGroup(axis?: string): AxisGroupFragment;
	addSlider(value?: number, change?, modifiers?: number[], modifier?: number): SliderFragment;
	addCounter(value?: number, change?, modifiers?: number[], modifier?: number): CounterFragment;
	addAngleCircle(value?: number, change?): AngleCircleFragment;
	addPropertyInput(hint?: string, text?: string): PropertyInputFragment;
	addAutoCompleteInput(hint?: string, text?: string, adapter?: any): AutoCompleteInputFragment;
	addButton(text?: string, click?: any): ButtonFragment;
	addSolidButton(text?: string, click?: any): ButtonFragment;
	/**
	 * @deprecated Use {@link LayoutFragment.addButton} instead.
	 */
	addThinButton(text?: string, click?: any): ButtonFragment;
	addPopupButton(text?: string, click?: any): ButtonFragment;
	addSegmentGroup(): SegmentGroupFragment;
}

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
