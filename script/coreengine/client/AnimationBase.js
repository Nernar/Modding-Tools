function AnimationBase(x, y, z) {}
var AnimationRegistry = {};
AnimationRegistry.animationList = [];
AnimationRegistry.resetEngine = function() {};
AnimationRegistry.registerAnimation = function(anim) {};
AnimationRegistry.getEntityArray = function() {
	return null;
};
AnimationRegistry.onAttack = function(victim) {
	/* TypeError: Cannot read property "entity" from undefined */
};
var ANIMATION_BASE_ENTITY = 10;
