const StringifyAdapter = function(callback) {
	if (callback !== undefined) {
		this.setCallback(callback);
	}
	this.indexated = new Array();
};

StringifyAdapter.prototype.getIndexated = function() {
	return this.indexated || null;
};

StringifyAdapter.prototype.stringifyStroke = function(stroke) {
	stroke = String(stroke).replace(/\\/g, "\\\\");
	stroke = String(stroke).replace(/\t/g, "\\\\t");
	stroke = String(stroke).replace(/\n/g, "\\\\n");
	if (stroke.length == 0) return "new String()";
	return "\"" + stroke.trim() + "\"";
};

StringifyAdapter.prototype.stringifyNumber = function(number) {
	return String(preround(Number(number)));
};

StringifyAdapter.prototype.stringifyRepresent = function(simple) {
	if (simple === undefined) return this.isValidJson() ? "undefined" : new String();
	if (simple === null) return this.isValidJson() ? "null" : new String();
	if (simple === false) return "false";
	if (simple === true) return "true";
	if (simple == null) return "null";
	if (simple == false) return "false";
	if (simple == true) return "true";
};

StringifyAdapter.prototype.resolveType = function(value) {
	return tryoutSafety.call(this, function() {
		if (value instanceof java.lang.String) {
			return "string";
		}
		if (value instanceof java.lang.Boolean) {
			return "boolean";
		}
		if (value instanceof java.lang.Integer || value instanceof java.lang.Float || value instanceof java.lang.Double) {
			return "number";
		}
		if (value instanceof java.lang.Object) {
			return "object";
		}
		if (value instanceof java.lang.Class) {
			return "class";
		}
		if (value instanceof Function) {
			if (value === null) {
				return "null";
			}
			if (value.prototype !== undefined) {
				return "prototype";
			}
			return "function";
		}
		if (Array.isArray(value)) {
			return "array";
		}
		return typeof value;
	}, function(e) {
		this.callback.onThrow(StringifyAdapter.Error.INVALID_TYPE, e, value);
	}, "unknown");
};

StringifyAdapter.prototype.resolveArguments = function(value) {
	return tryoutSafety.call(this, function() {
		let represent = String(value);
		if (represent == "null") return new String();
		represent = represent.split("(", 1)[1];
		represent = represent.split(")", 1)[0];
		let strokes = represent.split(", ");
		for (let i = 0; i < strokes.length; i++) {
			strokes[i] = this.stringifyStroke(strokes[i]);
		}
		return strokes.join(", ");
	}, function(e) {
		this.callback.onThrow(StringifyAdapter.Error.INVALID_ARGUMENTS, e, value);
	}, new String());
};

StringifyAdapter.prototype.indexateRecursive = function(value, hieracly, elements, types) {
	let indexated = this.getIndexated();
	return tryoutSafety.call(this, function() {
		if (hieracly === undefined) {
			hieracly = new Array();
		}
		if (hieracly.lastIndexOf(value) != -1) {
			return;
		}
		if (elements === undefined) {
			elements = new Array();
		}
		if (types === undefined) {
			types = new Array();
		}
		let type = this.resolveType(value);
		switch (type) {
			case "object":
			case "array":
				let path = hieracly.slice();
				path.push(value);
				let instances = types.slice();
				instances.push(type);
				let iterated = 0;
				for (let element in value) {
					let names = elements.slice();
					names.push(element);
					this.indexateRecursive(value[element], path, names, instances);
					iterated++;
				}
				if (iterated > 0) {
					break;
				}
			default:
				let entry = new StringifyAdapter.Entry(value, type, elements, types);
				this.callback.onIndexate(entry, indexated) !== false && indexated.push(entry);
		}
	}, function(e) {
		this.callback.onThrow(StringifyAdapter.Error.INDEXATE_FAILURE, e, value, hieracly, elements, types);
	}, indexated);
};

