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
