var moving1 = {
	x1: { image: "button_x1", click: function(v) {	editorUI.x=1;	} },
	up: { image: "button_up", click: function(v) {	edit(["up"]);	} },
	x10: { image: "button_x10", click: function(v) {	editorUI.x=10;	} }
},
moving2 = {
	menu: { image: "button_left", click: function(v) {	edit(["left"]);	}},
	down: { image: "button_down", click: function(v) {	edit(["down"]);	}},
	right: { image: "button_right", click: function(v) {	edit(["right"]);	}}
},
toScaling = {
	scaleUp: { image: "button_scale_up", click: function(v) { Widgets.run(function(){
		if(editorUI.current.size!=null)edit(["sizeUp"]);
		if(editorUI.current.scale!=null)edit(["scaleUp"]);	});	}
	},
	scaleDown: { image: "button_scale_down", click: function(v) { Widgets.run(function(){
		if(editorUI.current.size!=null)edit(["sizeDown"]);
		if(editorUI.current.scale!=null)edit(["scaleDown"]);	}); }
	}
},
toAdding = {
	element: { image: "button_element_add", click: function(v) { addElement(); } },
	drawing: { image: "button_drawing_add", click: function(v) { alert("Drawing adding"); } }
},
toRemoving = {
	element: { image: "button_element_remove", click: function(v) { edit(["remove"]); } },
	drawing: { image: "button_drawing_remove", click: function(v) { alert("Drawing removing");} }
},
projectBox = {
	export: { image: "button_export", click: function(v) { Widgets.run(function(){ edit(["export"]); }); } },
	import: { image: "button_import", click: function(v) { Widgets.run(function(){ edit(["import"]); }); } },
},
toChanging = {
	bitmap: { image: "button_bitmap", click: function(v) { Widgets.run(function(){ selectBitmap(1); }); } }
},
start = {
	open: { image: "button_start", click: function(v) { Widgets.run(function(){
		Windows.closePopup("main");
		Windows.closeMenu("main");
		editorUI.open();
		Windows.menu("mainMenu", "main", addWidgetsFrom(menu));
	}); } }
},
menu = {
	scaling: { image: "button_scaling", click: function(v) { Widgets.run(function(){
		newPopup("main", toScaling, "Scaling", 0);	}); } },
	adding: { image: "button_add", click: function(v) { Widgets.run(function(){
		newPopup("main", toAdding, "Adding", 1);	}); } },
	moving: { image: "button_moving", click: function(v) { Widgets.run(function(){
		var v1 = [];
		v1.push(addWidgetsFrom(moving1, Widgets.orientate.horizontal));
		v1.push(addWidgetsFrom(moving2, Widgets.orientate.horizontal));
		newPopup("main", v1, "Moving", 1, 0, 0, true);	}); } },
	removing: { image: "button_remove", click: function(v) { Widgets.run(function(){
		newPopup("main", toRemoving, "Removing", 3);	}); } },
	projectBox: { image: "button_project", click: function(v) { Widgets.run(function(){ newPopup("main", projectBox, "Box", 4);	}); } },
	change: { image: "button_change2", click: function(v) { Widgets.run(function(){
		newPopup("main", toChanging, "Changing", 5);	}); } },
	info: { image: "button_info", click: function(v) { Widgets.run(function(){
		if(editorUI.current){
			alert(editorUI.name+"\n")
			for(let i in editorUI.current)
			alert(i+": "+editorUI.current[i]);
		}	}); } },
	selectElement: { image: "button_list", click: function(v) { Widgets.run(function(){
		selectElement();	}); } },
	close: { image: "button_close", click: function(v) { Widgets.run(function(){
		Windows.closePopup("main");
		Windows.closeMenu("main");
		exportUI(true);
		editorUI.project=null;
		editorUI.close();
		editorUI.main.Window = null;
		editorUI.main.Window = new UI.Window({
				location: {	width: 1000, height: 1000	},
				drawing: [{type: "background", color: android.graphics.Color.parseColor("#b3b3b3")}], elements: {} });
		editorUI.main.container = null;
		Windows.menu("mainMenu", "main", addWidgetsFrom(start));	}); } }
};
// Open after IC Loads
Callback.addCallback("PostLoaded", function (coords, item, block) {
	Windows.menu("mainMenu", "main", addWidgetsFrom(start));
});
