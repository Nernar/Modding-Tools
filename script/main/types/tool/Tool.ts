interface ITool<ABC = ITool<any>> {
	controlDescriptor?: CallableJsonProperty1<ABC, IControlWindow>;
	onControlClick?: IControlWindow["buttonClick"];
}

interface IInteractionTool<ABC = IInteractionTool<any>> extends ITool<ABC> {
	interactionDescriptor?: CallableJsonProperty1<ABC, (FocusablePopup | IFocusablePopup)[]>;
}

interface IMenuTool<ABC = IMenuTool<any>> extends IInteractionTool<ABC> {
	onMenuClick?: IMenuWindow["click"];
	menuDescriptor?: CallableJsonProperty1<ABC, IMenuWindow>;
}

interface IProjectTool<ABC = IProjectTool<any>> extends IMenuTool<ABC> {
	contentProjectDescriptor?: MenuWindow.IProjectHeader["categories"];
	contentEntryDescriptor?: MenuWindow.ICategory["items"];
}

interface ISidebarTool<ABC = ISidebarTool<any>> extends IMenuTool<ABC> {
	sidebarDescriptor?: CallableJsonProperty1<ABC, SidebarFragment.IRail>;
	onSelectItem?: SidebarFragment.IRail["selectItem"];
	onUnselectItem?: SidebarFragment.IRail["unselectItem"];
	onFetchItem?: SidebarFragment.IRail["fetchItem"];
}
