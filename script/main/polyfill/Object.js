if (typeof Object.assign != "function") {
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) {
			"use strict";
			if (target === null || target === undefined) {
				MCSystem.throwException("Can't convert undefined or null to object");
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
