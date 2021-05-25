const Fragment = function() {
	this.views = new Object();
};

Fragment.prototype.getContainer = function() {
	return this.container || null;
};

Fragment.prototype.setContainerView = function(view) {
	let already = this.getContainer();
	if (already != null) throw Error("Fragment already has container");
	this.container = view;
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
	let find = function(parent) {
		for (let i = 0; i < parent.getChildCount(); i++) {
			let child = parent.getChildAt(i);
			if (child == null) continue;
			if (child.getTag() == tag) return child;
			if (child.getChildCount) {
				let recursive = find(child);
				if (recursive) return recursive;
			}
		}
		return null;
	};
	return find(container);
};

Fragment.prototype.findView = function(stroke) {
	return this.findViewByKey(stroke) ||
		this.findViewById(stroke) ||
		this.findViewByTag(stroke);
};

const Frame = new Function();

Frame.prototype.getFragment = function() {
	return this.fragment || null;
};

Frame.prototype.setFragment = function(fragment) {
	let already = this.getFragment();
	if (already != null) throw Error("Frame already has fragment");
	this.fragment = fragment;
};

Frame.prototype.getContainer = function() {
	let fragment = this.getFragment();
	if (fragment == null) return null;
	return fragment.getContainer();
};
