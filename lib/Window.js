/*
    __          ___           _               
    \ \        / (_)         | |              
     \ \  /\  / / _ _ __   __| | _____      __
      \ \/  \/ / | | '_ \ / _` |/ _ \ \ /\ / /
       \  /\  /  | | | | | (_| | (_) \ V  V / 
        \/  \/   |_|_| |_|\__,_|\___/ \_/\_/  
                                              
                                              
   Copyright 2019-2021 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

LIBRARY({
	name: "Window",
	version: 3,
	shared: true,
	api: "AdaptedScript",
	dependencies: ["Widget:3"]
});

IMPORT("Retention:3");
IMPORT("Widget:3");

/**
 * Creating an interface window that will overlap
 * on the original interface and contain a widget.
 * @param {Object} params parameters
 */
let Window = function(params) {
	let count = Window.instances.push(this);
	let initializeAction = undefined;
	this.id = "window" + count;

	this.setOnInitializationListener = function(action) {
		action && (initializeAction = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};

	this.reset = function() {
		Window.instances.splice(count - 1, 1);
		this.window && this.remove();
	};

	if (params) {
		this.applyParams(params);
	}
	if (initializeAction) {
		initializeAction(this);
	}
};

Window.prototype.width = Ui.Display.MATCH;
Window.prototype.height = Ui.Display.MATCH;
Window.prototype.x = Window.prototype.y = 0;
Window.prototype.isTouchable = true;
Window.prototype.isShowed = false;
Window.prototype.gravity = 0;

Window.prototype.applyParams = function(params) {
	if (params instanceof Widget) {
		this.setWidget(params);
	} else {
		for (let item in params) {
			let param = params[item];
			switch (item) {
				case "hooks":
				case "actions":
				case "listeners":
					param.onInit && this.setOnInitializationListener(param.onInit);
					param.onUpdate && this.setOnUpdateListener(param.onUpdate);
					param.onCreate && this.setOnCreateListener(param.onCreate);
					param.onRemove && this.setOnRemoveListener(param.onRemove);
					param.onShow && this.setOnShowListener(param.onShow);
					param.onHide && this.setOnHideListener(param.onHide);
					break;
				case "content":
				case "views":
					this.setContent(param);
					break;
				case "x":
					this.setX(param);
					break;
				case "y":
					this.setY(param);
					break;
				case "place":
				case "position":
				case "location":
					if (Array.isArray(param)) {
						this.setPosition(param[0], param[1]);
					} else if (typeof param != "object") {
						this.setPosition(param, param);
					} else this.setPosition(param.x, param.y);
					break;
				case "touchable":
				case "touch":
					this.setTouchable(param);
					break;
				case "gravity":
					this.setGravity(param);
					break;
				case "width":
					this.setWidth(param);
					break;
				case "height":
					this.setHeight(param);
					break;
				case "params":
				case "sizes":
					if (Array.isArray(param)) {
						this.setParams(param[0], param[1]);
					} else if (typeof param != "object") {
						this.setParams(param, param);
					} else this.setParams(param.width || param.x, param.height || param.y);
					break;
			}
		}
	}
};

Window.prototype.findWidgetById = function(id, widget) {
	if (!widget) {
		widget = this.widget;
	}
	if (widget.id == id) {
		return widget;
	}
	if (!widget.childrens) {
		return widget.id == id ? widget : undefined;
	}
	for (let i = 0; i < widget.childrens.length; i++) {
		let child = widget.childrens[i];
		if (id == child.id) {
			return child;
		}
		if (child.childrens) {
			let result = this.findWidgetById(id, child);
			if (result) {
				return result;
			}
		}
	}
};

Window.prototype.setOnCreateListener = function(action) {
	action && (this.__create = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Window.prototype.create = function() {
	let scope = this;
	if (this.window) {
		return;
	}
	this.widget.setVisibility("gone");
	this.__create && this.widget.view.post(function() {
		scope.__create && scope.__create(scope);
	});
	this.window = new android.widget.PopupWindow(this.widget.view, this.width, this.height);
	this.window.setTouchable(false);
	this.window.showAtLocation(context.getWindow().getDecorView(), this.gravity, this.x, this.y);
};

Window.prototype.setOnRemoveListener = function(action) {
	action && (this.__remove = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Window.prototype.remove = function() {
	if (this.window) {
		this.window.dismiss();
		delete this.window;
		this.__remove && this.__remove(this);
	}
};

Window.prototype.setWidth = function(width) {
	if (typeof width != "undefined") {
		this.width = Ui.getX(width);
	}
	if (this.window) {
		this.update();
	}
};

Window.prototype.setHeight = function(height) {
	if (typeof height != "undefined") {
		this.height = Ui.getY(height);
	}
	if (this.window) {
		this.update();
	}
};

Window.prototype.setParams = function(width, height) {
	if (typeof width == "string") {
		width = Ui.Display[width.toUpperCase()];
	}
	if (typeof height == "string") {
		height = Ui.Display[height.toUpperCase()];
	}
	if (typeof width != "undefined") {
		this.width = Ui.getX(width);
	}
	if (typeof height != "undefined") {
		this.height = Ui.getY(height);
	}
	if (this.window) {
		this.update();
	}
};

Window.prototype.setTouchable = function(touchable) {
	this.isTouchable = touchable;
	if (this.window) {
		this.update();
	}
};

Window.prototype.setX = function(x) {
	if (typeof x != "undefined") {
		this.x = Ui.getX(x);
	}
	if (this.window) {
		this.update();
	}
};

Window.prototype.setY = function(y) {
	if (typeof y != "undefined") {
		this.y = Ui.getY(y);
	}
	if (this.window) {
		this.update();
	}
};

Window.prototype.setPosition = function(x, y) {
	if (typeof x != "undefined") {
		this.x = Ui.getX(x);
	}
	if (typeof y != "undefined") {
		this.y = Ui.getY(y);
	}
	if (this.window) {
		this.update();
	}
};

Window.prototype.setGravity = function(gravity) {
	if (typeof gravity == "number") {
		this.gravity = gravity;
	} else this.gravity = Ui.Gravity.parse(gravity.toUpperCase());
	if (this.window) {
		this.remove();
		this.create();
	}
};

Window.prototype.setWidget = function(widget) {
	this.widget = widget;
	this.window && this.update();
};

Window.prototype.setContent = function(content) {
	if (Array.isArray(content)) {
		this.setWidget(new Widget({
			childrens: content
		}));
	} else this.setWidget(new Widget(content));
};

Window.prototype.setOnUpdateListener = function(action) {
	action && (this.__update = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Window.prototype.update = function() {
	if (this.window) {
		this.window.update(this.x, this.y, this.width, this.height);
		this.window.setContentView(this.widget.view);
		this.window.setTouchable(this.isTouchable);
		this.__update && this.__update(this);
	}
};

Window.prototype.setOnShowListener = function(action) {
	action && (this.__show = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Window.prototype.show = function(post) {
	let scope = this;
	if (!this.window) {
		return;
	}
	if (this.isTouchable) {
		this.window.setTouchable(true);
	}
	this.update();
	this.isShowed = true;
	this.__show && this.widget.view.post(function() {
		scope.__show && scope.__show(scope);
		post && scope.handle(post);
	});
	this.widget.setVisibility("visible");
};

Window.prototype.setOnHideListener = function(action) {
	action && (this.__hide = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Window.prototype.hide = function() {
	let scope = this;
	if (!this.window) {
		return;
	}
	if (this.isTouchable) {
		this.window.setTouchable(false);
	}
	this.update();
	this.isShowed = false;
	this.__hide && this.widget.view.post(function() {
		scope.__hide && scope.__hide(scope);
	});
	this.widget.setVisibility("gone");
};

Window.instances = new Array();

Window.dismiss = function() {
	Window.instances.forEach(function(i) {
		i.window && i.remove();
	});
};

EXPORT("Window", Window);
