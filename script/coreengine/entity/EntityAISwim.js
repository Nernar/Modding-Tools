function EntityAIWatcher(customPrototype) {}
var EntityAISwim = {};
EntityAISwim.getDefaultPriority = function() {
	return -1;
};
EntityAISwim.getDefaultName = function() {
	return "swim";
};
EntityAISwim.params = {};
EntityAISwim.params.velocity = 0.2;
EntityAISwim.setParams = function(params) {};
EntityAISwim.executionStarted = function() {};
EntityAISwim.executionEnded = function() {};
EntityAISwim.executionPaused = function() {};
EntityAISwim.executionResumed = function() {};
EntityAISwim.execute = function() {};
EntityAISwim.__execute = function() {};
EntityAISwim.setExecutionTimer = function(timer) {};
EntityAISwim.removeExecutionTimer = function() {};
EntityAISwim.data = {};
EntityAISwim.data.executionTimer = -1;
EntityAISwim.isInstance = false;
EntityAISwim.parent = null;
EntityAISwim.entity = null;
EntityAISwim.instantiate = function(parent, name) {
	return null;
};
EntityAISwim.aiEntityChanged = function(entity) {};
EntityAISwim.finishExecution = function() {};
EntityAISwim.changeSelfPriority = function(priority) {};
EntityAISwim.enableAI = function(name, priority, extra) {};
EntityAISwim.disableAI = function(name) {};
EntityAISwim.setPriority = function(name, priority) {};
EntityAISwim.getAI = function(name) {};
EntityAISwim.getPriority = function(name) {};
EntityAISwim.attackedBy = function(entity) {};
EntityAISwim.hurtBy = function(entity) {};
EntityAISwim.projectileHit = function(projectile) {};
EntityAISwim.death = function(entity) {};
EntityAISwim.inWater = false;
