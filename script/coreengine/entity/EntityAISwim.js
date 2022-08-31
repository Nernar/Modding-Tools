var EntityAISwim = {};
EntityAISwim.getDefaultPriority = function() {
	return -1;
};
EntityAISwim.getDefaultName = function() {
	return "swim";
};
EntityAISwim.params = {};
EntityAISwim.params.velocity = 0.2;
EntityAISwim.setParams = function(params) {
	return null;
};
EntityAISwim.executionStarted = function() {
	return null;
};
EntityAISwim.executionEnded = function() {
	return null;
};
EntityAISwim.executionPaused = function() {
	return null;
};
EntityAISwim.executionResumed = function() {
	return null;
};
EntityAISwim.execute = function() {
	return null;
};
EntityAISwim.__execute = function() {
	return null;
};
EntityAISwim.setExecutionTimer = function(timer) {
	return null;
};
EntityAISwim.removeExecutionTimer = function() {
	return null;
};
EntityAISwim.data = {};
EntityAISwim.data.executionTimer = -1;
EntityAISwim.isInstance = false;
EntityAISwim.parent = null;
EntityAISwim.entity = null;
EntityAISwim.instantiate = function(parent, name) {
	return {
		getDefaultPriority: (function () {return -1;}),
		getDefaultName: (function () {return "swim";}),
		params: {
			velocity: 0.2
		},
		setParams: (function (params) {for (var name in params) {this.params[name] = params[name];}}),
		executionStarted: (function () {}),
		executionEnded: (function () {}),
		executionPaused: (function () {}),
		executionResumed: (function () {}),
		execute: (function () {if (WorldAPI.getThreadTime() % 5 == 0) {var position = EntityAPI.getPosition(this.entity);var tile = WorldAPI.getBlockID(position.x, position.y + 0.4, position.z);this.inWater = (tile > 7 && tile < 12);}if (this.inWater) {var velocity = EntityAPI.getVelocity(this.entity);EntityAPI.setVelocity(this.entity, velocity.x, this.params.velocity, velocity.z);}}),
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
		inWater: false,
		executionName: "test"
	};
};
EntityAISwim.aiEntityChanged = function(entity) {
	return null;
};
EntityAISwim.finishExecution = function() {
	return null;
};
EntityAISwim.changeSelfPriority = function(priority) {
	return null;
};
EntityAISwim.enableAI = function(name, priority, extra) {
	return null;
};
EntityAISwim.disableAI = function(name) {
	return null;
};
EntityAISwim.setPriority = function(name, priority) {
	return null;
};
EntityAISwim.getAI = function(name) {
	return null;
};
EntityAISwim.getPriority = function(name) {
	return null;
};
EntityAISwim.attackedBy = function(entity) {
	return null;
};
EntityAISwim.hurtBy = function(entity) {
	return null;
};
EntityAISwim.projectileHit = function(projectile) {
	return null;
};
EntityAISwim.death = function(entity) {
	return null;
};
EntityAISwim.inWater = false;
