function BaseFragment() {
	Fragment.apply(this, arguments);
	this.visible = true;
};

BaseFragment.prototype = new Fragment;
BaseFragment.prototype.TYPE = "BaseFragment";

BaseFragment.prototype.getContainerRoot = function() {
	return this.getContainer();
};

BaseFragment.prototype.getBackground = function() {
	return this.background || null;
};

BaseFragment.prototype.setBackground = function(src) {
	if (isAndroid()) {
		let container = this.getContainerRoot();
		if (container == null) return this;
		if (!(src instanceof Drawable)) {
			src = Drawable.parseJson.call(this, src);
		}
		src.attachAsBackground(container);
	}
	this.background = src;
	return this;
};

BaseFragment.prototype.render = function(hovered) {
	return "";
};

BaseFragment.prototype.draw = function(hovered) {
	if (hovered || this.isVisible()) {
		return this.render.apply(this, arguments);
	}
	return "";
};

BaseFragment.prototype.isVisible = function() {
	return this.visible || false;
};

BaseFragment.prototype.hover = function() {
	return this.isHoverable() && this.isVisible();
};

BaseFragment.prototype.switchVisibility = function() {
	if (isAndroid()) {
		this.getContainer().setVisibility(this.visible ? $.View.GONE : $.View.VISIBLE);
	}
	this.visible = !this.visible;
	return this;
};

BaseFragment.prototype.observe = function(keys) {
	if (keys.indexOf(10) != -1 || keys.indexOf(13) != -1) {
		return this.__click__ ? this.__click__() : false;
	}
	if (keys.indexOf(9) != -1) {
		return (this.__hold__ && this.__hold__()) == true;
	}
	return false;
};

BaseFragment.prototype.setOnClickListener = function(action) {
	let container = this.getContainer();
	if (container === null) return this;
	let instance = this;
	let when = function() {
		try {
			action && action(instance);
		} catch (e) {
			reportError(e);
		}
	};
	if (isAndroid()) {
		container.setOnClickListener(when);
	} else {
		this.__click__ = when;
	}
	return this;
};

BaseFragment.prototype.setOnHoldListener = function(action) {
	let container = this.getContainer();
	if (container === null) return this;
	let instance = this;
	let when = function() {
		try {
			return (action && action(instance)) == true;
		} catch (e) {
			reportError(e);
		}
		return false;
	};
	if (isAndroid()) {
		container.setOnLongClickListener(when);
	} else {
		this.__hold__ = when;
	}
	return this;
};

BaseFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof BaseFragment)) {
		json = instanceOrJson;
		instanceOrJson = new BaseFragment();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("selectable")) {
		instanceOrJson.setIsSelectable(calloutOrParse(json, json.selectable, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("background")) {
		instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("click")) {
		instanceOrJson.setOnClickListener(parseCallback(json, json.click, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("hold")) {
		instanceOrJson.setOnHoldListener(parseCallback(json, json.hold, [this, instanceOrJson]));
	}
	return instanceOrJson;
};
