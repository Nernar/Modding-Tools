const SidebarFragment = function() {
	LayoutFragment.apply(this, arguments);
};

SidebarFragment.NOTHING_SELECTED = -1;

SidebarFragment.prototype = new LayoutFragment;
SidebarFragment.prototype.selected = SidebarFragment.NOTHING_SELECTED;

SidebarFragment.prototype.resetContainer = function() {
	this.removeFragments();

	let container = new android.widget.LinearLayout(getContext());
	container.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_RTL);
	this.setContainerView(container);

	let menus = new SidebarFragment.Rail("fill");
	this.addFragment(this.menuFragment = menus);

	let tools = new SidebarFragment.Rail();
	this.addFragment(this.toolbarFragment = tools);

	// let contents = new SidebarFragment.Panel();
	// this.addFragment(this.contentFragment = contents);

	this.setBackground("popup");
	menuDividers || this.setMenuBackground("popup");
};

SidebarFragment.prototype.getMenuFragment = function() {
	return this.menuFragment || null;
};

SidebarFragment.prototype.getToolbarFragment = function() {
	return this.toolbarFragment || null;
};

// SidebarFragment.prototype.getContentFragment = function() {
	// return this.contentFragment || null;
// };

SidebarFragment.prototype.getSelected = function() {
	return this.selected >= 0 ? this.selected : SidebarFragment.NOTHING_SELECTED;
};

SidebarFragment.prototype.isSelected = function() {
	return this.getSelected() != SidebarFragment.NOTHING_SELECTED;
};

SidebarFragment.prototype.getSelectedGroup = function() {
	let selected = this.getSelected();
	if (selected >= 0) {
		let fragment = this.getMenuFragment();
		if (fragment != null) {
			return fragment.getFragmentAt(selected);
		}
	}
	return null;
};

SidebarFragment.prototype.unselect = function(forceUpdate) {
	let selected = this.getSelected();
	if (selected < 0) {
		return false;
	}
	let group = this.getSelectedGroup();
	this.selected = SidebarFragment.NOTHING_SELECTED;
	if (group == null) {
		return false;
	}
	group.switchState(!!forceUpdate);
	forceUpdate || this.reinflateLayout();
	return true;
};

SidebarFragment.prototype.select = function(groupOrIndex) {
	let menu = this.getMenuFragment();
	if (menu == null) {
		return false;
	}
	let group = groupOrIndex;
	if (groupOrIndex instanceof Fragment) {
		groupOrIndex = menu.indexOf(groupOrIndex);
	} else {
		group = menu.getFragmentAt(groupOrIndex);
	}
	if (group == null || groupOrIndex == -1) {
		return false;
	}
	let selected = this.getSelected();
	if (groupOrIndex == selected) {
		this.reinflateLayout();
		return false;
	}
	this.isSelected() && this.unselect(true);
	this.selected = groupOrIndex;
	group.switchState(selected);
	this.reinflateLayout();
	return true;
};

SidebarFragment.prototype.reinflateLayout = function() {
	let fragment = this.getToolbarFragment();
	if (isAndroid() && this.isSelected()) {
		let window = this.getWindow();
		if (window != null) {
			let set = new android.transition.TransitionSet();
			if (window.isTouchable()) {
				set.addListener({
					onTransitionStart: function(transition) {
						try {
							window.setTouchable(false);
						} catch (e) {
							reportError(e);
						}
					},
					onTransitionEnd: function(transition) {
						try {
							window.setTouchable(true);
						} catch (e) {
							reportError(e);
						}
					}
				});
			}
			let slide = new android.transition.Slide($.Gravity.RIGHT);
			slide.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
			slide.setDuration(150);
			set.addTransition(slide);
			let bounds = new android.transition.ChangeBounds();
			bounds.setStartDelay(25);
			bounds.setDuration(100);
			bounds.setInterpolator(new android.view.animation.AnticipateInterpolator());
			set.addTransition(bounds);
			window.beginDelayedTransition(fragment.getContainer(), set);
		}
	}
	fragment.removeFragments();
	let group = this.getSelectedGroup();
	if (group != null) {
		for (let offset = 0; offset < group.getFragmentCount(); offset++) {
			fragment.addFragment(group.getFragmentAt(offset));
		}
	}
	return this;
};

