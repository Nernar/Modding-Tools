const WindowProvider = new Object();

WindowProvider.BASE_WINDOW_FLAGS = isHorizon ? 256 : 0;

WindowProvider.attached = new Object();
WindowProvider.manager = context.getSystemService("window");

WindowProvider.getFlagsForWindow = function(window) {
	let flags = isInstant ? 0 : this.BASE_WINDOW_FLAGS;
	if (!window) return flags;
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

WindowProvider.prepareIdentifier = function(window) {
	if (window.popupId) {
		return window.popupId;
	}
	window.popupId = Interface.makeViewId();
	return window.popupId;
};

WindowProvider.hasOpenedPopup = function(window) {
	let id = window.popupId;
	if (!id) return false;
	return !!this.getByPopupId(id);
};

WindowProvider.getByPopupId = function(popupId) {
	if (!popupId) return null;
	return this.attached[popupId] || null;
};

WindowProvider.openWindow = function(window) {
	if (!window) return;
	let content = window.getContent();
	if (!window.isFocusable()) {
		if (this.hasOpenedPopup(window)) {
			return;
		}
		if (isHorizon && !isInstant) {
			content.setSystemUiVisibility(5894);
		}
		let popup = content ? new android.widget.PopupWindow(content,
				window.getWidth(), window.getHeight()) :
				new android.widget.PopupWindow(window.getWidth(), window.getHeight()),
			popupId = this.prepareIdentifier(window);
		this.attached[popupId] = popup;
		popup.setAttachedInDecor(isHorizon && !isInstant);
		popup.setTouchable(window.isTouchable());
		if (window.enterActor) {
			this.setEnterActor(popupId, window.enterActor);
		}
		if (window.exitActor) {
			this.setExitActor(popupId, window.exitActor);
		}
		popup.showAtLocation(Interface.getDecorView(), window.getGravity(),
			window.getX(), window.getY());
		return;
	}
	let flags = this.getFlagsForWindow(window);
	this.manager.addView(content, window.getParams(flags));
};

WindowProvider.closeWindow = function(window) {
	if (!window) return;
	if (!window.isFocusable()) {
		let popupId = window.popupId,
			popup = this.getByPopupId(popupId);
		if (popup === null) return;
		popup.dismiss();
		delete this.attached[popupId];
		delete window.popupId;
		return;
	}
	this.manager.removeView(window.getContent());
};

WindowProvider.setEnterActor = function(popupId, actor, content) {
	if (android.os.Build.VERSION.SDK_INT >= 23) {
		let popup = this.getByPopupId(popupId);
		if (popup === null) return;
		if (actor.getActor) actor = actor.getActor();
		popup.setEnterTransition(actor);
	}
};

WindowProvider.setExitActor = function(popupId, actor, content) {
	if (android.os.Build.VERSION.SDK_INT >= 23) {
		let popup = this.getByPopupId(popupId);
		if (popup === null) return;
		if (actor.getActor) actor = actor.getActor();
		popup.setExitTransition(actor);
	}
};

WindowProvider.prepareActors = function(window, actor) {
	if (android.os.Build.VERSION.SDK_INT < 23) {
		if (actor && window && window.beginDelayedActor) {
			window.beginDelayedActor(actor);
		}
	}
};

WindowProvider.updateWindow = function(window) {
	if (!window) return;
	if (!window.isFocusable()) {
		let popupId = window.popupId,
			popup = this.getByPopupId(popupId);
		if (!popup) return;
		if (window.enterActor) {
			this.setEnterActor(popupId, window.enterActor);
		}
		if (window.exitActor) {
			this.setExitActor(popupId, window.exitActor);
		}
		popup.setContentView(window.getContent());
		popup.setTouchable(window.isTouchable());
		popup.setFocusable(window.isFocusable());
		popup.update(window.getX(), window.getY(),
			window.getWidth(), window.getHeight());
		return;
	}
	let flags = this.getFlagsForWindow(window);
	this.manager.updateViewLayout(window.getContent(), window.getParams(flags));
};

WindowProvider.destroy = function() {
	for (let item in this.attached) {
		this.attached[item].dismiss();
	}
	this.attached = new Object();
};

const UniqueHelper = new Object();

UniqueHelper.opened = new Object();

UniqueHelper.getWindow = function(window) {
	if (typeof window == "object") {
		window = window ? window.TYPE : null;
	}
	return this.opened[window] || null;
};

UniqueHelper.isAttached = function(window) {
	return !!this.getWindow(window);
};

UniqueHelper.prepareWindow = function(window) {
	if (this.isAttached(window)) {
		let opened = this.getWindow(window),
			updatable = opened.isUpdatable();
		// Window are already opened
		if (opened == window) {
			return false;
		}
		if (updatable) {
			let content = window.getContent();
			opened.setContent(content);
			opened.update();
			return false;
		}
		opened.dismiss();
		return this.prepareWindow(window);
	} else this.stackWindow(window);
	return true;
};

UniqueHelper.deattachWindow = function(window) {
	if (this.isAttached(window)) {
		let opened = this.getWindow(window);
		if (window == opened) {
			this.shiftWindow(window);
		}
		return true;
	}
	return window.isOpened();
};

UniqueHelper.stackWindow = function(window) {
	if (this.isAttached(window)) return;
	this.opened[window.TYPE] = window;
};

UniqueHelper.shiftWindow = function(window) {
	if (!this.isAttached(window)) return;
	delete this.opened[window.TYPE];
};

UniqueHelper.reattachWindow = function(window) {
	if (this.isAttached(window)) {
		window.dismiss();
		window.show();
		return true;
	}
	return false;
};

UniqueHelper.reattach = function() {
	for (let type in this.opened) {
		let window = this.getWindow(type);
		this.reattachWindow(window);
	}
};

UniqueHelper.requireDestroy = function() {
	for (let type in this.opened) {
		let window = this.getWindow(type);
		window.dismiss();
	}
};
