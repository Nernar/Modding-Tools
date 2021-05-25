/*
     _____      _             _   _             
    |  __ \    | |           | | (_)            
    | |__) |___| |_ ___ _ __ | |_ _  ___  _ __  
    |  _  // _ \ __/ _ \ '_ \| __| |/ _ \| '_ \ 
    | | \ \  __/ ||  __/ | | | |_| | (_) | | | |
    |_|  \_\___|\__\___|_| |_|\__|_|\___/|_| |_|
                                                
                                                
   Copyright 2017-2021 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

LIBRARY({
	name: "Retention",
	version: 3,
	shared: false,
	api: "AdaptedScript"
});

let launchTime = Date.now();
EXPORT("launchTime", launchTime);

let context = UI.getContext();
EXPORT("context", context);

let version = MCSystem.getInnerCoreVersion();
let code = parseInt(version.toString()[0]);

let isHorizon = code >= 2;
EXPORT("isHorizon", isHorizon);

/**
 * Delays the action in the interface
 * thread for the required time.
 * @param {function} action action
 * @param {number} time expectation
 */
let handle = function(action, time) {
	context.runOnUiThread(function() {
		new android.os.Handler().postDelayed(function() {
			try { action(); }
			catch (e) { reportError(e); }
		}, time || 0);
	});
}

EXPORT("handle", handle);

/**
 * Generates a random number from minimum to
 * maximum value. If only the first is indicated,
 * generation will occur with a probability of
 * one less than a given number.
 * @param {number} min minimum number
 * @param {number} [max] maximum number
 * @returns {number} random number
 */