SidebarFragment.prototype.getMenuBackground = function() {
	return this.getMenuFragment().getBackground();
};

SidebarFragment.prototype.setMenuBackground = function(src) {
	this.getMenuFragment().setBackground(src);
	return this;
};

SidebarFragment.prototype.setOnGroupSelectListener = function(listener) {
	if (listener != null) {
		this.onGroupSelect = listener.bind(this);
	} else {
		delete this.onGroupSelect;
	}
	return this;
};

SidebarFragment.prototype.setOnGroupUndockListener = function(listener) {
	if (listener != null) {
		this.onGroupUndock = listener.bind(this);
	} else {
		delete this.onGroupUndock;
	}
	return this;
};

SidebarFragment.prototype.setOnGroupFetchListener = function(listener) {
	if (listener != null) {
		this.onGroupFetch = listener.bind(this);
	} else {
		delete this.onGroupFetch;
	}
	return this;
};

SidebarFragment.prototype.setOnItemSelectListener = function(listener) {
	if (listener != null) {
		this.onItemSelect = listener.bind(this);
	} else {
		delete this.onItemSelect;
	}
	return this;
};

SidebarFragment.prototype.setOnItemFetchListener = function(listener) {
	if (listener != null) {
		this.onItemFetch = listener.bind(this);
	} else {
		delete this.onItemFetch;
	}
	return this;
};

