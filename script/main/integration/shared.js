/**
 * If you thought you were missing feature that need, make sure
 * it's not deprecated or an environment internal feature.
 * Perhaps you should not interfere with itself work.
 */
const API = {
	USER_ID: "unknown",
	PRODUCT_REVISION: REVISION,
	INNERCORE_PACKAGE: INNERCORE_PACKAGE,
	isCoreEngineLoaded: isCoreEngineLoaded,
	CoreEngine: CoreEngine,
	
	// Retention
	isHorizon: isHorizon,
	minecraftVersion: minecraftVersion,
	tryout: tryout,
	tryoutSafety: tryoutSafety,
	require: require,
	handle: handle,
	handleThread: handleThread,
	handleAction: handleAction,
	acquire: acquire,
	resolveThrowable: resolveThrowable,
	translate: translate,
	translateCounter: translateCounter,
	translateCode: translateCode,
	toDigestMd5: toDigestMd5,
	vibrate: vibrate,
	reportError: reportError,
	reportTrace: reportTrace,
	localizeError: localizeError,
	
	// Android Ui
	getContext: getContext,
	getTypeface: function() {
		return typeface;
	},
	getDecorView: getDecorView,
	getDisplayWidth: getDisplayWidth,
	getDisplayPercentWidth: getDisplayPercentWidth,
	getRelativeDisplayPercentWidth: getRelativeDisplayPercentWidth,
	getDisplayHeight: getDisplayHeight,
	getDisplayPercentHeight: getDisplayPercentHeight,
	getRelativeDisplayPercentHeight: getRelativeDisplayPercentHeight,
	getDisplayDensity: getDisplayDensity,
	toComplexUnitDip: toComplexUnitDip,
	toRawComplexUnitDip: toRawComplexUnitDip,
	toComplexUnitSp: toComplexUnitSp,
	toRawComplexUnitSp: toRawComplexUnitSp,
	
	// Global registry
	registerTool: function(id, tool) {
		if (Tools.hasOwnProperty(id)) {
			Logger.Log("ModdingTools: id " + id + " is already occupied", "WARNING");
			return;
		}
		log("ModdingTools: registered custom adaptive tool " + id);
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
		if (!(entry instanceof ProjectTool.MenuFactory)) {
			MCSystem.throwException("ModdingTools: registerMenuTool entry must be instance of Tool.MenuEntry");
		}
		log("ModdingTools: registered tool " + id + " into menu entry");
		PROJECT_TOOL.tools[id] = entry;
		Tools[id] = tool;
	},
	registerBitsetUi: registerBitsetUi,
	registerFragmentJson: registerFragmentJson,
	registerWindowJson: registerWindowJson,
	
	// Helper functions
	random: random,
	isEmpty: isEmpty,
	assign: assign,
	merge: merge,
	clone: clone,
	preround: preround,
	calloutOrParse: calloutOrParse,
	parseCallback: parseCallback,
	MathUtils: MathUtils,
	Base64: Base64,
	playTune: playTune,
	playTuneDirectly: playTuneDirectly,
	stopTune: stopTune,
	getPlayerEnt: getPlayerEnt,
	
	// Dialogues
	confirm: confirm,
	select: select,
	showHint: showHint,
	checkOnlineable: checkOnlineable,
	stringifyObject: stringifyObject,
	formatExceptionReport: formatExceptionReport,
	selectFile: selectFile,
	saveFile: saveFile,
	readFileAsync: readFile,
	
	// Storage utility
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
	
	// Decoding resources
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
	
	// Fragment prototypes
	Fragment: Fragment,
	BaseFragment: BaseFragment,
	LayoutFragment: LayoutFragment,
	FrameFragment: FrameFragment,
	ScrollFragment: ScrollFragment,
	TextFragment: TextFragment,
	ImageFragment: ImageFragment,
	
	// Fragment variations
	CategoryTitleFragment: CategoryTitleFragment,
	ExplanatoryFragment: ExplanatoryFragment,
	ThinButtonFragment: ThinButtonFragment,
	SolidButtonFragment: SolidButtonFragment,
	PropertyInputFragment: PropertyInputFragment,
	SliderFragment: SliderFragment,
	CounterFragment: CounterFragment,
	AxisGroupFragment: AxisGroupFragment,
	EditorFragment: EditorFragment,
	
	// Under-refactored fragments
	OverlayFragment: OverlayFragment,
	ControlFragment: ControlFragment,
	LogotypeFragment: LogotypeFragment,
	SidebarFragment: SidebarFragment,
	
	// Window prototypes
	WindowProxy: WindowProxy,
	FocusableWindow: FocusableWindow,
	TransitionWindow: TransitionWindow,
	UniqueWindow: UniqueWindow,
	WindowProvider: WindowProvider,
	UniqueHelper: UniqueHelper,
	LevelProvider: LevelProvider,
	FocusableFragment: FocusableFragment,
	FocusablePopup: FocusablePopup,
	ExpandableFragment: ExpandableFragment,
	ExpandablePopup: ExpandablePopup,
	
	// Window variations
	AdditionalMessage: AdditionalMessage,
	AdditionalMessageFactory: AdditionalMessageFactory,
	HintAlert: HintAlert,
	ExplorerWindow: ExplorerWindow,
	OverlayWindow: OverlayWindow,
	ControlWindow: ControlWindow,
	LogotypeWindow: LogotypeWindow,
	MenuWindow: MenuWindow,
	SidebarWindow: SidebarWindow,
	
	// Frames (something thoughtless right now)
	Frame: Frame,
	
	// Functions used inside popup prototypes
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
	
	// Project
	compileScript: compileScript,
	compileData: compileData,
	getScriptScope: getScriptScope,
	exportProject: exportProject,
	importProject: importProject,
	importScript: importScript,
	selectProjectData: selectProjectData,
	Project: Project,
	ProjectProvider: ProjectProvider,
	ScriptConverter: ScriptConverter,
	
	// Tools
	Action: Action,
	Tool: Tool,
	InteractionTool: InteractionTool,
	MenuTool: MenuTool,
	SidebarTool: SidebarTool,
	ProjectTool: ProjectTool,
	EditorTool: EditorTool,
	attachProjectTool: attachProjectTool,
	
	// Sequence
	Sequence: Sequence,
	LogotypeSequence: LogotypeSequence,
	TutorialSequence: TutorialSequence,
	SnackSequence: SnackSequence,
	StackedSnackSequence: StackedSnackSequence,
	AsyncSnackSequence: AsyncSnackSequence,
	
	// Specific content
	LogViewer: LogViewer,
	ModificationSource: ModificationSource,
	LevelProvider: LevelProvider,
	RuntimeCodeEvaluate: RuntimeCodeEvaluate,
	
	// For internal support launching other modifications
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
	showModuleInformation: showModuleInfo,
	
	// Deprecated way to add additional information
	registerAdditionalInformation: registerAdditionalInformation,
	attachAdditionalInformation: attachAdditionalInformation,
	attachWarningInformation: attachWarningInformation,
	prepareAdditionalInformation: prepareAdditionalInformation,
	finishAttachAdditionalInformation: finishAttachAdditionalInformation
};

(function(who) {
	for (let element in who) {
		if (this.hasOwnProperty(element)) {
			API[element] = who[element];
		}
	}
})("USER_ID", "Network", "JsonIo", "ModBrowser", "Mehwrap");

const notifyCoreEngineLoaded = function() {
	CoreEngine.ModAPI.registerAPI("ModdingTools", API);
};

const getCoreEngineAndInjectIfNeeded = function() {
	return tryout(function() {
		if (isCoreEngineLoaded()) {
			return CoreEngine;
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
			ceHandlerSingleton.injectCoreAPI(CoreEngine);
		}
		notifyCoreEngineLoaded();
		return CoreEngine;
	}, CoreEngine);
};

Callback.addCallback("PreBlocksDefined", function() {
	getCoreEngineAndInjectIfNeeded();
});
