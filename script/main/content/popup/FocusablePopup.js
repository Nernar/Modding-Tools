const FocusablePopup = function(id) {
	TransitionWindow.apply(this, arguments);
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
	this.setFragment(new FocusableFragment());
	this.fragments = [];
	
	if (id !== undefined) {
		this.setId(id);
	}
};

FocusablePopup.prototype = new TransitionWindow;
FocusablePopup.prototype.TYPE = "FocusablePopup";

FocusablePopup.prototype.mayDismissed = true;

FocusablePopup.prototype.isMayDismissed = function() {
	return this.mayDismissed;
};

FocusablePopup.prototype.setIsMayDismissed = function(enabled) {
	this.mayDismissed = Boolean(enabled);
};

FocusablePopup.prototype.getId = function() {
	return this.id || null;
};

FocusablePopup.prototype.setId = function(id) {
	this.id = "" + id;
};

FocusablePopup.prototype.addElement = function(fragment, params) {
	return this.getFragment().addElementFragment(fragment, params);
};

FocusablePopup.prototype.getElementCount = function() {
	return this.getFragment().getElementCount();
};

FocusablePopup.prototype.getElement = function(index) {
	return this.getFragment().getElementFragment(index);
};

FocusablePopup.prototype.removeElementAt = function(index) {
	return this.getFragment().removeElementAt(index);
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

FocusablePopup.parseJson = function(instanceOrJson, json, preferredElement) {
	if (!(instanceOrJson instanceof FocusablePopup)) {
		json = instanceOrJson;
		instanceOrJson = new FocusablePopup();
	}
	instanceOrJson = TransitionWindow.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	while (instanceOrJson.getElementCount() > 0) {
		instanceOrJson.removeElementAt(0);
	}
	if (json === null || typeof json != "object") {
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
		if (elements !== null && typeof elements == "object") {
			if (!Array.isArray(elements)) elements = [elements];
			for (let i = 0; i < elements.length; i++) {
				let item = calloutOrParse(elements, elements[i], [this, json, instanceOrJson]);
				if (item !== null && typeof item == "object") {
					let fragment = Fragment.parseJson.call(this, item, item, preferredElement);
					if (fragment != null) {
						instanceOrJson.addElement(fragment);
					}
				}
			}
		}
	}
	return instanceOrJson;
};

registerWindowJson("popup", FocusablePopup);
