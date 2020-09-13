function ListingPopup() {
	this.reset = function() {
		let views = (this.views = { edits: [], buttons: [] });
		views.root = new android.widget.FrameLayout(context);
		views.layout = new android.widget.LinearLayout(context);
		views.layout.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
		views.layout.setOrientation(Ui.Orientate.VERTICAL);
		views.root.addView(views.layout);
		
		views.title = new android.widget.TextView(context);
		views.title.setPadding(Ui.getY(30), Ui.getY(18), Ui.getY(30), Ui.getY(18));
		views.title.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
		views.title.setTextSize(Ui.getFontSize(24));
		views.title.setGravity(Ui.Gravity.CENTER);
		views.title.setTextColor(Ui.Color.WHITE);
		views.title.setTypeface(typeface);
		views.layout.addView(views.title);
	};
	this.addButtonElement = function(name, click) {
		let views = this.views, elements = this, index = views.buttons.length;
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
		views.layout.addView(views.buttons[index]);
		return this.getButton(index);
	};
	this.addEditElement = function(hint, value) {
		let views = this.views, index = views.edits.length;
		views.edits[index] = new android.widget.EditText(context);
		views.edits[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Ui.getY(84)));
		views.edits[index].setInputType(android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
		views.edits[index].setPadding(Ui.getY(18), Ui.getY(18), Ui.getY(18), Ui.getY(18));
		views.edits[index].setHintTextColor(Ui.Color.LTGRAY);
		views.edits[index].setTextSize(Ui.getFontSize(18));
		views.edits[index].setTextColor(Ui.Color.WHITE);
		if (value) views.edits[index].setText("" + value);
		if (hint) views.edits[index].setHint("" + hint);
		views.edits[index].setTypeface(typeface);
		views.layout.addView(views.edits[index]);
		return this.getEdit(index);
	};
	this.getButton = function(index) {
		let button = this.views.buttons[index], visible = true;
		return {
			setBackground: function(texture) {
				button.setBackgroundDrawable(ImageFactory.getDrawable(texture));
				return this;
			},
			switchVisibility: function() {
				if (visible) button.setVisibility(Ui.Visibility.GONE);
				else button.setVisibility(Ui.Visibility.VISIBLE);
				visible = !visible;
				return this;
			}
		};
	};
	this.getEdit = function(index) {
		let edit = this.views.edits[index], visible = true;
		return {
			getValue: function() {
				let editable = edit.getText();
				return editable.toString() || "";
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
	this.getAllEditsValues = function() {
		let edits = this.views.edits, values = new Array();
		for (let i in edits) values.push(this.getEdit(i).getValue());
		return values;
	};
	this.selectButton = function(index) {
		let buttons = this.views.buttons;
		this.unselect();
		if (index + "" != "undefined") {
			buttons[index] && buttons[index].setBackgroundDrawable
				(ImageFactory.getDrawable("popupSelectionSelected"));
			this.__select && this.__select(index);
			this.selected = index;
		} else delete this.selected;
	};
	this.unselect = function() {
		let buttons = this.views.buttons, selected = this.selected;
		if (selected + "" != "undefined" && buttons[selected])
			buttons[selected].setBackgroundDrawable(null);
	};
	this.setOnSelectListener = function(listener) {
		this.__select = function(index) {
			try { listener && listener(index); }
			catch (e) { reportError(e); }
		};
	};
	this.setOnClickListener = function(listener) {
		this.__click = function(index) {
			try { listener && listener(index); }
			catch (e) { reportError(e); }
		};
	};
	this.setOnShowListener = function(listener) {
		this.__show = function() {
			try { listener && listener(); }
			catch (e) { reportError(e); }
		};
	};
	this.setOnUpdateListener = function(listener) {
		this.__update = function() {
			try { listener && listener(); }
			catch (e) { reportError(e); }
		};
	};
	this.setOnHideListener = function(listener) {
		this.__hide = function() {
			try { listener && listener(); }
			catch (e) { reportError(e); }
		};
	};
	this.setSelectMode = function(enabled) {
		this.__mode = enabled;
	};
	this.setTitle = function(title) {
		this.views.title.setText(title);
	};
	this.update = function() {};
	this.show = function() {
		let views = this.views;
		views.root.post(function() {
			let animate = android.view.animation.AlphaAnimation(0, 1);
			views.layout.startAnimation(animate);
			animate.setDuration(400);
		});
		let place = Popups.getAvailablePlace();
		this.window = new android.widget.PopupWindow(views.root, Ui.Display.WRAP, Ui.Display.WRAP);
		this.focusable = views.edits.length > 0 && (this.window.setFocusable(true), true);
		this.window.setAttachedInDecor(false);
		this.window.showAtLocation(context.getWindow().getDecorView(), 0, place.x, place.y);
		this.__show && this.__show();
	};
	this.hide = function() {
		let _ = this, views = this.views;
		if (this.window) {
			let animate = android.view.animation.AlphaAnimation(1, 0);
			views.layout.startAnimation(animate);
			animate.setDuration(400);
			views.root.postDelayed(function() {
				_.window.dismiss();
				delete _.window;
				_.__hide && _.__hide();
			}, 400);
		}
	};
	this.reset();
}
