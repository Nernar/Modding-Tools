/**
 * @requires `isAndroid()`
 */
const isKeyboardOnScreen = function() {
	try {
		let manager = getContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
		let windowHeightMethod = android.view.inputmethod.InputMethodManager.__javaObject__.getMethod("getInputMethodWindowVisibleHeight");
		return windowHeightMethod.invoke(manager) > 0;
	} catch (e) {
		reportError(e);
	}
	return false;
};

/**
 * @requires `isAndroid()`
 */
const registerKeyboardWatcher = (function(state, watchers) {
	if (isCLI()) {
		return function() {
			Logger.Log("Unsupported platform-dependent usage: registerKeyboardWatcher, requires isAndroid()", "WARNING");
		};
	}
	getDecorView().getViewTreeObserver().addOnGlobalLayoutListener(function() {
		try {
			let onScreen = isKeyboardOnScreen();
			if (onScreen == state) return;
			state = onScreen;
			for (let i = 0; i < watchers.length; i++) {
				watchers[i](onScreen);
			}
		} catch (e) {
			reportError(e);
		}
	});
	return function(who) {
		if (typeof who == "function" && watchers.indexOf(who) == -1) {
			watchers.push(who);
		}
	};
})(false, []);
