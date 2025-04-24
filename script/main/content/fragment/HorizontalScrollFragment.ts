/**
 * @requires `isAndroid()`
 */
class HorizontalScrollFragment extends FrameFragment {
	readonly TYPE: string = "HorizontalScrollFragment";
	constructor() {
		super();
	}
	resetContainer() {
		super.resetContainer();
		let scroll = new android.widget.HorizontalScrollView(getContext());
		scroll.setTag("containerScroll");
		this.getContainer().addView(scroll);

		let layout = new android.widget.LinearLayout(getContext());
		layout.setTag("containerLayout");
		scroll.addView(layout);
	}
	getContainerLayout() {
		return this.findViewByTag("containerLayout") as android.widget.LinearLayout;
	}
	getContainerScroll() {
		return this.findViewByTag("containerScroll") as android.widget.HorizontalScrollView;
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
		return this.scrollTo(this.getContainerLayout().getMeasuredWidth(), null, duration);
	}
}

namespace HorizontalScrollFragment {
	export function parseJson(instanceOrJson, json?, preferredFragment?) {
		if (!(instanceOrJson instanceof HorizontalScrollFragment)) {
			json = instanceOrJson;
			instanceOrJson = new HorizontalScrollFragment();
		}
		return FrameFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
	}
}

registerFragmentJson("horizontalScroll", HorizontalScrollFragment);
