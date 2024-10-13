/**
 * @requires `isAndroid()`
 * @type
 */
const HorizontalScrollFragment = function() {
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

HorizontalScrollFragment.prototype.scrollToFragment = function(fragmentOrIndex, duration) {
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

HorizontalScrollFragment.prototype.scrollDown = function(duration) {
	return this.scrollTo(this.getContainerLayout().getMeasuredWidth(), null, duration);
};

HorizontalScrollFragment.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof HorizontalScrollFragment)) {
		json = instanceOrJson;
		instanceOrJson = new HorizontalScrollFragment();
	}
	return FrameFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
};

registerFragmentJson("horizontalScroll", HorizontalScrollFragment);
