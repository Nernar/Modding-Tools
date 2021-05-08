function requireMethod(pointer, field, denyConversion) {
	try {
		if (denyConversion == undefined) {
			denyConversion = false;
		}
		return requireMethodFromNativeAPI(pointer, field, denyConversion);
	} catch (e) {
		Logger.Log("Can't find method " + field, "Dev-Editor");
		return requireMethod.IMPL;
	}
}

requireMethod.IMPL = function() {
	return null;
};

function injectMethod(scope, pointer, field, denyConversion) {
	scope[field] = requireMethod(pointer, field, denyConversion);
}
