const FocusablePopup = function() {
	this.reset();
};

FocusablePopup.prototype.reset = function() {
	let views = (this.views = { edits: [], buttons: [] });
	views.root = new android.widget.FrameLayout(context);
	views.layout = new android.widget.LinearLayout(context);
	views.layout.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
	views.layout.setOrientation(Ui.Orientate.VERTICAL);
	views.root.addView(views.layout);

	views.title = new android.widget.TextView(context);
	views.title.setPadding(Ui.getY(30), Ui.getY(18), Ui.getY(30), Ui.getY(18));
	views.title.setBackgroundDrawable(ImageFactory.getDrawable("popupBackground"));
	views.title.setTextSize(Ui.getFontSize(24));
	views.title.setGravity(Ui.Gravity.CENTER);
	views.title.setTextColor(Ui.Color.WHITE);
	views.title.setTypeface(typeface);
	views.layout.addView(views.title);
};

FocusablePopup.prototype.setOnShowListener = function(listener) {
	this.__show = function() {
		try { listener && listener(); }
		catch (e) { reportError(e); }
	};
};

FocusablePopup.prototype.setOnUpdateListener = function(listener) {
	this.__update = function() {
		try { listener && listener(); }
		catch (e) { reportError(e); }
	};
};

FocusablePopup.prototype.setOnHideListener = function(listener) {
	this.__hide = function() {
		try { listener && listener(); }
		catch (e) { reportError(e); }
	};
};

FocusablePopup.prototype.setTitle = function(title) {
	this.views.title.setText(title);
};

FocusablePopup.prototype.update = new Function();

FocusablePopup.prototype.show = function() {
	let views = this.views;
	views.root.post(function() {
		let animate = android.view.animation.AlphaAnimation(0, 1);
		views.layout.startAnimation(animate);
		animate.setDuration(400);
	});
	let place = Popups.getAvailablePlace();
	this.window = new android.widget.PopupWindow(views.root, Ui.Display.WRAP, Ui.Display.WRAP);
	this.focusable = views.edits.length > 0 && (this.window.setFocusable(true), true);
	this.window.setAttachedInDecor(false);
	this.window.showAtLocation(context.getWindow().getDecorView(), 0, place.x, place.y);
	this.__show && this.__show();
};

FocusablePopup.prototype.hide = function() {
	let scope = this, views = this.views;
	if (this.window) {
		let animate = android.view.animation.AlphaAnimation(1, 0);
		views.layout.startAnimation(animate);
		animate.setDuration(400);
		views.root.postDelayed(function() {
			scope.window.dismiss();
			delete scope.window;
			scope.__hide && scope.__hide();
		}, 400);
	}
};