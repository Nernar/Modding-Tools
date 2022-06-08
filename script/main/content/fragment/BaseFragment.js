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
