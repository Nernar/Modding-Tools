/**
 * @type
 */
const Worker = function(what) {
	if (this.data == null || typeof this.data != "object") {
		this.data = {
			type: "unknown"
		};
	}
	if (what !== undefined) {
		this.loadProject(what);
	}
};

Worker.prototype.getProject = function() {
	return this.data;
};

Worker.prototype.loadProject = function(what) {
	Logger.Log("Modding Tools: Loading project...", "INFO");
	Logger.Log("Modding Tools: " + stringifyJson(what), "INFO");
	this.data = what;
};
