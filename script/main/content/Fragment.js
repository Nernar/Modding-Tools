function Fragment() {
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
	let views = this.getViews();
	if (views == null) return null;
	return views[key] || null;
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
		return byKey ||
			this.findViewById(stroke) ||
			this.findViewByTag(stroke);
	}
	return byKey;
};

/**
 * @requires `isCLI()`
 */
Fragment.prototype.isHoverable = function() {
	return !!this.hoverable;
};

/**
 * @requires `isCLI()`
 */
Fragment.prototype.setIsHoverable = function(hoverable) {
	this.hoverable = !!hoverable;
	return this;
};

Fragment.prototype.isSelectable = function() {
	return !!this.selectable;
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

	Fragment.parseJson = function(instanceOrJson, json, preferredElement) {
		if (!(instanceOrJson instanceof Fragment)) {
			json = instanceOrJson;
			instanceOrJson = null;
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.type === undefined && preferredElement !== undefined) {
			json.type = preferredElement;
		}
		if (fragments.hasOwnProperty(json.type)) {
			return fragments[json.type].parseJson.call(this, instanceOrJson || new fragments[json.type](), json, preferredElement);
		}
		log("ModdingTools: Unresolved fragment " + json.type + ", please make sure that \"type\" property is used anywhere");
		return instanceOrJson;
	};

	return function(id, fragment) {
		if (fragments.hasOwnProperty(id)) {
			log("ModdingTools: Fragment json " + id + " is already occupied");
			return false;
		}
		if (typeof fragment != "function" || !(fragment.prototype instanceof Fragment)) {
			Logger.Log("ModdingTools: Passed fragment " + fragment + " for json " + id + " must contain prototype of Fragment", "WARNING");
			return false;
		}
		if (typeof fragment.parseJson != "function") {
			Logger.Log("ModdingTools: Nothing to call by parseJson, please consider that your fragment contains required json property", "WARNING");
			return false;
		}
		fragments[id] = fragment;
		return true;
	};
})();
