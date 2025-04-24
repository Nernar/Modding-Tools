class ListFragment extends BaseFragment {
	readonly TYPE: string = "ListFragment";
	constructor() {
		super();
	}
	resetContainer() {
		let content = new android.widget.ListView(getContext());
		content.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_LTR);
		content.setDrawSelectorOnTop(false);
		content.setDividerHeight(0);
		let adapter = this.getListAdapter();
		adapter && content.setAdapter(adapter);
		content.setLayoutParams(new android.view.ViewGroup.LayoutParams
			(android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.MATCH_PARENT));
		this.setContainerView(content);
		this.setSelectionMode(SelectableLayoutFragment.MODE_SINGLE);
	}
	resetListeners() {
		let list = this.getListView();
		if (list == null) {
			return;
		}
		list.setOnItemClickListener((parent, view, position, id) => {
			try {
				if (parent.isItemChecked(position)) {
					this.selectItemInLayout(position);
				} else {
					this.unselectItemInLayout(position);
				}
			} catch (e) {
				reportError(e);
			}
		});
		list.setOnItemLongClickListener((parent, view, position, id) => {
			try {
				if (this.holdItemInLayout(position)) {
					return true;
				}
			} catch (e) {
				reportError(e);
			}
			return false;
		});
	}
	getListView() {
		return this.getContainer() as android.widget.ListView;
	}
	private holderAdapter: Nullable<ListHolderAdapter>;
	getListAdapter() {
		if (this.holderAdapter == null) {
			let adapter = new ListHolderAdapter();
			adapter.setFragmentAdapter(this);
			this.holderAdapter = adapter;
		}
		return this.holderAdapter;
	}
	setItems(items: Nullable<any[]>) {
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
	}
	updateItems() {
		let adapter = this.getListAdapter();
		adapter == null || adapter.notifyDataSetChanged();
	}
	setSelectionMode(mode) {
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
	}
	isItemSelected(index) {
		let list = this.getListView();
		return list.isItemChecked(index);
	}
	getSelectedItem() {
		let list = this.getListView();
		return list.getCheckedItemPosition() - 0;
	}
	getSelectedItems() {
		let list = this.getListView();
		let items = list.getCheckedItemPositions();
		let selected = [];
		if (items != null) {
			for (let offset = 0, size = items.size(); offset < size; offset++) {
				selected.push(items.get(offset) - 0);
			}
		}
		return selected;
	}
	selectItem(index) {
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
	}
	unselectItem(index) {
		let list = this.getListView();
		if (!list.isItemChecked(index)) {
			return false;
		}
		list.setItemChecked(index, false);
		this.unselectItemInLayout(index);
		return true;
	}
	canSelectItem(index) {
		if (this.getSelectionMode() == SelectableLayoutFragment.MODE_NONE) {
			return false;
		}
		let list = this.getListView();
		return !list.isItemChecked(index);
	}
	canUnselectItem(index) {
		let list = this.getListView();
		return list.isItemChecked(index);
	}
	selectItemInLayout(index) {
		if (this.getSelectionMode() == SelectableLayoutFragment.MODE_SINGLE) {
			if (this.rememberedSingleSelectionModeIndex != null) {
				this.unselectItemInLayout(this.rememberedSingleSelectionModeIndex);
			}
			this.rememberedSingleSelectionModeIndex = index;
		}
		this.onSelectItem && this.onSelectItem(index);
	}
	unselectItemInLayout(index) {
		this.onUnselectItem && this.onUnselectItem(index);
	}
	bindItemFragment(adapter, position, parent) {
		return (this.onBindItem && this.onBindItem(this, adapter, position, parent)) || null;
	}
	describeItemFragment(adapter, holder, item, position, parent) {
		this.onDescribeItem && this.onDescribeItem(this, adapter, holder, item, position, parent);
	}
	setOnBindItemListener(listener) {
		if (typeof listener == "function") {
			this.onBindItem = listener;
		} else {
			delete this.onBindItem;
		}
		return this;
	}
	setOnDescribeItemListener(listener) {
		if (typeof listener == "function") {
			this.onDescribeItem = listener;
		} else {
			delete this.onDescribeItem;
		}
		return this;
	}
}

applyMixins(ListFragment, SelectableLayoutFragment);

interface IListFragment<ABC = IListFragment<any>> extends IBaseFragment<ABC> {
	bindItem?: (self: ABC, adapter: any, position: number, parent: Fragment | FocusableWindow) => any;
	describeItem?: (self: ABC, adapter: any, holder: any, item: any, position: number, parent: Fragment | FocusableWindow) => void;
	items?: CallableJsonProperty1<ABC, any[]>;
}

namespace ListFragment {
	export function parseJson(instanceOrJson, json?) {
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
	}
}

registerFragmentJson("list", ListFragment);
