/*
BUILD INFO:
  dir: dev
  target: main.js
  files: 15
*/



// file: UI/dialogs/select_type.js

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




// file: UI/dialogs/select_bitmap.js

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




// file: UI/dialogs/selectFromList.js

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




// file: UI/dialogs/select_export.js

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




// file: UI/modules/FileAPI.js

/*
	(╯°□°）╯︵ ┻━┻
*/
var File = java.io.File;
var FileReader = java.io.FileReader;
var BufferedReader = java.io.BufferedReader;
var FOS = java.io.FileOutputStream;
var String = java.lang.String;
var StringBuilder = java.lang.StringBuilder;
var sdcard = android.os.Environment.getExternalStorageDirectory();
var FileAPI={
	getName: function(dir){
		let name = new File(dir).name;
		return(name.replace('.png', ''));
	},
	select:function(dir,Name){
		return (new File(dir,Name));
	},
	createNewDir:function(dir, newDirName){
		return (new File(dir, newDirName).mkdir());
	},
	exists:function(file){
		return file.exist();
	},
	create:function(path, name){
		new File(path, name).createNewFile();
		return File;
	},
	deleteF:function(path){
		try{var filed = new java.io.File(path);
			if(filed.isDirectory()){
			var directoryFiles = filed.listFiles();
			for(var i in directoryFiles){
				FileAPI.deleteF(directoryFiles[i].getAbsolutePath());
			}
			filed.deleteF();
		}
			if(filed.isFile()){
			filed.deleteF();}
		}catch(e){
			print(e);
		}
	},
	read:function(selectedFile){
		var readed=(new BufferedReader(new FileReader(selectedFile)));
		var data=new StringBuilder();
		var string;
		while((string=readed.readLine())!=null){
			data.append(string);
			data.append('\n');
		}
		return data.toString();
	},
	readLine:function(selectedFile, line){
		var readT=new FileAPI.read(selectedFile);
		var lineArray=readT.split('\n');
		return lineArray[line-1];
	},
	write:function(selectedFile , text){
		FileAPI.rewrite(selectedFile,(new FileAPI.read(selectedFile)) + text);
	},
	rewrite:function(selectedFile, text){
		var writeFOS = new FOS(selectedFile);
		writeFOS.write(new String(text).getBytes());
	},
	getFilesList:function(path, endsWith){
		var c = [], d = (new java.io.File(path)).listFiles();
		for(var e = 0; e < d.length; e++) {
			var f = d[e];
			f.isDirectory() || endsWith && !f.getName().endsWith(endsWith) || c.push(f.getName())
		}
		return c
	},
	//my
	checkDir:function(name){
		for(let i in name){
			if(FileTools.isExists(__dir__+name[i])==false)
			FileAPI.createNewDir(__dir__, name[i]);
		}
	},
	list:function(dir) {
		let list = [];
		for(let i in dir){
			list.push(FileTools.GetListOfFiles(__dir__+dir[i]));
		}
		return list;
	},
	getFilesCount:function(list) {
		let count=0;
		for(let i in list)count++;
		return count;
	},
	getGuiItems: function(gui){
		let count = 0;
		for(let i in gui.elements){
			if(gui.elements[i]!=null){count++;}
		}
		if(count>0)return true; else return false;
	}
};
/*
	┬─┬ノ( º _ ºノ)
*/




// file: UI/modules/text.js

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




// file: UI/modules/Widgets.js


/*
  _____               ______    _ _ _
 |  __ \             |  ____|  | (_) |
 | |  | | _____   __ | |__   __| |_| |_ ___  _ __
 | |  | |/ _ \ \ / / |  __| / _` | | __/ _ \| '__|
 | |__| |  __/\ V /  | |___| (_| | | || (_) | |
 |_____/ \___| \_/   |______\__,_|_|\__\___/|_|


       Developed by Nernar (vk.com/nernar)
   This code is a copyright, do not distribute.

*/

