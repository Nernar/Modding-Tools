const Worker = function() {
	this.data = {
		type: "unknown"
	};
	this.getProject = function() {
		return this.data;
	};
	this.loadProject = function(what) {
		this.data = what;
	};
};
