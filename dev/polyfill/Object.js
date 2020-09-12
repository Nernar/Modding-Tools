if (typeof Object.assign !== 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target === null || target === undefined) {
				throw new TypeError('Cannot convert undefined or null to object');
			}

			let to = Object(target);

			for (let index = 1; index < arguments.length; index++) {
				let nextSource = arguments[index];

				if (nextSource !== null && nextSource !== undefined) { 
					for (let nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
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

function assign(target, source) {
	if (source == undefined || source == null) {
		source = target;
		if (source instanceof Object) {
			source = new Object();
		} else if (source instanceof Array) {
			source = new Array();
		}
	}
	if (source instanceof Object || source instanceof Array) {
		return Object.assign(target, source);
	}
	return source;
}
