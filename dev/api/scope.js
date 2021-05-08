function runAtScope(code, scope, name) {
	// Runs code in a separate data stream
	let scriptable = org.mozilla.javascript.ScriptableObject,
        source = name ? __name__ + "$" + name : "<no name>",
        ctx = org.mozilla.javascript.Context.enter();
    ctx.setLanguageVersion(200);
    let standart = ctx.initStandardObjects(null, !1);
    for (let item in scope) {
    	scriptable.putProperty(standart, "" + item, scope[item]);
    }
    scope = new Object();
    try {
       	scope.result = ctx.evaluateString(standart, code, source, 0, null);
    } catch (e) {
    	scope.error = e;
    }
    return scope;
}

function checkScope(hieracly, asObj) {
	if (!__code__.startsWith("develop")) {
		throw new Error("checkScope: illegal access, denied");
	}
	hieracly = Array.isArray(hieracly) ? hieracly : [hieracly];
	let scope = hieracly[hieracly.length - 1], items = new Array(), message = null;
	try {
		if (typeof scope != "object" || scope == null) {
			message = "" + scope;
		} else if (!asObj && scope.length != undefined) {
			message = scope.join(", ");
			asObj = true;
		} else {
			for (let item in scope) {
				items.push("" + item);
			}
			asObj = false;
		}
	} catch (e) {
		try {
			message = "" + scope;
		} catch (e) {
			message = e.message;
		}
		reportError(e);
	}
	let builder = new android.app.AlertDialog.Builder(context);
	builder.setTitle("" + scope).setNegativeButton(translate("Exit"), null);
	if (items && items.length > 0) {
		builder.setItems(items, function(dialog, index) {
			hieracly.push(scope[items[index]]);
			checkScope(hieracly);
		});
	} else if (message) {
		builder.setMessage(message);
	} else {
		builder.setMessage(translate("Nothing"));
	}
	if (hieracly.length > 1) {
		builder.setNeutralButton(translate("Back"), function() {
			hieracly.pop();
			checkScope(hieracly);
		});
	}
	if (asObj) {
		builder.setPositiveButton(translate("As Obj"), function() {
			checkScope(hieracly, asObj);
		});
	}
	builder.create().show();
}
