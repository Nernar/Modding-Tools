const CoordsPopup = function() {
	ListingPopup.apply(this, arguments);
	this.views.groups = [];
	this.views.titles = [];
	this.views.containers = [];
	this.groups = [];
};

CoordsPopup.prototype = new ListingPopup;
CoordsPopup.prototype.TYPE = "CoordsPopup";

CoordsPopup.prototype.addButtonElement = function(name, click) {
	let button = ListingPopup.prototype.addButtonElement.apply(this, arguments);
	button.setBackground("popup");
	button.view.setLayoutParams(new android.widget.LinearLayout.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, toComplexUnitDip(54)));
	return button;
};

CoordsPopup.prototype.addGroup = function(name) {
	let views = this.views,
		index = views.groups.length;
	views.groups[index] = new android.widget.LinearLayout(getContext());
	views.groups[index].setPadding(toComplexUnitDip(6), index == 0 ? toComplexUnitDip(6) : 0,
		toComplexUnitDip(6), toComplexUnitDip(6));
	this.getFragment().getContainerLayout().addView(views.groups[index]);

	views.titles[index] = new android.widget.TextView(getContext());
	views.titles[index].setPadding(toComplexUnitDip(6), toComplexUnitDip(6),
		toComplexUnitDip(6), toComplexUnitDip(6));
	views.titles[index].setTextSize(toComplexUnitSp(12));
	views.titles[index].setTextColor($.Color.WHITE);
	if (name) views.titles[index].setText(name);
	views.titles[index].setTypeface(typeface);
	views.titles[index].setMaxLines(1);
	views.groups[index].addView(views.titles[index], new android.view.ViewGroup.LayoutParams
		(toComplexUnitDip(40), $.ViewGroup.LayoutParams.MATCH_PARENT));

	views.containers[index] = new android.widget.LinearLayout(getContext());
	views.containers[index].setOrientation($.LinearLayout.VERTICAL);
	views.groups[index].addView(views.containers[index]);
	return this.getGroup(index);
};

CoordsPopup.prototype.getGroup = function(position) {
	if (this.groups[position]) {
		return this.groups[position];
	}
	let views = this.views,
		mathes = this.mathes;
	return this.groups[position] = {
		items: [],
		addItem: function(current) {
			let elements = this,
				index = this.items.length,
				item = (this.items[index] = {
					views: {},
					current: [current, 0],
					mathes: mathes || [16, 32, 64]
				});
			item.views.root = new android.widget.LinearLayout(getContext());
			new BitmapDrawable("popup").attachAsBackground(item.views.root);
			item.views.root.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
				toComplexUnitDip(8), toComplexUnitDip(8));
			views.containers[position].addView(item.views.root);

			let params = new android.view.ViewGroup.LayoutParams
				(toComplexUnitDip(40), toComplexUnitDip(40));

			item.views.minus = new android.widget.ImageView(getContext());
			new BitmapDrawable("controlAdapterMinus").attachAsImage(item.views.minus);
			item.views.minus.setOnClickListener(function(view) {
				tryout(function() {
					let current = item.mathes[item.current[1]];
					item.current[0] = preround(item.current[0] - (current > 0 ? 1 / current : current));
					elements.onChange && elements.onChange(index, item.current[0]);
					elements.updateMather(index);
				});
			});
			item.views.root.addView(item.views.minus, params);

			item.views.mather = new android.widget.TextView(getContext());
			item.views.mather.setLayoutParams(new android.view.ViewGroup.LayoutParams
				(toComplexUnitDip(104), -1));
			item.views.mather.setPadding(toComplexUnitDip(8), 0, toComplexUnitDip(8), 0);
			item.views.mather.setOnClickListener(function(view) {
				tryout(function() {
					item.current[1]++;
					item.current[1] == item.mathes.length && (item.current[1] = 0);
					elements.updateMather(index);
				});
			});
			item.views.mather.setOnLongClickListener(function(view) {
				return tryout(function() {
					if (elements.onLongChange) {
						item.current[0] = preround(elements.onLongChange(index));
						elements.onChange && elements.onChange(index, item.current[0]);
						elements.updateMather(index);
						return true;
					}
				}, false);
			});
			item.views.mather.setTextSize(toComplexUnitSp(8));
			item.views.mather.setGravity($.Gravity.CENTER);
			item.views.mather.setTextColor($.Color.WHITE);
			item.views.mather.setTypeface(typeface);
			item.views.mather.setMaxLines(1);
			item.views.root.addView(item.views.mather);
			elements.updateMather(index);

			item.views.plus = new android.widget.ImageView(getContext());
			new BitmapDrawable("controlAdapterPlus").attachAsImage(item.views.plus);
			item.views.plus.setOnClickListener(function(view) {
				tryout(function() {
					let current = item.mathes[item.current[1]];
					item.current[0] = preround(item.current[0] + (current > 0 ? 1 / current : current));
					if (elements.onChange) elements.onChange(index, item.current[0]);
					elements.updateMather(index);
				});
			});
			item.views.root.addView(item.views.plus, params);
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
			item.views.mather.setText(current == 1 ? String(item.current[0]) :
				current > 0 ? preround(item.current[0] * current) + " : " + current :
				preround(item.current[0] / current) + " * " + (-current));
		}
	};
};

CoordsPopup.prototype.callLongChangeForAll = function() {
	for (let index in this.groups) {
		let group = this.groups[index];
		if (group.onLongChange) {
			for (let value in group.items) {
				let item = group.items[value];
				item.current[0] = preround(group.onLongChange(value));
				if (group.onChange) group.onChange(value, item.current[0]);
				group.updateMather(value);
			}
		}
	}
};

CoordsPopup.prototype.setBaseMathes = function(mathes) {
	if (mathes) this.mathes = mathes;
};
