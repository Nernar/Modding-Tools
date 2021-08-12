const ActoredWindow = function() {
	FocusableWindow.apply(this, arguments);
	this.resetWindow();
};

ActoredWindow.prototype = new FocusableWindow;
ActoredWindow.prototype.TYPE = "ActoredWindow";

ActoredWindow.prototype.resetWindow = function() {
	this.manager = new ActorManager();
	this.root = this.makeRoot();
	this.nothing = this.makeRootScene();
};

ActoredWindow.prototype.hasScene = function(scene) {
	return this.manager.hasScene(scene);
};

ActoredWindow.prototype.setActor = function(sceneFromOrTo, sceneToOrActor, actor) {
	return this.manager.setActor(sceneFromOrTo, sceneToOrActor, actor);
};

ActoredWindow.prototype.actorTo = function(scene, actor) {
	if (actor) {
		ActorManager.go(scene, actor);
	} else this.manager.actorTo(scene);
	if (scene != this.getRootScene()) {
		this.scene = scene;
	} else delete this.scene;
};

ActoredWindow.prototype.getCurrentlyScene = function() {
	return this.scene || null;
};

ActoredWindow.prototype.beginDelayedActor = function(containerOrActor, actor) {
	let content = this.getContent();
	if (content == null) return;
	ActorManager.beginDelayedActor(actor ? containerOrActor : content, actor || containerOrActor);
};

ActoredWindow.prototype.endActors = function(container) {
	let content = this.getContent();
	if (content == null) return;
	ActorManager.endActors(container || content);
};

ActoredWindow.prototype.makeScene = function(rootOrContainer, container) {
	let content = this.getContent();
	if (content == null) return null;
	return new ActorScene(container ? rootOrContainer : content, container || rootOrContainer);
};

ActoredWindow.prototype.findScene = function(container) {
	let scene = this.getRootScene();
	if (scene == null) return null;
	return scene.getCurrentScene(container);
};

ActoredWindow.prototype.getContent = function() {
	return this.root || null;
};

ActoredWindow.prototype.getContainer = function() {
	return FocusableWindow.prototype.getContent.apply(this, arguments);
};

ActoredWindow.prototype.makeContainerScene = function() {
	let container = this.getContainer();
	if (container === null) return container;
	let root = this.getContent();
	if (root === null) return root;
	return this.makeScene(root, container);
};

ActoredWindow.prototype.getContainerScene = function() {
	if (!this.hasContainerScene() || this.containerScene.getContainer() != this.getContainer()) {
		this.containerScene = this.makeContainerScene();
	}
	return this.containerScene || null;
};

ActoredWindow.prototype.hasContainerScene = function() {
	return Boolean(this.containerScene);
};

ActoredWindow.prototype.makeRoot = function() {
	return new FrameFragment().getContainer();
};

ActoredWindow.prototype.makeRootScene = function() {
	let container = this.getContent();
	if (container === null) return container;
	return this.makeScene(this.makeRoot());
};

ActoredWindow.prototype.getRootScene = function() {
	return this.nothing || null;
};

ActoredWindow.prototype.getCurrentlyContainer = function() {
	let content = this.getContent();
	if (content !== null) {
		if (content instanceof android.view.ViewGroup) {
			if (content.getChildCount() > 0) {
				return content.getChildAt(0);
			}
		}
	}
	return null;
};

ActoredWindow.prototype.getAvailabledScene = function() {
	return this.getContainerScene() || this.getCurrentlyScene() || null;
};

ActoredWindow.prototype.update = function() {
	if (!this.inDestructing() && this.isOpened()) {
		if (this.containerScene !== undefined) {
			if (this.getContainer() != this.containerScene.getContainer()) {
				this.actorTo(this.getAvailabledScene());
			}
		}
	}
	FocusableWindow.prototype.update.apply(this, arguments);
};

ActoredWindow.prototype.setEnterActor = function(actor) {
	this.enterActor = actor;
};

