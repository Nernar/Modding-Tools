const FocusableFragment = function() {
	FrameFragment.apply(this, arguments);
	this.setBackground("popup");
};

FocusableFragment.prototype = new FrameFragment;
FocusableFragment.prototype.TYPE = "FocusableFragment";

FocusableFragment.prototype.resetContainer = function() {
	FrameFragment.prototype.resetContainer.apply(this, arguments);
	let layout = new android.widget.LinearLayout(context);
	layout.setOrientation(Interface.Orientate.VERTICAL);
	layout.setTag("containerLayout");
	this.getContainer().addView(layout);
};

FocusableFragment.prototype.getContainerRoot = function() {
	return this.findViewByTag("containerLayout");
};

FocusableFragment.prototype.getContainerLayout = function() {
	return this.getContainerRoot();
};
