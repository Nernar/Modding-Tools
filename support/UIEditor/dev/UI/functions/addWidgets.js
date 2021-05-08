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
