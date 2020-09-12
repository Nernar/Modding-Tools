const ActoredWindow = function() {
	this.reset();
};
ActoredWindow.prototype = new FocusableWindow();
ActoredWindow.prototype.TYPE = "ActoredWindow";
ActoredWindow.prototype.reset = function() {
	this.manager = new ActorManager();
};
ActoredWindow.prototype.hasScene = function(scene) {
	return this.manager.hasScene(scene);
};
ActoredWindow.prototype.setActor = function(sceneFromOrTo, sceneToOrActor, actor) {
	return this.manager.setActor(sceneFromOrTo, sceneToOrActor, actor);
};
ActoredWindow.prototype.actorTo = function(scene) {
	this.manager.actorTo(scene);
};
ActoredWindow.prototype.beginDelayedActor = function(containerOrActor, actor) {
	ActorManager.beginDelayedActor(actor ? containerOrActor : this.content, actor || containerOrActor);
};
ActoredWindow.prototype.endActors = function(container) {
	ActorManager.endActors(container || this.content);
};
ActoredWindow.prototype.makeScene = function(rootOrContainer, container) {
	return new ActorScene(rootOrContainer || this.content, container);
};

const UniqueWindow = new Function();
UniqueWindow.prototype = new ActoredWindow();
UniqueWindow.prototype.TYPE = "UniqueWindow";
UniqueWindow.prototype.isAttached = function() {
	return UniqueHelper.isAttached(this);
};
UniqueWindow.prototype.canBeOpened = function() {
	return !this.isOpened();
};
UniqueWindow.prototype.updatable = false;
UniqueWindow.prototype.isUpdatable = function() {
	return this.updatable;
};
UniqueWindow.prototype.setIsUpdatable = function(enabled) {
	this.updatable = !!enabled;
};
UniqueWindow.prototype.__showUW = UniqueWindow.prototype.show;
UniqueWindow.prototype.show = function() {
	if (UniqueHelper.prepareWindow(this))
		this.__showUW && this.__showUW();
};
UniqueWindow.prototype.__dismissUW = UniqueWindow.prototype.dismiss;
UniqueWindow.prototype.dismiss = function() {
	if (UniqueHelper.deattachWindow(this))
		this.__dismissUW && this.__dismissUW();
};

const UniqueHelper = {
	opened: new Object(),
	getWindow: function(window) {
		if (typeof window == "object")
			window = window ? window.TYPE : null;
		return this.opened[window] || null;
	},
	isAttached: function(window) {
		return !!this.getWindow(window);
	},
	prepareWindow: function(window) {
		if (this.isAttached(window)) {
			let opened = this.getWindow(window),
				updatable = opened.isUpdatable();
			// Window are already opened
			if (opened == window) return false;
			if (updatable) {
				let content = window.getContent();
				opened.setContent(content);
				opened.update();
				return false;
			} else {
				opened.dismiss();
				return this.prepareWindow(window);
			}
		} else this.stackWindow(window);
		return true;
	},
	deattachWindow: function(window) {
		if (this.isAttached(window)) {
			let opened = this.getWindow(window),
				updatable = opened.isUpdatable();
			this.shiftWindow(window);
			if (window != opened) {
				opened.dismiss();
				return false;
			} else return true;
		}
		return false;
	},
	stackWindow: function(window) {
		if (this.isAttached(window)) return;
		this.opened[window.TYPE] = window;
	},
	shiftWindow: function(window) {
		if (!this.isAttached(window)) return;
		delete this.opened[window.TYPE];
	}
};
