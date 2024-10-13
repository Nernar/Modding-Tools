const Fragment = function() {
	this.views = {};
	this.selectable = false;
	this.hoverable = true;
};

Fragment.prototype.getContainer = function() {
	return this.container || null;
};

Fragment.prototype.setContainerView = function(view) {
	this.container = view;
	return this;
};

/**
 * @requires `isCLI()`
 */
Fragment.prototype.draw = function(hovered) {
	return "";
};

/**
 * @requires `isCLI()`
 */
Fragment.prototype.observe = function(keys) {
	return false;
};

/**
 * @requires `isCLI()`
 */
Fragment.prototype.hover = function() {
	return this.isHoverable();
};

Fragment.prototype.getViews = function() {
	return this.views || null;
};

Fragment.prototype.findViewByKey = function(key) {
	return this.views[key] || null;
};

/**
 * @requires `isAndroid()`
 */
Fragment.prototype.findViewById = function(id) {
	let container = this.getContainer();
	if (container == null) return null;
	return container.findViewById(id) || null;
};

/**
 * @requires `isAndroid()`
 */
Fragment.prototype.findViewByTag = function(tag) {
	let container = this.getContainer();
	if (container == null) return null;
	return container.findViewWithTag(tag) || null;
};

Fragment.prototype.findView = function(stroke) {
	let byKey = this.findViewByKey(stroke);
	if (isAndroid()) {
		return byKey || this.findViewById(stroke) || this.findViewByTag(stroke);
	}
	return byKey;
};

Fragment.prototype.getParent = function() {
	return this.parent || null;
};

Fragment.prototype.getWindow = function() {
	let fragment = this.getParent();
	while (fragment instanceof Fragment) {
		fragment = fragment.getParent();
	}
	return fragment;
};

Fragment.prototype.getIndex = function() {
	let parent = this.getParent();
	if (parent && parent instanceof LayoutFragment) {
		return parent.indexOf(this);
	}
	return -1;
};

Fragment.prototype.attach = function(parent) {
	if (parent == null || parent == this.parent) {
		if (parent == null) {
			MCSystem.throwException("Modding Tools: Fragment.attach(*) was called with an invalid parent: " + parent);
		}
		return;
	}
	this.parent = parent;
	this.onAttach && this.onAttach(parent);
};

Fragment.prototype.deattach = function() {
	if (this.parent != null) {
		this.onDeattach && this.onDeattach();
	}
	delete this.parent;
};

Fragment.prototype.update = function() {
	this.updateFragment && this.updateFragment.apply(this, arguments);
	this.onUpdate && this.onUpdate.apply(this, arguments);
};

Fragment.prototype.updateWith = function(when) {
	if (typeof when != "function" || when(this)) {
		this.update.apply(this, Array.prototype.slice.call(arguments, 1));
	}
};

Fragment.prototype.setOnAttachListener = function(listener) {
	if (listener != null) {
		this.onAttach = listener.bind(this);
	} else {
		delete this.onAttach;
	}
	return this;
};

Fragment.prototype.setOnDeattachListener = function(listener) {
	if (listener != null) {
		this.onDeattach = listener.bind(this);
	} else {
		delete this.onDeattach;
	}
	return this;
};

Fragment.prototype.setOnUpdateListener = function(listener) {
	if (listener != null) {
		this.onUpdate = listener.bind(this);
	} else {
		delete this.onUpdate;
	}
	return this;
};

/**
 * @requires `isCLI()`
 */
Fragment.prototype.isHoverable = function() {
	return this.hoverable;
};

/**
 * @requires `isCLI()`
 */
Fragment.prototype.setIsHoverable = function(hoverable) {
	this.hoverable = !!hoverable;
	return this;
};

Fragment.prototype.isSelectable = function() {
	return this.selectable;
};

Fragment.prototype.setIsSelectable = function(selectable) {
	this.selectable = !!selectable;
	return this;
};

/**
 * @requires `isAndroid()`
 */
Fragment.prototype.isRequiresFocusable = function() {
	return false;
};

const registerFragmentJson = (function() {
	let fragments = {};

	Fragment.parseJson = function(instanceOrJson, json, preferredFragment) {
		if (!(instanceOrJson instanceof Fragment)) {
			json = instanceOrJson;
			instanceOrJson = null;
		}
		if (json != null && typeof json == "object" && json.type != null) {
			preferredFragment = json.type;
		}
		if (preferredFragment == null || !fragments.hasOwnProperty(preferredFragment)) {
			Logger.Log("Modding Tools: Unresolved fragment " + JSON.stringify(preferredFragment) + ", please make sure that \"type\" property is used anywhere...", "WARNING");
			return instanceOrJson;
		}
		return fragments[preferredFragment].parseJson.call(this, instanceOrJson || new fragments[preferredFragment](), json);
	};

	return function(id, fragment) {
		if (fragments.hasOwnProperty(id)) {
			Logger.Log("Modding Tools: Fragment json " + JSON.stringify(id) + " is already occupied!", "WARNING");
			return false;
		}
		if (typeof fragment != "function" || !(fragment.prototype instanceof Fragment)) {
			Logger.Log("Modding Tools: Passed fragment " + fragment + " for json " + JSON.stringify(id) + " must contain prototype of Fragment!", "WARNING");
			return false;
		}
		if (typeof fragment.parseJson != "function") {
			Logger.Log("Modding Tools: Nothing to call by parseJson, please consider that your fragment contains required json property!", "WARNING");
			return false;
		}
		fragments[id] = fragment;
		return true;
	};
})();
