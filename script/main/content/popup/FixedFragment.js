const FixedFragment = function() {
	FrameFragment.apply(this, arguments);
	this.setBackground("popup");
};

FixedFragment.prototype = new FrameFragment;
FixedFragment.prototype.TYPE = "FixedFragment";

FixedFragment.prototype.resetContainer = function() {
	FrameFragment.prototype.resetContainer.apply(this, arguments);
	let layout = new android.widget.LinearLayout(context);
	layout.setOrientation(Interface.Orientate.VERTICAL);
	layout.setTag("containerLayout");
	this.getContainer().addView(layout);
};

FixedFragment.prototype.getContainerRoot = function() {
	return this.findViewByTag("containerLayout");
};

FixedFragment.prototype.getContainerLayout = function() {
	return this.getContainerRoot();
};
