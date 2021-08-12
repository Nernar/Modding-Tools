const findBlockInAround = function(region, x, y, z, axis) {
	let avoid = [[-1, 0], [0, -1], [1, 0], [0, 1]];
	for (let i = 0; i < avoid.length; i++) {
		let dx = x + avoid[i][0], dz = z + avoid[i][1];
		if (region.getBlockId(dx, y, dz) == 0) {
			continue;
		}
		return [dx, y, dz][axis];
	}
	return [x, y, z][axis];
};

Object.defineProperties(GLOBAL, {
	REGION: {
		get: function() {
			return BlockSource.getCurrentClientRegion();
		},
		enumerable: true,
		configurable: false
	}
});

const defineBlockInRegion = function(o, key, region, dx, dy, dz) {
	key = key && key.length > 0 ? key + "_" : new String();
	Object.defineProperty(o, key + "ID", {
		get: function() {
			return o[region].getBlockId(o[dx], o[dy], o[dz]);
		},
		set: function(value) {
			o[region].setBlock(o[dx], o[dy], o[dz], value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "DATA", {
		get: function() {
			return o[region].getBlockData(o[dx], o[dy], o[dz]);
		},
		set: function(value) {
			o[region].setBlock(o[dx], o[dy], o[dz], o[key + "ID"], value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "BLOCK", {
		get: function() {
			return o[region].getBlock(o[dx], o[dy], o[dz]);
		},
		set: function(value) {
			o[region].setBlock(o[dx], o[dy], o[dz], value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "EXTRA_ID", {
		get: function() {
			let instance = o[key + "EXTRA_BLOCK"];
			return instance ? instance.getId() : 0;
		},
		set: function(value) {
			o[region].setExtraBlock(o[dx], o[dy], o[dz], value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "EXTRA_DATA", {
		get: function() {
			let instance = o[key + "EXTRA_BLOCK"];
			return instance ? instance.getData() : 0;
		},
		set: function(value) {
			o[region].setExtraBlock(o[dx], o[dy], o[dz], o[key + "EXTRA_ID"], value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "EXTRA_BLOCK", {
		get: function() {
			return o[region].getExtraBlock(o[dx], o[dy], o[dz]);
		},
		set: function(value) {
			o[region].setExtraBlock(o[dx], o[dy], o[dz], value);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "TILE", {
		get: function() {
			return o[region].getBlockEntity(o[dx], o[dy], o[dz]);
		},
		enumerable: true,
		configurable: false
	});
};

const defineRangeAroundLocation = function(o, key, region, dx, dy, dz) {
	key = key && key.length > 0 ? key + "_" : new String();
	Object.defineProperty(o, key + "STEP_Y", {
		get: function() {
			return o[dy] - 1;
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "OVER_Y", {
		get: function() {
			return o[dy] + 2;
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "AROUND_X", {
		get: function() {
			return findBlockInAround(o[region], o[dx], o[dy], o[dz], 0);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "AROUND_Z", {
		get: function() {
			return findBlockInAround(o[region], o[dx], o[dy], o[dz], 2);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "BEHIND_X", {
		get: function() {
			return findBlockInAround(o[region], o[dx], o[dy], o[dz], 0);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "BEHIND_Y", {
		get: function() {
			return o[dy] + 1;
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "BEHIND_Z", {
		get: function() {
			return findBlockInAround(o[region], o[dx], o[dy], o[dz], 2);
		},
		enumerable: true,
		configurable: false
	});
	defineBlockInRegion(o, key + "STEP", region, dx, "STEP_Y", dz);
	defineBlockInRegion(o, key + "OVER", region, dx, "OVER_Y", dz);
	defineBlockInRegion(o, key + "AROUND", region, key + "AROUND_X", dy, key + "AROUND_Z");
	defineBlockInRegion(o, key + "BEHIND", region, key + "BEHIND_X", key + "BEHIND_Y", key + "BEHIND_Z");
};

const defineRangeAroundEntity = function(o, key, entity) {
	key = key && key.length > 0 ? key + "_" : new String();
	Object.defineProperty(o, key + "REGION", {
		get: function() {
			return BlockSource.getDefaultForActor(o[entity]);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "CHUNK_X", {
		get: function() {
			return Math.floor(o[key + "X"] / 16);
		},
		set: function(value) {
			o[key + "X"] = o[key + "X"] % 16 + (value * 16);
		},
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(o, key + "CHUNK_Z", {
		get: function() {
			return Math.floor(o[key + "Z"] / 16);
		},
		set: function(value) {
			o[key + "Z"] = o[key + "Z"] % 16 + (value * 16);
		},
		enumerable: true,
		configurable: false
	});
	defineRangeAroundLocation(o, arguments[1], key + "REGION", key + "X", key + "Y", key + "Z");
};
