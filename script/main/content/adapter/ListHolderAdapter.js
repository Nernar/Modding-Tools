/**
 * @requires `isAndroid()`
 */
function ListHolderAdapter(proto) {
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
					convertView = this.bindView(position, parent);
					holder = this.bindHolder(convertView);
					convertView.setTag(holder);
				} else {
					holder = convertView.getTag();
				}
				this.describe(holder, position, convertView, parent);
				convertView.setTag(holder);
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

ListHolderAdapter.prototype.bindView = function(position, parent) {
	let view = new android.widget.TextView(getContext());
	view.setPadding(toComplexUnitDip(12), toComplexUnitDip(6),
		toComplexUnitDip(12), toComplexUnitDip(6));
	typeface && view.setTypeface(typeface);
	view.setTextColor($.Color.WHITE);
	view.setTextSize(toComplexUnitSp(9));
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
