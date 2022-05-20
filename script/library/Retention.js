/*

   Copyright 2017-2022 Nernar (github.com/nernar)

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
	version: 5,
	shared: false,
	api: "AdaptedScript"
});

let launchTime = Date.now();
EXPORT("launchTime", launchTime);

let version = MCSystem.getInnerCoreVersion();
let code = parseInt(version.toString()[0]);

let isHorizon = code >= 2;
EXPORT("isHorizon", isHorizon);

let getContext = function() {
	return UI.getContext();
};

EXPORT("getContext", getContext);

if (this.isInstant === undefined) {
	this.isInstant = false;
}

/**
 * invoke(who, when => (th)): any
 * invokeRuntime(who, when => (th)): any
 * invokeRhino(who, when => (th)): any
 */
let resolveThrowable = (function() {
	let decodeBase64 = function(base64) {
		if (android.os.Build.VERSION.SDK_INT >= 26) {
			return java.util.Base64.getDecoder().decode(java.lang.String(base64).getBytes());
		}
		return android.util.Base64.decode(java.lang.String(base64).getBytes(), android.util.Base64.NO_WRAP);
	};
	// let bytes = decodeBase64("ZGV4CjAzNQDr+sctysHjSDkpq6sdQrz23fK/bsZ2Ud9kBgAAcAAAAHhWNBIAAAAAAAAAANAFAAAWAAAAcAAAAAsAAADIAAAABgAAAPQAAAAAAAAAAAAAAAwAAAA8AQAAAQAAAJwBAACoBAAAvAEAALwBAADEAQAAxwEAAMwBAADSAQAA2QEAAA8CAAA0AgAASAIAAGYCAAB9AgAAnwIAAMICAADrAgAAEAMAABMDAAAoAwAARwMAAE0DAABdAwAAZQMAAHIDAAAFAAAABgAAAAcAAAAIAAAACQAAAAoAAAALAAAADAAAAA0AAAAOAAAADwAAAAQAAAACAAAAmAMAAAIAAAACAAAAkAMAAAMAAAACAAAAhAMAAAEAAAAFAAAAAAAAAAEAAAAIAAAAAAAAAA4AAAAJAAAAAAAAAAAAAwAQAAAAAQAFAAAAAAABAAEAEwAAAAEAAgATAAAAAQABABQAAAABAAIAFAAAAAEAAQAVAAAAAQACABUAAAACAAUAAAAAAAYAAAARAAAABgAEABIAAAAIAAQAEgAAAAEAAAABAAAAAgAAAAAAAAD/////AAAAAKwFAAAAAAAABjxpbml0PgABTAADTExMAARMTExMAAVMTExMTAA0TGNvbS96aGVrYXNtaXJub3YvaW5uZXJjb3JlL21vZC9leGVjdXRhYmxlL0NvbXBpbGVyOwAjTGlvL25lcm5hci9yaGluby9UaHJvd2FibGVSZXNvbHZlcjsAEkxqYXZhL2xhbmcvT2JqZWN0OwAcTGphdmEvbGFuZy9SdW50aW1lRXhjZXB0aW9uOwAVTGphdmEvbGFuZy9UaHJvd2FibGU7ACBMb3JnL21vemlsbGEvamF2YXNjcmlwdC9Db250ZXh0OwAhTG9yZy9tb3ppbGxhL2phdmFzY3JpcHQvRnVuY3Rpb247ACdMb3JnL21vemlsbGEvamF2YXNjcmlwdC9SaGlub0V4Y2VwdGlvbjsAI0xvcmcvbW96aWxsYS9qYXZhc2NyaXB0L1NjcmlwdGFibGU7AAFWABNbTGphdmEvbGFuZy9PYmplY3Q7AB1hc3N1cmVDb250ZXh0Rm9yQ3VycmVudFRocmVhZAAEY2FsbAAOZ2V0UGFyZW50U2NvcGUABmludm9rZQALaW52b2tlUmhpbm8ADWludm9rZVJ1bnRpbWUAAAAAAwAAAAgABgAGAAAAAgAAAAYABgAEAAAABQAIAAgACgAAAAAAAQABAAEAAAAAAAAABAAAAHAQCAAAAA4AAwACAAMAAAAAAAAACQAAAHIQCgABAAwAcTADABACDAARAAAACAADAAUAAQAAAAAAMgAAABIBEgRxAAAAAAAMAjgFDgByEAsABQAMABIDIzMKAHJTCQAmUAwAEQASAB8ACAAo9Q0ABwJxAAAAAAAMAzgFEAByEAsABQAMABIRIxEKAE0CAQRyUQkAN1AMACjmBxAfAAgAKPMCAAAAFQABAAEBBBgDAAIAAwAAAAAAAAAJAAAAchAKAAEADABxMAMAEAIMABEAAAAIAAMABQABAAAAAAAyAAAAEgESBHEAAAAAAAwCOAUOAHIQCwAFAAwAEgMjMwoAclMJACZQDAARABIAHwAIACj1DQAHAnEAAAAAAAwDOAUQAHIQCwAFAAwAEhEjEQoATQIBBHJRCQA3UAwAKOYHEB8ACAAo8wIAAAAVAAEAAQEHGAMAAgADAAAAAAAAAAkAAAByEAoAAQAMAHEwAwAQAgwAEQAAAAgAAwAFAAEAAAAAADIAAAASARIEcQAAAAAADAI4BQ4AchALAAUADAASAyMzCgByUwkAJlAMABEAEgAfAAgAKPUNAAcCcQAAAAAADAM4BRAAchALAAUADAASESMRCgBNAgEEclEJADdQDAAo5gcQHwAIACjzAgAAABUAAQABAQMYAAAHAAGBgASoBwEJwAcBCeQHAQnkCAEJiAkBCYgKAQmsCgAADAAAAAAAAAABAAAAAAAAAAEAAAAWAAAAcAAAAAIAAAALAAAAyAAAAAMAAAAGAAAA9AAAAAUAAAAMAAAAPAEAAAYAAAABAAAAnAEAAAIgAAAWAAAAvAEAAAEQAAADAAAAhAMAAAMQAAABAAAApAMAAAEgAAAHAAAAqAMAAAAgAAABAAAArAUAAAAQAAABAAAA0AUAAA==");
	let bytes = decodeBase64("ZGV4CjAzNQA7yC65zIj/irByxZUNv+ejN5SKUkKw3cq4CgAAcAAAAHhWNBIAAAAAAAAAAAwKAAAoAAAAcAAAABQAAAAQAQAADAAAAGABAAABAAAA8AEAABMAAAD4AQAAAQAAAJACAAAICAAAsAIAALACAAC6AgAAwgIAAMUCAADJAgAAzgIAANQCAADbAgAAAAMAABMDAAA3AwAAWwMAAH0DAACgAwAAtAMAANIDAADmAwAA/QMAACgEAABXBAAAcwQAAJUEAAC4BAAA4QQAAAYFAAAeBQAAIQUAACUFAAA5BQAATgUAAG0FAABzBQAApwUAALAFAAC8BQAAxwUAANcFAADfBQAA7AUAAPsFAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAAQAAAAEQAAABIAAAATAAAAFAAAABUAAAAWAAAAFwAAABkAAAAbAAAAHAAAAAMAAAABAAAAOAYAAAQAAAAGAAAAZAYAAAYAAAAGAAAAWAYAAAQAAAAGAAAASAYAAAUAAAAGAAAALAYAAAIAAAAIAAAAAAAAAAQAAAAMAAAAQAYAAAIAAAANAAAAAAAAAAIAAAAQAAAAAAAAABkAAAARAAAAAAAAABoAAAARAAAAOAYAABoAAAARAAAAUAYAAAAADAAdAAAAAAAJAAAAAAAAAAkAAQAAAAAABwAdAAAAAAADACQAAAAAAAQAJAAAAAAAAwAlAAAAAAAEACUAAAAAAAMAJgAAAAAABAAmAAAAAQAAACAAAAABAAYAIgAAAAQACgABAAAABgAJAAEAAAAJAAUAIQAAAAoACwABAAAADAABACQAAAAOAAIAHgAAAA4ACAAjAAAAEAAIACMAAAAAAAAAAQAAAAYAAAAAAAAAGAAAAAAAAADcCQAAAAAAAAg8Y2xpbml0PgAGPGluaXQ+AAFMAAJMTAADTExMAARMTExMAAVMTExMTAAjTGlvL25lcm5hci9yaGluby9UaHJvd2FibGVSZXNvbHZlcjsAEUxqYXZhL2xhbmcvQ2xhc3M7ACJMamF2YS9sYW5nL0NsYXNzTm90Rm91bmRFeGNlcHRpb247ACJMamF2YS9sYW5nL0lsbGVnYWxBY2Nlc3NFeGNlcHRpb247ACBMamF2YS9sYW5nL05vQ2xhc3NEZWZGb3VuZEVycm9yOwAhTGphdmEvbGFuZy9Ob1N1Y2hNZXRob2RFeGNlcHRpb247ABJMamF2YS9sYW5nL09iamVjdDsAHExqYXZhL2xhbmcvUnVudGltZUV4Y2VwdGlvbjsAEkxqYXZhL2xhbmcvU3RyaW5nOwAVTGphdmEvbGFuZy9UaHJvd2FibGU7AClMamF2YS9sYW5nL1Vuc3VwcG9ydGVkT3BlcmF0aW9uRXhjZXB0aW9uOwAtTGphdmEvbGFuZy9yZWZsZWN0L0ludm9jYXRpb25UYXJnZXRFeGNlcHRpb247ABpMamF2YS9sYW5nL3JlZmxlY3QvTWV0aG9kOwAgTG9yZy9tb3ppbGxhL2phdmFzY3JpcHQvQ29udGV4dDsAIUxvcmcvbW96aWxsYS9qYXZhc2NyaXB0L0Z1bmN0aW9uOwAnTG9yZy9tb3ppbGxhL2phdmFzY3JpcHQvUmhpbm9FeGNlcHRpb247ACNMb3JnL21vemlsbGEvamF2YXNjcmlwdC9TY3JpcHRhYmxlOwAWVGhyb3dhYmxlUmVzb2x2ZXIuamF2YQABVgACVkwAEltMamF2YS9sYW5nL0NsYXNzOwATW0xqYXZhL2xhbmcvT2JqZWN0OwAdYXNzdXJlQ29udGV4dEZvckN1cnJlbnRUaHJlYWQABGNhbGwAMmNvbS56aGVrYXNtaXJub3YuaW5uZXJjb3JlLm1vZC5leGVjdXRhYmxlLkNvbXBpbGVyAAdmb3JOYW1lAApnZXRNZXNzYWdlAAlnZXRNZXRob2QADmdldFBhcmVudFNjb3BlAAZpbnZva2UAC2ludm9rZVJoaW5vAA1pbnZva2VSdW50aW1lAC16aGVrYXNtaXJub3YubGF1bmNoZXIubW9kLmV4ZWN1dGFibGUuQ29tcGlsZXIAAAADAAAAEAAOAA4AAAABAAAACAAAAAIAAAAIABIAAgAAAA4ADgABAAAACQAAAAQAAAANABAAEAATAAIAAAAGABMAAAAAABAABw4BERcCdx3FadN6AntoAEcABw4AHwAHDgEQEGYALgIAAAcOACcDAAAABywBERAbagBGAgAABw4APwMAAAAHLAEREBtqADoCAAAHDgAzAwAAAAcsAREQG2oAAwAAAAMAAwBwBgAAQAAAABoAHwBxEAkAAAAMABoBHQASAiMiEgBuMAoAEAIMAGkAAAAOAA0AIgEEAG4QDQAAAAwAcCALAAEAJwENABoAJwBxEAkAAAAMABoBHQASAiMiEgBuMAoAEAIMAGkAAAAo4g0AIgEKAHAgDgABACcBDQAiAQoAcCAOAAEAJwENACjyAAAAAAUAAQAGAAAAFwAIAB4AAAARAA0AAwMCEgQdBTcCBB0FNwICMAU+AAABAAEAAQAAAIIGAAAEAAAAcBAMAAAADgADAAAAAwABAIcGAAAYAAAAYgEAABIAHwAGABICIyITAG4wDwABAgwAHwANABEADQAiAQoAcCAOAAEAJwENACj5AAAAAA4AAQABAgsWAw8AAAMAAgADAAAAkAYAAAkAAAByEBEAAQAMAHEwBAAQAgwAEQAAAAgAAwAFAAEAlwYAADIAAAASARIEcQACAAAADAI4BQ4AchASAAUADAASAyMzEwByUxAAJlAMABEAEgAfABAAKPUNAAcCcQACAAAADAM4BRAAchASAAUADAASESMREwBNAgEEclEQADdQDAAo5gcQHwAQACjzAgAAABUAAQABAQkYAwACAAMAAACkBgAACQAAAHIQEQABAAwAcTAEABACDAARAAAACAADAAUAAQCrBgAAMgAAABIBEgRxAAIAAAAMAjgFDgByEBIABQAMABIDIzMTAHJTEAAmUAwAEQASAB8AEAAo9Q0ABwJxAAIAAAAMAzgFEAByEBIABQAMABIRIxETAE0CAQRyURAAN1AMACjmBxAfABAAKPMCAAAAFQABAAEBDxgDAAIAAwAAALgGAAAJAAAAchARAAEADABxMAQAEAIMABEAAAAIAAMABQABAL8GAAAyAAAAEgESBHEAAgAAAAwCOAUOAHIQEgAFAAwAEgMjMxMAclMQACZQDAARABIAHwAQACj1DQAHAnEAAgAAAAwDOAUQAHIQEgAFAAwAEhEjERMATQIBBHJREAA3UAwAKOYHEB8AEAAo8wIAAAAVAAEAAQEHGAEACQAAGgCYgATMDQGBgASIDwEKoA8BCfAPAQmUEAEJlBEBCbgRAQm4EgEJ3BIAAA4AAAAAAAAAAQAAAAAAAAABAAAAKAAAAHAAAAACAAAAFAAAABABAAADAAAADAAAAGABAAAEAAAAAQAAAPABAAAFAAAAEwAAAPgBAAAGAAAAAQAAAJACAAACIAAAKAAAALACAAABEAAABwAAACwGAAADEAAAAQAAAGwGAAADIAAACQAAAHAGAAABIAAACQAAAMwGAAAAIAAAAQAAANwJAAAAEAAAAQAAAAwKAAA=");
	return java.lang.Class.forName("io.nernar.rhino.ThrowableResolver", false, (function() {
		if (android.os.Build.VERSION.SDK_INT >= 26) {
			return new Packages.dalvik.system.InMemoryDexClassLoader(java.nio.ByteBuffer.wrap(bytes), getContext().getClassLoader());
		}
		let dex = new java.io.File(__dir__ + ".dex/0");
		dex.getParentFile().mkdirs();
		dex.createNewFile();
		let stream = new java.io.FileOutputStream(dex);
		stream.write(bytes);
		stream.close();
		return new Packages.dalvik.system.PathClassLoader(dex.getPath(), getContext().getClassLoader());
	})()).newInstance();
})();

