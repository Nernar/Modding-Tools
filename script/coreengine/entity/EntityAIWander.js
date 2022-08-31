var EntityAIWander = {};
EntityAIWander.getDefaultPriority = function() {
	return 2;
};
EntityAIWander.getDefaultName = function() {
	return "wander";
};
EntityAIWander.params = {};
EntityAIWander.params.speed = 0.08;
EntityAIWander.params.angular_speed = 0.1;
EntityAIWander.params.delay_weight = 0.3;
EntityAIWander.setParams = function(params) {
	return null;
};
EntityAIWander.executionStarted = function() {
	return null;
};
EntityAIWander.executionEnded = function() {
	return null;
};
EntityAIWander.executionPaused = function() {
	return null;
};
EntityAIWander.executionResumed = function() {
	return null;
};
EntityAIWander.execute = function() {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAIWander.__execute = function() {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAIWander.setExecutionTimer = function(timer) {
	return null;
};
EntityAIWander.removeExecutionTimer = function() {
	return null;
};
EntityAIWander.data = {};
EntityAIWander.data.yaw = 3.9162517251532627;
EntityAIWander.data.add = -0.0055783766006773155;
EntityAIWander.data.delay = false;
EntityAIWander.data._delay = true;
EntityAIWander.data.executionTimer = -1;
EntityAIWander.isInstance = false;
EntityAIWander.parent = null;
EntityAIWander.entity = null;
EntityAIWander.instantiate = function(parent, name) {
	return {
		getDefaultPriority: (function () {return 2;}),
		getDefaultName: (function () {return "wander";}),
		params: {
			speed: 0.08,
			angular_speed: 0.1,
			delay_weight: 0.3
		},
		setParams: (function (params) {for (var name in params) {this.params[name] = params[name];}}),
		executionStarted: (function () {this.data.yaw = Math.random() * Math.PI * 2;this.randomize();}),
		executionEnded: (function () {}),
		executionPaused: (function () {}),
		executionResumed: (function () {}),
		execute: (function () {if (WorldAPI.getThreadTime() % 30 == 0) {this.randomize();EntityAPI.setLookAngle(this.entity, this.data.yaw, 0);}if (!this.data.delay) {this.data.yaw += this.data.add;EntityAPI.moveToLook(this.entity, {speed: this.params.speed, denyY: true, jumpVel: this.data._delay ? 0 : 0.45});}this.data._delay = this.data.delay;}),
		__execute: (function () {if (this.data.executionTimer > 0) {this.data.executionTimer--;if (this.data.executionTimer == 0) {this.finishExecution();return;}}this.execute();}),
		setExecutionTimer: (function (timer) {this.data.executionTimer = timer;}),
		removeExecutionTimer: (function () {this.data.executionTimer = -1;}),
		data: {
			yaw: 3.9162517251532627,
			add: -0.0055783766006773155,
			delay: false,
			_delay: true,
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
		randomize: (function () {if (Math.random() < this.params.delay_weight) {this.data.delay = true;} else {this.data.delay = false;if (Math.random() < 0.5) {this.data.add = (Math.random() * -0.5) * this.params.angular_speed;} else {this.data.add = 0;}}}),
		executionName: "test"
	};
};
EntityAIWander.aiEntityChanged = function(entity) {
	return null;
};
EntityAIWander.finishExecution = function() {
	return null;
};
EntityAIWander.changeSelfPriority = function(priority) {
	return null;
};
EntityAIWander.enableAI = function(name, priority, extra) {
	return null;
};
EntityAIWander.disableAI = function(name) {
	return null;
};
EntityAIWander.setPriority = function(name, priority) {
	return null;
};
EntityAIWander.getAI = function(name) {
	return null;
};
EntityAIWander.getPriority = function(name) {
	return null;
};
EntityAIWander.attackedBy = function(entity) {
	return null;
};
EntityAIWander.hurtBy = function(entity) {
	return null;
};
EntityAIWander.projectileHit = function(projectile) {
	return null;
};
EntityAIWander.death = function(entity) {
	return null;
};
EntityAIWander.randomize = function() {
	return null;
};
