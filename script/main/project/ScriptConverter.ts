class ScriptConverter {
	TYPE: string;
	state = ScriptConverter.State.NOT_ATTACHED;
	process?: (obj: Scriptable) => Nullable<string | string[]>;
	attached: Nullable<Scriptable>;
	throwable: Nullable<Error>;
	thread: Nullable<java.lang.Thread>;
	result: Nullable<string | string[]>;
	constructor(type?: string, process?: typeof this.process) {
		if (type !== undefined) {
			this.TYPE = type;
		}
		if (process !== undefined) {
			this.process = process;
		}
	}
	attach(obj: Scriptable) {
		this.state = this.validate(obj);
		this.attached = obj;
	}
	getAttached() {
		return this.attached || null;
	}
	isAttached() {
		return this.getAttached() != null;
	}
	validate(obj: Scriptable) {
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
	}
	getLastException() {
		return this.throwable || null;
	}
	getState() {
		return this.state;
	}
	canConvert() {
		return this.isValid() && this.getAttached() && !this.getThread();
	}
	isValid() {
		return this.getState() >= ScriptConverter.State.PREPARED &&
			this.getState() <= ScriptConverter.State.VALID;
	}
	isConverted() {
		return this.getState() == ScriptConverter.State.VALID;
	}
	inProcess() {
		return this.getState() == ScriptConverter.State.CONVERTING;
	}
	assureYield() {
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
	}
	getThread() {
		return this.thread || null;
	}
	execute() {
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
	}
	executeAsync(post: (converter: ScriptConverter, result: string) => void) {
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
	}
	getCurrentlyReaded() {
		return this.result || null;
	}
	getResult() {
		let readed = this.getCurrentlyReaded();
		return Array.isArray(readed) ? readed.join("\n\n") + "\n"
			: readed != null ? readed + "\n" : null;
	}
	hasResult() {
		return this.isConverted() && this.getCurrentlyReaded() != null;
	}
	resolvePrefix(suffix: string, obj: any[], i: number) {
		return obj.length <= 1 ? suffix : suffix + (i + 1);
	}
	indent(what: Nullable<string>, symbol: string) {
		return what != null ? what.replace(/\n(?=[^\n])/g, "\n" + symbol) : null;
	}
}

namespace ScriptConverter {
	export enum State {
		NOT_ATTACHED = 0,
		PREPARED = 1,
		CONVERTING = 2,
		VALID = 3,
		ILLEGAL = 4,
		BAD_TYPE = 5,
		PARSE_FAILED = 6,
		THROWED = 7,
		UNKNOWN = 8
	}
}
