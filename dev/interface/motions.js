const ArcMotion = function() {
	this.reset();
};

ArcMotion.prototype = assign(ActorPathMotion.prototype);
ArcMotion.prototype.TYPE = "arc";

ArcMotion.prototype.reset = function() {
	this.motion = new android.transition.ArcMotion();
};

ArcMotion.prototype.getMaximumAngle = function() {
	return this.motion.getMaximumAngle();
};

ArcMotion.prototype.getMinimumHorizontalAngle = function() {
	return this.motion.getMinimumHorizontalAngle();
};

ArcMotion.prototype.getMinimumVerticalAngle = function() {
	return this.motion.getMinimumVerticalAngle();
};

ArcMotion.prototype.setMaximumAngle = function(angle) {
	this.motion.setMaximumAngle(angle || 0);
};

ArcMotion.prototype.setMinimumHorizontalAngle = function(angle) {
	this.motion.setMinimumHorizontalAngle(angle || 0);
};

ArcMotion.prototype.setMinimumVerticalAngle = function(angle) {
	this.motion.setMinimumVerticalAngle(angle || 0);
};

const PatternPathMotion = function() {
	this.reset();
};

PatternPathMotion.prototype = assign(ActorPathMotion.prototype);
PatternPathMotion.prototype.TYPE = "patternPath";

PatternPathMotion.prototype.reset = function() {
	this.motion = new android.transition.PatternPathMotion();
};

PatternPathMotion.prototype.getPatternPath = function() {
	return this.motion.getPatternPath();
};

PatternPathMotion.prototype.setPatternPath = function(path) {
	this.motion.setPatternPath(path || null);
};

const VisibilityPropagation = new Function();

VisibilityPropagation.prototype = assign(ActorPropagation.prototype);

const CircularPropagation = function() {
	this.reset();
};

CircularPropagation.prototype = assign(VisibilityPropagation.prototype);
CircularPropagation.prototype.TYPE = "circular";

CircularPropagation.prototype.reset = function() {
	this.propagation = new android.transition.CircularPropagation();
};

CircularPropagation.prototype.getPropagationSpeed = function() {
	return this.propagation.getPropagationSpeed();
};

CircularPropagation.prototype.setPropagationSpeed = function(speed) {
	this.propagation.setPropagationSpeed(speed);
};

const SidePropagation = function() {
	this.reset();
};

SidePropagation.prototype = assign(VisibilityPropagation.prototype);
SidePropagation.prototype.TYPE = "side";

SidePropagation.prototype.reset = function() {
	this.propagation = new android.transition.SidePropagation();
};

SidePropagation.prototype.getPropagationSpeed = function() {
	return this.propagation.getPropagationSpeed();
};

SidePropagation.prototype.getSide = function() {
	return this.propagation.getSide();
};

SidePropagation.prototype.setPropagationSpeed = function(speed) {
	this.propagation.setPropagationSpeed(speed);
};

SidePropagation.prototype.setSide = function(side) {
	this.propagation.setSide(side);
};

const AccelerateInterpolator = function(cycle) {
	this.reset(cycle);
};

AccelerateInterpolator.prototype = assign(ActorInterpolator.prototype);
AccelerateInterpolator.prototype.TYPE = "accelerate";

AccelerateInterpolator.prototype.reset = function(cycle) {
	if (typeof cycle == "undefined") {
		this.interpolator = new android.view.animation.AccelerateInterpolator();
	} else {
		this.interpolator = new android.view.animation.AccelerateInterpolator(cycle);
	}
};

const DecelerateInterpolator = function(cycle) {
	this.reset(cycle);
};

DecelerateInterpolator.prototype = assign(ActorInterpolator.prototype);
DecelerateInterpolator.prototype.TYPE = "decelerate";

DecelerateInterpolator.prototype.reset = function(cycle) {
	if (typeof cycle == "undefined") {
		this.interpolator = new android.view.animation.DecelerateInterpolator();
	} else {
		this.interpolator = new android.view.animation.DecelerateInterpolator(cycle);
	}
};

const AccelerateDecelerateInterpolator = function() {
	this.reset();
};

AccelerateDecelerateInterpolator.prototype = assign(ActorInterpolator.prototype);
AccelerateDecelerateInterpolator.prototype.TYPE = "accelerateDecelerate";

AccelerateDecelerateInterpolator.prototype.reset = function() {
	this.interpolator = new android.view.animation.AccelerateDecelerateInterpolator();
};