EXPORT("resolveThrowable", resolveThrowable);

/**
 * Tries to just call action or returns
 * [[basic]] value. Equivalent to try-catch.
 * @param {function} action action
 * @param {function} [report] action when error
 * @param {any} [basic] default value
 * @returns {any} action result or nothing
 */
let tryout = function(action, report, basic) {
	try {
		if (typeof action == "function") {
			return action.call(this);
		}
	} catch (e) {
		if (typeof report == "function") {
			let result = report.call(this, e);
			if (result !== undefined) return result;
		} else {
			reportError(e);
			if (report !== undefined) {
				return report;
			}
		}
	}
	return basic;
};

EXPORT("tryout", tryout);

/**
 * Tries to just call action or always returns
 * [[basic]] value. Equivalent to try-catch.
 * @param {function} action action
 * @param {function} [report] action when error
 * @param {any} [basic] default value
 * @returns {any} action result or default
 */
let require = function(action, report, basic) {
	let result = tryout.call(this, action, report);
	if (basic === undefined) basic = report;
	return result !== undefined ? result : basic;
};

EXPORT("require", require);

/**
 * Delays the action in the interface
 * thread for the required time.
 * @param {function} action action
 * @param {number} [time] expectation
 * @param {function} [report] action when error
 */
let handle = function(action, time, report) {
	let self = this;
	getContext().runOnUiThread(function() {
		new android.os.Handler().postDelayed(function() {
			if (action !== undefined) tryout.call(self, action, report);
		}, time >= 0 ? time : 0);
	});
};

