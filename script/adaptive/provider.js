PROJECT_TOOL.controlDescriptor.collapsedHold = function(tool, control) {
	RuntimeCodeEvaluate.showSpecifiedDialog();
	return true;
};

const attachEvalButton = function() {
	log("TODO: attachEvalButton");
};

SHARE("attachEvalButton", attachEvalButton);

(function() {
	let typeofSafety = function(who) {
		try {
			if (who instanceof java.lang.Object) {
				return "class";
			}
			return typeof who;
		} catch (e) {
			return "unknown";
		}
	};
	
	const evaluateScope = function(where, serialized) {
		let noActualTitle = false;
		if (serialized === undefined || serialized === null) {
			serialized = translate(NAME) + " " + translate(VERSION);
			noActualTitle = true;
		}
		if (where === undefined) {
			where = this;
		}
		if (where === null) {
			confirm(serialized, "" + where);
		}
		switch (typeofSafety(where)) {
			case "object":
				break;
			case "function":
				try {
					confirm(serialized, "" + where.toSource(), function() {
						if (where.prototype) {
							evaluateScope(where.prototype, noActualTitle ?
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
				confirm(serialized, "" + where);
				return;
			case "string":
				confirm(serialized, "\"" + where + "\"");
				return;
			default:
				try {
					createDump(getClass(where).__javaObject__);
				} catch (e) {
					try {
						confirm(serialized, where + "\n" + getClass(where));
					} catch (e) {
						confirm(serialized, "" + e);
					}
				}
				return;
		}
		let who = [];
		let self = [];
		for (let element in where) {
			who.push(element + ": " + typeofSafety(where[element]));
			self.push(element);
		}
		if (who.length == 0) {
			return;
		}
		select(serialized, who, function(index, name) {
			evaluateScope(where[self[index]], noActualTitle ?
				"" + self[index] : serialized + "." + self[index]);
		});
	};
	
	SHARE("evaluateScope", evaluateScope);
})();
