namespace SidebarFragment {
	export interface IRail<ABC = IRail<any>> extends ILayoutFragment, ISelectableLayoutFragment {
		containerBackground?: CallableJsonProperty1<ABC, Nullable<object | string>>;
		fetchItem?: Nullable<(self: ABC, item: Rail.IItem, index: number) => Nullable<string>>;
		expanded?: CallableJsonProperty1<ABC, boolean>;
	}

	namespace Rail {
		export interface IItem<ABC = IItem<any>> extends ILayoutFragment, ISelectableFragment {
			icon?: CallableJsonProperty1<IItem, Nullable<object | string>>;
			fetch?: Nullable<(self: ABC) => Nullable<string>>;
			expanded?: CallableJsonProperty1<ABC, boolean>;
		}
	}
}

interface IAngleCircleFragment<ABC = IAngleCircleFragment<any>> extends ITextFragment<ABC> {
	value?: CallableJsonProperty1<ABC, number>;
	change?: Nullable<(self: ABC, radians: number, degress: number) => void>;
	reset?: Nullable<(self: ABC, radians: number, degress: number) => number>;
}

interface IAxisGroupFragment<ABC = IAxisGroupFragment<any>> extends ILayoutFragment<ABC> {
	text?: CallableJsonProperty1<ABC, Nullable<string>>;
	append?: CallableJsonProperty1<ABC, Nullable<string>>;
	changeItem?: Nullable<(self: ABC, item: IBaseFragment, index: number, value: number, difference: number) => void>;
	resetItem?: Nullable<(self: ABC, item: IBaseFragment, index: number, value: number) => Nullable<number>>;
}

interface IPropertyInputFragment<ABC = IPropertyInputFragment<any>> extends ITextFragment<ABC> {
	hint?: CallableJsonProperty1<ABC, string>;
}

interface ISliderFragment<ABC = ISliderFragment<any>> extends ITextFragment<ABC> {
	modifiers?: CallableJsonProperty1<ABC, number[]>;
	modifier?: CallableJsonProperty1<ABC, number>;
	value?: CallableJsonProperty1<ABC, number>;
	suffix?: CallableJsonProperty1<ABC, Nullable<string>>;
	change?: Nullable<(self: ABC, value: number, difference: number) => void>;
	reset?: Nullable<(self: ABC, value: number) => Nullable<number>>;
}
