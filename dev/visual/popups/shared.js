const Popups = new Object();

Popups.widgets = new Array();

Popups.open = function(widget, name) {
	let opened = this.closeIfOpened(name);
	if (!opened) {
		let index = this.widgets.length;
		if (index > maxWindows) {
			this.closeFirst();
		}
		this.createAction(widget);
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

Popups.createAction = function(widget) {
	if (widget) {
		let title = widget.views.title;
		if (title) {
			let closeable, expandable;
			title.setOnTouchListener(function(view, event) {
				switch (event.getAction()) {
					case 0:
						dx = event.getX();
						dy = event.getY();
						if (expandable && expandable.isActive()) {
							if (widget.expand) {
								widget.expand();
								// ProjectProvider.getProject().updatePopupExpanded(widget.name, widget.isExpanded());
							}
							expandable.destroy();
						} else {
							if (expandable) {
								expandable.destroy();
							}
							expandable = new Action(500);
							expandable.create().run();
						}
						if (closeable) {
							closeable.destroy();
						}
						closeable = new Action(750);
						closeable.create().run();
						break;
					case 1:
						if (closeable && closeable.getThread() && closeable.getLeftTime() == 0) {
							closeable.destroy();
							Popups.closeIfOpened(widget.name);
						} // else ProjectProvider.getProject().updatePopupLocation(widget.name, event.getRawX() - dx, event.getRawY() - dy);
						break;
					case 2:
						let x = event.getX() - dx,
							y = event.getY() - dy;
						if (widget.isFocusable()) {
							widget.setX(widget.getX() + x);
							widget.setY(widget.getY() + y);
						} else {
							widget.setX(event.getRawX() - dx);
							widget.setY(event.getRawY() - dy);
						}
						widget.update();
						if (x > 0 || y > 0) {
							if (closeable) {
								closeable.destroy();
							}
							if (expandable) {
								expandable.destroy();
							}
						}
						break;
				}
				return true;
			});
		}
	}
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
		widget.dismiss();
		this.widgets.splice(index, 1);
		return true;
	}
	return false;
};

Popups.closeFirst = function() {
	this.close(0);
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
