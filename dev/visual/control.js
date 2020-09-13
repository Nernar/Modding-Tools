let ControlButton = function() {
	this.reset();
	this.setBackground("popupBackgroundControl");
	
	let actor = new FadeActor();
	actor.setInterpolator(new AccelerateDecelerateInterpolator());
	actor.setDuration(400);
	this.setEnterActor(actor);
	
	actor = new SlideActor(Ui.Gravity.LEFT);
	actor.setInterpolator(new AccelerateInterpolator());
	actor.setDuration(400);
	this.setExitActor(actor);
};
ControlButton.prototype = new UniqueWindow();
ControlButton.prototype.TYPE = "ControlButton";
ControlButton.prototype.reset = function() {
	let scope = this, views = (this.views = {});
	let content = new android.widget.FrameLayout(context);
	this.setContent(content);
	
	views.layout = new android.widget.LinearLayout(context);
	views.layout.setOrientation(Ui.Orientate.VERTICAL);
	views.layout.setOnClickListener(function(view) {
		scope.isCloseableOutside() && scope.dismiss();
		scope.__click && scope.__click();
	});
	let params = android.widget.FrameLayout.LayoutParams
		(Ui.Display.WRAP, Ui.Display.WRAP);
	params.setMargins(Ui.getY(20), Ui.getY(20), 0, 0);
	content.addView(views.layout, params);
	
	views.button = new android.widget.ImageView(context);
	views.button.setPadding(Ui.getY(15), Ui.getY(15), Ui.getY(15), Ui.getY(15));
	params = android.widget.LinearLayout.LayoutParams(Ui.getY(100), Ui.getY(100));
	views.layout.addView(views.button, params);
};
ControlButton.prototype.setBackground = function(src) {
	this.views && this.views.layout &&
		this.views.layout.setBackgroundDrawable(ImageFactory.getDrawable(src));
};
ControlButton.prototype.setIcon = function(src) {
	this.views && this.views.button &&
		this.views.button.setImageDrawable(ImageFactory.getDrawable(src));
};
ControlButton.prototype.setOnClickListener = function(listener) {
	listener && (this.__click = function() {
		try { listener && listener(); }
		catch (e) { reportError(e); }
	});
};
ControlButton.prototype.unclose = true;
ControlButton.prototype.isCloseableOutside = function() {
	return this.unclose;
};
ControlButton.prototype.setCloseableOutside = function(state) {
	this.unclose = !!state;
};
