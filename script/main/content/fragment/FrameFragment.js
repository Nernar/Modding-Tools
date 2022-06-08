const FrameFragment = function() {
	LayoutFragment.apply(this, arguments);
	this.resetContainer();
};

FrameFragment.prototype = new LayoutFragment;
FrameFragment.prototype.TYPE = "FrameFragment";

FrameFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(context);
	this.setContainerView(container)
};
