const WindowActor = new Function();

WindowActor.prototype.TYPE = "none";

WindowActor.prototype.listeners = new Array();

WindowActor.prototype.getActor = function() {
	return this.transition || null;
};

WindowActor.prototype.addListener = function(listener) {
	this.transition.addListener(listener);
	return this.listeners.push(listener) - 1;
};

WindowActor.prototype.getListener = function(listener) {
	if (typeof listener != "number") {
		listener = this.listeners.indexOf(listener);
	}
	return listener > 0 ? this.listeners[listener] || null : null;
};

WindowActor.prototype.hasListener = function(listener) {
	return !!this.getListener(listener);
};

WindowActor.prototype.removeListener = function(listener) {
	if (!listener) {
		return;
	}
	if (typeof listener == "number") {
		listener = this.getListener(listener);
	}
	this.transition.removeListener(listener);
	let index = this.listeners.indexOf(listener);
	if (index > -1) {
		this.listeners.splice(index, 1);
	}
};

WindowActor.prototype.addTarget = function(target) {
	this.transition.addTarget(target);
};

WindowActor.prototype.excludeChildren = function(group, exclude) {
	this.transition.excludeChildren(group, exclude);
};

WindowActor.prototype.excludeTarget = function(target, exclude) {
	this.transition.excludeTarget(target, exclude);
};

WindowActor.prototype.removeTarget = function(target) {
	this.transition.removeTarget(target);
};

WindowActor.prototype.canRemoveViews = function() {
	return this.transition.canRemoveViews();
};

WindowActor.prototype.setEpicenterCallback = function(listener) {
	this.transition.setEpicenterCallback(listener ? function(transition) {
		return tryout(function() {
			return listener(transition);
		}, null);
	} : null);
};

WindowActor.prototype.setDuration = function(ms) {
	this.transition.setDuration(ms >= 0 ? ms : 0);
};

WindowActor.prototype.setStartDelay = function(ms) {
	this.transition.setStartDelay(ms >= 0 ? ms : 0);
};

WindowActor.prototype.setInterpolator = function(interpolator) {
	if (interpolator.getInterpolator) {
		if (interpolator.TYPE == "none") {
			MCSystem.throwException("WindowActor can't use empty interpolator");
		}
		this.transition.setInterpolator(interpolator.getInterpolator());
		this.interpolator = interpolator;
	} else {
		this.transition.setInterpolator(interpolator);
	}
};

WindowActor.prototype.setPathMotion = function(motion) {
	if (motion.getPathMotion) {
		if (motion.TYPE == "none") {
			MCSystem.throwException("Abstract class ActorPathMotion can't be reached");
		}
		this.transition.setPathMotion(motion.getPathMotion());
		this.motion = motion;
	} else {
		this.transition.setPathMotion(motion);
	}
};

WindowActor.prototype.setPropagation = function(propagation) {
	if (propagation.getPropagation) {
		if (propagation.TYPE == "none") {
			MCSystem.throwException("Abstract class ActorPropagation can't be reached");
		}
		this.transition.setPropagation(propagation.getPropagation());
		this.propagation = propagation;
	} else {
		this.transition.setPropagation(propagation);
	}
};

WindowActor.prototype.setMatchOrder = function(order) {
	this.transition.setMatchOrder(order);
};

WindowActor.prototype.beginDelayedActor = function(container) {
	ActorManager.beginDelayedActor(container, this);
};

const ActorInterpolator = new Function();

ActorInterpolator.prototype.TYPE = "none";

ActorInterpolator.prototype.getInterpolator = function() {
	return this.interpolator || null;
};

const ActorPathMotion = new Function();

ActorPathMotion.prototype.TYPE = "none";

ActorPathMotion.prototype.getPathMotion = function() {
	return this.motion || null;
};

const ActorPropagation = new Function();

ActorPropagation.prototype.TYPE = "none";

ActorPropagation.prototype.getPropagation = function() {
	return this.propagation || null;
};

