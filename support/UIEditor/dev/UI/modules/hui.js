//old codes here (-_-)













function exportUI(rewrite, name){
	Widgets.run(function(){
		let files = FileTools.GetListOfFiles(__dir__+"guis/"),
			count = 0,
			ui = editorUI.main.Window.content;
		if(FileTools.isExists(__dir__+"guis")==false) FileAPI.createNewDir(__dir__, "guis");
		if(FileTools.isExists(__dir__+"projects")==false) FileAPI.createNewDir(__dir__, "projects");
		for(let i in files)count+=1;
		if(rewrite==true){var name = "CUI_"+count+".js";}else{var name = "CUI_"+(count+1)+".js";}
		let dir = __dir__+"guis/"+name;
		var guiExportElements = "";
		let exporting = "var custom_UI = new UI.StandartWindow({\n\tstandart: {header: {text: {text: \"Created With UIEditor\"}},\n\tbackground: {color: android.graphics.Color.parseColor(\"#b3b3b3\")}, inventory: {standart: true}},\n\tdrawing: [],\n\telements: {";
		for(let u in ui.elements){
			let i = u, el="";
			if(ui.elements[u]!=null)
			el = exportElement(ui.elements[u], u);
			exporting+=el;
			guiExportElements+=el;
		} exporting+="\n\t}\n});";
		FileTools.WriteText(dir, exporting);
		if(FileTools.isExists(__dir__+"guis")==true && FileTools.isExists(__dir__+"projects")==true)alert("Exported to guis with name "+name+" + project in projects folder "+name+"on");
		else alert("Error exporting");
		var json = {"elements": ui.elements};
		FileTools.WriteJSON(__dir__+"projects/"+name+"on", json, true);
	});
}
