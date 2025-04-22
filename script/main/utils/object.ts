function assign(target, source) {
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
}

function merge(target, source) {
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
}

function _clone(target, source) {
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
}

function clone<T>(source: T): T {
	if (source && (typeof source == "object" || typeof source == "function")) {
		if (Array.isArray(source)) {
			return _clone([], source);
		}
		return _clone({}, source);
	}
	return source;
}

function sameAs(left, right) {
	if (left != null && typeof left == "object") {
		if (right != null && typeof right == "object") {
			for (let element in left) {
				if (!sameAs(left[element], right[element])) {
					return false;
				}
			}
			for (let element in right) {
				if (!sameAs(left[element], right[element])) {
					return false;
				}
			}
			return true;
		}
		return false;
	}
	return left == right;
}

function isEmpty(obj) {
	for (let item in obj) {
		return false;
	}
	return true;
}

function calloutOrParse<T>(scope: any, value: Nullable<T | ((...args: any) => T)>, args?: any | any[]): Nullable<T> {
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
			log("Modding Tools: calloutOrParse: " + e);
		}
	}
	return null;
}

function parseCallback<T>(scope: any, value: Nullable<((...args: any) => T)>, args?: any): () => T {
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
				return value.apply(scope, argArray) as T;
			};
		}
	} catch (e) {
		if (REVISION.indexOf("develop") != -1) {
			reportError(e);
		} else {
			log("Modding Tools: parseCallback: " + e);
		}
	}
	return null;
}

function stringifyObjectInline(prefix: string, what: any) {
	if (what != null && what.length != null) {
		let array = [];
		for (let offset = 0; offset < what.length; offset++) {
			try {
				array.push(stringifyObject(what[offset], false));
			} catch (e) {
				array.push("/* " + e + " */");
			}
		}
		Logger.Log("Modding Tools: " + prefix + "(" + array.join(", ") + ")", "DEBUG");
	} else {
		try {
			Logger.Log("Modding Tools: " + prefix + "(" + stringifyObject(what, false) + ")", "DEBUG");
		} catch (e) {
			Logger.Log("Modding Tools: " + prefix + "(/* " + e + "*/)", "DEBUG");
		}
	}
}
