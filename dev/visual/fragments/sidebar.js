const SidebarFragment = function() {
	Fragment.apply(this, arguments);
	this.resetContainer();
};

SidebarFragment.prototype = new Fragment;

SidebarFragment.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(context);
	container.setBackgroundDrawable(ImageFactory.getDrawable("popup"));
	this.setContainerView(container);

	let scrollItems = new android.widget.ScrollView(context);
	container.addView(scrollItems);

	let items = new android.widget.LinearLayout(context);
	items.setOrientation(Interface.Orientate.VERTICAL);
	items.setMinimumHeight(Interface.Display.HEIGHT);
	items.setTag("containerItems");
	scrollItems.addView(items);

	let scrollTabs = new android.widget.ScrollView(context);
	if (!menuDividers) scrollTabs.setBackgroundDrawable(ImageFactory.getDrawable("popup"));
	container.addView(scrollTabs);

	let tabs = new android.widget.LinearLayout(context);
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
	Fragment.apply(this, arguments);
	this.resetContainer();
};

SidebarFragment.Group.prototype = new Fragment;

SidebarFragment.Group.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(context);
	container.setMinimumHeight(Interface.getY(178));
	container.setGravity(Interface.Gravity.CENTER);
	let params = new android.widget.LinearLayout.
	LayoutParams(Interface.Display.WRAP, Interface.Display.MATCH);
	if (menuDividers) params.topMargin = Interface.getY(2);
	params.weight = 1.0;
	container.setLayoutParams(params);
	this.setContainerView(container);

	let icon = new android.widget.ImageView(context);
	icon.setLayoutParams(new android.widget.LinearLayout.LayoutParams(Interface.getY(54), Interface.getY(81)));
	icon.setScaleType(Interface.Scale.CENTER_CROP);
	icon.setPadding(Interface.getY(42), 0, 0, 0);
	icon.setTag("groupIcon")
	container.addView(icon);
};

SidebarFragment.Group.prototype.getBackground = function() {
	return this.background || null;
};

SidebarFragment.Group.prototype.setBackground = function(src) {
	let container = this.getContainer();
	if (container == null) return this;
	container.setBackgroundDrawable(ImageFactory.getDrawable(src));
	this.background = src;
	return this;
};

SidebarFragment.Group.prototype.getIconView = function() {
	return this.findViewByTag("groupIcon");
};

SidebarFragment.Group.prototype.getIcon = function() {
	return this.icon || null;
};

SidebarFragment.Group.prototype.setIcon = function(src) {
	let icon = this.getIconView();
	if (icon == null) return this;
	Interface.setActorName(icon, src + "Group");
	icon.setImageDrawable(ImageFactory.getDrawable(src));
	this.icon = src;
	return this;
};

SidebarFragment.Group.prototype.setOnClickListener = function(action) {
	let container = this.getContainer(),
		scope = this;
	if (container == null) return this;
	container.setOnClickListener(function() {
		tryout(function() {
			action && action(scope);
		});
	});
	return this;
};

SidebarFragment.Group.prototype.setOnHoldListener = function(action) {
	let container = this.getContainer(),
		scope = this;
	if (container == null) return this;
	container.setOnLongClickListener(function() {
		return tryout(function() {
			return action && action(scope);
		}, false);
	});
	return this;
};

SidebarFragment.Group.Item = function() {
	Fragment.apply(this, arguments);
	this.resetContainer();
};

SidebarFragment.Group.Item.prototype = new Fragment;

SidebarFragment.Group.Item.prototype.resetContainer = function() {
	let container = new android.widget.ImageView(context);
	container.setLayoutParams(new android.widget.LinearLayout.LayoutParams(Interface.getY(81), Interface.getY(81)));
	container.setPadding(Interface.getY(12), Interface.getY(12), Interface.getY(12), Interface.getY(12));
	this.setContainerView(container);
};

SidebarFragment.Group.Item.prototype.getBackground = function() {
	return this.background || null;
};

SidebarFragment.Group.Item.prototype.setBackground = function(src) {
	let container = this.getContainer();
	if (container == null) return this;
	container.setBackgroundDrawable(ImageFactory.getDrawable(src));
	this.background = src;
	return this;
};

SidebarFragment.Group.Item.prototype.getIcon = function() {
	return this.icon || null;
};

SidebarFragment.Group.Item.prototype.setIcon = function(src) {
	let container = this.getContainer();
	if (container == null) return this;
	Interface.setActorName(container, src + "Item");
	container.setImageDrawable(ImageFactory.getDrawable(src));
	this.icon = src;
	return this;
};

SidebarFragment.Group.Item.prototype.setOnClickListener = function(action) {
	let container = this.getContainer(),
		scope = this;
	if (container == null) return this;
	container.setOnClickListener(function() {
		tryout(function() {
			action && action(scope);
		});
	});
	return this;
};

SidebarFragment.Group.Item.prototype.setOnHoldListener = function(action) {
	let container = this.getContainer(),
		scope = this;
	if (container == null) return this;
	container.setOnLongClickListener(function() {
		return tryout(function() {
			return action && action(scope);
		}, false);
	});
	return this;
};
