/*

   Copyright 2021-2023 Nernar (github.com/nernar)

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
    name: "Sequence",
    version: 1,
    api: "AdaptedScript",
    shared: true
});
IMPORT("Retention:1");
identifier = 0;
/**
 * @constructor
 * Sequences separately runs processing with interface
 * threads to do hard work without interruptions, progress
 * it and inherit configurable lifecycle for manipulations.
 * @param {Sequence | function} [obj] merges with prototype or replaces {@link process}
 */
function Sequence(obj) {
    if (obj != null) {
        if (typeof obj == "object") {
            for (var element in obj) {
                this[element] = obj[element];
            }
        }
        else if (typeof obj == "function") {
            this.process = obj;
        }
    }
    this.id = "sequence" + (identifier++);
}
/**
 * @returns {Nullable<java.lang.Thread>} executing thread if sequence running
 */
Sequence.prototype.getThread = function () {
    return this.thread !== undefined ? this.thread : null;
};
/**
 * @param {number} [milliseconds] milliseconds between {@link sync} calls
 */
Sequence.prototype.setSynchronizeTime = function (milliseconds) {
    if (milliseconds !== undefined && milliseconds !== NaN) {
        this.between = milliseconds - 0;
    }
    else {
        delete this.between;
    }
};
/**
 * @default 50
 * @returns {number} milliseconds between {@link sync} calls
 */
Sequence.prototype.getSynchronizeTime = function () {
    return this.between !== undefined ? this.between : 50;
};
/**
 * @param {number} [priority] thread executing priority
 */
Sequence.prototype.setPriority = function (priority) {
    if (priority !== undefined && priority !== NaN) {
        this.priority = priority - 0;
    }
    else {
        delete this.priority;
    }
    var thread = this.getThread();
    thread && thread.setPriority(this.getPriority());
};
/**
 * @default 8
 * @returns {number} thread executing priority
 */
Sequence.prototype.getPriority = function () {
    return this.priority !== undefined ? this.priority : 8;
};
/**
 * @param {number} [count] requested count before sequence completed
 */
Sequence.prototype.setFixedCount = function (count) {
    if (count !== undefined && count !== NaN) {
        this.count = count - 0;
    }
    else {
        delete this.count;
    }
};
/**
 * @default 1
 * @returns {number} requested count before sequence completed
 */
Sequence.prototype.getFixedCount = function () {
    return this.count !== undefined ? this.count : 1;
};
/**
 * @param {boolean} [enabled] errors (without interruption) should be reported with Retention
 */
Sequence.prototype.setReportingEnabled = function (enabled) {
    if (this.reporting !== undefined) {
        this.reporting = !!enabled;
    }
    else {
        delete this.reporting;
    }
};
/**
 * @returns {boolean} errors (without interruption) should be reported with Retention
 */
Sequence.prototype.isReportingEnabled = function () {
    return this.reporting !== undefined ? this.reporting : eval("this").reportError !== undefined;
};
/**
 * Requires {@link update} calling and optionally sets progress.
 * @param {number | undefined} [index] offset to be set
 * @param {number | undefined} [count] requested count to be set
 */
Sequence.prototype.require = function (index, count) {
    if (index !== undefined && index !== NaN) {
        this.index = index;
    }
    if (count !== undefined && count !== NaN) {
        this.count = count;
    }
    this.updated = true;
};
/**
 * Requires {@link update} calling and optionally applicates progress.
 * @param {number | undefined} [count] requested count to be applicate
 * @param {number | undefined} [index] offset to be applicate
 */
Sequence.prototype.shrink = function (count, index) {
    if (count !== undefined) {
        if (this.count === undefined) {
            this.count = 0;
        }
        this.count += count;
    }
    if (index !== undefined) {
        if (this.index === undefined) {
            this.index = 0;
        }
        this.index += index;
    }
    this.updated = true;
};
/**
 * @protected
 * @param {*} value argument passed to {@link execute}
 * @param {number} active milliseconds of sequence beggining
 */
Sequence.prototype.create = /** @type {(value, active) => void} */ (undefined);
/**
 * @protected
 * @param {number} progress percent or {@link index} if count is not set
 * @param {number} index zero-based offset of requested count
 */
Sequence.prototype.update = /** @type {(progress, index) => void} */ (undefined);
/**
 * @protected
 * @param {number} index zero-based offset of requested count
 * @param {number} ellapsed milliseconds from sequence beginning
 * @param {number} active milliseconds of sequence beggining
 */
Sequence.prototype.tick = /** @type {(index, ellapsed, active) => void} */ (undefined);
/**
 * @protected
 * @param {*} error cause of interruption, might be error or anything throwed
 * @param {number} active milliseconds of sequence beggining
 */
Sequence.prototype.cancel = /** @type {(error, active) => void} */ (undefined);
/**
 * @protected
 * @param {number} ellapsed milliseconds from sequence beginning
 * @param {number} active milliseconds of sequence beggining
 */
Sequence.prototype.complete = /** @type {(ellapsed, active) => void} */ (undefined);
/**
 * @protected
 * @async Running in background thread, cannot access interface.
 * @param {*} value argument passed to {@link execute}
 * @returns requested count to be set before processing
 */
