const UniqueWindow = function() {
	TransitionWindow.apply(this, arguments);
	if (UniqueHelper.wasTypeAttached(this)) {
		let window = UniqueHelper.getWindow(this);
		if (!window.inDestructing()) return window;
	}
	return this;
};

UniqueWindow.prototype = new TransitionWindow;
UniqueWindow.prototype.TYPE = "UniqueWindow";
UniqueWindow.prototype.updatable = true;

UniqueWindow.prototype.isAttached = function() {
	return UniqueHelper.isAttached(this);
};

UniqueWindow.prototype.canBeOpened = function() {
	return !this.isOpened();
};

UniqueWindow.prototype.isUpdatable = function() {
	return this.updatable;
};

UniqueWindow.prototype.setIsUpdatable = function(enabled) {
	this.updatable = !!enabled;
};

UniqueWindow.prototype.attach = function() {
	if (UniqueHelper.prepareWindow(this)) {
		TransitionWindow.prototype.attach.apply(this, arguments);
	}
};

UniqueWindow.prototype.showInternal = function() {
	// java.lang.IllegalStateException
	tryout.call(this, function() {
		this.attach();
	});
	if (UniqueHelper.isAttached(this)) {
		TransitionWindow.prototype.show.call(this, true);
		return true;
	}
	return false;
};

UniqueWindow.prototype.show = function() {
	if (!this.inDestructing()) {
		return this.showInternal();
	}
	handleThread.call(this, function() {
		while (this.inDestructing()) {
			java.lang.Thread.yield();
		}
		handle.call(this, function() {
			return this.showInternal();
		});
	});
	return false;
};

UniqueWindow.prototype.dismiss = function() {
	if (UniqueHelper.deattachWindow(this)) {
		TransitionWindow.prototype.dismiss.apply(this, arguments);
	}
};
