var text = {
	set: function(){
		values.content.setText("element_text", this.setText());
	},
	setText: function(){
		let u = editorUI.current;
		let e = editorUI.main.Window.getGuiContent().elements[u];
		if(e.scale!=undefined)var scale = ", scale: "+e.scale; else var scale = "";
		if(e.size!=undefined)var size = ", size: "+e.size; else var size = "";
		if(e.bitmap!=undefined)var bitmap = ", bitmap: \""+e.bitmap+"\""; else var bitmap = "";
		if(e.bitmap2!=undefined)var bitmap2 = ", bitmap2: \""+e.bitmap2+"\""; else var bitmap2 = "";
		if(e.text!=undefined)var text = ", text: \""+e.text+"\""; else var text = "";
		if(e.direction!=undefined)var direction = ", direction: "+e.direction; else var direction = "";
		if(e.value!=undefined)var value = ", value: "+e.value; else var value = "";
		props = "\""+u+"\": {type: \""+e.type+"\", x: "+e.x+", y: "+e.y+scale+size+bitmap+bitmap2+text+direction+value+"},";
		return props;
	}
};
