const SolidButtonFragment = function() {
	ThinButtonFragment.apply(this, arguments);
};

SolidButtonFragment.prototype = new ThinButtonFragment;
SolidButtonFragment.prototype.TYPE = "SolidButtonFragment";

SolidButtonFragment.prototype.resetContainer = function() {
	ThinButtonFragment.prototype.resetContainer.apply(this, arguments);
	this.getTextView().setPadding(toComplexUnitDip(16), toComplexUnitDip(16),
		toComplexUnitDip(16), toComplexUnitDip(16));
};

SolidButtonFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof SolidButtonFragment)) {
		json = instanceOrJson;
		instanceOrJson = new SolidButtonFragment();
	}
	return ThinButtonFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("solidButton", SolidButtonFragment);
