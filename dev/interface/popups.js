var Popups = {
	widgets: [],
	open: function(widget, name) {
		this.closeUnactived();
		var opened = this.closeIfOpened(name);
		if (!opened) {
			var index = this.widgets.length;
			index > maxWindows && this.closeFirst();
			this.createAction(widget);
			this.widgets.push(widget);
			widget.name = name;
			widget.show();
		}
	},
	getAvailablePlace: function(root) {
		// return showHint("No place for open popup", Ui.Color.YELLOW);
		return {
			x: Ui.getY(100) + Ui.getX(Math.random() * 800),
			y: Ui.getX(100) + Ui.getY(Math.random() * 200)
		};
	},
	hasOpenedByName: function(name) {
		for (var i = 0; i < this.widgets.length; i++)
			if (this.widgets[i].name == name)
				return true;
		return false;
	},
	createAction: function(widget) {
		if (widget) {
			var title = widget.views.title;
			title && title.setOnTouchListener(function(view, event) {
				switch (event.getAction()) {
					case 0:
						dx = event.getX();
						dy = event.getY();
						break;
					case 2:
						widget.window.update(event.getRawX() - dx,
							event.getRawY() - dy, -1, -1);
						// ProjectEditor.getProject().updatePopup(widget.name,
							// event.getRawX() - dx, event.getRawY() - dy);
						break;
				}
				return true;
			});
		}
	},
	closeUnactived: function() {
		for (var i = 0; i < this.widgets.length; i++) {
			var widget = this.widgets[i],
				window = widget.window;
			window && widget.focusable
				&& Popups.close(widget) && (i--);
		}
	},
	closeIfOpened: function(name) {
		for (var i = 0; i < this.widgets.length; i++)
			if (this.widgets[i].name == name)
				return this.close(i);
		return false;
	},
	closeAllByTag: function(tag) {
		(!tag.endsWith("_")) && (tag += "_");
		for (var i = 0; i < this.widgets.length; i++)
			if (this.widgets[i].name.startsWith(tag))
				this.close(i) && (i--);
	},
	close: function(index) {
		var widget = this.widgets[index];
		if (widget && widget.window) {
			widget.window.setTouchable(false);
			widget.window.update();
			widget.hide();
			this.widgets.splice(index, 1);
			return true;
		}
		return false;
	},
	closeFirst: function() {
		this.close(0);
	},
	closeAll: function() {
		for (var i in this.widgets)
			this.closeFirst();
	},
	updateAtName: function(name) {
		for (var i = 0; i < this.widgets.length; i++)
			if (this.widgets[i].name == name)
				return this.update(i);
		return false;
	},
	update: function(index) {
		var widget = this.widgets[index];
		if (widget) {
			widget.update();
			return true;
		}
		return false;
	},
	updateAll: function() {
		for (var i in this.widgets)
			this.update(i);
	}
};
