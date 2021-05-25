const SidebarWindow = function() {
	UniqueWindow.call(this);
	this.setGravity(Ui.Gravity.RIGHT);
	this.setHeight(Ui.Display.MATCH);
	
	this.setFrame(new SidebarFrame());
	this.groups = new Array();
	
	let enter = new SlideActor(Ui.Gravity.RIGHT);
	enter.setInterpolator(new DecelerateInterpolator());
	enter.setDuration(400);
	this.setEnterActor(enter);
	
	let exit = new SlideActor(Ui.Gravity.RIGHT);
	exit.setInterpolator(new BounceInterpolator());
	exit.setDuration(1000);
	this.setExitActor(exit);
};

SidebarWindow.NOTHING_SELECTED = -1;

SidebarWindow.prototype = assign(UniqueWindow.prototype);
SidebarWindow.prototype.TYPE = "SidebarWindow";

SidebarWindow.prototype.selected = SidebarWindow.NOTHING_SELECTED;

SidebarWindow.prototype.getGroups = function(index) {
	return this.groups || null;
};

SidebarWindow.prototype.addGroup = function(srcOrGroup, action) {
	let groups = this.getGroups();
	if (groups == null) return null;
	let group = srcOrGroup instanceof SidebarWindow.Group ?
		srcOrGroup : new SidebarWindow.Group(srcOrGroup, action);
	if (srcOrGroup instanceof SidebarWindow.Group) {
		action && group.setOnSelectListener(action);
	}
	groups.push(group);
	group.attachToWindow(this);
	let frame = this.getFrame();
	if (frame != null) {
		let content = group.getContainer();
		if (content != null) frame.addTab(content);
	}
	return group;
};

SidebarWindow.prototype.removeGroup = function(groupOrIndex) {
	let groups = this.getGroups();
	if (groups == null) return false;
	let index = groupOrIndex instanceof SidebarWindow.Group ?
		this.indexOfGroup(groupOrIndex) : groupOrIndex;
	if (index < 0) return false;
	let group = this.getGroupAt(index);
	if (group == null) return false;
	if (group.isSelected()) this.unselect();
	group.deattachFromWindow();
	groups.splice(index, 1);
	let frame = this.getFrame();
	if (frame != null) {
		let content = group.getContainer();
		if (content != null) frame.removeTab(content);
	}
	return true;
};

SidebarWindow.prototype.getGroupAt = function(index) {
	let groups = this.getGroups();
	if (groups == null) return null;
	return groups[index] || null;
};

SidebarWindow.prototype.getGroupCount = function() {
	let groups = this.getGroups();
	if (groups == null) return -1;
	return groups.length || 0;
};

SidebarWindow.prototype.indexOfGroup = function(group) {
	let groups = this.getGroups();
	if (groups == null) return -1;
	return groups.indexOf(group);
};

SidebarWindow.prototype.getSelected = function() {
	return this.selected >= 0 ? this.selected : SidebarWindow.NOTHING_SELECTED;
};

SidebarWindow.prototype.isSelected = function() {
	return this.getSelected() != SidebarWindow.NOTHING_SELECTED;
};

SidebarWindow.prototype.getSelectedGroup = function() {
	let selected = this.getSelected();
	if (selected < 0) return null;
	return this.getGroupAt(selected);
};

SidebarWindow.prototype.unselect = function(forceUpdate) {
	let selected = this.getSelected();
	if (selected < 0) return false;
	let group = this.getSelectedGroup();
	this.selected = SidebarWindow.NOTHING_SELECTED;
	if (group == null) return false;
	group.switchState(!!forceUpdate);
	if (!forceUpdate) this.reinflateLayout();
	return true;
};

SidebarWindow.prototype.select = function(groupOrIndex) {
	let index = groupOrIndex instanceof SidebarWindow.Group ?
		this.indexOfGroup(groupOrIndex) : groupOrIndex;
	if (index < 0) return false;
	let selected = this.getSelected();
	if (selected == index) return false;
	let group = this.getGroupAt(index);
	if (group == null) return false;
	if (this.isSelected()) this.unselect(true);
	this.selected = index;
	group.switchState(selected);
	this.reinflateLayout();
	return true;
};

