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
EntityAIPanic.setParams = function(params) {};
EntityAIPanic.executionStarted = function() {};
EntityAIPanic.executionEnded = function() {};
EntityAIPanic.executionPaused = function() {};
EntityAIPanic.executionResumed = function() {};
EntityAIPanic.execute = function() {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAIPanic.__execute = function() {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAIPanic.setExecutionTimer = function(timer) {};
EntityAIPanic.removeExecutionTimer = function() {};
EntityAIPanic.data = {};
EntityAIPanic.data.yaw = 4.2856275732747156;
EntityAIPanic.data.add = -0.1212628556373086;
EntityAIPanic.data.executionTimer = -1;
EntityAIPanic.isInstance = false;
EntityAIPanic.parent = null;
EntityAIPanic.entity = null;
EntityAIPanic.instantiate = function(parent, name) {
	return null;
};
EntityAIPanic.aiEntityChanged = function(entity) {};
EntityAIPanic.finishExecution = function() {};
EntityAIPanic.changeSelfPriority = function(priority) {};
EntityAIPanic.enableAI = function(name, priority, extra) {};
EntityAIPanic.disableAI = function(name) {};
EntityAIPanic.setPriority = function(name, priority) {};
EntityAIPanic.getAI = function(name) {};
EntityAIPanic.getPriority = function(name) {};
EntityAIPanic.attackedBy = function(entity) {};
EntityAIPanic.hurtBy = function(entity) {};
EntityAIPanic.projectileHit = function(projectile) {};
EntityAIPanic.death = function(entity) {};
EntityAIPanic.randomize = function() {};
