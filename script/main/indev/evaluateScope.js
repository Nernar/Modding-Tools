const typeofSafety = function(who) {
	try {
		if (who instanceof java.lang.Object) {
			return "class";
		}
		return typeof who;
	} catch (e) {
		return "unknown";
	}
};

const toStringSafety = function(who, type) {
	try {
		if (who == null) {
			return "null";
		}
		switch (type) {
			case "number":
			case "boolean":
			case "class":
			case "undefined":
				return "" + who;
			case "string":
				return "\"" + who + "\"";
		}
	} catch (e) {
	    log("Modding Tools: toStringSafety: " + e);
	}
	return "undefined";
};

const evaluateScope = function(scope, serialized) {
	let noActualTitle = false;
	if (serialized === undefined || serialized === null) {
		serialized = translate(NAME) + " " + translate(VERSION);
		noActualTitle = true;
	}
	if (scope === undefined) {
		scope = this;
	}
	if (scope === null) {
		confirm(serialized, "" + scope);
	}
	let type = typeofSafety(scope);
	switch (type) {
		case "function":
			try {
				confirm(serialized, scope != null ? ("" + scope).trim() : "function<no source>", function() {
					if (!isEmpty(scope.prototype)) {
						evaluateScope(scope.prototype, noActualTitle ?
							"prototype" : serialized + ".prototype");
					}
				});
			} catch (e) {
				confirm(serialized, "" + e);
			}
			return;
		case "number":
		case "boolean":
		case "undefined":
		case "string":
			confirm(serialized, "" + toStringSafety(scope, type));
			return;
	}
	try {
		let who = [];
		let indices = [];
		if (scope instanceof java.util.List) {
		    for (let i = 0, l = scope.size(); i < l; i++) {
			    let type = typeofSafety(scope.get(i));
		    	if (type == "undefined") continue;
			    let stroke = toStringSafety(scope.get(i), type);
			    who.push(i + ": " + (stroke != "undefined" ? stroke : type));
			    indices.push(i);
		    }
		} else {
		    for (let element in scope) {
			    let type = typeofSafety(scope[element]);
		    	if (type == "undefined") continue;
			    let stroke = toStringSafety(scope[element], type);
			    who.push(element + ": " + (stroke != "undefined" ? stroke : type));
			    indices.push(element);
		    }
		}
		if (who.length == 0) {
			MCSystem.throwException("Modding Tools: Target object is empty");
		}
		select(type == "class" ? toStringSafety(scope, type) : serialized, who, function(index, name) {
			evaluateScope(
				scope instanceof java.util.List ? scope.get(indices[index]) : scope[indices[index]],
			    noActualTitle ? "" + indices[index] : serialized + "." + indices[index]
			);
		});
	} catch (e) {
		try {
			confirm(serialized, "" + scope);
		} catch (e) {
			confirm(serialized, "" + e);
		}
	}
};
