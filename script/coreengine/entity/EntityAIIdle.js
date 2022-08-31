var EntityAIIdle = {};
EntityAIIdle.getDefaultPriority = function() {
	return 1;
};
EntityAIIdle.getDefaultName = function() {
	return "idle";
};
EntityAIIdle.params = {};
EntityAIIdle.setParams = function(params) {
	return null;
};
EntityAIIdle.executionStarted = function() {
	return null;
};
EntityAIIdle.executionEnded = function() {
	return null;
};
EntityAIIdle.executionPaused = function() {
	return null;
};
EntityAIIdle.executionResumed = function() {
	return null;
};
EntityAIIdle.execute = function() {
	return null;
};
EntityAIIdle.__execute = function() {
	return null;
};
EntityAIIdle.setExecutionTimer = function(timer) {
	return null;
};
EntityAIIdle.removeExecutionTimer = function() {
	return null;
};
EntityAIIdle.data = {};
EntityAIIdle.data.executionTimer = -1;
EntityAIIdle.isInstance = false;
EntityAIIdle.parent = null;
EntityAIIdle.entity = null;
EntityAIIdle.instantiate = function(parent, name) {
	return {
		getDefaultPriority: (function () {return 1;}),
		getDefaultName: (function () {return "idle";}),
		params: {},
		setParams: (function (params) {for (var name in params) {this.params[name] = params[name];}}),
		executionStarted: (function () {}),
		executionEnded: (function () {}),
		executionPaused: (function () {}),
		executionResumed: (function () {}),
		execute: (function () {}),
		__execute: (function () {if (this.data.executionTimer > 0) {this.data.executionTimer--;if (this.data.executionTimer == 0) {this.finishExecution();return;}}this.execute();}),
		setExecutionTimer: (function (timer) {this.data.executionTimer = timer;}),
		removeExecutionTimer: (function () {this.data.executionTimer = -1;}),
		data: {
			executionTimer: -1
		},
		isInstance: true,
		parent: {},
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
		hurtBy: (function (entity) {}),
		projectileHit: (function (projectile) {}),
		death: (function (entity) {}),
		getDefaultPrioriy: (function () {return 1;}),
		executionName: "test"
	};
};
EntityAIIdle.aiEntityChanged = function(entity) {
	return null;
};
EntityAIIdle.finishExecution = function() {
	return null;
};
EntityAIIdle.changeSelfPriority = function(priority) {
	return null;
};
EntityAIIdle.enableAI = function(name, priority, extra) {
	return null;
};
EntityAIIdle.disableAI = function(name) {
	return null;
};
EntityAIIdle.setPriority = function(name, priority) {
	return null;
};
EntityAIIdle.getAI = function(name) {
	return null;
};
EntityAIIdle.getPriority = function(name) {
	return null;
};
EntityAIIdle.attackedBy = function(entity) {
	return null;
};
EntityAIIdle.hurtBy = function(entity) {
	return null;
};
EntityAIIdle.projectileHit = function(projectile) {
	return null;
};
EntityAIIdle.death = function(entity) {
	return null;
};
EntityAIIdle.getDefaultPrioriy = function() {
	return 1;
};
