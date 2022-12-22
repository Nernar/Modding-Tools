if (typeof Object.assign != "function") {
	Object.assign = function(target, varArgs) {
		"use strict";
		if (target === null || target === undefined) {
			return target;
		}
		var to = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];
			if (nextSource !== null && nextSource !== undefined) {
				for (var nextKey in nextSource) {
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	};
}