ActoredWindow.prototype.show = function(force) {
	delete this.destructing;
	if (!force) this.attach();
	let availabled = this.getAvailabledScene();
	if (availabled !== null) {
		let enter = this.getEnterActor();
		this.actorTo(availabled, enter);
	}
	if (this.isTouchable()) {
		this.setTouchable(true);
	}
	this.onShow && this.onShow();
};

ActoredWindow.prototype.setOnShowListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onShow;
	}
	this.onShow = function() {
		tryout(listener);
	};
	return true;
};

ActoredWindow.prototype.setExitActor = function(actor) {
	this.exitActor = actor;
	if (actor) {
		let enter = this.getEnterActor();
		if (actor == enter) {
			MCSystem.throwException("You wouldn't use one actor for exit and enter");
		}
		let instance = this;
		actor.addListener({
			onTransitionEnd: function() {
				tryout(function() {
					if (instance.inDestructing()) {
						instance.dismiss();
						delete instance.destructing;
					}
				});
			}
		})
	}
};

ActoredWindow.prototype.hide = function() {
	if (this.isOpened()) {
		let availabled = this.getRootScene();
		if (availabled !== null) {
			let exit = this.getExitActor();
			this.actorTo(availabled, exit);
			this.destructing = true;
		} else this.dismiss();
		let touchable = this.isTouchable();
		this.setTouchable(false);
		this.touchable = touchable;
		this.onHide && this.onHide();
	}
};

ActoredWindow.prototype.setOnHideListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onHide;
	}
	this.onHide = function() {
		tryout(listener);
	};
	return true;
};

ActoredWindow.prototype.inDestructing = function() {
	return Boolean(this.destructing);
};

const UniqueWindow = function() {
	ActoredWindow.apply(this, arguments);
	if (UniqueHelper.wasTypeAttached(this)) {
		let window = UniqueHelper.getWindow(this);
		if (!window.inDestructing()) return window;
	}
	return this;
};

UniqueWindow.prototype = new ActoredWindow;
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
		ActoredWindow.prototype.attach.apply(this, arguments);
	}
};

UniqueWindow.prototype.show = function() {
	this.attach();
	if (UniqueHelper.isAttached(this)) {
		ActoredWindow.prototype.show.call(this, true);
	}
};

UniqueWindow.prototype.dismiss = function() {
	if (UniqueHelper.deattachWindow(this)) {
		ActoredWindow.prototype.dismiss.apply(this, arguments);
	}
};

const FocusablePopup = function() {
	ActoredWindow.apply(this, arguments);
	let fadeIn = new FadeActor(),
		fadeOut = new FadeActor();
	fadeIn.setInterpolator(new DecelerateInterpolator());
	fadeIn.setDuration(400);
	this.setEnterActor(fadeIn);
	fadeOut.setInterpolator(new AccelerateDecelerateInterpolator());
	fadeOut.setDuration(400);
	this.setExitActor(fadeOut);

	let place = Popups.getAvailablePlace();
	this.setX(place.x), this.setY(place.y);
	this.setGravity(Interface.Gravity.LEFT | Interface.Gravity.TOP);

	this.reset();
};

FocusablePopup.prototype = new ActoredWindow;
FocusablePopup.prototype.TYPE = "FocusablePopup";

FocusablePopup.prototype.reset = function() {
	let views = this.views = new Object();
	views.layout = new android.widget.LinearLayout(context);
	new BitmapDrawable("popup").attachAsBackground(views.layout);
	views.layout.setOrientation(Interface.Orientate.VERTICAL);
	this.setContent(views.layout);

	views.title = new findEditorPackage().widget.ToneTypingTextView(context);
	views.title.setPadding(Interface.getY(30), Interface.getY(18), Interface.getY(30), Interface.getY(18));
	new BitmapDrawable("popup").attachAsBackground(views.title);
	views.title.setTextSize(Interface.getFontSize(24));
	views.title.setGravity(Interface.Gravity.CENTER);
	views.title.setTextColor(Interface.Color.WHITE);
	views.title.setTypeface(typeface);
	let instance = this;
	views.title.setOnTouchListener(function(view, event) {
		return tryoutSafety(function() {
			return instance.handleTouch(event);
		}, false);
	});
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = 0.1;
	views.layout.addView(views.title, params);

	views.scroll = new android.widget.ScrollView(context);
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = 16.0;
	views.layout.addView(views.scroll, params);

	views.content = new android.widget.LinearLayout(context);
	views.content.setOrientation(Interface.Orientate.VERTICAL);
	views.content.setGravity(Interface.Gravity.CENTER);
	views.scroll.addView(views.content);
};

