const TransitionWindow = function() {
	FocusableWindow.apply(this, arguments);
	this.resetWindow();
};

TransitionWindow.prototype = new FocusableWindow;
TransitionWindow.prototype.TYPE = "TransitionWindow";

TransitionWindow.prototype.resetWindow = function() {
	this.manager = new android.transition.TransitionManager();
	this.root = this.makeRoot();
	this.nothing = this.makeRootScene();
};

TransitionWindow.prototype.hasScene = function(scene) {
	return this.manager.hasScene(scene);
};

TransitionWindow.prototype.setTransition = function(sceneFromOrTo, sceneToOrTransition, actor) {
	return this.manager.setTransition(sceneFromOrTo, sceneToOrTransition, actor);
};

TransitionWindow.prototype.transitionTo = function(scene, actor) {
	if (actor) {
		android.transition.TransitionManager.go(scene, actor);
	} else this.manager.transitionTo(scene);
	if (scene != this.getRootScene()) {
		this.scene = scene;
	} else delete this.scene;
};

TransitionWindow.prototype.getCurrentlyScene = function() {
	return this.scene || null;
};

TransitionWindow.prototype.beginDelayedTransition = function(containerOrTransition, actor) {
	let content = this.getContent();
	if (content == null) return;
	android.transition.TransitionManager.beginDelayedTransition(actor ? containerOrTransition : content, actor || containerOrTransition);
};

TransitionWindow.prototype.endTransitions = function(container) {
	if (android.os.Build.VERSION.SDK_INT >= 23) {
		let content = this.getContent();
		if (content == null) return;
		android.transition.TransitionManager.endTransitions(container || content);
	}
};

TransitionWindow.prototype.makeScene = function(rootOrContainer, container) {
	let content = this.getContent();
	if (content == null) return null;
	return new android.transition.Scene(container ? rootOrContainer : content, container || rootOrContainer);
};

TransitionWindow.prototype.findScene = function(container) {
	if (android.os.Build.VERSION.SDK_INT >= 29) {
		let scene = this.getRootScene();
		if (scene == null) return null;
		return scene.getCurrentScene(container);
	}
	return null;
};

TransitionWindow.prototype.getContent = function() {
	return this.root || null;
};

TransitionWindow.prototype.getContainer = function() {
	return FocusableWindow.prototype.getContent.apply(this, arguments);
};

TransitionWindow.prototype.makeContainerScene = function() {
	let container = this.getContainer();
	if (container === null) return container;
	let root = this.getContent();
	if (root === null) return root;
	return this.makeScene(root, container);
};

TransitionWindow.prototype.getContainerScene = function() {
	let container = this.getContainer();
	if (!this.hasContainerScene() || this.getContainerOfScene() != container) {
		this.containerScene = this.makeContainerScene();
		this.containerOfScene = container;
	}
	return this.containerScene || null;
};

TransitionWindow.prototype.getContainerOfScene = function() {
	return this.containerOfScene || null;
};

TransitionWindow.prototype.hasContainerScene = function() {
	return Boolean(this.containerScene);
};

TransitionWindow.prototype.makeRoot = function() {
	return new FrameFragment().getContainer();
};

TransitionWindow.prototype.makeRootScene = function() {
	let container = this.getContent();
	if (container === null) return container;
	return this.makeScene(this.makeRoot());
};

TransitionWindow.prototype.getRootScene = function() {
	return this.nothing || null;
};

TransitionWindow.prototype.getCurrentlyContainer = function() {
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

TransitionWindow.prototype.getAvailabledScene = function() {
	return this.getContainerScene() || this.getCurrentlyScene() || null;
};

TransitionWindow.prototype.update = function() {
	if (!this.inDestructing() && this.isOpened()) {
		if (this.containerScene !== undefined) {
			if (this.getContainer() != this.getContainerOfScene()) {
				this.transitionTo(this.getAvailabledScene());
			}
		}
	}
	FocusableWindow.prototype.update.apply(this, arguments);
};

TransitionWindow.prototype.setEnterTransition = function(actor) {
	this.enterTransition = actor;
};

TransitionWindow.prototype.show = function(force) {
	delete this.destructing;
	if (!force) this.attach();
	let availabled = this.getAvailabledScene();
	if (availabled !== null) {
		let enter = this.getEnterTransition();
		this.transitionTo(availabled, enter);
	}
	if (this.isTouchable()) {
		this.setTouchable(true);
	}
	this.onShow && this.onShow();
};

TransitionWindow.prototype.setOnShowListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onShow;
	}
	this.onShow = function() {
		tryout(listener);
	};
	return true;
};

TransitionWindow.prototype.setExitTransition = function(actor) {
	this.exitTransition = actor;
	if (actor) {
		let enter = this.getEnterTransition();
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

TransitionWindow.prototype.hide = function() {
	if (this.isOpened()) {
		let availabled = this.getRootScene();
		if (availabled !== null) {
			let exit = this.getExitTransition();
			this.destructing = true;
			this.transitionTo(availabled, exit);
		} else this.dismiss();
		let touchable = this.isTouchable();
		this.setTouchable(false);
		this.touchable = touchable;
		this.onHide && this.onHide();
	}
};

TransitionWindow.prototype.setOnHideListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onHide;
	}
	this.onHide = function() {
		tryout(listener);
	};
	return true;
};

TransitionWindow.prototype.inDestructing = function() {
	return Boolean(this.destructing);
};

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

const FocusablePopup = function() {
	TransitionWindow.apply(this, arguments);
	let fadeIn = new android.transition.Fade(),
		fadeOut = new android.transition.Fade();
	fadeIn.setInterpolator(new android.view.animation.DecelerateInterpolator());
	fadeIn.setDuration(400);
	this.setEnterTransition(fadeIn);
	fadeOut.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
	fadeOut.setDuration(400);
	this.setExitTransition(fadeOut);

	let place = Popups.getAvailablePlace();
	this.setX(place.x);
	this.setY(place.y);
	this.setGravity(Interface.Gravity.LEFT | Interface.Gravity.TOP);

	this.reset();
};

FocusablePopup.prototype = new TransitionWindow;
FocusablePopup.prototype.TYPE = "FocusablePopup";

FocusablePopup.prototype.reset = function() {
	let views = this.views = {};
	views.layout = new android.widget.LinearLayout(context);
	new BitmapDrawable("popup").attachAsBackground(views.layout);
	views.layout.setOrientation(Interface.Orientate.VERTICAL);
	this.setContent(views.layout);

	views.title = new android.widget.TextView(context);
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
	params.weight = .1;
	views.layout.addView(views.title, params);

	views.scroll = new android.widget.ScrollView(context);
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = 16.;
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
	let actor = new android.transition.Fade();
	actor.setDuration(200);
	this.beginDelayedTransition(actor);
	this.views.scroll.setVisibility(Interface.Visibility.GONE);
	this.expanded = false;
};

FocusablePopup.prototype.maximize = function() {
	let actor = new android.transition.Fade();
	actor.setDuration(400);
	this.beginDelayedTransition(actor);
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
