class MenuTool extends InteractionTool {
	protected menuDescriptor: CallableJsonProperty1<MenuWindow, IMenuWindow>;
	protected menuWindow: Nullable<MenuWindow>;

	constructor(object?: Partial<MenuTool>) {
		super(object);
	}
	override reset() {
		super.reset();
		const descriptor: IMenuWindow = {};
		descriptor.background = "popupControl";
		descriptor.click = (...args) => {
			if (typeof this.onMenuClick == "function") {
				this.onMenuClick.apply(this, Array.prototype.slice.call(args, 1));
			}
		};
		descriptor.elements = [{
			type: "header"
		}, {
			type: "message",
			icon: "menuProjectLeave",
			message: translate("Modding Tools") + ": " + translate("Leave"),
			click(tool, menu, message) {
				attachProjectTool(undefined, function() {
					tool.deattach();
				});
			}
		}];
		descriptor.closeable = false;
		this.menuDescriptor = descriptor;
	}
	getMenuWindow() {
		return this.menuWindow || null;
	}
	getMenuDescriptor() {
		return this.menuDescriptor || null;
	}
	describeMenu() {
		let menu = this.getMenuWindow();
		if (menu == null) return;
		MenuWindow.parseJson.call(this, menu, this.getMenuDescriptor());
	}
	override describe() {
		InteractionTool.prototype.describe.apply(this, arguments);
		this.describeMenu();
	}
	override attach() {
		if (this.isAttached()) {
			// Just throw exception, nothing will happened anymore
			InteractionTool.prototype.attach.apply(this, arguments);
		}
		this.menuWindow = new MenuWindow();
		InteractionTool.prototype.attach.apply(this, arguments);
	}
	override deattach() {
		let menu = this.getMenuWindow();
		InteractionTool.prototype.deattach.apply(this, arguments);
		if (menu == null) return;
		menu.dismiss();
		delete this.menuWindow;
	}
	override hide() {
		let menu = this.getMenuWindow();
		InteractionTool.prototype.hide.apply(this, arguments);
		if (menu == null) return;
		menu.dismiss();
	}
	menu() {
		this.state = MenuTool.State.CONTROLLING;
		let control = this.getControlWindow();
		if (control) control.dismiss();
		this.hideInteraction();
		let menu = this.getMenuWindow();
		if (menu) menu.attach();
	}
	isControlling() {
		return this.state == MenuTool.State.CONTROLLING;
	}
	override onControlClick(control: ControlWindow) {
		this.menu();
	}
	onMenuClick(menu: MenuWindow) {
		this.control();
	}
	override control() {
		let menu = this.getMenuWindow();
		if (menu) menu.dismiss();
		super.control();
	}
	override collapse() {
		let menu = this.getMenuWindow();
		if (menu) menu.dismiss();
		super.collapse();
	}
	override queue(what: any) {
		let menu = this.getMenuWindow();
		if (menu) menu.dismiss();
		super.queue(what);
	}
}

namespace MenuTool {
	export const State = {
		...Tool.State,
		CONTROLLING: 5
	};
}