SidebarWindow.prototype.reinflateLayout = function() {
	let frame = this.getFrame();
	if (this.isSelected()) {
		if (frame != null) {
			let fragment = frame.getFragment();
			if (fragment != null) {
				let set = new ActorSet(),
					slide = new SlideActor(Ui.Gravity.RIGHT),
					bounds = new BoundsActor();
				slide.setInterpolator(new AccelerateDecelerateInterpolator());
				slide.setDuration(150);
				set.addActor(slide);
				bounds.setStartDelay(25);
				bounds.setDuration(100);
				bounds.setInterpolator(new AnticipateInterpolator());
				set.addActor(bounds);
				let container = fragment.getItemContainer();
				this.beginDelayedActor(container, set);
			}
		}
	}
	if (frame != null) {
		frame.clearItems();
		let group = this.getSelectedGroup();
		if (group != null) {
			for (let i = 0; i < group.getItemCount(); i++) {
				let item = group.getItemAt(i), content = item.getContainer();
				if (content != null) frame.addItem(content);
			}
		}
	}
	return this;
};

SidebarWindow.prototype.setOnGroupSelectListener = function(listener) {
	this.onGroupSelect = function(window, group, index, previous, count) {
		try { listener && listener(window, group, index, previous, count); }
		catch (e) { reportError(e); }
	};
	return this;
};

SidebarWindow.prototype.setOnGroupUndockListener = function(listener) {
	this.onGroupUndock = function(window, group, index, previous) {
		try { listener && listener(window, group, index, previous); }
		catch (e) { reportError(e); }
	};
	return this;
};

SidebarWindow.prototype.setOnGroupFetchListener = function(listener) {
	this.onGroupFetch = function(window, group, index) {
		try { return listener && listener(window, group, index); }
		catch (e) { reportError(e); }
		return null;
	};
	return this;
};

SidebarWindow.prototype.setOnItemSelectListener = function(listener) {
	this.onItemSelect = function(window, group, item, groupIndex, itemIndex) {
		try { listener && listener(window, group, item, groupIndex, itemIndex); }
		catch (e) { reportError(e); }
	};
	return this;
};

SidebarWindow.prototype.setOnItemFetchListener = function(listener) {
	this.onItemFetch = function(window, group, item, groupIndex, itemIndex) {
		try { return listener && listener(window, group, item, groupIndex, itemIndex); }
		catch (e) { reportError(e); }
		return null;
	};
	return this;
};

SidebarWindow.Group = function(parentOrSrc, srcOrAction, action) {
	SidebarFrame.Group.call(this);
	let scope = this;
	this.setOnClickListener(function() {
		let window = scope.getWindow();
		if (window == null) return;
		if (scope.isSelected()) {
			window.unselect();
		} else window.select(scope);
	});
	this.setOnHoldListener(function() {
		let window = scope.getWindow(), hint = null;
		if (window != null) {
			window.onGroupFetch && (hint = window.onGroupFetch(window, scope, scope.indexOf()) || hint);
		}
		scope.onFetch && (hint = scope.onFetch(scope, scope.indexOf()) || hint);
		if (hint != null) showHint(hint);
		return true;
	});
	this.items = new Array();
	if (parentOrSrc instanceof SidebarWindow) {
		this.attachToWindow(parentOrSrc);
		srcOrAction && this.setIcon(srcOrAction);
		action && this.setOnSelectListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrAction && this.setOnSelectListener(srcOrAction);
	}
	this.setSelectedBackground("popupSelectionSelected");
	menuDividers && this.setUnselectedBackground("popupBackground");
};

SidebarWindow.Group.prototype = assign(SidebarFrame.Group.prototype);

SidebarWindow.Group.prototype.getWindow = function() {
	return this.window || null;
};

SidebarWindow.Group.prototype.attachToWindow = function(window) {
	if (!window) throw Error("Window can't be illegal or undefined state!");
	let attached = this.getWindow();
	if (attached != null) throw Error("You're must deattach sidebar group firstly!");
	let actor = new BoundsActor();
	actor.setDuration(200);
	window.beginDelayedActor(actor);
	this.window = window;
	this.updateBackground();
	return true;
};

