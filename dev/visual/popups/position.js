const CoordsPopup = function() {
	this.reset();
};

CoordsPopup.prototype = new ListingPopup;
CoordsPopup.prototype.TYPE = "CoordsPopup";
CoordsPopup.prototype.__resetLP = ListingPopup.prototype.reset;

CoordsPopup.prototype.reset = function() {
	this.__resetLP && this.__resetLP();
	this.views.groups = new Array();
	this.views.titles = new Array();
	this.views.containers = new Array();
	this.groups = new Array();
};

CoordsPopup.prototype.__addButtonElementLP = ListingPopup.prototype.addButtonElement;

CoordsPopup.prototype.addButtonElement = function(name, click) {
	if (!this.__addButtonElementLP) {
		return null;
	}
	let button = this.__addButtonElementLP(name, click);
	button.setBackground("popupBackground");
	return button;
};

CoordsPopup.prototype.addGroup = function(name) {
	let views = this.views,
		index = views.groups.length;
	views.groups[index] = new android.widget.LinearLayout(context);
	views.groups[index].setPadding(Ui.getY(10), index == 0 ? Ui.getY(10) : 0, Ui.getY(10), Ui.getY(10));
	views.content.addView(views.groups[index]);

	views.titles[index] = new android.widget.TextView(context);
	views.titles[index].setLayoutParams(new android.view.ViewGroup.LayoutParams(Ui.getY(60), Ui.Display.MATCH));
	views.titles[index].setPadding(Ui.getY(10), Ui.getY(10), Ui.getY(10), Ui.getY(10));
	views.titles[index].setTextSize(Ui.getFontSize(32));
	views.titles[index].setTextColor(Ui.Color.WHITE);
	if (name) views.titles[index].setText(name);
	views.titles[index].setTypeface(typeface);
	views.titles[index].setMaxLines(1);
	views.groups[index].addView(views.titles[index]);

	views.containers[index] = new android.widget.LinearLayout(context);
	views.containers[index].setOrientation(Ui.Orientate.VERTICAL);
	views.groups[index].addView(views.containers[index]);
	return this.getGroup(index);
};

CoordsPopup.prototype.getGroup = function(position) {
	if (this.groups[position]) {
		return this.groups[position];
	}
	let views = this.views, mathes = this.mathes;
	return this.groups[position] = {
		items: [],
		addItem: function(current) {
			let elements = this,
				index = this.items.length,
				item = (this.items[index] = {
					views: new Object(),
					current: [current, 0],
					mathes: mathes || [16, 32, 64]
				});
			item.views.root = new android.widget.LinearLayout(context);
			item.views.root.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
			item.views.root.setPadding(Ui.getY(12), Ui.getY(12), Ui.getY(12), Ui.getY(12));
			views.containers[position].addView(item.views.root);
			let params = new android.view.ViewGroup.LayoutParams(Ui.getY(60), Ui.getY(60));

			item.views.minus = new android.widget.ImageView(context);
			item.views.minus.setImageDrawable(ImageFactory.getDrawable("controlDimensionMinus"));
			item.views.minus.setOnClickListener(function(view) {
				try {
					let current = item.mathes[item.current[1]];
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
					let current = item.mathes[item.current[1]];
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
			if (views.titles[position]) {
				views.titles[position].setText(name);
			}
		},
		removeName: function() {
			if (!views.titles[position]) {
				return;
			}
			views.groups[position].removeView(views.titles[position]);
			views.titles.splice(position, 1);
		},
		updateMather: function(index) {
			let item = this.items[index],
				current = item.mathes[item.current[1]];
			item.views.mather.setText(current == 1 ? "" + item.current[0] :
				current > 0 ? preround(item.current[0] * current) + " : " + current :
				preround(item.current[0] / current) + " * " + (-current));
		}
	};
};

CoordsPopup.prototype.callLongChangeForAll = function() {
	for (let i in this.groups)
		if (this.groups[i].onLongChange)
			for (let f in this.groups[i].items) {
				let item = this.groups[i].items[f],
					group = this.groups[i];
				item.current[0] = preround(group.onLongChange(f));
				if (group.onChange) group.onChange(f, item.current[0]);
				group.updateMather(f);
			}
};

CoordsPopup.prototype.setBaseMathes = function(mathes) {
	if (mathes) this.mathes = mathes;
};
