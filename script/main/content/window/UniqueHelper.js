/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */
const UniqueHelper = {};

UniqueHelper.opened = {};

UniqueHelper.getWindow = function(window) {
	if (window instanceof FocusableWindow) {
		window = window ? window.TYPE : null;
	}
	return this.opened[window] || null;
};

UniqueHelper.isAttached = function(window) {
	return this.getWindow(window) == window;
};

UniqueHelper.wasTypeAttached = function(window) {
	return Boolean(this.getWindow(window));
};

UniqueHelper.prepareWindow = function(window) {
	if (this.wasTypeAttached(window)) {
		let opened = this.getWindow(window),
			updatable = opened.isUpdatable();
		if (opened.isOpened()) {
			// Window are already opened
			if (opened == window) {
				return false;
			}
			if (updatable) {
				let content = window.getContainer();
				opened.setContent(content);
				opened.update();
				return false;
			}
			opened.dismiss();
		}
		this.shiftWindow(opened);
		return this.prepareWindow(window);
	} else this.stackWindow(window);
	return true;
};

UniqueHelper.deattachWindow = function(window) {
	if (this.wasTypeAttached(window)) {
		let opened = this.getWindow(window);
		if (window == opened) {
			this.shiftWindow(window);
		}
		return true;
	}
	return window.isOpened();
};

UniqueHelper.stackWindow = function(window) {
	if (this.wasTypeAttached(window)) return;
	this.opened[window.TYPE] = window;
};

UniqueHelper.shiftWindow = function(window) {
	if (!this.wasTypeAttached(window)) return;
	delete this.opened[window.TYPE];
};


UniqueHelper.requireDestroy = function() {
	for (let type in this.opened) {
		let window = this.getWindow(type);
		window.dismiss();
	}
};
