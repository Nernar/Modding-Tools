/**
 * @requires `isAndroid()`
 * @type
 */
const FocusablePopup = function(id) {
	TransitionWindow.apply(this, arguments);
	this.fragments = [];

	if (id !== undefined) {
		this.setId(id);
	}
};

FocusablePopup.prototype = new TransitionWindow;
FocusablePopup.prototype.TYPE = "FocusablePopup";

FocusablePopup.prototype.resetWindow = function() {
	TransitionWindow.prototype.resetWindow.apply(this, arguments);
	this.setFragment(new FocusableFragment());

	let fadeIn = new android.transition.Fade(),
		fadeOut = new android.transition.Fade();
	fadeIn.setInterpolator(new android.view.animation.DecelerateInterpolator());
	fadeIn.setDuration(400);
	this.setEnterTransition(fadeIn);
	fadeOut.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	fadeOut.setDuration(400);
	this.setExitTransition(fadeOut);

	let place = Popups.getAvailablePlace();
	if (place != null) {
		this.setX(place.x);
		this.setY(place.y);
	}
	this.setGravity($.Gravity.LEFT | $.Gravity.TOP);
};

FocusablePopup.prototype.mayDismissed = true;

FocusablePopup.prototype.isMayDismissed = function() {
	return this.mayDismissed;
};

FocusablePopup.prototype.setIsMayDismissed = function(enabled) {
	this.mayDismissed = !!enabled;
};

FocusablePopup.prototype.getId = function() {
	return this.id || null;
};

FocusablePopup.prototype.setId = function(id) {
	this.id = "" + id;
};

FocusablePopup.prototype.addFragment = function(fragment, params) {
	return this.getFragment().addFragment(fragment, params);
};

FocusablePopup.prototype.getFragmentCount = function() {
	return this.getFragment().getFragmentCount();
};

FocusablePopup.prototype.indexOf = function(fragmentOrView) {
	return this.getFragment().indexOf(fragmentOrView);
};

FocusablePopup.prototype.getFragmentAt = function(index) {
	return this.getFragment().getFragmentAt(index);
};

FocusablePopup.prototype.removeFragment = function(indexOrFragment) {
	return this.getFragment().removeFragment(indexOrFragment);
};

FocusablePopup.prototype.showInternal = function() {
	return TransitionWindow.prototype.attach.apply(this, arguments);
};

FocusablePopup.prototype.show = function(id) {
	Popups.open(this, id || this.id || "internal");
};

FocusablePopup.prototype.dismissInternal = function() {
	return TransitionWindow.prototype.dismiss.apply(this, arguments);
};

FocusablePopup.prototype.dismiss = function() {
	if (this.isMayDismissed()) {
		Popups.closeIfOpened(this.id);
	}
};

FocusablePopup.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof FocusablePopup)) {
		json = instanceOrJson;
		instanceOrJson = new FocusablePopup();
	}
	instanceOrJson = TransitionWindow.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	while (instanceOrJson.getFragmentCount() > 0) {
		instanceOrJson.removeFragment(0);
	}
	if (json == null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("id")) {
		instanceOrJson.setId(calloutOrParse(json, json.id, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("mayDismissed")) {
		instanceOrJson.setIsMayDismissed(calloutOrParse(json, json.mayDismissed, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("elements")) {
		let elements = calloutOrParse(json, json.elements, [this, instanceOrJson]);
		if (elements != null && typeof elements == "object") {
			Array.isArray(elements) || (elements = [elements]);
			for (let offset = 0; offset < elements.length; offset++) {
				let item = calloutOrParse(elements, elements[offset], [this, json, instanceOrJson]);
				if (item != null && typeof item == "object") {
					let fragment = Fragment.parseJson.call(this, item, item, preferredFragment);
					if (fragment != null) {
						instanceOrJson.addFragment(fragment);
					}
				}
			}
		}
	}
	return instanceOrJson;
};

registerWindowJson("popup", FocusablePopup);
