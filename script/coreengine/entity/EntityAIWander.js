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
EntityAIWander.setParams = function(params) {};
EntityAIWander.executionStarted = function() {};
EntityAIWander.executionEnded = function() {};
EntityAIWander.executionPaused = function() {};
EntityAIWander.executionResumed = function() {};
EntityAIWander.execute = function() {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAIWander.__execute = function() {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAIWander.setExecutionTimer = function(timer) {};
EntityAIWander.removeExecutionTimer = function() {};
EntityAIWander.data = {};
EntityAIWander.data.yaw = 5.675974788194804;
EntityAIWander.data.add = 0;
EntityAIWander.data.delay = false;
EntityAIWander.data._delay = true;
EntityAIWander.data.executionTimer = -1;
EntityAIWander.isInstance = false;
EntityAIWander.parent = null;
EntityAIWander.entity = null;
EntityAIWander.instantiate = function(parent, name) {
	return null;
};
EntityAIWander.aiEntityChanged = function(entity) {};
EntityAIWander.finishExecution = function() {};
EntityAIWander.changeSelfPriority = function(priority) {};
EntityAIWander.enableAI = function(name, priority, extra) {};
EntityAIWander.disableAI = function(name) {};
EntityAIWander.setPriority = function(name, priority) {};
EntityAIWander.getAI = function(name) {};
EntityAIWander.getPriority = function(name) {};
EntityAIWander.attackedBy = function(entity) {};
EntityAIWander.hurtBy = function(entity) {};
EntityAIWander.projectileHit = function(projectile) {};
EntityAIWander.death = function(entity) {};
EntityAIWander.randomize = function() {};
