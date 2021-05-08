let ScriptConverter = new Function();
ScriptConverter.State = new Object();
ScriptConverter.State.NOT_ATTACHED = 0;
ScriptConverter.State.PREPARED = 1;
ScriptConverter.State.CONVERTING = 2;
ScriptConverter.State.VALID = 3;
ScriptConverter.State.ILLEGAL = 4;
ScriptConverter.State.BAD_TYPE = 5;
ScriptConverter.State.PARSE_FAILED = 6;
ScriptConverter.State.THROWED = 7;
ScriptConverter.State.UNKNOWN = 8;

ScriptConverter.prototype.attach = function(obj) {
	this.state = this.validate(obj);
	this.attached = obj;
};
ScriptConverter.prototype.getAttached = function() {
	return this.attached;
};
ScriptConverter.prototype.validate = function(obj) {
	try {
		if (!this.getType) {
			throw new Error("Can't resolve project type for ScriptConverter");
		}
		if (!obj || !this.getType()) {
			return ScriptConverter.State.ILLEGAL;
		}
		if (!(obj instanceof Object)) {
			return ScriptConverter.State.PARSE_FAILED;
		}
		if (obj.type != this.getType()) {
			return ScriptConverter.State.BAD_TYPE;
		}
		return ScriptConverter.State.PREPARED;
	} catch (throwable) {
		this.throwable = throwable;
		return ScriptConverter.State.UNKNOWN;
	}
};
ScriptConverter.prototype.getLastException = function() {
	return this.throwable || null;
};
ScriptConverter.prototype.state = ScriptConverter.State.NOT_ATTACHED;
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
		return false;
	}
};
ScriptConverter.prototype.getThread = function() {
	return this.thread || null;
};
ScriptConverter.prototype.execute = function() {
	try {
		if (!this.process) {
			throw new Error("Can't find process for ScriptConverter");
		}
		if (!this.isValid() || this.inProcess()) {
			return;
		}
		this.result = this.process(this.getAttached());
		this.state = ScriptConverter.State.VALID;
	} catch (throwable) {
		this.throwable = throwable;
		this.state = ScriptConverter.State.THROWED;
	}
};
ScriptConverter.prototype.executeAsync = function(post) {
	let scope = this;
	this.thread = handleThread(function() {
		if (scope.execute) {
			scope.execute();
		}
		delete scope.thread;
		if (post) {
			post(scope.getResult());
		}
	});
};
ScriptConverter.prototype.getCurrentlyReaded = function() {
	return this.result || null;
};
ScriptConverter.prototype.getReadedCount = function() {
	let readed = this.getCurrentlyReaded();
	return readed ? readed.length : -1;
};
ScriptConverter.prototype.getResult = function() {
	let readed = this.getCurrentlyReaded();
	if (!readed) {
		return null;
	}
	return readed.join("\n\n");
};
ScriptConverter.prototype.hasResult = function() {
	return this.getState() == ScriptConverter.State.VALID && this.getCurrentlyReaded();
};
