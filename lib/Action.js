/*
                  _   _             
        /\       | | (_)            
       /  \   ___| |_ _  ___  _ __  
      / /\ \ / __| __| |/ _ \| '_ \ 
     / ____ \ (__| |_| | (_) | | | |
    /_/    \_\___|\__|_|\___/|_| |_|
                                    
                                    
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
	dependencies: ["Retention:3"]
});

IMPORT("Retention:3");

/**
 * Allows you to create timers that will constantly
 * check the conditions for subsequent execution.
 * @param {function} params action
 * @param {object} params parameters
 * @param {string} params instance id
 * @param {number} params tick time
 */
let Action = function(params) {
	let count = Action.instances.push(this);
	let initializeAction = undefined;
	this.id = "action" + count;

	this.setOnInitializationListener = function(action) {
		action && (initializeAction = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};

	this.destroy = function() {
		if (this.thread) {
			this.thread.interrupt();
		}
		delete this.thread;
		this.isActive = false;
		this.tick = this.real = 0;
		Action.instances.splice(count - 1, 1);
		this.__destroy && this.__destroy(this);
	};

	if (params) {
		if (typeof params == "function") {
			this.setAction(params);
		} else if (typeof params == "object") {
			this.applyParams(params);
		} else if (typeof params == "string") {
			let action = Action.findActionById(params);
			if (action != null) {
				return action;
			}
			this.id = params;
		} else if (typeof params == "number") {
			this.setTickTime(params);
		} else throw Error("Action can't be created with invalid type of params");
	}
	if (initializeAction) {
		initializeAction(this);
	}
};

Action.prototype.isActive = false;
Action.prototype.sleep = 50;
Action.prototype.await = 1;

Action.prototype.applyParams = function(params) {
	for (let item in params) {
		let param = params[item];
		switch (item) {
			case "hooks":
			case "actions":
			case "listeners":
				param.onInit && this.setOnInitializationListener(param.onInit);
				param.onExecute && this.setOnExecuteListener(param.onExecute);
				param.onCancel && this.setOnCancelListener(param.onFinish);
				param.onPause && this.setOnPauseListener(param.onPause);
				param.onDestroy && this.setOnDestroyListener(param.onDestroy);
				param.onComplete && this.setAction(param.onComplete);
				break;
			case "action":
			case "complete":
				this.setAction(param);
				break;
			case "condition":
				this.setCondition(param);
				break;
			case "cancel":
				this.setOnCancelListener(param);
				break;
			case "tick":
				this.setTickTime(param);
				break;
			case "await":
			case "sleep":
				this.setAwait(param);
				break;
		}
	}
};

Action.prototype.setAction = function(action) {
	action && (this.__action = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Action.prototype.setCondition = function(action) {
	action && (this.__condition = function(scope) {
		try { return action(scope); }
		catch (e) { reportError(e); }
		return false;
	});
};

Action.prototype.setAwait = function(time) {
	this.await = time;
};

Action.prototype.getAwait = function() {
	return this.await;
};

Action.prototype.setRealAwait = function(ms) {
	this.await = ms / this.sleep;
};

Action.prototype.getRealAwait = function() {
	return this.await * this.sleep;
};

Action.prototype.setCurrentTick = function(tick) {
	this.tick = tick;
};

Action.prototype.getRealTick = function() {
	return this.real;
};

Action.prototype.getLeftTime = function() {
	return this.isActive ? this.getRealAwait() - this.getRealTick() : 0;
};

Action.prototype.create = function() {
	let scope = this;
	if (this.thread) {
		return;
	}
	this.tick = this.real = 0;
	this.thread = new java.lang.Thread(function() {
		while (scope && scope.thread && scope.sleep > 0) {
			try {
				if (scope.thread.isInterrupted()) {
					return;
				}
				if (scope.isActive) {
					if (scope.tick == 0) {
						Ui.sleepMilliseconds(scope.sleep);
					}
					scope.tick++;
					scope.real += scope.sleep;
					if (scope.tick >= scope.await && scope.await >= 0) {
						scope.complete();
					} else if (scope.__condition && scope.__condition(scope)) {
						if (!scope.thread.isInterrupted()) {
							Ui.sleepMilliseconds(scope.sleep);
						} else return;
					} else scope.cancel();
				} else if (!scope.thread.isInterrupted()) {
					Ui.sleepMilliseconds(1);
				}
			} catch (e) {
				if (e.message == "java.lang.InterruptedException: null") {
					break;
				} else if (e.message == "Cannot call method \"isInterrupted\" of undefined") {
					break;
				}
				reportError(e);
			}
		}
		scope.destroy();
	});
	this.thread.start();
	this.__create && this.__create(this);
	return this;
};

Action.prototype.execute = function() {
	Logger.Log("Executing " + this.id, "Action");
	this.isActive = true;
	this.tick = this.real = 0;
	this.__execute && this.__execute(this);
};

Action.prototype.setTickTime = function(time) {
	if (typeof time == "number") {
		this.sleep = time;
	}
};

Action.prototype.pause = function(time) {
	let scope = this;
	this.isActive = false;
	time && handle(function() {
		scope.isActive = true;
	}, time);
	this.__pause && this.__pause(this);
};

Action.prototype.cancel = function() {
	Logger.Log("Cancelling " + this.id, "Action");
	this.isActive = false;
	this.__cancel && this.__cancel(this);
	this.tick = this.real = 0;
};

Action.prototype.complete = function() {
	Logger.Log("Completing " + this.id, "Action");
	this.isActive = false;
	this.__action && this.__action(this);
	this.tick = this.real = 0;
};

Action.prototype.setOnExecuteListener = function(action) {
	action && (this.__execute = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Action.prototype.setOnPauseListener = function(action) {
	action && (this.__pause = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Action.prototype.setOnCancelListener = function(action) {
	action && (this.__cancel = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Action.prototype.setOnDestroyListener = function(action) {
	action && (this.__destroy = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Action.prototype.setOnCreateListener = function(action) {
	action && (this.__create = function(scope) {
		try { action(scope); }
		catch (e) { reportError(e); }
	});
};

Action.instances = new Array();

Action.prepare = function() {
	Action.instances.forEach(function(action) {
		action.sleep > 0 && action.create();
	});
};

Action.findActionById = function(id) {
	let instances = Action.instances;
	for (let i = 0; i < instances.length; i++) {
		if (instances[i].id == id) {
			return instances[i];
		}
	}
	return null;
};

Action.destroy = function() {
	Action.instances.forEach(function(action) {
		action.thread && action.destroy();
	});
};

/**
 * Delays the action in the interface thread for
 * the required time with the specified condition.
 * @param {function|Object} action action or params
 * @param {object} [action] parameters
 * @param {function} [condition] condition
 * @param {number} [time] waiting
 * @returns {object} special event
 */
Action.handle = function(action, condition, time) {
	let custom = new Action();
	if (typeof action != "object") {
		action && custom.setAction(action);
		condition && custom.setCondition(condition);
		time >= 0 && custom.setRealAwait(time);
	} else custom.applyParams(action);
	custom.create().execute();
	return custom;
};

EXPORT("Action", Action);
EXPORT("handleAction", Action.handle);
