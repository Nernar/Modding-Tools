const ScrollFragment = function() {
	FrameFragment.apply(this, arguments);
};

ScrollFragment.prototype = new FrameFragment;
ScrollFragment.prototype.TYPE = "ScrollFragment";

ScrollFragment.prototype.resetContainer = function() {
	FrameFragment.prototype.resetContainer.apply(this, arguments);
	let scroll = new android.widget.ScrollView(getContext());
	scroll.setTag("containerScroll");
	this.getContainer().addView(scroll);
	
	let layout = new android.widget.LinearLayout(getContext());
	layout.setOrientation(Interface.Orientate.VERTICAL);
	layout.setTag("containerLayout");
	scroll.addView(layout);
};

ScrollFragment.prototype.getContainerLayout = function() {
	return this.findViewByTag("containerLayout");
};

ScrollFragment.prototype.getContainerScroll = function() {
	return this.findViewByTag("containerScroll");
};

ScrollFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ScrollFragment)) {
		json = instanceOrJson;
		instanceOrJson = new ScrollFragment();
	}
	return FrameFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("scroll", ScrollFragment);
