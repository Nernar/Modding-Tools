const ControlButton = function() {
	this.reset();
	this.setBackground("popupButton");

	let actor = new FadeActor();
	actor.setInterpolator(new AccelerateDecelerateInterpolator());
	actor.setDuration(400);
	this.setEnterActor(actor);

	actor = new SlideActor(Interface.Gravity.LEFT);
	actor.setInterpolator(new AccelerateInterpolator());
	actor.setDuration(400);
	this.setExitActor(actor);
};

ControlButton.prototype = new UniqueWindow;
ControlButton.prototype.TYPE = "ControlButton";

ControlButton.prototype.unclose = true;

ControlButton.prototype.reset = function() {
	let scope = this,
		views = this.views = new Object();
	let content = new android.widget.FrameLayout(context);
	this.setContent(content);

	views.layout = new android.widget.LinearLayout(context);
	views.layout.setOrientation(Interface.Orientate.VERTICAL);
	views.layout.setOnClickListener(function(view) {
		scope.isCloseableOutside() && scope.dismiss();
		scope.__click && scope.__click();
	});
	let params = android.widget.FrameLayout.LayoutParams(Interface.Display.WRAP, Interface.Display.WRAP);
	params.setMargins(Interface.getY(20), Interface.getY(20), 0, 0);
	content.addView(views.layout, params);

	views.button = new android.widget.ImageView(context);
	views.button.setPadding(Interface.getY(15), Interface.getY(15), Interface.getY(15), Interface.getY(15));
	params = android.widget.LinearLayout.LayoutParams(Interface.getY(100), Interface.getY(100));
	views.layout.addView(views.button, params);
};

ControlButton.prototype.setBackground = function(src) {
	this.views && this.views.layout &&
		this.views.layout.setBackgroundDrawable(ImageFactory.getDrawable(src));
};

ControlButton.prototype.setIcon = function(src) {
	this.views && this.views.button &&
		this.views.button.setImageDrawable(ImageFactory.getDrawable(src));
};

ControlButton.prototype.setOnClickListener = function(listener) {
	this.__click = function() {
		tryout(listener);
	};
};

ControlButton.prototype.isCloseableOutside = function() {
	return this.unclose;
};

ControlButton.prototype.setCloseableOutside = function(state) {
	this.unclose = !!state;
};

const ControlWindow = function() {
	UniqueWindow.call(this);
	this.setFragment(new FrameFragment());
	this.resetContent();
};

ControlWindow.prototype = new UniqueWindow;
ControlWindow.prototype.TYPE = "ControlWindow";

ControlWindow.prototype.resetContent = function() {
	let button = new ControlFragment.Button(),
		collapsed = new ControlFragment.CollapsedButton(),
		queued = new ControlFragment.Logotype();
	this.button = button;
	this.collapsed = collapsed;
	this.queued = queued;
	let instance = this;
	button.setOnClickListener(function() {
		instance.onClick && instance.onClick(instance);
		if (instance.isHideableInside()) instance.hide();
	});
	collapsed.setOnClickListener(function() {
		instance.transformButton();
	});
	button.setOnHoldListener(function() {
		instance.transformCollapsedButton();
		return true;
	});
	this.setButtonBackground("popupButton");
	let behold = this.makeScene(button.getContainer()),
		collapse = this.makeScene(collapsed.getContainer()),
		queue = this.makeScene(queued.getContainer());
	this.behold = behold;
	this.collapse = collapse;
	this.queue = queue;
	let minimize = this.getCollapseActor();
	this.setActor(behold, collapse, minimize);
	this.setActor(collapse, behold, minimize);
	let transform = this.getTransformActor();
	this.setActor(behold, queue, transform);
	this.setActor(behold, collapse, transform);
	let actor = this.getTransformActor();
	actor.addListener({
		onTransitionStart: function() {
			tryout(function() {
				if (instance.isMayTouched()) {
					UniqueWindow.prototype.setTouchable.call(instance, false);
				}
				instance.setWidth(Interface.Display.MATCH);
				instance.setHeight(Interface.Display.MATCH);
				instance.setButtonBackground(null);
			});
		},
		onTransitionEnd: function() {
			tryout(function() {
				if (instance.isMayTouched()) {
					UniqueWindow.prototype.setTouchable.call(instance, true);
				}
				instance.setWidth(Interface.Display.WRAP);
				instance.setHeight(Interface.Display.WRAP);
				instance.setButtonBackground("popupButton");
			});
		}
	});
	this.setActor(queue, behold, actor);
	this.setActor(queue, collapse, actor);
};

