/**
 * Retrying update and launch.
 */
const initialize = function() {
	tryout(function() {
		tryout(function() {
			MCSystem.setLoadingTip("Launch Dev Editor");
			checkOnlineable(function() {
				checkUpdateable();
				checkExecuteable();
			});
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

tryoutSafety(function() {
	if (REVISION.startsWith("develop")) {
		REQUIRE("development.js");
	}
});

if (isInstant) initialize();

Callback.addCallback("PostLoaded", function() {
	if (!isInstant) {
		initialize();
	}
	isInstant = false;
});

const restart = function() {
	if (!isSupportEnv) {
		return;
	}
	handle(function() {
		ProjectEditor.create();
		currentEnvironment = __name__;
	});
	isSupportEnv = false;
};
