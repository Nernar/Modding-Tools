/*
    __          ___     _            _   
    \ \        / (_)   | |          | |  
     \ \  /\  / / _  __| | __ _  ___| |_ 
      \ \/  \/ / | |/ _` |/ _` |/ _ \ __|
       \  /\  /  | | (_| | (_| |  __/ |_ 
        \/  \/   |_|\__,_|\__, |\___|\__|
                           __/ |         
                          |___/          
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
	name: "Widget",
	version: 3,
	shared: true,
	api: "AdaptedScript",
	dependencies: ["Retention:3"]
});

IMPORT("Retention:3");

/**
 * Creating any interface widget that subsequently
 * may become a tree or the root element of a window.
 * @param {object} params parameters
 */
let Widget = function(params) {
	let count = Widget.instances.push(this);
	let initializeAction = undefined
	this.id = "widget" + count;

	this.setOnInitializationListener = function(action) {
		action && (initializeAction = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};

	if (params) {
		this.setup(params.type);
		this.applyParams(params);
	}
	if (initializeAction) {
		initializeAction(this);
	}
};

Widget.prototype.setup = function(type) {
	if (type == undefined) {
		type = "layout";
	}
	switch (type) {
		case "layout":
		case "linear":
			this.type = "layout";
			this.view = new android.widget.LinearLayout(context);
			break;
		case "relative":
			this.type = "layout";
			this.view = new android.widget.RelativeLayout(context);
			break;
		case "frame":
			this.type = "layout";
			this.view = new android.widget.FrameLayout(context);
			break;
		case "text":
			this.type = "text";
			this.view = new android.widget.TextView(context);
			break;
		case "image":
			this.type = "image";
			this.view = new android.widget.ImageView(context);
			break;
		case "button":
			this.type = "text";
			this.view = new android.widget.Button(context);
			break;
		case "view":
		default:
			this.type = "view";
			this.view = new android.view.View(context);
	}
	if (this.type == "layout") {
		this.childrens = new Array();
	} else delete this.childrens;
};

Widget.prototype.addChildren = function(widget) {
	if (this.type != "layout" || !this.childrens) {
		return;
	}
	if (widget instanceof Widget == false) {
		widget = new Widget(widget);
	}
	if (widget.view) {
		this.view.addView(widget.view);
		this.childrens.push(widget);
	}
};

Widget.prototype.applyParams = function(params) {
	for (let item in params) {
		let param = params[item];
		switch (item) {
			case "hooks":
			case "actions":
			case "listeners":
				param.onInit && this.setOnInitializationListener(param.onInit);
				param.onClick && this.setOnClickListener(param.onClick);
				break;
			case "id":
			case "key":
			case "special":
				this.setId(param);
				break;
			case "click":
				this.setOnClickListener(param);
				break;
			case "children":
			case "childrens":
				if (param instanceof Widget) {
					this.addChildren(param);
				} else if (!Array.isArray(param)) {
					this.addChildren(param);
				} else
					for (let p = 0; p < param.length; p++) {
						this.addChildren(param[p]);
					}
				break;
			case "width":
				this.setWidth(param);
				break;
			case "height":
				this.setHeight(param);
				break;
			case "params":
				if (Array.isArray(param)) {
					this.setParams(param[0], param[1]);
				} else if (typeof param != "object") {
					this.setParams(param, param);
				} else this.setParams(param.width || param.x, param.height || param.y, param.direction, param.margin || param.margins);
				if (this.type != "layout" && this.type != "image" && this.type != "view") {
					if (Array.isArray(param)) {
						this.setSizes(param[0], param[1]);
					} else if (typeof param != "object") {
						this.setSizes(param, param);
					} else this.setSizes(param.width || param.x, param.height || param.y);
				}
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
			case "text":
				if (Array.isArray(param)) {
					this.setText(param[0], param[1]);
				} else if (typeof param != "object") {
					this.setText(param);
				} else this.setText(param.text, param.format);
				break;
			case "size":
				this.setTextSize(param);
				break;
			case "gravity":
				this.setGravity(param);
				break;
			case "orientate":
			case "orientation":
				this.setOrientation(param);
				break;
			case "typeface":
			case "font":
				this.setFont(param);
				break;
			case "color":
				if (this.type == "text") {
					this.setTextColor(param);
				} else this.setBackground(param);
				break;
			case "alpha":
				this.setAlpha(param);
				break;
			case "background":
				this.setBackground(param);
				break;
			case "scale":
			case "scaling":
				this.setScaleType(param);
				break;
			case "image":
			case "resource":
			case "bitmap":
				if (this.type == "image") {
					this.setResource(param);
				} else this.setBackground(param);
				break;
			case "padding":
				if (Array.isArray(param)) {
					if (param.length < 3) {
						this.setPaddingRelative(param[0], param[1]);
					} else this.setPadding(param[0], param[1], param[2], param[3]);
				} else if (typeof param != "object") {
					this.setPadding(param, param, param, param);
				} else if (param.horizontal || param.vertical) {
					this.setPaddingRelative(param.horizontal, param.vertical);
				} else this.setPadding(param.left, param.top, param.right, param.bottom);
				break;
		}
	}
};

Widget.prototype.setOrientation = function(orientate) {
	if (typeof orientate == "string") {
		this.view.setOrientation(Ui.Orientate[orientate.toUpperCase()]);
	} else this.view.setOrientation(orientate);
};

Widget.prototype.setGravity = function(gravity) {
	if (typeof gravity == "string") {
		this.view.setGravity(Ui.Gravity.parse(gravity.toUpperCase()));
	} else this.view.setGravity(gravity);
};

Widget.prototype.setText = function(text, format) {
	if (format) {
		this.view.setText(translate(text, format));
	} else this.view.setText(translate(text));
};

Widget.prototype.setHtmlText = function(text, format) {
	if (format) {
		this.view.setText(android.text.Html.fromHtml(translate(text, format)));
	} else this.view.setText(android.text.Html.fromHtml(translate(text)));
};

Widget.prototype.setTextSize = function(size) {
	this.view.setTextSize(Ui.getFontSize(size));
};

Widget.prototype.setTextColor = function(color) {
	if (typeof color == "number") {
		this.view.setTextColor(color);
	} else if (typeof color == "string") {
		if (color.startsWith("#")) {
			this.view.setTextColor(Ui.Color.parse(color));
		} else this.view.setTextColor(Ui.Color[color.toUpperCase()]);
	}
};

Widget.prototype.setFont = function(font) {
	if (typeof font != "undefined") {
		this.view.setTypeface(font);
	}
};

Widget.prototype.setResource = function(image) {
	if (image instanceof android.graphics.Bitmap) {
		this.view.setImageBitmap(image);
	} else this.view.setImageDrawable(image);
};

Widget.prototype.setScaleType = function(scale) {
	if (typeof scale == "object") {
		this.view.setScaleType(scale);
	} else this.view.setScaleType(Ui.Scale[scale.toUpperCase()]);
};

Widget.prototype.setOnClickListener = function(action) {
	let scope = this;
	this.view.setOnClickListener(function() {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Widget.prototype.setAlpha = function(alpha) {
	if (typeof alpha == "number") {
		this.view.setAlpha(1 / 256 * alpha);
	}
};

Widget.prototype.setPadding = function(left, top, right, bottom) {
	let dl = dt = dr = db = 0;
	typeof left == "number" && (dl = Ui.getX(left));
	typeof top == "number" && (dt = Ui.getY(top));
	typeof right == "number" && (dr = Ui.getX(right));
	typeof bottom == "number" && (db = Ui.getY(bottom));
	this.view.setPadding(dl, dt, dr, db);
};

Widget.prototype.setPaddingRelative = function(horizontal, vertical) {
	horizontal = Ui.getX(horizontal);
	vertical = Ui.getY(vertical);
	this.setPadding(horizontal, vertical, horizontal, vertical);
};

Widget.prototype.setParams = function(width, height) {
	if (typeof width == "string") {
		width = Ui.Display[width.toUpperCase()];
	}
	if (typeof height == "string") {
		height = Ui.Display[height.toUpperCase()];
	}
	this.view.setLayoutParams(Ui.getLayoutParams(width, height));
};

Widget.prototype.setSizes = function(width, height) {
	this.setWidth(width);
	this.setHeight(height);
};

Widget.prototype.setWidth = function(width) {
	if (typeof width == "number") {
		this.view.setWidth(Ui.getX(width));
	}
};

Widget.prototype.setHeight = function(height) {
	if (typeof height == "number") {
		this.view.setHeight(Ui.getY(height));
	}
};

Widget.prototype.setPosition = function(x, y) {
	this.setX(x);
	this.setY(y);
};

Widget.prototype.setX = function(x) {
	if (typeof x == "number") {
		this.view.setX(Ui.getX(x));
	}
};

Widget.prototype.setY = function(y) {
	if (typeof y == "number") {
		this.view.setY(Ui.getY(y));
	}
};

Widget.prototype.setBackground = function(background) {
	if (typeof background == "number") {
		this.view.setBackgroundColor(background);
	} else if (typeof background == "string") {
		if (background.startsWith("#")) {
			this.view.setBackgroundColor(Ui.Color.parse(background));
		} else if (Ui.Color[background.toUpperCase()] + "" != "undefined") {
			this.view.setBackgroundColor(Ui.Color[background.toUpperCase()]);
		}
	} else this.view.setBackgroundDrawable(background);
};

Widget.prototype.setVisibility = function(visibility) {
	if (typeof visibility == "number") {
		this.view.setVisibility(visibility);
	} else this.view.setVisibility(Ui.Visibility[visibility.toUpperCase()]);
};

Widget.instances = new Array();

EXPORT("Widget", Widget);