SidebarFragment.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof SidebarFragment)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarFragment();
	}
	instanceOrJson = LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredFragment !== undefined ? preferredFragment : "sidebarPanel");
	json = calloutOrParse(this, json, instanceOrJson);
	if (json == null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("groups")) {
		LayoutFragment.parseLayoutJson.call(this, instanceOrJson.getMenuFragment(), json, json.groups, "sidebarGroup");
	}
	if (json.hasOwnProperty("menuBackground")) {
		instanceOrJson.setMenuBackground(calloutOrParse(json, json.menuBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("selectGroup")) {
		instanceOrJson.setOnGroupSelectListener(parseCallback(json, json.selectGroup, this));
	}
	if (json.hasOwnProperty("undockGroup")) {
		instanceOrJson.setOnGroupUndockListener(parseCallback(json, json.undockGroup, this));
	}
	if (json.hasOwnProperty("fetchGroup")) {
		instanceOrJson.setOnGroupFetchListener(parseCallback(json, json.fetchGroup, this));
	}
	if (json.hasOwnProperty("selectItem")) {
		instanceOrJson.setOnItemSelectListener(parseCallback(json, json.selectItem, this));
	}
	if (json.hasOwnProperty("fetchItem")) {
		instanceOrJson.setOnItemFetchListener(parseCallback(json, json.fetchItem, this));
	}
	if (json.hasOwnProperty("select")) {
		instanceOrJson.select(calloutOrParse(json, json.select, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

SidebarFragment.Group = function(parentOrSrc, srcOrAction, action) {
	LayoutFragment.call(this);
	if (parentOrSrc instanceof SidebarFragment) {
		this.attachToSidebar(parentOrSrc);
		srcOrAction && this.setImage(srcOrAction);
		action && this.setOnSelectListener(action);
	} else {
		parentOrSrc && this.setImage(parentOrSrc);
		srcOrAction && this.setOnSelectListener(srcOrAction);
	}
};

SidebarFragment.Group.prototype = new LayoutFragment;

SidebarFragment.Group.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(getContext());
	container.setMinimumHeight(toComplexUnitDip(120));
	container.setGravity($.Gravity.CENTER);
	this.setContainerView(container);

	let icon = new android.widget.ImageView(getContext());
	icon.setScaleType($.ImageView.ScaleType.CENTER_CROP);
	icon.setPadding(toComplexUnitDip(28), 0, 0, 0);
	icon.setTag("groupImage");
	container.addView(icon, new android.widget.LinearLayout.LayoutParams
		(toComplexUnitDip(36), toComplexUnitDip(54)));

	this.setSelectedBackground("popupSelectionSelected");
	menuDividers && this.setUnselectedBackground("popup");
};

SidebarFragment.Group.prototype.getImageView = function() {
	return this.findViewByTag("groupImage");
};

/**
 * @requires `isCLI()`
 */
SidebarFragment.Group.prototype.render = function(hovered) {
	return ImageFragment.prototype.render.apply(this, arguments);
};

SidebarFragment.Group.prototype.getImage = function() {
	return ImageFragment.prototype.getImage.apply(this, arguments);
};

SidebarFragment.Group.prototype.setImage = function(src) {
	if (isAndroid()) {
		let container = this.getContainer();
		if (container == null) {
			return this;
		}
		if (src != null && typeof src == "object") {
			$.ViewCompat.setTransitionName(container, src.bitmap + "Group");
		} else {
			$.ViewCompat.setTransitionName(container, src + "Group");
		}
	}
	return ImageFragment.prototype.setImage.apply(this, arguments);
};

SidebarFragment.Group.prototype.getUnselectedBackground = function() {
	return this.unselectedBackground || null;
};

SidebarFragment.Group.prototype.setUnselectedBackground = function(src) {
	this.unselectedBackground = src;
	this.updateBackground();
	return this;
};

SidebarFragment.Group.prototype.getSelectedBackground = function() {
	return this.selectedBackground || null;
};

SidebarFragment.Group.prototype.setSelectedBackground = function(src) {
	this.selectedBackground = src;
	this.updateBackground();
	return this;
};

SidebarFragment.Group.prototype.updateBackground = function() {
	this.setBackground(this.isSelected() ? this.getSelectedBackground() : this.getUnselectedBackground());
	return this;
};

SidebarFragment.Group.prototype.addFragment = function() {
	let index = LayoutFragment.prototype.addFragment.apply(this, arguments);
	if (index >= 0) {
		let fragment = this.getFragmentAt(index);
		if (fragment != null) {
			fragment.attachToGroup && fragment.attachToGroup(this);
		}
	}
	return index;
};

SidebarFragment.Group.prototype.removeFragment = function(indexOrFragment) {
	if (indexOrFragment instanceof Fragment) {
		indexOrFragment = this.indexOf(indexOrFragment);
	}
	if (indexOrFragment >= 0) {
		let fragment = this.getFragmentAt(indexOrFragment);
		if (fragment != null) {
			fragment.deattachFromGroup && fragment.deattachFromGroup();
		}
	}
	return LayoutFragment.prototype.removeFragment.apply(this, arguments);
};

SidebarFragment.Group.prototype.addViewDirectly = function() {};
SidebarFragment.Group.prototype.removeViewDirectly = function() {};

SidebarFragment.Group.prototype.getSidebar = function() {
	return this.sidebar || null;
};

SidebarFragment.Group.prototype.attachToSidebar = function(sidebar) {
	if (sidebar == null) {
		MCSystem.throwException("Modding Tools: Sidebar cannot be null or undefined!");
	}
	let attached = this.getSidebar();
	if (attached != null) {
		MCSystem.throwException("Modding Tools: You are must deattach sidebar group firstly!");
	}
	if (isAndroid() && (attached = sidebar.getWindow()) != null) {
		let actor = new android.transition.ChangeBounds();
		actor.setDuration(200);
		attached.beginDelayedTransition(actor);
	}
	this.sidebar = sidebar;
	this.updateBackground();
};

SidebarFragment.Group.prototype.deattachFromSidebar = function() {
	let window = this.getSidebar();
	if (window == null) {
		return false;
	}
	if ((window = window.getWindow()) != null && isAndroid()) {
		let actor = new android.transition.ChangeBounds();
		actor.setDuration(500);
		window.beginDelayedTransition(actor);
	}
	delete this.sidebar;
	this.updateBackground();
	return true;
};

SidebarFragment.Group.prototype.switchState = function(previous) {
	let sidebar = this.getSidebar();
	if (this.isSelected()) {
		this.onSelect && this.onSelect(this, this.getIndex(), previous, this.getFragmentCount());
		if (sidebar != null) {
			sidebar.onGroupSelect && sidebar.onGroupSelect(sidebar, this, this.getIndex(), previous, this.getFragmentCount());
		}
	} else {
		this.onUndock && this.onUndock(this, this.getIndex(), previous);
		if (sidebar != null) {
			sidebar.onGroupUndock && sidebar.onGroupUndock(sidebar, this, this.getIndex(), previous);
		}
	}
	this.updateBackground();
	return this;
};

SidebarFragment.Group.prototype.isSelected = function() {
	let sidebar = this.getSidebar();
	return sidebar != null ? sidebar.getSelected() == this.getIndex() : false;
};

SidebarFragment.Group.prototype.click = function() {
	let sidebar = this.getSidebar();
	if (sidebar != null) {
		if (this.isSelected()) {
			sidebar.unselect();
		} else {
			sidebar.select(this);
		}
	}
	ImageFragment.prototype.click.apply(this, arguments);
};

SidebarFragment.Group.prototype.hold = function() {
	let succeed = ImageFragment.prototype.hold.apply(this, arguments);
	if (succeed) {
		return true;
	}
	let hint = null;
	this.onFetch && (hint = this.onFetch(this, this.getIndex()));
	if (hint == null) {
		let sidebar = this.getSidebar();
		if (sidebar != null) {
			sidebar.onGroupFetch && (hint = sidebar.onGroupFetch(sidebar, this, this.getIndex()));
		}
	}
	hint != null && showHint(hint);
	return true;
};

SidebarFragment.Group.prototype.getIndex = function() {
	let menu = this.getSidebar();
	if (menu != null && (menu = menu.getMenuFragment()) != null) {
		return menu.indexOf(this);
	}
	return -1;
};

SidebarFragment.Group.prototype.setOnSelectListener = function(listener) {
	if (listener != null) {
		this.onSelect = listener.bind(this);
	} else {
		delete this.onSelect;
	}
	return this;
};

SidebarFragment.Group.prototype.setOnUndockListener = function(listener) {
	if (listener != null) {
		this.onUndock = listener.bind(this);
	} else {
		delete this.onUndock;
	}
	return this;
};

SidebarFragment.Group.prototype.setOnFetchListener = function(listener) {
	if (listener != null) {
		this.onFetch = listener.bind(this);
	} else {
		delete this.onFetch;
	}
	return this;
};

SidebarFragment.Group.prototype.setOnItemSelectListener = function(listener) {
	if (listener != null) {
		this.onItemSelect = listener.bind(this);
	} else {
		delete this.onItemSelect;
	}
	return this;
};

SidebarFragment.Group.prototype.setOnItemFetchListener = function(listener) {
	if (listener != null) {
		this.onItemFetch = listener.bind(this);
	} else {
		delete this.onItemFetch;
	}
	return this;
};

SidebarFragment.Group.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof SidebarFragment.Group)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarFragment.Group();
	}
	instanceOrJson = LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredFragment !== undefined ? preferredFragment : "sidebarGroupItem");
	json = calloutOrParse(this, json, instanceOrJson);
	if (json == null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("items")) {
		LayoutFragment.parseLayoutJson.call(this, instanceOrJson, json, json.items, "sidebarGroupItem");
	}
	if (json.hasOwnProperty("selectedBackground")) {
		instanceOrJson.setSelectedBackground(calloutOrParse(json, json.selectedBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("unselectedBackground")) {
		instanceOrJson.setUnselectedBackground(calloutOrParse(json, json.unselectedBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("icon")) {
		instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("select")) {
		instanceOrJson.setOnSelectListener(parseCallback(json, json.select, this));
	}
	if (json.hasOwnProperty("undock")) {
		instanceOrJson.setOnUndockListener(parseCallback(json, json.undock, this));
	}
	if (json.hasOwnProperty("fetch")) {
		instanceOrJson.setOnFetchListener(parseCallback(json, json.fetch, this));
	}
	if (json.hasOwnProperty("selectItem")) {
		instanceOrJson.setOnItemSelectListener(parseCallback(json, json.selectItem, this));
	}
	if (json.hasOwnProperty("fetchItem")) {
		instanceOrJson.setOnItemFetchListener(parseCallback(json, json.fetchItem, this));
	}
	return instanceOrJson;
};

registerFragmentJson("sidebar_group", SidebarFragment.Group);
registerFragmentJson("sidebarGroup", SidebarFragment.Group);

SidebarFragment.Group.Item = function(parentOrSrc, srcOrAction, action) {
	ImageFragment.call(this);
	if (parentOrSrc instanceof SidebarFragment.Group) {
		this.attachToGroup(parentOrSrc);
		srcOrAction && this.setImage(srcOrAction);
		action && this.setOnSelectListener(action);
	} else {
		parentOrSrc && this.setImage(parentOrSrc);
		srcOrAction && this.setOnSelectListener(srcOrAction);
	}
};

SidebarFragment.Group.Item.prototype = new ImageFragment;

SidebarFragment.Group.Item.prototype.resetContainer = function() {
	let container = new android.widget.ImageView(getContext());
	container.setLayoutParams(new android.widget.LinearLayout.LayoutParams
		(toComplexUnitDip(54), toComplexUnitDip(54)));
	container.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
		toComplexUnitDip(8), toComplexUnitDip(8));
	this.setContainerView(container);
};

SidebarFragment.Group.Item.prototype.getImageView = function() {
	return this.getContainer();
};

SidebarFragment.Group.Item.prototype.setImage = function(src) {
	if (isAndroid()) {
		let container = this.getContainer();
		if (container == null) return this;
		if (src != null && typeof src == "object") {
			$.ViewCompat.setTransitionName(container, src.bitmap + "Item");
		} else {
			$.ViewCompat.setTransitionName(container, src + "Item");
		}
	}
	return ImageFragment.prototype.setImage.apply(this, arguments);
};

SidebarFragment.Group.Item.prototype.getTitle = function() {
	return this.title || null;
};

SidebarFragment.Group.Item.prototype.setTitle = function(title) {
	let container = this.getContainer();
	if (container == null) return this;
	// TODO
	this.title = title;
	return this;
};

SidebarFragment.Group.Item.prototype.getGroup = function() {
	return this.group || null;
};

SidebarFragment.Group.Item.prototype.attachToGroup = function(group) {
	if (group == null) {
		MCSystem.throwException("Modding Tools: Group cannot be null or undefined!");
	}
	let attached = this.getGroup();
	if (attached != null) {
		MCSystem.throwException("Modding Tools: You are must deattach sidebar item firstly!");
	}
	let window = group.getSidebar();
	if (window != null && (window = window.getWindow()) != null) {
		let actor = new android.transition.ChangeBounds();
		actor.setDuration(200);
		window.beginDelayedTransition(actor);
	}
	this.group = group;
	return true;
};

SidebarFragment.Group.Item.prototype.deattachFromGroup = function() {
	let group = this.getGroup();
	if (group == null) {
		return false;
	}
	let window = group.getSidebar();
	if (window != null && (window = window.getWindow()) != null) {
		let actor = new android.transition.ChangeBounds();
		actor.setDuration(350);
		window.beginDelayedTransition(actor);
	}
	delete this.group;
	return true;
};

SidebarFragment.Group.Item.prototype.click = function() {
	this.onSelect && this.onSelect(this, this.getIndex());
	let group = this.getGroup();
	if (group != null) {
		group.onItemSelect && group.onItemSelect(group, this, group.getIndex(), this.getIndex());
		let sidebar = group.getSidebar();
		if (sidebar != null) {
			sidebar.onItemSelect && sidebar.onItemSelect(sidebar, group, this, group.getIndex(), this.getIndex());
		}
	}
	ImageFragment.prototype.click.apply(this, arguments);
};

SidebarFragment.Group.Item.prototype.hold = function() {
	let succeed = ImageFragment.prototype.hold.apply(this, arguments);
	if (succeed) {
		return true;
	}
	let hint = null;
	this.onFetch && (hint = this.onFetch(this, this.getIndex()));
	if (hint == null) {
		let group = this.getGroup();
		if (group != null) {
			group.onItemFetch && (hint = group.onItemFetch(group, this, group.getIndex(), this.getIndex()));
			if (hint == null) {
				let sidebar = group.getSidebar();
				if (sidebar != null) {
					sidebar.onItemFetch && (hint = sidebar.onItemFetch(sidebar, group, this, group.getIndex(), this.getIndex()));
				}
			}
		}
	}
	hint != null && showHint(hint);
	return true;
};

SidebarFragment.Group.Item.prototype.getIndex = function() {
	let group = this.getGroup();
	return group != null ? group.indexOf(this) : -1;
};

SidebarFragment.Group.Item.prototype.setOnSelectListener = function(listener) {
	if (listener != null) {
		this.onSelect = listener.bind(this);
	} else {
		delete this.onSelect;
	}
	return this;
};

SidebarFragment.Group.Item.prototype.setOnFetchListener = function(listener) {
	if (listener != null) {
		this.onFetch = listener.bind(this);
	} else {
		delete this.onFetch;
	}
	return this;
};

SidebarFragment.Group.Item.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof SidebarFragment.Group.Item)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarFragment.Group.Item();
	}
	instanceOrJson = ImageFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json == null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("title")) {
		instanceOrJson.setTitle(calloutOrParse(json, json.title, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("select")) {
		instanceOrJson.setOnSelectListener(parseCallback(json, json.select, this));
	}
	if (json.hasOwnProperty("fetch")) {
		instanceOrJson.setOnFetchListener(parseCallback(json, json.fetch, this));
	}
	return instanceOrJson;
};

registerFragmentJson("sidebar_group_item", SidebarFragment.Group.Item);
registerFragmentJson("sidebarGroupItem", SidebarFragment.Group.Item);

SidebarFragment.Rail = function() {
	ScrollFragment.apply(this, arguments);
};

SidebarFragment.Rail.prototype = new ScrollFragment;

SidebarFragment.Rail.prototype.resetContainer = function() {
	ScrollFragment.prototype.resetContainer.apply(this, arguments);
	this.getContainerLayout().setMinimumHeight(getDisplayHeight());
};

SidebarFragment.Rail.prototype.addViewDirectly = function(view, params) {
	if (params == null && this.hasMark("fill")) {
		params = new android.widget.LinearLayout.LayoutParams
			($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.MATCH_PARENT);
		menuDividers && (params.topMargin = toComplexUnitDip(1));
		params.weight = 1.;
	}
	ScrollFragment.prototype.addViewDirectly.call(this, view, params);
};

SidebarFragment.Rail.prototype.addFragment = function() {
	let index = ScrollFragment.prototype.addFragment.apply(this, arguments);
	if (index >= 0) {
		let fragment = this.getFragmentAt(index);
		if (fragment != null) {
			fragment.attachToSidebar && fragment.attachToSidebar(this.getParent());
		}
	}
	return index;
};

SidebarFragment.Rail.prototype.removeFragment = function(indexOrFragment) {
	if (indexOrFragment instanceof Fragment) {
		indexOrFragment = this.indexOf(indexOrFragment);
	}
	if (indexOrFragment >= 0) {
		let fragment = this.getFragmentAt(indexOrFragment);
		if (fragment != null) {
			fragment.deattachFromSidebar && fragment.deattachFromSidebar();
		}
	}
	return ScrollFragment.prototype.removeFragment.apply(this, arguments);
};

SidebarFragment.Rail.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof SidebarFragment.Rail)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarFragment.Rail();
	}
	return ScrollFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
};