var Widgets = {
    ctx: UI.getContext(),
    theme: 16974120,
    dialogTheme: 16974126,
    size: {
        wrap: android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT,
        match: android.widget.RelativeLayout.LayoutParams.MATCH_PARENT
    },
    display: {
        width: UI.getContext().getWindowManager().getDefaultDisplay().getWidth(),
        height: UI.getContext().getWindowManager().getDefaultDisplay().getHeight()
    },
    gravity: {
        top: android.view.Gravity.TOP,
        bottom: android.view.Gravity.BOTTOM,
        left: android.view.Gravity.LEFT,
        right: android.view.Gravity.RIGHT,
        center: android.view.Gravity.CENTER
    },
    visibility: {
        visible: android.view.View.VISIBLE,
        invisible: android.view.View.INVISIBLE,
        gone: android.view.View.GONE
    },
    color: android.graphics.Color,
    font: android.graphics.Typeface.createFromFile(new java.io.File(FileTools.root + "games/com.mojang/innercore/mc-typeface.ttf")),
    orientate: {
        vertical: android.widget.LinearLayout.VERTICAL,
        horizontal: android.widget.LinearLayout.HORIZONTAL
    },
    run: function(code) {
        this.ctx.runOnUiThread(function() {
            try {
                code();
            } catch(e) {
                android.widget.Toast.makeText(Widgets.ctx, e + " (#" + e.lineNumber + ")", android.widget.Toast.LENGTH_LONG).show();
            }
        });
    },
    resize: function(value, isWidth) {
        return isWidth
            ? (value * 1 / 800 * this.display.width)
            : (value * 1 / 480 * this.display.height);
    },
    check: function(image, isPath) {
        if(!isPath){return image && new java.io.File(__dir__ + "gui/UI/" + image + ".png").exists();}
        else {return image && new java.io.File(image).exists();}
    },
    bitmap: function(file, scale, isPath) {
        if(!this.check(file, isPath)) return null;
        var bitmap = "";
        if(isPath){ bitmap = FileTools.ReadImage(file); }else{  bitmap = FileTools.ReadImage(__dir__ + "gui/UI/" + file + ".png");  }
        return android.graphics.drawable.BitmapDrawable(android.graphics.Bitmap.createScaledBitmap(android.graphics.Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight()), bitmap.getWidth() * (scale || 1), bitmap.getHeight() * (scale || 1), false));
    },
    parse: function(color) {
        return this.color.parseColor(color);
    },
    params: function(width, height) {
        return android.widget.LinearLayout.LayoutParams(this.resize(width, true), this.resize(height, false));
    },
    remove: function(view) {
        if(view) {
            view.dismiss();
            view = null;
        }
    },
    window: function(view, gravity, x, y, width, height, focus) {
        var window = new android.widget.PopupWindow(view,
            this.resize(width) || this.size.wrap,
            this.resize(height) || this.size.wrap, focus || false);
        if(gravity == null) gravity = this.gravity.center;
        window.setBackgroundDrawable(this.bitmap("background"));
        window.showAtLocation(this.ctx.getWindow().getDecorView(),
            gravity, x || 0, y || 0);
        return window;
    },
    linear: function(views, orientation, gravity, params, color) {
        var layout = new android.widget.LinearLayout(this.ctx);
        layout.setOrientation((orientation != null) ? orientation : this.orientate.vertical);
        if(params) layout.setLayoutParams(params);
        layout.setGravity((gravity != null) ? gravity : Widgets.gravity.center);
        for(a in views)
            layout.addView(views[a]);
        return layout;
    },
    scroll: function(view, orientation, params) {
        var scroll = null;
        if(orientation == null || orientation == this.orientate.vertical) {
            scroll = new android.widget.ScrollView(this.ctx);
        } else {
            scroll = new android.widget.HorizontalScrollView(this.ctx);
        }
        if(params) scroll.setLayoutParams(params);
        if(view) scroll.addView(view);
        return scroll;
    },
    button: function(text, size, params, color) {
        var button = new android.widget.Button(this.ctx);
        button.setText((text != null) ? text : "");
        if(size != null) button.setTextSize(this.resize(size));
        button.setTextColor(color || this.color.WHITE);
        button.setTypeface(this.font);
        button.setBackgroundDrawable(null);
        if(params) button.setLayoutParams(params);
        return button;
    },
    image: function(file, scale, params, isPath) {
        var image = new android.widget.ImageView(this.ctx);
        if(file) image.setImageDrawable(this.bitmap(file, scale, isPath));
        if(params) image.setLayoutParams(params);
        return image;
    },
    text: function(msg, size, gravity, params, color) {
        var text = new android.widget.TextView(this.ctx);
        text.setText((msg != null) ? msg : "");
        if(size != null) text.setTextSize(this.resize(size));
        text.setTextColor(color || this.color.WHITE);
        text.setGravity(gravity || this.gravity.left);
        text.setTypeface(this.font);
        if(params) text.setLayoutParams(params);
        return text;
    },
    edit: function(msg, hint, size, params, type, single, gravity, color, hintColor) {
        var edit = new android.widget.EditText(this.ctx);
        if(msg != null) edit.setText(msg);
        if(hint != null) edit.setHint(hint);
        if(size != null) edit.setTextSize(this.resize(size));
        if(single) edit.setSingleLine(single);
        if(type) edit.setInputType(type);
        edit.setBackgroundDrawable(null);
        edit.setTextColor(color || this.color.WHITE);
        edit.setHintTextColor(hintColor || this.color.RED);
        edit.setGravity(gravity || this.gravity.center);
        edit.setTypeface(this.font);
        if(params) edit.setLayoutParams(params);
        return edit;
    },
    list: function(items, params) {
        var adapter = new android.widget.ArrayAdapter(this.ctx, android.R.layout.simple_list_item_1, items);
        var list = new android.widget.ListView(this.ctx, null, this.theme);
        list.setAdapter(adapter);
        if(params) list.setLayoutParams(params);
        return {
            adapter: adapter,
            view: list
        };
    }
};