Sequence.prototype.uncount = /** @type {(value) => number} */ (undefined);
/**
 * @protected
 * Interface ticking watcher, which waits until pending processes
 * performs in running thread and updates interface separately.
 * - {@link update} will be called when index or requested count changed
 * - {@link tick} might do anything else with interface if necessary
 * @param {number} active milliseconds of sequence beggining
 * @remarks
 * Recommended to inherit associative methods, not {@link sync} itself.
 */
Sequence.prototype.sync = function (active) {
    handle.call(this, function () {
        if (this.updated === true) {
            this.update && this.update.call(this, this.count === undefined ?
                this.index : this.index / this.count * 100, this.index);
            delete this.updated;
        }
        this.tick && this.tick.call(this, this.index, Date.now() - active, active);
        if (this.completed === undefined) {
            this.sync && this.sync.call(this, active);
        }
        else {
            if (this.isAlright()) {
                this.complete && this.complete.call(this, Date.now() - active, active);
            }
            else {
                this.cancel && this.cancel.call(this, this.exception, active);
            }
            delete this.completed;
            delete this.index;
            delete this.count;
            delete this.thread;
        }
    }, this.getSynchronizeTime());
};
/**
 * Executes sequence, running lifecycle of thread to processing:
 * - {@link create} will be runned firstly to prepare interface
 * - {@link sync} recursively updates progress in interface
 * - {@link uncount} sets requested count for processing
 * - {@link next} determines next iterable value to be processed
 * - {@link process} performs required manipulations with value
 * - {@link complete} or {@link cancel} finishes lifecycle of sequence
 * @param {*} [value] value to be passed into processing functions
 * @throws Sequence might not be already running.
 */
Sequence.prototype.execute = function (value) {
    if (this.thread !== undefined) {
        MCSystem.throwException("Sequence: Sequence (id=" + this.id + ") is already running");
    }
    this.thread = handleThread.call(this, function () {
        try {
            var active_1 = Date.now(), next = void 0;
            while (this.completed !== undefined) {
                java.lang.Thread.yield();
            }
            delete this.exception;
            var result = acquire.call(this, function () {
                this.index = 0;
                try {
                    this.create && this.create.call(this, value, active_1);
                }
                catch (e) {
                    return e;
                }
                this.sync && this.sync.call(this, active_1);
            });
            if (result !== undefined) {
                throw result;
            }
            if (this.uncount !== undefined) {
                this.count = this.uncount.call(this, value);
            }
            while ((next = this.next.call(this, value, this.index)) !== undefined) {
                if (this.isInterrupted()) {
                    java.lang.Thread.yield();
                }
                this.index = this.process.call(this, next, value, this.index);
                if (this.isInterrupted()) {
                    java.lang.Thread.yield();
                }
                this.updated = true;
            }
            this.completed = true;
        }
        catch (e) {
            this.completed = false;
            this.exception = e;
        }
    }, this.getPriority());
};
/**
 * @protected
 * Accessor to iterable values, called before next element
 * to resolve each {@link process} object to be executed.
 * @async Running in background thread, cannot access interface.
 * @param {*} value argument passed to {@link execute}
 * @param {number} index zero-based offset of requested count
 * @returns {*} value to be passed into {@link process}, basically {@link index}
 */
Sequence.prototype.next = function (value, index) {
    if (typeof index != "number" || index === NaN || index >= this.getFixedCount()) {
        return;
    }
    return ++index;
};
/**
 * @protected
 * @abstract
 * Process of running thread, each {@link next} value
 * will be passed (basically index of element).
 * @async Running in background thread, cannot access interface.
 * @param {*} element result of just runned {@link next}
 * @param {*} value argument passed to {@link execute}
 * @param {number} index offset of requested count, progress
 * @returns {number | undefined} index to be set or undefined to complete
 */
Sequence.prototype.process = function (element, value, index) {
    MCSystem.throwException("Sequence: Sequence.process must be implemented");
};
/**
 * @protected
 * Cancelling thread when process interrupted,
 * errors will be reported if something throwed.
 * @param {*} [error] anything to report or undefined
 */
Sequence.prototype.cancel = function (error) {
    if (error != null && (typeof error != "object" || error.message != "java.lang.InterruptedException: null")) {
        if (this.isReportingEnabled()) {
            reportError(error);
        }
    }
};
/**
 * Interrupts running thread, sequence will be
 * cancelled after {@link process} completed.
 */
Sequence.prototype.interrupt = function () {
    if (!this.isInterrupted()) {
        var thread = this.getThread();
        thread && thread.interrupt();
    }
};
/**
 * @returns {boolean} thread is interrupted, sequence cancelled
 */
Sequence.prototype.isInterrupted = function () {
    var thread = this.getThread();
    return thread != null && thread.isInterrupted();
};
/**
 * @returns {boolean} sequence completed successfully, not cancelled or interrupted
 */
Sequence.prototype.isAlright = function () {
    return this.exception === undefined;
};
/**
 * Locks running thread or {@link thread} until
 * sequence is completed, interrupted or cancelled.
 * @param {java.lang.Thread} [thread] thread to yield in
 * @returns {boolean} sequence is successfully completed or not
 */
Sequence.prototype.assureYield = function (thread) {
    if (this.thread === undefined) {
        return false;
    }
    while (this.thread !== undefined) {
        if (thread === undefined) {
            java.lang.Thread.yield();
        }
        else {
            thread.yield();
        }
    }
    return this.isAlright();
};
EXPORT("Sequence", Sequence);
