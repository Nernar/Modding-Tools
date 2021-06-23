const FrameFragment = function() {
	Fragment.call(this);
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
	if (!(drawable instanceof android.graphics.drawable.Drawable)) {
		drawable = ImageFactory.getDrawable(drawable);
	}
	container.setBackgroundDrawable(drawable);
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
