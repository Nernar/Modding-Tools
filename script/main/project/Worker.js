function Worker() {
	this.data = {
		type: "unknown"
	};
};

Worker.prototype.getProject = function() {
	return this.data;
};

Worker.prototype.loadProject = function(what) {
	this.data = what;
};
