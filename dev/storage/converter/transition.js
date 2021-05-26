const TransitionConverter = new Function();

TransitionConverter.prototype = assign(ScriptConverter.prototype);
TransitionConverter.prototype.TYPE = "transition";

TransitionConverter.prototype.process = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		throw Error("TransitionConverter can process only non-null Object instances");
	}
	let result = this.result = new Array();
	if (obj.define) {
		let define = this.buildDefine(obj);
		define && result.push(define);
	}
	if (obj.animation) {
		let animation = this.buildAnimation(obj);
		animation && result.push(animation);
	}
	let callback = this.buildCallback(obj);
	callback && result.push(callback);
	return this.getCurrentlyReaded();
};

TransitionConverter.prototype.getAndAttachWorker = function() {
	if (!this.worker) {
		this.worker = new TransitionWorker();
	}
	return this.worker;
};

TransitionConverter.prototype.buildCallback = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		return null;
	}
	let result = new Array();
	result.push("Callback.addCallback(\"" + (isHorizon ? "LevelDisplayed" : "LevelLoaded") + "\", function() {");
	let define = obj.define, entity = define ? define.entity : undefined;
	if (define && entity == getPlayerEnt()) {
		result.push("\ttransition.withEntity(Player.get());");
	}
	result.push("\ttransition.start();");
	result.push("});")
	return result.length > 0 ? result.join("\n") : null;
};

TransitionConverter.prototype.buildDefine = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		return null;
	}
	let define = obj.define, result = new Array();
	if (!define) return null;
	result.push("let transition = new Transition();");
	if (define.starting !== undefined) {
		result.push("transition.withFrom(" + this.buildFrame(define.starting) + ");");
	}
	if (define.entity != getPlayerEnt()) {
		result.push("transition.withEntity(" + define.entity + ");");
	}
	if (define.fps !== undefined) {
		result.push("transition.setFramesPerSecond(" + define.fps + ");");
	}
	return result.length > 0 ? result.join("\n") : null;
};

TransitionConverter.prototype.buildAnimation = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		return null;
	}
	let animation = obj.animation, result = new Array();
	if (!animation) return null;
	for (let i = 0; i < animation.length; i++) {
		let animate = animation[i];
		if (!animate) continue;
		if (i > 0) result.push(new String());
		let frames = this.buildAnimate(animate.frames);
		if (frames) result.push(frames);
	}
	return result.length > 0 ? result.join("\n") : null;
};

TransitionConverter.prototype.buildAnimate = function(animate) {
	if (!animate || !Array.isArray(animate)) {
		return null;
	}
	let result = new Array();
	for (let i = 0; i < animate.length; i++) {
		let frame = animate[i];
		if (!frame) continue;
		result.push("transition.addFrame(" + this.buildFrame(frame) + ");");
	}
	return result.length > 0 ? result.join("\n") : null;
};

TransitionConverter.prototype.resolveInterpolator = function(number) {
	for (let item in Transition.Interpolator) {
		if (Transition.Interpolator[item] == number) {
			return "Transition.Interpolator." + item;
		}
	}
	return "Transition.Interpolator.LINEAR";
};

TransitionConverter.prototype.buildFrame = function(frame) {
	return MathUtils.mathDivider(frame.x) + ", " + MathUtils.mathDivider(frame.y) + ", " + MathUtils.mathDivider(frame.z) +
		(frame.yaw !== undefined ? ", " + MathUtils.mathDivider(frame.yaw) : new String()) +
		(frame.pitch !== undefined ? ", " + MathUtils.mathDivider(frame.pitch) : new String()) +
		(frame.duration !== undefined ? ", " + frame.duration : new String()) +
		(frame.interpolator !== undefined ? ", " + this.resolveInterpolator(frame.interpolator) : new String());
};
