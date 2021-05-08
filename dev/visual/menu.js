let MenuWindow = function() {
	this.setGravity(Ui.Gravity.RIGHT);
	this.setHeight(Ui.Display.MATCH);
	this.reset(), this.groups = new Array();
	
	let actor = new SlideActor(Ui.Gravity.RIGHT);
	actor.setInterpolator(new DecelerateInterpolator());
	actor.setDuration(400);
	this.setEnterActor(actor);
	
	actor = new SlideActor(Ui.Gravity.RIGHT);
	actor.setInterpolator(new BounceInterpolator());
	actor.setDuration(1000);
	this.setExitActor(actor);
};
MenuWindow.prototype = new UniqueWindow;
MenuWindow.prototype.TYPE = "MenuWindow";
MenuWindow.prototype.reset = function() {
	let views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
	this.setContent(content);
	
	views.scroll = new android.widget.ScrollView(context);
	content.addView(views.scroll);
	
	let scroll = new android.widget.ScrollView(context);
	if (!menuDividers) scroll.setBackgroundDrawable
			(ImageFactory.getDrawable("popupBackground"));
	content.addView(scroll);
	views.layout = new android.widget.LinearLayout(context);
	views.layout.setOrientation(Ui.Orientate.VERTICAL);
	views.layout.setMinimumHeight(Ui.Display.HEIGHT);
	scroll.addView(views.layout);
};
MenuWindow.prototype.groups = new Array();
MenuWindow.prototype.addGroup = function(srcOrGroup, action) {
	let group = srcOrGroup instanceof MenuWindow.Group ?
		srcOrGroup : new MenuWindow.Group(this, srcOrGroup, action);
	action && srcOrGroup instanceof MenuWindow.Group &&
		srcOrGroup.setOnClickListener(action);
	this.indexOfGroup(group) == -1 && this.getGroups().push(group);
	return group;
};
MenuWindow.prototype.getGroupAt = function(index) {
	return this.getGroups()[index] || null;
};
MenuWindow.prototype.getGroups = function(index) {
	return this.groups;
};
MenuWindow.prototype.getGroupCount = function(index) {
	return this.getGroups().length;
};
MenuWindow.prototype.indexOfGroup = function(item) {
	return this.getGroups().indexOf(item);
};
MenuWindow.prototype.removeGroup = function(groupOrIndex) {
	let index = groupOrIndex instanceof MenuWindow.Group ?
		this.indexOfGroup(groupOrIndex) : groupOrIndex;
	let group = this.getGroupAt(index);
	let content = group.getContent();
	if (!content) return this;
	let actor = new BoundsActor();
	actor.setDuration(1000);
	this.beginDelayedActor(actor);
	this.views.layout.removeView(content);
	this.getGroups().splice(index, 1);
	return this;
};
MenuWindow.prototype.getSelectedIndexes = function() {
	let indexes = new Array(), groups = this.getGroups();
	for (let i = 0; i < groups.length; i++)
		if (groups[i].isSelected()) indexes.push(i);
	return indexes;
};
MenuWindow.prototype.hasMoreSelectors = function() {
	return this.getSelectedIndexes().length > 1;
};
MenuWindow.prototype.unselect = function() {
	let indexes = this.getSelectedIndexes();
	for (let i = 0; i < indexes.length; i++)
		this.getGroupAt(indexes[i]).select();
	return this;
};
MenuWindow.prototype.clearLayout = function(force) {
	let indexes = this.getSelectedIndexes();
	if (indexes.length > 0 || force) {
		let set = new ActorSet(),
			fade = new FadeActor(),
			bounds = new BoundsActor();
		fade.setDuration(200);
		set.addActor(fade);
		bounds.setDuration(400);
		set.addActor(bounds);
		this.beginDelayedActor(set);
	}
	this.views.scroll.removeAllViews();
	return this;
};
MenuWindow.prototype.inflateLayout = function(groupOrIndex) {
	if (!(groupOrIndex instanceof MenuWindow.Group))
		groupOrIndex = this.getGroupAt(groupOrIndex);
	if (!groupOrIndex) return this;
	groupOrIndex.prepareLayout();
	let layout = groupOrIndex.getLayout(),
		scope = this, scroll = this.views.scroll;
	if (!layout || !scroll) return this;
	let fade = new FadeActor();
	fade.setDuration(200);
	scroll.post(function() {
		if (scroll.getChildCount() > 0)
			scope.clearLayout(true);
		else scope.beginDelayedActor(fade);
		scroll.addView(layout);
	});
};
MenuWindow.prototype.selectGroup = function(groupOrIndex) {
	if (!(groupOrIndex instanceof MenuWindow.Group))
		groupOrIndex = this.getGroupAt(groupOrIndex);
	this.unselect(), groupOrIndex.select();
};
MenuWindow.prototype.setOnGroupClickListener = function(listener) {
	listener && (this.__clickGroup = function(group, index) {
		try { return listener(group, index); }
		catch (e) { reportError(e); }
		return false;
	});
};
MenuWindow.prototype.setOnSelectListener = function(listener) {
	listener && (this.__selectGroup = function(group, index, selected, count) {
		try { listener(group, index, selected, count); }
		catch (e) { reportError(e); }
	});
};
MenuWindow.prototype.setOnUndockListener = function(listener) {
	listener && (this.__undockGroup = function(group, index) {
		try { listener(group, index); }
		catch (e) { reportError(e); }
	});
	return this;
};
MenuWindow.prototype.setOnItemClickListener = function(listener) {
	listener && (this.__clickItem = function(group, item, groupIndex, itemIndex) {
		try { listener(group, item, groupIndex, itemIndex); }
		catch (e) { reportError(e); }
	});
};