let random = function(min, max) {
	max == undefined && (max = min - 1, min = 0);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

EXPORT("random", random);

/**
 * Returns the difference between the current time
 * and the start time of the library.
 */
let getTime = function() {
	return Date.now() - launchTime;
}

EXPORT("getTime", getTime);

/**
 * Used to reduce dependencies from
 * system interfaces and their imports.
 */
let Interface = {
	Display: {
		FILL: android.view.ViewGroup.LayoutParams.FILL_PARENT,
		MATCH: android.view.ViewGroup.LayoutParams.MATCH_PARENT,
		WRAP: android.view.ViewGroup.LayoutParams.WRAP_CONTENT
	},
	Orientate: {
		HORIZONTAL: android.widget.LinearLayout.HORIZONTAL,
		VERTICAL: android.widget.LinearLayout.VERTICAL
	},
	Scale: {
		CENTER: android.widget.ImageView.ScaleType.CENTER,
		CENTER_CROP: android.widget.ImageView.ScaleType.CENTER_CROP,
		CENTER_INSIDE: android.widget.ImageView.ScaleType.CENTER_INSIDE,
		FIT_CENTER: android.widget.ImageView.ScaleType.FIT_CENTER,
		FIT_END: android.widget.ImageView.ScaleType.FIT_END,
		FIT_START: android.widget.ImageView.ScaleType.FIT_START,
		FIT_XY: android.widget.ImageView.ScaleType.FIT_XY,
		MATRIX: android.widget.ImageView.ScaleType.MATRIX
	},
	Gravity: {
		BOTTOM: android.view.Gravity.BOTTOM,
		CENTER: android.view.Gravity.CENTER,
		FILL: android.view.Gravity.FILL,
		RIGHT: android.view.Gravity.RIGHT,
		LEFT: android.view.Gravity.LEFT,
		TOP: android.view.Gravity.TOP,
		NONE: android.view.Gravity.NO_GRAVITY
	},
	Color: {
		BLACK: android.graphics.Color.BLACK,
		WHITE: android.graphics.Color.WHITE,
		RED: android.graphics.Color.RED,
		GREEN: android.graphics.Color.GREEN,
		BLUE: android.graphics.Color.BLUE,
		YELLOW: android.graphics.Color.YELLOW,
		CYAN: android.graphics.Color.CYAN,
		MAGENTA: android.graphics.Color.MAGENTA,
		GRAY: android.graphics.Color.GRAY,
		LTGRAY: android.graphics.Color.LTGRAY,
		DKGRAY: android.graphics.Color.DKGRAY,
		TRANSPARENT: android.graphics.Color.TRANSPARENT
	},
	Direction: {
		INHERIT: android.view.View.LAYOUT_DIRECTION_INHERIT,
		LOCALE: android.view.View.LAYOUT_DIRECTION_LOCALE,
		LTR: android.view.View.LAYOUT_DIRECTION_LTR,
		RTL: android.view.View.LAYOUT_DIRECTION_RTL
	},
	Visibility: {
		VISIBLE: android.view.View.VISIBLE,
		INVISIBLE: android.view.View.INVISIBLE,
		GONE: android.view.View.GONE
	},
	Choice: {
		NONE: android.widget.ListView.CHOICE_MODE_NONE,
		SINGLE: android.widget.ListView.CHOICE_MODE_SINGLE,
		MULTIPLE: android.widget.ListView.CHOICE_MODE_MULTIPLE,
		MODAL: android.widget.ListView.CHOICE_MODE_MULTIPLE_MODAL
	},
	TileMode: {
		CLAMP: android.graphics.Shader.TileMode.CLAMP,
		REPEAT: android.graphics.Shader.TileMode.REPEAT,
		MIRROR: android.graphics.Shader.TileMode.MIRROR
	}
};

Interface.Gravity.parse = function(str) {
	for (let item in this) {
		if (typeof this[item] == "number") {
			eval(item + " = this[i]");
		}
	}
	return eval(str.toUpperCase());
};

Interface.Color.parse = function(str) {
	return android.graphics.Color.parseColor(str);
};

Interface.updateDisplay = function() {
	let display = context.getWindowManager().getDefaultDisplay();
	this.Display.WIDTH = display.getWidth();
	this.Display.HEIGHT = display.getHeight();
	let metrics = context.getResources().getDisplayMetrics();
	this.Display.DENSITY = metrics.density;
};

Interface.updateDisplay();

Interface.getFontSize = function(size) {
	return Math.round(this.getX(size) / this.Display.DENSITY);
};

Interface.getFontMargin = function() {
	return this.getY(7);
};

Interface.getX = function(x) {
	return x > 0 ? Math.round(this.Display.WIDTH / 1000 * x) : x;
};

Interface.getY = function(y) {
	return y > 0 ? Math.round(this.Display.HEIGHT / 1000 * y) : y;
};

Interface.getDecorView = function() {
	return context.getWindow().getDecorView();
};

Interface.getEmptyDrawable = function() {
	return new android.graphics.drawable.ColorDrawable();
};

Interface.setActorName = function(view, name) {
	android.support.v4.view.ViewCompat.setTransitionName(view, "" + name);
};

Interface.vibrate = function(time) {
	handle(function() {
		let service = android.content.Context.VIBRATOR_SERVICE;
		context.getSystemService(service).vibrate(time);
	});
};

Interface.getViewRect = function(view) {
	let rect = new android.graphics.Rect();
	view.getGlobalVisibleRect(rect);
	return rect || null;
};

Interface.getLayoutParams = function(width, height, direction, margins) {
	width = this.getX(width), height = this.getY(height);
	let params = android.view.ViewGroup.LayoutParams(width, height != null ? height : width);
	margins && params.setMargins(this.getX(margins[0]), this.getY(margins[1]), this.getX(margins[2]), this.getY(margins[3]));
	direction && params.setLayoutDirection(direction);
	return params;
};

Interface.makeViewId = function() {
	return android.view.View.generateViewId();
};

Interface.sleepMilliseconds = function(ms) {
	java.util.concurrent.TimeUnit.MILLISECONDS.sleep(ms);
};

Interface.getInnerCoreVersion = function() {
	return {
		name: version,
		code: code
	};
};

EXPORT("Ui", Interface);

/**
 * For caching, you must use the check amount
 * files and any other content, the so-called hashes.
 */
let Hashable = {};
Hashable.toMD5 = function(bytes) {
	let digest = java.security.MessageDigest.getInstance("md5");
	digest.update(bytes);
	let byted = digest.digest(), item = 0, sb = new java.lang.StringBuilder();
	for (; item < byted.length; item++) {
		sb.append(java.lang.Integer.toHexString(0xFF & byted[item]));
	}
	return sb.toString();
};

EXPORT("Hashable", Hashable);

/**
 * Error display window, possibly in particular,
 * useful for visualizing and debugging problems.
 * @param {Object} err fallback exception
 */
let reportError = function(err) {
	if (typeof err != "object") {
		return;
	}
	err.date = Date.now();
	if (reportError.isReporting) {
		if (reportError.stack.length < 16) {
			reportError.stack.push(err);
		}
		return;
	} else reportError.isReporting = true;
	context.runOnUiThread(function() {
		let builder = new android.app.AlertDialog.Builder(context, android.R.style.Theme_DeviceDefault_DialogWhenLarge);
		builder.setTitle(reportError.title || "Oh nose everything broke");
		builder.setCancelable(false);
		
		reportError.__report && reportError.__report(err);
		
		let result = new Array(), message = reportError.message;
		message && result.push(message + "<br/>");
		result.push("<font color=\"#CCCC33\"><b>" + err.name + "</b>");
		result.push(err.stack ? err.message : err.message + "</font>");
		err.stack && result.push(new java.lang.String(err.stack).replaceAll("\n", "<br/>") + "</font>");
		
		let values = reportError.getDebugValues();
		if (values != null) {
			result.push("Game & debug values");
			result.push(values + "<br/>");
		}
		
		if (err.fileName && typeof err.lineNumber != "undefined") {
			let source = reportError.getErrorLines(err.fileName, err.lineNumber);
			source != null && result.push(err.fileName + "<br/>" + source);
		}
		
		builder.setMessage(android.text.Html.fromHtml(result.join("<br/>")));
		builder.setPositiveButton("Understand", null);
		builder.setNeutralButton("Leave", function() {
			reportError.stack = new Array();
		});
		builder.setNegativeButton(reportError.getCode(err), function() {
			reportError.__stack && reportError.__stack(err);
		});
		
		let dialog = builder.create();
		dialog.getWindow().setLayout(Interface.Display.WIDTH / 1.6, Interface.Display.HEIGHT / 1.2);
		dialog.setOnDismissListener(function() {
			reportError.isReporting = false;
			if (reportError.stack.length > 0) {
				reportError(reportError.stack.shift());
			}
		});
		dialog.show();
	});
}

reportError.setTitle = function(title) {
	title && (this.title = title);
};

reportError.setInfoMessage = function(html) {
	html && (this.message = html);
};

reportError.setStackAction = function(action) {
	action && (this.__stack = function(err) {
		try { action(err); } catch (e) {}
	});
};

reportError.setReportAction = function(action) {
	action && (this.__report = function(err) {
		try { action(err); } catch (e) {}
	});
};

reportError.readLines = function(file, start, end) {
	if (!file.exists()) {
		return null;
	}
	let scanner = new java.io.FileReader(file), reader = java.io.BufferedReader(scanner), count = -1, result = new Array();
	while (count <= end && (line = reader.readLine())) {
		if (count >= start) {
			result.push(line);
		}
		count++;
	}
	return result.length > 0 ? result : null;
};

reportError.stack = new Array();

reportError.getErrorLines = function(file, number) {
	if (file.indexOf("$") != -1) {
		file = file.split("$")[1];
	}
	let source = new java.io.File(__dir__ + file), result = new Array(), lines = this.readLines(source, number - 5, number + 2);
	if (lines && lines.length > 0) {
		let isErrorLines = false;
		for (let i = 0; i < lines.length; i++) {
			let prefix = "<small>" + (number + i - 3) + "</small> ";
			if (i == 4) {
				isErrorLines = true;
			} else if (isErrorLines && lines[i].indexOf("}") != -1) {
				isErrorLines = false;
			}
			result.push(!isErrorLines ? prefix + "<font face=\"monospace\">" + lines[i] + "</font>" : prefix + "<font face=\"monospace\" color=\"#DD3333\">" + lines[i] + "</font>");
		}
	} else return null;
	return result.join("<br/>");
};

reportError.values = new Array();

reportError.addDebugValue = function(name, value) {
	this.values.push({
		name: name,
		value: value
	});
};

reportError.getDebugValues = function() {
	let result = new Array();
	for (let index = 0; index < this.values.length; index++) {
		let value = this.values[index];
		result.push(value.name + " = " + value.value + ";");
	}
	return result.length > 0 ? "<font face=\"monospace\">" + result.join("<br/>") + "</font>" : null;
};

reportError.getStack = function(err) {
	return err.message + "\n" + err.stack;
};

reportError.getCode = function(err) {
	let encoded = java.lang.String(this.getStack(err)), counter = Hashable.toMD5(encoded.getBytes());
	return "NE-" + Math.round(Math.abs(counter.hashCode() / 10000));
};

reportError.getLaunchTime = function() {
	return new Date(launchTime).toString();
};

EXPORT("reportError", reportError);

/**
 * Translates exiting at launcher strokes,
 * replaces and formats [[%s]] arguments.
 * @param {string} str stroke to translate
 * @param {string|Object} [args] argument(s) to replace
 */
let translate = function(str, args) {
	try {
		if (!Array.isArray(args)) {
			args = ["" + args];
		} else {
			for (let item in args) {
				args[item] = "" + args[item];
			}
		}
		str = java.lang.String(Translation.translate(str));
		return args ? java.lang.String.format(str, args) : str;
	} catch (e) {
		reportError(e);
		return str;
	}
};

translate.isVerb = function(count) {
	if (count < 0) {
		count = Math.abs(count);
	}
	return count % 10 == 1 && count % 100 != 11;
};

translate.isMany = function(count) {
	if (count < 0) {
		count = Math.abs(count);
	}
	return count % 10 == 0 || count % 10 >= 5 || count % 100 - count % 10 == 10;
};

translate.asCounter = function(count, empty, verb, little, many, args) {
	try {
		let value = count.toString(), pasteable = value.length > 0 ? value.substring(0, value.length - 1) : new String();
		if (args && !translate.isMany(count)) {
			for (let i = 0; i < args.length; i++) {
				if (args[i] == count) {
					args[i] = pasteable;
				}
			}
		}
		return translate(count == 0 ? empty : translate.isVerb(count) ? verb : translate.isMany(count) ? many : little, args);
	} catch (e) {
		reportError(e);
		return empty;
	}
};

EXPORT("translate", translate);
EXPORT("translateCounter", translate.asCounter);
