(function() {
	let internal = new java.io.File(Dirs.SCRIPT_REVISION + "bridge.jar");
	if (internal.exists()) {
		let reader = new java.io.FileReader(internal);
		findCorePackage().mod.executable.Compiler.enter(-1);
		merge(this, findCorePackage().mod.executable.Compiler.loadScriptFromDex(internal)());
	} else {
		Logger.Log("ModdingTools: not found internal bridge, most functionality may not working, please reinstall " + REVISION, "WARNING");
	}
})();

tryoutSafety(function() {
	if (REVISION.startsWith("develop")) {
		CHECKOUT("development.js");
	}
});

/**
 * Retrying update and launch.
 */
const initialize = function() {
	tryout(function() {
		tryout(function() {
			MCSystem.setLoadingTip(NAME + ": Starting");
			reportError.setTitle(translate(NAME) + " " + translate(VERSION));
			reportError.setInfoMessage(translate("An error occurred while executing modification.") + " " +
				translate("If your developing process is affected, try export all non-saved data.") + " " +
				translate("Send a screenshot of error to our group or save error in internal storage."));
		});
		if (showHint.launchStacked !== undefined) {
			LaunchSequence.execute();
		}
	});
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