MenuWindow.Group = function(parentOrSrc, srcOrAction, action) {
	(this.reset(), this.prepareLayout());
	this.items = new Array();
	if (parentOrSrc instanceof MenuWindow) {
		this.setWindow(parentOrSrc);
		srcOrAction && this.setIcon(srcOrAction);
		action && this.setOnSelectListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrAction && this.setOnSelectListener(srcOrAction);
	}
	this.setSelectedBackground("popupSelectionSelected");
	menuDividers && this.setUnselectedBackground("popupBackground");
};
MenuWindow.Group.prototype.reset = function() {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setMinimumHeight(Ui.getY(178));
	content.setGravity(Ui.Gravity.CENTER);
	content.setOnClickListener(function() {
		scope.click && scope.click();
	});
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.Display.WRAP, Ui.Display.MATCH);
	(params.weight = 1.0, params.topMargin = Ui.getY(2));
	content.setLayoutParams(params);
	this.content = content;
	
	this.views.icon = new android.widget.ImageView(context);
	this.views.icon.setScaleType(Ui.Scale.CENTER_CROP);
	this.views.icon.setPadding(Ui.getY(42), 0, 0, 0);
	params = new android.widget.LinearLayout.
		LayoutParams(Ui.getY(54), Ui.getY(81));
	content.addView(this.views.icon, params);
};
MenuWindow.Group.prototype.getIcon = function() {
	return this.icon || null;
};
MenuWindow.Group.prototype.setIcon = function(src) {
	let content = this.getContent();
	if (!content) return this;
	this.icon = src;
	if (content) Ui.setActorName(content, src + "Group");
	this.views.icon.setImageDrawable(ImageFactory.getDrawable(src));
	return this;
};
MenuWindow.Group.prototype.getContent = function() {
	return this.content || null;
};
MenuWindow.Group.prototype.click = function(overrideSelect) {
	let click = this.__click && this.__click(this),
		window = this.getWindow(),
		group = window && window.__clickGroup &&
			window.__clickGroup(this, this.indexOf());
	overrideSelect != true && click != true &&
			group != true && this.select(true);
	return this;
};
MenuWindow.Group.prototype.setOnClickListener = function(listener) {
	listener && (this.__click = function(group) {
		try { return listener(group); }
		catch (e) { reportError(e); }
		return false;
	});
	return this;
};
MenuWindow.Group.prototype.getWindow = function() {
	return this.window || null;
};
MenuWindow.Group.prototype.setWindow = function(window) {
	if (!window || typeof window != "object") return this;
	window.groups && window.groups.indexOf(this)
		== -1 && window.groups.push(this);
	let layout = window.views ? window.views.layout : null,
				content = this.getContent();
	if (content) Ui.setActorName(content, this.icon + "Group");
	if (!layout || !content) return this;
	let actor = new BoundsActor();
	actor.setDuration(200);
	window.beginDelayedActor(actor);
	layout.addView(content);
	this.window = window;
	return this;
};
MenuWindow.Group.prototype.getLayout = function() {
	return this.layout || null;
};
MenuWindow.Group.prototype.prepareLayout = function() {
	if (!this.getLayout()) this.resetLayout();
	return this;
};
MenuWindow.Group.prototype.resetLayout = function() {
	this.layout = new android.widget.LinearLayout(context);
	this.layout.setOrientation(Ui.Orientate.VERTICAL);
	let items = this.getItems(), count = this.getItemCount();
	for (let i = 0; i < count; i++) this.addItem(items[i]);
	return this;
};
MenuWindow.Group.prototype.selected = false;
MenuWindow.Group.prototype.isSelected = function() {
	return this.selected;
};
MenuWindow.Group.prototype.setUnselectedBackground = function(src) {
	if (!src) src = this.unselectedBackground;
	else this.unselectedBackground = src;
	(!this.isSelected()) && this.content.setBackgroundDrawable
			(ImageFactory.getDrawable(src));
	return this;
};
MenuWindow.Group.prototype.setSelectedBackground = function(src) {
	if (!src) src = this.selectedBackground;
	else this.selectedBackground = src;
	this.isSelected() && this.content.setBackgroundDrawable
			(ImageFactory.getDrawable(src));
	return this;
};
MenuWindow.Group.prototype.select = function(force) {
	this.selected = !this.selected;
	this.window && this.isSelected() && this.window.hasMoreSelectors() &&
		(this.selected = false, this.window.unselect(), this.selected = true);
	this.setSelectedBackground(), this.setUnselectedBackground();
	this.__select && this.__select(this, this.isSelected());
	let window = this.getWindow();
	if (window) {
		window.__selectGroup && window.__selectGroup
			(this, this.indexOf(), this.isSelected(), this.getItemCount());
		if (this.isSelected()) window.inflateLayout(this);
		else if (force) window.clearLayout();
	}
	return this;
};
MenuWindow.Group.prototype.setOnSelectListener = function(listener) {
	listener && (this.__select = function(group, selected) {
		try { listener(group, selected); }
		catch (e) { reportError(e); }
	});
	return this;
};
MenuWindow.Group.prototype.setOnUndockListener = function(listener) {
	listener && (this.__undock = function(group) {
		try { listener(group); }
		catch (e) { reportError(e); }
	});
	return this;
};
MenuWindow.Group.prototype.indexOf = function() {
	let window = this.getWindow();
	return window ? window.indexOfGroup(this) : -1;
};
MenuWindow.Group.prototype.items = new Array();
MenuWindow.Group.prototype.addItem = function(srcOrItem, action) {
	let item = srcOrItem instanceof MenuWindow.Group.Item ?
		srcOrItem : new MenuWindow.Group.Item(this, srcOrItem, action);
	action && srcOrItem instanceof MenuWindow.Group.Item &&
		srcOrItem.setOnClickListener(action);
	this.indexOfItem(item) == -1 && this.getItems().push(item);
	return item;
};
MenuWindow.Group.prototype.getItemAt = function(index) {
	return this.getItems()[index] || null;
};
MenuWindow.Group.prototype.getItems = function(index) {
	return this.items;
};
MenuWindow.Group.prototype.getItemCount = function(index) {
	return this.getItems().length;
};
MenuWindow.Group.prototype.indexOfItem = function(item) {
	return this.getItems().indexOf(item);
};
MenuWindow.Group.prototype.removeItem = function(itemOrIndex) {
	let index = itemOrIndex instanceof MenuWindow.Group.Item ?
		this.indexOfItem(itemOrIndex) : itemOrIndex;
	let item = this.getItemAt(index);
	let layout = this.getLayout(), content = item.getContent();
	if (!layout || !content) return this;
	let window = this.getWindow();
	if (window) {
		let actor = new BoundsActor();
		actor.setDuration(200);
		window.beginDelayedActor(actor);
	}
	layout.removeView(content);
	this.getItems().splice(index, 1);
	return this;
};
MenuWindow.Group.prototype.setOnItemClickListener = function(listener) {
	listener && (this.__clickItem = function(item, index) {
		try { listener(item, index); }
		catch (e) { reportError(e); }
	});
	return this;
};
MenuWindow.Group.prototype.remove = function() {
	let window = this.getWindow();
	window && window.removeGroup(this);
	return this;
};
MenuWindow.Group.prototype.clone = function(onlyGroup) {
	let window = this.getWindow(), items = this.getItems(),
		group = new MenuWindow.Group(window || this.getIcon(),
			window ? this.getIcon() : this.__select, this.__select);
	this.__clickItem && group.setOnItemClickListener(this.__clickItem);
	this.__click && group.setOnClickListener(this.__click);
	if (!onlyGroup)
		for (let i = 0; i < this.getItemCount(); i++)
				group.addItem(items[i].clone());
	return group;
};

