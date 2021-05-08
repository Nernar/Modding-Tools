function selectElement(){
	Widgets.run(function(){
		var elements = editorUI.main.Window.content.elements, widgets = [];
		for(let i in elements){
			let item = i;
			if(elements[item]!=null){
				item = item+"";
				let text = Widgets.text("["+elements[i].type+"]: "+item, 16),
				linear = Widgets.linear([text], Widgets.orientate.horizontal, Widgets.gravity.left);
				linear.setOnClickListener(function(){
					edit(["select", item]);
				});
				linear.setPadding(16, 4, 16, 4);
				widgets.push(linear);
			}
		}
		var layout = Widgets.linear(widgets),
			scroll = Widgets.scroll(layout),
			dial = {
				title: "Element Selector",
				view: scroll,
				buttons: {
					text: [null, null, "Cancel"],
					click: [null, null, function(){}]
				}
			};
		dialog(dial);
	});
};
