/**
 * @requires `isAndroid()`
 */
class FrameFragment extends LayoutFragment {
	readonly TYPE: string = "FrameFragment";
	constructor() {
		super();
	}
	override resetContainer() {
		let container = new android.widget.FrameLayout(getContext());
		this.setContainerView(container);
	}
}

namespace FrameFragment {
	export function parseJson(instanceOrJson, json?, preferredFragment?) {
		if (!(instanceOrJson instanceof FrameFragment)) {
			json = instanceOrJson;
			instanceOrJson = new FrameFragment();
		}
		return LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
	}
}

registerFragmentJson("frame", FrameFragment);
