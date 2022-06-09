const ExpandableFragment = function() {
	FixedFragment.apply(this, arguments);
};

ExpandableFragment.prototype = new FixedFragment;
ExpandableFragment.prototype.TYPE = "ExpandableFragment";

ExpandableFragment.prototype.resetContainer = function() {
	FixedFragment.prototype.resetContainer.apply(this, arguments);
	let layout = this.getContainerRoot();
	
	let title = new android.widget.TextView(context);
	title.setPadding(Interface.getY(30), Interface.getY(18), Interface.getY(30), Interface.getY(18));
	new BitmapDrawable("popup").attachAsBackground(title);
	title.setTextSize(Interface.getFontSize(24));
	title.setGravity(Interface.Gravity.CENTER);
	title.setTextColor(Interface.Color.WHITE);
	title.setTypeface(typeface);
	let params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = .1;
	title.setTag("popupTitle");
	layout.addView(title, params);
	
	let scroll = new android.widget.ScrollView(context);
	scroll.setTag("containerExpandableScroll");
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = 16.;
	layout.addView(scroll, params);
	
	let content = new android.widget.LinearLayout(context);
	content.setOrientation(Interface.Orientate.VERTICAL);
	content.setGravity(Interface.Gravity.CENTER);
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