SidebarWindow.Group.prototype.deattachFromWindow = function() {
	let window = this.getWindow();
	if (window == null) return false;
	let actor = new BoundsActor();
	actor.setDuration(500);
	window.beginDelayedActor(actor);
	delete this.window;
	this.updateBackground();
	return true;
};

SidebarWindow.Group.prototype.switchState = function(previous) {
	let window = this.getWindow();
	if (this.isSelected()) {
		this.onSelect && this.onSelect(this, this.indexOf(), previous, this.getItemCount());
		if (window != null) {
			window.onGroupSelect && window.onGroupSelect(window, this, this.indexOf(), previous, this.getItemCount());
		}
	} else {
		this.onUndock && this.onUndock(this, this.indexOf(), previous);
		if (window != null) {
			window.onGroupUndock && window.onGroupUndock(window, this, this.indexOf(), previous);
		}
	}
	this.updateBackground();
	return this;
};

SidebarWindow.Group.prototype.isSelected = function() {
	let window = this.getWindow();
	if (window == null) return false;
	return window.getSelected() == this.indexOf();
};

SidebarWindow.Group.prototype.getUnselectedBackground = function() {
	return this.unselectedBackground || null;
};

SidebarWindow.Group.prototype.getSelectedBackground = function() {
	return this.selectedBackground || null;
};

SidebarWindow.Group.prototype.updateBackground = function() {
	this.setBackground(this.isSelected() ?
		this.getSelectedBackground() : this.getUnselectedBackground());
	return this;
};

SidebarWindow.Group.prototype.setUnselectedBackground = function(src) {
	this.unselectedBackground = src;
	this.updateBackground();
	return this;
};

SidebarWindow.Group.prototype.setSelectedBackground = function(src) {
	this.selectedBackground = src;
	this.updateBackground();
	return this;
};

SidebarWindow.Group.prototype.getItems = function() {
	return this.items || null;
};

SidebarWindow.Group.prototype.addItem = function(srcOrItem, action) {
	let items = this.getItems();
	if (items == null) return null;
	let item = srcOrItem instanceof SidebarWindow.Group.Item ?
		srcOrItem : new SidebarWindow.Group.Item(srcOrItem, action);
	if (srcOrItem instanceof SidebarWindow.Group.Item) {
		action && item.setOnClickListener(action);
	}
	items.push(item);
	item.attachToGroup(this);
	if (this.isSelected()) {
		let window = this.getWindow();
		if (window != null) {
			let frame = window.getFrame();
			if (frame != null) {
				let content = item.getContainer();
				if (content != null) frame.addItem(content);
			}
		}
	}
	return item;
};

SidebarWindow.Group.prototype.removeItem = function(itemOrIndex) {
	let items = this.getItems();
	if (items == null) return false;
	let index = itemOrIndex instanceof SidebarWindow.Group.Item ?
		this.indexOfItem(itemOrIndex) : itemOrIndex;
	if (index < 0) return false;
	let item = this.getItemAt(index);
	if (item == null) return false;
	item.deattachFromGroup();
	items.splice(index, 1);
	let window = this.getWindow();
	if (window != null) {
		let frame = window.getFrame();
		if (frame != null) {
			let content = item.getContainer();
			if (content != null) frame.removeItem(content);
		}
	}
	return true;
};

SidebarWindow.Group.prototype.getItemAt = function(index) {
	let items = this.getItems();
	if (items == null) return null;
	return items[index] || null;
};

SidebarWindow.Group.prototype.getItemCount = function() {
	let items = this.getItems();
	if (items == null) return -1;
	return items.length || 0;
};

SidebarWindow.Group.prototype.indexOfItem = function(item) {
	let items = this.getItems();
	if (items == null) return -1;
	return items.indexOf(item);
};

SidebarWindow.Group.prototype.indexOf = function() {
	let window = this.getWindow();
	if (window == null) return -1;
	return window.indexOfGroup(this);
};

SidebarWindow.Group.prototype.setOnSelectListener = function(listener) {
	this.onSelect = function(group, index, previous, count) {
		try { listener && listener(group, index, previous, count); }
		catch (e) { reportError(e); }
	};
	return this;
};

SidebarWindow.Group.prototype.setOnUndockListener = function(listener) {
	this.onUndock = function(group, index, previous) {
		try { listener && listener(group, index, previous); }
		catch (e) { reportError(e); }
	};
	return this;
};