ControlWindow.prototype.getButtonFragments = function() {
	let array = new Array();
	if (this.button) array.push(this.button);
	if (this.collapsed) array.push(this.collapsed);
	return array;
};

ControlWindow.prototype.getLogotypeFragment = function() {
	return this.queued || null;
};

ControlWindow.prototype.getBeholdScene = function() {
	return this.behold || null;
};

ControlWindow.prototype.getCollapseScene = function() {
	return this.collapse || null;
};

ControlWindow.prototype.getQueueScene = function() {
	return this.queue || null;
};

ControlWindow.prototype.getButtonEnterActor = function() {
	let actor = new FadeActor();
	actor.setInterpolator(new AccelerateDecelerateInterpolator());
	actor.setDuration(400);
	return actor;
};

ControlWindow.prototype.getButtonExitActor = function() {
	let actor = new SlideActor(Interface.Gravity.LEFT);
	actor.setInterpolator(new AccelerateInterpolator());
	actor.setDuration(400);
	return actor;
};

ControlWindow.prototype.getLogotypeEnterActor = function() {
	let actor = new FadeActor();
	actor.setInterpolator(new DecelerateInterpolator());
	actor.setDuration(2000);
	return actor;
};

ControlWindow.prototype.getLogotypeExitActor = function() {
	let actor = new FadeActor();
	actor.setInterpolator(new AccelerateInterpolator());
	actor.setDuration(500);
	return actor;
};

ControlWindow.prototype.getTransformActor = function() {
	let actor = new ActorSet(),
		bounds = new BoundsActor();
	bounds.setInterpolator(new AccelerateDecelerateInterpolator());
	bounds.setDuration(1000);
	actor.addActor(bounds);
	let transform = new TransformActor();
	transform.setInterpolator(new AccelerateDecelerateInterpolator());
	transform.setDuration(1000);
	actor.addActor(transform);
	return actor;
};

ControlWindow.prototype.getCollapseActor = function() {
	let actor = new TransformActor();
	actor.setInterpolator(new AccelerateDecelerateInterpolator());
	actor.setDuration(600);
	return actor;
};

ControlWindow.prototype.level = 10000;

ControlWindow.prototype.getLevel = function() {
	return this.level !== undefined ? this.level : 10000;
};

ControlWindow.prototype.setLevel = function(level) {
	if (level == this.getLevel()) return;
	this.level = preround(level, 0);
	if (this.isOpened()) this.updateLevel();
};

ControlWindow.prototype.orientate = 2;

ControlWindow.prototype.getOrientation = function() {
	return this.orientate !== undefined ? this.orientate : 2;
};

ControlWindow.prototype.setOrientation = function(orientate) {
	this.orientate = preround(Number(orientate), 0);
	if (this.isOpened()) this.updateProgress();
};

ControlWindow.prototype.getProgress = function() {
	return preround(this.getLevel() / 100, 2);
};

ControlWindow.prototype.setProgress = function(progress) {
	this.setLevel(Number(progress) * 100);
};

ControlWindow.prototype.getIcon = function() {
	let fragment = this.getFragment();
	if (fragment === null) return null;
	return fragment.getIcon();
};

