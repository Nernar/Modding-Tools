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
	title.setPadding(toComplexUnitDip(20), toComplexUnitDip(12),
		toComplexUnitDip(20), toComplexUnitDip(12));
	new BitmapDrawable("popup").attachAsBackground(title);
	title.setTextSize(toComplexUnitSp(9));
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
