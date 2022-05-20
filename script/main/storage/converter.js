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
	return tryout.call(this, function() {
		if (this.TYPE === undefined) {
			MCSystem.throwException("Impossible resolve project type for ScriptConverter");
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
	}, function(throwable) {
		this.throwable = throwable;
	}, ScriptConverter.State.UNKNOWN);
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
	return tryout.call(this, function() {
		if (!this.getThread()) {
			return false;
		}
		while (this.inProcess()) {
			java.lang.Thread.yield();
		}
		return this.isConverted();
	}, false);
};

ScriptConverter.prototype.getThread = function() {
	return this.thread || null;
};

ScriptConverter.prototype.execute = function() {
	tryout.call(this, function() {
		if (typeof this.process != "function") {
			MCSystem.throwException("Impossible find process for ScriptConverter");
		}
		if (!this.isValid() || this.inProcess()) {
			Logger.Log("ScriptConverter not validated required object", "WARNING");
			return;
		}
		if (this.isAttached()) {
			let attached = this.getAttached();
			this.result = this.process(attached);
			this.state = ScriptConverter.State.VALID;
		} else {
			this.state = ScriptConverter.State.NOT_ATTACHED;
		}
	}, function(throwable) {
		this.throwable = throwable;
		this.state = ScriptConverter.State.THROWED;
	});
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

ScriptConverter.prototype.getReadedCount = function() {
	let readed = this.getCurrentlyReaded();
	return readed ? readed.length : -1;
};

ScriptConverter.prototype.getResult = function() {
	let readed = this.getCurrentlyReaded();
	return readed ? readed.join("\n\n") : null;
};

ScriptConverter.prototype.hasResult = function() {
	return this.isConverted() && this.getCurrentlyReaded() !== null;
};

ScriptConverter.prototype.resolvePrefix = function(suffix, obj, i) {
	return obj.length <= 1 ? suffix : suffix + (i + 1);
};