registerFragmentJson("sidebar_rail", SidebarFragment.Rail);
registerFragmentJson("sidebarRail", SidebarFragment.Rail);

SidebarFragment.Rail.Item = function() {
	ImageFragment.call(this);
};

SidebarFragment.Rail.Item.prototype = new ImageFragment;

SidebarFragment.Rail.Item.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(getContext());
	container.setGravity($.Gravity.CENTER);
	this.setContainerView(container);

	let icon = new android.widget.ImageView(getContext());
	icon.setTag("railItemIcon");
	container.addView(icon);

	this.setSelectedBackground("popupSelectionSelected");
	menuDividers && this.setUnselectedBackground("popup");
};

SidebarFragment.Rail.Item.prototype.getImageView = function() {
	return this.findViewByTag("railItemIcon");
};

SidebarFragment.Rail.Item.prototype.collapse = function() {
	let icon = this.getImageView();
	icon.setScaleType($.ImageView.ScaleType.CENTER_CROP);
	icon.setLayoutParams(new android.widget.LinearLayout.LayoutParams
		(toComplexUnitDip(36), toComplexUnitDip(54)));
	icon.setPadding(toComplexUnitDip(28), 0, 0, 0);
	this.getContainer().setMinimumHeight(toComplexUnitDip(120));
};

