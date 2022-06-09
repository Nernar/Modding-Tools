const SolidButtonFragment = function() {
	ThinButtonFragment.apply(this, arguments);
};

SolidButtonFragment.prototype = new ThinButtonFragment;
SolidButtonFragment.prototype.TYPE = "SolidButtonFragment";

SolidButtonFragment.prototype.resetContainer = function() {
	ThinButtonFragment.prototype.resetContainer.apply(this, arguments);
	this.getTextView().setPadding(Interface.getY(24), Interface.getY(24), Interface.getY(24), Interface.getY(24));
};

SolidButtonFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof SolidButtonFragment)) {
		json = instanceOrJson;
		instanceOrJson = new SolidButtonFragment();
	}
	return ThinButtonFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("solidButton", SolidButtonFragment);
