var EntityAIPanic = {};
EntityAIPanic.getDefaultPriority = function() {
	return 3;
};
EntityAIPanic.getDefaultName = function() {
	return "panic";
};
EntityAIPanic.params = {};
EntityAIPanic.params.speed = 0.22;
EntityAIPanic.params.angular_speed = 0.5;
EntityAIPanic.setParams = function(params) {
	return null;
};
EntityAIPanic.executionStarted = function() {
	return null;
};
EntityAIPanic.executionEnded = function() {
	return null;
};
EntityAIPanic.executionPaused = function() {
	return null;
};
EntityAIPanic.executionResumed = function() {
	return null;
};
EntityAIPanic.execute = function() {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAIPanic.__execute = function() {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAIPanic.setExecutionTimer = function(timer) {
	return null;
};
EntityAIPanic.removeExecutionTimer = function() {
	return null;
};
EntityAIPanic.data = {};
EntityAIPanic.data.yaw = 3.4121977666382985;
EntityAIPanic.data.add = -0.18057757067278835;
EntityAIPanic.data.executionTimer = -1;
EntityAIPanic.isInstance = false;
EntityAIPanic.parent = null;
EntityAIPanic.entity = null;
EntityAIPanic.instantiate = function(parent, name) {
	return {
		getDefaultPriority: (function () {return 3;}),
		getDefaultName: (function () {return "panic";}),
		params: {
			speed: 0.22,
			angular_speed: 0.5
		},
		setParams: (function (params) {for (var name in params) {this.params[name] = params[name];}}),
		executionStarted: (function () {this.data.yaw = Math.random() * Math.PI * 2;this.randomize();}),
		executionEnded: (function () {}),
		executionPaused: (function () {}),
		executionResumed: (function () {}),
		execute: (function () {if (WorldAPI.getThreadTime() % 30 == 0) {this.randomize();EntityAPI.setLookAngle(this.entity, this.data.yaw, 0);}this.data.yaw += this.data.add;EntityAPI.moveToLook(this.entity, {speed: this.params.speed, denyY: true, jumpVel: 0.45});}),
		__execute: (function () {if (this.data.executionTimer > 0) {this.data.executionTimer--;if (this.data.executionTimer == 0) {this.finishExecution();return;}}this.execute();}),
		setExecutionTimer: (function (timer) {this.data.executionTimer = timer;}),
		removeExecutionTimer: (function () {this.data.executionTimer = -1;}),
		data: {
			yaw: 3.4121977666382985,
			add: -0.18057757067278835,
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
		randomize: (function () {if (Math.random() < 0.5) {this.data.add = (Math.random() * -0.5) * this.params.angular_speed;} else {this.data.add = 0;}}),
		executionName: "test"
	};
};
EntityAIPanic.aiEntityChanged = function(entity) {
	return null;
};
EntityAIPanic.finishExecution = function() {
	return null;
};
EntityAIPanic.changeSelfPriority = function(priority) {
	return null;
};
EntityAIPanic.enableAI = function(name, priority, extra) {
	return null;
};
EntityAIPanic.disableAI = function(name) {
	return null;
};
EntityAIPanic.setPriority = function(name, priority) {
	return null;
};
EntityAIPanic.getAI = function(name) {
	return null;
};
EntityAIPanic.getPriority = function(name) {
	return null;
};
EntityAIPanic.attackedBy = function(entity) {
	return null;
};
EntityAIPanic.hurtBy = function(entity) {
	return null;
};
EntityAIPanic.projectileHit = function(projectile) {
	return null;
};
EntityAIPanic.death = function(entity) {
	return null;
};
EntityAIPanic.randomize = function() {
	return null;
};