// file: UI/modules/Window.js


/*
  _____               ______    _ _ _
 |  __ \             |  ____|  | (_) |
 | |  | | _____   __ | |__   __| |_| |_ ___  _ __
 | |  | |/ _ \ \ / / |  __| / _` | | __/ _ \| '__|
 | |__| |  __/\ V /  | |___| (_| | | || (_) | |
 |_____/ \___| \_/   |______\__,_|_|\__\___/|_|


       Developed by Nernar (vk.com/nernar)
   This code is a copyright, do not distribute.

*/

var Windows = {
	windows: {},
	dismiss: function(name) {
		Widgets.run(function() {
			var widget = Windows.windows[name];
			if(widget) {
				Widgets.remove(widget.window);
				Windows.windows[name] = null;
			}
		});
	},
	closeMenu: function(type) {
		this.dismiss(type + "Menu");
	},
	closePopup: function(type) {
		this.dismiss(type + "Popup");
	},
	hide: function(name) {
		Widgets.run(function() {
			var widget = Windows.windows[name];
			if(widget) {
				widget.window.setVisibility(Widgets.visibility.gone);
			}
		});
	},
	show: function(name) {
		Widgets.run(function() {
			var widget = Windows.windows[name];
			if(widget) {
				widget.window.setVisibility(Widgets.visibility.visible);
			}
		});
	},
	menu: function(name, type, layout) {
		Widgets.run(function() {
			if(layout) {
				Windows.closePopup(type);
				layout.setTag(type);
				var widget = Windows.windows[type + "Menu"];
				if(widget) {
					var animate = android.view.animation.TranslateAnimation(0, (type == "menu") ? -widget.layout.getWidth() : (type == "right") ? widget.layout.getWidth() : 0, 0, 0);
					widget.layout.startAnimation(animate);
					animate.setDuration(400);
					widget.layout.postDelayed(new java.lang.Runnable({
						run: function() {
							Widgets.run(function() {
								widget.name = name;
								widget.parent.removeAllViews();
								widget.parent.addView(layout);
								widget.layout = layout;
								var animate = android.view.animation.TranslateAnimation((type == "menu") ? -widget.parent.getWidth() : (type == "right") ? widget.parent.getWidth() : 0, 0, 0, 0);
								layout.startAnimation(animate);
								animate.setDuration(400);
							});
						}
					}), 400);
				} else {
					var scroll = Widgets.scroll(layout);
					var window = Widgets.window(scroll,
						Widgets.gravity.top | Widgets.gravity["left"],
						null, null, null, Widgets.size.match);
					Windows.windows[type + "Menu"] = {
						window: window,
						parent: scroll,
						layout: layout,
						name: name
					};
				}
			}
		});
	},
	popup: function(name, view, layout, focus) {
		Widgets.run(function() {
			if(layout) {
				var type = view ? view.getParent().getTag() : "unknown";
				var widget = Windows.windows[type + "Popup"];
				if(widget && !focus) {
					if(widget.name == name) {
						Windows.closePopup(type);
					} else {
						if(Settings.config.interfaceAnimated) {
							var animate = android.view.animation.AlphaAnimation(1, 0);
							widget.layout.startAnimation(animate);
							animate.setDuration(150);
							widget.layout.postDelayed(new java.lang.Runnable({
								run: function() {
									Widgets.run(function() {
										widget.name = name;
										widget.parent.removeAllViews();
										widget.parent.addView(layout);
										widget.layout = layout;
										widget.window.update(view ? (type == "menu") ? view.getWidth() : (type == "right") ? view.getWidth() + layout.getWidth() : 0 : 0,
											view ? view.getY() : 0, Widgets.size.wrap, Widgets.size.wrap);
										var animate = android.view.animation.AlphaAnimation(0, 1);
										layout.startAnimation(animate);
										animate.setDuration(150);
									});
								}
							}), 150);
						} else {
							widget.name = name;
							widget.parent.removeAllViews();
							widget.parent.addView(layout);
							widget.layout = layout;
							widget.window.update(view ? (type == "menu") ? view.getWidth() : (type == "right") ? view.getWidth() + layout.getWidth() : 0 : 0,
								view ? view.getY() : 0, Widgets.size.wrap, Widgets.size.wrap);
						}
					}
				} else {
					if(widget) Windows.closePopup(type);
					var scroll = Widgets.scroll(layout);
					var window = Widgets.window(scroll,
						view ? Widgets.gravity.top | Widgets.gravity[view.getParent().getTag()] : Widgets.gravity.center,
						view ? (type == "menu") ? view.getWidth() : (type == "right") ? view.getWidth() + layout.getWidth() : 0 : 0,
						view ? view.getY() : 0, null, null, focus);
					if(!focus) {
						Windows.windows[type + "Popup"] = {
							window: window,
							parent: scroll,
							layout: layout,
							name: name
						};
					}
				}
			}
		});
	}
};




