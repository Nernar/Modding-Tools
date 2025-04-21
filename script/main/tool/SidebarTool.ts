class SidebarTool extends MenuTool {
	sidebarDescriptor: CallableJsonProperty1<SidebarWindow, SidebarFragment.IRail>;
	sidebarWindow: Nullable<SidebarWindow>;

	constructor(object?: Partial<SidebarTool>) {
		super(object);
	}
	reset() {
		super.reset();
		const descriptor: SidebarWindow.IRail = {};
		descriptor.background = "popup";
		menuDividers || (descriptor.containerBackground = "popup");
		descriptor.selectItem = (...args) => {
			if (typeof this.onSelectItem == "function") {
				this.onSelectItem.apply(this, Array.prototype.slice.call(args, 1));
			}
		};
		descriptor.unselectItem = (...args) => {
			if (typeof this.onUnselectItem == "function") {
				this.onUnselectItem.apply(this, Array.prototype.slice.call(args, 1));
			}
		};
		descriptor.fetchItem = (...args) => {
			if (typeof this.onFetchItem == "function") {
				return this.onFetchItem.apply(this, Array.prototype.slice.call(args, 1));
			}
		};
		this.sidebarDescriptor = descriptor;
	}
	getSidebarWindow() {
		return this.sidebarWindow || null;
	}
	getSidebarDescriptor() {
		return this.sidebarDescriptor || null;
	}
	describeSidebar() {
		let sidebar = this.getSidebarWindow();
		if (sidebar == null) return;
		SidebarWindow.parseJson.call(this, sidebar, this.getSidebarDescriptor());
		// if (sidebar.isSelected()) sidebar.reinflateLayout();
	}
	override describe() {
		super.describe();
		this.describeSidebar();
	}
	// getSelectedGroup() {
		// let sidebar = this.getSidebarWindow();
		// if (sidebar == null) return SidebarWindow.NOTHING_SELECTED;
		// return sidebar.getSelected();
	// }
	override attach() {
		if (this.isAttached()) {
			// Just throw exception, nothing will happened anymore
			super.attach();
			return;
		}
		this.sidebarWindow = new SidebarWindow();
		super.attach();
	}
	onSelectItem?: SidebarFragment.IRail["selectItem"];
	onUnselectItem?: SidebarFragment.IRail["unselectItem"];
	onFetchItem?: SidebarFragment.IRail["fetchItem"];
	override deattach() {
		let sidebar = this.getSidebarWindow();
		super.deattach();
		if (sidebar == null) return;
		sidebar.dismiss();
		delete this.sidebarWindow;
	}
	override hide() {
		let sidebar = this.getSidebarWindow();
		super.hide();
		if (sidebar == null) return;
		sidebar.dismiss();
	}
	override menu() {
		let sidebar = this.getSidebarWindow();
		super.menu();
		if (sidebar == null) return;
		sidebar.dismiss();
	}
	override control() {
		let sidebar = this.getSidebarWindow();
		if (sidebar) sidebar.attach();
		MenuTool.prototype.control.apply(this, arguments);
	}
	override collapse() {
		let sidebar = this.getSidebarWindow();
		if (sidebar/* && !sidebar.isSelected()*/) sidebar.dismiss();
		MenuTool.prototype.collapse.apply(this, arguments);
		// if (sidebar && sidebar.isSelected()) this.state = SidebarTool.State.COLLAPSED_WITHOUT_SIDEBAR;
	}
	isCollapsedWithoutSidebar() {
		return this.state == SidebarTool.State.COLLAPSED_WITHOUT_SIDEBAR;
	}
	override queue(what: any) {
		let sidebar = this.getSidebarWindow();
		if (sidebar) sidebar.dismiss();
		super.queue(what);
	}
}

namespace SidebarTool {
	export const State = {
		...MenuTool.State,
		COLLAPSED_WITHOUT_SIDEBAR: 6
	};
}
