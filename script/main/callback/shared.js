MCSystem.setLoadingTip(NAME + ": Injecting Callbacks");

const resetSettingIfNeeded = function(key, value, minOrIteratorOrValue, maxOrValues, filter, exclude) {
	if (minOrIteratorOrValue === undefined) {
		return value;
	}
	let base = value;
	if (minOrIteratorOrValue instanceof Function) {
		value = minOrIteratorOrValue(value);
		let tech = filter;
		filter = maxOrValues;
		exclude = tech;
	} else if (Array.isArray(maxOrValues)) {
		if (maxOrValues.indexOf(value) == -1) {
			value = minOrIteratorOrValue;
		}
	} else if (typeof minOrIteratorOrValue == "number") {
		if (value < minOrIteratorOrValue) {
			value = minOrIteratorOrValue;
		} else if (value > maxOrValues) {
			value = maxOrValues;
		}
	} else if (value !== minOrIteratorOrValue) {
		value = minOrIteratorOrValue;
		let tech = filter;
		filter = maxOrValues;
		exclude = tech;
	}
	if (filter instanceof Function) {
		value = filter(value);
	} else if (Array.isArray(filter)) {
		let index = filter.indexOf(value);
		if (!exclude && index == -1) {
			value = minOrIteratorOrValue;
		} else if (exclude && index != -1) {
			value = minOrIteratorOrValue;
		}
	}
	if (base !== value) {
		__config__.set(key, value);
	}
	return value;
};

const loadSetting = function(key, type) {
	let args = Array.prototype.slice.call(arguments);
	switch (type) {
		case "bool":
		case "boolean":
			args[1] = Boolean(__config__.getBool(key));
			break;
		case "number":
			args[1] = Number(__config__.getNumber(key));
			break;
		case "string":
			args[1] = String(__config__.getString(key));
			break;
		default:
			args[1] = __config__.get(key);
	}
	return resetSettingIfNeeded.apply(this, args);
};

/**
 * Update settings from config.
 */
const updateSettings = function() {
	tryout(function() {
		uiScaler = loadSetting("interface.interface_scale", "number", .75, 1.5);
		fontScale = loadSetting("interface.font_scale", "number", .75, 1.5);
		maxWindows = loadSetting("interface.max_windows", "number", 1, 15);
		menuDividers = loadSetting("interface.show_dividers", "boolean");
		projectHeaderBackground = loadSetting("interface.header_background", "boolean");
		maximumHints = loadSetting("performance.maximum_hints", "number", 1, 100);
		hintStackableDenied = !loadSetting("performance.hint_stackable", "boolean");
		showProcesses = loadSetting("performance.show_processes", "boolean");
		safetyProcesses = loadSetting("performance.safety_processes", "boolean");
		autosave = loadSetting("autosave.enabled", "boolean");
		/* autosaveInterface */
		loadSetting("autosave.with_interface", "boolean", false);
		autosavePeriod = loadSetting("autosave.between_period", "number", 0, 300, [1, 2, 3, 4], true);
		autosaveProjectable = __config__.getBool("autosave.as_projectable");
		/* autosaveCount */
		loadSetting("autosave.maximum_count", "number", 0, 50);
		/* entityBoxType */
		loadSetting("render.use_box_sizes", "boolean", false);
		drawSelection = loadSetting("render.draw_selection", "boolean");
		/* injectBorder */
		loadSetting("render.inject_border", "boolean", false);
		transparentBoxes = loadSetting("render.transparent_boxes", "boolean", function(value) {
			return value && isHorizon;
		});
		ignoreKeyDeprecation = loadSetting("user_login.ignore_deprecation", "boolean");
		noImportedScripts = !loadSetting("user_login.imported_script", "boolean");
		/* sendAnalytics */
		loadSetting("user_login.send_analytics", "boolean", true);
		importAutoselect = loadSetting("other.import_autoselect", "boolean");
		saveCoords = loadSetting("other.autosave_mapping", "boolean");
		__config__.save();
	});
};

let selectMode = 0;

Callback.addCallback("ItemUse", function(coords, item, block) {
	handle(function() {
		if (selectMode == 6) {
			// Entity summon by tapping.
			let position = coords.relative;
			(position.x += .5, position.y += .5, position.z += .5);
			let custom = Entity.spawnCustomAtCoords("__editorEntity__", position);
			Entity.setMobile(custom.entity, false);
			EntityEditor.data.worker.Define.addEntity(custom.entity);
			showHint(translate("Entity summoned"));
			selectMode = 0;
			EntityEditor.create();
		}
	});
});

let needTransitionReset = false;

Callback.addCallback("LevelPreLoaded", function() {
	tryout(function() {
		// Reset entity if entity isn't defined.
		if (ProjectProvider.getCurrentType() == "transition" &&
				TransitionEditor.data.worker.Define.getEntity() == -1) {
			TransitionEditor.data.worker.Define.setEntity(getPlayerEnt());
			needTransitionReset = true;
		}
	});
});

Callback.addCallback("LevelLoaded", function() {
	handle(function() {
		if (needTransitionReset) {
			TransitionEditor.data.worker.Define.resetStarting();
			Popups.closeAllByTag("transition");
			needTransitionReset = false;
		}
		if (LevelProvider.isAttached()) {
			LevelProvider.show();
		}
	});
});

Callback.addCallback("LevelLeft", function() {
	handle(function() {
		if (LevelProvider.isAttached()) {
			LevelProvider.hide();
		}
	});
});

Callback.addCallback("EntityHurt", function(attacker, victim) {
	handle(function() {
		// Hit entity selection.
		if (selectMode == 2 && attacker == getPlayerEnt()) {
			TransitionEditor.data.worker.Define.setEntity(victim);
			showHint(translate("Entity selected"));
			selectMode = 0, TransitionEditor.create();
		}
	});
});

let thereIsNoTPSMeter = false;

tryoutSafety.call(this, function() {
	let TPSMeter = findCorePackage().api.runtime.TPSMeter;
	this.TPSMeter = new TPSMeter(20, 1000);
}, function(e) {
	showHint(translate("Couldn't create engine TPS Meter"));
	thereIsNoTPSMeter = true;
});

Callback.addCallback("tick", function() {
	tryoutSafety(function() {
		// Mostly spawn selection particles.
		if (Updatable.getSyncTime() % 5 == 0) {
			if (ProjectProvider.getCurrentType() == "transition") {
				drawTransitionPoints(TransitionEditor.data.worker);
			}
		}
		if (!thereIsNoTPSMeter) {
			TPSMeter.onTick();
		}
	});
});
