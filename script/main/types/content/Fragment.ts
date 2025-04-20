interface IBaseFragment<ABC = IBaseFragment<any>> {
	type?: Nullable<string>;
	attach?: (parent: Fragment | FocusableWindow) => void;
	deattach?: () => void;
	update?: (...args: any) => void;
	token?: CallableJsonProperty1<ABC, Nullable<string>>;
	selectable?: CallableJsonProperty1<ABC, boolean>;
	hoverable?: CallableJsonProperty1<ABC, boolean>;
	visible?: CallableJsonProperty1<ABC, boolean>;
	mark?: CallableJsonProperty1<ABC, Nullable<string>>;
	marks?: CallableJsonProperty1<ABC, Nullable<string | string[]>>;
	background?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
	click?: () => void;
	hold?: () => boolean | void;
}

/**
 * @deprecated Use {@link ImageFragmentMixin} instead.
 */
interface IImageFragment<ABC = IImageFragment<any>> extends IBaseFragment<ABC> {
	icon?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
}

/**
 * @deprecated Use {@link TextFragmentMixin} instead.
 */
interface ITextFragment<ABC = ITextFragment<any>> extends IBaseFragment<ABC> {
	text?: CallableJsonProperty1<ABC, Nullable<string>>;
}

interface IListFragment<ABC = IListFragment<any>> extends IBaseFragment<ABC> {
	bindItem?: (self: ABC, adapter: any, position: number, parent: Fragment | FocusableWindow) => any;
	describeItem?: (self: ABC, adapter: any, holder: any, item: any, position: number, parent: Fragment | FocusableWindow) => void;
	items?: CallableJsonProperty1<ABC, any[]>;
}

interface ILayoutFragment<ABC = ILayoutFragment<any>> extends IBaseFragment<ABC> {
	elements?: CallableJsonProperty1<ABC, CallableJsonProperty2<ABC, object, IBaseFragment> | CallableJsonProperty2<ABC, object, IBaseFragment>[]>;
	fragments?: CallableJsonProperty1<ABC, CallableJsonProperty2<ABC, object, IBaseFragment> | CallableJsonProperty2<ABC, object, IBaseFragment>[]>;
}

interface ISelectableFragment<ABC = ISelectableFragment<any>> {
	selectionType?: CallableJsonProperty1<ABC, Nullable<number>>;
	selectedBackground?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
	unselectedBackground?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
	selected?: CallableJsonProperty1<ABC, boolean>;
	select?: (self: ABC) => any;
	unselect?: (self: ABC) => any;
}

interface ISelectableLayoutFragment<ABC = ISelectableLayoutFragment<any>> {
	selectionType?: CallableJsonProperty1<ABC, Nullable<number>>;
	holdActivatesMultipleSelection?: CallableJsonProperty1<ABC, boolean>;
	selectedItem?: CallableJsonProperty1<ABC, Nullable<IBaseFragment | number>>;
	selectItem?: (self: ABC, item: ISelectableFragment, index: number) => void;
	unselectItem?: (self: ABC, item: ISelectableFragment, index: number) => void;
	holdItem?: (self: ABC, item: ISelectableFragment, index: number) => boolean;
}
