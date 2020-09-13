const WindowProvider = {
	attached: new Object(),
	manager: context.getSystemService("window"),
	BASE_WINDOW_FLAGS: isHorizon ? 256 : 0,
	getFlagsForWindow: function(window) {
		let flags = isInstant ? 0 : this.BASE_WINDOW_FLAGS;
		if (!window) return flags;
        if (!window.isTouchable()) flags |= 16;
        else if (!window.isFullscreen()) flags |= 32;
        if (window.isFullscreen()) return flags | 2;
        return flags;
	},
	prepareIdentifier: function(window) {
		if (window.popupId) return window.popupId;
		window.popupId = Ui.makeViewId();
		return window.popupId;
	},
	hasOpenedPopup: function(window) {
		let id = window.popupId;
		if (!id) return false;
		return !!this.getByPopupId(id);
	},
	getByPopupId: function(popupId) {
		if (!popupId) return null;
		return this.attached[popupId] || null;
	},
	openWindow: function(window) {
		if (!window) return;
		let content = window.getContent();
		if (isHorizon && !isInstant)
			content.setSystemUiVisibility(5894);
		if (!window.isFocusable()) {
			if (this.hasOpenedPopup(window)) return;
			let popup = new android.widget.PopupWindow(content,
					window.getWidth(), window.getHeight()),
				popupId = this.prepareIdentifier(window);
			this.attached[popupId] = popup;
			popup.setAttachedInDecor(isHorizon && !isInstant);
			popup.setTouchable(window.isTouchable());
			window.enterActor && this.setEnterActor
				(popupId, window.enterActor);
			window.exitActor && this.setExitActor
				(popupId, window.exitActor);
			popup.showAtLocation(Ui.getDecorView(), window.getGravity(),
							window.getX(), window.getY());
			return;
		}
		let flags = this.getFlagsForWindow(window);
		this.manager.addView(content, window.getParams(flags));
	},
	closeWindow: function(window) {
		if (!window) return;
		if (!window.isFocusable()) {
			let popupId = window.popupId,
				popup = this.getByPopupId(popupId);
			if (!popup) return;
			popup.dismiss();
			delete this.attached[popupId];
			delete window.popupId;
			return;
		}
		this.manager.removeView(window.getContent());
	},
	setEnterActor: function(popupId, actor) {
		let popup = this.getByPopupId(popupId);
		if (!popup) return;
		if (actor instanceof WindowActor) actor = actor.getActor();
		popup.setEnterTransition(actor);
	},
	setExitActor: function(popupId, actor) {
		let popup = this.getByPopupId(popupId);
		if (!popup) return;
		if (actor instanceof WindowActor) actor = actor.getActor();
		popup.setExitTransition(actor);
	},
	prepareActors: function(window) {
		if (!window) return;
		if (!window.isFocusable()) return;
		if (!showedFocusableAnimationsHint) {
			showHint(translate("Focusable windows doesn't have actors at moment"));
			showedFocusableAnimationsHint = true;
		}
	},
	updateWindow: function(window) {
		if (!window) return;
		if (!window.isFocusable()) {
			let popupId = window.popupId,
				popup = this.getByPopupId(popupId);
			if (!popup) {
				return;
			}
			window.enterActor && this.setEnterActor
				(popupId, window.enterActor);
			window.exitActor && this.setExitActor
				(popupId, window.exitActor);
			popup.setTouchable(window.isTouchable());
			popup.setFocusable(window.isFocusable());
			if (window.getContent() != popup.getContentView()) {
				this.closeWindow(window);
				this.openWindow(window);
				return;
			}
			popup.update(window.getX(), window.getY(),
				window.getWidth(), window.getHeight());
			return;
		}
		let flags = this.getFlagsForWindow(window);
		this.manager.updateViewLayout(window.getContent(), window.getParams(flags));
	},
	destroy: function() {
		for (let i in this.attached) {
			this.attached[i].dismiss();
		}
		this.attached = new Object();
	}
};
