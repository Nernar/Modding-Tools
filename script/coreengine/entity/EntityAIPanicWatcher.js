var EntityAIPanicWatcher = {};
EntityAIPanicWatcher.parent = null;
EntityAIPanicWatcher.getDefaultPriority = function() {
	return -1;
};
EntityAIPanicWatcher.getDefaultName = function() {
	return "basic-entity-ai";
};
EntityAIPanicWatcher.params = {};
EntityAIPanicWatcher.params.panic_time = 200;
EntityAIPanicWatcher.params.priority_panic = 5;
EntityAIPanicWatcher.params.priority_default = 1;
EntityAIPanicWatcher.params.name = "panic";
EntityAIPanicWatcher.setParams = function(params) {
	return null;
};
EntityAIPanicWatcher.executionStarted = function() {
	return null;
};
EntityAIPanicWatcher.executionEnded = function() {
	return null;
};
EntityAIPanicWatcher.executionPaused = function() {
	return null;
};
EntityAIPanicWatcher.executionResumed = function() {
	return null;
};
EntityAIPanicWatcher.execute = function() {
	return null;
};
EntityAIPanicWatcher.__execute = function() {
	return null;
};
EntityAIPanicWatcher.setExecutionTimer = function(timer) {
	return null;
};
EntityAIPanicWatcher.removeExecutionTimer = function() {
	return null;
};
EntityAIPanicWatcher.data = {};
EntityAIPanicWatcher.data.timer = -1;
EntityAIPanicWatcher.data.executionTimer = -1;
EntityAIPanicWatcher.isInstance = false;
EntityAIPanicWatcher.entity = null;
EntityAIPanicWatcher.instantiate = function(parent, name) {
	return {
		parent: {},
		getDefaultPriority: (function () {return -1;}),
		getDefaultName: (function () {return "basic-entity-ai";}),
		params: {
			panic_time: 200,
			priority_panic: 5,
			priority_default: 1,
			name: "panic"
		},
		setParams: (function (params) {for (var name in params) {this.params[name] = params[name];}}),
		executionStarted: (function () {this.setPriority(this.params.name, this.params.priority_default);}),
		executionEnded: (function () {}),
		executionPaused: (function () {}),
		executionResumed: (function () {}),
		execute: (function () {if (this.data.timer >= 0) {if (--this.data.timer == 0) {this.setPriority(this.params.name, this.params.priority_default);}}}),
		__execute: (function () {this.execute();}),
		setExecutionTimer: (function (timer) {this.data.executionTimer = timer;}),
		removeExecutionTimer: (function () {this.data.executionTimer = -1;}),
		data: {
			timer: -1,
			executionTimer: -1
		},
		isInstance: true,
		instantiate: (function (parent, name) {var instance = ModAPI.cloneObject(this, true);instance.parent = parent;instance.entity = parent.entity;instance.controller = parent.AI;instance.isInstance = true;instance.executionName = name;return instance;}),
		aiEntityChanged: (function (entity) {this.entity = entity;}),
		finishExecution: (function () {if (this.controller) {this.controller.disableAI(this.executionName);}}),
		changeSelfPriority: (function (priority) {if (this.controller) {this.controller.setPriority(this.executionName, priority);}}),
		enableAI: (function (name, priority, extra) {if (this.controller) {this.controller.setPriority(name, priority, extra);}}),
		disableAI: (function (name) {if (this.controller) {this.controller.setPriority(name);}}),
		setPriority: (function (name, priority) {if (this.controller) {this.controller.setPriority(name, priority);}}),
		getAI: (function (name) {if (this.controller) {return this.controller.getAI(name);}}),
		getPriority: (function (name) {if (this.controller) {return this.controller.getPriority(name);}}),
		attackedBy: (function (entity) {}),
		hurtBy: (function () {this.setPriority(this.params.name, this.params.priority_panic);this.data.timer = this.params.panic_time;}),
		projectileHit: (function (projectile) {}),
		death: (function (entity) {}),
		executionName: "test"
	};
};
EntityAIPanicWatcher.aiEntityChanged = function(entity) {
	return null;
};
EntityAIPanicWatcher.finishExecution = function() {
	return null;
};
EntityAIPanicWatcher.changeSelfPriority = function(priority) {
	return null;
};
EntityAIPanicWatcher.enableAI = function(name, priority, extra) {
	return null;
};
EntityAIPanicWatcher.disableAI = function(name) {
	return null;
};
EntityAIPanicWatcher.setPriority = function(name, priority) {
	return null;
};
EntityAIPanicWatcher.getAI = function(name) {
	return null;
};
EntityAIPanicWatcher.getPriority = function(name) {
	return null;
};
EntityAIPanicWatcher.attackedBy = function(entity) {
	return null;
};
EntityAIPanicWatcher.hurtBy = function() {
	return null;
};
EntityAIPanicWatcher.projectileHit = function(projectile) {
	return null;
};
EntityAIPanicWatcher.death = function(entity) {
	return null;
};
