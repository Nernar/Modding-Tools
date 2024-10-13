/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */
const Popups = {
	widgets: [],
	getOpenedIds() {
		let ids = [];
		for (let offset = 0; offset < this.widgets.length; offset++) {
			ids.push(this.widgets[offset].id);
		}
		return ids;
	},
	getOpened() {
		return this.widgets;
	},
	open(widget, id) {
		if (widget === undefined || widget === null) {
			Logger.Log("Modding Tools: Widget passed to openPopup " + id + " is undefined or null", "WARNING");
			return;
		}
		let opened = this.closeIfOpened(id);
		if (!opened) {
			// let index = this.widgets.length;
			// if (index > maxWindows) {
				// this.closeFirst();
			// }
			this.widgets.push(widget);
			widget.id = id;
			widget.showInternal();
		}
	},
	getAvailablePlace() {
		if (toComplexUnitDip(192) > getDisplayHeight()) {
			showHint("No place for open popup", ColorDrawable.parseColor("YELLOW"));
			return null;
		}
		return {
			x: random(toComplexUnitDip(64), getDisplayWidth() - toComplexUnitDip(128)),
			y: random(toComplexUnitDip(64), getDisplayHeight() - toComplexUnitDip(128))
		};
	},
	hasOpenedByName(id) {
		for (let offset = 0; offset < this.widgets.length; offset++) {
			if (this.widgets[offset].id == id) {
				return true;
			}
		}
		return false;
	},
	close(index) {
		let widget = this.widgets[index];
		if (widget) {
			widget.dismissInternal();
			this.widgets.splice(index, 1);
			return true;
		}
		return false;
	},
	closeFirst() {
		return this.close(0);
	},
	closeAll() {
		while (this.widgets.length > 0) {
			this.closeFirst();
		}
	},
	closeIfOpened(id) {
		for (let offset = 0; offset < this.widgets.length; offset++) {
			if (this.widgets[offset].id == id) {
				return this.close(offset);
			}
		}
		return false;
	},
	closeAllByTag(tag) {
		if (!tag.endsWith("_")) {
			tag += "_";
		}
		for (let offset = 0; offset < this.widgets.length; offset++) {
			if (this.widgets[offset].id.startsWith(tag)) {
				this.close(offset--);
			}
		}
	},
	update(index) {
		let widget = this.widgets[index];
		if (widget) {
			widget.update.apply(widget, Array.prototype.slice.call(arguments, 1));
			return true;
		}
		return false;
	},
	updateAtName(id) {
		let optionals = Array.prototype.slice.call(arguments, 1);
		for (let offset = 0; offset < this.widgets.length; offset++) {
			if (this.widgets[offset].id == id) {
				return this.update.apply(this, [offset].concat(optionals));
			}
		}
		return false;
	},
	updateAll() {
		for (let offset = 0; offset < this.widgets.length; offset++) {
			this.update.apply(this, [offset].concat(arguments));
		}
	}
};
