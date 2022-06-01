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
		let config = this.__config__ || __config__;
		config.set(key, value);
	}
	return value;
};

const loadSetting = function(key, type) {
	let args = Array.prototype.slice.call(arguments);
	let config = this.__config__ || __config__;
	switch (type) {
		case "bool":
		case "boolean":
			args[1] = Boolean(config.getBool(key));
			break;
		case "number":
			args[1] = Number(config.getNumber(key));
			break;
		case "string":
			args[1] = String(config.getString(key));
			break;
		default:
			args[1] = config.get(key);
	}
	return resetSettingIfNeeded.apply(this, args);
};

const setSetting = function(where, key, type) {
	if (!this.hasOwnProperty(where)) {
		Logger.Log("Unresolved property " + where + ", are you sure that it used anywhere?", "WARNING");
	}
	this[where] = loadSetting.apply(this, Array.prototype.slice.call(arguments, 1));
};

/**
 * Update settings from config.
 */
const updateSettings = function() {
	tryout.call(this, function() {
		setSetting("uiScaler", "interface.interface_scale", "number", .75, 1.5);
		setSetting("fontScale", "interface.font_scale", "number", .75, 1.5);
		setSetting("maxWindows", "interface.max_windows", "number", 1, 15);
		setSetting("menuDividers", "interface.show_dividers", "boolean");
		setSetting("projectHeaderBackground", "interface.header_background", "boolean");
		setSetting("maximumHints", "performance.maximum_hints", "number", 1, 100);
		setSetting("hintStackableDenied", "performance.hint_stackable", "boolean", function(value) {
			return !value;
		});
		setSetting("showProcesses", "performance.show_processes", "boolean");
		setSetting("safetyProcesses", "performance.safety_processes", "boolean");
		setSetting("autosave", "autosave.enabled", "boolean");
		setSetting("autosaveInterface", "autosave.with_interface", "boolean", false);
		setSetting("autosavePeriod", "autosave.between_period", "number", 0, 300, [1, 2, 3, 4], true);
		setSetting("autosaveProjectable", "autosave.as_projectable");
		setSetting("autosaveCount", "autosave.maximum_count", "number", 0, 50);
		setSetting("entityBoxType", "render.use_box_sizes", "boolean", false);
		setSetting("drawSelection", "render.draw_selection", "boolean");
		setSetting("injectBorder", "render.inject_border", "boolean", false);
		setSetting("transparentBoxes", "render.transparent_boxes", "boolean", function(value) {
			if (!isHorizon && value) {
				Logger.Log("Transparent block renderer boxes not supported on Inner Core", "WARNING");
			}
			return value && isHorizon;
		});
		setSetting("ignoreKeyDeprecation", "user_login.ignore_deprecation", "boolean");
		setSetting("noImportedScripts", "user_login.imported_script", "boolean", function(value) {
			return !value;
		});
		setSetting("sendAnalytics", "user_login.send_analytics", "boolean", true);
		setSetting("importAutoselect", "other.import_autoselect", "boolean");
		setSetting("saveCoords", "other.autosave_mapping", "boolean");
		__config__.save();
	});
};

updateSettings();

let selectMode = 0;

Callback.addCallback("LevelLoaded", function() {
	handle(function() {
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

const RETRY_TIME = 60000;

const checkOnlineable = function(action) {
	handleThread(function() {
		if (!Network.isOnline()) {
			warningMessage = "Please check network connection. Connect to collect updates, special events and prevent key deprecation.";
			handle(function() {
				checkOnlineable(action);
			}, RETRY_TIME);
			return;
		} else warningMessage = null;
		action && action();
	});
};
