/**
 * @requires `isAndroid()`
 * @type
 */
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
	layout.setOrientation($.LinearLayout.VERTICAL);
	layout.setTag("containerLayout");
	scroll.addView(layout);
};

ScrollFragment.prototype.getContainerLayout = function() {
	return this.findViewByTag("containerLayout");
};

ScrollFragment.prototype.getContainerScroll = function() {
	return this.findViewByTag("containerScroll");
};

ScrollFragment.prototype.scrollTo = function(x, y, duration) {
	if (isAndroid()) {
		if (duration != null) {
			let actor = new android.transition.ChangeScroll();
			actor.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
			actor.setDuration(duration);
			this.beginDelayedTransition(actor);
		}
		let scroll = this.getContainerScroll();
		x == null && (x = scroll.getScrollX());
		y == null && (y = scroll.getScrollY());
		scroll.scrollTo(x, y);
	}
	return this;
};

ScrollFragment.prototype.scrollToFragment = function(fragmentOrIndex, duration) {
	if (!(fragmentOrIndex instanceof Fragment)) {
		fragmentOrIndex = this.getFragmentAt(fragmentOrIndex);
	}
	if (fragmentOrIndex == null) {
		Logger.Log("Modding Tools: Cannot scroll to fragment " + fragmentOrIndex + ", it was null!", "WARNING");
		return this;
	}
	let container = fragmentOrIndex.getContainer();
	return this.scrollTo(container.getX(), container.getY(), duration);
};

ScrollFragment.prototype.scrollDown = function(duration) {
	return this.scrollTo(null, this.getContainerLayout().getMeasuredHeight(), duration);
};

ScrollFragment.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof ScrollFragment)) {
		json = instanceOrJson;
		instanceOrJson = new ScrollFragment();
	}
	return FrameFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
};

registerFragmentJson("scroll", ScrollFragment);
