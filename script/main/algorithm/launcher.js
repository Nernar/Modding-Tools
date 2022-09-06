(function() {
	let internal = new java.io.File(Dirs.SCRIPT_REVISION + "bridge.jar");
	if (internal.exists()) {
		let reader = new java.io.FileReader(internal);
		InnerCorePackages.mod.executable.Compiler.enter(-1);
		merge(this, InnerCorePackages.mod.executable.Compiler.loadScriptFromDex(internal)());
	} else {
		Logger.Log("ModdingTools: Not found internal bridge, most functionality may not working, please reinstall " + REVISION, "WARNING");
	}
})();

try {
	if (REVISION.startsWith("develop")) {
		CHECKOUT("development.js");
	}
} catch (e) {
	if (REVISION.indexOf("develop") != -1) {
		reportError(e);
	}
}

/**
 * Retrying update and launch.
 */
const initialize = function() {
	try {
		MCSystem.setLoadingTip(NAME + ": Starting");
		if (showHint.launchStacked !== undefined) {
			LaunchSequence.execute();
		}
	} catch (e) {
		Logger.Log("ModdingTools: Initialization fatal: Unfortunately, we will not be able to run modification", "ERROR");
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

if (isInstant) {
	initialize();
}

Callback.addCallback("PostLoaded", function() {
	if (!isInstant) {
		initialize();
	} else {
		handle(function() {
			if (PROJECT_TOOL.isAttached()) {
				PROJECT_TOOL.deattach();
			}
			attachProjectTool();
		});
	}
	isInstant = false;
});
