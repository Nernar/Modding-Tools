(function(self) {
	let action;
	ControlFragment.CollapsedButton.prototype.resetContainer = function() {
		self.apply(this, arguments);
		let action;
		this.setOnHoldListener(function(fragment) {
			if (typeof action == "function") {
				if (action.apply(this, arguments) == true) {
					return true;
				}
			}
			RuntimeCodeEvaluate.showSpecifiedDialog();
			return true;
		});
		this.setOnHoldListener = function(what) {
			action = what;
		};
	};
})(ControlFragment.CollapsedButton.prototype.resetContainer);

SHARE("attachEvalButton", function() {
	log("TODO: attachEvalButton");
});

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
		    log("Dev Editor: toStringSafety: " + e);
		}
		return "undefined";
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
		let type = typeofSafety(where);
		switch (type) {
			case "function":
				try {
					confirm(serialized, where != null ? ("" + where).trim() : "function<no source>", function() {
						if (!isEmpty(where.prototype)) {
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
			case "string":
				confirm(serialized, "" + toStringSafety(where, type));
				return;
		}
		try {
			let who = [];
			let self = [];
			if (where instanceof java.util.List) {
			    for (let i = 0; i < where.size(); i++) {
				    let type = typeofSafety(where.get(i));
			    	if (type == "undefined") continue;
				    let stroke = toStringSafety(where.get(i), type);
				    who.push(i + ": " + (stroke != "undefined" ? stroke : type));
				    self.push(i);
			    }
			} else {
			    for (let element in where) {
				    let type = typeofSafety(where[element]);
			    	if (type == "undefined") continue;
				    let stroke = toStringSafety(where[element], type);
				    who.push(element + ": " + (stroke != "undefined" ? stroke : type));
				    self.push(element);
			    }
			}
			if (who.length == 0) {
				MCSystem.throwException("Dev Editor: Target object is empty");
			}
			select(type == "class" ? toStringSafety(where, type) : serialized, who, function(index, name) {
				evaluateScope(where instanceof java.util.List ? where.get(self[index]) : where[self[index]],
				    noActualTitle ? "" + self[index] : serialized + "." + self[index]);
			});
		} catch (e) {
			try {
				confirm(serialized, "" + where);
			} catch (e) {
				confirm(serialized, "" + e);
			}
		}
	};
	
	SHARE("evaluateScope", evaluateScope);
})();
