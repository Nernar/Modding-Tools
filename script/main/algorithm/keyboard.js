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

const registerKeyboardWatcher = (function(state, watchers) {
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
