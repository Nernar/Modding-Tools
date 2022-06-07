const FixedFragment = function() {
	FrameFragment.apply(this, arguments);
};

FixedFragment.prototype = new FrameFragment;
FixedFragment.prototype.TYPE = "FixedFragment";

FixedFragment.prototype.resetContainer = function() {
	FrameFragment.prototype.resetContainer.apply(this, arguments);
	let layout = new android.widget.LinearLayout(context);
	new BitmapDrawable("popup").attachAsBackground(layout);
	layout.setOrientation(Interface.Orientate.VERTICAL);
	layout.setTag("containerLayout");
	this.getContainer().addView(layout);
};

FixedFragment.prototype.getContainerLayout = function() {
	return this.findViewByTag("containerLayout");
};
