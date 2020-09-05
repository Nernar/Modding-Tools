function CoordsPopup() {
	this.reset = function() {
		var views = (this.views = { groups: [], buttons: [] }),
			groups = (this.groups = []);
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
		var views = this.views, index = views.buttons.length;
		views.buttons[index] = new android.widget.TextView(context);
		views.buttons[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Ui.getY(84)));
		views.buttons[index].setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
		views.buttons[index].setPadding(Ui.getY(30), 0, Ui.getY(30), 0);
		if (click) views.buttons[index].setOnClickListener(click);
		views.buttons[index].setTextSize(Ui.getFontSize(21));
		views.buttons[index].setGravity(Ui.Gravity.CENTER);
		views.buttons[index].setTextColor(Ui.Color.WHITE);
		if (name) views.buttons[index].setText(name);
		views.buttons[index].setTypeface(typeface);
		views.layout.addView(views.buttons[index]);
	};
	this.addGroup = function(name) {
		var views = this.views, mathes = this.mathes, index = views.groups.length;
		views.groups[index] = new android.widget.LinearLayout(context);
		views.groups[index].setPadding(Ui.getY(10), index == 0 ? Ui.getY(10) : 0, Ui.getY(10), Ui.getY(10));
		views.layout.addView(views.groups[index]);
		
		var text = new android.widget.TextView(context);
		text.setLayoutParams(new android.view.ViewGroup.LayoutParams(Ui.getY(60), -2));
		text.setPadding(Ui.getY(10), Ui.getY(10), Ui.getY(10), Ui.getY(10));
		text.setTextSize(Ui.getFontSize(32));
		text.setTextColor(Ui.Color.WHITE);
		if (name) text.setText(name);
		text.setTypeface(typeface);
		text.setMaxLines(1);
		views.groups[index].addView(text);
		
		var content = new android.widget.LinearLayout(context);
		content.setOrientation(Ui.Orientate.VERTICAL);
		views.groups[index].addView(content);
		
		return this.groups[index] = {
			items: [],
			addItem: function(current) {
				var elements = this,
					index = this.items.length,
					item = (this.items[index] = {
						views: new Object(),
						current: [current, 0],
						mathes: mathes || [16, 32, 64]
					});
				item.views.root = new android.widget.LinearLayout(context);
				item.views.root.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
				item.views.root.setPadding(Ui.getY(12), Ui.getY(12), Ui.getY(12), Ui.getY(12));
				content.addView(item.views.root);
				var params = new android.view.ViewGroup.LayoutParams(Ui.getY(60), Ui.getY(60));
				
				item.views.minus = new android.widget.ImageView(context);
				item.views.minus.setImageDrawable(ImageFactory.getDrawable("controlDimensionMinus"));
				item.views.minus.setOnClickListener(function(view) {
					try {
						var current = item.mathes[item.current[1]];
						item.current[0] = preround(item.current[0] - (current > 0 ? 1 / current : current));
						if (elements.onChange) elements.onChange(index, item.current[0]);
						elements.updateMather(index);
					} catch (e) {
						reportError(e);
					}
				});
				item.views.minus.setLayoutParams(params);
				item.views.root.addView(item.views.minus);
				
				item.views.mather = new android.widget.TextView(context);
				item.views.mather.setLayoutParams(new android.view.ViewGroup.LayoutParams(Ui.getY(160), -1));
				item.views.mather.setPadding(Ui.getY(12), 0, Ui.getY(12), 0);
				item.views.mather.setOnClickListener(function(view) {
					try {
						item.current[1]++;
						item.current[1] == item.mathes.length && (item.current[1] = 0);
						elements.updateMather(index);
					} catch (e) {
						reportError(e);
					}
				});
				item.views.mather.setOnLongClickListener(function(view) {
					try {
						if (elements.onLongChange) {
							item.current[0] = preround(elements.onLongChange(index));
							if (elements.onChange) elements.onChange(index, item.current[0]);
							elements.updateMather(index);
							return true;
						}
					} catch (e) {
						reportError(e);
					}
					return false;
				});
				item.views.mather.setTextSize(Ui.getFontSize(21));
				item.views.mather.setGravity(Ui.Gravity.CENTER);
				item.views.mather.setTextColor(Ui.Color.WHITE);
				item.views.mather.setTypeface(typeface);
				item.views.mather.setMaxLines(1);
				item.views.root.addView(item.views.mather);
				elements.updateMather(index);
				
				item.views.plus = new android.widget.ImageView(context);
				item.views.plus.setImageDrawable(ImageFactory.getDrawable("controlDimensionPlus"));
				item.views.plus.setOnClickListener(function(view) {
					try {
						var current = item.mathes[item.current[1]];
						item.current[0] = preround(item.current[0] + (current > 0 ? 1 / current : current));
						if (elements.onChange) elements.onChange(index, item.current[0]);
						elements.updateMather(index);
					} catch (e) {
						reportError(e);
					}
				});
				item.views.plus.setLayoutParams(params);
				item.views.root.addView(item.views.plus);
			},
			setOnChangeListener: function(change) {
				this.onChange = change;
			},
			setOnLongChangeListener: function(change) {
				this.onLongChange = change;
			},
			setName: function(name) {
				if (text) text.setText(name);
			},
			removeName: function() {
				views.groups[index].removeView(text);
				text = null;
			},
			updateMather: function(index) {
				var item = this.items[index], current = item.mathes[item.current[1]];
				item.views.mather.setText(current == 1 ? "" + item.current[0] :
					current > 0 ? preround(item.current[0] * current) + " : " + current :
					preround(item.current[0] / current) + " * " + (-current));
			}
		};
	};
	this.callLongChangeForAll = function() {
		for (var i in this.groups)
			if (this.groups[i].onLongChange)
				for (var f in this.groups[i].items) {
					var item = this.groups[i].items[f], group = this.groups[i];
					item.current[0] = preround(group.onLongChange(f));
					if (group.onChange) group.onChange(f, item.current[0]);
					group.updateMather(f);
				}
	};
	this.setOnShowListener = function(listener) {
		this.__show = function() {
			try { listener && listener(); }
			catch(e) { reportError(e); }
		};
	};
	this.setOnUpdateListener = function(listener) {
		this.__update = function() {
			try { listener && listener(); }
			catch(e) { reportError(e); }
		};
	};
	this.setOnHideListener = function(listener) {
		this.__hide = function() {
			try { listener && listener(); }
			catch(e) { reportError(e); }
		};
	};
	this.setBaseMathes = function(mathes) {
		if (mathes) this.mathes = mathes;
	};
	this.setTitle = function(title) {
		this.views.title.setText(title);
	};
	this.update = function() {};
	this.show = function() {
		var views = this.views;
		views.root.post(function() {
			var animate = android.view.animation.AlphaAnimation(0, 1);
			views.layout.startAnimation(animate);
			animate.setDuration(400);
		});
		var place = Popups.getAvailablePlace();
		this.window = new android.widget.PopupWindow(views.root, Ui.Display.WRAP, Ui.Display.WRAP);
		this.window.setAttachedInDecor(false);
		this.window.showAtLocation(context.getWindow().getDecorView(), 0, place.x, place.y);
		this.__show && this.__show();
	};
	this.hide = function() {
		var _ = this, views = this.views;
		if (this.window) {
			var animate = android.view.animation.AlphaAnimation(1, 0);
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
