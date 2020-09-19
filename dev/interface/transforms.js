const BoundsActor = function() {
	this.reset();
};
BoundsActor.prototype = new WindowActor;
BoundsActor.prototype.TYPE = "bounds";
BoundsActor.prototype.reset = function() {
	this.transition = new android.transition.ChangeBounds();
};
BoundsActor.prototype.getReparent = function() {
	return this.transition.getReparent();
};
BoundsActor.prototype.getResizeClip = function() {
	return this.transition.getResizeClip();
};
BoundsActor.prototype.setReparent = function(enabled) {
	this.transition.setReparent(!!enabled);
};
BoundsActor.prototype.setResizeClip = function(enabled) {
	this.transition.setResizeClip(!!enabled);
};

const ClipBoundsActor = function() {
	this.reset();
};
ClipBoundsActor.prototype = new WindowActor;
ClipBoundsActor.prototype.TYPE = "clipBounds";
ClipBoundsActor.prototype.reset = function() {
	this.transition = new android.transition.ChangeClipBounds();
};

const ImageTransformActor = function() {
	this.reset();
};
ImageTransformActor.prototype = new WindowActor;
ImageTransformActor.prototype.TYPE = "imageTransform";
ImageTransformActor.prototype.reset = function() {
	this.transition = new android.transition.ChangeImageTransform();
};

const ScrollActor = function() {
	this.reset();
};
ScrollActor.prototype = new WindowActor;
ScrollActor.prototype.TYPE = "scroll";
ScrollActor.prototype.reset = function() {
	this.transition = new android.transition.ChangeScroll();
};

const TransformActor = function() {
	this.reset();
};
TransformActor.prototype = new WindowActor;
TransformActor.prototype.TYPE = "transform";
TransformActor.prototype.reset = function() {
	this.transition = new android.transition.ChangeTransform();
};
TransformActor.prototype.getReparent = function() {
	return this.transition.getReparent();
};
TransformActor.prototype.getReparentWithOverlay = function() {
	return this.transition.getReparentWithOverlay();
};
TransformActor.prototype.setReparent = function(enabled) {
	this.transition.setReparent(!!enabled);
};
TransformActor.prototype.setReparentWithOverlay = function(enabled) {
	this.transition.setReparentWithOverlay(!!enabled);
};

const VisibilityActor = new Function();
VisibilityActor.prototype = new WindowActor;
VisibilityActor.prototype.getMode = function() {
	return this.transition.getMode();
};
VisibilityActor.prototype.setMode = function(mode) {
	this.transition.setMode(mode || VisibilityActor.OUT);
};
VisibilityActor.IN = android.transition.Visibility.MODE_IN;
VisibilityActor.OUT = android.transition.Visibility.MODE_OUT;

const SlideActor = function(side) {
	this.reset(side);
};
SlideActor.prototype = new VisibilityActor;
SlideActor.prototype.TYPE = "slide";
SlideActor.prototype.reset = function(side) {
	if (typeof side == "undefined") this.transition = new android.transition.Slide();
	else this.transition = new android.transition.Slide(side);
};
SlideActor.prototype.getSlideEdge = function() {
	return this.transition.getSlideEdge();
};
SlideActor.prototype.setSlideEdge = function(side) {
	this.transition.setSlideEdge(side || Ui.Gravity.NO);
};
SlideActor.IN = VisibilityActor.IN;
SlideActor.OUT = VisibilityActor.OUT;

const ExplodeActor = function() {
	this.reset();
};
ExplodeActor.prototype = new VisibilityActor;
ExplodeActor.prototype.TYPE = "explode";
ExplodeActor.prototype.reset = function() {
	this.transition = new android.transition.Explode();
};
ExplodeActor.IN = VisibilityActor.IN;
ExplodeActor.OUT = VisibilityActor.OUT;

const FadeActor = function(mode) {
	this.reset(mode);
};
FadeActor.prototype = new VisibilityActor;
FadeActor.prototype.TYPE = "fade";
FadeActor.prototype.reset = function(mode) {
	if (typeof mode == "undefined") this.transition = new android.transition.Fade();
	else this.transition = new android.transition.Fade(mode);
};
FadeActor.IN = android.transition.Fade.IN;
FadeActor.OUT = android.transition.Fade.OUT;

const ActorSet = function() {
	this.reset();
};
ActorSet.prototype = new WindowActor;
ActorSet.prototype.TYPE = "set";
ActorSet.prototype.reset = function() {
	this.transition = new android.transition.TransitionSet();
};
ActorSet.getActorAt = function(index) {
	if (index < 0) return null;
	return this.transition.getTransitionAt(index);
};
ActorSet.getActorCount = function() {
	return this.transition.getTransitionCount();
};
ActorSet.prototype.addActor = function(actor) {
	if (actor instanceof WindowActor) {
		if (actor.TYPE == "none") MCSystem.throwException("ActorSet can't use empty actor");
		this.transition.addTransition(actor.getActor());
	} else this.transition.addTransition(actor);
};
ActorSet.prototype.removeActor = function(actor) {
	if (actor instanceof WindowActor) {
		if (actor.TYPE == "none") MCSystem.throwException("ActorSet can't remove empty actor");
		this.transition.removeTransition(actor.getActor());
	} else this.transition.removeTransition(actor);
};
ActorSet.prototype.setOrdering = function(mode) {
	this.transition.setOrdering(mode || 0);
};
ActorSet.SEQUENTIAL = android.transition.TransitionSet.ORDERING_SEQUENTIAL;
ActorSet.TOGETHER = android.transition.TransitionSet.ORDERING_TOGETHER;

const AutoActor = function() {
	this.reset();
};
AutoActor.prototype = new ActorSet;
AutoActor.prototype.TYPE = "auto";
AutoActor.prototype.reset = function() {
	this.transition = new android.transition.AutoTransition();
};
AutoActor.SEQUENTIAL = ActorSet.SEQUENTIAL;
AutoActor.TOGETHER = ActorSet.TOGETHER;
