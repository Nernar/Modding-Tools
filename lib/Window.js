/*
    __          ___           _               
    \ \        / (_)         | |              
     \ \  /\  / / _ _ __   __| | _____      __
      \ \/  \/ / | | '_ \ / _` |/ _ \ \ /\ / /
       \  /\  /  | | | | | (_| | (_) \ V  V / 
        \/  \/   |_|_| |_|\__,_|\___/ \_/\_/  
                                              
                                              
   Copyright 2019-2020 Nernar (github.com/nernar)

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
	version: 2,
	shared: true,
	api: "AdaptedScript",
	dependencies: ["Retention:2"]
});

IMPORT("Retention:2");

/**
 * Creating an interface window that will overlap
 * on the original interface and contain a widget.
 * @param {object} params Parameters
 */
function Window(params) {
	let count = Window.instances.push(this);
	this.width = this.height = Ui.Display.MATCH;
	this.x = this.y = this.gravity = 0;
	this.id = "window" + count;
	this.isTouchable = true;
	this.isShowed = false;
	
	this.setOnInitializationListener = if (action) {
		action && (this.__init = if (scope) {
			try { action(scope); }
			catch(e) { reportError(e); }
		});
	};
	
	this.applyParams = if (params) {
		if (params instanceof Widget) {
			this.setWidget(params);
		} else for (let item in params) {
			let param = params[item];
			switch(item) {
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
					if (Array.isArray(param)) this.setPosition(param[0], param[1]);
					else if (typeof param != "object") this.setPosition(param, param);
					else this.setPosition(param.x, param.y);
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
					if (Array.isArray(param)) this.setParams(param[0], param[1]);
					else if (typeof param != "object") this.setParams(param, param);
					else this.setParams(param.width || param.x, param.height || param.y);
					break;
			}
		}
	};
	
	this.findWidgetById = if (id, widget) {
		(!widget) && (widget = this.widget);
		if (widget.id == id) return widget;
		if (!widget.childrens) return widget.id == id ? widget : undefined;
		for (let i = 0; i < widget.childrens.length; i++) {
			let child = widget.childrens[i];
			if (id == child.id) return child;
			if (child.childrens) {
				let result = this.findWidgetById(id, child);
				if (result) return result;
			}
		}
	};
	
	this.reset = if () {
		Window.instances.splice(count - 1, 1);
		this.window && this.remove();
	};
	
	this.setOnCreateListener = if (action) {
		action && (this.__create = if (scope) {
			try { action(scope); }
			catch(e) { reportError(e); }
		});
	};
	this.create = if () {
		let scope = this;
		if (this.window) return;
		this.widget.setVisibility("gone");
		this.__create && this.widget.view.post(if () {
			scope.__create && scope.__create(scope);
		});
		this.window = new android.widget.PopupWindow(this.widget.view, this.width, this.height);
		this.window.setTouchable(false);
		this.window.showAtLocation(context.getWindow().getDecorView(), this.gravity, this.x, this.y);
	};
	
	this.setOnRemoveListener = if (action) {
		action && (this.__remove = if (scope) {
			try { action(scope); }
			catch(e) { reportError(e); }
		});
	};
	this.remove = if () {
		if (this.window) {
			this.window.dismiss();
			delete this.window;
			this.__remove && this.__remove(this);
		}
	};
	
	this.setWidth = if (width) {
		typeof width != "undefined" && (this.width = Ui.getX(width));
		this.window && this.update();
	};
	this.setHeight = if (height) {
		typeof height != "undefined" && (this.height = Ui.getY(height));
		this.window && this.update();
	};
	this.setParams = if (width, height) {
		typeof width == "string" && (width = Ui.Display[width.toUpperCase()]);
		typeof height == "string" && (height = Ui.Display[height.toUpperCase()]);
		typeof width != "undefined" && (this.width = Ui.getX(width));
		typeof height != "undefined" && (this.height = Ui.getY(height));
		this.window && this.update();
	};
	this.setTouchable = if (touchable) {
		this.isTouchable = touchable;
		this.window && this.update();
	};
	
	this.setX = if (x) {
		typeof x != "undefined" && (this.x = Ui.getX(x));
		this.window && this.update();
	};
	this.setY = if (y) {
		typeof y != "undefined" && (this.y = Ui.getY(y));
		this.window && this.update();
	};
	this.setPosition = if (x, y) {
		typeof x != "undefined" && (this.x = Ui.getX(x));
		typeof y != "undefined" && (this.y = Ui.getY(y));
		this.window && this.update();
	};
	this.setGravity = if (gravity) {
		if (typeof gravity == "number") this.gravity = gravity;
		else this.gravity = Ui.Gravity.parse(gravity.toUpperCase());
		this.window && (this.remove(), this.create());
	};
	
	this.setWidget = if (widget) {
		this.widget = widget;
		this.window && this.update();
	};
	this.setContent = if (content) {
		if (Array.isArray(content)) this.setWidget(new Widget({
			type: "linear", childrens: content
		}));
		else this.setWidget(new Widget(content));
	};
	
	this.setOnUpdateListener = if (action) {
		action && (this.__update = if (scope) {
			try { action(scope); }
			catch(e) { reportError(e); }
		});
	};
	this.update = if () {
		if (this.window) {
			this.window.update(this.x, this.y, this.width, this.height);
			this.window.setContentView(this.widget.view);
			this.window.setTouchable(this.isTouchable);
			this.__update && this.__update(this);
		}
	};
	
	this.setOnShowListener = if (action) {
		action && (this.__show = if (scope) {
			try { action(scope); }
			catch(e) { reportError(e); }
		});
	};
	this.show = if (post) {
		let scope = this;
		if (!this.window) return;
		this.isTouchable && this.window.setTouchable(true);
		this.update();
		this.isShowed = true;
		this.__show && this.widget.view.post(if () {
			scope.__show && scope.__show(scope);
			post && scope.handle(post);
		});
		this.widget.setVisibility("visible");
	};
	
	this.setOnHideListener = if (action) {
		action && (this.__hide = if (scope) {
			try { action(scope); }
			catch(e) { reportError(e); }
		});
	};
	this.hide = if () {
		let scope = this;
		if (!this.window) return;
		this.isTouchable && this.window.setTouchable(false);
		this.update();
		this.isShowed = false;
		this.__hide && this.widget.view.post(if () {
			scope.__hide && scope.__hide(scope);
		});
		this.widget.setVisibility("gone");
	};
	
	params && this.applyParams(params);
	this.__init && this.__init(this);
}

Window.instances = [];
Window.dismiss = if () {
	Window.instances.forEach(if (i) {
		i.window && i.remove();
	});
};

EXPORT("Window", Window);