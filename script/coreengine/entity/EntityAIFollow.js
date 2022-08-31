var EntityAIFollow = {};
EntityAIFollow.getDefaultPriority = function() {
	return 1;
};
EntityAIFollow.getDefaultName = function() {
	return "basic-entity-ai";
};
EntityAIFollow.params = {};
EntityAIFollow.params.speed = 0.2;
EntityAIFollow.params.jumpVel = 0.45;
EntityAIFollow.params.rotateSpeed = 0.4;
EntityAIFollow.params.rotateRatio = 0.5;
EntityAIFollow.params.rotateHead = true;
EntityAIFollow.params.denyY = true;
EntityAIFollow.setParams = function(params) {
	return null;
};
EntityAIFollow.executionStarted = function() {
	return null;
};
EntityAIFollow.executionEnded = function() {
	return null;
};
EntityAIFollow.executionPaused = function() {
	return null;
};
EntityAIFollow.executionResumed = function() {
	return null;
};
EntityAIFollow.execute = function() {
	return null;
};
EntityAIFollow.__execute = function() {
	return null;
};
EntityAIFollow.setExecutionTimer = function(timer) {
	return null;
};
EntityAIFollow.removeExecutionTimer = function() {
	return null;
};
EntityAIFollow.data = {};
EntityAIFollow.data.target = null;
EntityAIFollow.data.targetEntity = null;
EntityAIFollow.data.movingYaw = 0;
EntityAIFollow.data.executionTimer = -1;
EntityAIFollow.isInstance = false;
EntityAIFollow.parent = null;
EntityAIFollow.entity = null;
EntityAIFollow.instantiate = function(parent, name) {
	return {
		getDefaultPriority: (function () {return 1;}),
		getDefaultName: (function () {return "basic-entity-ai";}),
		params: {
			speed: 0.2,
			jumpVel: 0.45,
			rotateSpeed: 0.4,
			rotateRatio: 0.5,
			rotateHead: true,
			denyY: true
		},
		setParams: (function (params) {for (var name in params) {this.params[name] = params[name];}}),
		executionStarted: (function () {}),
		executionEnded: (function () {}),
		executionPaused: (function () {}),
		executionResumed: (function () {}),
		execute: (function () {if (this.data.targetEntity) {this.data.target = EntityAPI.getPosition(this.data.targetEntity);}if (this.data.target) {var movingVec = EntityAPI.getMovingVector(this.entity);var movingAngle = EntityAPI.getMovingAngle(this.entity).yaw;var targetAngle = EntityAPI.getLookAt(this.entity, this.data.target.x, this.data.target.y, this.data.target.z).yaw;var deltaAngle = movingAngle - targetAngle;if (!this.data.movingYaw) {this.data.movingYaw = targetAngle;}if (movingVec.xzsize < this.params.speed * 0.5) {this.data.movingYaw = __targetAngle(this.data.movingYaw, targetAngle + deltaAngle * 1.2, this.params.rotateSpeed);}this.data.movingYaw = __targetAngle(this.data.movingYaw, targetAngle, this.params.rotateSpeed * this.params.rotateRatio);EntityAPI.moveToAngle(this.entity, {yaw: this.data.movingYaw, pitch: 0}, this.params);if (this.params.rotateHead) {EntityAPI.setLookAngle(this.entity, this.data.movingYaw, targetAngle.pitch);}}}),
		__execute: (function () {if (this.data.executionTimer > 0) {this.data.executionTimer--;if (this.data.executionTimer == 0) {this.finishExecution();return;}}this.execute();}),
		setExecutionTimer: (function (timer) {this.data.executionTimer = timer;}),
		removeExecutionTimer: (function () {this.data.executionTimer = -1;}),
		data: {
			target: null,
			targetEntity: null,
			movingYaw: 0,
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
EntityAIFollow.aiEntityChanged = function(entity) {
	return null;
};
EntityAIFollow.finishExecution = function() {
	return null;
};
EntityAIFollow.changeSelfPriority = function(priority) {
	return null;
};
EntityAIFollow.enableAI = function(name, priority, extra) {
	return null;
};
EntityAIFollow.disableAI = function(name) {
	return null;
};
EntityAIFollow.setPriority = function(name, priority) {
	return null;
};
EntityAIFollow.getAI = function(name) {
	return null;
};
EntityAIFollow.getPriority = function(name) {
	return null;
};
EntityAIFollow.attackedBy = function(entity) {
	return null;
};
EntityAIFollow.hurtBy = function(entity) {
	return null;
};
EntityAIFollow.projectileHit = function(projectile) {
	return null;
};
EntityAIFollow.death = function(entity) {
	return null;
};
