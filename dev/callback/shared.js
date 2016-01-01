MCSystem.setLoadingTip("Injecting Callbacks");

const resetSettingIfNeeded = function(key, value, minOrIteratorOrValue, maxOrValues, filter, exclude) {
	if (minOrIteratorOrValue == undefined) {
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
	} else if (value != minOrIteratorOrValue) {
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
	if (base != value) {
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
	try {
		uiScaler = loadSetting("interface.interface_scale", "number", 0.5, 2);
		fontScale = loadSetting("interface.font_scale", "number", 0.5, 2);
		maxWindows = loadSetting("interface.max_windows", "number", 1, 10);
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
		loadSetting("autosave.maximum_count", "number", 1, 50);
		CURRENTLY_SERVER_LOCATION = loadSetting("network.default_location", "number", 0, 1);
		SERVER_HAS_SAFE_CONNECTION = loadSetting("network.safe_connection", "boolean");
		SERVER_LOCATION_LOCKED = loadSetting("network.switch_locked", "boolean");
		entityBoxType = loadSetting("render.use_box_sizes", "boolean");
		drawSelection = loadSetting("render.draw_selection", "boolean");
		injectBorder = loadSetting("render.inject_border", "boolean");
		transparentBoxes = loadSetting("render.transparent_boxes", "boolean", function(value) {
			return value && isHorizon;
		});
		if (supportSupportables) {
			loadSupportables = loadSetting("supportable.enabled", "boolean");
		} else {
			Logger.Log("Supportables disabled, because it's not approved by developer", "Dev-Core");
		}
		ignoreKeyDeprecation = loadSetting("user_login.ignore_deprecation", "boolean");
		noImportedScripts = !loadSetting("user_login.imported_script", "boolean");
		/* sendAnalytics */
		loadSetting("user_login.send_analytics", "boolean", true);
		if (android.os.Build.VERSION.SDK_INT >= 26) {
			useOldExplorer = loadSetting("other.use_old_explorer", "boolean");
		} else useOldExplorer = true;
		importAutoselect = loadSetting("other.import_autoselect", "boolean");
		saveCoords = loadSetting("other.autosave_mapping", "boolean");
		__config__.save();
	} catch (e) {
		reportError(e);
	}
};

let selectMode = 0;

Callback.addCallback("ItemUse", function(coords, item, block) {
	handle(function() {
		if (selectMode == 1) {
			// Block selection by tapping.
			let render = new ICRender.Model();
			render.addEntry(new BlockRenderer.Model(block.id, block.data));
			BlockRenderer.enableCoordMapping(block.id, block.data, render);
			BlockEditor.data.worker.Define.addMapping(coords.x, coords.y, coords.z);
			selectMode = 0;
			BlockEditor.create();
		} else if (selectMode == 6) {
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
	try {
		// Reset entity if entity isn't defined
		if (ProjectProvider.getCurrentType() == "transition" &&
			TransitionEditor.data.worker.Define.getEntity() == -1) {
			TransitionEditor.data.worker.Define.setEntity(getPlayerEnt());
			needTransitionReset = true;
		}
	} catch (e) {
		reportError(e);
	}
});

Callback.addCallback("LevelLoaded", function() {
	context.runOnUiThread(function() {
		try {
			if (needTransitionReset) {
				TransitionEditor.data.worker.Define.resetStarting();
				Popups.closeAllByTag("transition");
				needTransitionReset = false;
			}
		} catch (e) {
			reportError(e);
		}
	});
});

Callback.addCallback("EntityHurt", function(attacker, victim) {
	context.runOnUiThread(function() {
		try {
			// Hit entity selection
			if (selectMode == 2 && attacker == getPlayerEnt()) {
				TransitionEditor.data.worker.Define.setEntity(victim);
				showHint(translate("Entity selected"));
				selectMode = 0, TransitionEditor.create();
			}
		} catch (e) {
			reportError(e);
		}
	});
});

Callback.addCallback("tick", function() {
	try {
		// Mostly spawn selection particles
		if (ProjectProvider.getCurrentType() == "transition") {
			drawTransitionPoints(TransitionEditor.data.worker);
		}
	} catch (e) {
		reportError(e);
	}
});
