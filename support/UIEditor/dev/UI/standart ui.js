this.setupHeader = function() {
		if (this.content.standart.header) {
				var a = this.content.standart.header.width || 80;
				this.mainWindowOffset.y = a - 20;
				var b = {
						location: {
								x: 0,
								y: 0,
								width: 1E3,
								height: a
						},
						params: this.content.params,
						drawing: [{
								type: "background",
								color: android.graphics.Color.BLACK
						}, {
								type: "frame",
								x: 0,
								y: 0,
								width: 1E3,
								height: a,
								scale: 3,
								bg: this.content.standart.header.color || android.graphics.Color.rgb(114, 106, 112),
								bitmap: this.content.standart.header.frame || "default_frame_7"
						}],
						elements: {}
				};
				this.content.standart.header.hideButton || (b.elements.__closeButton = {
						type: "closeButton",
						global: !0,
						sound: "random.click",
						x: 1E3 - .75 * a,
						y: 0,
						scale: a / 18 * .75
				});
				if (this.content.standart.header.text) {
						var e =
								this.content.standart.header.text.font || {};
						b.drawing.push({
								type: "text",
								x: 500,
								y: .6 * a,
								text: this.content.standart.header.text.text,
								size: e.size || .25 * a,
								color: e.color || android.graphics.Color.WHITE,
								shadow: e.shadow || .65,
								alignCenter: !0
						})
				}
				this.addWindow("header", b).setDynamic(!1)
		}
};
this.setupInventory = function() {
		if (this.content.standart.inventory) {
				for (var a = this.content.standart.inventory.padding || 20, d = this.content.standart.inventory.width || 300, e = b - this.mainWindowOffset.y - 20 - 2 * a, f = {}, g = 0; 36 > g; g++) f["__invslot" +
						g] = {
						type: "invSlot",
						size: 251,
						x: g % 4 * 250,
						y: 250 * parseInt(g / 4),
						index: g + 9
				};
				this.addWindow("inventory", {
						location: {
								x: this.mainWindowOffset.x + a,
								y: this.mainWindowOffset.y + 20 + a,
								width: d,
								height: e,
								scrollHeight: 2.25 * d
						},
						params: this.content.params,
						drawing: [{
								type: "background",
								color: android.graphics.Color.BLACK
						}],
						elements: f
				}).setDynamic(!1);
				this.getWindow("inventory").setRequireInventory(!0)
		}
};
this.setupBackground = function() {
		if (this.content.standart.background) {
				var a = this.content.standart.background,
						b = a.color,
						e = a.bitmap,
						f = a.frame;
				a.standart && (b = android.graphics.Color.rgb(149, 134, 129), f = {
						scale: 3
				}, e = void 0);
				var a = this.getWindow("main"),
						g = this.getWindowContent("main");
				g.drawing || (g.drawing = []);
				g = g.drawing;
				this.content.standart.header && !this.content.standart.header.hideShadow && g.unshift({
						type: "bitmap",
						x: 0,
						y: 15,
						bitmap: "_standart_header_shadow",
						scale: 2
				});
				f && g.unshift({
						type: "frame",
						x: 0,
						y: 0,
						width: a.getWidth(),
						height: a.getHeight(),
						bitmap: f.bitmap,
						scale: f.scale
				});
				e && (f = GuiWindowProvider.Images[e]) && g.unshift({
						type: "bitmap",
						x: 0,
						y: 0,
						bitmap: e,
						scale: 1E3 / f.width
				});
				"undefined" != b + "" && g.unshift({
						type: "background",
						color: b
				})
		}
};
this.openAll = this.open;
this.open = function() {
		this.content.standart ? (this.setupHeader(), this.setupInventory(), this.getWindow("main").setLocation(this.mainWindowOffset.x, this.mainWindowOffset.y, 1E3 - this.mainWindowOffset.x, b - this.mainWindowOffset.y, this.content.standart.minHeight), this.setupBackground()) : this.getWindow("main").setFullscreen();
		this.openAll()
}
