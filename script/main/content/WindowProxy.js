const WindowProxy = function() {
	MCSystem.throwException("Dev Editor: Stub!");
};

const registerWindowJson = (function() {
	let windows = {};
	
	WindowProxy.parseJson = function(instanceOrJson, json, preferredElement) {
		if (!(instanceOrJson instanceof FocusableWindow)) {
			json = instanceOrJson;
			instanceOrJson = null;
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.type === undefined && preferredElement !== undefined) {
			json.type = preferredElement;
		}
		if (windows.hasOwnProperty(json.type)) {
			return windows[json.type].parseJson.call(this, instanceOrJson || new windows[json.type](), json, preferredElement);
		}
		log("Dev Editor: Unresolved window " + json.type + ", please make sure that \"type\" property is used anywhere");
		return instanceOrJson;
	};
	
	return function(id, instance) {
		if (windows.hasOwnProperty(id)) {
			log("Dev Editor: Window json " + id + " is already occupied!");
			return false;
		}
		if (typeof instance != "function" || (instance != FocusableWindow && !(instance.prototype instanceof FocusableWindow))) {
			Logger.Log("Dev Editor: Passed window " + instance + " for json " + id + " must contain prototype of FocusableWindow", "WARNING");
			return false;
		}
		if (typeof instance.parseJson != "function") {
			Logger.Log("Dev Editor: Nothing to call by parseJson, please consider that your window contains required json property", "WARNING");
			return false;
		}
		windows[id] = instance;
		return true;
	};
})();
