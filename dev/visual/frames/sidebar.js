const SidebarFrame = function() {
	Frame.call(this);
	this.setFragment(new SidebarFragment());
};

SidebarFrame.prototype = assign(Frame.prototype);

SidebarFrame.prototype.addItem = function(view, index) {
	let fragment = this.getFragment();
	if (fragment == null) return this;
	let items = fragment.getItemContainer();
	if (items == null) return this;
	if (index >= 0) {
		items.addView(view, index);
	} else items.addView(view);
	return this;
};

SidebarFrame.prototype.addTab = function(view, index) {
	let fragment = this.getFragment();
	if (fragment == null) return this;
	let tabs = fragment.getTabContainer();
	if (tabs == null) return this;
	if (index >= 0) {
		tabs.addView(view, index);
	} else tabs.addView(view);
	return this;
};

SidebarFrame.prototype.clearItems = function() {
	let fragment = this.getFragment();
	if (fragment == null) return this;
	let items = fragment.getItemContainer();
	if (items == null) return this;
	items.removeAllViews();
	return this;
};

SidebarFrame.prototype.removeItem = function(view) {
	let fragment = this.getFragment();
	if (fragment == null) return this;
	let items = fragment.getItemContainer();
	if (items == null) return this;
	items.removeView(view);
	return this;
};

SidebarFrame.prototype.clearTabs = function() {
	let fragment = this.getFragment();
	if (fragment == null) return this;
	let tabs = fragment.getTabContainer();
	if (tabs == null) return this;
	tabs.removeAllViews();
	return this;
};

SidebarFrame.prototype.removeTab = function(view) {
	let fragment = this.getFragment();
	if (fragment == null) return this;
	let tabs = fragment.getTabContainer();
	if (tabs == null) return this;
	tabs.removeView(view);
	return this;
};

SidebarFrame.prototype.getItemAt = function(index) {
	let fragment = this.getFragment();
	if (fragment == null) return null;
	let items = fragment.getItemContainer();
	if (items == null) return null;
	return items.getChildAt(index);
};

SidebarFrame.prototype.getTabAt = function(index) {
	let fragment = this.getFragment();
	if (fragment == null) return null;
	let tabs = fragment.getTabContainer();
	if (tabs == null) return null;
	return tabs.getChildAt(index);
};

SidebarFrame.prototype.indexOfItem = function(view) {
	let fragment = this.getFragment();
	if (fragment == null) return -1;
	let items = fragment.getItemContainer();
	if (items == null) return -1;
	return items.indexOfChild(view);
};

SidebarFrame.prototype.indexOfTab = function(view) {
	let fragment = this.getFragment();
	if (fragment == null) return -1;
	let tabs = fragment.getTabContainer();
	if (tabs == null) return -1;
	return tabs.indexOfChild(view);
};

SidebarFrame.prototype.getItemCount = function() {
	let fragment = this.getFragment();
	if (fragment == null) return -1;
	let items = fragment.getItemContainer();
	if (items == null) return -1;
	return items.getChildCount();
};

SidebarFrame.prototype.getTabCount = function() {
	let fragment = this.getFragment();
	if (fragment == null) return -1;
	let tabs = fragment.getTabContainer();
	if (tabs == null) return -1;
	return tabs.getChildCount();
};

SidebarFrame.Group = function() {
	Frame.call(this);
	this.setFragment(new SidebarFragment.Group());
};

SidebarFrame.Group.prototype = assign(Frame.prototype);

SidebarFrame.Group.prototype.getBackground = function() {
	return this.background || null;
};

SidebarFrame.Group.prototype.setBackground = function(src) {
	let container = this.getContainer();
	if (container == null) return this;
	container.setBackgroundDrawable(ImageFactory.getDrawable(src));
	this.background = src;
	return this;
};

SidebarFrame.Group.prototype.getIcon = function() {
	return this.icon || null;
};

SidebarFrame.Group.prototype.setIcon = function(src) {
	let fragment = this.getFragment();
	if (fragment == null) return this;
	let icon = fragment.getIconView();
	if (icon == null) return this;
	Ui.setActorName(icon, src + "Group");
	icon.setImageDrawable(ImageFactory.getDrawable(src));
	this.icon = src;
	return this;
};

SidebarFrame.Group.prototype.setOnClickListener = function(action) {
	let container = this.getContainer(), scope = this;
	if (container == null) return this;
	container.setOnClickListener(function() {
		try { action && action(scope); }
		catch (e) { reportError(e); }
	});
	return this;
};

SidebarFrame.Group.prototype.setOnHoldListener = function(action) {
	let container = this.getContainer(), scope = this;
	if (container == null) return this;
	container.setOnLongClickListener(function() {
		try { return action && action(scope); }
		catch (e) { reportError(e); }
		return false;
	});
	return this;
};

SidebarFrame.Group.Item = function() {
	Frame.call(this);
	this.setFragment(new SidebarFragment.Group.Item());
};

SidebarFrame.Group.Item.prototype = assign(Frame.prototype);

SidebarFrame.Group.Item.prototype.getBackground = function() {
	return this.background || null;
};

SidebarFrame.Group.Item.prototype.setBackground = function(src) {
	let container = this.getContainer();
	if (container == null) return this;
	container.setBackgroundDrawable(ImageFactory.getDrawable(src));
	this.background = src;
	return this;
};

SidebarFrame.Group.Item.prototype.getIcon = function() {
	return this.icon || null;
};

SidebarFrame.Group.Item.prototype.setIcon = function(src) {
	let container = this.getContainer();
	if (container == null) return this;
	Ui.setActorName(container, src + "Item");
	container.setImageDrawable(ImageFactory.getDrawable(src));
	this.icon = src;
	return this;
};

SidebarFrame.Group.Item.prototype.setOnClickListener = function(action) {
	let container = this.getContainer(), scope = this;
	if (container == null) return this;
	container.setOnClickListener(function() {
		try { action && action(scope); }
		catch (e) { reportError(e); }
	});
	return this;
};

SidebarFrame.Group.Item.prototype.setOnHoldListener = function(action) {
	let container = this.getContainer(), scope = this;
	if (container == null) return this;
	container.setOnLongClickListener(function() {
		try { return action && action(scope); }
		catch (e) { reportError(e); }
		return false;
	});
	return this;
};
