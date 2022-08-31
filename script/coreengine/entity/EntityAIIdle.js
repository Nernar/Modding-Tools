var EntityAIIdle = {};
EntityAIIdle.getDefaultPriority = function() {
	return 1;
};
EntityAIIdle.getDefaultName = function() {
	return "idle";
};
EntityAIIdle.params = {};
EntityAIIdle.setParams = function(params) {};
EntityAIIdle.executionStarted = function() {};
EntityAIIdle.executionEnded = function() {};
EntityAIIdle.executionPaused = function() {};
EntityAIIdle.executionResumed = function() {};
EntityAIIdle.execute = function() {};
EntityAIIdle.__execute = function() {};
EntityAIIdle.setExecutionTimer = function(timer) {};
EntityAIIdle.removeExecutionTimer = function() {};
EntityAIIdle.data = {};
EntityAIIdle.data.executionTimer = -1;
EntityAIIdle.isInstance = false;
EntityAIIdle.parent = null;
EntityAIIdle.entity = null;
EntityAIIdle.instantiate = function(parent, name) {
	return null;
};
EntityAIIdle.aiEntityChanged = function(entity) {};
EntityAIIdle.finishExecution = function() {};
EntityAIIdle.changeSelfPriority = function(priority) {};
EntityAIIdle.enableAI = function(name, priority, extra) {};
EntityAIIdle.disableAI = function(name) {};
EntityAIIdle.setPriority = function(name, priority) {};
EntityAIIdle.getAI = function(name) {};
EntityAIIdle.getPriority = function(name) {};
EntityAIIdle.attackedBy = function(entity) {};
EntityAIIdle.hurtBy = function(entity) {};
EntityAIIdle.projectileHit = function(projectile) {};
EntityAIIdle.death = function(entity) {};
EntityAIIdle.getDefaultPrioriy = function() {
	return 1;
};