ControlWindow.prototype.getForegroundIcon = function() {
	return this.foregroundIcon || null;
};

ControlWindow.prototype.setForegroundIcon = function(src) {
	if (ImageFactory.isLoaded(src)) {
		this.foregroundIcon = src;
		if (this.isOpened()) this.updateProgress();
	}
};

ControlWindow.prototype.getBackgroundIcon = function() {
	return this.backgroundIcon || null;
};

ControlWindow.prototype.setBackgroundIcon = function(src) {
	if (ImageFactory.isLoaded(src)) {
		this.backgroundIcon = src;
		if (this.isOpened()) this.updateProgress();
	}
};

ControlWindow.prototype.updateProgress = function(force) {
	let fragment = this.getLogotypeFragment();
	if (fragment === null) return false;
	let drawable = ImageFactory.clipAndMerge(this.getBackgroundIcon(), this.getForegroundIcon(), this.getLevel(), this.getOrientation());
	fragment.setIcon(drawable);
	if (drawable instanceof android.graphics.drawable.ClipDrawable) {
		if (!force) return this.updateLevel();
	}
	return true;
};

ControlWindow.prototype.updateLevel = function() {
	let fragment = this.getLogotypeFragment();
	if (fragment === null) return false;
	if (this.getBackgroundIcon() !== null && this.getForegroundIcon() !== null) {
		this.updateProgress(true);
	} else if (this.getBackgroundIcon() !== null) {
		fragment.setLevel(10001 - this.getLevel());
	} else fragment.setLevel(this.getLevel());
	return true;
};

ControlWindow.prototype.setButtonIcon = function(src) {
	let founded = this.getButtonFragments();
	for (let i = 0; i < founded.length; i++) {
		founded[i].setIcon(src);
	}
};

ControlWindow.prototype.setButtonBackground = function(src) {
	let founded = this.getButtonFragments();
	for (let i = 0; i < founded.length; i++) {
		founded[i].setBackground(src);
	}
};

ControlWindow.prototype.setLogotypeBackground = function(src) {
	let fragment = this.getLogotypeFragment();
	if (fragment === null) return;
	fragment.setBackground(src);
};

ControlWindow.prototype.setOnClickListener = function(action) {
	if (typeof action != "function") {
		return delete this.onClick;
	}
	this.onClick = function() {
		tryout(action);
	};
	return true;
};

ControlWindow.prototype.isHideableInside = function() {
	return this.unclose !== undefined ? this.unclose : false;
};

ControlWindow.prototype.setHideableInside = function(enabled) {
	this.unclose = Boolean(enabled);
};

ControlWindow.prototype.mayTouched = true;

ControlWindow.prototype.isMayTouched = function() {
	return this.mayTouched !== undefined ? this.mayTouched : false;
};

ControlWindow.prototype.setTouchable = function(enabled) {
	this.mayTouched = Boolean(enabled);
	UniqueWindow.prototype.setTouchable.call(this, enabled);
};

ControlWindow.prototype.transformButton = function() {
	this.actorTo(this.getBeholdScene());
	this.setEnterActor(this.getButtonEnterActor());
	this.setExitActor(this.getButtonExitActor());
};

ControlWindow.prototype.transformCollapsedButton = function() {
	this.actorTo(this.getCollapseScene());
	this.setEnterActor(this.getButtonEnterActor());
	this.setExitActor(this.getButtonExitActor());
};

ControlWindow.prototype.transformLogotype = function() {
	this.actorTo(this.getQueueScene());
	this.setEnterActor(this.getLogotypeEnterActor());
	this.setExitActor(this.getLogotypeExitActor());
	if (this.isMayTouched()) UniqueWindow.prototype.setTouchable.call(this, false);
};

ControlWindow.prototype.show = function() {
	if (this.getBackgroundIcon() !== null || this.getForegroundIcon() !== null) {
		this.updateProgress();
	}
	UniqueWindow.prototype.show.call(this);
};
