const SidebarFragment = function() {
	Fragment.call(this);
	this.resetContainer();
};

SidebarFragment.prototype = assign(Fragment.prototype);

SidebarFragment.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(context);
	container.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
	this.setContainerView(container);
	
	let scrollItems = new android.widget.ScrollView(context);
	container.addView(scrollItems);
	
	let items = new android.widget.LinearLayout(context);
	items.setOrientation(Ui.Orientate.VERTICAL);
	items.setMinimumHeight(Ui.Display.HEIGHT);
	items.setTag("containerItems");
	scrollItems.addView(items);
	
	let scrollTabs = new android.widget.ScrollView(context);
	if (!menuDividers) scrollTabs.setBackgroundDrawable
		(ImageFactory.getDrawable("popupBackground"));
	container.addView(scrollTabs);
	
	let tabs = new android.widget.LinearLayout(context);
	tabs.setOrientation(Ui.Orientate.VERTICAL);
	tabs.setMinimumHeight(Ui.Display.HEIGHT);
	tabs.setTag("containerTabs");
	scrollTabs.addView(tabs);
};

SidebarFragment.prototype.getItemContainer = function() {
	return this.findViewByTag("containerItems");
};

SidebarFragment.prototype.getTabContainer = function() {
	return this.findViewByTag("containerTabs");
};

SidebarFragment.Group = function() {
	Fragment.call(this);
	this.resetContainer();
};

SidebarFragment.Group.prototype = assign(Fragment.prototype);

SidebarFragment.Group.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(context);
	container.setMinimumHeight(Ui.getY(178));
	container.setGravity(Ui.Gravity.CENTER);
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.Display.WRAP, Ui.Display.MATCH);
	if (menuDividers) params.topMargin = Ui.getY(2);
	params.weight = 1.0;
	container.setLayoutParams(params);
	this.setContainerView(container);
	
	let icon = new android.widget.ImageView(context);
	icon.setLayoutParams(new android.widget.LinearLayout.
		LayoutParams(Ui.getY(54), Ui.getY(81)));
	icon.setScaleType(Ui.Scale.CENTER_CROP);
	icon.setPadding(Ui.getY(42), 0, 0, 0);
	icon.setTag("groupIcon")
	container.addView(icon);
};

SidebarFragment.Group.prototype.getIconView = function() {
	return this.findViewByTag("groupIcon");
};

SidebarFragment.Group.Item = function() {
	Fragment.call(this);
	this.resetContainer();
};

SidebarFragment.Group.Item.prototype = assign(Fragment.prototype);

SidebarFragment.Group.Item.prototype.resetContainer = function() {
	let container = new android.widget.ImageView(context);
	container.setLayoutParams(new android.widget.LinearLayout.
		LayoutParams(Ui.getY(81), Ui.getY(81)));
	container.setPadding(Ui.getY(12), Ui.getY(12), Ui.getY(12), Ui.getY(12));
	this.setContainerView(container);
};
