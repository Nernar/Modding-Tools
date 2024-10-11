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
		parent && parent.selectItemLayout && parent.selectItemLayout(this);
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
		parent && parent.unselectItemLayout && parent.unselectItemLayout(this);
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
	if (json.hasOwnProperty("select")) {
		instanceOrJson.setOnSelectListener(parseCallback(json, json.select, this));
	}
	if (json.hasOwnProperty("unselect")) {
		instanceOrJson.setOnUnselectListener(parseCallback(json, json.unselect, this));
	}
};

