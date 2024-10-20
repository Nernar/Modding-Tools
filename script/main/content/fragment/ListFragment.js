/**
 * @type
 */
const ListFragment = function() {
	BaseFragment.apply(this, arguments);
};

__inherit__(ListFragment, BaseFragment, SelectableLayoutFragment.prototype);
ListFragment.prototype.TYPE = "ListFragment";

ListFragment.prototype.resetContainer = function() {
	let content = new android.widget.ListView(getContext());
	content.setDrawSelectorOnTop(false);
	let adapter = this.getListAdapter();
	adapter && content.setAdapter(adapter);
	this.setContainerView(content);
	this.setSelectionMode(SelectableLayoutFragment.MODE_SINGLE);
};

ListFragment.prototype.resetListeners = function() {
	let list = this.getListView();
	if (list == null) {
		return;
	}
	list.setOnItemClickListener((function(parent, view, position, id) {
		try {
			if (parent.isItemChecked(position)) {
				this.selectItemInLayout(position);
			} else {
				this.unselectItemInLayout(position);
			}
		} catch (e) {
			reportError(e);
		}
	}).bind(this));
	list.setOnItemLongClickListener((function(parent, view, position, id) {
		try {
			if (this.holdItemInLayout(position)) {
				return true;
			}
		} catch (e) {
			reportError(e);
		}
		return false;
	}).bind(this));
};

ListFragment.prototype.getListView = function() {
	return this.getContainer();
};

ListFragment.prototype.getListAdapter = function() {
	if (this.holderAdapter == null) {
		let adapter = new ListHolderAdapter();
		adapter.setFragmentAdapter(this);
		this.holderAdapter = adapter;
	}
	return this.holderAdapter;
};

ListFragment.prototype.setItems = function(items) {
	let adapter = this.getListAdapter();
	if (adapter == null) {
		return false;
	}
	if (Array.isArray(items)) {
		adapter.setItems(items);
	} else {
		adapter.setItems([]);
	}
	return true;
};

ListFragment.prototype.updateItems = function() {
	let adapter = this.getListAdapter();
	adapter == null || adapter.notifyDataSetChanged();
};

ListFragment.prototype.setSelectionMode = function(mode) {
	if (mode == null || this.getSelectionMode() == mode) {
		return;
	}
	if (this.getSelectionMode() == SelectableLayoutFragment.MODE_SINGLE) {
		delete this.rememberedSingleSelectionModeIndex;
	}
	let list = this.getListView();
	if (mode == SelectableLayoutFragment.MODE_SINGLE) {
		let selected = this.getSelectedItems();
		for (let offset = 1; offset < selected.length; offset++) {
			this.unselectItem(selected[offset]);
		}
		list.setChoiceMode($.ListView.CHOICE_MODE_SINGLE);
	} else if (mode == SelectableLayoutFragment.MODE_MULTIPLE) {
		list.setChoiceMode($.ListView.CHOICE_MODE_MULTIPLE);
	} else {
		let selected = this.getSelectedItems();
		for (let offset = 0; offset < selected.length; offset++) {
			this.unselectItemInLayout(selected[offset]);
		}
		list.setChoiceMode($.ListView.CHOICE_MODE_NONE);
	}
	this.selectionMode = mode;
};

ListFragment.prototype.isItemSelected = function(index) {
	let list = this.getListView();
	return list.isItemChecked(index);
};

ListFragment.prototype.getSelectedItem = function() {
	let list = this.getListView();
	return list.getCheckedItemPosition() - 0;
};

ListFragment.prototype.getSelectedItems = function() {
	let list = this.getListView();
	let items = list.getCheckedItemPositions();
	let selected = [];
	if (items != null) {
		for (let offset = 0, size = items.size(); offset < size; offset++) {
			selected.push(items.get(offset) - 0);
		}
	}
	return selected;
};

ListFragment.prototype.selectItem = function(index) {
	if (this.getSelectionMode() == SelectableLayoutFragment.MODE_NONE) {
		return false;
	}
	let list = this.getListView();
	if (list.isItemChecked(index)) {
		return false;
	}
	list.setItemChecked(index, true);
	this.selectItemInLayout(index);
	return true;
};

ListFragment.prototype.unselectItem = function(index) {
	let list = this.getListView();
	if (!list.isItemChecked(index)) {
		return false;
	}
	list.setItemChecked(index, false);
	this.unselectItemInLayout(index);
	return true;
};

ListFragment.prototype.canSelectItem = function(index) {
	if (this.getSelectionMode() == SelectableLayoutFragment.MODE_NONE) {
		return false;
	}
	let list = this.getListView();
	return !list.isItemChecked(index);
};

ListFragment.prototype.canUnselectItem = function(index) {
	let list = this.getListView();
	return list.isItemChecked(index);
};

ListFragment.prototype.selectItemInLayout = function(index) {
	if (this.getSelectionMode() == SelectableLayoutFragment.MODE_SINGLE) {
		if (this.rememberedSingleSelectionModeIndex != null) {
			this.unselectItemInLayout(this.rememberedSingleSelectionModeIndex);
		}
		this.rememberedSingleSelectionModeIndex = index;
	}
	this.onSelectItem && this.onSelectItem(index);
};

ListFragment.prototype.unselectItemInLayout = function(index) {
	this.onUnselectItem && this.onUnselectItem(index);
};

ListFragment.prototype.bindItemFragment = function(adapter, position, parent) {
	return (this.onBindItem && this.onBindItem(this, adapter, position, parent)) || null;
};

ListFragment.prototype.describeItemFragment = function(adapter, holder, item, position, parent) {
	this.onDescribeItem && this.onDescribeItem(this, adapter, holder, item, position, parent);
};

ListFragment.prototype.setOnBindItemListener = function(listener) {
	if (typeof listener == "function") {
		this.onBindItem = listener.bind(this);
	} else {
		delete this.onBindItem;
	}
	return this;
};

ListFragment.prototype.setOnDescribeItemListener = function(listener) {
	if (typeof listener == "function") {
		this.onDescribeItem = listener.bind(this);
	} else {
		delete this.onDescribeItem;
	}
	return this;
};

ListFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ListFragment)) {
		json = instanceOrJson;
		instanceOrJson = new ListFragment();
	}
	instanceOrJson = BaseFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("bindItem")) {
		instanceOrJson.setOnBindItemListener(parseCallback(json, json.bindItem, this));
	}
	if (json.hasOwnProperty("describeItem")) {
		instanceOrJson.setOnDescribeItemListener(parseCallback(json, json.describeItem, this));
	}
	if (json.hasOwnProperty("items")) {
        instanceOrJson.setItems(calloutOrParse(json, json.items, [this, instanceOrJson]));
	}
	SelectableLayoutFragment.parseJson.call(this, instanceOrJson, json);
	return instanceOrJson;
};

registerFragmentJson("list", ListFragment);
