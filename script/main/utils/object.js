const assign = function(target, source) {
	if (source === null || source === undefined) {
		source = target;
		target = null;
	}
	if (target === null || target === undefined) {
		if (source instanceof Object || source instanceof Function) {
			target = {};
		} else if (source instanceof Array) {
			target = [];
		}
	}
	return Object.assign(target, source);
};

const merge = function(target, source) {
	if (target === null || target === undefined) {
		return source;
	}
	if (source === null || source === undefined) {
		return target;
	}
	if (Array.isArray(source) && Array.isArray(target)) {
		return target.slice().concat(source);
	} else if (typeof source == "object") {
		if (typeof target != "object") {
			target = {};
		}
		for (let item in source) {
			target[item] = merge(target[item], source[item]);
		}
		return target;
	}
	return source;
};

const _clone = function(target, source) {
	if (source === null || source === undefined) {
		return clone(target);
	}
	if (source && (typeof source == "object" || typeof source == "function")) {
		if (Array.isArray(source)) {
			if (!Array.isArray(target)) {
				target = [];
			}
		} else {
			target = {};
		}
		for (let item in source) {
			target[item] = _clone(target[item], source[item]);
		}
		return target;
	}
	return source;
};

const clone = function(source) {
	if (source && (typeof source == "object" || typeof source == "function")) {
		if (Array.isArray(source)) {
			return _clone([], source);
		}
		return _clone({}, source);
	}
	return source;
};

const isEmpty = function(obj) {
	for (let item in obj) {
		return false;
	}
	return true;
};

const calloutOrParse = function(scope, value, args) {
	try {
		if (typeof value == "function") {
			if (args === undefined) {
				args = [];
			} else if (!Array.isArray(args)) {
				args = [args];
			}
			return value.apply(scope, args);
		}
		return value;
	} catch (e) {
		if (REVISION.indexOf("develop") != -1) {
			reportError(e);
		} else {
			log("ModdingTools: calloutOrParse: " + e);
		}
	}
	return null;
};

const parseCallback = function(scope, value, args) {
	try {
		if (args === undefined) {
			args = [];
		} else if (!Array.isArray(args)) {
			args = [args];
		}
		if (typeof value == "function") {
			return function() {
				let argArray = args.slice();
				argArray = argArray.concat(Array.prototype.slice.call(arguments));
				return value.apply(scope, argArray);
			};
		}
	} catch (e) {
		if (REVISION.indexOf("develop") != -1) {
			reportError(e);
		} else {
			log("ModdingTools: parseCallback: " + e);
		}
	}
	return null;
};