SidebarFragment.Rail.Item.prototype.expand = function() {
	let icon = this.getImageView();
	icon.setScaleType($.ImageView.ScaleType.FIT_CENTER);
	icon.setLayoutParams(new android.widget.LinearLayout.LayoutParams
		(toComplexUnitDip(54), toComplexUnitDip(54)));
	icon.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
		toComplexUnitDip(8), toComplexUnitDip(8));
	this.getContainer().setMinimumHeight(0);
};

SidebarFragment.Rail.Item.prototype.isSelected = function() {
	return this.selected || false;
};

SidebarFragment.Rail.Item.prototype.select = function() {
	if (this.isSelected()) {
		return false;
	}
	let parent = this.getParent();
	if (parent != null && parent.selectChild != null && !parent.selectChild(this)) {
		return false;
	}
	this.selected = true;
	this.onSelect && this.onSelect(parent);
	this.updateSelection();
	return true;
};

SidebarFragment.Rail.Item.prototype.unselect = function() {
	if (!this.isSelected()) {
		return false;
	}
	let parent = this.getParent();
	if (parent != null && parent.unselectChild != null && !parent.unselectChild(this)) {
		return false;
	}
	this.selected = false;
	this.onUnselect && this.onUnselect(parent);
	this.updateSelection();
	return true;
};

