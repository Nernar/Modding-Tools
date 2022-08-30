var Entity = {};
Entity.addEffect = function(who, int1, int2, int3, bool1, bool2, bool3) {};
Entity.dealDamage = function(who, int1, int2, what) {};
Entity.getAll = function() {};
Entity.getAllArrayList = function() {};
Entity.getAnimalAge = function(who) {};
Entity.getArmor = function(who, slot) {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Entity.getArmorSlot = function(who, slot) {
	return Entity.getArmor(who, slot);
};
Entity.getAttribute = function(who, str) {
	return {
    	getDefaultValue: function() {},
    	getMaxValue: function() {},
    	getMinValue: function() {},
    	getValue: function() {},
    	setDefaultValue: function(float) {},
    	setMaxValue: function(float) {},
    	setMinValue: function(float) {},
    	setValue: function(float) {}
	};
};
Entity.getCarriedItem = function(who) {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Entity.getCompoundTag = function(who) {
	return {
    	clear: function() {},
    	contains: function(str) {},
    	containsValueOfType: function(str, value) {},
    	getAllKeys: function() {},
    	getByte: function(str) {},
    	getCompoundTag: function(str) {},
    	getCompoundTagNoClone: function(str) {},
    	getDouble: function(str) {},
    	getFloat: function(str) {},
    	getInt: function(str) {},
    	getInt64: function(str) {},
    	getListTag: function(str) {},
    	getListTagNoClone: function(str) {},
    	getShort: function(str) {},
    	getString: function(str) {},
    	getValueType: function(str) {},
    	putByte: function(str, value) {},
    	putCompoundTag: function(str, compound) {},
    	putDouble: function(str, double) {},
    	putFloat: function(str, float) {},
    	putInt: function(str, value) {},
    	putInt64: function(str, long) {},
    	putListTag: function(str, list) {},
    	putShort: function(str, value) {},
    	putString: function(str1, str2) {},
    	remove: function(str) {},
    	setFinalizable: function(bool) {},
    	toScriptable: function() {}
	};
};
Entity.getDimension = function(who) {};
Entity.getDroppedItem = function(who) {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Entity.getEffectDuration = function(who, effectId) {};
Entity.getEffectLevel = function(who, effectId) {};
Entity.getEntitiesInsideBox = function(x1, y1, z1, x2, y2, z2, type, mode) {};
Entity.getEntityTypeId = function(who) {};
Entity.getFireTicks = function(who) {};
Entity.getHealth = function(who) {};
Entity.getMaxHealth = function(who) {};
Entity.getMobSkin = function(who) {};
Entity.getNameTag = function(who) {};
Entity.getOffhandItem = function(who) {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Entity.getPathNavigation = function(who) {
	return {
    	canOpenDoors: function() {},
    	canPassDoors: function() {},
    	getAvoidDamageBlocks: function() {},
    	getAvoidPortals: function() {},
    	getAvoidSun: function() {},
    	getAvoidWater: function() {},
    	getCanBreach: function() {},
    	getCanFloat: function() {},
    	getCanJump: function() {},
    	getCanOpenIronDoors: function() {},
    	getCanPathOverLava: function() {},
    	getCanSink: function() {},
    	getCanWalkInLava: function() {},
    	getEntity: function() {},
    	getHasEndPathRadius: function() {},
    	getMaxNavigationDistance: function() {},
    	getSpeed: function() {},
    	getTerminationThreshold: function() {},
    	getTerminationThreshold: function(float) {},
    	getTickTimeout: function() {},
    	isAmphibious: function() {},
    	isDone: function() {},
    	isRiverFollowing: function() {},
    	isStuck: function(number) {},
    	moveToCoords: function(float1, float2, float3, float4) {},
    	moveToEntity: function(long, float) {},
    	setAvoidDamageBlocks: function(bool) {},
    	setAvoidPortals: function(bool) {},
    	setAvoidSun: function(bool) {},
    	setAvoidWater: function(bool) {},
    	setCanBreach: function(bool) {},
    	setCanFloat: function(bool) {},
    	setCanJump: function(bool) {},
    	setCanOpenDoors: function(bool) {},
    	setCanOpenIronDoors: function(bool) {},
    	setCanPassDoors: function(bool) {},
    	setCanPathOverLava: function(bool) {},
    	setCanSink: function(bool) {},
    	setCanWalkInLava: function(bool) {},
    	setEndPathRadius: function(float) {},
    	setHasEndPathRadius: function(bool) {},
    	setIsAmphibious: function(bool) {},
    	setIsRiverFollowing: function(bool) {},
    	setMaxNavigationDistance: function(float) {},
    	setResultFunction: function(navigationResultFunction) {},
    	setSpeed: function(float) {},
    	setTickTimeout: function(number) {},
    	setType: function(number) {},
    	stop: function() {}
	};
};
Entity.getPitch = function(who) {};
Entity.getPlayerEnt = function() {};
Entity.getPosition = function(who) {};
Entity.getProjectileItem = function(who) {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Entity.getRenderType = function(who) {};
Entity.getRider = function(who) {};
Entity.getRiding = function(who) {};
Entity.getRotation = function(who) {};
Entity.getSkin = function(who) {};
Entity.getTarget = function(who) {};
Entity.getType = function(who) {};
Entity.getTypeName = function(who) {};
Entity.getVelX = function(who) {};
Entity.getVelY = function(who) {};
Entity.getVelZ = function(who) {};
Entity.getVelocity = function(who) {};
Entity.getX = function(who) {};
Entity.getY = function(who) {};
Entity.getYaw = function(who) {};
Entity.getZ = function(who) {};
Entity.hasEffect = function(who, effectId) {};
Entity.isImmobile = function(who) {};
Entity.isSneaking = function(who) {};
Entity.isValid = function(who) {};
Entity.remove = function(who) {};
Entity.removeAllEffects = function(who) {};
Entity.removeEffect = function(who, effectId) {};
Entity.rideAnimal = function(who, target) {};
Entity.setAnimalAge = function(who, age) {};
Entity.setArmor = function(who, slot, id, count, data, what) {};
Entity.setArmorSlot = function(who, slot, id, count, data, what) {};
Entity.setCarriedItem = function(who, id, count, data, what) {};
Entity.setCollisionSize = function(who, double1, double2) {};
Entity.setCompoundTag = function(who, what) {};
Entity.setDroppedItem = function(who, id, count, data, what) {};
Entity.setFireTicks = function(who, number, bool) {};
Entity.setHealth = function(who, number) {};
Entity.setImmobile = function(who, bool) {};
Entity.setMaxHealth = function(who, number) {};
Entity.setMobSkin = function(who, str) {};
Entity.setNameTag = function(who, str) {};
Entity.setOffhandItem = function(who, id, count, data, what) {};
Entity.setPosition = function(who, dx, dy, dz) {};
Entity.setPositionAxis = function(who, number, double) {};
Entity.setRenderType = function(who, number) {};
Entity.setRot = function(who, double1, double2) {};
Entity.setRotation = function(who, double1, double2) {};
Entity.setRotationAxis = function(who, number, double) {};
Entity.setSkin = function(who, str) {};
Entity.setSneaking = function(who, bool) {};
Entity.setTarget = function(who, target) {};
Entity.setVelocity = function(who, vx, vy, vz) {};
Entity.setVelocityAxis = function(who, number, double) {};