const ActorScene = function(root, container) {
	this.reset(root, container);
};

ActorScene.prototype.reset = function(root, container) {
	if (container !== undefined) {
		this.scene = new android.transition.Scene(root, container);
		this.container = container;
	} else this.scene = new android.transition.Scene(root);
};

ActorScene.prototype.getScene = function() {
	return this.scene || null;
};

ActorScene.prototype.getSceneRoot = function() {
	return this.scene.getSceneRoot();
};

ActorScene.prototype.getContainer = function() {
	return this.container || null;
};

ActorScene.prototype.setContainer = function(container) {
	this.container = container;
	this.scene = this.getCurrentScene(container);
};

ActorScene.prototype.getCurrentScene = function(container) {
	return this.scene.getCurrentScene(container);
};

ActorScene.prototype.setEnterAction = function(listener) {
	this.scene.setEnterAction(listener ? function() {
		tryout(listener);
	} : null);
};

ActorScene.prototype.setExitAction = function(listener) {
	this.scene.setExitAction(listener ? function() {
		tryout(listener);
	} : null);
};

ActorScene.prototype.enter = function() {
	this.scene.enter();
};

ActorScene.prototype.go = function(actor) {
	ActorManager.go(this.scene, actor);
};

ActorScene.prototype.exit = function() {
	this.scene.exit();
};

ActorScene.getCurrentScene = function(root, container) {
	let scene = new ActorScene(root);
	scene.setContainer(container);
	return scene;
};

const ActorManager = function() {
	this.reset();
};

ActorManager.prototype.reset = function() {
	this.manager = new android.transition.TransitionManager();
	this.scenes = new Array();
};

ActorManager.prototype.hasScene = function(scene) {
	if (scene instanceof ActorScene) scene = scene.getScene();
	return this.scenes.indexOf(scene) != -1;
};

ActorManager.prototype.setActor = function(sceneFromOrTo, sceneToOrActor, actor) {
	if (sceneFromOrTo.getScene) {
		sceneFromOrTo = sceneFromOrTo.getScene();
	}
	if (sceneToOrActor.getActor) {
		sceneToOrActor = sceneToOrActor.getActor();
	} else if (sceneToOrActor.getScene) {
		sceneToOrActor = sceneToOrActor.getScene();
	}
	if (actor instanceof WindowActor) {
		actor = actor.getActor();
	}
	if (!actor) {
		this.manager.setTransition(sceneFromOrTo, sceneToOrActor);
	} else {
		this.manager.setTransition(sceneFromOrTo, sceneToOrActor, actor);
	}
	let sceneTo = actor ? sceneToOrActor : sceneFromOrTo;
	return this.hasScene(sceneTo) ? this.scenes.indexOf(sceneTo) : this.scenes.push(sceneTo) - 1;
};

ActorManager.prototype.actorTo = function(scene) {
	if (scene && scene.getScene) {
		scene = scene.getScene();
	} else if (typeof scene == "number") {
		scene = this.scenes[scene];
	}
	this.manager.transitionTo(scene);
};

ActorManager.beginDelayedActor = function(container, actor) {
	if (!container) {
		MCSystem.throwException("Unable to use delayed actor on undefined");
	}
	if (actor && actor.getActor) {
		actor = actor.getActor();
	}
	android.transition.TransitionManager.beginDelayedTransition(container, actor);
};

ActorManager.endActors = function(container) {
	if (!container) {
		MCSystem.throwException("Can't end actors without container");
	}
	if (android.os.Build.VERSION.SDK_INT >= 23) {
		android.transition.TransitionManager.endTransitions(container);
	}
};

ActorManager.go = function(scene, actor) {
	if (!scene) {
		MCSystem.throwException("ActorManager.go can't be resolved without ActorScene");
	}
	if (scene && scene.getScene) {
		scene = scene.getScene();
	}
	if (actor && actor.getActor) {
		actor = actor.getActor();
	}
	android.transition.TransitionManager.go(scene, actor);
};
