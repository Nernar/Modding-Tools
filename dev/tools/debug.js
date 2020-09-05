var LogWindow = {
	show: function() {
		try {
			var widget = new ListingPopup();
			widget.setTitle("Current log");
			this.hs = new android.widget.HorizontalScrollView(context);
			this.scroll = new android.widget.ScrollView(context);
			this.view = new android.widget.TextView(context);
			this.view.setPadding(Ui.getY(10), 0, Ui.getY(10), 0);
			this.view.setTextSize(Ui.getFontSize(12));
			this.view.setTextColor(Ui.Color.WHITE);
			this.view.setTypeface(typeface);
			this.scroll.addView(this.view);
			this.hs.addView(this.scroll);
			widget.views.layout.addView(this.hs);
			Popups.open(widget, "log");
		} catch(e) {
			reportError(e);
		}
	},
	update: function() {
		if (this.view) {
			var log = java.lang.Class.forName("zhekasmirnov.launcher.api.log.ICLog", true, context.getClass().getClassLoader()),
				result = log.getMethod("getLogFilter").invoke(null).buildFilteredLog(true);
			this.view.setText(android.text.Html.fromHtml(result));
			this.scroll.scrollTo(this.hs.getScrollX(), this.view.getMeasuredHeight());
		}
	}
};

function checkNotLocalized() {
	var source = new java.io.File(__dir__ + "main.js"),
		text = source.exists() ? Files.read(source) : null;
	if (!text) throw "checkNotLocalized: Source is not provided, aborting";
	var splited = text.split("translate("), result = [], already = [], locked = [],
		file = new java.io.File(__dir__ + "dev/api/localize.js"), indexed = [],
		has = Files.read(file), localized = has.split("addTranslation(");
	function hasntAlready(substr) {
		var check = already.indexOf(substr) == -1;
		if (!check && locked.indexOf(substr) == -1)
			locked.push(substr);
		return check;
	}
	// var MAXIMUM_CUSTOM_SYMBOLS = 512;
	// function checkIsCustom(item, isLocalize) {
		// if (!item || item.length > MAXIMUM_CUSTOM_SYMBOLS) return;
		// var substr = toCutedSource(item), pushable = -1, start = false, copy = null;
		// showHint("Cuted source for " + item + " is " + substr);
		// while ((pushable = substr.indexOf("\"")) != -1) {
			// substr = substr.substring(pushable + 1, substr.length);
			// start = !start;
			// if (start) copy = substr;
			// else if (pushable > 0) {
				// var res = copy.substring(0, pushable);
				// if (isLocalize) {
					// if (hasntAlready(res))
						// already.push(res);
				// } else {
					// if (already.indexOf(res) == -1 &&
						// result.indexOf(res) == -1)
							// result.push(res);
					// if (indexed.indexOf(res) == -1)
						// indexed.push(res);
				// }
			// }
		// }
	// }
	if (localized.length > 0) {
		localized.forEach(function(item, index) {
			if (!item.startsWith("\"")) return;
			var substr = item.substring(1, item.length),
				index = substr.indexOf("\"");
			if (index < 0) index = item.indexOf("\",");
			if (index < 0) return;
			var substr = substr.substring(0, index);
			if (hasntAlready(substr))
				already.push(substr);
		});
	}
	if (splited.length > 0) {
		splited.forEach(function(item, index) {
			if (!item.startsWith("\"")) return;
			else if (item.startsWith("\"), result")) return;
			var substr = item.substring(1, item.length),
				index = substr.indexOf("\"");
			if (index < 0) index = item.indexOf("\",");
			if (index < 0) return;
			var substr = substr.substring(0, index);
			if (already.indexOf(substr) == -1 &&
				result.indexOf(substr) == -1)
					result.push(substr);
			if (indexed.indexOf(substr) == -1)
				indexed.push(substr);
		});
	}
	if (result.length > 0) {
		var results = result.map(function(item) {
			return "Translation.addTranslation(\"" + item + "\", {});";
		});
		var preparedAddText = results.join("\n");
		Files.addText(file, "\n" + preparedAddText);
		showHint(translate("Changes will be detected and synced"));
	}
	if (locked.length > 0 || alwaysIndexate) {
		var array = Files.read(file, true), started = false, isDeprecated = false,
			toComment = false, first = new Array(), count = 0, last = null;
		var out = array.map(function(e) {
			if (typeof e != "string") e = "" + e;
			var comment = toComment, deprecation = isDeprecated;
			if (started && (e.endsWith(");") || e.endsWith(" // DEPRECATED"))) {
				started = toComment = isDeprecated = false;
				if (e.endsWith(" // DEPRECATED")) (count--, comment = false);
			}
			if (comment && !toComment) return e + (deprecation ? " // DEPRECATED" : " */");
			else if (toComment) return e;
			else if (indexed.indexOf(last) != -1 && e.endsWith(" // DEPRECATED"))
				return e.replace(" // DEPRECATED", "");
			if (e.startsWith("Translation.addTranslation")) {
				var index = e.indexOf("\"");
				if (index < 0) return e;
				var substr = e.substring(index + 1, e.length),
					place = substr.indexOf("\"");
				if (place < 0) return e;
				var resulted = substr.substring(0, place);
				if (indexed.indexOf(resulted) == -1 && first.indexOf(resulted) == -1) {
					started = toComment = true;
					first.push(resulted);
					(count++, isDeprecated = true);
					if (e.endsWith(");") || e.endsWith(" // DEPRECATED")) started = toComment = isDeprecated = false;
					if (!e.endsWith(" // DEPRECATED")) return e + (e.endsWith(");") ? " // DEPRECATED" : "");
				} else if (locked.indexOf(resulted) != -1) {
					if (first.indexOf(resulted) != -1) {
						started = toComment = true;
						(count++, last = resulted);
						if (e.endsWith(");")) started = toComment = false;
						return "/* " + e + ((e.endsWith(");") || e.endsWith(" // DEPRECATED")) ? " */" : "");
					} else (started = true, first.push(resulted));
					if ((e.endsWith(");") || e.endsWith(" // DEPRECATED"))) started = false;
				}
				if (indexed.indexOf(last) != -1 && e.endsWith(" // DEPRECATED"))
					return e.replace(" // DEPRECATED", "");
			}
			return e;
		});
		if (count > 0) {
			Files.write(file, out.join("\n"));
			showHint(translate("Some (%s) changes are already has or deprecated", count));
		}
	}
}

function show(view) {
	if (!__code__.startsWith("develop")) return;
	var editText = new android.widget.EditText(context);
	editText.setHint("Hi, I'm evaluate stroke");
	if (show.lastCode) editText.setText(show.lastCode);
	
	var dialog = new android.app.AlertDialog.Builder(context);
	dialog.setTitle(__name__ + " " + __version__);
	dialog.setPositiveButton("Eval", function() {
		try {
			show.lastCode = "" + editText.getText().toString();
			showHint(eval(show.lastCode) || "Success");
		} catch(e) {
			reportError(e);
		}
	});
	dialog.setNegativeButton("Cancel", null);
	dialog.setCancelable(false);
	dialog.setView(editText);
	dialog.create().show();
}

function minifyJs(text, callback) {
	if (text != null && text != undefined) {
		text = encodeURI(text).replace(/%5B/g, '[').replace(/%5D/g, ']');
	}
	handleThread(function() {
		let reader = new Network.Reader("https://javascript-minifier.com/raw?input=" + text);
		reader.setCallback({
			onComplete: function(reader) {
				alert("Completed");
			}
		});
		callback && callback(reader.read());
	});
}
