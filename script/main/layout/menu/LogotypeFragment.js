/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */
function LogotypeFragment() {
	ImageFragment.apply(this, arguments);
	if (isAndroid()) {
		this.resetContainer();
	}
};

LogotypeFragment.prototype = new ImageFragment;

LogotypeFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);

	let layout = new android.widget.LinearLayout(getContext());
	layout.setGravity($.Gravity.CENTER);
	container.addView(layout);

	let logotype = new android.widget.ImageView(getContext());
	logotype.setTag("logotype");
	let params = new android.widget.LinearLayout.LayoutParams
		(toComplexUnitDip(208), toComplexUnitDip(209));
	layout.addView(logotype, params);
};

LogotypeFragment.prototype.getImageView = function() {
	return this.findViewByTag("logotype");
};

LogotypeFragment.prototype.setLevel = function(level) {
	let logotype = this.getImageView();
	if (logotype == null) return this;
	logotype.setImageLevel(level);
	return this;
};
