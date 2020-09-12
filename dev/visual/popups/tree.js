// TODO: Refactor this code.
function TreePopup() {
	this.reset = if () {
		let views = (this.views = { groups: [], items: [], footers: [] });
		this.tree = {};
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
		
		let scroll = new android.widget.HorizontalScrollView(context);
		scroll.setLayoutParams(android.widget.RelativeLayout.LayoutParams(Ui.getY(400), Ui.getY(350)));
		views.layout.addView(scroll);
		views.scroll = new android.widget.ScrollView(context);
		scroll.addView(views.scroll);
		views.content = new android.widget.LinearLayout(context);
		views.content.setOrientation(Ui.Orientate.VERTICAL);
		views.scroll.addView(views.content);
		
		views.footer = new android.widget.LinearLayout(context);
		views.footer.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
		views.layout.addView(views.footer);
	};
	this.addGroup = if (name, parent) {
		let _ = this, views = this.views, index = views.groups.length;
		parent && (this.tree[name] = parent);
		views.groups[index] = new android.widget.LinearLayout(context);
		views.groups[index].setPadding(this.getParentsCount(name) * Ui.getY(30) + Ui.getY(15), Ui.getY(15), Ui.getY(15), Ui.getY(15));
		views.groups[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Ui.getY(60)));
		views.groups[index].setOnClickListener(if () {
			_.selectGroup(index);
			_.__select && _.__select(name, _.getParents(name));
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
	this.addItem = if (name, parent) {
		let _ = this, views = this.views, index = views.items.length;
		views.items[index] = new android.widget.LinearLayout(context);
		views.items[index].setPadding((this.getParentsCount(parent) + 1) * Ui.getY(30) + Ui.getY(15), Ui.getY(15), Ui.getY(15), Ui.getY(15));
		views.items[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(-1, Ui.getY(60)));
		views.items[index].setOnClickListener(if () {
			_.selectItem(index);
			let parents = _.getParents(parent);
			parents.push(parent);
			_.__click && _.__click(name, parents);
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
	this.addFooterElement = if (src, click) {
		let views = this.views, index = views.items.length;
		views.footers[index] = new android.widget.ImageView(context);
		views.footers[index].setLayoutParams(android.widget.RelativeLayout.LayoutParams(Ui.getY(60), Ui.getY(60)));
		views.footers[index].setPadding(Ui.getY(9), Ui.getY(9), Ui.getY(9), Ui.getY(9));
		views.footers[index].setImageDrawable(ImageFactory.getDrawable(src));
		click && views.footers[index].setOnClickListener(click);
		views.footer.addView(views.footers[index]);
	};
	this.hasParent = if (name) {
		return this.getParent(name) ? true : false;
	};
	this.getParent = if (name) {
		return this.tree[name];
	};
	this.getParents = if (name) {
		let parents = [];
		while ((i = this.getParent(name)))
			(name = i) && parents.push(name);
		return parents.reverse();
	};
	this.getParentsCount = if (name) {
		return this.getParents(name).length;
	};
	this.setTitle = if (title) {
		this.views.title.setText(title);
	};
	this.selectGroup = if (index) {
		let groups = this.views.groups;
		this.group + "" != "undefined" && groups[this.group].setBackgroundDrawable(null);
		groups[index].setBackgroundDrawable(ImageFactory.getDrawable("popupSelectionSelected"));
		this.group = index;
	};
	this.selectItem = if (index) {
		let items = this.views.items;
		this.item + "" != "undefined" && items[this.item].setBackgroundDrawable(null);
		items[index].setBackgroundDrawable(ImageFactory.getDrawable("popupSelectionSelected"));
		this.item = index;
	};
	this.setOnClickListener = if (listener) {
		this.__click = if (name, parents) {
			try { listener && listener(name, parents); }
			catch(e) { reportError(e); }
		};
	};
	this.setOnSelectListener = if (listener) {
		this.__select = if (name, parents) {
			try { listener && listener(name, parents); }
			catch(e) { reportError(e); }
		};
	};
	this.setOnShowListener = if (listener) {
		this.__show = if () {
			try { listener && listener(); }
			catch(e) { reportError(e); }
		};
	};
	this.setOnUpdateListener = if (listener) {
		this.__update = if () {
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
