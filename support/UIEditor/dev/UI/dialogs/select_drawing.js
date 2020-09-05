var background = {
	type: "background",
	color: цвет
}, bitmap = {
	type: "bitmap",
	bitmap: "bitmap",
	x: 300,
	y: 60,
	scale: 3.2
}, frame = {
	type: "frame",
	x: 300,
	y: 60,
	width: 300,
	height: 300,
	bitmap: "frame",
	bg: "frame_bg,
	scale: 3.2
}, text = {
	type: "text",
	text: "текст",
	x: 300,
	y: 60,
	font: шрифт_текста
}, line = {
	type: "line",
	x1: 300,
	y1: 60,
	x2: 400,
	y2: 120,
	width: 3.2,
	color: цвет
};

function addElement(){
	Widgets.run(function(){
		var types = {
			"slot": slotProps,
			"invSlot(not selectable!)": invSlotProps,
			"button": buttonProps,
			"closeButton(not selectable!)": closeProps,
			"scale": scaleProps,
			"text": textProps,
			"image": imageProps
		}, widgets = [];
		for(let u in types){
			let i = u;
			let text = Widgets.linear([Widgets.text(i, 16)], null, Widgets.gravity.left);
			text.setOnClickListener(function(){
				Widgets.run(function(){
					let count = edit(["match"], false),
						id = "element"+(count+1)+"_"+i;
					types[i].clicker = {onClick: function(){edit(["select", id]);}};
					edit(["add", id, types[i]]);
					alert("Element ["+i+"] added to GUI with id = "+id);
					edit(["match"]);
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
