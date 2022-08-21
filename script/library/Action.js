/*
BUILD INFO:
  dir: Action
  target: out/Action.js
  files: 2
*/



// file: header.js

/*

   Copyright 2019-2022 Nernar (github.com/nernar)

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
	version: 1,
	api: "AdaptedScript",
	dependencies: ["Retention:1"],
	shared: true
});

IMPORT("Retention:1");




// file: integration.js

/**
 * Allows you to create timers that will constantly
 * check the conditions for subsequent execution.
 * @param {object|number} [obj] merges with prototype or tick time
 */
Action = (function() {
	let identifier = 0;
	return function(obj) {
		if (typeof obj == "number") {
			this.setTickTime(obj);
		} else if (obj !== undefined) {
			for (let element in obj) {
				this[element] = obj[element];
			}
		}
		this.id = "action" + (identifier++);
	};
})();

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
	this.left = Number(time);
};

Action.prototype.makeInfinity = function() {
	this.setAwait(-1);
};

Action.prototype.getAwait = function() {
	return this.left !== undefined ? this.left : 1;
};

Action.prototype.setRealAwait = function(ms) {
	this.left = Number(ms) / this.getTickTime();
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
	this.action = action;
	return true;
};

Action.prototype.setCondition = function(action) {
	if (action === undefined || action === null) {
		return delete this.onCondition;
	}
	this.onCondition = action;
	return true;
};

Action.prototype.create = function() {
	if (this.thread !== undefined && this.thread !== null) {
		MCSystem.throwException("Action: Action (id=" + this.id + ") is already called create()");
	}
	this.count = this.real = 0;
	this.thread = handleThread.call(this, function() {
		try {
			while (this.thread !== undefined && this.thread !== null) {
				if (this.isInterrupted()) {
					break;
				}
				if (this.isActive()) {
					let currently = this.getCurrentTick();
					if (currently == 0) {
						java.lang.Thread.sleep(this.getTickTime());
					}
					let next = this.tick(currently);
					this.setCurrentTick(next);
					this.real += this.getTickTime();
					let left = this.getAwait();
					if (left >= 0 && next >= left) {
						this.complete();
					} else if (!this.isInterrupted()) {
						if (this.condition(next)) {
							java.lang.Thread.sleep(this.getTickTime());
						} else break;
					} else if (this.mayCancelled()) {
						this.cancel();
					}
				} else if (!this.isInterrupted()) {
					java.lang.Thread.yield();
				}
			}
		} catch (e) {
			if (e == null) {
				return;
			}
			if (e.message == "java.lang.InterruptedException: null" ||
					e.message == "Cannot call method \"isInterrupted\" of undefined") {
				return;
			}
			reportError(e);
		}
		this.destroy();
	}, this.getPriority());
	this.onCreate && this.onCreate(this);
	return this;
};

Action.prototype.condition = function(currently) {
	try {
		if (this.onCondition !== undefined) {
			return this.onCondition(this, currently, this.getAwait());
		}
		return true;
	} catch (e) {
		Logger.Log("Action: Condition in action (id=" + this.id + ") experienced some troubles", "WARNING");
	}
	return false;
};

Action.prototype.tick = function(currently) {
	try {
		if (this.onTick !== undefined) {
			return this.onTick(this, currently);
		}
	} catch (e) {
		Logger.Log("Action: Tick in action (id=" + this.id + ") experienced some troubles", "WARNING");
	}
	return ++currently;
};

Action.prototype.run = function() {
	if (this.thread === undefined || this.thread === null) {
		this.create();
	} else {
		this.count = this.real = 0;
	}
	this.active = true;
	log("Action: Action (id=" + this.id + ") started at " + getTime() + " ms");
	this.onRun && this.onRun(this);
};

Action.prototype.complete = function() {
	delete this.active;
	log("Action: Action (id=" + this.id + ") completed as " + this.real + " ms");
	this.action && this.action(this, this.real, this.count);
	this.count = this.real = 0;
};

Action.prototype.pause = function(time) {
	delete this.active;
	time && handle.call(this, function() {
		this.active = true;
	}, time);
	this.onPause && this.onPause(this);
};

Action.prototype.cancel = function() {
	delete this.active;
	log("Action: Action (id=" + this.id + ") cancelled at " + this.real + " ms");
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
	this.onCreate = action;
	return true;
};

Action.prototype.setOnRunListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onRun;
	}
	this.onRun = action;
	return true;
};

Action.prototype.setOnTickListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onTick;
	}
	this.onTick = action;
	return true;
};

Action.prototype.setOnPauseListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onPause;
	}
	this.onPause = action;
	return true;
};

Action.prototype.setOnCancelListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onCancel;
	}
	this.onCancel = action;
	return true;
};

Action.prototype.setOnDestroyListener = function(action) {
	if (action === undefined || action === null) {
		return delete this.onDestroy;
	}
	this.onDestroy = action;
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
	if (this.thread === undefined || this.thread === null) {
		return false;
	}
	while (this.getThread() !== null) {
		if (thread === undefined) {
			java.lang.Thread.yield();
		} else thread.yield();
	}
	return true;
};

EXPORT("Action", Action);

/**
 * Delays the action in the interface thread for
 * the required time with the specified condition.
 * @param {function|object} action action or prototype
 * @param {function} [condition] condition
 * @param {number} [time] tick waiting
 * @returns {Action} special event
 */
handleAction = function(action, condition, time) {
	let custom = new Action();
	action && custom.setAction(action);
	condition && custom.setCondition(condition);
	time >= 0 && custom.setRealAwait(time);
	custom.create().run();
	return custom;
};

EXPORT("handleAction", handleAction);




