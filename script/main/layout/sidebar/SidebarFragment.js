const SidebarFragment = function() {
	MCSystem.throwException("Modding Tools: SidebarFragment cannot be instantiated!");
};

SidebarFragment.Rail = function() {
	ScrollFragment.apply(this, arguments);
};

__inherit__(SidebarFragment.Rail, ScrollFragment, SelectableLayoutFragment.prototype);

SidebarFragment.Rail.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(getContext());
	container.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_RTL);
	this.setContainerView(container);

	let selection = new LayoutFragment();
	selection.setContainerView(container);
	this.selectionFragment = selection;

	let scroll = new android.widget.ScrollView(getContext());
	scroll.setTag("containerScroll");
	container.addView(scroll);

	let layout = new android.widget.LinearLayout(getContext());
	layout.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_LTR);
	layout.setOrientation($.LinearLayout.VERTICAL);
	layout.setMinimumHeight(getDisplayHeight());
	layout.setTag("containerLayout");
	scroll.addView(layout);

	menuDividers || this.setContainerBackground("popup");
	this.setSelectionMode(SelectableLayoutFragment.SELECTION_NONE);
};

SidebarFragment.Rail.prototype.getSelectionFragment = function() {
	return this.selectionFragment || null;
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

SidebarFragment.Rail.prototype.selectItemLayout = function(item) {
	let selection = this.getSelectionFragment();
	if (item instanceof LayoutFragment) {
		let fragments = item.getFragments();
		for (let offset = 0; offset < fragments.length; offset++) {
			let fragment = fragments[offset];
			if (selection.indexOf(fragment) == -1) {
				selection.addFragment(fragment);
			}
		}
	}
	SelectableLayoutFragment.prototype.selectItemLayout.apply(this, arguments);
};

SidebarFragment.Rail.prototype.unselectItemLayout = function(item) {
	let selection = this.getSelectionFragment();
	if (item instanceof LayoutFragment) {
		let fragments = item.getFragments();
		for (let offset = 0; offset < fragments.length; offset++) {
			let fragment = fragments[offset];
			if (selection.indexOf(fragment) != -1) {
				selection.removeFragment(fragment);
			}
		}
	}
	SelectableLayoutFragment.prototype.unselectItemLayout.apply(this, arguments);
};

SidebarFragment.Rail.prototype.getContainerBackground = function() {
	return this.getBackground("container");
};

SidebarFragment.Rail.prototype.setContainerBackground = function(src) {
	return this.setBackground(src, "container", this.getContainerLayout());
};

SidebarFragment.Rail.prototype.expand = function(condition) {
	if (condition != null) {
		condition = condition.bind(this);
	}
	let fragments = this.getFragments();
	for (let offset = 0; offset < fragments.length; offset++) {
		let fragment = fragments[offset];
		if (fragment.expand && (!condition || condition(fragment))) {
			fragment.expand();
		}
	}
};

SidebarFragment.Rail.prototype.collapse = function(condition) {
	if (condition != null) {
		condition = condition.bind(this);
	}
	let fragments = this.getFragments();
	for (let offset = 0; offset < fragments.length; offset++) {
		let fragment = fragments[offset];
		if (fragment.collapse && (!condition || condition(fragment))) {
			fragment.collapse();
		}
	}
};

SidebarFragment.Rail.prototype.fetchItemLayout = function(item) {
	return (this.onFetchItem && this.onFetchItem(item, item.getIndex())) || null;
};

SidebarFragment.Rail.prototype.setOnFetchItemListener = function(listener) {
	if (listener != null) {
		this.onFetchItem = listener.bind(this);
	} else {
		delete this.onFetchItem;
	}
	return this;
};

SidebarFragment.Rail.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof SidebarFragment.Rail)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarFragment.Rail();
	} else {
		instanceOrJson.getSelectionFragment().removeFragments();
	}
	instanceOrJson = ScrollFragment.parseJson.call(this, instanceOrJson, json, preferredFragment || "sidebarRailItem");
	json = calloutOrParse(this, json, instanceOrJson);
	if (json == null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("containerBackground")) {
		instanceOrJson.setContainerBackground(calloutOrParse(json, json.containerBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("fetchItem")) {
		instanceOrJson.setOnFetchItemListener(parseCallback(json, json.fetchItem, this));
	}
	if (json.hasOwnProperty("expanded") && calloutOrParse(json, json.expanded, [this, instanceOrJson])) {
		instanceOrJson.expand();
	}
	SelectableLayoutFragment.parseJson.call(this, instanceOrJson, json);
	return instanceOrJson;
};

registerFragmentJson("sidebar_rail", SidebarFragment.Rail);
registerFragmentJson("sidebarRail", SidebarFragment.Rail);

SidebarFragment.Rail.Item = function() {
	LayoutFragment.call(this);
};

__inherit__(SidebarFragment.Rail.Item, LayoutFragment, ImageFragmentMixin, SelectableFragment.prototype);

SidebarFragment.Rail.Item.prototype.resetContainer = function() {
	let container = new android.widget.LinearLayout(getContext());
	container.setGravity($.Gravity.CENTER);
	this.setContainerView(container);

	let icon = new android.widget.ImageView(getContext());
	icon.setTag("railItemIcon");
	container.addView(icon);

	this.setSelectedBackground("popupSelectionSelected");
	menuDividers && this.setUnselectedBackground("popup");
	this.collapse();
};

SidebarFragment.Rail.Item.prototype.getContainerLayout = function() {
	return null;
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

SidebarFragment.Rail.Item.prototype.click = function() {
	this.toggle();
	ImageFragment.prototype.click.apply(this, arguments);
};

SidebarFragment.Rail.Item.prototype.hold = function() {
	let text = null;
	if (this.onFetch && (text = this.onFetch())) {
		typeof text == "boolean" || showHint(text);
	} else {
		let parent = this.getParent();
		if (parent && parent.fetchItemLayout && (text = parent.fetchItemLayout(this))) {
			typeof text == "boolean" || showHint(text);
		}
	}
	return ImageFragment.prototype.hold.apply(this, arguments) || !!text;
};

SidebarFragment.Rail.Item.prototype.update = function() {
	this.updateSelection();
	return LayoutFragment.prototype.update.apply(this, arguments);
};

SidebarFragment.Rail.Item.prototype.setOnFetchListener = function(listener) {
	if (listener != null) {
		this.onFetch = listener.bind(this);
	} else {
		delete this.onFetch;
	}
	return this;
};

SidebarFragment.Rail.Item.parseJson = function(instanceOrJson, json, preferredFragment) {
	if (!(instanceOrJson instanceof SidebarFragment.Rail.Item)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarFragment.Rail.Item();
	}
	instanceOrJson = LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredFragment || "sidebarPanel");
	json = calloutOrParse(this, json, instanceOrJson);
	if (json == null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("icon")) {
		instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("fetch")) {
		instanceOrJson.setOnFetchListener(parseCallback(json, json.fetch, this));
	}
	if (json.hasOwnProperty("expanded") && calloutOrParse(json, json.expanded, [this, instanceOrJson])) {
		instanceOrJson.expand();
	}
	SelectableFragment.parseJson.call(this, instanceOrJson, json);
	return instanceOrJson;
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
	layout.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_LTR);
	layout.setGravity($.Gravity.TOP | $.Gravity.CENTER);
	layout.setMinimumHeight(getDisplayHeight());
};

SidebarFragment.Panel.prototype.addFragment = function() {
	let index = LayoutFragment.prototype.addFragment.apply(this, arguments);
	if (index >= 0) {
		this.getContainerLayout().setMinimumWidth(toComplexUnitDip(300)); // 270
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
