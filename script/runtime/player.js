Object.defineProperties(GLOBAL, {
	CLIENT: {
		get: function() {
			return MCSystem.getNetwork().getClient();
		},
		enumerable: true,
		configurable: false
	},
	PLAYER: {
		get: function() {
			return CLIENT.getPlayerUid();
		},
		enumerable: true,
		configurable: false
	},
	ACTOR: {
		get: function() {
			return new PlayerActor(GLOBAL.PLAYER);
		},
		enumerable: true,
		configurable: false
	},
	
	/** MANAGEMENT */
	IMMOBILE: {
		get: function() {
			return Entity.isImmobile(GLOBAL.PLAYER);
		},
		set: function(value) {
			Entity.setImmobile(GLOBAL.PLAYER, value);
		},
		enumerable: true,
		configurable: false
	},
	SNEAKING: {
		get: function() {
			return GLOBAL.ACTOR.isSneaking();
		},
		set: function(value) {
			GLOBAL.ACTOR.setSneaking(value);
		},
		enumerable: true,
		configurable: false
	},
	SLOT: {
		get: function() {
			return GLOBAL.ACTOR.getSelectedSlot();
		},
		set: function(value) {
			GLOBAL.ACTOR.setSelectedSlot(value);
		},
		enumerable: true,
		configurable: false
	},
	GAME_MODE: {
		get: function() {
			return GLOBAL.ACTOR.getGameMode();
		},
		set: function(value) {
			Level.setGameMode(value);
		},
		enumerable: true,
		configurable: false
	}
});

defineEntity(GLOBAL, null, "PLAYER");

const defineSlotForActor = function(o, key, index, actor, setter) {
	key = key && key.length > 0 ? key : "SLOT";
	Object.defineProperty(o, key, {
		get: function() {
			return o[actor].getInventorySlot(index);
		},
		enumerable: true,
		configurable: false
	});
	setter = setter && setter.length > 0 ? setter : "setInventorySlot";
	Object.defineProperty(o, setter, {
		value: function(id, count, data, extra) {
			return o[actor].setInventorySlot(index, id, count, data, extra);
		},
		enumerable: true,
		configurable: false
	});
};

for (let i = 0; i < 36; i++) {
	let name = "SLOT" + (i + 1), setter = "setInventorySlot" + (i + 1);
	defineSlotForActor(GLOBAL, name, i, "ACTOR", setter);
	defineItemByDescriptor(GLOBAL, name, name, setter);
}
