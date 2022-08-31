var EntityAIController = {};
EntityAIController.currentPriority = 0;
EntityAIController.loadedAI = {};
EntityAIController.loadedData = {};
EntityAIController.isAILoaded = false;
EntityAIController.getAITypes = function() {
	return {
		main: {
			type: {
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
				isInstance: false,
				parent: null,
				entity: null,
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
				getDefaultPrioriy: (function () {return 1;})
			}
		}
	};
};
EntityAIController.loadEntityAI = function() {
	/* TypeError: Cannot read property "entity" from undefined */
};
EntityAIController.loaded = function() {
	/* TypeError: Cannot read property "entity" from undefined */
};
EntityAIController.nativeEntityChanged = function() {
	/* TypeError: Cannot read property "entity" from undefined */
};
EntityAIController.unloaded = function() {
	return null;
};
EntityAIController.aiLoaded = function() {
	return null;
};
EntityAIController.getAI = function(name) {
	/* TypeError: Cannot read property "AI" from undefined */
};
EntityAIController.getPriority = function(name) {
	/* TypeError: Cannot read property "priority" from undefined */
};
EntityAIController.enableAI = function(name, priority, extra) {
	return null;
};
EntityAIController.disableAI = function(name) {
	return null;
};
EntityAIController.setPriority = function(name, priority) {
	return null;
};
EntityAIController.refreshPriorities = function() {
	return null;
};
EntityAIController.callAIevent = function(eventName, parameter, extra) {
	return null;
};
EntityAIController.update = function() {
	return null;
};
EntityAIController.tick = function() {
	return null;
};
EntityAIController.attackedBy = function(attacker) {
	return null;
};
EntityAIController.hurtBy = function(attacker, damage) {
	return null;
};
EntityAIController.death = function(attacker) {
	return null;
};
EntityAIController.projectileHit = function(projectile) {
	return null;
};
EntityAIController.save = function() {
	return {};
};
EntityAIController.read = function(data) {
	return null;
};

function EntityAI(customPrototype) {
	return null;
}
function EntityAIWatcher(customPrototype) {
	return null;
}
