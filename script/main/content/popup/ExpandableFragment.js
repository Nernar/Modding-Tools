/**
 * @requires `isAndroid()`
 */
function ExpandableFragment() {
	FocusableFragment.apply(this, arguments);
};

ExpandableFragment.prototype = new FocusableFragment;
ExpandableFragment.prototype.TYPE = "ExpandableFragment";

ExpandableFragment.prototype.resetContainer = function() {
	FocusableFragment.prototype.resetContainer.apply(this, arguments);
	let layout = this.getContainerRoot();

	let title = new android.widget.TextView(getContext());
	new BitmapDrawable("popup").attachAsBackground(title);
	title.setPadding(toComplexUnitDip(16), toComplexUnitDip(16),
		toComplexUnitDip(16), toComplexUnitDip(16));
	title.setTextSize(toComplexUnitDp(9));
	title.setGravity($.Gravity.CENTER);
	title.setTextColor($.Color.WHITE);
	title.setTypeface(typeface);
	title.setTag("popupTitle");
	let params = new android.widget.LinearLayout.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	layout.addView(title, params);

	let scroll = new android.widget.ScrollView(getContext());
	scroll.setTag("containerExpandableScroll");
	params = new android.widget.LinearLayout.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	layout.addView(scroll, params);

	let content = new android.widget.LinearLayout(getContext());
	content.setOrientation($.LinearLayout.VERTICAL);
	content.setGravity($.Gravity.CENTER);
	content.setTag("containerExpandable");
	params = new android.view.ViewGroup.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	scroll.addView(content, params);
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
