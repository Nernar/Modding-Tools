/*
    ┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻
*/

var gui = {
    x: 60, y: 60, //positions
    s: 3.2, m: 3.3, b: 3.4, //scales
    bg: {type: "background", color: null} //background null
};
var editorUI = {
    deleted: 0,
    count: 0,
    x: 1,
    name: null,
    current: null,
		project: null,
    main: {
				//standart: {header: {text: {text: "____________________UI Editor____________________"}},
				//background: {color: android.graphics.Color.rgb(100, 100, 100)},
        Window: new UI.Window({
						location: {	width: 1000, height: 1000	},
            drawing: [{type: "background", color: android.graphics.Color.parseColor("#b3b3b3")}], elements: {} }),
        container: null
    },
    open: function(){
        let ui = editorUI.main;
        if(ui.enabled != true){
            ui.container = new UI.Container();
            ui.container.openAs(ui.Window);
            ui.enabled = true;
        }else{this.close();}
    },
    close: function() {
        let ui = editorUI.main;
        ui.container.close();
        ui.container = null;
        ui.enabled = false;
    }
};
function edit(changes, alertEnabled){
    var cur = editorUI.current,
        c = changes[0], // selected option
        name = changes[1], // name of element
        props = changes[2]; // props for element
    if(editorUI.current!=null){
        if(editorUI.x==10){
            if(c=="right")cur.x+=10;
            if(c=="left")cur.x-=10;
            if(c=="down")cur.y+=10;
            if(c=="up")cur.y-=10;
        }else{
            if(c=="right")cur.x+=1;
            if(c=="left")cur.x-=1;
            if(c=="down")cur.y+=1;
            if(c=="up")cur.y-=1;
        }
        if(c=="scaleUp"){cur.scale+=0.05; cur.scale= Math.round(cur.scale*100)/100;}
        if(c=="scaleDown"){cur.scale-=0.05; cur.scale= Math.round(cur.scale*100)/100; }
        if(c=="sizeUp")cur.size+=1;
        if(c=="sizeDown")cur.size-=1;
    }
    if(c=="remove"){
        if(cur){
				Widgets.run(function(){
					var e = editorUI.main.Window.content.elements;
					if (editorUI.name != null) {
						editorUI.main.Window.content.elements[editorUI.name] = null;
				  	editorUI.name = null;
				  	editorUI.current = null;
						delete editorUI.main.Window.content.elements[editorUI.name];
				  	delete editorUI.name;
				  	delete editorUI.current;
					}
            // editorUI.main.Window.content.elements[editorUI.name] = null;
            editorUI.deleted+=1;
            edit(["match"]);
					});
        }else alert("No item selected");
    }
    if(c=="match"){
        let count = 0;
        count-=editorUI.deleted;
        for(let i in editorUI.main.Window.content.elements) count++;
        editorUI.count = count;
        if(alertEnabled!=false)
        alert("Elements in GUI Total = "+editorUI.count);
        return count;
    };
    if(c=="add")editorUI.main.Window.content.elements[name] = props;
    if(c=="select"){
        if(name == editorUI.name){
            editorUI.current = null;
            editorUI.name = null;
            alert("Current element: unselected!");
        }else{
            editorUI.current = editorUI.main.Window.content.elements[name];
            alert("Current element: "+name+" selected!");
            editorUI.name = name;
        }
    };
    if(c=="export")exportDial();
    if(c=="import")importDial();
		if(c=="removeAll"){
			let length = 0, e = editorUI.main.Window.content.elements;
			for(let i in e){
				e.i = null; i=null; length++;
			}
				// editorUI.main.Window.content.elements = {};
			alert("Removed "+length+" items")
		}
};
