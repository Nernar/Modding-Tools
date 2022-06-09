const BaseFragment = function() {
	Fragment.apply(this, arguments);
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
	let container = this.getContainerRoot();
	if (container == null) return this;
	if (!(src instanceof Drawable)) {
		src = Drawable.parseJson.call(this, src);
	}
	src.attachAsBackground(container);
	this.background = src;
	return this;
};

BaseFragment.prototype.setOnClickListener = function(action) {
	let container = this.getContainer();
	if (container === null) return this;
	let instance = this;
	container.setOnClickListener(function() {
		tryout(function() {
			action && action(instance);
		});
	});
	return this;
};

BaseFragment.prototype.setOnHoldListener = function(action) {
	let container = this.getContainer();
	if (container === null) return this;
	let instance = this;
	container.setOnLongClickListener(function() {
		return tryout(function() {
			return action && action(instance);
		}) || false;
	});
	return this;
};

Fragment.prototype.isSelectable = function() {
	return !!this.selectable;
};

Fragment.prototype.setIsSelectable = function(selectable) {
	this.selectable = !!selectable;
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