// file: UI/modules/editor.js

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




// file: UI/modules/export.js

function exportElement(e, name){
	// e - element, name - name of element
	var props= "\n\t\t\""+name+"\""+": {", count = 0, cur = 0;
	for(let i in e)count++;
	for(let u in e){
		cur++; let i = u;
		if(cur!=count){
			if(i!="clicker" && i!="onClick" && i!="onLongClick" && i!="overlay" && i!="overlayScale" && i!="overlayOffset" && i!="invert")
			if(i=="type")props+= i+": \""+e[i]+"\""
			else{
				if(i=="bitmap" || i=="bitmap2" || i=="text")
				props+= ", "+i+": \""+e[i]+"\""
				else props+= ", "+i+": "+e[i];
			}
		}else props+= "},";
	}
	return props;
}

function exportUI(rewrite, newPRJ){
	Widgets.run(function(){
		//check directories for existing and create if not exists.
		FileAPI.checkDir(["guis", "projects"]);
		//get list of two dirs to save, count 1 & 2 for dirs. get content & elements.
		let files = FileAPI.list(["guis/"]),
			count1 = FileAPI.getFilesCount(files[0]),
			ui = editorUI.main.Window.content,
			elements = ui.elements;
		//check for rewriting
		if(newPRJ==true){editorUI.project=("CUI_"+(count1+1)+".js")}
		if(rewrite==true&&editorUI.project!=null){
			var fileGUI = editorUI.project;
			var filePRJ = fileGUI+"on";
		}else if (rewrite==true&&editorUI.project==null) {
			if(FileAPI.getGuiItems(ui)==true)alert("No projects imported last, saving one new");
			var fileGUI = "CUI_"+(count1+1)+".js";
			var filePRJ = "CUI_"+(count1+1)+".json";
		}else if(!rewrite){
			var fileGUI = "CUI_"+(count1+1)+".js";
			var filePRJ = "CUI_"+(count1+1)+".json";
		}
		//base for gui
		let exporting = "var custom_UI = new UI.StandartWindow({\n\tstandart: {header: {text: {text: \"Created With UIEditor\"}},\n\tbackground: {color: android.graphics.Color.parseColor(\"#b3b3b3\")}, inventory: {standart: true}},\n\tdrawing: [],\n\telements: {";
		//writing elements
		// for(let i in elements){0
		// 	if(elements[i]!=null)
		// 	json.push(elements[i]);
		// }
		var json = {"elements": elements};
		for(let u in elements){
			let i = u, el="";
			if(elements[i]!=null)
			exporting += exportElement(elements[i], i);
		}
		//after writing elements, ending the gui.
		exporting+="\n\t}\n});";
		//export gui to UIEditor/guis/CUI_ num .js
		if(FileAPI.getGuiItems(ui)==true)FileTools.WriteText(__dir__+"guis/"+fileGUI, exporting);
		//export project to UIEditor/projects/CUI_ num .js
		if(FileAPI.getGuiItems(ui)==true)FileTools.WriteJSON(__dir__+"projects/"+filePRJ, json, true);
		//alert for informate user
		if(FileAPI.getGuiItems(ui)==true)alert("Saved to guis/"+fileGUI+" and to projects/"+filePRJ); else alert("Nothing to save...");
	});
}
function importUI(item) {
	Widgets.run(function(){
		var c = FileTools.ReadJSON(__dir__+"projects/"+item);
		for(let u in c["elements"]){
			let i = u;
			let cei = c["elements"][i];
			edit(["add", i, cei]);
			if(cei!= null || cei!= undefined)
			cei.clicker = {onClick: function(){edit(["select", i]);}};
		};
		if(c!= undefined)
		alert("Loaded ["+item+"]")
		else alert("Error loading ["+item+"], undefined");
	});
}




