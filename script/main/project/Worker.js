/**
 * @type
 */
const Worker = function(what) {
	if (this.data == null || typeof this.data != "object") {
		this.data = {
			type: "unknown"
		};
	}
	if (what !== undefined) {
		this.loadProject(what);
	}
};

Worker.prototype.getProject = function() {
	return this.data;
};

Worker.prototype.loadProject = function(what) {
	Logger.Log("Modding Tools: Loading project...", "INFO");
	Logger.Log("Modding Tools: " + stringifyJson(what), "INFO");
	this.data = what;
};

Worker.prototype.getProperty = function(source, properties, average) {
	if (arguments.length < 2) {
		Logger.Log("Modding Tools: Worker.getProperty requires at least 2 arguments!", "WARNING");
		return;
	}
	if (Array.isArray(properties)) {
		let result = 0, count = 0;
		for (let offset = 0; offset < properties.length; offset++) {
			let value = source[properties[offset]];
			for (let argument = 2; argument < arguments.length - 1; argument++) {
				value = value[arguments[argument]];
			}
			if (arguments[arguments.length - 1]) {
				if (typeof value == "number" && !isNaN(value)) {
					result += value;
					count++;
				}
			} else if (value != null) {
				return value;
			}
		}
		return arguments[arguments.length - 1] ? count > 0 ? result / count : 0 : null;
	}
	let value = source;
	for (let argument = 1; argument < arguments.length - 1; argument++) {
		value = value[arguments[argument]];
	}
	return value != null ? value : null;
};

Worker.prototype.appendProperty = function(source, properties, difference) {
	if (arguments.length < 3) {
		Logger.Log("Modding Tools: Worker.appendProperty requires at least 3 arguments!", "WARNING");
		return;
	}
	if (Array.isArray(properties)) {
		for (let offset = 0; offset < properties.length; offset++) {
			let property = source[properties[offset]];
			for (let argument = 2; argument < arguments.length - 2; argument++) {
				property = property[arguments[argument]];
			}
			property[arguments[arguments.length - 2]] += arguments[arguments.length - 1];
		}
	} else {
		for (let argument = 1; argument < arguments.length - 2; argument++) {
			source = source[arguments[argument]];
		}
		source[arguments[arguments.length - 2]] += arguments[arguments.length - 1];
	}
};

Worker.prototype.setProperty = function(source, properties, value) {
	if (arguments.length < 3) {
		Logger.Log("Modding Tools: Worker.setProperty requires at least 3 arguments!", "WARNING");
		return;
	}
	if (Array.isArray(properties)) {
		for (let offset = 0; offset < properties.length; offset++) {
			let property = source[properties[offset]];
			for (let argument = 2; argument < arguments.length - 2; argument++) {
				property = property[arguments[argument]];
			}
			property[arguments[arguments.length - 2]] = arguments[arguments.length - 1];
		}
	} else {
		for (let argument = 1; argument < arguments.length - 2; argument++) {
			source = source[arguments[argument]];
		}
		source[arguments[arguments.length - 2]] = arguments[arguments.length - 1];
	}
};

Worker.prototype.resetProperty = function(source, properties) {
	if (arguments.length < 3) {
		Logger.Log("Modding Tools: Worker.resetProperty requires at least 3 arguments!", "WARNING");
		return;
	}
	if (Array.isArray(properties)) {
		for (let offset = 0; offset < properties.length; offset++) {
			let property = source[properties[offset]];
			for (let argument = 2; argument < arguments.length - 1; argument++) {
				property = property[arguments[argument]];
			}
			delete property[arguments[arguments.length - 1]];
		}
	} else {
		for (let argument = 1; argument < arguments.length - 1; argument++) {
			source = source[arguments[argument]];
		}
		delete source[arguments[arguments.length - 1]];
	}
};
