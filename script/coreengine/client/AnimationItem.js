function AnimationItem(x, y, z) {
	return null;
}
var USE_ALTERNATIVE_ITEM_MODEL = false;
var AnimationItemLoadHelper = {};
AnimationItemLoadHelper.postedAnimations = [];
AnimationItemLoadHelper.postRequired = false;
AnimationItemLoadHelper.session = 1;
AnimationItemLoadHelper.onLevelDisplayed = function() {
	return null;
};
AnimationItemLoadHelper.onLevelLeft = function() {
	return null;
};
AnimationItemLoadHelper.handleItemDescribeRequest = function(anim, item) {
	return false;
};
