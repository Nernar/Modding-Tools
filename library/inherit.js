LIBRARY({
	name: "inherit",
	version: 1,
	shared: true,
	api: "CoreEngine"
});

if (typeof Object.assign != "function") {
	Object.assign = function(target, varArgs) {
		"use strict";
		if (target == null) {
			throw new TypeError("Cannot convert undefined or null to object");
		}
		let to = Object(target);
		for (let index = 1; index < arguments.length; index++) {
			let nextSource = arguments[index];
			if (nextSource != null) {
				for (let nextKey in nextSource) {
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	};
}

function __expand__(to, from, references) {
	if ((references || (references = [])).indexOf(from) != -1) {
		return;
	}
	(references = references.slice()).push(from);
	for (let key in from) {
		if (to[key] !== undefined || Object.prototype.hasOwnProperty.call(from, key)) {
			if (from[key] === undefined) {
				delete to[key];
				continue;
			}
			if (from[key] === null || to[key] === null || typeof from[key] !== "object" || typeof to[key] !== "object" || Array.isArray(from[key]) || Array.isArray(to[key])) {
				to[key] = from[key];
				continue;
			}
			to[key] = Object.assign({}, to[key]);
			__expand__(to[key], from[key], references);
		}
	}
}

function __inherit__(target, base, mixins) {
	if (typeof base != "function" && base !== null) {
		throw new TypeError("Class extends value " + String(base) + " is not a constructor or null");
	}
	(Object.setPrototypeOf || function(t, p) { t.__proto__ = p; })(target, base);
	if (base === null) {
		target.prototype = Object.create(base);
	} else {
		let __ = function() {
			this.constructor = target;
		};
		__.prototype = base.prototype;
		target.prototype = new __();
	}
	__expand__(target, base);
	for (let offset = 2; offset < arguments.length; offset++) {
		__expand__(target.prototype, arguments[offset]);
	}
}

EXPORT("__inherit__", __inherit__);
