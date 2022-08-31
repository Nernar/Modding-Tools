var EntityAPI = {};
EntityAPI.getAll = function() {
	return null;
};
EntityAPI.getAllJS = function() {
	return null;
};
EntityAPI.getExtra = function(ent, name) {
	return null;
};
EntityAPI.putExtra = function(ent, name, extra) {};
EntityAPI.getExtraJson = function(ent, name) {
	return null;
};
EntityAPI.putExtraJson = function(ent, name, obj) {};
EntityAPI.addEffect = function(ent, effectId, effectData, effectTime, ambiance, particles) {};
EntityAPI.hasEffect = function(ent, effectId) {
	return true;
};
EntityAPI.getEffect = function(ent, effectId) {
	return null;
};
EntityAPI.clearEffect = function(ent, id) {};
EntityAPI.clearEffects = function(ent) {};
EntityAPI.damageEntity = function(ent, damage, cause, params) {};
EntityAPI.healEntity = function(ent, heal) {};
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
	/* InternalError: Java class "[Ljava.lang.String;" has no public instance field or method named "toJSON". (Dump Creator$main.js#579) */
};
EntityAPI.setCompoundTag = function(ent, tag) {};
EntityAPI.setHitbox = function(ent, w, h) {};
EntityAPI.isExist = function(entity) {
	return true;
};
EntityAPI.getDimension = function(entity) {};
EntityAPI.spawn = function() {};
EntityAPI.spawnAtCoords = function() {};
EntityAPI.spawnCustom = function(name, x, y, z, extra) {
	/* TypeError: Cannot read property "__base_type" from undefined */
};
EntityAPI.spawnCustomAtCoords = function(name, coords, extra) {
	/* TypeError: Cannot read property "__base_type" from undefined */
};
EntityAPI.spawnAddon = function(x, y, z, name) {
	return null;
};
EntityAPI.spawnAddonAtCoords = function(coords, name) {
	return null;
};
EntityAPI.getAddonEntity = function(entity) {
	return null;
};
EntityAPI.remove = function(entity) {};
EntityAPI.getCustom = function(entity) {
	return null;
};
EntityAPI.getAge = function(ent) {};
EntityAPI.setAge = function(ent, age) {};
EntityAPI.getSkin = function(ent) {
	return "missing_texture.png";
};
EntityAPI.setSkin = function(ent, skin) {};
EntityAPI.setTexture = function(ent, texture) {};
EntityAPI.getRender = function(ent) {};
EntityAPI.setRender = function(ent, render) {};
EntityAPI.rideAnimal = function(ent1, ent2) {};
EntityAPI.getNameTag = function(ent) {
	return "FlyMaXFeeD";
};
EntityAPI.setNameTag = function(ent, tag) {};
EntityAPI.getTarget = function() {};
EntityAPI.setTarget = function(ent, target) {};
EntityAPI.getMobile = function(ent, mobile) {};
EntityAPI.setMobile = function(ent, mobile) {};
EntityAPI.getSneaking = function(ent) {};
EntityAPI.setSneaking = function(ent, sneak) {};
EntityAPI.getRider = function() {};
EntityAPI.getRiding = function() {};
EntityAPI.setFire = function(ent, fire, force) {};
EntityAPI.health = function(entity) {
	return null;
};
EntityAPI.getHealth = function(ent) {
	return 20;
};
EntityAPI.setHealth = function(ent, health) {};
EntityAPI.getMaxHealth = function(ent) {
	return 20;
};
EntityAPI.setMaxHealth = function(ent, health) {};
EntityAPI.setPosition = function(ent, x, y, z) {};
EntityAPI.getPosition = function(ent) {
	return null;
};
EntityAPI.addPosition = function(ent, x, y, z) {};
EntityAPI.setVelocity = function(ent, x, y, z) {};
EntityAPI.getVelocity = function(ent) {
	return null;
};
EntityAPI.addVelocity = function(ent, x, y, z) {};
EntityAPI.getDistanceBetweenCoords = function(coords1, coords2) {
	return 2.23606797749979;
};
EntityAPI.getDistanceToCoords = function(ent, coords) {
	return 0.17998993396759033;
};
EntityAPI.getDistanceToEntity = function(ent1, ent2) {};
EntityAPI.getXZPlayerDis = function(entity) {
	return 0.17998993396759033;
};
EntityAPI.getLookAngle = function(ent) {
	return null;
};
EntityAPI.setLookAngle = function(ent, yaw, pitch) {};
EntityAPI.getLookVectorByAngle = function(angle) {
	return null;
};
EntityAPI.getLookVector = function(ent) {
	return null;
};
EntityAPI.getLookAt = function(ent, x, y, z) {
	return null;
};
EntityAPI.lookAt = function(ent, x, y, z) {};
EntityAPI.lookAtCoords = function(ent, coords) {};
EntityAPI.moveToTarget = function(ent, target, params) {};
EntityAPI.moveToAngle = function(ent, angle, params) {};
EntityAPI.moveToLook = function(ent, params) {};
EntityAPI.getMovingVector = function(ent) {
	return null;
};
EntityAPI.getMovingAngle = function(ent) {
	return null;
};
EntityAPI.getMovingAngleByPositions = function(pos1, pos2) {};
EntityAPI.findNearest = function(coords, type, maxRange) {
	return -55834574847;
};
EntityAPI.getAllInRange = function(coords, maxRange, type) {
	return null;
};
EntityAPI.getInventory = function(ent, handleNames, handleEnchant) {
	/* JavaException: java.lang.RuntimeException: Entity.getInventory() method is deprecated */
};
EntityAPI.getArmorSlot = function(ent, slot) {
	return null;
};
EntityAPI.setArmorSlot = function(ent, slot, id, count, data, extra) {};
EntityAPI.getCarriedItem = function(ent, bool1, bool2) {
	return null;
};
EntityAPI.setCarriedItem = function(ent, id, count, data, extra) {};
EntityAPI.getOffhandItem = function(ent, bool1, bool2) {
	return null;
};
EntityAPI.setOffhandItem = function(ent, id, count, data, extra) {};
EntityAPI.getDroppedItem = function(ent) {
	return null;
};
EntityAPI.setDroppedItem = function(ent, id, count, data, extra) {};
EntityAPI.getProjectileItem = function(projectile) {
	return null;
};
EntityAPI.getAttribute = function() {};
EntityAPI.getPathNavigation = function(ent) {
	/* CRASH */
};
EntityAPI.getAllInsideBox = function(pos1, pos2, type, flag) {
	return null;
};
