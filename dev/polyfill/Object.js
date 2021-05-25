if (typeof Object.assign != "function") {
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) {
			"use strict";
			if (target === null || target === undefined) {
				throw TypeError("Cannot convert undefined or null to object");
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
	if (source === undefined || source === null) {
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
