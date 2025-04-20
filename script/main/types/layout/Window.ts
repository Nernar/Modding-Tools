interface IControlWindow<ABC = IControlWindow<any>> extends IUniqueWindow<ABC> {
	orientation?: CallableJsonProperty1<ABC, number>;
	logotypeProgress?: CallableJsonProperty1<ABC, Nullable<object | string>>;
	logotypeOutside?: CallableJsonProperty1<ABC, Nullable<object | string>>;
	logotype?: CallableJsonProperty1<ABC, Nullable<object | string>>;
	buttonBackground?: CallableJsonProperty1<ABC, Nullable<object | string>>;
	logotypeBackground?: CallableJsonProperty1<ABC, Nullable<object | string>>;
	buttonClick?: Nullable<(self: ABC) => void>;
	buttonHold?: Nullable<(self: ABC) => boolean>;
	collapsedClick?: Nullable<(self: ABC) => void>;
	collapsedHold?: Nullable<(self: ABC) => boolean>;
	hideable?: CallableJsonProperty1<ABC, boolean>;
}

interface IMenuWindow<ABC = IMenuWindow<any>> extends IUniqueWindow<ABC> {
	background?: CallableJsonProperty1<ABC, Nullable<object | string>>;
	click?: Nullable<(self: ABC) => void>;
	closeable?: CallableJsonProperty1<ABC, boolean>;
	elements?: CallableJsonProperty1<ABC, CallableJsonProperty2<ABC, object, MenuWindow.IElements> | CallableJsonProperty2<ABC, object, MenuWindow.IElements>[]>;
}

namespace MenuWindow {
	export type IElements = IHeader | IProjectHeader | ICategory | IMessage;

	export interface IHeader {
		type: "header";
		cover?: CallableJsonProperty1<IHeader, Nullable<object | string>>;
		logotype?: CallableJsonProperty1<IHeader, Nullable<object | string>>;
		maxScroll?: CallableJsonProperty1<IHeader, Nullable<number>>;
		slideOffset?: CallableJsonProperty1<IHeader, Nullable<number>>;
	}

	export interface IProjectHeader {
		type: "projectHeader";
		background?: CallableJsonProperty1<IProjectHeader, Nullable<object | string>>;
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
				background?: CallableJsonProperty1<IItem, Nullable<object | string>>;
				icon?: CallableJsonProperty1<IItem, Nullable<object | string>>;
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
			background?: CallableJsonProperty1<IItem, Nullable<object | string>>;
			icon?: CallableJsonProperty1<IItem, Nullable<object | string>>;
			title?: CallableJsonProperty1<IItem, Nullable<string>>;
			click?: Nullable<(self: IItem, index: number) => void>;
			hold?: Nullable<(self: IItem, index: number) => boolean>;
			badgeOverlay?: CallableJsonProperty1<IItem, Nullable<object | string>>;
			badgeText?: CallableJsonProperty1<IItem, Nullable<string>>;
		}
	}

	export interface IMessage {
		type: "message";
		background?: CallableJsonProperty1<IMessage, Nullable<object | string>>;
		icon?: CallableJsonProperty1<IMessage, Nullable<object | string>>;
		message?: CallableJsonProperty1<IMessage, Nullable<string>>;
		click?: Nullable<(self: IMessage) => void>;
	}
}
