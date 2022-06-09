const Fragment = function() {
	this.views = {};
	this.selectable = false;
};

Fragment.prototype.getContainer = function() {
	return this.container || null;
};

Fragment.prototype.setContainerView = function(view) {
	this.container = view;
	return this;
};

Fragment.prototype.getViews = function() {
	return this.views || null;
};

Fragment.prototype.findViewByKey = function(key) {
	let views = this.getViews();
	if (views == null) return null;
	return views[key] || null;
};

Fragment.prototype.findViewById = function(id) {
	let container = this.getContainer();
	if (container == null) return null;
	return container.findViewById(id) || null;
};

Fragment.prototype.findViewByTag = function(tag) {
	let container = this.getContainer();
	if (container == null) return null;
	return container.findViewWithTag(tag) || null;
};

Fragment.prototype.findView = function(stroke) {
	return this.findViewByKey(stroke) ||
		this.findViewById(stroke) ||
		this.findViewByTag(stroke);
};

Fragment.prototype.isSelectable = function() {
	return !!this.selectable;
};

Fragment.prototype.setIsSelectable = function(selectable) {
	this.selectable = !!selectable;
	return this;
};
