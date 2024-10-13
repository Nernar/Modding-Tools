/**
 * @type
 */
const TransitionWindow = function() {
	FocusableWindow.apply(this, arguments);
	if (isAndroid()) {
		this.resetWindow.apply(this, arguments);
	}
};

TransitionWindow.prototype = new FocusableWindow;
TransitionWindow.prototype.TYPE = "TransitionWindow";

TransitionWindow.prototype.resetWindow = function() {
	this.manager = new android.transition.TransitionManager();
	this.root = this.makeRoot();
	this.nothing = this.makeRootScene();
};

TransitionWindow.prototype.getContainer = function() {
	return this.root || null;
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.setTransition = function(sceneFromOrTo, sceneToOrTransition, actor) {
	return this.manager.setTransition(sceneFromOrTo, sceneToOrTransition, actor);
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.transitionTo = function(scene, actor) {
	if (actor) {
		android.transition.TransitionManager.go(scene, actor);
	} else this.manager.transitionTo(scene);
	if (scene != this.getRootScene()) {
		this.scene = scene;
	} else delete this.scene;
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.beginDelayedTransition = function(containerOrTransition, actor) {
	let root = this.getContainer();
	if (root == null) return;
	android.transition.TransitionManager.beginDelayedTransition(actor ? containerOrTransition : root, actor || containerOrTransition);
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.endTransitions = function(container) {
	if (android.os.Build.VERSION.SDK_INT >= 23) {
		let root = this.getContainer();
		if (root == null) return;
		android.transition.TransitionManager.endTransitions(container || root);
	}
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.makeScene = function(rootOrContainer, container) {
	let root = this.getContainer();
	if (root == null) return null;
	return new android.transition.Scene(container ? rootOrContainer : root, container || rootOrContainer);
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.findScene = function(container) {
	if (android.os.Build.VERSION.SDK_INT >= 29) {
		let scene = this.getRootScene();
		if (scene == null) return null;
		return scene.getCurrentScene(container);
	}
	return null;
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.makeRoot = function() {
	return new FrameFragment().getContainer();
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.makeRootScene = function() {
	let scene = this.getRootScene();
	if (scene === null) return scene;
	return this.makeScene(this.makeRoot());
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.getRootScene = function() {
	return this.nothing || null;
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.hasScene = function(scene) {
	return this.manager.hasScene(scene);
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.getCurrentlyScene = function() {
	return this.scene || null;
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.getContainerOfScene = function() {
	return this.containerOfScene || null;
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.hasContainerScene = function() {
	return !!this.getContainerOfScene();
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.makeContainerScene = function() {
	let container = this.getLayout();
	if (container === null) return container;
	let root = this.getContainer();
	if (root === null) return root;
	return this.makeScene(root, container);
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.getContainerScene = function() {
	let container = this.getLayout();
	if (!this.hasContainerScene() || this.getContainerOfScene() != container) {
		this.containerScene = this.makeContainerScene();
		this.containerOfScene = container;
	}
	return this.containerScene || null;
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.getAvailabledScene = function() {
	return this.getContainerScene() || this.getCurrentlyScene() || null;
};

/**
 * @requires `isAndroid()`
 */
TransitionWindow.prototype.getCurrentlyContainer = function() {
	let root = this.getContainer();
	if (root !== null) {
		if (root instanceof android.view.ViewGroup) {
			if (root.getChildCount() > 0) {
				return root.getChildAt(0);
			}
		}
	}
	return null;
};

TransitionWindow.prototype.update = function() {
	if (this.isOpened()) {
		if (this.containerScene !== undefined) {
			if (this.getLayout() != this.getContainerOfScene()) {
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
