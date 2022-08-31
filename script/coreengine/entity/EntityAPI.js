var EntityAPI = {};
EntityAPI.getAll = function() {
	return [ -51539607551 ];
};
EntityAPI.getAllJS = function() {
	return [ -51539607551 ];
};
EntityAPI.getExtra = function(ent, name) {
	return null;
};
EntityAPI.putExtra = function(ent, name, extra) {
	return null;
};
EntityAPI.getExtraJson = function(ent, name) {
	return {};
};
EntityAPI.putExtraJson = function(ent, name, obj) {
	return null;
};
EntityAPI.addEffect = function(ent, effectId, effectData, effectTime, ambiance, particles) {
	return null;
};
EntityAPI.hasEffect = function(ent, effectId) {
	return true;
};
EntityAPI.getEffect = function(ent, effectId) {
	return {
		level: 1,
		duration: 5
	};
};
EntityAPI.clearEffect = function(ent, id) {
	return null;
};
EntityAPI.clearEffects = function(ent) {
	return null;
};
EntityAPI.damageEntity = function(ent, damage, cause, params) {
	return null;
};
EntityAPI.healEntity = function(ent, heal) {
	return null;
};
EntityAPI.getType = function(ent) {
	return 63;
};
EntityAPI.getTypeName = function(ent) {
	return "minecraft:player<>";
};
EntityAPI.getTypeUniversal = function(ent) {
	/* JavaException: java.lang.NullPointerException: Attempt to invoke virtual method 'long java.lang.Number.longValue()' on a null object reference */
};
EntityAPI.getTypeAddon = function(ent) {
	return null;
};
EntityAPI.getCompoundTag = function(ent) {
	/* InternalError: Java class "[Ljava.lang.String;" has no public instance field or method named "toJSON". (Dump Creator$main.js#576) */
};
EntityAPI.setCompoundTag = function(ent, tag) {
	return null;
};
EntityAPI.setHitbox = function(ent, w, h) {
	return null;
};
EntityAPI.isExist = function(entity) {
	return true;
};
EntityAPI.getDimension = function(entity) {
	return 0;
};
EntityAPI.spawn = function() {};
EntityAPI.spawnAtCoords = function() {};
EntityAPI.spawnCustom = function(name, x, y, z, extra) {
	/* TypeError: Cannot read property "__base_type" from undefined */
};
EntityAPI.spawnCustomAtCoords = function(name, coords, extra) {
	/* TypeError: Cannot read property "__base_type" from undefined */
};
EntityAPI.spawnAddon = function(x, y, z, name) {
	return {
		id: -55834574845,
		type: "minecraft:pig",
		getCommandCondition: (function () {var position = EntityAPI.getPosition(this.id);return "@e[x=" + position.x + ",y=" + position.y + ",z=" + position.z + ",r=0.0001]";}),
		exec: (function (command) {return Commands.exec("execute " + this.getCommandCondition() + " ~ ~ ~ " + command);}),
		execAt: (function (command, x, y, z) {return Commands.exec("execute " + this.getCommandCondition() + " " + x + " " + y + " " + z + " " + command);})
	};
};
EntityAPI.spawnAddonAtCoords = function(coords, name) {
	return {
		id: -55834574844,
		type: "minecraft:pig",
		getCommandCondition: (function () {var position = EntityAPI.getPosition(this.id);return "@e[x=" + position.x + ",y=" + position.y + ",z=" + position.z + ",r=0.0001]";}),
		exec: (function (command) {return Commands.exec("execute " + this.getCommandCondition() + " ~ ~ ~ " + command);}),
		execAt: (function (command, x, y, z) {return Commands.exec("execute " + this.getCommandCondition() + " " + x + " " + y + " " + z + " " + command);})
	};
};
EntityAPI.getAddonEntity = function(entity) {
	return null;
};
EntityAPI.remove = function(entity) {
	return null;
};
EntityAPI.getCustom = function(entity) {
	return null;
};
EntityAPI.getAge = function(ent) {
	return 0;
};
EntityAPI.setAge = function(ent, age) {
	return null;
};
EntityAPI.getSkin = function(ent) {
	return "missing_texture.png";
};
EntityAPI.setSkin = function(ent, skin) {
	return null;
};
EntityAPI.setTexture = function(ent, texture) {
	return null;
};
EntityAPI.getRender = function(ent) {
	return 0;
};
EntityAPI.setRender = function(ent, render) {
	return null;
};
EntityAPI.rideAnimal = function(ent1, ent2) {
	return null;
};
EntityAPI.getNameTag = function(ent) {
	return "FlyMaXFeeD";
};
EntityAPI.setNameTag = function(ent, tag) {
	return null;
};
EntityAPI.getTarget = function() {};
EntityAPI.setTarget = function(ent, target) {
	return null;
};
EntityAPI.getMobile = function(ent, mobile) {
	return null;
};
EntityAPI.setMobile = function(ent, mobile) {
	return null;
};
EntityAPI.getSneaking = function(ent) {
	return false;
};
EntityAPI.setSneaking = function(ent, sneak) {
	return null;
};
EntityAPI.getRider = function() {};
EntityAPI.getRiding = function() {};
EntityAPI.setFire = function(ent, fire, force) {
	return null;
};
EntityAPI.health = function(entity) {
	return {
		get: (function () {return this.getHealth(entity);}),
		set: (function (health) {this.setHealth(entity, health);}),
		getMax: (function () {return this.getMaxHealth(entity);}),
		setMax: (function (health) {this.setMaxHealth(entity, health);})
	};
};
EntityAPI.getHealth = function(ent) {
	return 20;
};
EntityAPI.setHealth = function(ent, health) {
	return null;
};
EntityAPI.getMaxHealth = function(ent) {
	return 20;
};
EntityAPI.setMaxHealth = function(ent, health) {
	return null;
};
EntityAPI.setPosition = function(ent, x, y, z) {
	return null;
};
EntityAPI.getPosition = function(ent) {
	return {
		x: 0,
		y: 0,
		z: 0
	};
};
EntityAPI.addPosition = function(ent, x, y, z) {
	return null;
};
EntityAPI.setVelocity = function(ent, x, y, z) {
	return null;
};
EntityAPI.getVelocity = function(ent) {
	return {
		x: 0,
		y: 0,
		z: 0
	};
};
EntityAPI.addVelocity = function(ent, x, y, z) {
	return null;
};
EntityAPI.getDistanceBetweenCoords = function(coords1, coords2) {
	return 2.23606797749979;
};
EntityAPI.getDistanceToCoords = function(ent, coords) {
	return 0.17998993396759033;
};
EntityAPI.getDistanceToEntity = function(ent1, ent2) {
	return 0;
};
EntityAPI.getXZPlayerDis = function(entity) {
	return 0.17998993396759033;
};
EntityAPI.getLookAngle = function(ent) {
	return {
		pitch: -0.8498445312484938,
		yaw: -0.8018719452684604
	};
};
EntityAPI.setLookAngle = function(ent, yaw, pitch) {
	return null;
};
EntityAPI.getLookVectorByAngle = function(angle) {
	return {
		x: 0,
		y: 0,
		z: 1
	};
};
EntityAPI.getLookVector = function(ent) {
	return {
		x: 0,
		y: 0,
		z: 1
	};
};
EntityAPI.getLookAt = function(ent, x, y, z) {
	return {
		yaw: 0,
		pitch: 1.5707963267948966
	};
};
EntityAPI.lookAt = function(ent, x, y, z) {
	return null;
};
EntityAPI.lookAtCoords = function(ent, coords) {
	return null;
};
EntityAPI.moveToTarget = function(ent, target, params) {
	return null;
};
EntityAPI.moveToAngle = function(ent, angle, params) {
	return null;
};
EntityAPI.moveToLook = function(ent, params) {
	return null;
};
EntityAPI.getMovingVector = function(ent) {
	return {
		x: NaN,
		y: NaN,
		z: NaN,
		size: 0,
		xzsize: 0
	};
};
EntityAPI.getMovingAngle = function(ent) {
	return {
		pitch: 0,
		yaw: 0
	};
};
EntityAPI.getMovingAngleByPositions = function(pos1, pos2) {
	return null;
};
EntityAPI.findNearest = function(coords, type, maxRange) {
	return -55834574847;
};
EntityAPI.getAllInRange = function(coords, maxRange, type) {
	return [ -55834574847, -55834574846 ];
};
EntityAPI.getInventory = function(ent, handleNames, handleEnchant) {
	/* JavaException: java.lang.RuntimeException: Entity.getInventory() method is deprecated */
};
EntityAPI.getArmorSlot = function(ent, slot) {
	return {
		id: 0,
		count: 0,
		data: 0,
		extra: null
	};
};
EntityAPI.setArmorSlot = function(ent, slot, id, count, data, extra) {
	return null;
};
EntityAPI.getCarriedItem = function(ent, bool1, bool2) {
	return {
		id: 1,
		count: 1,
		data: 0,
		extra: null
	};
};
EntityAPI.setCarriedItem = function(ent, id, count, data, extra) {
	return null;
};
EntityAPI.getOffhandItem = function(ent, bool1, bool2) {
	return {
		id: 0,
		count: 0,
		data: 0,
		extra: null
	};
};
EntityAPI.setOffhandItem = function(ent, id, count, data, extra) {
	return null;
};
EntityAPI.getDroppedItem = function(ent) {
	return {
		id: 0,
		count: 0,
		data: 0,
		extra: null
	};
};
EntityAPI.setDroppedItem = function(ent, id, count, data, extra) {
	return null;
};
EntityAPI.getProjectileItem = function(projectile) {
	return {
		id: 0,
		count: 0,
		data: 0,
		extra: null
	};
};
EntityAPI.getAttribute = function() {};
EntityAPI.getPathNavigation = function(ent) {
	/* CRASH */
};
EntityAPI.getAllInsideBox = function(pos1, pos2, type, flag) {
	return [];
};