StringifyAdapter.prototype.stringifyValue = function(value, type) {
	return tryoutSafety.call(this, function() {
		if (type === undefined) {
			type = this.resolveType(value);
		}
		switch (type) {
			case "null":
			case "boolean":
				return this.stringifyRepresent(value);
			case "string":
				return this.stringifyStroke(value);
			case "number":
				return this.stringifyNumber(value);
			case "object":
				return this.isValidJson() ? "{}" : "new Object()";
			case "array":
				return this.isValidJson() ? "[]" : "new Array()";
			case "class":
				return "new " + value.getClass().getName() + "()";
			case "prototype":
			case "function":
				return "new Function(" + this.resolveArguments(value) + ")";
		}
	}, function(e) {
		this.callback.onThrow(StringifyAdapter.Error.STRINGIFY_FAILURE, e, value, type);
	}, new String());
};

StringifyAdapter.prototype.stringifyRecursive = function() {
	let indexated = this.getIndexated();
	return tryoutSafety.call(this, function() {
		for (let i = 0; i < indexated.length; i++) {
			let entry = indexated[i];
			entry.stringifyAsAdapter(this);
			this.callback.onStringify(entry, i, indexated);
		}
	}, function(e) {
		this.callback.onThrow(StringifyAdapter.Error.ENTRIES_NOT_ITERATEABLE, e);
	}, indexated);
};

StringifyAdapter.prototype.restoreHieracly = function(entry) {
	return tryoutSafety.call(this, function() {
		let types = entry.getTypes();
		if (types.length == 0) return entry.asString();
		let hieracly, current;
		types = types.slice().reverse();
		let elements = entry.getElements();
		elements = elements.slice().reverse();
		let type = types.pop();
		type = type == "array" ? new Array() : new Object();
		current = hieracly = type;
		do {
			if (types.length > 0) {
				type = types.pop();
				type = type == "array" ? new Array() : new Object();
			} else type = entry.asString();
			let name = elements.pop();
			current[name] = type;
			current = current[name];
		} while (elements.length > 0);
		return hieracly;
	}, function(e) {
		this.callback.onThrow(StringifyAdapter.Error.RESTORE_HIERACLY_FAILED, e);
	}, null);
};

StringifyAdapter.prototype.rebuildRecursive = function() {
	let indexated = this.getIndexated();
	return tryoutSafety.call(this, function() {
		let represent;
		for (let i = 0; i < indexated.length; i++) {
			let entry = indexated[i],
				hieracly = this.restoreHieracly(entry);
			if (represent === undefined) represent = hieracly;
			else represent = merge(represent, hieracly);
			this.callback.onRebuild(entry, i, hieracly, represent);
		}
		return represent;
	}, function(e) {
		this.callback.onThrow(StringifyAdapter.Error.REBUILD_FAILED, e);
	}, null);
};

StringifyAdapter.prototype.getTabbedSpace = function() {
	return this.tab !== undefined ? this.tab : "\t";
};

StringifyAdapter.prototype.setTabbedSpace = function(space) {
	this.tab = String(space);
};

StringifyAdapter.prototype.isValidJson = function() {
	return this.valid !== undefined ? this.valid : false;
};

StringifyAdapter.prototype.setIsValidJson = function(valid) {
	this.valid = Boolean(valid);
};

StringifyAdapter.prototype.isFormattingEnabled = function() {
	return this.formatting !== undefined ? this.formatting : false;
};

StringifyAdapter.prototype.setFormattingEnabled = function(enabled) {
	this.formatting = Boolean(enabled);
};

StringifyAdapter.prototype.getSpaceForLevel = function(level) {
	let tabbed = this.getTabbedSpace(),
		space = new String();
	for (let i = 0; i < level; i++) {
		space = space.concat(tabbed);
	}
	return space;
};

StringifyAdapter.prototype.parsePropertyName = function(name) {
	return tryoutSafety.call(this, function() {
		let formatting = this.isFormattingEnabled(),
			valid = this.isValidJson();
		if (valid) name = this.stringifyStroke(name);
		return formatting ? name + ": " : name + ":";
	}, function(e) {
		// TODO
	}, new String());
};

