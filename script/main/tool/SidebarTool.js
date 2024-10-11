const SidebarTool = function(object) {
	MenuTool.apply(this, arguments);
};

SidebarTool.prototype = new MenuTool;

SidebarTool.prototype.reset = function() {
	MenuTool.prototype.reset.apply(this, arguments);
	let descriptor = {};
	descriptor.background = "popup";
	menuDividers || (descriptor.containerBackground = "popup");
	descriptor.selectItem = function(tool, sidebar) {
		if (typeof tool.onSelectItem == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			tool.onSelectItem.apply(tool, args);
		}
	};
	descriptor.unselectItem = function(tool, sidebar) {
		if (typeof tool.onUnselectItem == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			tool.onUnselectItem.apply(tool, args);
		}
	};
	descriptor.fetchItem = function(tool, sidebar) {
		if (typeof tool.onFetchItem == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			return tool.onFetchItem.apply(tool, args);
		}
	};
	this.sidebarDescriptor = descriptor;
};

SidebarTool.prototype.getSidebarWindow = function() {
	return this.sidebarWindow || null;
};

SidebarTool.prototype.getSidebarDescriptor = function() {
	return this.sidebarDescriptor || null;
};

SidebarTool.prototype.describeSidebar = function() {
	let sidebar = this.getSidebarWindow();
	if (sidebar == null) return;
	SidebarWindow.parseJson.call(this, sidebar, this.getSidebarDescriptor());
	// if (sidebar.isSelected()) sidebar.reinflateLayout();
};

SidebarTool.prototype.describe = function() {
	MenuTool.prototype.describe.apply(this, arguments);
	this.describeSidebar();
};

// SidebarTool.prototype.getSelectedGroup = function() {
	// let sidebar = this.getSidebarWindow();
	// if (sidebar == null) return SidebarWindow.NOTHING_SELECTED;
	// return sidebar.getSelected();
// };

SidebarTool.prototype.attach = function() {
	if (this.isAttached()) {
		// Just throw exception, nothing will happened anymore
		MenuTool.prototype.attach.apply(this, arguments);
	}
	this.sidebarWindow = new SidebarWindow();
	MenuTool.prototype.attach.apply(this, arguments);
};

SidebarTool.prototype.deattach = function() {
	let sidebar = this.getSidebarWindow();
	MenuTool.prototype.deattach.apply(this, arguments);
	if (sidebar == null) return;
	sidebar.dismiss();
	delete this.sidebarWindow;
};

SidebarTool.prototype.hide = function() {
	let sidebar = this.getSidebarWindow();
	MenuTool.prototype.hide.apply(this, arguments);
	if (sidebar == null) return;
	sidebar.dismiss();
};

SidebarTool.prototype.menu = function() {
	let sidebar = this.getSidebarWindow();
	MenuTool.prototype.menu.apply(this, arguments);
	if (sidebar == null) return;
	sidebar.dismiss();
};

SidebarTool.prototype.control = function() {
	let sidebar = this.getSidebarWindow();
	if (sidebar) sidebar.attach();
	MenuTool.prototype.control.apply(this, arguments);
};

SidebarTool.prototype.collapse = function() {
	let sidebar = this.getSidebarWindow();
	if (sidebar/* && !sidebar.isSelected()*/) sidebar.dismiss();
	MenuTool.prototype.collapse.apply(this, arguments);
	// if (sidebar && sidebar.isSelected()) this.state = SidebarTool.State.COLLAPSED_WITHOUT_SIDEBAR;
};

SidebarTool.prototype.isCollapsedWithoutSidebar = function() {
	return this.state == SidebarTool.State.COLLAPSED_WITHOUT_SIDEBAR;
};

SidebarTool.prototype.queue = function(what) {
	let sidebar = this.getSidebarWindow();
	if (sidebar) sidebar.dismiss();
	MenuTool.prototype.queue.apply(this, arguments);
};

SidebarTool.State = clone(MenuTool.State);
SidebarTool.State.COLLAPSED_WITHOUT_SIDEBAR = 6;
