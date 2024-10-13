/**
 * @type
 */
const Worker = function() {
	this.data = {
		type: "unknown"
	};
};

Worker.prototype.getProject = function() {
	return this.data;
};

Worker.prototype.loadProject = function(what) {
	Logger.Log("Modding Tools: Loading project...", "INFO");
	Logger.Log("Modding Tools: " + stringifyJson(what), "INFO");
	this.data = what;
};
