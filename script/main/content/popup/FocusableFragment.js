/**
 * @requires `isAndroid()`
 * @type
 */
const FocusableFragment = function() {
	LayoutFragment.apply(this, arguments);
	this.setBackground("popup");
};

FocusableFragment.prototype = new LayoutFragment;
FocusableFragment.prototype.TYPE = "FocusableFragment";

FocusableFragment.prototype.resetContainer = function() {
	let layout = new android.widget.LinearLayout(getContext());
	layout.setOrientation($.LinearLayout.VERTICAL);
	layout.setTag("containerLayout");
	this.setContainerView(layout);
};

FocusableFragment.prototype.getContainerRoot = function() {
	return this.findViewByTag("containerLayout");
};

FocusableFragment.prototype.getContainerLayout = function() {
	return this.getContainerRoot();
};
