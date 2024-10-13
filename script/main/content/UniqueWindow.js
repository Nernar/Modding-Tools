/**
 * EXTREMELLY UNSTABLE
 * In future every window should equals to fragment
 * container from itself, instance rewrites global
 * window with specified container; window is untouched.
 * @todo Do not use constructors to get attached container.
 * @type
 */
const UniqueWindow = function() {
	TransitionWindow.apply(this, arguments);
	if (UniqueHelper.wasTypeAttached(this)) {
		return UniqueHelper.getWindow(this);
	}
	return this;
};

UniqueWindow.prototype = new TransitionWindow;
UniqueWindow.prototype.TYPE = "UniqueWindow";

UniqueWindow.prototype.isAttached = function() {
	return UniqueHelper.isAttached(this);
};

UniqueWindow.prototype.canBeOpened = function() {
	return !this.isOpened();
};

UniqueWindow.prototype.isUpdatable = function() {
	return this.updatable !== undefined ? this.updatable : true;
};

UniqueWindow.prototype.setIsUpdatable = function(enabled) {
	if (enabled !== undefined) {
		this.updatable = !!enabled;
	} else {
		delete this.updatable;
	}
};

UniqueWindow.prototype.attach = function() {
	if (UniqueHelper.prepareWindow(this)) {
		TransitionWindow.prototype.attach.apply(this, arguments);
	}
};

UniqueWindow.prototype.dismiss = function() {
	if (UniqueHelper.deattachWindow(this)) {
		TransitionWindow.prototype.dismiss.apply(this, arguments);
	}
};

UniqueWindow.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof UniqueWindow)) {
		json = instanceOrJson;
		instanceOrJson = new UniqueWindow();
	}
	instanceOrJson = TransitionWindow.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("id")) {
		instanceOrJson.TYPE = calloutOrParse(json, json.id, [this, instanceOrJson]);
	}
	if (json.hasOwnProperty("updatable")) {
		instanceOrJson.setIsUpdatable(calloutOrParse(json, json.updatable, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

registerWindowJson("unique", UniqueWindow);
