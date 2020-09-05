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
