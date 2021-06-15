const requireMethod = function(pointer, field, denyConversion) {
	return tryout(function() {
		if (denyConversion == undefined) {
			denyConversion = false;
		}
		return requireMethodFromNativeAPI(pointer, field, denyConversion);
	}, function(e) {
		Logger.Log("Failed to find method " + field, "DEV-EDITOR");
	}, requireMethod.IMPL);
};

requireMethod.IMPL = function() {
	return null;
};

const injectMethod = function(scope, pointer, field, denyConversion) {
	scope[field] = requireMethod(pointer, field, denyConversion);
};

const tryoutSafety = function(action, report, basic) {
	return tryout.call(this, action, function(e) {
		__code__.startsWith("develop") && reportError(e);
		if (typeof report == "function") return report.call(this, e);
	}, report !== undefined && typeof report != "function" ? report : basic);
};
