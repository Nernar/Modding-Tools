
/*
  _____               ______    _ _ _
 |  __ \             |  ____|  | (_) |
 | |  | | _____   __ | |__   __| |_| |_ ___  _ __
 | |  | |/ _ \ \ / / |  __| / _` | | __/ _ \| '__|
 | |__| |  __/\ V /  | |___| (_| | | || (_) | |
 |_____/ \___| \_/   |______\__,_|_|\__\___/|_|


       Developed by Nernar (vk.com/nernar)
   This code is a copyright, do not distribute.

*/

var Windows = {
	windows: {},
	dismiss: function(name) {
		Widgets.run(function() {
			var widget = Windows.windows[name];
			if(widget) {
				Widgets.remove(widget.window);
				Windows.windows[name] = null;
			}
		});
	},
	closeMenu: function(type) {
		this.dismiss(type + "Menu");
	},
	closePopup: function(type) {
		this.dismiss(type + "Popup");
	},
	hide: function(name) {
		Widgets.run(function() {
			var widget = Windows.windows[name];
			if(widget) {
				widget.window.setVisibility(Widgets.visibility.gone);
			}
		});
	},
	show: function(name) {
		Widgets.run(function() {
			var widget = Windows.windows[name];
			if(widget) {
				widget.window.setVisibility(Widgets.visibility.visible);
			}
		});
	},
	menu: function(name, type, layout) {
		Widgets.run(function() {
			if(layout) {
				Windows.closePopup(type);
				layout.setTag(type);
				var widget = Windows.windows[type + "Menu"];
				if(widget) {
					var animate = android.view.animation.TranslateAnimation(0, (type == "menu") ? -widget.layout.getWidth() : (type == "right") ? widget.layout.getWidth() : 0, 0, 0);
					widget.layout.startAnimation(animate);
					animate.setDuration(400);
					widget.layout.postDelayed(new java.lang.Runnable({
						run: function() {
							Widgets.run(function() {
								widget.name = name;
								widget.parent.removeAllViews();
								widget.parent.addView(layout);
								widget.layout = layout;
								var animate = android.view.animation.TranslateAnimation((type == "menu") ? -widget.parent.getWidth() : (type == "right") ? widget.parent.getWidth() : 0, 0, 0, 0);
								layout.startAnimation(animate);
								animate.setDuration(400);
							});
						}
					}), 400);
				} else {
					var scroll = Widgets.scroll(layout);
					var window = Widgets.window(scroll,
						Widgets.gravity.top | Widgets.gravity["left"],
						null, null, null, Widgets.size.match);
					Windows.windows[type + "Menu"] = {
						window: window,
						parent: scroll,
						layout: layout,
						name: name
					};
				}
			}
		});
	},
	popup: function(name, view, layout, focus) {
		Widgets.run(function() {
			if(layout) {
				var type = view ? view.getParent().getTag() : "unknown";
				var widget = Windows.windows[type + "Popup"];
				if(widget && !focus) {
					if(widget.name == name) {
						Windows.closePopup(type);
					} else {
						if(Settings.config.interfaceAnimated) {
							var animate = android.view.animation.AlphaAnimation(1, 0);
							widget.layout.startAnimation(animate);
							animate.setDuration(150);
							widget.layout.postDelayed(new java.lang.Runnable({
								run: function() {
									Widgets.run(function() {
										widget.name = name;
										widget.parent.removeAllViews();
										widget.parent.addView(layout);
										widget.layout = layout;
										widget.window.update(view ? (type == "menu") ? view.getWidth() : (type == "right") ? view.getWidth() + layout.getWidth() : 0 : 0,
											view ? view.getY() : 0, Widgets.size.wrap, Widgets.size.wrap);
										var animate = android.view.animation.AlphaAnimation(0, 1);
										layout.startAnimation(animate);
										animate.setDuration(150);
									});
								}
							}), 150);
						} else {
							widget.name = name;
							widget.parent.removeAllViews();
							widget.parent.addView(layout);
							widget.layout = layout;
							widget.window.update(view ? (type == "menu") ? view.getWidth() : (type == "right") ? view.getWidth() + layout.getWidth() : 0 : 0,
								view ? view.getY() : 0, Widgets.size.wrap, Widgets.size.wrap);
						}
					}
				} else {
					if(widget) Windows.closePopup(type);
					var scroll = Widgets.scroll(layout);
					var window = Widgets.window(scroll,
						view ? Widgets.gravity.top | Widgets.gravity[view.getParent().getTag()] : Widgets.gravity.center,
						view ? (type == "menu") ? view.getWidth() : (type == "right") ? view.getWidth() + layout.getWidth() : 0 : 0,
						view ? view.getY() : 0, null, null, focus);
					if(!focus) {
						Windows.windows[type + "Popup"] = {
							window: window,
							parent: scroll,
							layout: layout,
							name: name
						};
					}
				}
			}
		});
	}
};
