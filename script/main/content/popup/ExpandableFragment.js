const ExpandableFragment = function() {
	FocusableFragment.apply(this, arguments);
};

ExpandableFragment.prototype = new FocusableFragment;
ExpandableFragment.prototype.TYPE = "ExpandableFragment";

ExpandableFragment.prototype.resetContainer = function() {
	FocusableFragment.prototype.resetContainer.apply(this, arguments);
	let layout = this.getContainerRoot();
	
	let title = new android.widget.TextView(getContext());
	title.setPadding(getDisplayPercentHeight(30), getDisplayPercentHeight(18), getDisplayPercentHeight(30), getDisplayPercentHeight(18));
	new BitmapDrawable("popup").attachAsBackground(title);
	title.setTextSize(getRelativeDisplayPercentWidth(24));
	title.setGravity($.Gravity.CENTER);
	title.setTextColor($.Color.WHITE);
	title.setTypeface(typeface);
	let params = new android.widget.LinearLayout.
		LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT);
	params.weight = .1;
	title.setTag("popupTitle");
	layout.addView(title, params);
	
	let scroll = new android.widget.ScrollView(getContext());
	scroll.setTag("containerExpandableScroll");
	params = new android.widget.LinearLayout.
		LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT);
	params.weight = 16.;
	layout.addView(scroll, params);
	
	let content = new android.widget.LinearLayout(getContext());
	content.setOrientation($.LinearLayout.VERTICAL);
	content.setGravity($.Gravity.CENTER);
	content.setTag("containerExpandable");
	scroll.addView(content);
};

ExpandableFragment.prototype.getContainerLayout = function() {
	return this.findViewByTag("containerExpandable");
};

ExpandableFragment.prototype.getContainerScroll = function() {
	return this.findViewByTag("containerExpandableScroll");
};

ExpandableFragment.prototype.getTitleView = function() {
	return this.findViewByTag("popupTitle");
};
