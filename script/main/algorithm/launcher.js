(function() {
	let internal = Files.of(Dirs.SCRIPT_REVISION + "bridge.dex");
	if (internal.exists() && internal.isFile()) {
		InnerCorePackages.mod.executable.Compiler.enter(-1);
		merge(this, InnerCorePackages.mod.executable.Compiler.loadScriptFromDex(internal)());
	} else {
		Logger.Log("Modding Tools: Not found internal bridge, most functionality may NOT working, please reinstall " + REVISION, "WARNING");
	}
})();

const prefetch = function() {
	updateInternalConfig();
	if (REVISION.startsWith("develop") && Files.isDirectory(Dirs.INTERNAL_UI)) {
		BitmapDrawableFactory.mapDirectory(Dirs.INTERNAL_UI, true);
	}
	BitmapDrawableFactory.mapDirectory(Dirs.ASSET, true);
	if (isAndroid()) {
		typeface = Files.createTypefaceWithFallback(Dirs.ASSET + "font.ttf");
		typefaceJetBrains = Files.createTypefaceWithFallback(Dirs.ASSET + "JetBrainsMono-Regular.ttf");
	}
	Files.ensureDirectory(Dirs.PROJECT);
	registerAdditionalInformation();
	try {
		if (REVISION.indexOf("develop") != -1) {
			CHECKOUT("development.js");
		}
	} catch (e) {
		reportError(e);
	}
};

const prelaunch = function() {
	// if (firstLaunchTutorial && isFirstLaunch()) {
		// What is a tutorial?
	// } else {
		try {
			prepareEnvironmentIfNeeded();
		} catch (e) {
			if (REVISION.indexOf("develop") != -1) {
				reportError(e);
			}
		}
		// LevelProvider.attach();
		if ($.LevelInfo.isLoaded() && LevelProvider.isAttached()) {
			LevelProvider.show();
		}
	// }
	loadSetting("user_login.first_launch", "boolean", false);
	__config__.save();
	if (isCLI()) {
		org.mozilla.javascript.tools.debugger.Main.mainEmbedded(CONTEXT.getFactory(), __mod__.compiledModSources.get(0).getScope(), NAME);
		willBeDeletedSoonSoYouShouldntUseIt();
	}
};

/**
 * Retrying update and launch.
 */
const initialize = function() {
	try {
		MCSystem.setLoadingTip(NAME + ": Starting");
		if (showHint.launchStacked !== undefined) {
			handle(function() {
				if (PROJECT_TOOL.isAttached()) {
					PROJECT_TOOL.deattach();
				}
				attachProjectTool();
			});
		}
	} catch (e) {
		Logger.Log("Modding Tools: Initialization fatal: Unfortunately, we will not be able to run modification", "ERROR");
		reportError(e);
	}
};

const restart = function() {
	if (!isSupportEnv) {
		return;
	}
	handle(function() {
		attachProjectTool(undefined, function() {
			currentEnvironment = __name__;
		});
	});
	isSupportEnv = false;
};

const launchDependencies = function() {
	if (PROJECT_TOOL.launchDependencies) {
		return;
	}
	// attachBackground();
	try {
		if (isInstant && !PROJECT_TOOL.instantLaunchDependencies) {
			PROJECT_TOOL.instantLaunchDependencies = true;
			Logger.Log("Modding Tools: Initiating shared instant session...", "INFO");
			Callback.invokeCallback("Instant:ModdingTools", API);
		} else {
			PROJECT_TOOL.launchDependencies = true;
			Logger.Log("Modding Tools: Initiating shared session...", "INFO");
			Callback.invokeCallback("ModdingTools", API);
		}
	} catch (e) {
		Logger.Log("Modding Tools: Modules initialization aborted due to exception!", "ERROR");
		reportError(e);
	}
};

prefetch();

Callback.addCallback("PreBlocksDefined", function() {
	showHint.launchStacked = [];
	launchDependencies();
});

Callback.addCallback("PostLoaded", function() {
	if (isInstant) {
		isInstant = false;
	}
	initialize();
});

Callback.addCallback("InstantLoaded", function() {
	launchDependencies();
	initialize();
});
