var MobRegistry = {};
MobRegistry.customEntities = {};
MobRegistry.loadedEntities = [];
MobRegistry.registerEntity = function(name) {
	return {
		nameId: "test",
		controllers: {
			event: {
				update: (function () {this.tick();}),
				tick: (function () {}),
				removed: (function () {}),
				created: (function (extra) {}),
				loaded: (function () {}),
				unloaded: (function () {}),
				attackedBy: (function (attacker) {}),
				hurtBy: (function (attacker, damage) {}),
				death: (function (attacker) {}),
				projectileHit: (function (projectile) {}),
				save: (function () {}),
				read: (function () {}),
				parent: null,
				__controller_name: "event"
			},
			description: {
				isDynamic: false,
				getHitbox: (function () {return {w: 0.99, h: 0.99};}),
				getHealth: (function () {return 20;}),
				getNameTag: (function () {return null;}),
				getDrop: (function (attacker) {return [];}),
				created: (function () {var health = this.getHealth();Entity.setMaxHealth(this.entity, health);Entity.setHealth(this.entity, health);}),
				loaded: (function () {var health = this.getHealth();Entity.setMaxHealth(this.entity, health);var hitbox = this.getHitbox();Entity.setCollisionSize(this.entity, hitbox.w || 0, hitbox.h || 0);var nametag = this.getNameTag();if (nametag) {Entity.setNameTag(this.entity, nametag);} else {Entity.setNameTag(this.entity, "");}}),
				unloaded: (function () {}),
				removed: (function () {}),
				getNumberFromData: (function (data, defValue) {if (!data) {return defValue;}if (typeof (data) == "number") {return data;} else {if (data.min && data.max) {return parseInt((data.max - data.min + 1) * Math.random()) + data.min;} else {if (data.length) {return data[parseInt(data.length * Math.random())];} else {return defValue;}}}}),
				provideDrop: (function (attacker) {var drop = this.getDrop(attacker);var pos = EntityAPI.getPosition(this.entity);var dropItem = function (id, count, data, extra) {EntityAPI.setVelocity(Level.dropItem(pos.x, pos.y + 0.3, pos.z, 0, id, count, data, extra), Math.random() * 0.4 - 0.2, Math.random() * 0.3, Math.random() * 0.4 - 0.2);};for (var i in drop) {var item = drop[i];var chance = item.chance || 1;if (item.id && Math.random() < chance) {var count = this.getNumberFromData(item.count, 1);var data = this.getNumberFromData(item.data, 0);if (item.separate) {for (var j = 0; j < count; j++) {dropItem(item.id, 1, data);}} else {dropItem(item.id, count, data, item.extra);}}}}),
				death: (function (attacker) {this.provideDrop(attacker);}),
				update: (function () {}),
				save: (function () {}),
				read: (function () {}),
				parent: null,
				__controller_name: "description"
			},
			visual: {
				modelWatchers: {},
				modelWatcherStack: {},
				getModels: (function () {return {"main": ce_default_entity_model};}),
				createModelWatchers: (function () {this.modelWatchers = {};var models = this.getModels();if (!models.main) {models.main = ce_default_entity_model;}for (var name in models) {this.modelWatchers[name] = new ModelWatcher(this.entity, models[name]);}}),
				getModelWatcher: (function (name) {return this.modelWatchers[name];}),
				setModel: (function (name, ticks) {var watcher = this.getModelWatcher(name);if (!watcher) {Logger.Log("cannot set entity model: no model watcher for '" + name + "' found.", "ERROR");return;}if (!this.modelWatcherStack) {this.modelWatcherStack = [];}if (ticks >= 0) {this.modelWatcherStack.unshift({name: name, ticks: ticks});} else {this.modelWatcherStack = [{name: name, ticks: -1}];}watcher.resetAnimation();}),
				resetModel: (function () {this.modelWatcherStack = [];}),
				resetAllAnimations: (function () {for (var name in this.modelWatchers) {this.modelWatchers[name].resetAnimation();}}),
				getCurrentModelName: (function () {var current = this.modelWatcherStack[0];while (current && current.ticks == 0) {current = this.modelWatcherStack.shift();}if (!current) {return {name: "main", ticks: -1};} else {return current;}}),
				loaded: (function () {this.createModelWatchers();}),
				update: (function () {var current = this.getCurrentModelName();var watcher = this.getModelWatcher(current.name);if (watcher) {watcher.update();}current.ticks--;}),
				save: (function () {return this.modelWatcherStack;}),
				read: (function (data) {this.modelWatcherStack = data || [];}),
				parent: null,
				__controller_name: "visual"
			},
			AI: {
				currentPriority: 0,
				loadedAI: {},
				loadedData: {},
				isAILoaded: false,
				getAITypes: (function () {return {"main": {type: EntityAIIdle}};}),
				loadEntityAI: (function () {var types = this.getAITypes();this.loadedAI = {};for (var name in types) {var data = types[name];var AI = data.type.instantiate(this.parent, name);AI.setParams(data);var enabled = data.enable + "" == "undefined" ? true : data.enable;this.loadedAI[name] = {AI: AI, priority: data.priority || AI.getDefaultPriority(), enabled: enabled};if (enabled) {AI.executionStarted();}}for (var name in this.loadedData) {var data = this.loadedData[name];var ai = this.loadedAI[name];if (ai) {ai.priority = data.p;ai.enabled = data.e;ai.data = data.d || {};}}this.refreshPriorities();}),
				loaded: (function () {if (!this.isAILoaded) {this.loadEntityAI();this.aiLoaded();this.isAILoaded = true;} else {this.callAIevent("executionResumed");}}),
				nativeEntityChanged: (function () {this.callAIevent("aiEntityChanged", this.parent.entity);}),
				unloaded: (function () {this.callAIevent("executionPaused");}),
				aiLoaded: (function () {}),
				getAI: (function (name) {return this.loadedAI[name].AI;}),
				getPriority: (function (name) {return this.loadedAI[name].priority;}),
				enableAI: (function (name, priority, extra) {var data = this.loadedAI[name];if (data) {if (!data.enabled) {data.enabled = true;data.AI.executionStarted(extra);}this.setPriority(name, priority + "" == "undefined" ? data.priority : priority);}}),
				disableAI: (function (name) {var data = this.loadedAI[name];if (data && data.enabled) {data.enabled = false;data.AI.executionEnded();this.refreshPriorities();}}),
				setPriority: (function (name, priority) {var data = this.loadedAI[name];if (data && data.priority != priority) {var isActive = data.priority == this.currentPriority;data.priority = priority;this.refreshPriorities();if (isActive && data.priority != this.currentPriority) {data.AI.executionPaused();}}}),
				refreshPriorities: (function () {var maxPriority = -1;for (var name in this.loadedAI) {var data = this.loadedAI[name];if (data.enabled && maxPriority < data.priority) {maxPriority = data.priority;}}if (maxPriority != this.currentPriority) {for (var name in this.loadedAI) {var data = this.loadedAI[name];if (data.enabled) {if (data.priority == maxPriority) {data.AI.executionResumed();}if (data.priority == this.currentPriority) {data.AI.executionPaused();}}}}this.currentPriority = maxPriority;}),
				callAIevent: (function (eventName, parameter, extra) {for (var name in this.loadedAI) {var data = this.loadedAI[name];if (data.enabled) {data.AI[eventName](parameter, extra);}}}),
				update: (function () {for (var name in this.loadedAI) {var data = this.loadedAI[name];if (data.enabled && (data.priority == this.currentPriority || data.priority == -1)) {data.AI.__execute();}}this.tick();}),
				tick: (function () {}),
				attackedBy: (function (attacker) {this.callAIevent("attackedBy", attacker);}),
				hurtBy: (function (attacker, damage) {this.callAIevent("hurtBy", attacker, damage);}),
				death: (function (attacker) {this.callAIevent("death", attacker);}),
				projectileHit: (function (projectile) {this.callAIevent("projectileHit", projectile);}),
				save: (function () {var data = {};for (var name in this.loadedAI) {var ai = this.loadedAI[name];data[name] = {e: ai.enabled, p: ai.priority, d: ai.AI.data};}return data;}),
				read: (function (data) {this.loadedData = data;}),
				parent: null,
				__controller_name: "AI"
			}
		},
		isInstance: false,
		entity: null,
		age: 0,
		unloadedTime: 0,
		realPosition: null,
		__base_type: 28,
		saverId: 3556498,
		addController: (function (name, basicPrototype) {var controller = ModAPI.cloneObject(basicPrototype, true);controller.parent = null;controller.__controller_name = name;this[name] = controller;this.controllers[name] = controller;return this;}),
		customizeController: (function (name, customPrototype) {if (!this[name]) {Logger.Log("Cannot customize entity controller " + name + ": no such defined", "ERROR");return;}var customController = ModAPI.cloneObject(customPrototype, true);var baseController = this[name];for (var name in customController) {baseController[name] = customController[name];}}),
		customizeEvents: (function (custom) {this.customizeController("event", custom);}),
		customizeDescription: (function (custom) {this.customizeController("description", custom);}),
		customizeVisual: (function (custom) {this.customizeController("visual", custom);}),
		customizeAI: (function (custom) {this.customizeController("AI", custom);}),
		setBaseType: (function (type) {if (this.isInstance) {Logger.Log("cannot set base entity type on entity in world", "ERROR");return;}this.__base_type = type;}),
		callControllerEvent: (function () {var event = arguments[0];var params = [];for (var i in arguments) {if (i > 0) {params.push(arguments[i]);}}for (var name in this.controllers) {var controller = this.controllers[name];if (controller[event]) {controller[event].apply(controller, params);}}}),
		setNativeEntity: (function (entity) {this.entity = parseInt(entity);for (var name in this.controllers) {var controller = this.controllers[name];controller.entity = parseInt(entity);}this.callControllerEvent("nativeEntityChanged");}),
		recreateEntity: (function () {if (this.realPosition) {this.lockRemovalHook = true;Entity.remove(this.entity);this.lockRemovalHook = false;this.setNativeEntity(Level.spawnMob(this.realPosition.x, this.realPosition.y, this.realPosition.z, this.__base_type));if (!this.isLoaded) {this.isLoaded = true;this.callControllerEvent("loaded");}}}),
		getPlayerDistance: (function () {var dx = getPlayerX() - this.realPosition.x;var dz = getPlayerZ() - this.realPosition.z;return Math.sqrt(dx * dx + dz * dz);}),
		denyDespawn: (function () {this.isNaturalDespawnAllowed = false;this.isDespawnDenied = true;}),
		allowNaturalDespawn: (function () {this.isNaturalDespawnAllowed = true;this.isDespawnDenied = false;}),
		handleUnloadedState: (function () {this.unloadedTime++;if (this.age % 200 == 0) {if (!this.isDespawnDenied && CustomEntityConfig.despawn_unloaded_entities && this.unloadedTime > CustomEntityConfig.unloaded_despawn_time_in_secs) {this.destroy();} else {if (this.getPlayerDistance() < ENTITY_UNLOAD_DISTANCE) {if (!this.isNaturalDespawnAllowed) {if (!this.isDestroyed) {this.recreateEntity();}} else {this.destroy();}}}}}),
		update: (function () {if (this.age % 20 == 0) {var position = EntityAPI.getPosition(this.entity);var isLoaded = position.y > 0;if (isLoaded) {this.realPosition = position;}if (this.isLoaded && !isLoaded) {this.callControllerEvent("unloaded");}if (!this.isLoaded && isLoaded) {this.callControllerEvent("loaded");}this.isLoaded = isLoaded;if (isLoaded) {this.unloadedTime = 0;} else {this.handleUnloadedState();}}if (this.isLoaded) {for (var name in this.controllers) {this.controllers[name].update();}}this.age++;}),
		instantiate: (function (entity) {entity = parseInt(entity);var instance = ModAPI.cloneObject(this, true);instance.entity = entity;instance.realPosition = EntityAPI.getPosition(entity);instance.isInstance = true;instance.isLoaded = false;for (var name in instance.controllers) {var controller = instance.controllers[name];controller.parent = instance;controller.entity = entity;instance[name] = controller;}Saver.registerObject(instance, this.saverId);MobRegistry.registerUpdatableAsEntity(instance);Updatable.addUpdatable(instance);return instance;}),
		lockRemovalHook: false,
		registerRemoval: (function () {if (this.lockRemovalHook) {return;}this.isLoaded = false;if (EntityAPI.getXZPlayerDis(this.entity) > ENTITY_UNLOAD_DISTANCE) {this.callControllerEvent("unloaded");} else {this.destroy();}}),
		destroy: (function () {this.remove = this.isDestroyed = true;this.callControllerEvent("removed");Entity.remove(this.entity);this.callControllerEvent("unloaded");}),
		read: (function (data) {var instance;if (this.isInstance) {instance = this;} else {instance = this.instantiate(data.entity);}instance.entity = data.entity || null;instance.age = data.age || 0;instance.unloadedTime = data.unloaded || 0;instance.realPosition = data.rp || null;for (var name in data.controllers) {var controller = instance[name];if (controller) {controller.read(data.controllers[name]);controller.entity = instance.entity;} else {Logger.Log("Entity controller is missing " + name + " while reading entity data", "WARNING");}}}),
		save: (function () {var data = {entity: parseInt(this.entity), age: this.age, oneAndHalf: 1.5, unloaded: this.unloadedTime, controllers: {}, rp: this.realPosition};for (var name in this.controllers) {data.controllers[name] = this.controllers[name].save(name);}return data;}),
		event: {
			update: (function () {this.tick();}),
			tick: (function () {}),
			removed: (function () {}),
			created: (function (extra) {}),
			loaded: (function () {}),
			unloaded: (function () {}),
			attackedBy: (function (attacker) {}),
			hurtBy: (function (attacker, damage) {}),
			death: (function (attacker) {}),
			projectileHit: (function (projectile) {}),
			save: (function () {}),
			read: (function () {}),
			parent: null,
			__controller_name: "event"
		},
		description: {
			isDynamic: false,
			getHitbox: (function () {return {w: 0.99, h: 0.99};}),
			getHealth: (function () {return 20;}),
			getNameTag: (function () {return null;}),
			getDrop: (function (attacker) {return [];}),
			created: (function () {var health = this.getHealth();Entity.setMaxHealth(this.entity, health);Entity.setHealth(this.entity, health);}),
			loaded: (function () {var health = this.getHealth();Entity.setMaxHealth(this.entity, health);var hitbox = this.getHitbox();Entity.setCollisionSize(this.entity, hitbox.w || 0, hitbox.h || 0);var nametag = this.getNameTag();if (nametag) {Entity.setNameTag(this.entity, nametag);} else {Entity.setNameTag(this.entity, "");}}),
			unloaded: (function () {}),
			removed: (function () {}),
			getNumberFromData: (function (data, defValue) {if (!data) {return defValue;}if (typeof (data) == "number") {return data;} else {if (data.min && data.max) {return parseInt((data.max - data.min + 1) * Math.random()) + data.min;} else {if (data.length) {return data[parseInt(data.length * Math.random())];} else {return defValue;}}}}),
			provideDrop: (function (attacker) {var drop = this.getDrop(attacker);var pos = EntityAPI.getPosition(this.entity);var dropItem = function (id, count, data, extra) {EntityAPI.setVelocity(Level.dropItem(pos.x, pos.y + 0.3, pos.z, 0, id, count, data, extra), Math.random() * 0.4 - 0.2, Math.random() * 0.3, Math.random() * 0.4 - 0.2);};for (var i in drop) {var item = drop[i];var chance = item.chance || 1;if (item.id && Math.random() < chance) {var count = this.getNumberFromData(item.count, 1);var data = this.getNumberFromData(item.data, 0);if (item.separate) {for (var j = 0; j < count; j++) {dropItem(item.id, 1, data);}} else {dropItem(item.id, count, data, item.extra);}}}}),
			death: (function (attacker) {this.provideDrop(attacker);}),
			update: (function () {}),
			save: (function () {}),
			read: (function () {}),
			parent: null,
			__controller_name: "description"
		},
		visual: {
			modelWatchers: {},
			modelWatcherStack: {},
			getModels: (function () {return {"main": ce_default_entity_model};}),
			createModelWatchers: (function () {this.modelWatchers = {};var models = this.getModels();if (!models.main) {models.main = ce_default_entity_model;}for (var name in models) {this.modelWatchers[name] = new ModelWatcher(this.entity, models[name]);}}),
			getModelWatcher: (function (name) {return this.modelWatchers[name];}),
			setModel: (function (name, ticks) {var watcher = this.getModelWatcher(name);if (!watcher) {Logger.Log("cannot set entity model: no model watcher for '" + name + "' found.", "ERROR");return;}if (!this.modelWatcherStack) {this.modelWatcherStack = [];}if (ticks >= 0) {this.modelWatcherStack.unshift({name: name, ticks: ticks});} else {this.modelWatcherStack = [{name: name, ticks: -1}];}watcher.resetAnimation();}),
			resetModel: (function () {this.modelWatcherStack = [];}),
			resetAllAnimations: (function () {for (var name in this.modelWatchers) {this.modelWatchers[name].resetAnimation();}}),
			getCurrentModelName: (function () {var current = this.modelWatcherStack[0];while (current && current.ticks == 0) {current = this.modelWatcherStack.shift();}if (!current) {return {name: "main", ticks: -1};} else {return current;}}),
			loaded: (function () {this.createModelWatchers();}),
			update: (function () {var current = this.getCurrentModelName();var watcher = this.getModelWatcher(current.name);if (watcher) {watcher.update();}current.ticks--;}),
			save: (function () {return this.modelWatcherStack;}),
			read: (function (data) {this.modelWatcherStack = data || [];}),
			parent: null,
			__controller_name: "visual"
		},
		AI: {
			currentPriority: 0,
			loadedAI: {},
			loadedData: {},
			isAILoaded: false,
			getAITypes: (function () {return {"main": {type: EntityAIIdle}};}),
			loadEntityAI: (function () {var types = this.getAITypes();this.loadedAI = {};for (var name in types) {var data = types[name];var AI = data.type.instantiate(this.parent, name);AI.setParams(data);var enabled = data.enable + "" == "undefined" ? true : data.enable;this.loadedAI[name] = {AI: AI, priority: data.priority || AI.getDefaultPriority(), enabled: enabled};if (enabled) {AI.executionStarted();}}for (var name in this.loadedData) {var data = this.loadedData[name];var ai = this.loadedAI[name];if (ai) {ai.priority = data.p;ai.enabled = data.e;ai.data = data.d || {};}}this.refreshPriorities();}),
			loaded: (function () {if (!this.isAILoaded) {this.loadEntityAI();this.aiLoaded();this.isAILoaded = true;} else {this.callAIevent("executionResumed");}}),
			nativeEntityChanged: (function () {this.callAIevent("aiEntityChanged", this.parent.entity);}),
			unloaded: (function () {this.callAIevent("executionPaused");}),
			aiLoaded: (function () {}),
			getAI: (function (name) {return this.loadedAI[name].AI;}),
			getPriority: (function (name) {return this.loadedAI[name].priority;}),
			enableAI: (function (name, priority, extra) {var data = this.loadedAI[name];if (data) {if (!data.enabled) {data.enabled = true;data.AI.executionStarted(extra);}this.setPriority(name, priority + "" == "undefined" ? data.priority : priority);}}),
			disableAI: (function (name) {var data = this.loadedAI[name];if (data && data.enabled) {data.enabled = false;data.AI.executionEnded();this.refreshPriorities();}}),
			setPriority: (function (name, priority) {var data = this.loadedAI[name];if (data && data.priority != priority) {var isActive = data.priority == this.currentPriority;data.priority = priority;this.refreshPriorities();if (isActive && data.priority != this.currentPriority) {data.AI.executionPaused();}}}),
			refreshPriorities: (function () {var maxPriority = -1;for (var name in this.loadedAI) {var data = this.loadedAI[name];if (data.enabled && maxPriority < data.priority) {maxPriority = data.priority;}}if (maxPriority != this.currentPriority) {for (var name in this.loadedAI) {var data = this.loadedAI[name];if (data.enabled) {if (data.priority == maxPriority) {data.AI.executionResumed();}if (data.priority == this.currentPriority) {data.AI.executionPaused();}}}}this.currentPriority = maxPriority;}),
			callAIevent: (function (eventName, parameter, extra) {for (var name in this.loadedAI) {var data = this.loadedAI[name];if (data.enabled) {data.AI[eventName](parameter, extra);}}}),
			update: (function () {for (var name in this.loadedAI) {var data = this.loadedAI[name];if (data.enabled && (data.priority == this.currentPriority || data.priority == -1)) {data.AI.__execute();}}this.tick();}),
			tick: (function () {}),
			attackedBy: (function (attacker) {this.callAIevent("attackedBy", attacker);}),
			hurtBy: (function (attacker, damage) {this.callAIevent("hurtBy", attacker, damage);}),
			death: (function (attacker) {this.callAIevent("death", attacker);}),
			projectileHit: (function (projectile) {this.callAIevent("projectileHit", projectile);}),
			save: (function () {var data = {};for (var name in this.loadedAI) {var ai = this.loadedAI[name];data[name] = {e: ai.enabled, p: ai.priority, d: ai.AI.data};}return data;}),
			read: (function (data) {this.loadedData = data;}),
			parent: null,
			__controller_name: "AI"
		}
	};
};
MobRegistry.registerUpdatableAsEntity = function(updatable) {
	return null;
};
MobRegistry.spawnEntityAsPrototype = function(typeName, coords, extraData) {
	/* TypeError: Cannot read property "x" from undefined */
};
MobRegistry.getEntityUpdatable = function(entity) {
	return null;
};
MobRegistry.registerNativeEntity = function(entity) {
	return null;
};
MobRegistry.registerEntityRemove = function(entity) {
	return null;
};
MobRegistry.resetEngine = function() {
	return null;
};

function CustomEntity(nameId) {
	return null;
}
var ENTITY_UNLOAD_DISTANCE = 56;
var CustomEntityConfig = {};
CustomEntityConfig.unloaded_despawn_time_in_secs = 600;
CustomEntityConfig.despawn_unloaded_entities = true;
