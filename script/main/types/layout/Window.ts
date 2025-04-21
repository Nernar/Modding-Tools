interface IControlWindow<CT = IControlWindow<any>> extends IUniqueWindow<CT> {
	orientation?: CallableJsonProperty2<CT, ControlWindow, number>;
	logotypeProgress?: CallableJsonProperty2<CT, ControlWindow, Nullable<IDrawableJson>>;
	logotypeOutside?: CallableJsonProperty2<CT, ControlWindow, Nullable<IDrawableJson>>;
	logotype?: CallableJsonProperty2<CT, ControlWindow, Nullable<IDrawableJson>>;
	buttonBackground?: CallableJsonProperty2<CT, ControlWindow, Nullable<IDrawableJson>>;
	logotypeBackground?: CallableJsonProperty2<CT, ControlWindow, Nullable<IDrawableJson>>;
	buttonClick?: Nullable<(self: CT) => void>;
	buttonHold?: Nullable<(self: CT) => boolean>;
	collapsedClick?: Nullable<(self: CT) => void>;
	collapsedHold?: Nullable<(self: CT) => boolean>;
	hideable?: CallableJsonProperty2<CT, ControlWindow, boolean>;
}

interface IMenuWindow<CT = IMenuWindow<any>> extends IUniqueWindow<CT> {
	background?: CallableJsonProperty2<CT, MenuWindow, Nullable<IDrawableJson>>;
	click?: Nullable<(self: CT) => void>;
	closeable?: CallableJsonProperty2<CT, MenuWindow, boolean>;
	elements?: CallableJsonProperty2<CT, MenuWindow, CallableJsonProperty2<CT, object, MenuWindow.IElements> | CallableJsonProperty2<CT, object, MenuWindow.IElements>[]>;
}

namespace MenuWindow {
	export type IElements = IHeader | IProjectHeader | ICategory | IMessage;

	export interface IHeader {
		type: "header";
		cover?: CallableJsonProperty1<IHeader, Nullable<IDrawableJson>>;
		logotype?: CallableJsonProperty1<IHeader, Nullable<IDrawableJson>>;
		maxScroll?: CallableJsonProperty1<IHeader, Nullable<number>>;
		slideOffset?: CallableJsonProperty1<IHeader, Nullable<number>>;
	}

	export interface IProjectHeader {
		type: "projectHeader";
		background?: CallableJsonProperty1<IProjectHeader, Nullable<IDrawableJson>>;
		maxScroll?: CallableJsonProperty1<IProjectHeader, Nullable<number>>;
		slideOffset?: CallableJsonProperty1<IProjectHeader, Nullable<number>>;
		categories?: CallableJsonProperty1<IProjectHeader, CallableJsonProperty2<IProjectHeader, object, ProjectHeader.ICategory> | CallableJsonProperty2<IProjectHeader, object, ProjectHeader.ICategory>[]>;
	}

	namespace ProjectHeader {
		export interface ICategory {
			title?: CallableJsonProperty1<ICategory, string>;
			clickItem?: Nullable<(self: ICategory, item: Category.IItem, index: number) => void>;
			holdItem?: Nullable<(self: ICategory, item: Category.IItem, index: number) => boolean>;
			items?: CallableJsonProperty1<ICategory, CallableJsonProperty2<ICategory, object, Category.IItem> | CallableJsonProperty2<ICategory, object, Category.IItem>[]>;
		}
	
		namespace Category {
			export interface IItem {
				background?: CallableJsonProperty1<IItem, Nullable<IDrawableJson>>;
				icon?: CallableJsonProperty1<IItem, Nullable<IDrawableJson>>;
				title?: CallableJsonProperty1<IItem, string>;
				description?: CallableJsonProperty1<IItem, string>;
				click?: Nullable<(self: IItem, index: number) => void>;
				hold?: Nullable<(self: IItem, index: number) => boolean>;
			}
		}
	}

	export interface ICategory {
		type: "category";
		title?: CallableJsonProperty1<ICategory, string>;
		clickItem?: Nullable<(self: ICategory, item: Category.IItem, index: number) => void>;
		holdItem?: Nullable<(self: ICategory, item: Category.IItem, index: number) => boolean>;
		items?: CallableJsonProperty1<ICategory, CallableJsonProperty2<ICategory, object, Category.IItem> | CallableJsonProperty2<ICategory, object, Category.IItem>[]>;
	}

	namespace Category {
		export interface IItem {
			background?: CallableJsonProperty1<IItem, Nullable<IDrawableJson>>;
			icon?: CallableJsonProperty1<IItem, Nullable<IDrawableJson>>;
			title?: CallableJsonProperty1<IItem, Nullable<string>>;
			click?: Nullable<(self: IItem, index: number) => void>;
			hold?: Nullable<(self: IItem, index: number) => boolean>;
			badgeOverlay?: CallableJsonProperty1<IItem, Nullable<IDrawableJson>>;
			badgeText?: CallableJsonProperty1<IItem, Nullable<string>>;
		}
	}

	export interface IMessage {
		type: "message";
		background?: CallableJsonProperty1<IMessage, Nullable<IDrawableJson>>;
		icon?: CallableJsonProperty1<IMessage, Nullable<IDrawableJson>>;
		message?: CallableJsonProperty1<IMessage, Nullable<string>>;
		click?: Nullable<(self: IMessage) => void>;
	}
}
