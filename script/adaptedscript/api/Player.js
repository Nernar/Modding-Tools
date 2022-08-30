var Player = {};
Player.addExp = function(number) {};
Player.addExperience = function(number) {};
Player.addItemCreativeInv = function(category, id, data, what) {};
Player.addItemInventory = function(id, count, data, bool, what) {};
Player.canFly = function() {};
Player.get = function() {};
Player.getArmorSlot = function(slot) {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Player.getBooleanAbility = function(str) {};
Player.getCarriedItem = function() {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Player.getDimension = function() {};
Player.getExhaustion = function() {};
Player.getExp = function() {};
Player.getExperience = function() {};
Player.getFloatAbility = function(str) {};
Player.getHunger = function() {};
Player.getInventorySlot = function(slot) {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Player.getLevel = function() {};
Player.getOffhandItem = function() {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Player.getPointed = function() {};
Player.getPosition = function() {};
Player.getSaturation = function() {};
Player.getScore = function() {};
Player.getSelectedSlotId = function() {};
Player.getX = function() {};
Player.getY = function() {};
Player.getZ = function() {};
Player.isFlying = function() {};
Player.isPlayer = function(who) {};
Player.resetCamera = function() {};
Player.resetFov = function() {};
Player.setAbility = function(str, what) {};
Player.setArmorSlot = function(slot, id, count, data, what) {};
Player.setCameraEntity = function(who) {};
Player.setCanFly = function(bool) {};
Player.setCarriedItem = function(id, count, data, who) {};
Player.setExhaustion = function(double) {};
Player.setExp = function(double) {};
Player.setExperience = function(double) {};
Player.setFlying = function(bool) {};
Player.setFov = function(double) {};
Player.setHunger = function(double) {};
Player.setInventorySlot = function(slot, id, count, data, what) {};
Player.setLevel = function(double) {};
Player.setOffhandItem = function(id, count, data, what) {};
Player.setSaturation = function(double) {};
Player.setSelectedSlotId = function(slot) {};
