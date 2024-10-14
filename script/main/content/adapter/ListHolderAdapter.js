/**
 * @requires `isAndroid()`
 * @type
 */
const ListHolderAdapter = function(proto) {
	return new JavaAdapter(android.widget.BaseAdapter, android.widget.Adapter, merge(merge(this, proto), {
		getCount: function() {
			// No Context associated with current Thread
			org.mozilla.javascript.Context.enter();
			try {
				return this.getItemCount() || 0;
			} catch (e) {
				reportError(e);
			}
			return 0;
		},
		getItemId: function(position) {
			return position;
		},
		getItem: function(position) {
			try {
				let items = this.getItems();
				if (items == null) return null;
				return items.length > position ? items[position] : null;
			} catch (e) {
				reportError(e);
			}
			return null;
		},
		getView: function(position, convertView, parent) {
			try {
				let holder;
				if (convertView == null) {
					if (this.adapterFragment && this.adapterFragment.bindItemFragment) {
						holder = this.adapterFragment.bindItemFragment(this, position, convertView, parent);
						holder && (convertView = holder.getContainer());
					}
					if (holder == null) {
						convertView = this.bindView(position, parent);
						holder = this.bindHolder(convertView);
					}
					convertView.setTag(holder);
				} else {
					holder = convertView.getTag();
				}
				if (this.adapterFragment && this.adapterFragment.describeItemFragment) {
					this.adapterFragment.describeItemFragment(this, this.getItem(position), position, convertView, parent);
				} else {
					this.describe(holder, position, convertView, parent);
				}
				return convertView;
			} catch (e) {
				reportError(e);
			}
			let view = new android.view.View(getContext());
			view.setBackgroundColor($.Color.RED);
			view.setLayoutParams(new android.view.ViewGroup.LayoutParams(
				android.view.ViewGroup.LayoutParams.MATCH_PARENT, toComplexUnitDip(32)
			));
			return view;
		}
	}));
};

ListHolderAdapter.prototype.setAdapterFragment = function(binder) {
	if (typeof binder == "function") {
		this.adapterFragment = binder.bind(this);
	} else {
		delete this.adapterFragment;
	}
	return this;
};

ListHolderAdapter.prototype.bindView = function(position, parent) {
	let view = new android.widget.TextView(getContext());
	view.setPadding(toComplexUnitDip(12), toComplexUnitDip(6),
		toComplexUnitDip(12), toComplexUnitDip(6));
	typeface && view.setTypeface(typeface);
	view.setTextColor($.Color.WHITE);
	view.setTextSize(toComplexUnitDp(9));
	return view;
};

ListHolderAdapter.prototype.bindHolder = function(view) {
	return {
		text: view
	};
};

ListHolderAdapter.prototype.describe = function(holder, position, view, parent) {
	let content = this.getItem(position);
	holder.text.setText("" + content);
};

ListHolderAdapter.prototype.getItems = function() {
	return this.array || null;
};

ListHolderAdapter.prototype.getItemCount = function() {
	let items = this.getItems();
	return (items == null ? 0 : items.length) || 0;
};

ListHolderAdapter.prototype.setItems = function(array) {
	this.array = array;
	this.notifyDataSetChanged();
};
