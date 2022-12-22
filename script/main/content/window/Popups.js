/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */
const Popups = {};

Popups.widgets = [];

Popups.getOpenedIds = function() {
	let ids = [];
	for (let i = 0; i < this.widgets.length; i++) {
		ids.push(this.widgets[i].id);
	}
	return ids;
};

Popups.getOpened = function() {
	return this.widgets;
};

Popups.open = function(widget, id) {
	if (widget === undefined || widget === null) {
		Logger.Log("ModdingTools: Widget passed to openPopup " + id + " is undefined or null", "WARNING");
		return;
	}
	let opened = this.closeIfOpened(id);
	if (!opened) {
		let index = this.widgets.length;
		if (index > maxWindows) {
			this.closeFirst();
		}
		this.widgets.push(widget);
		widget.id = id;
		widget.showInternal();
	}
};

Popups.getAvailablePlace = function(root) {
	if (toComplexUnitDip(160) > getDisplayHeight()) {
		showHint("No place for open popup", ColorDrawable.parseColor("YELLOW"));
		return null;
	}
	return {
		x: random(toComplexUnitDip(64), getDisplayWidth() - toComplexUnitDip(128)),
		y: random(toComplexUnitDip(64), getDisplayHeight() - toComplexUnitDip(128))
	};
};

Popups.hasOpenedByName = function(id) {
	for (let i = 0; i < this.widgets.length; i++) {
		if (this.widgets[i].id == id) {
			return true;
		}
	}
	return false;
};

Popups.closeIfOpened = function(id) {
	for (let i = 0; i < this.widgets.length; i++) {
		if (this.widgets[i].id == id) {
			return this.close(i);
		}
	}
	return false;
};

Popups.closeAllByTag = function(tag) {
	if (!tag.endsWith("_")) {
		tag += "_";
	}
	for (let i = 0; i < this.widgets.length; i++) {
		if (this.widgets[i].id.startsWith(tag)) {
			this.close(i--);
		}
	}
};

Popups.close = function(index) {
	let widget = this.widgets[index];
	if (widget) {
		widget.dismissInternal();
		this.widgets.splice(index, 1);
		return true;
	}
	return false;
};

Popups.closeFirst = function() {
	return this.close(0);
};

Popups.closeAll = function() {
	while (this.widgets.length > 0) {
		this.closeFirst();
	}
};

Popups.updateAtName = function(id) {
	for (let i = 0; i < this.widgets.length; i++) {
		if (this.widgets[i].id == id) {
			return this.update(i);
		}
	}
	return false;
};

Popups.update = function(index) {
	let widget = this.widgets[index];
	if (widget) {
		widget.update();
		return true;
	}
	return false;
};

Popups.updateAll = function() {
	for (let item in this.widgets) {
		this.update(item);
	}
};
