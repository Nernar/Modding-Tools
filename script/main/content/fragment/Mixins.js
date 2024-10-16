const TextFragmentMixin = {
	getTextView() {
		MCSystem.throwException("Modding Tools: TextFragmentMixin.getTextView (in " + this.TYPE + ") must be implemented!");
	},
	/**
	 * @requires `isCLI()`
	 */
	render(hovered) {
		return this.text;
	},
	getText() {
		if (isAndroid()) {
			let view = this.getTextView();
			return "" + view.getText();
		}
		return this.text || null;
	},
	append(text) {
		if (isAndroid()) {
			let view = this.getTextView();
			view.append("" + text);
		} else {
			this.text += text;
		}
		return this;
	},
	setText(text) {
		if (isAndroid()) {
			let view = this.getTextView();
			view.setText("" + text);
		} else {
			this.text = "" + text;
		}
		return this;
	}
};

const ImageFragmentMixin = {
	getImageView() {
		MCSystem.throwException("Modding Tools: ImageFragmentMixin.getImageView (in " + this.TYPE + ") must be implemented!");
	},
	/**
	 * @requires `isCLI()`
	 */
	render(hovered) {
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
	},
	getImage() {
		return this.image || null;
	},
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
};

const SelectableFragment = function() {
	MCSystem.throwException("Modding Tools: SelectableFragment is mixin abstraction!");
};

SelectableFragment.SELECTION_LAYOUT = 0;
SelectableFragment.SELECTION_EXPLICIT = 1;
SelectableFragment.SELECTION_DENIED = 2;

SelectableFragment.prototype = {
	getSelectionType() {
		return this.selectionType || SelectableFragment.SELECTION_LAYOUT;
	},
	setSelectionType(type) {
		if (type == null || this.getSelectionType() == type) {
			return;
		}
		if (this.selected && type == SelectableFragment.SELECTION_DENIED) {
			this.unselect();
		}
		this.selectionType = type;
	},
	isSelected() {
		return this.selected || false;
	},
	select() {
		if (this.selected || this.getSelectionType() == SelectableFragment.SELECTION_DENIED) {
			return false;
		}
		let parent = this.getParent();
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
	},
	unselect() {
		if (!this.selected) {
			return false;
		}
		let parent = this.getParent();
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
	},
	toggle() {
		if (this.selected) {
			return this.unselect();
		}
		return this.select();
	},
	getSelectedBackground() {
		return this.selectedBackground || null;
	},
	setSelectedBackground(src) {
		this.selectedBackground = src;
		this.selected && this.updateSelection();
		return this;
	},
	getUnselectedBackground() {
		return this.unselectedBackground || null;
	},
	setUnselectedBackground(src) {
		this.unselectedBackground = src;
		this.selected || this.updateSelection();
		return this;
	},
	updateSelection() {
		if (this.selected) {
			this.setBackground(this.getSelectedBackground());
		} else {
			this.setBackground(this.getUnselectedBackground());
		}
		return this;
	},
	setOnSelectListener(listener) {
		if (listener != null) {
			this.onSelect = listener.bind(this);
		} else {
			delete this.onSelect;
		}
		return this;
	},
	setOnUnselectListener(listener) {
		if (listener != null) {
			this.onUnselect = listener.bind(this);
		} else {
			delete this.onUnselect;
		}
		return this;
	}
};

SelectableFragment.parseJson = function(instanceOrJson, json) {
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
};

const SelectableLayoutFragment = function() {
	MCSystem.throwException("Modding Tools: SelectableLayoutFragment is mixin abstraction!");
};

SelectableLayoutFragment.MODE_NONE = 0;
SelectableLayoutFragment.MODE_SINGLE = 1;
SelectableLayoutFragment.MODE_MULTIPLE = 2;

