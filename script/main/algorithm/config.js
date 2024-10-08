function resetSettingIfNeeded(key, value, minOrIteratorOrValue, maxOrValues, filter, exclude) {
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

function loadSetting(key, type) {
	let args = Array.prototype.slice.call(arguments);
	let config = this.__config__ || __config__;
	switch (type) {
		case "bool":
		case "boolean":
			args[1] = !!config.getBool(key);
			break;
		case "number":
			args[1] = Number(config.getNumber(key));
			break;
		case "string":
			args[1] = "" + config.getString(key);
			break;
		default:
			args[1] = config.get(key);
	}
	return resetSettingIfNeeded.apply(this, args);
};

function injectSetting(where, key, type) {
	if (!this.hasOwnProperty(where)) {
		Logger.Log("Modding Tools: Unresolved property " + where + ", are you sure that it used anywhere?", "WARNING");
	}
	this[where] = loadSetting.apply(this, Array.prototype.slice.call(arguments, 1));
};

/**
 * Update settings from config.
 */
function updateInternalConfig() {
	try {
		injectSetting("uiScaler", "interface.interface_scale", "number", .75, 1.5);
		injectSetting("fontScale", "interface.font_scale", "number", .75, 1.5);
		injectSetting("maxWindows", "interface.max_windows", "number", 1, 15);
		injectSetting("menuDividers", "interface.show_dividers", "boolean");
		injectSetting("projectHeaderBackground", "interface.header_background", "boolean");
		injectSetting("maximumHints", "performance.maximum_hints", "number", 1, 100);
		injectSetting("hintStackableDenied", "performance.hint_stackable", "boolean", function(value) {
			return !value;
		});
		injectSetting("showProcesses", "performance.show_processes", "boolean");
		injectSetting("safetyProcesses", "performance.safety_processes", "boolean");
		injectSetting("autosave", "autosave.enabled", "boolean");
		injectSetting("autosaveInterface", "autosave.with_interface", "boolean", false);
		injectSetting("autosavePeriod", "autosave.between_period", "number", 0, 300, [1, 2, 3, 4], true);
		injectSetting("autosaveProjectable", "autosave.as_projectable");
		injectSetting("autosaveCount", "autosave.maximum_count", "number", 0, 50);
		injectSetting("noImportedScripts", "user_login.imported_script", "boolean", function(value) {
			return !value;
		});
		injectSetting("sendAnalytics", "user_login.send_analytics", "boolean", true);
		injectSetting("importAutoselect", "other.import_autoselect", "boolean");
		__config__.save();
	} catch (e) {
		reportError(e);
	}
};

// TODO: Not fetches modpack config :(
// updateInternalConfig();

const isFirstLaunch = function() {
	return loadSetting("user_login.first_launch", "boolean");
};
