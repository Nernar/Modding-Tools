var PlayerAPI = {};
PlayerAPI.get = function() {};
PlayerAPI.getNameForEnt = function(ent) {};
PlayerAPI.getName = function() {};
PlayerAPI.getDimension = function() {
	return 0;
};
PlayerAPI.isPlayer = function(ent) {
	return false;
};
PlayerAPI.getPointed = function() {
	return {
		pos: {
			x: 0,
			y: 0,
			z: 0,
			side: 0
		},
		vec: {
			x: -6.913913249969482,
			y: 2.5605902671813965,
			z: 8.187056541442871
		},
		entity: -1,
		block: {
			id: 1,
			data: 0
		}
	};
};
PlayerAPI.getInventory = function(loadPart, handleEnchant, handleNames) {
	/* JavaException: java.lang.RuntimeException: Player.getInventory() method is deprecated */
};
PlayerAPI.addItemToInventory = function(id, count, data, extra, preventDrop) {
	return null;
};
PlayerAPI.getCarriedItem = function(handleEnchant, handleNames) {
	return {
		id: 1,
		count: 2,
		data: 0,
		extra: null
	};
};
PlayerAPI.setCarriedItem = function(id, count, data, extra) {
	return null;
};
PlayerAPI.getOffhandItem = function() {
	return {
		id: 1,
		count: 1,
		data: 0,
		extra: null
	};
};
PlayerAPI.setOffhandItem = function(id, count, data, extra) {
	return null;
};
PlayerAPI.decreaseCarriedItem = function(count) {
	return null;
};
PlayerAPI.getInventorySlot = function(slot) {
	return {
		id: 0,
		count: 0,
		data: 0,
		extra: null
	};
};
PlayerAPI.setInventorySlot = function(slot, id, count, data, extra) {
	return null;
};
PlayerAPI.getArmorSlot = function(slot) {
	return {
		id: 1,
		count: 1,
		data: 0,
		extra: null
	};
};
PlayerAPI.setArmorSlot = function(slot, id, count, data, extra) {
	return null;
};
PlayerAPI.getSelectedSlotId = function() {
	return 0;
};
PlayerAPI.setSelectedSlotId = function(slot) {
	return null;
};
PlayerAPI.setPosition = function(x, y, z) {
	return null;
};
PlayerAPI.getPosition = function() {
	return {
		x: 0,
		y: 0,
		z: 0
	};
};
PlayerAPI.addPosition = function(x, y, z) {
	return null;
};
PlayerAPI.setVelocity = function(x, y, z) {
	return null;
};
PlayerAPI.getVelocity = function() {
	return {
		x: 0,
		y: 0,
		z: 0
	};
};
PlayerAPI.addVelocity = function(x, y, z) {
	return null;
};
PlayerAPI.experience = function() {
	return {
		get: (function () {return Player.getExp();}),
		set: (function (exp) {Player.setExp(exp);}),
		add: (function (exp) {Player.addExp(exp);})
	};
};
PlayerAPI.getExperience = function() {
	return 0;
};
PlayerAPI.setExperience = function(exp) {
	return null;
};
PlayerAPI.addExperience = function(exp) {
	return null;
};
PlayerAPI.level = function() {
	return {
		get: (function () {return Player.getLevel();}),
		set: (function (level) {Player.setLevel(level);}),
		add: (function (level) {this.setLevel(this.getLevel() + level);})
	};
};
PlayerAPI.getLevel = function() {
	return 0;
};
PlayerAPI.setLevel = function(level) {
	return null;
};
PlayerAPI.addLevel = function(level) {
	return null;
};
PlayerAPI.flying = function() {
	return {
		set: (function (enabled) {Player.setFlying(enabled);}),
		get: (function () {return Player.isFlying();}),
		getEnabled: (function () {return Player.canFly();}),
		setEnabled: (function (enabled) {Player.setCanFly(enabled);})
	};
};
PlayerAPI.getFlyingEnabled = function() {
	return true;
};
PlayerAPI.setFlyingEnabled = function(enabled) {
	return null;
};
PlayerAPI.getFlying = function() {
	return true;
};
PlayerAPI.setFlying = function(enabled) {
	return null;
};
PlayerAPI.exhaustion = function() {
	return {
		get: (function () {return Player.getExhaustion();}),
		set: (function (value) {Player.setExhaustion(value);})
	};
};
PlayerAPI.getExhaustion = function() {
	return 0;
};
PlayerAPI.setExhaustion = function(value) {
	return null;
};
PlayerAPI.hunger = function() {
	return {
		get: (function () {return Player.getHunger();}),
		set: (function (value) {Player.setHunger(value);})
	};
};
PlayerAPI.getHunger = function() {
	return 20;
};
PlayerAPI.setHunger = function(value) {
	return null;
};
PlayerAPI.saturation = function() {
	return {
		get: (function () {return Player.getSaturation();}),
		set: (function (value) {Player.setSaturation(value);})
	};
};
PlayerAPI.getSaturation = function() {
	return 20;
};
PlayerAPI.setSaturation = function(value) {
	return null;
};
PlayerAPI.health = function() {
	return {
		get: (function () {return Entity.getHealth(getPlayerEnt());}),
		set: (function (value) {Entity.setHealth(getPlayerEnt(), value);})
	};
};
PlayerAPI.getHealth = function() {
	return 10;
};
PlayerAPI.setHealth = function(value) {
	return null;
};
PlayerAPI.score = function() {
	return {
		get: (function () {return Player.getScore();})
	};
};
PlayerAPI.getScore = function() {
	return 0;
};
PlayerAPI.setFov = function(fov) {
	return null;
};
PlayerAPI.resetFov = function() {
	return null;
};
PlayerAPI.setCameraEntity = function(ent) {
	return null;
};
PlayerAPI.resetCameraEntity = function() {};
PlayerAPI.setAbility = function(ability, value) {
	return null;
};
PlayerAPI.getFloatAbility = function() {};
PlayerAPI.getBooleanAbility = function(ability) {
	return false;
};
