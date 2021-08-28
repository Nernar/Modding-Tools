const requireClass = function(pointer) {
	return tryout(function() {
		return eval("findCorePackage()." + pointer);
	}, null);
};

const requireMethod = function(pointer, field, denyConversion) {
	return tryout(function() {
		if (denyConversion == undefined) {
			denyConversion = false;
		}
		if (!denyConversion) {
			pointer = requireClass(pointer);
		}
		return pointer[field];
	}, function(e) {
		Logger.Log("Failed to find method " + field, "DEV-EDITOR");
	}) || requireMethod.IMPL;
};

requireMethod.IMPL = function() {
	return null;
};

const injectMethod = function(scope, pointer, field, denyConversion) {
	let method = requireMethod(pointer, field, denyConversion);
	Object.defineProperty(scope, field, {
		get: function() {
			if (REVISION.startsWith("develop")) {
				Logger.Log("Calling method " + field, "DEV-EDITOR");
			}
			return method;
		},
		enumerable: true,
		configurable: false
	});
};

const tryoutSafety = function(action, report, basic) {
	return tryout.call(this, action, function(e) {
		REVISION.startsWith("develop") && retraceOrReport(e);
		if (typeof report == "function") return report.apply(this, arguments);
	}, report !== undefined && typeof report != "function" ? report : basic);
};