SidebarWindow.Group.prototype.setOnFetchListener = function(listener) {
	this.onFetch = function(group, index) {
		try { return listener && listener(group, index); }
		catch (e) { reportError(e); }
		return null;
	};
	return this;
};

SidebarWindow.Group.prototype.setOnItemSelectListener = function(listener) {
	this.onItemSelect = function(group, item, groupIndex, itemIndex) {
		try { listener && listener(group, item, groupIndex, itemIndex); }
		catch (e) { reportError(e); }
	};
	return this;
};

SidebarWindow.Group.prototype.setOnItemFetchListener = function(listener) {
	this.onItemFetch = function(group, item, groupIndex, itemIndex) {
		try { return listener && listener(group, item, groupIndex, itemIndex); }
		catch (e) { reportError(e); }
		return null;
	};
	return this;
};

SidebarWindow.Group.Item = function(parentOrSrc, srcOrAction, action) {
	SidebarFrame.Group.Item.call(this);
	let scope = this;
	this.setOnClickListener(function() {
		scope.onSelect && scope.onSelect(scope, scope.indexOf());
		let group = scope.getGroup();
		if (group != null) {
			group.onItemSelect && group.onItemSelect(group, scope, group.indexOf(), scope.indexOf());
			let window = group.getWindow();
			if (window != null) {
				window.onItemSelect && window.onItemSelect(window, group, scope, group.indexOf(), scope.indexOf());
			}
		}
	});
	this.setOnHoldListener(function() {
		let group = scope.getGroup(), hint = null;
		if (group != null) {
			let window = group.getWindow();
			if (window != null) {
				window.onItemFetch && (hint = window.onItemFetch(window, group, scope, group.indexOf(), scope.indexOf()) || hint);
			}
			group.onItemFetch && (hint = group.onItemFetch(group, scope, group.indexOf(), scope.indexOf()) || hint);
		}
		scope.onFetch && (hint = scope.onFetch(scope, scope.indexOf()) || hint);
		if (hint != null) showHint(hint);
		return true;
	});
	if (parentOrSrc instanceof SidebarWindow.Group) {
		this.attachToGroup(parentOrSrc);
		srcOrAction && this.setIcon(srcOrAction);
		action && this.setOnSelectListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrAction && this.setOnSelectListener(srcOrAction);
	}
};

SidebarWindow.Group.Item.prototype = assign(SidebarFrame.Group.Item.prototype);

SidebarWindow.Group.Item.prototype.getGroup = function() {
	return this.group || null;
};

SidebarWindow.Group.Item.prototype.attachToGroup = function(group) {
	if (!group) throw Error("Group can't be illegal or undefined state!");
	let attached = this.getGroup();
	if (attached != null) throw Error("You're must deattach sidebar item firstly!");
	let window = group.getWindow();
	if (window != null) {
		let actor = new BoundsActor();
		actor.setDuration(200);
		window.beginDelayedActor(actor);
	}
	this.group = group;
	return true;
};

SidebarWindow.Group.Item.prototype.deattachFromGroup = function() {
	let group = this.getGroup();
	if (group == null) return false;
	let window = group.getWindow();
	if (window != null) {
		let actor = new BoundsActor();
		actor.setDuration(350);
		window.beginDelayedActor(actor);
	}
	delete this.group;
	return true;
};

SidebarWindow.Group.Item.prototype.indexOf = function() {
	let group = this.getGroup();
	if (group == null) return -1;
	return group.indexOfItem(this);
};

SidebarWindow.Group.Item.prototype.setOnSelectListener = function(listener) {
	this.onSelect = function(item, index) {
		try { listener && listener(item, index); }
		catch (e) { reportError(e); }
	};
	return this;
};

SidebarWindow.Group.Item.prototype.setOnFetchListener = function(listener) {
	this.onFetch = function(item, index) {
		try { return listener && listener(item, index); }
		catch (e) { reportError(e); }
		return null;
	};
	return this;
};

SidebarWindow.isSelected = function(group) {
	let currently = UniqueHelper.getWindow("SidebarWindow");
	return currently.getSelected() == group;
};
