/**
 * @requires `isAndroid()`
 */
function isKeyboardOnScreen() {
	try {
		let manager = getContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
		let windowHeightMethod = android.view.inputmethod.InputMethodManager.__javaObject__.getMethod("getInputMethodWindowVisibleHeight");
		return windowHeightMethod.invoke(manager) > 0;
	} catch (e) {
		reportError(e);
	}
	return false;
}

/**
 * @requires `isAndroid()`
 */
const registerKeyboardWatcher = ((state, watchers) => {
	if (isCLI()) {
		return function() {
			MCSystem.throwException("Modding Tools: Keyboard watchers cannot be registered on CLI!");
		};
	}
	getDecorView().getViewTreeObserver().addOnGlobalLayoutListener(() => {
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
	return function(who: (keyboardOnScreen: boolean) => void) {
		if (typeof who == "function" && watchers.indexOf(who) == -1) {
			watchers.push(who);
		}
	};
})(false, []);
