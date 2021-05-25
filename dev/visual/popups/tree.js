const TreePopup = function() {
	this.reset();
};

TreePopup.prototype = assign(FocusablePopup.prototype);
TreePopup.prototype.TYPE = "TreePopup";

TreePopup.prototype.__resetFP = FocusablePopup.prototype.reset;
TreePopup.prototype.reset = function() {
	this.__resetFP && this.__resetFP();
	this.views.groups = new Array();
	this.views.items = new Array();
	this.views.footers = new Array();
	this.tree = new Object();

	this.views.footer = new android.widget.LinearLayout(context);
	this.views.footer.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.Display.MATCH, Ui.Display.MATCH);
	params.weight = 0.1;
	this.views.layout.addView(this.views.footer, params);
};

TreePopup.prototype.addGroup = function(name, parent) {
	let scope = this,
		views = this.views,
		index = views.groups.length;
	parent && (this.tree[name] = parent);
	views.groups[index] = new android.widget.LinearLayout(context);
	views.groups[index].setPadding(this.getParentsCount(name) * Ui.getY(30) + Ui.getY(15), Ui.getY(15), Ui.getY(15), Ui.getY(15));
	views.groups[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Ui.getY(60)));
	views.groups[index].setOnClickListener(function() {
		scope.selectGroup(index);
		scope.__select && scope.__select(name, scope.getParents(name));
	});
	views.content.addView(views.groups[index]);

	let image = new android.widget.ImageView(context);
	image.setLayoutParams(android.widget.RelativeLayout.LayoutParams(Ui.getY(30), Ui.getY(30)));
	image.setImageDrawable(ImageFactory.getDrawable("controlExpandClose"));
	views.groups[index].addView(image);

	let text = new android.widget.TextView(context);
	text.setPadding(Ui.getY(15), 0, 0, 0);
	text.setTextSize(Ui.getFontSize(20));
	text.setTextColor(Ui.Color.WHITE);
	if (name) text.setText(name);
	text.setTypeface(typeface);
	views.groups[index].addView(text);
};

TreePopup.prototype.addItem = function(name, parent) {
	let scope = this,
		views = this.views,
		index = views.items.length;
	views.items[index] = new android.widget.LinearLayout(context);
	views.items[index].setPadding((this.getParentsCount(parent) + 1) * Ui.getY(30) + Ui.getY(15), Ui.getY(15), Ui.getY(15), Ui.getY(15));
	views.items[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Ui.getY(60)));
	views.items[index].setOnClickListener(function() {
		scope.selectItem(index);
		let parents = scope.getParents(parent);
		parents.push(parent);
		scope.__click && scope.__click(name, parents);
	});
	views.content.addView(views.items[index]);

	let text = new android.widget.TextView(context);
	text.setPadding(Ui.getY(15), 0, 0, 0);
	text.setTextSize(Ui.getFontSize(20));
	text.setTextColor(Ui.Color.WHITE);
	if (name) text.setText(name);
	text.setTypeface(typeface);
	views.items[index].addView(text);
};

TreePopup.prototype.addFooter = function(src, click) {
	let views = this.views,
		index = views.items.length;
	views.footers[index] = new android.widget.ImageView(context);
	views.footers[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(Ui.getY(60), Ui.getY(60)));
	views.footers[index].setPadding(Ui.getY(9), Ui.getY(9), Ui.getY(9), Ui.getY(9));
	views.footers[index].setImageDrawable(ImageFactory.getDrawable(src));
	click && views.footers[index].setOnClickListener(click);
	views.footer.addView(views.footers[index]);
};

TreePopup.prototype.hasParent = function(name) {
	return this.getParent(name) ? true : false;
};

TreePopup.prototype.getParent = function(name) {
	return this.tree[name];
};

TreePopup.prototype.getParents = function(name) {
	let parents = [];
	while ((i = this.getParent(name)))
		(name = i) && parents.push(name);
	return parents.reverse();
};

TreePopup.prototype.getParentsCount = function(name) {
	return this.getParents(name).length;
};

TreePopup.prototype.setTitle = function(title) {
	this.views.title.setText(title);
};

TreePopup.prototype.selectGroup = function(index) {
	let groups = this.views.groups;
	this.group + "" != "undefined" && groups[this.group].setBackgroundDrawable(null);
	groups[index].setBackgroundDrawable(ImageFactory.getDrawable("popupSelectionSelected"));
	this.group = index;
};

TreePopup.prototype.selectItem = function(index) {
	let items = this.views.items;
	this.item + "" != "undefined" && items[this.item].setBackgroundDrawable(null);
	items[index].setBackgroundDrawable(ImageFactory.getDrawable("popupSelectionSelected"));
	this.item = index;
};

TreePopup.prototype.setOnSelectListener = function(listener) {
	this.__select = function(name, parents) {
		try { listener && listener(name, parents); }
		catch (e) { reportError(e); }
	};
};

TreePopup.prototype.setOnClickListener = function(listener) {
	this.__click = function(name, parents) {
		try { listener && listener(name, parents); }
		catch (e) { reportError(e); }
	};
};
