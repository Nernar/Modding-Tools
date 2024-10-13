/**
 * @type 
 */
const ScriptConverter = function(type, process) {
	if (type !== undefined) {
		this.TYPE = type;
	}
	if (process !== undefined) {
		this.process = process;
	}
};

ScriptConverter.State = {};
ScriptConverter.State.NOT_ATTACHED = 0;
ScriptConverter.State.PREPARED = 1;
ScriptConverter.State.CONVERTING = 2;
ScriptConverter.State.VALID = 3;
ScriptConverter.State.ILLEGAL = 4;
ScriptConverter.State.BAD_TYPE = 5;
ScriptConverter.State.PARSE_FAILED = 6;
ScriptConverter.State.THROWED = 7;
ScriptConverter.State.UNKNOWN = 8;

ScriptConverter.prototype.state = ScriptConverter.State.NOT_ATTACHED;

ScriptConverter.prototype.attach = function(obj) {
	this.state = this.validate(obj);
	this.attached = obj;
};

ScriptConverter.prototype.getAttached = function() {
	return this.attached || null;
};

ScriptConverter.prototype.isAttached = function() {
	return this.getAttached() != null;
};

ScriptConverter.prototype.validate = function(obj) {
	try {
		if (this.TYPE === undefined) {
			MCSystem.throwException("Modding Tools: Cannot resolve project type for ScriptConverter");
		}
		if (obj == null) {
			return ScriptConverter.State.ILLEGAL;
		}
		if (typeof obj != "object") {
			return ScriptConverter.State.PARSE_FAILED;
		}
		if (obj.type != this.TYPE) {
			return ScriptConverter.State.BAD_TYPE;
		}
		return ScriptConverter.State.PREPARED;
	} catch (e) {
		this.throwable = e;
		reportError(e);
	}
	return ScriptConverter.State.UNKNOWN;
};

ScriptConverter.prototype.getLastException = function() {
	return this.throwable || null;
};

ScriptConverter.prototype.getState = function() {
	return this.state;
};

ScriptConverter.prototype.canConvert = function() {
	return this.isValid() && this.getAttached() && !this.getThread();
};

ScriptConverter.prototype.isValid = function() {
	return this.getState() >= ScriptConverter.State.PREPARED &&
		this.getState() <= ScriptConverter.State.VALID;
};

ScriptConverter.prototype.isConverted = function() {
	return this.getState() == ScriptConverter.State.VALID;
};

ScriptConverter.prototype.inProcess = function() {
	return this.getState() == ScriptConverter.State.CONVERTING;
};

ScriptConverter.prototype.assureYield = function() {
	try {
		if (!this.getThread()) {
			return false;
		}
		while (this.inProcess()) {
			java.lang.Thread.yield();
		}
		return this.isConverted();
	} catch (e) {
		log("Modding Tools: ScriptConverter.assureYield: " + e);
	}
	return false;
};

ScriptConverter.prototype.getThread = function() {
	return this.thread || null;
};

ScriptConverter.prototype.execute = function() {
	try {
		if (typeof this.process != "function") {
			MCSystem.throwException("Modding Tools: ScriptConverter.process(what) must be implemented");
		}
		if (!this.isValid() || this.inProcess()) {
			Logger.Log("Modding Tools: ScriptConverter is not validated required object or already processing something", "WARNING");
			return;
		}
		if (this.isAttached()) {
			let attached = this.getAttached();
			this.result = this.process(attached);
			this.state = ScriptConverter.State.VALID;
		} else {
			this.state = ScriptConverter.State.NOT_ATTACHED;
		}
	} catch (e) {
		this.throwable = e;
		this.state = ScriptConverter.State.THROWED;
		reportError(e);
	}
};

ScriptConverter.prototype.executeAsync = function(post) {
	let scope = this;
	this.thread = handleThread(function() {
		if (scope.execute) {
			scope.execute();
		}
		delete scope.thread;
		handle(function() {
			post && post(scope, scope.getResult());
		});
	});
};

ScriptConverter.prototype.getCurrentlyReaded = function() {
	return this.result || null;
};

ScriptConverter.prototype.getResult = function() {
	let readed = this.getCurrentlyReaded();
	return Array.isArray(readed) ? readed.join("\n\n") + "\n"
		: readed != null ? readed + "\n" : null;
};

ScriptConverter.prototype.hasResult = function() {
	return this.isConverted() && this.getCurrentlyReaded() != null;
};

ScriptConverter.prototype.resolvePrefix = function(suffix, obj, i) {
	return obj.length <= 1 ? suffix : suffix + (i + 1);
};

ScriptConverter.prototype.indent = function(what, symbol) {
	return what != null ? what.replace(/\n(?=[^\n])/g, "\n" + symbol) : null;
};
