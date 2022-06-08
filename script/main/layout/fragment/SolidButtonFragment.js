const SolidButtonFragment = function() {
	ThinButtonFragment.apply(this, arguments);
};

SolidButtonFragment.prototype = new ThinButtonFragment;
SolidButtonFragment.prototype.TYPE = "SolidButtonFragment";

SolidButtonFragment.prototype.resetContainer = function() {
	ThinButtonFragment.prototype.resetContainer.apply(this, arguments);
	this.getTextView().setPadding(Interface.getY(24), Interface.getY(32), Interface.getY(24), Interface.getY(32));
};
