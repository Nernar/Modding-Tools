/**
 * If you thought you were missing feature that need, make sure
 * it's not deprecated or an environment internal feature.
 * Perhaps you should not interfere with itself work.
 */
const API = {
	USER_ID: "unknown",
	API_VERSION: API_VERSION,
	PRODUCT_REVISION: REVISION,
	CONTEXT: CONTEXT,
	InnerCorePackage: InnerCorePackages, // Code bug
	InnerCorePackages: InnerCorePackages,
	isCoreEngineLoaded: isCoreEngineLoaded,
	CoreEngine: CoreEngine,
	launchIfSupported: launchIfSupported,
	
	// Retention
	isHorizon: isHorizon,
	minecraftVersion: minecraftVersion,
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
			Logger.Log("ModdingTools: Id " + id + " is already occupied!", "WARNING");
			return;
		}
		log("ModdingTools: Registered custom adaptive tool " + id);
		Tools[id] = tool;
	},
	registerMenuTool: function(id, tool, entry) {
		if (Tools.hasOwnProperty(id)) {
			Logger.Log("ModdingTools: Id " + id + " is already occupied!", "WARNING");
			return;
		}
		if (entry === undefined) {
			entry = new ProjectTool.MenuFactory();
		}
		if (!(entry instanceof ProjectTool.MenuFactory)) {
			MCSystem.throwException("ModdingTools: registerMenuTool(id, tool, *) entry must be instance of ProjectTool.MenuFactory");
		}
		log("ModdingTools: Registered tool " + id + " into menu entry");
		PROJECT_TOOL.tools[id] = entry;
		Tools[id] = tool;
	},
	registerBitsetUi: registerBitsetUi,
	registerFragmentJson: registerFragmentJson,
	registerWindowJson: registerWindowJson,
	registerKeyboardWatcher: registerKeyboardWatcher,
	
	// Helper functions
	random: random,
	isEmpty: isEmpty,
	assign: assign,
	merge: merge,
	clone: clone,
	sameAs: sameAs,
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
	stringifyJson: stringifyJson,
	stringifyJsonIndented: stringifyJsonIndented,
	isLightweightArray: isLightweightArray,
	
	// Storage utility
	resetSettingIfNeeded: resetSettingIfNeeded,
	loadSetting: loadSetting,
	injectSetting: setSetting,
	updateInternalConfig: updateSettings,
	formatSize: formatSize,
	Dirs: Dirs,
	MediaTypes: MediaTypes,
	Files: Files,
	
	// Decoding resources
	ImageFactory: ImageFactory, // DEPRECATED
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
	HorizontalScrollFragment: HorizontalScrollFragment,
	TextFragment: TextFragment,
	ImageFragment: ImageFragment,
	
	// Adapters
	ListHolderAdapter: ListHolderAdapter,
	FilterListHolderAdapter: FilterListHolderAdapter,
	
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
	LogotypeFragment: LogotypeFragment, // DEPRECATED
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
	
	// Rhino evaluation
	compileReader: compileReader,
	compileString: compileString,
	compileFunction: compileFunction,
	compileUniversal: compileUniversal,
	evaluateReader: evaluateReader,
	evaluateString: evaluateString,
	evaluateUniversal: evaluateUniversal,
	runAtScope: runAtScope,
	newLoggingErrorReporter: newLoggingErrorReporter,
	newRuntimeCompilerEnvirons: newRuntimeCompilerEnvirons,
	
	// Project
	compileScript: compileScript,
	compileData: compileData,
	exportProject: exportProject,
	importProject: importProject,
	importScript: importScript,
	selectProjectData: selectProjectData,
	Worker: Worker,
	Project: Project,
	ProjectProvider: ProjectProvider,
	ScriptConverter: ScriptConverter,
	ScriptImporter: ScriptImporter,
	
	// Tools
	Action: Action,
	Tool: Tool,
	InteractionTool: InteractionTool,
	MenuTool: MenuTool,
	SidebarTool: SidebarTool,
	ProjectTool: ProjectTool,
	EditorTool: EditorTool,
	attachProjectTool: attachProjectTool,
	attachEditorTool: attachEditorTool,
	
	// Sequence
	Sequence: Sequence,
	LogotypeSequence: LogotypeSequence, // DEPRECATED
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
	}
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
	try {
		if (isCoreEngineLoaded()) {
			return CoreEngine;
		}
		let instance = null;
		let CoreEngineAPI = InnerCorePackages.api.mod.coreengine.CoreEngineAPI;
		let field;
		try {
			field = CoreEngineAPI.__javaObject__.getDeclaredField("ceHandlerSingleton");
		} catch (e) {
			field = CoreEngineAPI.__javaObject__.getDeclaredField("coreEngineHandler");
			instance = InnerCorePackages.api.mod.API.getInstanceByName("CoreEngine");
		}
		field.setAccessible(true);
		let ceHandlerSingleton = field.get(instance);
		if (ceHandlerSingleton != null) {
			ceHandlerSingleton.injectCoreAPI(CoreEngine);
		}
		notifyCoreEngineLoaded();
	} catch (e) {
		reportError(e);
	}
	return CoreEngine;
};

Callback.addCallback("PreBlocksDefined", function() {
	getCoreEngineAndInjectIfNeeded();
});
