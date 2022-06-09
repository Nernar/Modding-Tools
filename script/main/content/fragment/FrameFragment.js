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

FrameFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof FrameFragment)) {
		json = instanceOrJson;
		instanceOrJson = new FrameFragment();
	}
	return LayoutFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("frame", FrameFragment);