SidebarFragment.Rail.Item.prototype.getSelectedBackground = function() {
	return this.selectedBackground || null;
};

SidebarFragment.Rail.Item.prototype.setSelectedBackground = function(src) {
	this.selectedBackground = src;
	this.isSelected() && this.updateSelection();
	return this;
};

SidebarFragment.Rail.Item.prototype.getUnselectedBackground = function() {
	return this.unselectedBackground || null;
};

SidebarFragment.Rail.Item.prototype.setUnselectedBackground = function(src) {
	this.unselectedBackground = src;
	this.isSelected() || this.updateSelection();
	return this;
};

SidebarFragment.Rail.Item.prototype.updateSelection = function() {
	if (this.isSelected()) {
		this.setBackground(this.getSelectedBackground());
	} else {
		this.setBackground(this.getUnselectedBackground());
	}
	return this;
};

SidebarFragment.Rail.Item.prototype.update = function() {
	this.updateSelection();
	return ImageFragment.prototype.update.apply(this, arguments);
};

SidebarFragment.Rail.Item.prototype.setOnSelectListener = function(listener) {
	if (listener != null) {
		this.onSelect = listener.bind(this);
	} else {
		delete this.onSelect;
	}
	return this;
};

SidebarFragment.Rail.Item.prototype.setOnUnselectListener = function(listener) {
	if (listener != null) {
		this.onUnselect = listener.bind(this);
	} else {
		delete this.onUnselect;
	}
	return this;
};

