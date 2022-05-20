const whileProcess = function() {
	while (this.index < 10000) {
		if (this.index < 2500) {
			Interface.sleepMilliseconds(125);
			this.index += 75;
		} else if (this.index < 7500) {
			Interface.sleepMilliseconds(random(25, 75));
			this.index += 125;
		} else if (this.index < 10000) {
			Interface.sleepMilliseconds(250);
			this.index += 75;
		}
		this.updated = true;
	}
};

return function() {
	new SnackSequence({
		requiresProgress: true,
		uncount: function() {
			Interface.sleepMilliseconds(1500);
			return 10000;
		},
		process: function() {
			whileProcess.call(this);
			return this.index;
		}
	}).execute();
	new LogotypeSequence({
		count: 10000,
		process: function(index) {
			LogotypeSequence.prototype.process.apply(this, arguments);
			whileProcess.call(this);
			return this.index;
		}
	}).execute();
	handle(function() {
		showHint(translate("Debug & testing"));
	}, 6500);
};
