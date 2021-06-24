const HieraclyPopup = function() {
	FocusablePopup.apply(this, arguments);
};

HieraclyPopup.prototype = new FocusablePopup;
HieraclyPopup.prototype.TYPE = "HieraclyPopup";

HieraclyPopup.prototype.reset = function() {
	FocusablePopup.prototype.reset.apply(this, arguments);
	this.views.groups = new Array();
	this.views.items = new Array();
	this.views.footers = new Array();
	this.groups = new Object();

	this.views.footer = new android.widget.LinearLayout(context);
	this.views.footer.setGravity(Interface.Gravity.CENTER | Interface.Gravity.LEFT);
	this.views.footer.setBackgroundDrawable(ImageFactory.getDrawable("popup"));
	let params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = 0.1;
	this.views.layout.addView(this.views.footer, params);
};

HieraclyPopup.prototype.addGroup = function(name, parent) {
	let scope = this,
		views = this.views,
		view;
	this.groups[name] = parent !== undefined ? parent : "<root>";
	let index = views.groups.push(view = new android.widget.LinearLayout(context)) - 1;
	views.groups[index].setPadding(this.getHieraclyCount(parent) * Interface.getY(30) + Interface.getY(15), Interface.getY(15), Interface.getY(15), Interface.getY(15));
	views.groups[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Interface.getY(60)));
	views.groups[index].setOnClickListener(function() {
		scope.selectGroup(views.groups.indexOf(view));
		scope.__select && scope.__select(name, scope.getHieracly(name), view);
	});
	views.groups[index].setTag(parent);
	views.content.addView(views.groups[index]);

	let image = new android.widget.ImageView(context);
	image.setLayoutParams(android.widget.RelativeLayout.LayoutParams(Interface.getY(30), Interface.getY(30)));
	image.setImageDrawable(ImageFactory.getDrawable("controlAdapterOpened"));
	views.groups[index].addView(image);

	let text = new android.widget.TextView(context);
	text.setPadding(Interface.getY(15), 0, 0, 0);
	text.setTextSize(Interface.getFontSize(20));
	text.setTextColor(Interface.Color.WHITE);
	if (name) text.setText(name);
	text.setTypeface(typeface);
	views.groups[index].addView(text);
};

HieraclyPopup.prototype.addItem = function(name, parent) {
	let scope = this,
		views = this.views,
		view;
	let index = views.items.push(view = new android.widget.LinearLayout(context)) - 1;
	views.items[index].setPadding(this.getHieraclyCount(parent) * Interface.getY(30) + Interface.getY(15), Interface.getY(15), Interface.getY(15), Interface.getY(15));
	views.items[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Interface.getY(60)));
	views.items[index].setOnClickListener(function() {
		scope.selectItem(views.items.indexOf(view));
		let parents = scope.getHieracly(parent);
		scope.__click && scope.__click(name, parents, view);
	});
	views.items[index].setTag(parent);
	views.content.addView(views.items[index]);

	let text = new android.widget.TextView(context);
	text.setPadding(Interface.getY(15), 0, 0, 0);
	text.setTextSize(Interface.getFontSize(20));
	text.setTextColor(Interface.Color.WHITE);
	if (name) text.setText(name);
	text.setTypeface(typeface);
	views.items[index].addView(text);
};

HieraclyPopup.prototype.addFooter = function(src, click) {
	let views = this.views,
		view;
	let index = views.footers.push(view = new android.widget.ImageView(context)) - 1;
	views.footers[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(Interface.getY(60), Interface.getY(60)));
	views.footers[index].setPadding(Interface.getY(9), Interface.getY(9), Interface.getY(9), Interface.getY(9));
	views.footers[index].setImageDrawable(ImageFactory.getDrawable(src));
	click && views.footers[index].setOnClickListener(click);
	views.footer.addView(views.footers[index]);
};

HieraclyPopup.prototype.hasParent = function(name) {
	return this.getParent(name) !== null;
};

HieraclyPopup.prototype.getParent = function(name) {
	return this.groups[name] || null;
};

HieraclyPopup.prototype.getHieracly = function(name) {
	let hieracly = new Array();
	if (name !== undefined) {
		do {
			hieracly.push(name);
		} while (name = this.getParent(name));
	}
	if (hieracly.length == 0) {
		hieracly.push("<root>");
	}
	return hieracly.reverse();
};

HieraclyPopup.prototype.getHieraclyCount = function(name) {
	return this.getHieracly(name).length - 1;
};

HieraclyPopup.prototype.selectGroup = function(index) {
	let groups = this.views.groups;
	this.group !== undefined && groups[this.group].setBackgroundDrawable(null);
	groups[index].setBackgroundDrawable(ImageFactory.getDrawable("popupSelectionSelected"));
	this.group = index;
};

HieraclyPopup.prototype.selectItem = function(index) {
	let items = this.views.items,
		previous = this.item;
	if (previous !== undefined && items[previous]) {
		items[previous].setBackgroundDrawable(null);
	}
	items[index].setBackgroundDrawable(ImageFactory.getDrawable("popupSelectionSelected"));
	this.item = index;
};

HieraclyPopup.prototype.setOnSelectListener = function(listener) {
	this.__select = function(name, parents, view) {
		tryout(function() {
			listener && listener(name, parents, view);
		});
	};
};

HieraclyPopup.prototype.setOnClickListener = function(listener) {
	this.__click = function(name, parents, view) {
		tryout(function() {
			listener && listener(name, parents, view);
		});
	};
};