StringifyAdapter.prototype.parseProperty = function(name, value, level) {
	return tryoutSafety.call(this, function() {
		let property = this.parsePropertyName(name);
		if (typeof value == "string") {
			if (this.isFormattingEnabled()) {
				let space = this.getSpaceForLevel(level);
				return space + property + value;
			}
			return property + value;
		} else if (Array.isArray(value)) {
			value = this.parseArray(value, level);
			if (this.isFormattingEnabled()) {
				let space = this.getSpaceForLevel(level);
				return space + property + value;
			}
			return property + value;
		} else if (typeof value == "object") {
			value = this.parseObject(value, level);
			if (this.isFormattingEnabled()) {
				let space = this.getSpaceForLevel(level);
				return space + property + value;
			}
			return property + value;
		}
	}, function(e) {
		// TODO
	}, new String());
};

StringifyAdapter.prototype.parseArray = function(value, level) {
	return tryoutSafety.call(this, function() {
		
	}, function(e) {
		// TODO
	}, new String());
};

StringifyAdapter.prototype.parseObject = function(value, level) {
	return tryoutSafety.call(this, function() {
		
	}, function(e) {
		// TODO
	}, new String());
};

StringifyAdapter.prototype.stringifyHieracly = function(hieracly) {
	// TODO
};

StringifyAdapter.process = function(value, callback) {
	let adapter = new StringifyAdapter(callback);
	adapter.indexateRecursive(value);
	adapter.stringifyRecursive();
	let hieracly = adapter.rebuildRecursive();
	return adapter.stringifyHieracly(hieracly);
};

StringifyAdapter.Entry = function(value, type, elements, types) {
	this.value = value;
	this.type = type;
	this.elements = elements;
	this.types = types;
};

StringifyAdapter.Entry.prototype.getValue = function() {
	return this.value;
};

StringifyAdapter.Entry.prototype.getType = function() {
	return this.type;
};

StringifyAdapter.Entry.prototype.getElements = function() {
	return this.elements;
};

StringifyAdapter.Entry.prototype.getTypes = function() {
	return this.types;
};

StringifyAdapter.Entry.prototype.stringify = function() {
	this.stringifyAsAdapter(StringifyAdapter.prototype);
};

StringifyAdapter.Entry.prototype.stringifyAsAdapter = function(adapter) {
	this.stroke = adapter.stringifyValue(this.getValue(), this.getType());
};

StringifyAdapter.Entry.prototype.asString = function() {
	return String(this.stroke);
};

StringifyAdapter.Error = new Object();
StringifyAdapter.Error.INVALID_TYPE = 0;
StringifyAdapter.Error.INVALID_ARGUMENTS = 1;
StringifyAdapter.Error.INDEXATE_FAILURE = 2;
StringifyAdapter.Error.STRINGIFY_FAILURE = 3;
StringifyAdapter.Error.ENTRIES_NOT_ITERATEABLE = 4;
StringifyAdapter.Error.RESTORE_HIERACLY_FAILED = 5;
StringifyAdapter.Error.REBUILD_FAILED = 6;

StringifyAdapter.Callback = function(object) {
	if (object !== null && typeof object == "object") {
		for (let element in object) {
			this[element] = object[element];
		}
	}
};

StringifyAdapter.Callback.prototype.onIndexate = new Function();
StringifyAdapter.Callback.prototype.onStringify = new Function();
StringifyAdapter.Callback.prototype.onRebuild = new Function();
StringifyAdapter.Callback.prototype.onThrow = new Function();

StringifyAdapter.prototype.callback = new StringifyAdapter.Callback();

StringifyAdapter.prototype.setCallback = function(callback) {
	if (callback instanceof StringifyAdapter.Callback) {
		this.callback = callback;
	} else this.callback = new StringifyAdapter.Callback(callback);
};