const AnticipateInterpolator = function(cycle) {
	this.reset(cycle);
};

AnticipateInterpolator.prototype = assign(ActorInterpolator.prototype);
AnticipateInterpolator.prototype.TYPE = "anticipate";

AnticipateInterpolator.prototype.reset = function(cycle) {
	if (typeof cycle == "undefined") {
		this.interpolator = new android.view.animation.AnticipateInterpolator();
	} else {
		this.interpolator = new android.view.animation.AnticipateInterpolator(cycle);
	}
};

const OvershootInterpolator = function(cycle) {
	this.reset(cycle);
};

OvershootInterpolator.prototype = assign(ActorInterpolator.prototype);
OvershootInterpolator.prototype.TYPE = "overshoot";

OvershootInterpolator.prototype.reset = function(cycle) {
	if (typeof cycle == "undefined") {
		this.interpolator = new android.view.animation.OvershootInterpolator();
	} else {
		this.interpolator = new android.view.animation.OvershootInterpolator(cycle);
	}
};

const AnticipateOvershootInterpolator = function(cycle1, cycle2) {
	this.reset(cycle1, cycle2);
};

AnticipateOvershootInterpolator.prototype = assign(ActorInterpolator.prototype);
AnticipateOvershootInterpolator.prototype.TYPE = "anticipateOvershoot";

AnticipateOvershootInterpolator.prototype.reset = function(cycle1, cycle2) {
	if (typeof cycle1 == "undefined" || typeof cycle2 == "undefined") {
		this.interpolator = new android.view.animation.AnticipateOvershootInterpolator();
	} else {
		this.interpolator = new android.view.animation.AnticipateOvershootInterpolator(cycle1, cycle2);
	}
};

const BounceInterpolator = function() {
	this.reset();
};

BounceInterpolator.prototype = assign(ActorInterpolator.prototype);
BounceInterpolator.prototype.TYPE = "bounce";

BounceInterpolator.prototype.reset = function() {
	this.interpolator = new android.view.animation.BounceInterpolator();
};

const PathInterpolator = function(path) {
	this.reset(psth);
};

PathInterpolator.prototype = assign(ActorInterpolator.prototype);
PathInterpolator.prototype.TYPE = "path";

PathInterpolator.prototype.reset = function(path) {
	if (!path) {
		throw Error("Can't create path interpolator without path");
	}
	this.interpolator = new android.view.animation.PathInterpolator(path);
	this.path = path;
};

PathInterpolator.prototype.getPath = function() {
	return this.path || null;
};

const CycleInterpolator = function(cycle) {
	this.reset(cycle);
};

CycleInterpolator.prototype = assign(ActorInterpolator.prototype);
CycleInterpolator.prototype.TYPE = "cycle";

CycleInterpolator.prototype.reset = function(cycle) {
	if (!cycle) {
		throw Error("Can't create cycle interpolator without cycle time");
	}
	this.interpolator = new android.view.animation.CycleInterpolator(cycle);
};

const LinearInterpolator = function() {
	this.reset();
};

LinearInterpolator.prototype = assign(ActorInterpolator.prototype);
LinearInterpolator.prototype.TYPE = "linear";

LinearInterpolator.prototype.reset = function() {
	this.interpolator = new android.view.animation.LinearInterpolator();
};

const FastOutLinearInInterpolator = function() {
	this.reset();
};

FastOutLinearInInterpolator.prototype = assign(ActorInterpolator.prototype);
FastOutLinearInInterpolator.prototype.TYPE = "fastOutLinearIn";

FastOutLinearInInterpolator.prototype.reset = function() {
	this.interpolator = new android.support.v4.view.animation.FastOutLinearInInterpolator();
};

const FastOutSlowInInterpolator = function() {
	this.reset();
};

FastOutSlowInInterpolator.prototype = assign(ActorInterpolator.prototype);
FastOutSlowInInterpolator.prototype.TYPE = "fastOutSlowIn";

FastOutSlowInInterpolator.prototype.reset = function() {
	this.interpolator = new android.support.v4.view.animation.FastOutSlowInInterpolator();
};

const LinearOutSlowInInterpolator = function() {
	this.reset();
};

LinearOutSlowInInterpolator.prototype = assign(ActorInterpolator.prototype);
LinearOutSlowInInterpolator.prototype.TYPE = "linearOutSlowIn";

LinearOutSlowInInterpolator.prototype.reset = function() {
	this.interpolator = new android.support.v4.view.animation.LinearOutSlowInInterpolator();
};
