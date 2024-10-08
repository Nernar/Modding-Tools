const launchIfSupported = function(who, api, prototype, cancel) {
	if (API_VERSION >= api) {
		if (Math.ceil(API_VERSION) > Math.ceil(api)) {
			Logger.Log("Modding Tools: Api " + api + " downgraded, please check '" + who.getName() + "' for updates", "WARNING");
		}
		try {
			if (prototype !== undefined && prototype !== null) {
				who.RunMod(assign(prototype, API));
				return;
			}
			who.RunMod(API);
			return;
		} catch (e) {
			reportError(e);
		}
	} else {
		Logger.Log("Modding Tools: Extension '" + who.getName() + "' is not supported, minimum version might be " + API_VERSION + ", got " + api, "WARNING");
	}
	try {
		cancel && cancel();
	} catch (e) {
		log("Modding Tools: launchIfSupported: " + e);
	}
};
