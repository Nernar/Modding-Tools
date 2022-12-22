/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 * @requires `isAndroid()`
 */
const WindowProvider = {};

WindowProvider.BASE_WINDOW_FLAGS = isHorizon ? 256 : 0;

WindowProvider.attached = {};

Object.defineProperty(WindowProvider, "manager", {
	get: function() {
		return getContext().getSystemService("window");
	},
	enumerable: true,
	configurable: false
});

WindowProvider.getFlagsForWindow = function(window) {
	let flags = isInstant ? 0 : this.BASE_WINDOW_FLAGS;
	if (!window) {
		return flags;
	}
	if (!window.isTouchable()) {
		flags |= 16;
	} else if (!window.isFullscreen()) {
		flags |= 32;
	}
	if (window.isFullscreen()) {
		return flags | 2;
	}
	return flags;
};

(function() {
	let identifier = 0;
	WindowProvider.prepareIdentifier = function(window) {
		if (window.popupId !== undefined) {
			return window.popupId;
		}
		window.popupId = ++identifier;
		return window.popupId;
	};
})();

WindowProvider.hasOpenedPopup = function(window) {
	return !!(window.popupId == -1 || this.getByPopupId(window.popupId));
};

WindowProvider.getByPopupId = function(popupId) {
	if (popupId === undefined || popupId == -1) return null;
	return this.attached[popupId] || null;
};

WindowProvider.openWindow = function(window) {
	if (this.hasOpenedPopup(window)) {
		return;
	}
	let content = window.getContent();
	if (!window.isFocusable()) {
		if (content) {
			if (isInstant) {
				content.setFitsSystemWindows(true);
			} else if (isHorizon) {
				content.setSystemUiVisibility(5894);
			}
		}
		let popup = content ? new android.widget.PopupWindow(content, window.getWidth(), window.getHeight())
				: new android.widget.PopupWindow(window.getWidth(), window.getHeight()),
			popupId = this.prepareIdentifier(window);
		this.attached[popupId] = popup;
		popup.setAttachedInDecor(isHorizon && !isInstant);
		popup.setTouchable(window.isTouchable());
		if (window.enterTransition) {
			this.setEnterTransition(popupId, window.enterTransition);
		}
		if (window.exitTransition) {
			this.setExitTransition(popupId, window.exitTransition);
		}
		popup.showAtLocation(getDecorView(), window.getGravity(), window.getX(), window.getY());
		return;
	}
	window.popupId = -1;
	let flags = this.getFlagsForWindow(window);
	this.manager.addView(content, window.getParams(flags));
};

WindowProvider.closeWindow = function(window) {
	if (!window.isFocusable()) {
		let popupId = window.popupId,
			popup = this.getByPopupId(popupId);
		if (popup === null) return;
		popup.dismiss();
		delete this.attached[popupId];
		delete window.popupId;
		return;
	}
	if (window.popupId != -1) return;
	delete window.popupId;
	this.manager.removeView(window.getContent());
};

WindowProvider.setEnterTransition = function(popupId, actor, content) {
	if (android.os.Build.VERSION.SDK_INT >= 23) {
		let popup = this.getByPopupId(popupId);
		if (popup === null) return;
		popup.setEnterTransition(actor);
	}
};

WindowProvider.setExitTransition = function(popupId, actor, content) {
	if (android.os.Build.VERSION.SDK_INT >= 23) {
		let popup = this.getByPopupId(popupId);
		if (popup === null) return;
		popup.setExitTransition(actor);
	}
};

WindowProvider.updateWindow = function(window) {
	if (!window.isFocusable()) {
		let popupId = window.popupId,
			popup = this.getByPopupId(popupId);
		if (!popup) return;
		let enter = window.getEnterTransition();
		if (enter !== null) this.setEnterTransition(popupId, enter);
		let exit = window.getExitTransition();
		if (exit !== null) this.setExitTransition(popupId, exit);
		popup.setContentView(window.getContent());
		popup.setTouchable(window.isTouchable());
		popup.setFocusable(window.isFocusable());
		popup.update(window.getX(), window.getY(),
			window.getWidth(), window.getHeight());
		return;
	}
	if (window.popupId != -1) return;
	let flags = this.getFlagsForWindow(window);
	this.manager.updateViewLayout(window.getContent(), window.getParams(flags));
};

WindowProvider.destroy = function() {
	for (let item in this.attached) {
		this.attached[item].dismiss();
	}
	this.attached = {};
};
