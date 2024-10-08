const ButtonFragment = function() {
	TextFragment.apply(this, arguments);
	this.setIsSelectable(true);
};

ButtonFragment.prototype = new TextFragment;
ButtonFragment.prototype.TYPE = "ButtonFragment";

ButtonFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(getContext());
	view.setGravity($.Gravity.CENTER);
	view.setTextColor($.Color.WHITE);
	view.setTypeface(typeface);
	view.setLayoutParams(new android.view.ViewGroup.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
	this.setContainerView(view);
};

ButtonFragment.prototype.getTextView = function() {
	return this.getContainer();
};

ButtonFragment.prototype.remark = function() {
	let text = this.getTextView();
	if (this.hasMark("solid") || this.hasMark("popup")) {
		text.setPadding(toComplexUnitDip(16), toComplexUnitDip(16),
			toComplexUnitDip(16), toComplexUnitDip(16));
	} else {
		text.setPadding(toComplexUnitDip(16), toComplexUnitDip(6),
			toComplexUnitDip(16), toComplexUnitDip(6));
	}
	if (this.hasMark("filled") || this.hasMark("popup")) {
		this.setBackground("popup");
	} else {
		this.setBackground(null);
	}
	if (this.hasMark("popup")) {
		text.setTextSize(toComplexUnitDp(9));
	} else {
		text.setTextSize(toComplexUnitDp(8));
	}
	TextFragment.prototype.remark.apply(this, arguments);
};

ButtonFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof ButtonFragment)) {
		json = instanceOrJson;
		instanceOrJson = new ButtonFragment();
	}
	return TextFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("button", ButtonFragment);


const SolidButtonFragment = function() {
	ButtonFragment.call(this, "solid");
	Logger.Log("Modding Tools: SolidButtonFragment has been deprecated! Use marks or layout adding instead.", "WARNING");
};

SolidButtonFragment.prototype = new ButtonFragment;
SolidButtonFragment.prototype.TYPE = "SolidButtonFragment";


const ThinButtonFragment = function() {
	ButtonFragment.call(this);
	Logger.Log("Modding Tools: ThinButtonFragment has been deprecated! Use primary ButtonFragment instead.", "WARNING");
};

ThinButtonFragment.prototype = new ButtonFragment;
ThinButtonFragment.prototype.TYPE = "ThinButtonFragment";
