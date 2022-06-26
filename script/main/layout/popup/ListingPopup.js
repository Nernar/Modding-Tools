const ListingPopup = function() {
	ExpandablePopup.apply(this, arguments);
	this.views = {
		edits: [],
		buttons: []
	};
};

ListingPopup.prototype = new ExpandablePopup;
ListingPopup.prototype.TYPE = "ListingPopup";

ListingPopup.prototype.addButtonElement = function(name, click) {
	let views = this.views,
		elements = this,
		index = views.buttons.length;
	views.buttons[index] = new android.widget.TextView(getContext());
	views.buttons[index].setPadding(toComplexUnitDip(20), 0, toComplexUnitDip(20), 0);
	views.buttons[index].setOnClickListener(function(view) {
		tryout(function() {
			click && click();
			elements.__click && elements.__click(index);
			elements.__mode && elements.selectButton(index);
		});
	});
	views.buttons[index].setTextSize(toComplexUnitSp(8));
	views.buttons[index].setGravity($.Gravity.CENTER);
	views.buttons[index].setTextColor($.Color.WHITE);
	if (name) views.buttons[index].setText(name);
	views.buttons[index].setTypeface(typeface);
	this.getFragment().getContainerLayout().addView(views.buttons[index], new android.widget.RelativeLayout.LayoutParams
		(toComplexUnitDip(200), toComplexUnitDip(56)));
	return this.getButton(index);
};

ListingPopup.prototype.addEditElement = function(hint, value) {
	let scope = this,
		views = this.views,
		index = views.edits.length;
	views.edits[index] = new android.widget.EditText(getContext());
	views.edits[index].setInputType(android.text.InputType.TYPE_CLASS_TEXT |
		android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
		android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	views.edits[index].setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
		android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
	views.edits[index].setPadding(toComplexUnitDip(12), toComplexUnitDip(12),
		toComplexUnitDip(12), toComplexUnitDip(12));
	views.edits[index].setHintTextColor($.Color.LTGRAY);
	views.edits[index].setTextSize(toComplexUnitSp(7));
	views.edits[index].setTextColor($.Color.WHITE);
	if (value) views.edits[index].setText(String(value));
	if (hint) views.edits[index].setHint(String(hint));
	views.edits[index].setSingleLine(false);
	views.edits[index].setTypeface(typeface);
	views.edits[index].setHorizontallyScrolling(true);
	views.edits[index].setFocusableInTouchMode(true);
	views.edits[index].setOnClickListener(function(view) {
		view.requestFocus() && scope.update();
		let ims = getContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
		ims.showSoftInput(view, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
	});
	this.getFragment().getContainerLayout().addView(views.edits[index]);
	if (!this.isFocusable()) this.setFocusable(true);
	return this.getEdit(index);
};

ListingPopup.prototype.getButton = function(index) {
	let button = this.views.buttons[index],
		visible = true;
	return {
		view: button,
		isVisible: function() {
			return visible;
		},
		setBackground: function(texture) {
			if (!(texture instanceof Drawable)) {
				texture = Drawable.parseJson.call(this, texture);
			}
			texture.attachAsBackground(this.view);
			this.background = texture;
			return this;
		},
		getBackground: function() {
			return this.background || null;
		},
		switchVisibility: function() {
			if (visible) this.view.setVisibility($.View.GONE);
			else this.view.setVisibility($.View.VISIBLE);
			visible = !visible;
			return this;
		}
	};
};

ListingPopup.prototype.getEdit = function(index) {
	let edit = this.views.edits[index],
		visible = true;
	return {
		isVisible: function() {
			return visible;
		},
		getValue: function() {
			let editable = edit.getText();
			return String(editable.toString());
		},
		setValue: function(text) {
			edit.setText(String(text));
			return this;
		},
		setBackground: function(texture) {
			if (!(texture instanceof Drawable)) {
				texture = Drawable.parseJson.call(this, texture);
			}
			texture.attachAsBackground(edit);
			this.background = texture;
			return this;
		},
		getBackground: function() {
			return this.background || null;
		},
		switchVisibility: function() {
			if (visible) edit.setVisibility($.View.GONE);
			else edit.setVisibility($.View.VISIBLE);
			visible = !visible;
			return this;
		}
	};
};

ListingPopup.prototype.getAllEditsValues = function() {
	let edits = this.views.edits,
		values = [];
	for (let item in edits) {
		values.push(this.getEdit(item).getValue());
	}
	return values;
};

ListingPopup.prototype.selectButton = function(index) {
	let buttons = this.views.buttons;
	this.unselect();
	if (index !== undefined) {
		buttons[index] && new BitmapDrawable("popupSelectionSelected").attachAsBackground(buttons[index]);
		this.__select && this.__select(index);
		this.selected = index;
	} else delete this.selected;
};

ListingPopup.prototype.unselect = function() {
	let buttons = this.views.buttons,
		selected = this.selected;
	if (selected !== undefined && buttons[selected]) {
		buttons[selected].setBackgroundDrawable(null);
	}
};

ListingPopup.prototype.setOnSelectListener = function(listener) {
	this.__select = function(index) {
		tryout(function() {
			listener && listener(index);
		});
	};
};

ListingPopup.prototype.setOnClickListener = function(listener) {
	this.__click = function(index) {
		tryout(function() {
			listener && listener(index);
		});
	};
};

ListingPopup.prototype.setSelectMode = function(enabled) {
	this.__mode = enabled;
};
