const Fragment = function() {
	this.views = new Object();
};

Fragment.prototype.getContainer = function() {
	return this.container || null;
};

Fragment.prototype.setContainerView = function(view) {
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
	return container.findViewWithTag(tag) || null;
};

Fragment.prototype.findView = function(stroke) {
	return this.findViewByKey(stroke) ||
		this.findViewById(stroke) ||
		this.findViewByTag(stroke);
};

const FrameFragment = function() {
	Fragment.apply(this, arguments);
	this.resetContainer();
};

FrameFragment.prototype = new Fragment;

FrameFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(context);
	this.setContainerView(container)
};

FrameFragment.prototype.getBackground = function() {
	return this.background || null;
};

FrameFragment.prototype.setBackground = function(drawable) {
	let container = this.getContainer();
	if (container === null) return this;
	if (!(drawable instanceof Drawable)) {
		drawable = Drawable.parseJson.call(this, drawable);
	}
	drawable.attachAsBackground(container);
	this.background = drawable;
	return this;
};

FrameFragment.prototype.setOnClickListener = function(action) {
	let container = this.getContainer(),
		scope = this;
	if (container === null) return this;
	container.setOnClickListener(function() {
		tryout(function() {
			action && action(scope);
		});
	});
	return this;
};

FrameFragment.prototype.setOnHoldListener = function(action) {
	let container = this.getContainer(),
		scope = this;
	if (container === null) return this;
	container.setOnLongClickListener(function() {
		return tryout(function() {
			return action && action(scope);
		}, false);
	});
	return this;
};

const Frame = new Function();

Frame.prototype.getFragment = function() {
	return this.fragment || null;
};

Frame.prototype.setFragment = function(fragment) {
	let already = this.getFragment();
	if (already != null) MCSystem.throwException("Frame already has fragment");
	this.fragment = fragment;
};

Frame.prototype.getContainer = function() {
	let fragment = this.getFragment();
	if (fragment == null) return null;
	return fragment.getContainer();
};
