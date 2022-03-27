const requireClass = function(pointer) {
	return tryout(function() {
		return findCorePackage()[pointer];
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
		return requireMethod.IMPL;
	});
};

requireMethod.IMPL = function() {
	return new Function();
};

const tryoutSafety = function(action, report, basic) {
	return tryout.call(this, action, function(e) {
		REVISION.startsWith("develop") && retraceOrReport(e);
		if (typeof report == "function") return report.apply(this, arguments);
	}, report !== undefined && typeof report != "function" ? report : basic);
};

let FileTools = findCorePackage().utils.FileTools;
let LevelInfo = findCorePackage().api.runtime.LevelInfo;
