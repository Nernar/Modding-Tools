/**
 * @requires `isAndroid()`
 */
const SidebarWindow = function() {
	return UniqueWindow.apply(this, arguments);
};

SidebarWindow.prototype = new UniqueWindow;
SidebarWindow.prototype.TYPE = "SidebarWindow";

SidebarWindow.prototype.resetWindow = function() {
	UniqueWindow.prototype.resetWindow.apply(this, arguments);
	this.setGravity($.Gravity.RIGHT);
	this.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);

	let fragment = new SidebarFragment();
	this.setFragment(fragment);

	let enter = new android.transition.Slide($.Gravity.RIGHT);
	enter.setInterpolator(new android.view.animation.DecelerateInterpolator());
	enter.setDuration(400);
	this.setEnterTransition(enter);

	let exit = new android.transition.Slide($.Gravity.RIGHT);
	exit.setInterpolator(new android.view.animation.BounceInterpolator());
	exit.setDuration(1000);
	this.setExitTransition(exit);
};

SidebarWindow.prototype.getSelected = function() {
	return this.getFragment().getSelected();
};

SidebarWindow.prototype.isSelected = function() {
	return this.getFragment().isSelected();
};

SidebarWindow.prototype.reinflateLayout = function() {
	return this.getFragment().reinflateLayout();
};

SidebarWindow.isSelected = function(group) {
	let currently = UniqueHelper.getWindow("SidebarWindow");
	return currently != null && currently.getSelected() == group;
};

SidebarWindow.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof SidebarWindow)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarWindow();
	}
	SidebarFragment.parseJson.call(this, instanceOrJson.getFragment(), json);
	return instanceOrJson;
};
