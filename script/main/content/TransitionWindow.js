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
	return !!this.containerScene;
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
	if (this.isOpened()) {
		if (this.containerScene !== undefined) {
			if (this.getContainer() != this.getContainerOfScene()) {
				this.transitionTo(this.getAvailabledScene());
			}
		}
	}
	FocusableWindow.prototype.update.apply(this, arguments);
};

TransitionWindow.prototype.attach = function() {
	let availabled = this.getAvailabledScene();
	if (availabled !== null) {
		let transition = this.getEnterTransition();
		this.transitionTo(availabled, transition);
	}
	FocusableWindow.prototype.attach.apply(this, arguments);
};

TransitionWindow.prototype.dismiss = function() {
	FocusableWindow.prototype.dismiss.apply(this, arguments);
	let availabled = this.getRootScene();
	if (availabled !== null) {
		let transition = this.getExitTransition();
		this.transitionTo(availabled, transition);
	}
};

TransitionWindow.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof TransitionWindow)) {
		json = instanceOrJson;
		instanceOrJson = new TransitionWindow();
	}
	instanceOrJson = FocusableWindow.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	return instanceOrJson;
};

registerWindowJson("transition", TransitionWindow);
