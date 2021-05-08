function addElement(){
	Widgets.run(function(){
		let types = {
			"slot": {type: "slot", x: 350, y: 60, size: 60, visual: false, bitmap: "custom.slot_default", needClean: false, isTransparentBackground: false, clicker: {}},
			"invSlot": {type: "invSlot", x: 350, y: 60, size: 60, index: 0, bitmap: "custom.invSlot_default", clicker: {}},
			"button": {type: "button", x: 350, y: 60, scale: 3.2, bitmap: "custom.button_default", bitmap2: "custom.button_default2", clicker: {}},
			"closeButton": {type: "closeButton", x: 350, y: 60, global: true, bitmap: "custom.close_default", bitmap2: "custom.close_default2", scale: 3.2, clicker: {}},
			"scale": {type: "scale", x: 350, y: 60, direction: 0, bitmap: "custom.scale", scale: 3.2, value: 1, invert: false, overlay: null, overlayScale: 3.2, overlayOffset: {x: 0, y: 0}, clicker: {}},
			"text": {type: "text", x: 350, y: 60, width: 120, height: 16, text: "This is a Text element", font: {color: android.graphics.Color.WHITE, shadow: 0.6, size: 18}, clicker: {}},
			"image": {type: "image", x: 350, y: 60, bitmap: "custom.image", scale: 3.2, overlay: null, overlayScale: 3.2, overlayOffset: {x: 0, y: 0}, clicker: {}}
		}, widgets = [];
		for(let u in types){
			let i = u;
			let text = Widgets.linear([Widgets.text(i, 16)], null, Widgets.gravity.left);
			text.setOnClickListener(function(){
				Widgets.run(function(){
					let count = edit(["match"], false), id = "";
					for(let t=0; t<1000; t++){id=i+"_"+t; if(!editorUI.main.Window.content.elements[id]){break;}};
					types[i].clicker=null;
					types[i].clicker = {onClick: function(){edit(["select", id]);}};
					edit(["add", id, types[i]]);
					alert("Element ["+i+"] added with id = "+id);
					// edit(["match"]);
					edit(["select", id]);
				});
			});
			text.setPadding(16, 4, 16, 4);
			widgets.push(text);
		}
		var layout = Widgets.linear(widgets),
			scroll = Widgets.scroll(layout),
			dial = {
				title: "Select Type of Element",
				view: scroll,
				buttons: {
					text: [null, null, "Cancel"],
					click: [null, null, function(){}]
				}
			};
		dialog(dial);
	});
};
