const attachBackground = function(drawableOrColor) {
	handle(function() {
		let unique = new UniqueWindow();
		unique.TYPE = "BackgroundWindow";
		unique.setWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
		unique.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);
		let frame = new android.widget.FrameLayout(getContext());
		if (drawableOrColor === undefined) {
			drawableOrColor = $.Color.BLACK;
		}
		if (!(drawableOrColor instanceof android.graphics.drawable.Drawable)) {
			drawableOrColor = new android.graphics.drawable.ColorDrawable(drawableOrColor);
		}
		frame.setBackgroundDrawable(drawableOrColor);
		unique.setContent(frame);
		unique.show();
	});
};

const deattachBackground = function() {
	handle(function() {
		let unique = UniqueHelper.getWindow("BackgroundWindow");
		if (unique !== null) unique.hide();
	});
};

SHARE("attachBackground", attachBackground);
SHARE("deattachBackground", deattachBackground);
