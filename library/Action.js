/*

   Copyright 2019-2023 Nernar (github.com/nernar)

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
    shared: true
});
IMPORT("Retention:1");
/**
 * @constructor
 * Allows you to create timers that will constantly
 * check the conditions for subsequent execution.
 * @param {object|number} [obj] merges with prototype or tick
 * @param {bool} [verbose] log actions that will be done
 */
Action = (function () {
    var identifier = 0;
    return function (obj, verbose) {
        if (typeof obj == "number") {
            this.setTickTime(obj);
        }
        else if (obj !== undefined) {
            for (var element in obj) {
                this[element] = obj[element];
            }
        }
        this.id = "action" + (identifier++);
        this.logging = verbose !== false;
    };
})();
Action.prototype.getThread = function () {
    return this.thread !== undefined ? this.thread : null;
};
Action.prototype.getPriority = function () {
    return this.priority !== undefined ? this.priority : 1;
};
Action.prototype.setPriority = function (priority) {
    this.priority = priority - 0;
    var thread = this.getThread();
    thread && thread.setPriority(this.getPriority());
};
Action.prototype.mayCancelled = function () {
    return this.cancelable !== undefined ? this.cancelable : true;
};
Action.prototype.setIsMayCancelled = function (cancelable) {
    this.cancelable = !!cancelable;
};
Action.prototype.setAwait = function (time) {
    this.left = time - 0;
};
Action.prototype.makeInfinity = function () {
    this.setAwait(-1);
};
Action.prototype.getAwait = function () {
    return this.left !== undefined ? this.left : 1;
};
Action.prototype.setRealAwait = function (ms) {
    this.left = (ms - 0) / this.getTickTime();
};
Action.prototype.getRealAwait = function () {
    return this.getAwait() * this.getTickTime();
};
Action.prototype.setTickTime = function (time) {
    this.sleep = time - 0;
};
Action.prototype.getTickTime = function () {
    return this.sleep !== undefined ? this.sleep : 50;
};
Action.prototype.setCurrentTick = function (count) {
    this.count = count - 0;
};
Action.prototype.getCurrentTick = function () {
    return this.count;
};
Action.prototype.getRealTick = function () {
    return this.real;
};
Action.prototype.getLeftTime = function () {
    return this.isActive() ? this.getRealAwait() - this.getRealTick() : 0;
};
Action.prototype.isActive = function () {
    return this.active !== undefined ? this.active : false;
};
Action.prototype.setReportingEnabled = function (enabled) {
    this.reporting = !!enabled;
};
Action.prototype.isReportingEnabled = function () {
    return this.reporting !== undefined ? this.reporting : true;
};
Action.prototype.setAction = function (action) {
    if (action === undefined || action === null) {
        return delete this.action;
    }
    this.action = action;
    return true;
};
Action.prototype.setCondition = function (action) {
    if (action === undefined || action === null) {
        return delete this.onCondition;
    }
    this.onCondition = action;
    return true;
};
Action.prototype.create = function () {
    if (this.thread !== undefined) {
        MCSystem.throwException("Action: Action (id=" + this.id + ") is already running");
    }
    this.count = this.real = 0;
    var action = this;
    this.thread = handleThread(function () {
        try {
            while (action.thread !== undefined) {
                if (action.isInterrupted()) {
                    break;
                }
                if (action.isActive()) {
                    var currently = action.getCurrentTick();
                    if (currently == 0) {
                        java.lang.Thread.sleep(action.getTickTime());
                    }
                    var next = action.tick(currently);
                    action.setCurrentTick(next);
                    action.real += action.getTickTime();
                    var left = action.getAwait();
                    if (left >= 0 && next >= left) {
                        action.complete();
                    }
                    else if (!action.isInterrupted()) {
                        if (action.condition(next)) {
                            java.lang.Thread.sleep(action.getTickTime());
                        }
                        else
                            break;
                    }
                    else if (action.mayCancelled()) {
                        action.cancel();
                    }
                }
                else {
                    java.lang.Thread.yield();
                }
            }
        }
        catch (e) {
            if (e == null) {
                return;
            }
            if (e.message == "java.lang.InterruptedException: null") {
                return;
            }
            if (action.isReportingEnabled()) {
                reportError(e);
            }
            else {
                Logger.Log("Action: " + e, "ERROR");
            }
        }
        action.destroy();
    }, this.getPriority());
    this.onCreate && this.onCreate.call(this);
};
Action.prototype.condition = function (currently) {
    try {
        if (this.onCondition !== undefined) {
            return this.onCondition(this, currently, this.getAwait());
        }
        return true;
    }
    catch (e) {
        if (this.logging) {
            Logger.Log("Action: Condition in action (id=" + this.id + ") experienced some troubles", "WARNING");
            Logger.Log("Action: " + e, "WARNING");
        }
    }
    return false;
};
Action.prototype.tick = function (currently) {
    try {
        if (this.onTick !== undefined) {
            return this.onTick.call(this, currently);
        }
    }
    catch (e) {
        if (this.logging) {
            Logger.Log("Action: Tick in action (id=" + this.id + ") experienced some troubles", "WARNING");
            Logger.Log("Action: " + e, "WARNING");
        }
    }
    return ++currently;
};
Action.prototype.run = function () {
    if (this.thread === undefined || this.thread === null) {
        this.create();
    }
    else {
        this.count = this.real = 0;
    }
    this.active = true;
    if (this.logging) {
        log("Action: Action (id=" + this.id + ") started at " + getTime() + " ms");
    }
    this.onRun && this.onRun.call(this);
};
Action.prototype.complete = function () {
    if (this.thread === undefined || this.active === undefined) {
        return;
    }
    delete this.active;
    if (this.logging) {
        log("Action: Action (id=" + this.id + ") completed as " + this.real + " ms");
    }
    this.action && this.action.call(this, this.real, this.count);
    this.count = this.real = 0;
};
Action.prototype.pause = function (time) {
    if (this.thread === undefined || this.active === undefined) {
        return;
    }
    delete this.active;
    var action = this;
    time && handle(function () {
        action.active = true;
    }, time);
    this.onPause && this.onPause.call(this);
};
Action.prototype.cancel = function () {
    if (this.thread === undefined || this.active === undefined) {
        return;
    }
    delete this.active;
    if (this.logging) {
        log("Action: Action (id=" + this.id + ") cancelled at " + this.real + " ms");
    }
    this.onCancel && this.onCancel.call(this);
    this.count = this.real = 0;
};
Action.prototype.destroy = function () {
    if (this.thread === undefined) {
        return;
    }
    delete this.active;
    this.interrupt();
    delete this.thread;
    this.count = this.real = 0;
    this.onDestroy && this.onDestroy.call(this);
};
Action.prototype.setOnCreateListener = function (action) {
    if (action === undefined || action === null) {
        return delete this.onCreate;
    }
    this.onCreate = action;
    return true;
};
Action.prototype.setOnRunListener = function (action) {
    if (action === undefined || action === null) {
        return delete this.onRun;
    }
    this.onRun = action;
    return true;
};
Action.prototype.setOnTickListener = function (action) {
    if (action === undefined || action === null) {
        return delete this.onTick;
    }
    this.onTick = action;
    return true;
};
Action.prototype.setOnPauseListener = function (action) {
    if (action === undefined || action === null) {
        return delete this.onPause;
    }
    this.onPause = action;
    return true;
};
Action.prototype.setOnCancelListener = function (action) {
    if (action === undefined || action === null) {
        return delete this.onCancel;
    }
    this.onCancel = action;
    return true;
};
Action.prototype.setOnDestroyListener = function (action) {
    if (action === undefined || action === null) {
        return delete this.onDestroy;
    }
    this.onDestroy = action;
    return true;
};
Action.prototype.interrupt = function () {
    if (!this.isInterrupted()) {
        var thread = this.getThread();
        thread && thread.interrupt();
    }
};
Action.prototype.isInterrupted = function () {
    var thread = this.getThread();
    return thread != null && thread.isInterrupted();
};
Action.prototype.assureYield = function (thread) {
    if (this.thread === undefined) {
        return false;
    }
    while (this.thread !== undefined) {
        if (thread === undefined) {
            java.lang.Thread.yield();
        }
        else
            thread.yield();
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
handleAction = function (action, condition, time) {
    var custom = new Action();
    action && custom.setAction(action);
    condition && custom.setCondition(condition);
    time >= 0 && custom.setRealAwait(time);
    custom.run();
    return custom;
};
EXPORT("handleAction", handleAction);