EXPORT("handle", handle);

/**
 * @async
 * Delays the action in the interface and
 * async waiting it in current thread.
 * @param {function} action action
 * @param {function} [report] action when error
 * @param {any} [basic] default value
 * @returns {any} action result or default
 */
let acquire = function(action, report, basic) {
	let self = this;
	let completed = false;
	getContext().runOnUiThread(function() {
		if (action !== undefined) {
			let value = tryout.call(self, action, report);
			if (value !== undefined) {
				basic = value;
			}
		}
		completed = true;
	});
	while (!completed) {
		java.lang.Thread.yield();
	}
	return basic;
};

EXPORT("acquire", acquire);

/**
 * Processes some action, that can be
 * completed in foreground or background.
 * @param {function} action action
 * @param {number} priority number between 1-10
 * @returns {java.lang.Thread} thread
 */
let handleThread = function(action, report, priority) {
	let self = this;
	let thread = new java.lang.Thread(function() {
		if (action !== undefined) tryout.call(self, action, report);
		let index = handleThread.stack.indexOf(thread);
		if (index != -1) handleThread.stack.splice(index, 1);
	});
	handleThread.stack.push(thread);
	if (priority !== undefined) {
		thread.setPriority(priority);
	}
	return (thread.start(), thread);
};

handleThread.MIN_PRIORITY = java.lang.Thread.MIN_PRIORITY;
handleThread.NORM_PRIORITY = java.lang.Thread.NORM_PRIORITY;
handleThread.MAX_PRIORITY = java.lang.Thread.MAX_PRIORITY;

