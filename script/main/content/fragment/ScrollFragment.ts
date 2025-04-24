/**
 * @requires `isAndroid()`
 */
class ScrollFragment extends FrameFragment {
	readonly TYPE: string = "ScrollFragment";
	constructor() {
		super();
	}
	resetContainer() {
		FrameFragment.prototype.resetContainer.apply(this, arguments);
		let scroll = new android.widget.ScrollView(getContext());
		scroll.setTag("containerScroll");
		this.getContainer().addView(scroll);

		let layout = new android.widget.LinearLayout(getContext());
		layout.setOrientation($.LinearLayout.VERTICAL);
		layout.setTag("containerLayout");
		scroll.addView(layout);
	}
	override getContainerLayout() {
		return this.findViewByTag("containerLayout") as android.widget.LinearLayout;
	}
	getContainerScroll() {
		return this.findViewByTag("containerScroll") as android.widget.ScrollView;
	}
	scrollTo(x?: number, y?: number, duration?: number) {
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
	}
	scrollToFragment(fragmentOrIndex: number | Fragment, duration?: number) {
		if (!(fragmentOrIndex instanceof Fragment)) {
			fragmentOrIndex = this.getFragmentAt(fragmentOrIndex);
		}
		if (fragmentOrIndex == null) {
			Logger.Log("Modding Tools: Cannot scroll to fragment " + fragmentOrIndex + ", it was null!", "WARNING");
			return this;
		}
		let container = fragmentOrIndex.getContainer();
		return this.scrollTo(container.getX(), container.getY(), duration);
	}
	scrollDown(duration?: number) {
		return this.scrollTo(null, this.getContainerLayout().getMeasuredHeight(), duration);
	}
}

namespace ScrollFragment{
	export function parseJson(instanceOrJson, json?, preferredFragment?) {
		if (!(instanceOrJson instanceof ScrollFragment)) {
			json = instanceOrJson;
			instanceOrJson = new ScrollFragment();
		}
		return FrameFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
	}
}

registerFragmentJson("scroll", ScrollFragment);
