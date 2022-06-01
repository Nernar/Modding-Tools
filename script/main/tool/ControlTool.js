const ControlTool = function(object) {
	Tool.apply(this, arguments);
};

ControlTool.prototype = new Tool;

ControlTool.prototype.reset = function() {
	Tool.prototype.reset.apply(this, arguments);
	let descriptor = {};
	descriptor.background = "popupControl";
	descriptor.click = function(tool, menu) {
		if (typeof tool.onMenuClick == "function") {
			let args = Array.prototype.slice.call(arguments, 1);
			tool.onMenuClick.apply(tool, args);
		}
	};
	descriptor.closeable = false;
	this.menuDescriptor = descriptor;
};

ControlTool.prototype.getMenuWindow = function() {
	return this.menuWindow || null;
};

ControlTool.prototype.getMenuDescriptor = function() {
	return this.menuDescriptor || null;
};

ControlTool.prototype.describeMenu = function() {
	let menu = this.getMenuWindow();
	if (menu == null) MCSystem.throwException(null);
	MenuWindow.parseJson.call(this, menu, this.getMenuDescriptor());
};

ControlTool.prototype.describe = function() {
	Tool.prototype.describe.apply(this, arguments);
	this.describeMenu();
};

ControlTool.prototype.attach = function() {
	if (this.isAttached()) {
		Tool.prototype.attach.apply(this, arguments);
	}
	this.menuWindow = new MenuWindow();
	Tool.prototype.attach.apply(this, arguments);
};

ControlTool.prototype.deattach = function() {
	let menu = this.getMenuWindow();
	if (menu == null) MCSystem.throwException(null);
	Tool.prototype.deattach.apply(this, arguments);
	menu.dismiss();
	delete this.menuWindow;
};

ControlTool.prototype.hide = function() {
	let menu = this.getMenuWindow();
	if (menu == null) return;
	Tool.prototype.hide.apply(this, arguments);
	menu.hide();
};

ControlTool.prototype.menu = function() {
	let menu = this.getMenuWindow();
	if (menu == null) return;
	let control = this.getControlWindow();
	if (control == null) return;
	this.state = ControlTool.State.CONTROLLING;
	control.hide();
	menu.show();
};

ControlTool.prototype.isControlling = function() {
	return this.state == ControlTool.State.CONTROLLING;
};

ControlTool.prototype.onControlClick = function(control) {
	this.menu();
};

ControlTool.prototype.onMenuClick = function(menu) {
	this.control();
};

ControlTool.prototype.control = function() {
	let menu = this.getMenuWindow();
	if (menu == null) return;
	menu.hide();
	Tool.prototype.control.apply(this, arguments);
};

ControlTool.prototype.collapse = function() {
	let menu = this.getMenuWindow();
	if (menu == null) return;
	menu.hide();
	Tool.prototype.collapse.apply(this, arguments);
};

ControlTool.prototype.queue = function(sequence) {
	let menu = this.getMenuWindow();
	if (menu == null) return;
	menu.hide();
	Tool.prototype.queue.apply(this, arguments);
};

ControlTool.State = clone(Tool.State);
ControlTool.State.CONTROLLING = 5;
