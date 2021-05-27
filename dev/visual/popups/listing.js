const ListingPopup = function() {
	this.reset();
};

ListingPopup.prototype = assign(FocusablePopup.prototype);
ListingPopup.prototype.TYPE = "ListingPopup";

ListingPopup.prototype.__resetFP = FocusablePopup.prototype.reset;
ListingPopup.prototype.reset = function() {
	this.__resetFP && this.__resetFP();
	this.views.edits = new Array();
	this.views.buttons = new Array();
};

ListingPopup.prototype.addButtonElement = function(name, click) {
	let views = this.views,
		elements = this,
		index = views.buttons.length;
	views.buttons[index] = new android.widget.TextView(context);
	views.buttons[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(Ui.getY(300), Ui.getY(84)));
	views.buttons[index].setPadding(Ui.getY(30), 0, Ui.getY(30), 0);
	views.buttons[index].setOnClickListener(function(view) {
		try {
			click && click();
			elements.__click && elements.__click(index);
			elements.__mode && elements.selectButton(index);
		} catch (e) {
			reportError(e);
		}
	});
	views.buttons[index].setTextSize(Ui.getFontSize(21));
	views.buttons[index].setGravity(Ui.Gravity.CENTER);
	views.buttons[index].setTextColor(Ui.Color.WHITE);
	if (name) views.buttons[index].setText(name);
	views.buttons[index].setTypeface(typeface);
	views.content.addView(views.buttons[index]);
	return this.getButton(index);
};

ListingPopup.prototype.addEditElement = function(hint, value) {
	let views = this.views,
		index = views.edits.length;
	views.edits[index] = new android.widget.EditText(context);
	views.edits[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Ui.getY(84)));
	views.edits[index].setInputType(android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	views.edits[index].setPadding(Ui.getY(18), Ui.getY(18), Ui.getY(18), Ui.getY(18));
	views.edits[index].setHintTextColor(Ui.Color.LTGRAY);
	views.edits[index].setTextSize(Ui.getFontSize(18));
	views.edits[index].setTextColor(Ui.Color.WHITE);
	if (value) views.edits[index].setText(String(value));
	if (hint) views.edits[index].setHint(String(hint));
	views.edits[index].setTypeface(typeface);
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
			if (visible) this.view.setVisibility(Ui.Visibility.GONE);
			else this.view.setVisibility(Ui.Visibility.VISIBLE);
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
			if (visible) edit.setVisibility(Ui.Visibility.GONE);
			else edit.setVisibility(Ui.Visibility.VISIBLE);
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
		try { listener && listener(index); }
		catch (e) { reportError(e); }
	};
};

ListingPopup.prototype.setOnClickListener = function(listener) {
	this.__click = function(index) {
		try { listener && listener(index); }
		catch (e) { reportError(e); }
	};
};

ListingPopup.prototype.setSelectMode = function(enabled) {
	this.__mode = enabled;
};
