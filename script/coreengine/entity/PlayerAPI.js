var PlayerAPI = {};
PlayerAPI.get = function() {};
PlayerAPI.getNameForEnt = function(ent) {};
PlayerAPI.getName = function() {};
PlayerAPI.getDimension = function() {};
PlayerAPI.isPlayer = function(ent) {};
PlayerAPI.getPointed = function() {
	return null;
};
PlayerAPI.getInventory = function(loadPart, handleEnchant, handleNames) {
	/* JavaException: java.lang.RuntimeException: Player.getInventory() method is deprecated */
};
PlayerAPI.addItemToInventory = function(id, count, data, extra, preventDrop) {};
PlayerAPI.getCarriedItem = function(handleEnchant, handleNames) {
	return null;
};
PlayerAPI.setCarriedItem = function(id, count, data, extra) {};
PlayerAPI.getOffhandItem = function() {
	return null;
};
PlayerAPI.setOffhandItem = function(id, count, data, extra) {};
PlayerAPI.decreaseCarriedItem = function(count) {};
PlayerAPI.getInventorySlot = function(slot) {
	return null;
};
PlayerAPI.setInventorySlot = function(slot, id, count, data, extra) {};
PlayerAPI.getArmorSlot = function(slot) {
	return null;
};
PlayerAPI.setArmorSlot = function(slot, id, count, data, extra) {};
PlayerAPI.getSelectedSlotId = function() {};
PlayerAPI.setSelectedSlotId = function(slot) {};
PlayerAPI.setPosition = function(x, y, z) {};
PlayerAPI.getPosition = function() {
	return null;
};
PlayerAPI.addPosition = function(x, y, z) {};
PlayerAPI.setVelocity = function(x, y, z) {};
PlayerAPI.getVelocity = function() {
	return null;
};
PlayerAPI.addVelocity = function(x, y, z) {};
PlayerAPI.experience = function() {
	return null;
};
PlayerAPI.getExperience = function() {};
PlayerAPI.setExperience = function(exp) {};
PlayerAPI.addExperience = function(exp) {};
PlayerAPI.level = function() {
	return null;
};
PlayerAPI.getLevel = function() {};
PlayerAPI.setLevel = function(level) {};
PlayerAPI.addLevel = function(level) {};
PlayerAPI.flying = function() {
	return null;
};
PlayerAPI.getFlyingEnabled = function() {
	return true;
};
PlayerAPI.setFlyingEnabled = function(enabled) {};
PlayerAPI.getFlying = function() {
	return true;
};
PlayerAPI.setFlying = function(enabled) {};
PlayerAPI.exhaustion = function() {
	return null;
};
PlayerAPI.getExhaustion = function() {};
PlayerAPI.setExhaustion = function(value) {};
PlayerAPI.hunger = function() {
	return null;
};
PlayerAPI.getHunger = function() {
	return 20;
};
PlayerAPI.setHunger = function(value) {};
PlayerAPI.saturation = function() {
	return null;
};
PlayerAPI.getSaturation = function() {
	return 20;
};
PlayerAPI.setSaturation = function(value) {};
PlayerAPI.health = function() {
	return null;
};
PlayerAPI.getHealth = function() {
	return 10;
};
PlayerAPI.setHealth = function(value) {};
PlayerAPI.score = function() {
	return null;
};
PlayerAPI.getScore = function() {};
PlayerAPI.setFov = function(fov) {};
PlayerAPI.resetFov = function() {};
PlayerAPI.setCameraEntity = function(ent) {};
PlayerAPI.resetCameraEntity = function() {};
PlayerAPI.setAbility = function(ability, value) {};
PlayerAPI.getFloatAbility = function() {};
PlayerAPI.getBooleanAbility = function(ability) {};
