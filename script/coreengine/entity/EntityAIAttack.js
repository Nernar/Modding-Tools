var EntityAIAttack = {};
EntityAIAttack.getDefaultPriority = function() {
	return 1;
};
EntityAIAttack.getDefaultName = function() {
	return "basic-entity-ai";
};
EntityAIAttack.params = {};
EntityAIAttack.params.attack_damage = 5;
EntityAIAttack.params.attack_range = 2.5;
EntityAIAttack.params.attack_rate = 12;
EntityAIAttack.setParams = function(params) {
	return null;
};
EntityAIAttack.executionStarted = function() {
	return null;
};
EntityAIAttack.executionEnded = function() {
	return null;
};
EntityAIAttack.executionPaused = function() {
	return null;
};
EntityAIAttack.executionResumed = function() {
	return null;
};
EntityAIAttack.execute = function() {
	return null;
};
EntityAIAttack.__execute = function() {
	return null;
};
EntityAIAttack.setExecutionTimer = function(timer) {
	return null;
};
EntityAIAttack.removeExecutionTimer = function() {
	return null;
};
EntityAIAttack.data = {};
EntityAIAttack.data.timer = 0;
EntityAIAttack.data.target = null;
EntityAIAttack.data.executionTimer = -1;
EntityAIAttack.isInstance = false;
EntityAIAttack.parent = null;
EntityAIAttack.entity = null;
EntityAIAttack.instantiate = function(parent, name) {
	return {
		getDefaultPriority: (function () {return 1;}),
		getDefaultName: (function () {return "basic-entity-ai";}),
		params: {
			attack_damage: 5,
			attack_range: 2.5,
			attack_rate: 12
		},
		setParams: (function (params) {for (var name in params) {this.params[name] = params[name];}}),
		executionStarted: (function () {}),
		executionEnded: (function () {}),
		executionPaused: (function () {}),
		executionResumed: (function () {}),
		execute: (function () {if (this.data.target) {if (EntityAPI.getDistanceToEntity(this.entity, this.data.target) < this.params.attack_range) {if (this.data.timer-- < 0) {this.data.timer = this.params.attack_rate;EntityAPI.damageEntity(this.data.target, this.params.attack_damage);}} else {this.data.timer = 0;}}}),
		__execute: (function () {if (this.data.executionTimer > 0) {this.data.executionTimer--;if (this.data.executionTimer == 0) {this.finishExecution();return;}}this.execute();}),
		setExecutionTimer: (function (timer) {this.data.executionTimer = timer;}),
		removeExecutionTimer: (function () {this.data.executionTimer = -1;}),
		data: {
			timer: 0,
			target: null,
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
		executionName: "test"
	};
};
EntityAIAttack.aiEntityChanged = function(entity) {
	return null;
};
EntityAIAttack.finishExecution = function() {
	return null;
};
EntityAIAttack.changeSelfPriority = function(priority) {
	return null;
};
EntityAIAttack.enableAI = function(name, priority, extra) {
	return null;
};
EntityAIAttack.disableAI = function(name) {
	return null;
};
EntityAIAttack.setPriority = function(name, priority) {
	return null;
};
EntityAIAttack.getAI = function(name) {
	return null;
};
EntityAIAttack.getPriority = function(name) {
	return null;
};
EntityAIAttack.attackedBy = function(entity) {
	return null;
};
EntityAIAttack.hurtBy = function(entity) {
	return null;
};
EntityAIAttack.projectileHit = function(projectile) {
	return null;
};
EntityAIAttack.death = function(entity) {
	return null;
};
