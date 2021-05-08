function selectBitmap(type){
	Widgets.run(function(){
		var files = FileTools.GetListOfFiles(__dir__+"gui/custom"), widgets = [];
		files = files.sort();
		for(let i in files){
			let item = files[i].toString();
			item = item.replace(__dir__+"gui/custom/", "");	item = item.replace(".png", "");	item = item+"";
			let text = Widgets.text(item, 16),
			linear = Widgets.linear([text], Widgets.orientate.horizontal, Widgets.gravity.left);
			linear.setOnClickListener(function(){
				let c = editorUI.current;
				alert("You selected ["+item+"] bitmap");
				item="custom."+item;
				if(c!=null){
					if(type==1 && c.bitmap)c.bitmap=item;
					if(type==1 && c.bitmap2)selectBitmap(2), alert("Select second bitmap");
					if(type==2 && c.bitmap2)c.bitmap2=item;
				}
			});
			linear.setPadding(0, 4, 0, 4);
			widgets.push(linear);
		}
		var layout = Widgets.linear(widgets),
			scroll = Widgets.scroll(layout);
			scroll.setPadding(36, 0, 0, 8);
		var dial = {
				title: "Select Bitmap "+type,
				view: scroll,
				buttons: {
					text: [null, null, "Cancel"],
					click: [null, null, function(){}]
				}
			};
		dialog(dial);
	});
};
