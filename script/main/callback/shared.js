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
		if (!thereIsNoTPSMeter) {
			TPSMeter.onTick();
		}
	});
});

const API = {
	tryout: tryout,
	tryoutSafety: tryoutSafety,
	require: require,
	handle: handle,
	handleAction: handleAction,
	acquire: acquire,
	handleThread: handleThread,
	registerTool: function(id, tool) {
		if (Tools.hasOwnProperty(id)) {
			Logger.Log("ModdingTools: id " + id + " is already occupied", "WARNING");
			return;
		}
		Logger.Log("ModdingTools: registered adaptive tool " + id, "DEBUG");
		Tools[id] = tool;
	},
	registerMenuTool: function(id, tool, entry) {
		if (Tools.hasOwnProperty(id)) {
			Logger.Log("ModdingTools: id " + id + " is already occupied", "WARNING");
			return;
		}
		if (entry === undefined) {
			entry = new ProjectTool.MenuFactory();
		}
		if (!entry instanceof ProjectTool.MenuFactory) {
			MCSystem.throwException("ModdingTools: registerMenuTool entry must be instance of Tool.MenuEntry");
		}
		Logger.Log("ModdingTools: registered tool " + id + " into menu entry", "DEBUG");
		PROJECT_TOOL.tools[id] = entry;
		Tools[id] = tool;
	},
	registerBitsetUi: registerBitsetUi,

	translate: translate,
	translateCounter: translateCounter,
	translateCode: translateCode,
	reportTrace: reportTrace,
	reportError: reportError,
	retraceOrReport: retraceOrReport,
	localizeError: localizeError,

	random: random,
	isEmpty: isEmpty,
	preround: preround,
	calloutOrParse: calloutOrParse,
	parseCallback: parseCallback,
	MathUtils: MathUtils,
	Base64: Base64,
	getTime: getTime,
	launchTime: launchTime,
	isHorizon: isHorizon,

	getContext: getContext,
	getTypeface: function() {
		return typeface;
	},
	confirm: confirm,
	select: select,
	getPlayerEnt: getPlayerEnt,

	findCorePackage: findCorePackage,
	findAssertionPackage: findAssertionPackage,
	findEditorPackage: findEditorPackage,
	isCoreEngineLoaded: isCoreEngineLoaded,
	getCoreEngineAndInjectIfNeeded: getCoreEngineAndInjectIfNeeded,

	resetSettingIfNeeded: resetSettingIfNeeded,
	loadSetting: loadSetting,
	injectSetting: setSetting,
	updateInternalConfig: updateSettings,
	formatSize: formatSize,
	Dirs: Dirs,
	MediaTypes: MediaTypes,
	Files: Files,
	Archives: Archives,
	Options: Options,
	Hashable: Hashable,

	ImageFactory: ImageFactory,
	AssetFactory: AssetFactory,
	HashedDrawableMap: HashedDrawableMap,
	Drawable: Drawable,
	CachedDrawable: CachedDrawable,
	ScheduledDrawable: ScheduledDrawable,
	LayerDrawable: LayerDrawable,
	ClipDrawable: ClipDrawable,
	ColorDrawable: ColorDrawable,
	BitmapFactory: BitmapFactory,
	BitmapDrawable: BitmapDrawable,
	BitmapDrawableFactory: BitmapDrawableFactory,
	AnimationDrawable: AnimationDrawable,
	AnimationDrawableFactory: AnimationDrawableFactory,
	DrawableFactory: DrawableFactory,

	assign: assign,
	merge: merge,
	clone: clone,
	requireMethod: requireMethod,
	requireClass: requireClass,

	CoreEngine: $,
	Action: Action,
	// ModBrowser: ModBrowser,
	Network: Network,
	Transition: Transition,

	Interface: Interface,
	Fragment: Fragment,
	FrameFragment: FrameFragment,
	Frame: Frame,
	FocusableWindow: FocusableWindow,
	TransitionWindow: TransitionWindow,
	UniqueWindow: UniqueWindow,
	FocusablePopup: FocusablePopup,

	WindowProvider: WindowProvider,
	UniqueHelper: UniqueHelper,
	AdditionalMessage: AdditionalMessage,

	ControlFragment: ControlFragment,
	ControlWindow: ControlWindow,
	LogotypeFragment: LogotypeFragment,
	LogotypeWindow: LogotypeWindow,
	OverlayFragment: OverlayFragment,
	OverlayWindow: OverlayWindow,
	SidebarFragment: SidebarFragment,
	SidebarWindow: SidebarWindow,
	MenuWindow: MenuWindow,
	ExplorerWindow: ExplorerWindow,
	HintAlert: HintAlert,

	openPopup: function(id, popup) {
		Popups.open(popup, id);
	},
	closePopup: function(id) {
		return Popups.closeIfOpened(id);
	},
	closePopupGroup: function(id) {
		Popups.closeAllByTag(id);
	},
	closeAllPopups: function() {
		Popups.closeAll();
	},
	hasOpenedPopup: function(id) {
		return Popups.hasOpenedByName(id);
	},
	updatePopup: function(id) {
		return Popups.updateAtName(id);
	},
	updateAllPopups: function() {
		Popups.updateAll();
	},

	HieraclyPopup: HieraclyPopup,
	ListingPopup: ListingPopup,
	CoordsPopup: CoordsPopup,

	showHint: showHint,
	getUserCode: getUserCode,
	checkOnlineable: checkOnlineable,
	stringifyObject: stringifyObject,
	readFileAsync: readFile,
	formatExceptionReport: formatExceptionReport,
	selectFile: selectFile,
	saveFile: saveFile,
	selectProjectData: selectProjectData,

	compileScript: compileScript,
	compileData: compileData,
	getScriptScope: getScriptScope,
	exportProject: exportProject,
	importProject: importProject,
	importScript: importScript,

	attachAdditionalInformation: attachAdditionalInformation,
	attachWarningInformation: attachWarningInformation,
	prepareAdditionalInformation: prepareAdditionalInformation,
	finishAttachAdditionalInformation: finishAttachAdditionalInformation,

	Project: Project,
	ProjectProvider: ProjectProvider,
	ScriptConverter: ScriptConverter,

	Sequence: Sequence,
	LogotypeSequence: LogotypeSequence,
	TutorialSequence: TutorialSequence,
	SnackSequence: SnackSequence,
	StackedSnackSequence: StackedSnackSequence,
	AsyncSnackSequence: AsyncSnackSequence,

	Tool: Tool,
	ControlTool: ControlTool,
	SidebarTool: SidebarTool,
	ProjectTool: ProjectTool,
	EditorTool: EditorTool,

	attachProjectTool: attachProjectTool,

	LogViewer: LogViewer,
	ModificationSource: ModificationSource,
	LevelProvider: LevelProvider,
	RuntimeCodeEvaluate: RuntimeCodeEvaluate,

	$: {
		LevelInfo: LevelInfo,
		Files: FileTools,
		MCSystem: MCSystem
	},

	Supportable: {
		canLeaveAtMoment: function() {
			return !isSupportEnv;
		},
		getCurrentEnvironment: function() {
			return currentEnvironment;
		},
		sendBackstageStatus: function() {
			restart();
		}
	},

	showSupportableInformation: showSupportableInfo,
	isAnyCustomSupportableLoaded: isAnyCustomSupportableLoaded
};
