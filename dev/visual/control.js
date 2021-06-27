const ControlButton = function() {
	UniqueWindow.apply(this, arguments);
	this.resetContent();
	this.setBackground("popupButton");

	let actor = new FadeActor();
	actor.setInterpolator(new AccelerateDecelerateInterpolator());
	actor.setDuration(400);
	this.setEnterActor(actor);

	actor = new SlideActor(Interface.Gravity.LEFT);
	actor.setInterpolator(new AccelerateInterpolator());
	actor.setDuration(400);
	this.setExitActor(actor);
};

ControlButton.prototype = new UniqueWindow;
ControlButton.prototype.TYPE = "ControlButton";

ControlButton.prototype.unclose = true;

ControlButton.prototype.resetContent = function() {
	let scope = this,
		views = this.views = new Object();
	let content = new android.widget.FrameLayout(context);
	this.setContent(content);

	views.layout = new android.widget.LinearLayout(context);
	views.layout.setOrientation(Interface.Orientate.VERTICAL);
	views.layout.setOnClickListener(function(view) {
		scope.isCloseableOutside() && scope.hide();
		scope.__click && scope.__click();
	});
	let params = android.widget.FrameLayout.LayoutParams(Interface.Display.WRAP, Interface.Display.WRAP);
	params.setMargins(Interface.getY(20), Interface.getY(20), 0, 0);
	content.addView(views.layout, params);

	views.button = new android.widget.ImageView(context);
	views.button.setPadding(Interface.getY(15), Interface.getY(15), Interface.getY(15), Interface.getY(15));
	params = android.widget.LinearLayout.LayoutParams(Interface.getY(100), Interface.getY(100));
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
	this.__click = function() {
		tryout(listener);
	};
};

ControlButton.prototype.isCloseableOutside = function() {
	return this.unclose;
};

ControlButton.prototype.setCloseableOutside = function(state) {
	this.unclose = !!state;
};