// file: UI/functions/dialog.js


/*
  _____               ______    _ _ _
 |  __ \             |  ____|  | (_) |
 | |  | | _____   __ | |__   __| |_| |_ ___  _ __
 | |  | |/ _ \ \ / / |  __| / _` | | __/ _ \| '__|
 | |__| |  __/\ V /  | |___| (_| | | || (_) | |
 |_____/ \___| \_/   |______\__,_|_|\__\___/|_|


       Developed by Nernar (vk.com/nernar)
   This code is a copyright, do not distribute.

*/

function dialog(properties) {
	Widgets.run(function() {
		var builder = new android.app.AlertDialog.Builder(Widgets.ctx, Widgets.dialogTheme);

		if(properties.title != null) builder.setTitle(properties.title);
		if(properties.message != null) builder.setMessage(properties.message);
		if(properties.view != null) builder.setView(properties.view);
		if(properties.cancelable != null) builder.setCancelable(properties.cancelable);

		if(properties.items != null) {
			var items = properties.items;
			builder.setItems(items.text, items.click ? function(interface, item) {
				try {
					items.click(interface, item);
				} catch(e) {}
			} : null);
		}

		if(properties.multi != null) {
			var multi = properties.multi;
			builder.setMultiChoiceItems(multi.text, multi.check ? multi.check : null, multi.click ? function(interface, item, active) {
				try {
					multi.click(interface, item, active);
				} catch(e) {}
			} : null);
		}

		if(properties.buttons != null) {
			var text = properties.buttons.text || [];
			var click = properties.buttons.click || [];
			if(text[0]) {
				builder.setNeutralButton(text[0], click[0] ? function() {
					try {
						click[0]();
					} catch(e) {}
				} : null);
			} if(text[1]) {
				builder.setNegativeButton(text[1], click[1] ? function() {
					try {
						click[1]();
					} catch(e) {}
				} : null);
			} if(text[2]) {
				builder.setPositiveButton(text[2], click[2] ? function() {
					try {
						click[2]();
					} catch(e) {}
				} : null);
			}
		}
		var width = UI.getScreenHeight()*1.6;
		var build = builder.create();
		if(properties)build.show();
		build.getWindow().setLayout(width, Widgets.size.wrap);
		return build;
	});
}




