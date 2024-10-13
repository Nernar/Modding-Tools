/**
 * @type
 */
const MenuTool = function(object) {
	InteractionTool.apply(this, arguments);
};

MenuTool.prototype = new InteractionTool;

MenuTool.prototype.reset = function() {
	InteractionTool.prototype.reset.apply(this, arguments);
	let descriptor = {};
	descriptor.background = "popupControl";
	descriptor.click = function(tool, menu) {
		if (typeof tool.onMenuClick == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			tool.onMenuClick.apply(tool, args);
		}
	};
	descriptor.elements = [{
		type: "header"
	}, {
		type: "message",
		icon: "menuProjectLeave",
		message: translate("Modding Tools") + ": " + translate("Leave"),
		click: function(tool, menu, message) {
			attachProjectTool(undefined, function() {
				tool.deattach();
			});
		}
	}];
	descriptor.closeable = false;
	this.menuDescriptor = descriptor;
};

MenuTool.prototype.getMenuWindow = function() {
	return this.menuWindow || null;
};

MenuTool.prototype.getMenuDescriptor = function() {
	return this.menuDescriptor || null;
};

MenuTool.prototype.describeMenu = function() {
	let menu = this.getMenuWindow();
	if (menu == null) return;
	MenuWindow.parseJson.call(this, menu, this.getMenuDescriptor());
};

MenuTool.prototype.describe = function() {
	InteractionTool.prototype.describe.apply(this, arguments);
	this.describeMenu();
};

MenuTool.prototype.attach = function() {
	if (this.isAttached()) {
		// Just throw exception, nothing will happened anymore
		InteractionTool.prototype.attach.apply(this, arguments);
	}
	this.menuWindow = new MenuWindow();
	InteractionTool.prototype.attach.apply(this, arguments);
};

MenuTool.prototype.deattach = function() {
	let menu = this.getMenuWindow();
	InteractionTool.prototype.deattach.apply(this, arguments);
	if (menu == null) return;
	menu.dismiss();
	delete this.menuWindow;
};

MenuTool.prototype.hide = function() {
	let menu = this.getMenuWindow();
	InteractionTool.prototype.hide.apply(this, arguments);
	if (menu == null) return;
	menu.dismiss();
};

MenuTool.prototype.menu = function() {
	this.state = MenuTool.State.CONTROLLING;
	let control = this.getControlWindow();
	if (control) control.dismiss();
	this.hideInteraction();
	let menu = this.getMenuWindow();
	if (menu) menu.attach();
};

MenuTool.prototype.isControlling = function() {
	return this.state == MenuTool.State.CONTROLLING;
};

MenuTool.prototype.onControlClick = function(control) {
	this.menu();
};

MenuTool.prototype.onMenuClick = function(menu) {
	this.control();
};

MenuTool.prototype.control = function() {
	let menu = this.getMenuWindow();
	if (menu) menu.dismiss();
	InteractionTool.prototype.control.apply(this, arguments);
};

MenuTool.prototype.collapse = function() {
	let menu = this.getMenuWindow();
	if (menu) menu.dismiss();
	InteractionTool.prototype.collapse.apply(this, arguments);
};

MenuTool.prototype.queue = function(what) {
	let menu = this.getMenuWindow();
	if (menu) menu.dismiss();
	InteractionTool.prototype.queue.apply(this, arguments);
};

MenuTool.State = clone(InteractionTool.State);
MenuTool.State.CONTROLLING = 5;
