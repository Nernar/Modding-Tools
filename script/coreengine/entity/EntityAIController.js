var EntityAIController = {};
EntityAIController.currentPriority = 0;
EntityAIController.loadedAI = {};
EntityAIController.loadedData = {};
EntityAIController.isAILoaded = false;
EntityAIController.getAITypes = function() {
	return null;
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
EntityAIController.unloaded = function() {};
EntityAIController.aiLoaded = function() {};
EntityAIController.getAI = function(name) {
	/* TypeError: Cannot read property "AI" from undefined */
};
EntityAIController.getPriority = function(name) {
	/* TypeError: Cannot read property "priority" from undefined */
};
EntityAIController.enableAI = function(name, priority, extra) {};
EntityAIController.disableAI = function(name) {};
EntityAIController.setPriority = function(name, priority) {};
EntityAIController.refreshPriorities = function() {};
EntityAIController.callAIevent = function(eventName, parameter, extra) {};
EntityAIController.update = function() {};
EntityAIController.tick = function() {};
EntityAIController.attackedBy = function(attacker) {};
EntityAIController.hurtBy = function(attacker, damage) {};
EntityAIController.death = function(attacker) {};
EntityAIController.projectileHit = function(projectile) {};
EntityAIController.save = function() {
	return null;
};
EntityAIController.read = function(data) {};

function EntityAI(customPrototype) {}
