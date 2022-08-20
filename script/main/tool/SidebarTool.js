const SidebarTool = function(object) {
	MenuTool.apply(this, arguments);
};

SidebarTool.prototype = new MenuTool;

SidebarTool.prototype.reset = function() {
	MenuTool.prototype.reset.apply(this, arguments);
	let descriptor = {};
	descriptor.background = "popup";
	if (!menuDividers) descriptor.tabBackground = "popup";
	descriptor.selectGroup = function(tool, sidebar) {
		if (typeof tool.onSelectGroup == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			tool.onSelectGroup.apply(tool, args);
		}
	};
	descriptor.undockGroup = function(tool, sidebar) {
		if (typeof tool.onUndockGroup == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			tool.onUndockGroup.apply(tool, args);
		}
		if (tool.isCollapsedWithoutSidebar()) {
			tool.collapse();
		}
	};
	descriptor.fetchGroup = function(tool, sidebar) {
		if (typeof tool.onFetchGroup == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			return tool.onFetchGroup.apply(tool, args);
		}
	};
	descriptor.selectItem = function(tool, sidebar) {
		if (typeof tool.onSelectItem == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			tool.onSelectItem.apply(tool, args);
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
	SidebarWindow.parseJson.call(this, sidebar, this.getSidebarDescriptor());
	if (sidebar.isSelected()) sidebar.reinflateLayout();
};

SidebarTool.prototype.describe = function() {
	MenuTool.prototype.describe.apply(this, arguments);
	this.describeSidebar();
};

SidebarTool.prototype.getSelectedGroup = function() {
	let sidebar = this.getSidebarWindow();
	if (sidebar == null) return SidebarWindow.NOTHING_SELECTED;
	return sidebar.getSelected();
};

SidebarTool.prototype.attach = function() {
	if (this.isAttached()) {
		MenuTool.prototype.attach.apply(this, arguments);
	}
	this.sidebarWindow = new SidebarWindow();
	MenuTool.prototype.attach.apply(this, arguments);
};

SidebarTool.prototype.deattach = function() {
	let sidebar = this.getSidebarWindow();
	MenuTool.prototype.deattach.apply(this, arguments);
	sidebar.dismiss();
	delete this.sidebarWindow;
};

SidebarTool.prototype.hide = function() {
	let sidebar = this.getSidebarWindow();
	if (sidebar == null) return;
	MenuTool.prototype.hide.apply(this, arguments);
	sidebar.dismiss();
};

SidebarTool.prototype.menu = function() {
	let sidebar = this.getSidebarWindow();
	if (sidebar == null) return;
	sidebar.dismiss();
	MenuTool.prototype.menu.apply(this, arguments);
};

SidebarTool.prototype.control = function() {
	let sidebar = this.getSidebarWindow();
	if (sidebar == null) return;
	sidebar.attach();
	MenuTool.prototype.control.apply(this, arguments);
};

SidebarTool.prototype.collapse = function() {
	let sidebar = this.getSidebarWindow();
	if (sidebar == null) return;
	if (!sidebar.isSelected()) {
		sidebar.dismiss();
	}
	MenuTool.prototype.collapse.apply(this, arguments);
	if (sidebar.isSelected()) {
		this.state = SidebarTool.State.COLLAPSED_WITHOUT_SIDEBAR;
	}
};

SidebarTool.prototype.isCollapsedWithoutSidebar = function() {
	return this.state == SidebarTool.State.COLLAPSED_WITHOUT_SIDEBAR;
};

SidebarTool.prototype.queue = function(sequence) {
	let sidebar = this.getSidebarWindow();
	if (sidebar == null) return;
	sidebar.dismiss();
	MenuTool.prototype.queue.apply(this, arguments);
};

SidebarTool.State = clone(MenuTool.State);
SidebarTool.State.COLLAPSED_WITHOUT_SIDEBAR = 6;