SelectableLayoutFragment.prototype = {
	getSelectionMode() {
		return this.selectionMode || SelectableLayoutFragment.MODE_NONE;
	},
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
			let fragment = fragments[offset];
			if (fragment.isSelected && fragment.isSelected()) {
				if (!selected && mode == SelectableLayoutFragment.MODE_SINGLE) {
					selected = true;
					continue;
				}
				fragment.unselect();
			}
		}
		this.selectionMode = mode;
	},
	isHoldActivatesMultipleSelection() {
		return this.holdActivatesMultipleSelection || false;
	},
	setHoldActivatesMultipleSelection(enabled) {
		if (this.holdActivatesMultipleSelection == enabled) {
			return;
		}
		this.holdActivatesMultipleSelection = !!enabled;
	},
	isItemSelected(itemOrIndex) {
		if (!(itemOrIndex instanceof Fragment)) {
			itemOrIndex = this.getFragmentAt(itemOrIndex);
		}
		if (itemOrIndex && itemOrIndex.isSelected) {
			return itemOrIndex.isSelected();
		}
		return false;
	},
	getSelectedItem() {
		let fragments = this.getFragments();
		for (let index = 0; index < fragments.length; index++) {
			let fragment = fragments[index];
			if (fragment.isSelected && fragment.isSelected()) {
				return index;
			}
		}
		return -1;
	},
	getSelectedItems() {
		let selected = [];
		let fragments = this.getFragments();
		for (let index = 0; index < fragments.length; index++) {
			let fragment = fragments[index];
			if (fragment.isSelected && fragment.isSelected()) {
				selected.push(index);
			}
		}
		return selected;
	},
	selectItem(itemOrIndex) {
		if (!(itemOrIndex instanceof Fragment)) {
			itemOrIndex = this.getFragmentAt(itemOrIndex);
		}
		if (itemOrIndex && itemOrIndex.select) {
			return itemOrIndex.select();
		}
		return false;
	},
	unselectItem(itemOrIndex) {
		if (!(itemOrIndex instanceof Fragment)) {
			itemOrIndex = this.getFragmentAt(itemOrIndex);
		}
		if (itemOrIndex && itemOrIndex.unselect) {
			return itemOrIndex.unselect();
		}
		return false;
	},
	canSelectItem(item) {
		if (this.getSelectionMode() == SelectableLayoutFragment.MODE_NONE) {
			return false;
		}
		if (this.getSelectionMode() == SelectableLayoutFragment.MODE_SINGLE) {
			let fragments = this.getFragments();
			for (let offset = 0; offset < fragments.length; offset++) {
				let fragment = fragments[offset];
				if (fragment.isSelected && fragment.isSelected() && !fragment.unselect()) {
					return false;
				}
			}
		}
		return true;
	},
	canUnselectItem(item) {
		return true;
	},
	selectItemInLayout(item) {
		this.onSelectItem && this.onSelectItem(item, item.getIndex());
	},
	unselectItemInLayout(item) {
		this.onUnselectItem && this.onUnselectItem(item, item.getIndex());
	},
	holdItemInLayout(item) {
		if (this.isHoldActivatesMultipleSelection && this.isHoldActivatesMultipleSelection()) {
			this.setSelectionMode(SelectableLayoutFragment.MODE_MULTIPLE);
			if (this.canSelectItem(item)) {
				this.selectItem(position);
			}
			return true;
		}
		return (this.onHoldItem && this.onHoldItem(item, item.getIndex())) || false;
	},
	setOnSelectItemListener(listener) {
		if (listener != null) {
			this.onSelectItem = listener.bind(this);
		} else {
			delete this.onSelectItem;
		}
		return this;
	},
	setOnUnselectItemListener(listener) {
		if (listener != null) {
			this.onUnselectItem = listener.bind(this);
		} else {
			delete this.onUnselectItem;
		}
		return this;
	},
	setOnHoldItemListener(listener) {
		if (listener != null) {
			this.onHoldItem = listener.bind(this);
		} else {
			delete this.onHoldItem;
		}
		return this;
	}
};

SelectableLayoutFragment.parseJson = function(instanceOrJson, json) {
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
};