handleThread.stack = [];

handleThread.interruptAll = function() {
	handleThread.stack.forEach(function(thread) {
		if (thread && !thread.isInterrupted()) {
			thread.interrupt();
		}
	});
	handleThread.stack = [];
};

EXPORT("handleThread", handleThread);

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
};

EXPORT("random", random);

/**
 * Returns the difference between the current time
 * and the start time of the library.
 */
let getTime = function() {
	return Date.now() - launchTime;
};

EXPORT("getTime", getTime);

/**
 * Translates exiting at launcher strokes,
 * replaces and formats [[%s]] arguments.
 * @param {string} str stroke to translate
 * @param {string|Array} [args] argument(s) to replace
 * @returns {string} translated stroke
 */
let translate = function(str, args) {
	return tryout(function() {
		str = Translation.translate(str);
		if (args !== undefined) {
			if (!Array.isArray(args)) {
				args = [args];
			}
			args = args.map(function(value) {
				return "" + value;
			});
			str = java.lang.String.format(str, args);
		}
		return String(str);
	}, String(str));
};

translate.isVerb = function(count) {
	if (count < 0) count = Math.abs(count);
	return count % 10 == 1 && count % 100 != 11;
};

translate.isMany = function(count) {
	if (count < 0) count = Math.abs(count);
	return count % 10 == 0 || count % 10 >= 5 || count % 100 - count % 10 == 10;
};

