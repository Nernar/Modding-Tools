const distanceBetween = function(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
};

const findNearestEntityInRange = function(o, entity, range) {
	for (let i = 0; i < o.length; i++) {
		let coords = Entity.getPosition(o[i]);
		let sqrt = distanceBetween(X, coords.x, Y, coords.y, Z, coords.z);
		if (range < sqrt || entity == o[i]) continue;
		return o[i];
	}
	return 0;
};

Object.defineProperties(GLOBAL, {
	ENTITIES: {
		get: function() {
			return Entity.getAll();
		},
		enumerable: true,
		configurable: false
	},
	SOMEONE: {
		get: function() {
			let entities = ENTITIES;
			return entities[random(entities.length)];
		},
		enumerable: true,
		configurable: false
	}
});

const defineItemByDescriptor = function(o, key, getter, setter) {
	key = key && key.length > 0 ? key + "_" : new String();
	Object.defineProperty(o, key + "ID", {
		get: function() {
			return o[getter].id;
		},
		set: function(value) {
			o[setter](value, o[key + "COUNT"], o[key + "DATA"], o[key + "EXTRA"]);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "COUNT", {
		get: function() {
			return o[getter].count;
		},
		set: function(value) {
			o[setter](o[key + "ID"], value, o[key + "DATA"], o[key + "EXTRA"]);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "DATA", {
		get: function() {
			return o[getter].data;
		},
		set: function(value) {
			o[setter](o[key + "ID"], o[key + "COUNT"], value, o[key + "EXTRA"]);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "EXTRA", {
		get: function() {
			return o[getter].extra;
		},
		set: function(value) {
			o[setter](o[key + "ID"], o[key + "COUNT"], o[key + "DATA"], value);
		},
		enumerable: true,
		configurable: false
	});
};

const defineEntityInventory = function(o, key, entity) {
	key = key && key.length > 0 ? key + "_" : new String();
	Object.defineProperty(o, key + "CARRIED", {
		get: function() {
			return Entity.getCarriedItem(o[entity]);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "setCarriedItem", {
		value: function(id, count, data, extra) {
			Entity.setCarriedItem(o[entity], id, count, data, extra);
		},
		enumerable: true,
		configurable: false
	});
	defineItemByDescriptor(o, key, key + "CARRIED", key + "setCarriedItem");
	Object.defineProperty(o, key + "OFFHAND", {
		get: function() {
			return Entity.getOffhandItem(o[entity]);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "setOffhandItem", {
		value: function(id, count, data, extra) {
			Entity.setOffhandItem(o[entity], id, count, data, extra);
		},
		enumerable: true,
		configurable: false
	});
	defineItemByDescriptor(o, key + "OFFHAND", key + "OFFHAND", key + "setOffhandItem");
};

const defineEntityLocation = function(o, key, entity) {
	key = key && key.length > 0 ? key + "_" : new String();
	Object.defineProperty(o, key + "X", {
		get: function() {
			return Entity.getX(o[entity]);
		},
		set: function(value) {
			Entity.setPositionAxis(o[entity], 0, value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "Y", {
		get: function() {
			return Entity.getY(o[entity]);
		},
		set: function(value) {
			Entity.setPositionAxis(o[entity], 1, value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "Z", {
		get: function() {
			return Entity.getZ(o[entity]);
		},
		set: function(value) {
			Entity.setPositionAxis(o[entity], 2, value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "YAW", {
		get: function() {
			return Entity.getYaw(o[entity]);
		},
		set: function(value) {
			Entity.setRotationAxis(o[entity], 0, value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "PITCH", {
		get: function() {
			return Entity.getPitch(o[entity]);
		},
		set: function(value) {
			Entity.setRotationAxis(o[entity], 1, value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "VX", {
		get: function() {
			return Entity.getVelX(o[entity]);
		},
		set: function(value) {
			Entity.setVelocityAxis(o[entity], 0, value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "VY", {
		get: function() {
			return Entity.getVelY(o[entity]);
		},
		set: function(value) {
			Entity.setVelocityAxis(o[entity], 1, value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "VZ", {
		get: function() {
			return Entity.getVelZ(o[entity]);
		},
		set: function(value) {
			Entity.setVelocityAxis(o[entity], 2, value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "DIMENSION", {
		get: function() {
			return Entity.getDimension(o[entity]);
		},
		set: function(value) {
			Dimensions.transfer(o[entity], value);
		},
		enumerable: true,
		configurable: false
	});
};

const defineEntitySomewhereAround = function(o, key, entity) {
	key = key && key.length > 0 ? key + "_" : new String();
	Object.defineProperty(o, key + "NEAREST", {
		get: function() {
			return findNearestEntityInRange(ENTITIES, o[entity]);
		},
		enumerable: true,
		configurable: false
	});
};

const defineEntity = function(o, key, entity) {
	defineEntityInventory(o, key, entity);
	defineEntityLocation(o, key, entity);
	defineRangeAroundEntity(o, key, entity);
	defineEntitySomewhereAround(o, key, entity);
};

defineEntity(GLOBAL, "SOMEONE", "SOMEONE");
