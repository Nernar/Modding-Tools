/**
 * @requires `isAndroid()`
 */
function FocusableFragment() {
	FrameFragment.apply(this, arguments);
	this.setBackground("popup");
};

FocusableFragment.prototype = new FrameFragment;
FocusableFragment.prototype.TYPE = "FocusableFragment";

FocusableFragment.prototype.resetContainer = function() {
	FrameFragment.prototype.resetContainer.apply(this, arguments);
	let layout = new android.widget.LinearLayout(getContext());
	layout.setOrientation($.LinearLayout.VERTICAL);
	layout.setTag("containerLayout");
	this.getContainer().addView(layout);
};

FocusableFragment.prototype.getContainerRoot = function() {
	return this.findViewByTag("containerLayout");
};

FocusableFragment.prototype.getContainerLayout = function() {
	return this.getContainerRoot();
};
