/**
 * @requires `isAndroid()`
 * @type
 */
const FrameFragment = function() {
	LayoutFragment.apply(this, arguments);
};

FrameFragment.prototype = new LayoutFragment;
FrameFragment.prototype.TYPE = "FrameFragment";

FrameFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);
};

FrameFragment.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof FrameFragment)) {
		json = instanceOrJson;
		instanceOrJson = new FrameFragment();
	}
	return LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
};

registerFragmentJson("frame", FrameFragment);
