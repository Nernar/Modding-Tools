const API = {
	USER_ID: "unknown",
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
	minecraftVersion: minecraftVersion,
		
	getContext: getContext,
	getTypeface: function() {
		return typeface;
	},
	confirm: confirm,
	select: select,
	getPlayerEnt: getPlayerEnt,
	
	INNERCORE_PACKAGE: INNERCORE_PACKAGE,
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
	
	CoreEngine: $,
	Action: Action,
	Network: Network,
	
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
	getPopupIds: function() {
		return Popups.getOpenedIds();
	},
	getPopups: function() {
		return Popups.getOpened();
	},
	
	ListingPopup: ListingPopup,
	CoordsPopup: CoordsPopup,
	
	showHint: showHint,
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
	InteractionTool: InteractionTool,
	MenuTool: MenuTool,
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
	
	Module: {
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
	showModuleInformation: showModuleInfo
};

(function(who) {
	for (let element in who) {
		if (this.hasOwnProperty(element)) {
			API[element] = who[element];
		}
	}
})("USER_ID", "ModBrowser", "Mehwrap");

const notifyCoreEngineLoaded = function() {
	$.ModAPI.registerAPI("ModdingTools", API);
};

const getCoreEngineAndInjectIfNeeded = function() {
	return tryout(function() {
		if (isCoreEngineLoaded()) {
			return $;
		}
		let instance = null;
		let CoreEngineAPI = INNERCORE_PACKAGE.api.mod.coreengine.CoreEngineAPI;
		let field = tryout(function() {
			return CoreEngineAPI.__javaObject__.getDeclaredField("ceHandlerSingleton");
		}, function(e) {
			let declared = CoreEngineAPI.__javaObject__.getDeclaredField("coreEngineHandler");
			instance = INNERCORE_PACKAGE.api.mod.API.getInstanceByName("CoreEngine");
			return declared;
		});
		field.setAccessible(true);
		let ceHandlerSingleton = field.get(instance);
		if (ceHandlerSingleton != null) {
			ceHandlerSingleton.injectCoreAPI($);
		}
		notifyCoreEngineLoaded();
		return $;
	}, $);
};

Callback.addCallback("PreBlocksDefined", function() {
	getCoreEngineAndInjectIfNeeded();
});
