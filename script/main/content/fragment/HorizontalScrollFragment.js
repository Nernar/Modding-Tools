/**
 * @requires `isAndroid()`
 */
function HorizontalScrollFragment() {
	FrameFragment.apply(this, arguments);
};

HorizontalScrollFragment.prototype = new FrameFragment;
HorizontalScrollFragment.prototype.TYPE = "HorizontalScrollFragment";

HorizontalScrollFragment.prototype.resetContainer = function() {
	FrameFragment.prototype.resetContainer.apply(this, arguments);
	let scroll = new android.widget.HorizontalScrollView(getContext());
	scroll.setTag("containerScroll");
	this.getContainer().addView(scroll);

	let layout = new android.widget.LinearLayout(getContext());
	layout.setTag("containerLayout");
	scroll.addView(layout);
};

HorizontalScrollFragment.prototype.getContainerLayout = function() {
	return this.findViewByTag("containerLayout");
};

HorizontalScrollFragment.prototype.getContainerScroll = function() {
	return this.findViewByTag("containerScroll");
};

HorizontalScrollFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof HorizontalScrollFragment)) {
		json = instanceOrJson;
		instanceOrJson = new HorizontalScrollFragment();
	}
	return FrameFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("horizontalScroll", HorizontalScrollFragment);
