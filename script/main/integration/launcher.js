const launchIfSupported = function(who, api, prototype, cancel) {
	if (API_VERSION >= api) {
		if (Math.ceil(API_VERSION) > Math.ceil(api)) {
			Logger.Log("ModdingTools: Api " + api + " downgraded, please check " + who.getName() + " for updates", "WARNING");
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
		Logger.Log("ModdingTools: Unsupported module " + who.getName() + ", minimum version might be " + API_VERSION + ", got " + api, "WARNING");
	}
	try {
		cancel && cancel();
	} catch (e) {
		log("ModdingTools: launchIfSupported: " + e);
	}
};
