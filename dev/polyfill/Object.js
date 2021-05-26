if (typeof Object.assign != "function") {
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) {
			"use strict";
			if (target === null || target === undefined) {
				throw Error("Can't convert undefined or null to object");
			}
			let to = Object(target);
			for (let index = 1; index < arguments.length; index++) {
				let nextSource = arguments[index];
				if (nextSource !== null && nextSource !== undefined) { 
					for (let nextKey in nextSource) {
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

const assign = function(target, source) {
	if (source === null || source === undefined) {
		if (target instanceof Object || target instanceof Function) {
			source = new Object();
		} else if (target instanceof Array) {
			source = new Array();
		}
	}
	if (source instanceof Object || source instanceof Array || source instanceof Function) {
		return Object.assign(source, target);
	}
	return source;
};

const merge = function(target, source) {
	if (target === null || target === undefined) {
		return source;
	}
	if (source === null || source === undefined) {
		return target;
	}
	if (Array.isArray(source) && Array.isArray(target)) {
		return target.concat(source);
	} else if (String(source) != "[object Object]") {
		return String(source);
	} else if (source instanceof Object || source instanceof Function) {
		if (!(target instanceof Object)) {
			target = new Object();
		}
		for (let item in source) {
			let result = merge(target[item], source[item]);
			if (result !== undefined) target[item] = result;
		}
		return target;
	}
	return source;
};

const clone = function(source) {
	if (source instanceof Object || source instanceof Function) {
		return merge(new Object(), source);
	} else if (source instanceof Array) {
		return merge(new Array(), source);
	}
	return source;
};
