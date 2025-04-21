function resetSettingIfNeeded(key: string, value: number, min: number, max: number, transformer: (value: number) => number): number;
function resetSettingIfNeeded(key: string, value: number, min: number, max: number, filter?: number[], exclude?: boolean): number;
function resetSettingIfNeeded<VT>(key: string, value: VT, transformer: (value: VT) => VT): VT;
function resetSettingIfNeeded<VT>(key: string, value: VT, fallback?: VT, filter?: VT[], exclude?: boolean): VT;

function resetSettingIfNeeded(key: string, value: any, transformerOrFallbackOrMin: any, maxOrValues?: any, transformerOrValues?: any, exclude?: any) {
	if (transformerOrFallbackOrMin === undefined) {
		return value;
	}
	let base = value;
	if (typeof transformerOrFallbackOrMin == "function") {
		value = transformerOrFallbackOrMin(value);
	} else if (typeof transformerOrFallbackOrMin == "number") {
		if (value < transformerOrFallbackOrMin) {
			value = transformerOrFallbackOrMin;
		} else if (value > maxOrValues) {
			value = maxOrValues;
		}
	} else if (value !== transformerOrFallbackOrMin) {
		value = transformerOrFallbackOrMin;
		exclude = transformerOrValues;
		transformerOrValues = maxOrValues;
	}
	if (typeof transformerOrFallbackOrMin != "function") {
		if (transformerOrValues instanceof Function) {
			value = transformerOrValues(value);
		} else if (Array.isArray(transformerOrValues)) {
			let index = transformerOrValues.indexOf(value);
			if (!exclude && index == -1) {
				value = transformerOrFallbackOrMin;
			} else if (exclude && index != -1) {
				value = transformerOrFallbackOrMin;
			}
		}
	}
	if (base !== value) {
		let config = this.__config__ || __config__;
		config.set(key, value);
	}
	return value;
}

function loadSetting(key: string, type: "number", min: number, max: number, transformer: (value: number) => number): number;
function loadSetting(key: string, type: "number", min: number, max: number, filter?: number[], exclude?: boolean): number;
function loadSetting<VT>(key: string, type: string, transformer: (value: VT) => VT): VT;
function loadSetting<VT>(key: string, value: string, fallback?: VT, filter?: VT[], exclude?: boolean): VT;

function loadSetting(key: string, type: string) {
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
}

function injectSetting(variable: string, key: string, type: "number", min: number, max: number, transformer: (value: number) => number): void;
function injectSetting(variable: string, key: string, type: "number", min: number, max: number, filter?: number[], exclude?: boolean): void;
function injectSetting<VT>(variable: string, key: string, type: string, transformer: (value: VT) => VT): void;
function injectSetting<VT>(variable: string, key: string, value: string, fallback?: VT, filter?: VT[], exclude?: boolean): void;

function injectSetting(variable: string) {
	if (!this.hasOwnProperty(variable)) {
		Logger.Log("Modding Tools: Unresolved property " + variable + ", are you sure that it used anywhere?", "WARNING");
	}
	this[variable] = loadSetting.apply(this, Array.prototype.slice.call(arguments, 1));
}

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
		injectSetting("hintStackableDenied", "performance.hint_stackable", "boolean", value => !value);
		injectSetting("showProcesses", "performance.show_processes", "boolean");
		injectSetting("safetyProcesses", "performance.safety_processes", "boolean");
		injectSetting("autosave", "autosave.enabled", "boolean");
		injectSetting("autosaveInterface", "autosave.with_interface", "boolean", false);
		injectSetting("autosavePeriod", "autosave.between_period", "number", 0, 300, [1, 2, 3, 4], true);
		injectSetting("autosaveProjectable", "autosave.as_projectable", "boolean");
		injectSetting("autosaveCount", "autosave.maximum_count", "number", 0, 50);
		injectSetting("noImportedScripts", "user_login.imported_script", "boolean", value => !value);
		injectSetting("sendAnalytics", "user_login.send_analytics", "boolean", true);
		injectSetting("importAutoselect", "other.import_autoselect", "boolean");
		__config__.save();
	} catch (e) {
		reportError(e);
	}
}

// TODO: Not fetches modpack config :(
// updateInternalConfig();

function isFirstLaunch() {
	return loadSetting("user_login.first_launch", "boolean");
}
