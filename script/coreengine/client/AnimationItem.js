function AnimationItem(x, y, z) {}
var USE_ALTERNATIVE_ITEM_MODEL = false;
var AnimationItemLoadHelper = {};
AnimationItemLoadHelper.postedAnimations = [];
AnimationItemLoadHelper.postRequired = false;
AnimationItemLoadHelper.session = 1;
AnimationItemLoadHelper.onLevelDisplayed = function() {};
AnimationItemLoadHelper.onLevelLeft = function() {};
AnimationItemLoadHelper.handleItemDescribeRequest = function(anim, item) {};
