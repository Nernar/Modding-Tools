function BaseFragment() {
	Fragment.apply(this);
	this.visible = true;
	this.marks = [];
	if (this.resetContainer != null && isAndroid()) {
		this.resetContainer();
		// let container = this.getContainer();
		// if (container != null && container instanceof android.view.ViewGroup) {
			// let view = new android.widget.TextView(getContext());
			// view.setTextSize(toComplexUnitDp(6));
			// view.setTextColor($.Color.LTGRAY);
			// view.setTypeface(typeface);
			// view.setText(":: " + this.TYPE + " ::");
			// container.addView(view);
		// }
	}
	if (arguments.length > 0) {
		this.mark.apply(this, arguments);
	} else {
		this.remark();
	}
};

BaseFragment.prototype = new Fragment;
BaseFragment.prototype.TYPE = "BaseFragment";

BaseFragment.prototype.getContainerRoot = function() {
	return this.getContainer();
};

BaseFragment.prototype.setContainerView = function(view) {
	Fragment.prototype.setContainerView.apply(this, arguments);
	isAndroid() && this.resetListeners();
	return this;
};

BaseFragment.prototype.resetListeners = function() {
	let container = this.getContainer();
	if (container == null) {
		return;
	}
	container.setOnClickListener((function() {
		try {
			this.click && this.click();
		} catch (e) {
			reportError(e);
		}
	}).bind(this));
	container.setOnLongClickListener((function() {
		try {
			if (this.hold && this.hold()) {
				return true;
			}
		} catch (e) {
			reportError(e);
		}
		return false;
	}).bind(this));
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
		return this.onClick ? this.onClick() : false;
	}
	if (keys.indexOf(9) != -1) {
		return (this.onHold && this.onHold()) == true;
	}
	return false;
};

BaseFragment.prototype.click = function() {
	this.onClick && this.onClick();
};

BaseFragment.prototype.hold = function() {
	return this.onHold && this.onHold();
};

BaseFragment.prototype.setOnClickListener = function(listener) {
	if (listener != null) {
		this.onClick = listener.bind(this);
	} else {
		delete this.onClick;
	}
	return this;
};

BaseFragment.prototype.setOnHoldListener = function(listener) {
	if (listener != null) {
		this.onHold = listener.bind(this);
	} else {
		delete this.onHold;
	}
	return this;
};

BaseFragment.prototype.getMarks = function() {
	return this.marks || null;
};

BaseFragment.prototype.hasMark = function(mark) {
	return this.marks.indexOf(mark) != -1;
};

BaseFragment.prototype.mark = function(marks) {
	let length = this.marks.length;
	if (Array.isArray(marks) || arguments.length > 1) {
		if (arguments.length > 1) {
			marks = arguments;
		}
		for (let offset = 0; offset < marks.length; offset++) {
			if (this.marks.indexOf(marks[offset]) == -1) {
				this.marks.push(marks[offset]);
			}
		}
	} else {
		if (this.marks.indexOf(marks) == -1) {
			this.marks.push(marks);
		}
	}
	if (length != this.marks.length) {
		this.remark();
	}
	return this;
};

BaseFragment.prototype.unmark = function(marks) {
	let length = this.marks.length;
	if (Array.isArray(marks) || arguments.length > 1) {
		if (arguments.length > 1) {
			marks = arguments;
		}
		for (let offset = 0; offset < marks.length; offset++) {
			let index = this.marks.indexOf(marks[offset]);
			index == -1 || this.marks.splice(index, 1);
		}
	} else {
		let index = this.marks.indexOf(marks);
		index == -1 || this.marks.splice(index, 1);
	}
	if (length != this.marks.length) {
		this.remark();
	}
	return this;
};

BaseFragment.prototype.remark = function() {
	this.onRemark && this.onRemark();
};

BaseFragment.prototype.setOnRemarkListener = function(listener) {
	if (listener != null) {
		this.onRemark = listener.bind(this);
	} else {
		delete this.onRemark;
	}
	return this;
};

BaseFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof BaseFragment)) {
		json = instanceOrJson;
		instanceOrJson = new BaseFragment();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json == null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("selectable")) {
		instanceOrJson.setIsSelectable(calloutOrParse(json, json.selectable, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("hoverable")) {
		instanceOrJson.setIsHoverable(calloutOrParse(json, json.hoverable, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("mark") || json.hasOwnProperty("marks")) {
		instanceOrJson.mark(calloutOrParse(json, json.mark || json.marks, [this, instanceOrJson]));
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
