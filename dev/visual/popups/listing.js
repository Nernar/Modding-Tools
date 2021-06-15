const ListingPopup = function() {
	FocusablePopup.call(this);
};

ListingPopup.prototype = new FocusablePopup;
ListingPopup.prototype.TYPE = "ListingPopup";

ListingPopup.prototype.reset = function() {
	FocusablePopup.prototype.reset.call(this);
	this.views.edits = new Array();
	this.views.buttons = new Array();
};

ListingPopup.prototype.addButtonElement = function(name, click) {
	let views = this.views,
		elements = this,
		index = views.buttons.length;
	views.buttons[index] = new android.widget.TextView(context);
	views.buttons[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(Interface.getY(300), Interface.getY(84)));
	views.buttons[index].setPadding(Interface.getY(30), 0, Interface.getY(30), 0);
	views.buttons[index].setOnClickListener(function(view) {
		tryout(function() {
			click && click();
			elements.__click && elements.__click(index);
			elements.__mode && elements.selectButton(index);
		});
	});
	views.buttons[index].setTextSize(Interface.getFontSize(21));
	views.buttons[index].setGravity(Interface.Gravity.CENTER);
	views.buttons[index].setTextColor(Interface.Color.WHITE);
	if (name) views.buttons[index].setText(name);
	views.buttons[index].setTypeface(typeface);
	views.content.addView(views.buttons[index]);
	return this.getButton(index);
};

ListingPopup.prototype.addEditElement = function(hint, value) {
	let scope = this,
		views = this.views,
		index = views.edits.length;
	views.edits[index] = new android.widget.EditText(context);
	views.edits[index].setInputType(android.text.InputType.TYPE_CLASS_TEXT |
		android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
		android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	views.edits[index].setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
		android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
	views.edits[index].setPadding(Interface.getY(18), Interface.getY(18), Interface.getY(18), Interface.getY(18));
	views.edits[index].setHintTextColor(Interface.Color.LTGRAY);
	views.edits[index].setTextSize(Interface.getFontSize(19));
	views.edits[index].setTextColor(Interface.Color.WHITE);
	if (value) views.edits[index].setText(String(value));
	if (hint) views.edits[index].setHint(String(hint));
	views.edits[index].setSingleLine(false);
	views.edits[index].setTypeface(typeface);
	views.edits[index].setHorizontallyScrolling(true);
	views.edits[index].setFocusableInTouchMode(true);
	views.edits[index].setOnClickListener(function(view) {
		view.requestFocus() && scope.update();
		let ims = context.getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
		ims.showSoftInput(view, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
	});
	views.content.addView(views.edits[index]);
	if (!this.isFocusable()) this.setFocusable(true);
	return this.getEdit(index);
};

ListingPopup.prototype.getButton = function(index) {
	let button = this.views.buttons[index],
		visible = true;
	return {
		view: button,
		setBackground: function(texture) {
			this.view.setBackgroundDrawable(ImageFactory.getDrawable(texture));
			return this;
		},
		switchVisibility: function() {
			if (visible) this.view.setVisibility(Interface.Visibility.GONE);
			else this.view.setVisibility(Interface.Visibility.VISIBLE);
			visible = !visible;
			return this;
		}
	};
};

ListingPopup.prototype.getEdit = function(index) {
	let edit = this.views.edits[index],
		visible = true;
	return {
		getValue: function() {
			let editable = edit.getText();
			return String(editable.toString());
		},
		setBackground: function(texture) {
			edit.setBackgroundDrawable(ImageFactory.getDrawable(texture));
			return this;
		},
		switchVisibility: function() {
			if (visible) edit.setVisibility(Interface.Visibility.GONE);
			else edit.setVisibility(Interface.Visibility.VISIBLE);
			visible = !visible;
			return this;
		}
	};
};

ListingPopup.prototype.getAllEditsValues = function() {
	let edits = this.views.edits,
		values = new Array();
	for (let item in edits) {
		values.push(this.getEdit(item).getValue());
	}
	return values;
};

ListingPopup.prototype.selectButton = function(index) {
	let buttons = this.views.buttons;
	this.unselect();
	if (index !== undefined) {
		buttons[index] && buttons[index].setBackgroundDrawable(ImageFactory.getDrawable("popupSelectionSelected"));
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
