const Popups = {};

Popups.widgets = [];

Popups.open = function(widget, name) {
	if (widget === undefined || widget === null) {
		Logger.Log("ModdingTools: passed widget to openPopup " + name + " is undefined or not considered", "WARNING");
		return;
	}
	let opened = this.closeIfOpened(name);
	if (!opened) {
		let index = this.widgets.length;
		if (index > maxWindows) {
			this.closeFirst();
		}
		this.widgets.push(widget);
		widget.name = name;
		widget.show();
	}
};

Popups.getAvailablePlace = function(root) {
	// return showHint("No place for open popup", Interface.Color.YELLOW);
	return {
		x: Interface.getY(100) + Interface.getX(Math.random() * 800),
		y: Interface.getX(100) + Interface.getY(Math.random() * 200)
	};
};

Popups.hasOpenedByName = function(name) {
	for (let i = 0; i < this.widgets.length; i++) {
		if (this.widgets[i].name == name) {
			return true;
		}
	}
	return false;
};

Popups.closeIfOpened = function(name) {
	for (let i = 0; i < this.widgets.length; i++) {
		if (this.widgets[i].name == name) {
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
		if (this.widgets[i].name.startsWith(tag)) {
			this.close(i--);
		}
	}
};

Popups.close = function(index) {
	let widget = this.widgets[index];
	if (widget) {
		widget.hide();
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

Popups.updateAtName = function(name) {
	for (let i = 0; i < this.widgets.length; i++) {
		if (this.widgets[i].name == name) {
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