translate.asCounter = function(count, empty, verb, little, many, args) {
	return tryout(function() {
		if (args !== undefined) {
			if (!Array.isArray(args)) {
				args = [args];
			}
		} else args = [count];
		let much = translate.isMany(count);
		if (count != 0 && !much) {
			let stroke = String(count);
			stroke = stroke.substring(0, stroke.length - 2);
			args = args.map(function(value) {
				if (value == count) {
					return stroke;
				}
				return value;
			});
		}
		return translate(count == 0 ? empty : translate.isVerb(count) ? verb : much ? many : little, args);
	}, translate(empty, args));
};

EXPORT("translate", translate);
EXPORT("translateCounter", translate.asCounter);

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
			eval(item + " = this[item]");
		}
	}
	return eval(str.toUpperCase());
};

Interface.Color.parse = function(str) {
	return android.graphics.Color.parseColor(str);
};

Interface.updateDisplay = function() {
	let display = getContext().getWindowManager().getDefaultDisplay();
	this.Display.WIDTH = Math.max(display.getWidth(), display.getHeight());
	this.Display.HEIGHT = Math.min(display.getWidth(), display.getHeight());
	let metrics = getContext().getResources().getDisplayMetrics();
	this.Display.DENSITY = metrics.density;
};

Interface.updateDisplay();

if (isInstant) {
	Callback.addCallback("CoreConfigured", function() {
		Interface.updateDisplay();
	});
}

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
	return getContext().getWindow().getDecorView();
};

Interface.getEmptyDrawable = function() {
	return new android.graphics.drawable.ColorDrawable();
};

Interface.setTransitionName = function(view, name) {
	android.support.v4.view.ViewCompat.setTransitionName(view, String(name));
};

/**
 * @requires Requires evaluation in interface thread.
 * Uses device vibrator service to make vibration.
 * @param {number} milliseconds to vibrate
 */
Interface.vibrate = function(time) {
	let service = android.content.Context.VIBRATOR_SERVICE;
	getContext().getSystemService(service).vibrate(time);
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
	return { name: version, code: code };
};