SidebarFragment.Rail.Item.prototype.setOnFetchListener = function(listener) {
	if (listener != null) {
		this.onFetch = listener.bind(this);
	} else {
		delete this.onFetch;
	}
	return this;
};

registerFragmentJson("sidebar_rail_item", SidebarFragment.Rail.Item);
registerFragmentJson("sidebarRailItem", SidebarFragment.Rail.Item);

SidebarFragment.Panel = function() {
	ScrollFragment.apply(this, arguments);
};

SidebarFragment.Panel.prototype = new ScrollFragment;

SidebarFragment.Panel.prototype.resetContainer = function() {
	ScrollFragment.prototype.resetContainer.apply(this, arguments);
	let layout = this.getContainerLayout();
	layout.setGravity($.Gravity.TOP | $.Gravity.CENTER);
	layout.setMinimumHeight(getDisplayHeight());
};

SidebarFragment.Panel.prototype.addFragment = function() {
	let index = LayoutFragment.prototype.addFragment.apply(this, arguments);
	if (index >= 0) {
		this.getContainerLayout().setMinimumWidth(toComplexUnitDip(270));
	}
	return index;
};

SidebarFragment.Panel.prototype.removeFragment = function() {
	let succeed = LayoutFragment.prototype.removeFragment.apply(this, arguments);
	if (succeed && this.getFragmentCount() == 0) {
		this.getContainerLayout().setMinimumWidth(0);
	}
	return succeed;
};

SidebarFragment.Panel.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof SidebarFragment.Panel)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarFragment.Panel();
	}
	return ScrollFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
};

registerFragmentJson("sidebar_panel", SidebarFragment.Panel);
registerFragmentJson("sidebarPanel", SidebarFragment.Panel);
