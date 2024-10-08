function WindowProxy() {
	MCSystem.throwException("Modding Tools: Stub!");
};

const registerWindowJson = (function() {
	let windows = {};

	WindowProxy.parseJson = function(instanceOrJson, json, preferredFragment) {
		if (!(instanceOrJson instanceof FocusableWindow)) {
			json = instanceOrJson;
			instanceOrJson = null;
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.type === undefined && preferredFragment !== undefined) {
			json.type = preferredFragment;
		}
		if (windows.hasOwnProperty(json.type)) {
			return windows[json.type].parseJson.call(this, instanceOrJson || new windows[json.type](), json, preferredFragment);
		}
		log("Modding Tools: Unresolved window " + json.type + ", please make sure that \"type\" property is used anywhere");
		return instanceOrJson;
	};

	return function(id, instance) {
		if (windows.hasOwnProperty(id)) {
			log("Modding Tools: Window json " + id + " is already occupied!");
			return false;
		}
		if (typeof instance != "function" || (instance != FocusableWindow && !(instance.prototype instanceof FocusableWindow))) {
			Logger.Log("Modding Tools: Passed window " + instance + " for json " + id + " must contain prototype of FocusableWindow", "WARNING");
			return false;
		}
		if (typeof instance.parseJson != "function") {
			Logger.Log("Modding Tools: Nothing to call by parseJson, please consider that your window contains required json property", "WARNING");
			return false;
		}
		windows[id] = instance;
		return true;
	};
})();
