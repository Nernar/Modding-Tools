interface ITextFragment {
	getTextView(): android.widget.TextView;
	getText(): Nullable<string>;
	append(text: string): this;
	setText(text: string): this;
}

abstract class TextFragmentMixin extends BaseFragment implements ITextFragment {
	abstract getTextView(): android.widget.TextView;
	private text: Nullable<string>;
	/**
	 * @requires `isCLI()`
	 */
	override render(hovered: boolean) {
		return this.text;
	}
	getText() {
		if (isAndroid()) {
			let view = this.getTextView();
			return "" + view.getText();
		}
		return this.text || null;
	}
	append(text: string) {
		if (isAndroid()) {
			let view = this.getTextView();
			view.append("" + text);
		} else {
			this.text += text;
		}
		return this;
	}
	setText(text: string) {
		if (isAndroid()) {
			let view = this.getTextView();
			view.setText("" + text);
		} else {
			this.text = "" + text;
		}
		return this;
	}
}

namespace TextFragmentMixin {
	export function parseJson(instanceOrJson, json?) {
		if (json.hasOwnProperty("text")) {
			instanceOrJson.setText(calloutOrParse(json, json.text, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("append")) {
			instanceOrJson.append(calloutOrParse(json, json.append, [this, instanceOrJson]));
		}
	}
}

/**
 * @deprecated Use {@link TextFragmentMixin} instead.
 */
interface ITextFragmentMixin<ABC = ITextFragmentMixin<any>> extends IBaseFragment<ABC> {
	text?: CallableJsonProperty1<ABC, Nullable<string>>;
}

/**
 * @deprecated Use {@link TextFragmentMixin} as mixin instead.
 */
const TextFragment = TextFragmentMixin;

interface IImageFragment {
	getImageView(): android.widget.ImageView;
	getImage(): Nullable<any>;
	setImage(src: Nullable<any>): this;
}

abstract class ImageFragmentMixin extends BaseFragment implements IImageFragment {
	abstract getImageView(): android.widget.ImageView;
	private image: Nullable<any>;
	/**
	 * @requires `isCLI()`
	 */
	override render(hovered: boolean) {
		let image = this.getImage();
		if (!(image instanceof Drawable)) {
			let color = ColorDrawable.parseColor(image, false);
			if (color != null) {
				return color + " ";
			}
			return BitmapDrawableFactory.requireByKey(image)
				|| BitmapDrawableFactory.requireByKey("menuBoardWarning") || "";
		}
		return "";
	}
	getImage() {
		return this.image || null;
	}
	setImage(src) {
		if (isAndroid()) {
			let image = this.getImageView();
			if (!(src instanceof Drawable)) {
				src = Drawable.parseJson.call(this, src);
			}
			$.ViewCompat.setTransitionName(image, src);
			src.attachAsImage(image);
		}
		this.image = src;
		return this;
	}
}

namespace ImageFragmentMixin {
	export function parseJson(instanceOrJson, json?) {
		if (json.hasOwnProperty("icon")) {
			instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
		}
	}
}

/**
 * @deprecated Use {@link ImageFragmentMixin} instead.
 */
interface IImageFragmentMixin<ABC = IImageFragmentMixin<any>> extends IBaseFragment<ABC> {
	icon?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
}

/**
 * @deprecated Use {@link ImageFragmentMixin} as mixin instead.
 */
const ImageFragment = ImageFragmentMixin;

abstract class SelectableFragment extends BaseFragment {
	selectionType: any;
	getSelectionType() {
		return this.selectionType || SelectableFragment.SELECTION_LAYOUT;
	}
	setSelectionType(type) {
		if (type == null || this.getSelectionType() == type) {
			return;
		}
		if (this.selected && type == SelectableFragment.SELECTION_DENIED) {
			this.unselect();
		}
		this.selectionType = type;
	}
	private selected: boolean;
	protected onSelect: any;
	protected onUnselect: any;
	isSelected() {
		return this.selected || false;
	}
	select() {
		if (this.selected || this.getSelectionType() == SelectableFragment.SELECTION_DENIED) {
			return false;
		}
		let parent = this.getParent() as SelectableLayoutFragment;
		if (this.getSelectionType() == SelectableFragment.SELECTION_LAYOUT && (
			parent == null || (parent.canSelectItem && !parent.canSelectItem(this))
		)) {
			return false;
		}
		this.selected = true;
		this.onSelect && this.onSelect();
		parent && parent.selectItemInLayout && parent.selectItemInLayout(this);
		this.updateSelection();
		return true;
	}
	setOnSelectListener(listener) {
		if (listener != null) {
			this.onSelect = listener;
		} else {
			delete this.onSelect;
		}
		return this;
	}
	unselect() {
		if (!this.selected) {
			return false;
		}
		let parent = this.getParent() as SelectableLayoutFragment;
		if (this.getSelectionType() == SelectableFragment.SELECTION_LAYOUT && (
			parent == null || (parent.canUnselectItem && !parent.canUnselectItem(this))
		)) {
			return false;
		}
		this.selected = false;
		this.onUnselect && this.onUnselect();
		parent && parent.unselectItemInLayout && parent.unselectItemInLayout(this);
		this.updateSelection();
		return true;
	}
	setOnUnselectListener(listener) {
		if (listener != null) {
			this.onUnselect = listener;
		} else {
			delete this.onUnselect;
		}
		return this;
	}
	toggle() {
		if (this.selected) {
			return this.unselect();
		}
		return this.select();
	}

	private selectedBackground: Nullable<any>;
	private unselectedBackground: Nullable<any>;
	getSelectedBackground() {
		return this.selectedBackground || null;
	}
	setSelectedBackground(src) {
		this.selectedBackground = src;
		this.selected && this.updateSelection();
		return this;
	}
	getUnselectedBackground() {
		return this.unselectedBackground || null;
	}
	setUnselectedBackground(src) {
		this.unselectedBackground = src;
		this.selected || this.updateSelection();
		return this;
	}
	updateSelection() {
		if (this.selected) {
			this.setBackground(this.getSelectedBackground());
		} else {
			this.setBackground(this.getUnselectedBackground());
		}
		return this;
	}
}

namespace SelectableFragment {
	export const SELECTION_LAYOUT = 0;
	export const SELECTION_EXPLICIT = 1;
	export const SELECTION_DENIED = 2;

	export function parseJson(instanceOrJson, json?) {
		if (json.hasOwnProperty("selectionType")) {
			instanceOrJson.setSelectionType(calloutOrParse(json, json.selectionType, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("selectedBackground")) {
			instanceOrJson.setSelectedBackground(calloutOrParse(json, json.selectedBackground, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("unselectedBackground")) {
			instanceOrJson.setUnselectedBackground(calloutOrParse(json, json.unselectedBackground, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("selected") && calloutOrParse(json, json.selected, [this, instanceOrJson])) {
			instanceOrJson.select();
		}
		if (json.hasOwnProperty("select")) {
			instanceOrJson.setOnSelectListener(parseCallback(json, json.select, this));
		}
		if (json.hasOwnProperty("unselect")) {
			instanceOrJson.setOnUnselectListener(parseCallback(json, json.unselect, this));
		}
	}
}

interface ISelectableFragment<ABC = ISelectableFragment<any>> {
	selectionType?: CallableJsonProperty1<ABC, Nullable<number>>;
	selectedBackground?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
	unselectedBackground?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
	selected?: CallableJsonProperty1<ABC, boolean>;
	select?: (self: ABC) => any;
	unselect?: (self: ABC) => any;
}

abstract class SelectableLayoutFragment extends LayoutFragment {
	isItemSelected(itemOrIndex) {
		if (!(itemOrIndex instanceof Fragment)) {
			itemOrIndex = this.getFragmentAt(itemOrIndex);
		}
		if (itemOrIndex && itemOrIndex.isSelected) {
			return itemOrIndex.isSelected();
		}
		return false;
	}
	getSelectedItem() {
		let fragments = this.getFragments();
		for (let index = 0; index < fragments.length; index++) {
			let fragment = fragments[index] as SelectableFragment;
			if (fragment.isSelected && fragment.isSelected()) {
				return index;
			}
		}
		return -1;
	}
	getSelectedItems() {
		let selected = [];
		let fragments = this.getFragments();
		for (let index = 0; index < fragments.length; index++) {
			let fragment = fragments[index] as SelectableFragment;
			if (fragment.isSelected && fragment.isSelected()) {
				selected.push(index);
			}
		}
		return selected;
	}

	private selectionMode: number;
	getSelectionMode() {
		return this.selectionMode || SelectableLayoutFragment.MODE_NONE;
	}
	setSelectionMode(mode) {
		if (mode == null || this.getSelectionMode() == mode) {
			return;
		}
		if (mode == SelectableLayoutFragment.MODE_MULTIPLE) {
			this.selectionMode = mode;
			return;
		}
		let fragments = this.getFragments();
		for (let selected = false, offset = 0; offset < fragments.length; offset++) {
			let fragment = fragments[offset] as SelectableFragment;
			if (fragment.isSelected && fragment.isSelected()) {
				if (!selected && mode == SelectableLayoutFragment.MODE_SINGLE) {
					selected = true;
					continue;
				}
				fragment.unselect();
			}
		}
		this.selectionMode = mode;
	}
	selectItem(itemOrIndex) {
		if (!(itemOrIndex instanceof Fragment)) {
			itemOrIndex = this.getFragmentAt(itemOrIndex);
		}
		if (itemOrIndex && itemOrIndex.select) {
			return itemOrIndex.select();
		}
		return false;
	}
	unselectItem(itemOrIndex) {
		if (!(itemOrIndex instanceof Fragment)) {
			itemOrIndex = this.getFragmentAt(itemOrIndex);
		}
		if (itemOrIndex && itemOrIndex.unselect) {
			return itemOrIndex.unselect();
		}
		return false;
	}
	canSelectItem(item) {
		if (this.getSelectionMode() == SelectableLayoutFragment.MODE_NONE) {
			return false;
		}
		if (this.getSelectionMode() == SelectableLayoutFragment.MODE_SINGLE) {
			let fragments = this.getFragments();
			for (let offset = 0; offset < fragments.length; offset++) {
				let fragment = fragments[offset] as SelectableFragment;
				if (fragment.isSelected && fragment.isSelected() && !fragment.unselect()) {
					return false;
				}
			}
		}
		return true;
	}
	canUnselectItem(item) {
		return true;
	}

	protected onSelectItem: any;
	protected onUnselectItem: any;
	protected onHoldItem: any;
	selectItemInLayout(item) {
		this.onSelectItem && this.onSelectItem(item, item.getIndex());
	}
	setOnSelectItemListener(listener) {
		if (listener != null) {
			this.onSelectItem = listener;
		} else {
			delete this.onSelectItem;
		}
		return this;
	}
	unselectItemInLayout(item) {
		this.onUnselectItem && this.onUnselectItem(item, item.getIndex());
	}
	setOnUnselectItemListener(listener) {
		if (listener != null) {
			this.onUnselectItem = listener;
		} else {
			delete this.onUnselectItem;
		}
		return this;
	}
	holdItemInLayout(item) {
		if (this.isHoldActivatesMultipleSelection && this.isHoldActivatesMultipleSelection()) {
			this.setSelectionMode(SelectableLayoutFragment.MODE_MULTIPLE);
			if (this.canSelectItem(item)) {
				this.selectItem(item);
			}
			return true;
		}
		return (this.onHoldItem && this.onHoldItem(item, item.getIndex())) || false;
	}
	setOnHoldItemListener(listener) {
		if (listener != null) {
			this.onHoldItem = listener;
		} else {
			delete this.onHoldItem;
		}
		return this;
	}

	private holdActivatesMultipleSelection: boolean;
	isHoldActivatesMultipleSelection() {
		return this.holdActivatesMultipleSelection || false;
	}
	setHoldActivatesMultipleSelection(enabled) {
		if (this.holdActivatesMultipleSelection == enabled) {
			return;
		}
		this.holdActivatesMultipleSelection = !!enabled;
	}
}

namespace SelectableLayoutFragment {
	export const MODE_NONE = 0;
	export const MODE_SINGLE = 1;
	export const MODE_MULTIPLE = 2;

	export function parseJson(instanceOrJson, json?) {
		if (json.hasOwnProperty("selectionMode")) {
			instanceOrJson.setSelectionMode(calloutOrParse(json, json.selectionMode, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("holdActivatesMultipleSelection")) {
			instanceOrJson.setHoldActivatesMultipleSelection(calloutOrParse(json, json.holdActivatesMultipleSelection, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("selectedItem")) {
			instanceOrJson.selectItem(calloutOrParse(json, json.selectedItem, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("selectItem")) {
			instanceOrJson.setOnSelectItemListener(parseCallback(json, json.selectItem, this));
		}
		if (json.hasOwnProperty("unselectItem")) {
			instanceOrJson.setOnUnselectItemListener(parseCallback(json, json.unselectItem, this));
		}
		if (json.hasOwnProperty("holdItem")) {
			instanceOrJson.setOnHoldItemListener(parseCallback(json, json.holdItem, this));
		}
	}
}

interface ISelectableLayoutFragment<ABC = ISelectableLayoutFragment<any>> {
	selectionType?: CallableJsonProperty1<ABC, Nullable<number>>;
	holdActivatesMultipleSelection?: CallableJsonProperty1<ABC, boolean>;
	selectedItem?: CallableJsonProperty1<ABC, Nullable<IBaseFragment | number>>;
	selectItem?: (self: ABC, item: ISelectableFragment, index: number) => void;
	unselectItem?: (self: ABC, item: ISelectableFragment, index: number) => void;
	holdItem?: (self: ABC, item: ISelectableFragment, index: number) => boolean;
}