FocusablePopup.prototype.handleTouch = function(event) {
	switch (event.getAction()) {
		case 0:
			if (this.isMayDragged()) {
				this.dx = event.getX();
				this.dy = event.getY();
			}
			if (this.isMayCollapsed() || !this.isExpanded()) {
				if (this.expandable && this.expandable.isActive()) {
					if (this.expand) {
						this.expand();
						// ProjectProvider.getProject().updatePopupExpanded(this.name, this.isExpanded());
					}
					this.expandable.destroy();
				} else {
					if (this.expandable) {
						this.expandable.destroy();
					}
					this.expandable = new Action(500);
					this.expandable.create().run();
				}
			}
			if (this.isMayDismissed()) {
				if (this.closeable) {
					this.closeable.destroy();
				}
				this.closeable = new Action(750);
				this.closeable.create().run();
			}
			break;
		case 1:
			if (this.isMayDismissed()) {
				if (this.closeable && this.closeable.getThread() && this.closeable.getLeftTime() == 0) {
					this.closeable.destroy();
					Popups.closeIfOpened(this.name);
				} // else ProjectProvider.getProject().updatePopupLocation(this.name, event.getRawX() - this.dx, event.getRawY() - this.dy);
			}
			break;
		case 2:
			let x = event.getX() - this.dx,
				y = event.getY() - this.dy;
			if (this.isMayDragged()) {
				this.setX(event.getRawX() - this.dx);
				this.setY(event.getRawY() - this.dy);
				this.update();
			}
			if (x > 0 || y > 0) {
				if (this.closeable) {
					this.closeable.destroy();
				}
				if (this.expandable) {
					this.expandable.destroy();
				}
			}
			break;
	}
	return true;
};

FocusablePopup.prototype.setTitle = function(title) {
	this.views.title.setText(title);
};

FocusablePopup.prototype.expanded = true;

FocusablePopup.prototype.isExpanded = function() {
	return this.expanded;
};

FocusablePopup.prototype.expand = function() {
	if (this.isExpanded()) {
		this.minimize();
	} else this.maximize();
};

FocusablePopup.prototype.minimize = function() {
	let actor = new FadeActor();
	actor.setDuration(200);
	this.beginDelayedActor(actor);
	this.views.scroll.setVisibility(Interface.Visibility.GONE);
	this.expanded = false;
};

FocusablePopup.prototype.maximize = function() {
	let actor = new FadeActor();
	actor.setDuration(400);
	this.beginDelayedActor(actor);
	this.views.scroll.setVisibility(Interface.Visibility.VISIBLE);
	this.expanded = true;
};

FocusablePopup.prototype.mayDismissed = true;

FocusablePopup.prototype.isMayDismissed = function() {
	return this.mayDismissed;
};

FocusablePopup.prototype.setIsMayDismissed = function(enabled) {
	this.mayDismissed = Boolean(enabled);
};

FocusablePopup.prototype.mayCollapsed = true;

FocusablePopup.prototype.isMayCollapsed = function() {
	return this.mayCollapsed;
};

FocusablePopup.prototype.setIsMayCollapsed = function(enabled) {
	this.mayCollapsed = Boolean(enabled);
};

FocusablePopup.prototype.mayDragged = true;

FocusablePopup.prototype.isMayDragged = function() {
	return this.mayDragged;
};

FocusablePopup.prototype.setIsMayDragged = function(enabled) {
	this.mayDragged = Boolean(enabled);
};