MenuWindow.Group.Item = function(parentOrSrc, srcOrAction, action) {
	this.reset();
	if (parentOrSrc instanceof MenuWindow.Group) {
		this.setParentGroup(parentOrSrc);
		srcOrAction && this.setIcon(srcOrAction);
		action && this.setOnClickListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrAction && this.setOnClickListener(srcOrAction);
	}
};
MenuWindow.Group.Item.prototype.reset = function() {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.ImageView(context);
	content.setLayoutParams(new android.widget.LinearLayout.
			LayoutParams(Ui.getY(81), Ui.getY(81)));
	content.setPadding(Ui.getY(12), Ui.getY(12), Ui.getY(12), Ui.getY(12));
	content.setOnClickListener(function() {
		scope.click && scope.click();
	});
	this.content = content;
};
MenuWindow.Group.Item.prototype.getContent = function() {
	return this.content || null;
};
MenuWindow.Group.Item.prototype.getWindow = function() {
	let group = this.getParentGroup();
	if (!group) return null;
	return group.getWindow() || null;
};
MenuWindow.Group.Item.prototype.getBackground = function() {
	return this.background || null;
};
MenuWindow.Group.Item.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
MenuWindow.Group.Item.prototype.getIcon = function() {
	return this.icon || null;
};
MenuWindow.Group.Item.prototype.setIcon = function(src) {
	let content = this.getContent();
	if (!content) return this;
	this.icon = src;
	if (content) Ui.setActorName(content, src + "Item");
	content.setImageDrawable(ImageFactory.getDrawable(src));
	return this;
};
MenuWindow.Group.Item.prototype.setOnClickListener = function(listener) {
	listener && (this.__click = function(item) {
		try { listener(item); }
		catch (e) { reportError(e); }
	});
	return this;
};
MenuWindow.Group.Item.prototype.indexOf = function() {
	let group = this.getParentGroup();
	return group ? group.indexOfItem(this) : -1;
};
MenuWindow.Group.Item.prototype.getParentGroup = function() {
	return this.group || null;
};
MenuWindow.Group.Item.prototype.setParentGroup = function(group) {
	if (!group || typeof group != "object") return this;
	group.items && group.items.indexOf(this)
		== -1 && group.items.push(this);
	let layout = group.getLayout(), content = this.getContent();
	if (content) Ui.setActorName(content, this.icon + "Item");
	if (!layout || !content) return this;
	let window = group.getWindow();
	if (window) {
		let set = new ActorSet(),
			bounds = new BoundsActor(),
			fade = new FadeActor();
		set.setOrdering(ActorSet.TOGETHER);
		bounds.setDuration(400);
		fade.setDuration(200);
		set.addActor(bounds);
		set.addActor(fade);
		window.beginDelayedActor(set);
	}
	layout.addView(content);
	this.group = group;
	return this;
};
MenuWindow.Group.Item.prototype.click = function() {
	this.__click && this.__click(this);
	let group = this.getParentGroup();
	group && group.__clickItem && group.__clickItem
			(this, this.indexOf());
	let window = group && group.getWindow();
	window && window.__clickItem && window.__clickItem
		(group, this, group.indexOf(), this.indexOf());
	return this;
};
MenuWindow.Group.Item.prototype.remove = function() {
	let group = this.getParentGroup();
	group && group.removeItem(this);
	return this;
};
MenuWindow.Group.Item.prototype.clone = function() {
	let group = this.getParentGroup(),
		item = new MenuWindow.Group.Item(group || this.getIcon(),
			group ? this.getIcon() : this.__click, this.__click);
	return item;
};

MenuWindow.isSelected = function(group) {
	let current = UniqueHelper.getWindow("MenuWindow");
	return current ? current.getSelectedIndexes().indexOf(group) != -1 : false;
};
