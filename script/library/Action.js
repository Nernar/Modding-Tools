/*

   Copyright 2019-2021 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

LIBRARY({
	name: "Action",
	version: 4,
	shared: true,
	api: "AdaptedScript",
	dependencies: ["Retention:5"]
});

IMPORT("Retention:5");

/**
 * Allows you to create timers that will constantly
 * check the conditions for subsequent execution.
 * @param {object|number} [obj] merges with prototype or tick time
 */
let Action = function(obj) {
	if (typeof obj == "number") {
		this.setTickTime(obj);
	} else if (obj !== undefined) {
		for (let element in obj) {
			this[element] = obj[element];
		}
	}
	let count = Action.instances++;
	this.id = "action" + count;
};

Action.prototype.getThread = function() {
	return this.thread !== undefined ? this.thread : null;
};

Action.prototype.getPriority = function() {
	return this.priority !== undefined ? this.priority : 1;
};

Action.prototype.setPriority = function(priority) {
	this.priority = Number(priority);
	let thread = this.getThread();
	thread && thread.setPriority(this.getPriority());
};

Action.prototype.mayCancelled = function() {
	return this.cancelable !== undefined ? this.cancelable : true;
};

Action.prototype.setIsMayCancelled = function(cancelable) {
	this.cancelable = Boolean(cancelable);
};

Action.prototype.setAwait = function(time) {
	this.await = Number(time);
};

Action.prototype.makeInfinity = function() {
	this.setAwait(-1);
};

Action.prototype.getAwait = function() {
	return this.await !== undefined ? this.await : 1;
};

Action.prototype.setRealAwait = function(ms) {
	this.await = Number(ms) / this.getTickTime();
};

Action.prototype.getRealAwait = function() {
	return this.getAwait() * this.getTickTime();
};

Action.prototype.setTickTime = function(time) {
	this.sleep = Number(time);
};

Action.prototype.getTickTime = function() {
	return this.sleep !== undefined ? this.sleep : 50;
};

Action.prototype.setCurrentTick = function(count) {
	this.count = Number(count);
};

Action.prototype.getCurrentTick = function() {
	return this.count;
};

Action.prototype.getRealTick = function() {
	return this.real;
};

Action.prototype.getLeftTime = function() {
	return this.isActive() ? this.getRealAwait() - this.getRealTick() : 0;
};

Action.prototype.isActive = function() {
	return this.active !== undefined ? this.active : false;
};

Action.prototype.setAction = function(action) {
	if (action === undefined || action === null) {
		return delete this.action;
	}
	this.action = function(scope, real, count) {
		tryout(function() {
			action(scope, real, count);
		});
	};
	return true;
};

Action.prototype.setCondition = function(action) {
	if (action === undefined || action === null) {
		return delete this.onCondition;
	}
	this.onCondition = function(scope, count, await) {
		return tryout(function() {
			return action(scope, count, await);
		}, false);
	};
	return true;
};

Action.prototype.create = function() {
	if (this.getThread() !== null) {
		MCSystem.throwException("Action[" + this.id + "] are already created");
	}
	this.count = this.real = 0;
	let action = this;
	this.thread = handleThread(function() {
		tryout(function() {
			while (action.getThread() !== null) {
				if (action.isInterrupted()) {
					break;
				}
				if (action.isActive()) {
					let currently = action.getCurrentTick();
					if (currently == 0) {
						Interface.sleepMilliseconds(action.getTickTime());
					}
					let next = action.tick(currently);
					action.setCurrentTick(next);
					action.real += action.getTickTime();
					let await = action.getAwait();
					if (await >= 0 && next >= await) {
						action.complete();
					} else if (!action.isInterrupted()) {
						if (action.condition(next)) {
							Interface.sleepMilliseconds(action.getTickTime());
						} else break;
					} else if (action.mayCancelled()) {
						action.cancel();
					}
				} else if (!action.isInterrupted()) {
					java.lang.Thread.yield();
				}
			}
		}, function(e) {
			if (e.message == "java.lang.InterruptedException: null") {
				return;
			} else if (e.message == "Cannot call method \"isInterrupted\" of undefined") {
				return;
			}
			reportError(e);
		});
		action.destroy();
	}, this.getPriority());
	this.onCreate && this.onCreate(this);
	return this;
};

