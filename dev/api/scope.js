function runAtScope(code, scope, name) {
	// Runs code in a separate data stream
	var scriptable = org.mozilla.javascript.ScriptableObject,
        source = name || "<no name>",
        ctx = org.mozilla.javascript.Context.enter();
    ctx.setLanguageVersion(200);
    var standart = ctx.initStandardObjects(null, !1);
    for (item in scope) scriptable.putProperty(standart, new String(item), scope[item]);
    scope = new Object();
    try {
       	scope.result = ctx.evaluateString(standart, code, source, 0, null);
    } catch (e) { scope.error = e; }
    return scope;
}

function checkScope(hieracly) {
	if (!__code__.startsWith("develop")) return;
	hieracly = Array.isArray(hieracly) ? hieracly : [hieracly];
	var scope = hieracly[hieracly.length - 1], items = [], message = null;
	try {
		if (typeof scope != "object" || scope == null) message = "" + scope;
		else if (typeof scope.length != "undefined") message = scope.join(", ");
		else for (var item in scope) items.push("" + item);
	} catch(e) {
		try {
			message = "" + scope;
		} catch(e) {
			message = e.message;
		}
		reportError(e);
	}
	var builder = new android.app.AlertDialog.Builder(context);
	builder.setTitle("" + scope).setNegativeButton(translate("Exit"), null);
	items && builder.setItems(items, function(interface, index) {
		checkScope((hieracly.push(scope[items[index]]), hieracly));
	});
	hieracly.length > 1 && builder.setNeutralButton(translate("Back"), function(interface) {
		checkScope((hieracly.pop(), hieracly));
	});
	message && builder.setMessage(message);
	builder.create().show();
}
