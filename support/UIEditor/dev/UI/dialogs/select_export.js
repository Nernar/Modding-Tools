function exportDial(){
	Widgets.run(function(){
		let dial = {	title: "Save Menu",
				buttons: {	text: ["Save last imported", null, "Create new file"],
					click: [function(){exportUI(true);}, null, function(){exportUI(false, true);}]
				}
			};
		dialog(dial);
	});
};
function importDial(){
	Widgets.run(function(){
		var widgets = [],	files = FileTools.GetListOfFiles(__dir__+"projects/"), widgets = [];
		files = files.sort();
		for(let u in files){
			let i = u;
			let item = files[i].toString();
			item = item.replace(__dir__+"projects/", "");	item = item+"";
				let text = Widgets.text(item, 16),
				linear = Widgets.linear([text], Widgets.orientate.horizontal, Widgets.gravity.left);
				linear.setOnClickListener(function(){
					importUI(item);
					editorUI.project = "CUI_"+(parseInt(i)+1)+".js";
				});
				linear.setPadding(0, 8, 0, 8);
				widgets.push(linear);
		}
		var layout = Widgets.linear(widgets), scroll = Widgets.scroll(layout);
		let dial = {	title: "Import Menu", view: scroll	};
		dialog(dial);
	});
};