// file: UI/functions/animate.js

/*
DEPRECATED METHOD
function animate(name, layout, pos, widget, width, height) {

	widget.layout.startAnimation(animate);
	animate.setDuration(160);
	widget.layout.postDelayed(new java.lang.Runnable({
		run: function(){
			Widgets.run(function(){
				widget.name = name;
				widget.parent.removeAllViews();
				widget.window.update(135*pos, 135, width, height);

				widget.parent.addView(layout);
				widget.layout = layout;
				widget.layout.startAnimation(animate);
				animate.setDuration(320);
			});
		}
	}), 160);
}*/




// file: UI/functions/addWidgets.js

function addWidgetsFrom(list, orientation, nst) {
  var widgets = [];
  if(nst){
    widgets=list;
  }else{
    if(!orientation) orientation = Widgets.orientate.horizontal;
    for(a in list) {
      var widget = list[a], image = null, text = null;
      if(Widgets.check(widget.image)) {  image = Widgets.image(widget.image, 10);	}
      if(text || image) {
          var obj = [];
          if(image) obj.push(image);
          if(text) obj.push(text);
          var linear = Widgets.linear(obj, Widgets.orientate.vertical, null);
          if(widget.click) linear.setOnClickListener(widget.click);
          widgets.push(linear);
      }
    }
  }
  var layout = Widgets.linear(widgets, orientation);
  return layout;
};




// file: UI/functions/createPopup.js

function newPopup(type, list, name, pos, width, height, nst) {
    if(!type) type = "menu";
		// if(pos=0)pos=1;
    var widget = Windows.windows[type + "Popup"];
    if(widget && widget.name != name){
			Windows.closePopup(type);
      openUP(type, list, name, pos, width, height, nst);
    } else {
        if(widget && widget.name == name){
            Windows.closePopup(type);
        } else {
            openUP(type, list, name, pos, width, height, nst);
        }
    }
}
function openUP(type, list, name, pos, width, height, nst) {
	var layout = addWidgetsFrom(list, Widgets.orientate.vertical, nst);
	var scroll = Widgets.scroll(layout);
	var window = Widgets.window(scroll, Widgets.gravity.top | Widgets.gravity.left, 14, 106);
	widget = Windows.windows[type + "Popup"] = {
			window: window,
			parent: scroll,
			layout: layout,
			name: name
	};
}




// file: UI/MainMenu.js

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