EXPORT("Interface", Interface);

/**
 * For caching, you must use the check amount
 * files and any other content, the so-called hashes.
 */
let Hashable = {};

Hashable.toMD5 = function(bytes) {
	let digest = java.security.MessageDigest.getInstance("md5");
	digest.update(bytes);
	let byted = digest.digest(),
		sb = new java.lang.StringBuilder();
	for (let i = 0; i < byted.length; i++) {
		sb.append(java.lang.Integer.toHexString(0xFF & byted[i]));
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
	if (typeof err != "object" || err === null) {
		return;
	}
	err.date = Date.now();
	if (__reportError.stack === undefined) {
		getContext().runOnUiThread(function() {
			throw err;
		});
		return;
	}
	if (__reportError.isReporting) {
		if (__reportError.stack.length < 16) {
			__reportError.stack.push(err);
		}
		return;
	}
	__reportError.isReporting = true;
	getContext().runOnUiThread(function() {
		let builder = new android.app.AlertDialog.Builder(getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
		builder.setTitle(__reportError.title || translate("Oh nose everything broke"));
		builder.setCancelable(false);
		
		__reportError.__report && __reportError.__report(err);
		
		let result = [],
			message = __reportError.message;
		message && result.push(message + "<br/>");
		result.push("<font color=\"#CCCC33\"><b>" + err.name + "</b>");
		result.push(err.stack ? err.message : err.message + "</font>");
		err.stack && result.push(new java.lang.String(err.stack).replaceAll("\n", "<br/>") + "</font>");
		
		let values = __reportError.getDebugValues();
		if (values != null) {
			result.push(translate("Development debug values"));
			result.push(values + "<br/>");
		}
		
		builder.setMessage(android.text.Html.fromHtml(result.join("<br/>")));
		builder.setPositiveButton(translate("Understand"), null);
		builder.setNeutralButton(translate("Leave"), function() {
			__reportError.stack = [];
		});
		builder.setNegativeButton(__reportError.getCode(err), function() {
			__reportError.__stack && __reportError.__stack(err);
		});
		
		let dialog = builder.create();
		dialog.getWindow().setLayout(Interface.Display.WIDTH / 1.5, Interface.Display.HEIGHT / 1.2);
		dialog.setOnDismissListener(function() {
			__reportError.isReporting = false;
			if (__reportError.stack.length > 0) {
				reportError(__reportError.stack.shift());
			}
		});
		dialog.show();
	});
};

let __reportError = {};

__reportError.stack = [];

__reportError.setTitle = function(title) {
	title && (this.title = title);
};

__reportError.setInfoMessage = function(html) {
	html && (this.message = html);
};

__reportError.setStackAction = function(action) {
	this.__stack = function(err) {
		tryout(function() {
			action && action(err);
		});
	};
};

__reportError.setReportAction = function(action) {
	this.__report = function(err) {
		tryout(function() {
			action && action(err);
		});
	};
};

__reportError.values = [];

__reportError.addDebugValue = function(name, value) {
	this.values.push([name, value]);
};

__reportError.formCollectedValues = function() {
	let collected = [];
	for (let index = 0; index < this.values.length; index++) {
		let value = this.values[index];
		collected.push(value[0] + " = " + value[1] + ";");
	}
	return collected;
};

__reportError.getDebugValues = function() {
	let result = [];
	result.concat(this.formCollectedValues());
	return result.length > 0 ? "<font face=\"monospace\">" + result.join("<br/>") + "</font>" : null;
};

__reportError.getStack = function(err) {
	return err.message + "\n" + err.stack;
};

__reportError.getCode = function(err) {
	let encoded = java.lang.String(this.getStack(err)),
		counter = Hashable.toMD5(encoded.getBytes());
	return "NE-" + Math.abs(counter.hashCode());
};

__reportError.getLaunchTime = function() {
	return new Date(launchTime).toString();
};

for (let element in __reportError) {
	reportError[element] = __reportError[element];
}

EXPORT("reportError", reportError);

Translation.addTranslation("Oh nose everything broke", {
	ru: "Ох нет, все сломалось"
});
Translation.addTranslation("Development debug values", {
	ru: "Отладочные значения разработчика"
});
Translation.addTranslation("Understand", {
	ru: "Понятно"
});
Translation.addTranslation("Leave", {
	ru: "Выход"
});
