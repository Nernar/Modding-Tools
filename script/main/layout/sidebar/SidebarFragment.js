const SidebarFragment = function() {
	BaseFragment.apply(this, arguments);
	this.resetContainer();
};

SidebarFragment.prototype = new BaseFragment;

SidebarFragment.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(getContext());
	this.setContainerView(container);

	let scrollItems = new android.widget.ScrollView(getContext());
	container.addView(scrollItems);

	let items = new android.widget.LinearLayout(getContext());
	items.setOrientation(Interface.Orientate.VERTICAL);
	items.setMinimumHeight(Interface.Display.HEIGHT);
	items.setTag("containerItems");
	scrollItems.addView(items);

	let scrollTabs = new android.widget.ScrollView(getContext());
	container.addView(scrollTabs);

	let tabs = new android.widget.LinearLayout(getContext());
	tabs.setOrientation(Interface.Orientate.VERTICAL);
	tabs.setMinimumHeight(Interface.Display.HEIGHT);
	tabs.setTag("containerTabs");
	scrollTabs.addView(tabs);
};

SidebarFragment.prototype.getItemContainer = function() {
	return this.findViewByTag("containerItems");
};

SidebarFragment.prototype.addItem = function(view, index) {
	let items = this.getItemContainer();
	if (items == null) return this;
	if (index >= 0) {
		items.addView(view, index);
	} else items.addView(view);
	return this;
};

SidebarFragment.prototype.clearItems = function() {
	let items = this.getItemContainer();
	if (items == null) return this;
	items.removeAllViews();
	return this;
};

SidebarFragment.prototype.removeItem = function(view) {
	let items = this.getItemContainer();
	if (items == null) return this;
	items.removeView(view);
	return this;
};

SidebarFragment.prototype.getItemAt = function(index) {
	let items = this.getItemContainer();
	if (items == null) return null;
	return items.getChildAt(index);
};

SidebarFragment.prototype.indexOfItem = function(view) {
	let items = this.getItemContainer();
	if (items == null) return -1;
	return items.indexOfChild(view);
};

SidebarFragment.prototype.getItemCount = function() {
	let items = this.getItemContainer();
	if (items == null) return -1;
	return items.getChildCount();
};

SidebarFragment.prototype.getTabContainer = function() {
	return this.findViewByTag("containerTabs");
};

SidebarFragment.prototype.getTabBackground = function() {
	return this.tabBackground || null;
};

SidebarFragment.prototype.setTabBackground = function(src) {
	let container = this.getTabContainer();
	if (container == null) return this;
	if (!(src instanceof Drawable)) {
		src = Drawable.parseJson.call(this, src);
	}
	src.attachAsBackground(container);
	this.tabBackground = src;
	return this;
};

SidebarFragment.prototype.addTab = function(view, index) {
	let tabs = this.getTabContainer();
	if (tabs == null) return this;
	if (index >= 0) {
		tabs.addView(view, index);
	} else tabs.addView(view);
	return this;
};

SidebarFragment.prototype.clearTabs = function() {
	let tabs = this.getTabContainer();
	if (tabs == null) return this;
	tabs.removeAllViews();
	return this;
};

SidebarFragment.prototype.removeTab = function(view) {
	let tabs = this.getTabContainer();
	if (tabs == null) return this;
	tabs.removeView(view);
	return this;
};

SidebarFragment.prototype.getTabAt = function(index) {
	let tabs = this.getTabContainer();
	if (tabs == null) return null;
	return tabs.getChildAt(index);
};

SidebarFragment.prototype.indexOfTab = function(view) {
	let tabs = this.getTabContainer();
	if (tabs == null) return -1;
	return tabs.indexOfChild(view);
};

SidebarFragment.prototype.getTabCount = function() {
	let tabs = this.getTabContainer();
	if (tabs == null) return -1;
	return tabs.getChildCount();
};

SidebarFragment.Group = function() {
	ImageFragment.apply(this, arguments);
	this.resetContainer();
};

SidebarFragment.Group.prototype = new ImageFragment;

SidebarFragment.Group.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(getContext());
	container.setMinimumHeight(Interface.getY(178));
	container.setGravity(Interface.Gravity.CENTER);
	let params = new android.widget.LinearLayout.
	LayoutParams(Interface.Display.WRAP, Interface.Display.MATCH);
	if (menuDividers) params.topMargin = Interface.getY(2);
	params.weight = 1.;
	container.setLayoutParams(params);
	this.setContainerView(container);

	let icon = new android.widget.ImageView(getContext());
	icon.setLayoutParams(new android.widget.LinearLayout.LayoutParams(Interface.getY(54), Interface.getY(81)));
	icon.setScaleType(Interface.Scale.CENTER_CROP);
	icon.setPadding(Interface.getY(42), 0, 0, 0);
	icon.setTag("groupImage")
	container.addView(icon);
};

SidebarFragment.Group.prototype.getImageView = function() {
	return this.findViewByTag("groupImage");
};

SidebarFragment.Group.prototype.setImage = function(src) {
	let container = this.getContainer();
	if (container == null) return this;
	if (src !== null && typeof src == "object") {
		Interface.setTransitionName(container, src.bitmap + "Group");
	} else Interface.setTransitionName(container, src + "Group");
	return ImageFragment.prototype.setImage.apply(this, arguments);
};

SidebarFragment.Group.Item = function() {
	ImageFragment.apply(this, arguments);
	this.resetContainer();
};

SidebarFragment.Group.Item.prototype = new ImageFragment;

SidebarFragment.Group.Item.prototype.resetContainer = function() {
	let container = new android.widget.ImageView(getContext());
	container.setLayoutParams(new android.widget.LinearLayout.LayoutParams(Interface.getY(81), Interface.getY(81)));
	container.setPadding(Interface.getY(12), Interface.getY(12), Interface.getY(12), Interface.getY(12));
	this.setContainerView(container);
};

SidebarFragment.Group.Item.prototype.getImageView = function() {
	return this.getContainer();
};

SidebarFragment.Group.Item.prototype.setImage = function(src) {
	let container = this.getContainer();
	if (container == null) return this;
	if (src !== null && typeof src == "object") {
		Interface.setTransitionName(container, src.bitmap + "Item");
	} else Interface.setTransitionName(container, src + "Item");
	return ImageFragment.prototype.setImage.apply(this, arguments);
};

SidebarFragment.Group.Item.prototype.getTitle = function() {
	return this.title || null;
};

SidebarFragment.Group.Item.prototype.setTitle = function(title) {
	let container = this.getContainer();
	if (container == null) return this;
	// TODO
	this.title = title;
	return this;
};