Action.prototype.condition = function(currently) {
	return require.call(this, function() {
		if (this.onCondition !== undefined) {
			return this.onCondition(this, currently, this.getAwait());
		}
		return true;
	}, false);
};

Action.prototype.tick = function(currently) {
	return require.call(this, function() {
		if (this.onTick !== undefined) {
			return this.onTick(this, currently);
		}
	}, ++currently);
};

Action.prototype.run = function() {
	if (this.getThread() === null) {
		this.create();
	} else {
		this.count = this.real = 0;
	}
	this.active = true;
	Logger.Log("Action[" + this.id + "] started at " + getTime() + " ms", "DEBUG");
	this.onRun && this.onRun(this);
};

Action.prototype.complete = function() {
	delete this.active;
	Logger.Log("Action[" + this.id + "] completed as " + this.real + " ms", "DEBUG");
	this.action && this.action(this, this.real, this.count);
	this.count = this.real = 0;
};

Action.prototype.pause = function(time) {
	delete this.active;
	let action = this;
	time && handle(function() {
		action.active = true;
	}, time);
	this.onPause && this.onPause(this);
};

Action.prototype.cancel = function() {
	delete this.active;
	Logger.Log("Action[" + this.id + "] cancelled at " + this.real + " ms", "DEBUG");
	this.onCancel && this.onCancel(this);
	this.count = this.real = 0;
};

Action.prototype.destroy = function() {
	delete this.active;
	this.interrupt();
	delete this.thread;
	this.count = this.real = 0;
	this.onDestroy && this.onDestroy(this);
};

Action.prototype.setOnCreateListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onCreate;
	}
	this.onCreate = function(scope) {
		tryout(function() {
			action(scope);
		});
	};
	return true;
};

Action.prototype.setOnRunListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onRun;
	}
	this.onRun = function(scope) {
		tryout(function() {
			action(scope);
		});
	};
	return true;
};

Action.prototype.setOnTickListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onTick;
	}
	this.onTick = function(scope, currently) {
		return tryout(function() {
			return action(scope, currently);
		});
	};
	return true;
};

Action.prototype.setOnPauseListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onPause;
	}
	this.onPause = function(scope) {
		tryout(function() {
			action(scope);
		});
	};
	return true;
};

Action.prototype.setOnCancelListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onCancel;
	}
	this.onCancel = function(scope) {
		tryout(function() {
			action(scope);
		});
	};
	return true;
};

Action.prototype.setOnDestroyListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onDestroy;
	}
	this.onDestroy = function(scope) {
		tryout(function() {
			action(scope);
		});
	};
	return true;
};

Action.prototype.interrupt = function() {
	if (!this.isInterrupted()) {
		let thread = this.getThread();
		thread && thread.interrupt();
	}
};

Action.prototype.isInterrupted = function() {
	let thread = this.getThread();
	return thread && thread.isInterrupted();
};

Action.prototype.assureYield = function(thread) {
	if (this.getThread() === null) {
		return false;
	}
	while (this.getThread() !== null) {
		if (thread === undefined) {
			java.lang.Thread.yield();
		} else thread.yield();
	}
	return true;
};

Action.instances = 0;

EXPORT("Action", Action);

/**
 * Delays the action in the interface thread for
 * the required time with the specified condition.
 * @param {function|object} action action or prototype
 * @param {function} [condition] condition
 * @param {number} [time] tick waiting
 * @returns {Action} special event
 */
let handleAction = function(action, condition, time) {
	let custom = new Action();
	action && custom.setAction(action);
	condition && custom.setCondition(condition);
	time >= 0 && custom.setRealAwait(time);
	custom.create().run();
	return custom;
};

EXPORT("handleAction", handleAction);
