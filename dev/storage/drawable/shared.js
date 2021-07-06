const Drawable = new Function();

Drawable.prototype.toDrawable = function() {
	return null;
};

Drawable.prototype.attachAsImage = function(view) {
	if (view instanceof android.widget.ImageView) {
		view.setImageDrawable(this.toDrawable());
	}
};

Drawable.prototype.attachAsBackground = function(view) {
	if (view instanceof android.view.View) {
		view.setBackgroundDrawable(this.toDrawable());
	}
};

const ScheduleDrawable = new Function();

ScheduleDrawable.prototype = new Drawable;

ScheduleDrawable.prototype.process = function() {
	MCSystem.throwException("ScheduleDrawable.process must be implemented");
};
