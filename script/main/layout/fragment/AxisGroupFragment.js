const AxisGroupFragment = function() {
	LayoutFragment.apply(this, arguments);
	this.resetContainer();
	this.setBackground("popup");
};

AxisGroupFragment.prototype = new LayoutFragment;
AxisGroupFragment.prototype.TYPE = "AxisGroupFragment";

AxisGroupFragment.prototype.resetContainer = function() {
	let content = new android.widget.LinearLayout(context);
	content.setPadding(Interface.getY(10), Interface.getY(10), Interface.getY(10), Interface.getY(10));
	this.setContainerView(content);
	
	let axis = new android.widget.TextView(context);
	axis.setPadding(Interface.getY(16), Interface.getY(10), Interface.getY(16), Interface.getY(10));
	axis.setTextSize(Interface.getFontSize(32));
	axis.setTextColor(Interface.Color.WHITE);
	axis.setTypeface(typeface);
	axis.setMaxLines(1);
	axis.setTag("groupAxis");
	views.groups[index].addView(views.titles[index]);
	
	let container = new android.widget.LinearLayout(context);
	container.setOrientation(Interface.Orientate.VERTICAL);
	container.setTag("containerGroup");
	content.addView(container);
};

AxisGroupFragment.prototype.getContainerRoot = function() {
	return this.findViewByTag("containerGroup");
};

AxisGroupFragment.prototype.getTextView = function() {
	return this.findViewByTag("groupAxis");
};

AxisGroupFragment.prototype.getAxis = function() {
	return TextFragment.prototype.getText.apply(this, arguments);
};

AxisGroupFragment.prototype.appendAxis = function(text) {
	return TextFragment.prototype.appendText.apply(this, arguments);
};

AxisGroupFragment.prototype.setAxis = function(text) {
	return TextFragment.prototype.setText.apply(this, arguments);
};
