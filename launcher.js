let isRetentionLoaded = false;

function loadRetentionIfNeeded() {
	if (!isRetentionLoaded) {
		IMPORT("Retention:2");
		
		let __version__ = __mod__.getInfoProperty("version");
		reportError.setTitle(__name__ + " " + __version__);
		reportError.setInfoMessage("It wasn't possible to fully start modication. " +
			"If you don't see new interface, please contact developers on our group.");
		
		isRetentionLoaded = true;
	}
}

function tryToReport(e) {
	loadRetentionIfNeeded();
	reportError(e);
}

function launchModification(additionalScope) {
	try {
		if (additionalScope != undefined) {
			Launch(additionalScope);
			return;
		}
		Launch();
	} catch (e) {
		tryToReport(e);
	}
}

(function() {
	try {
		ConfigureMultiplayer({
			name: "auto",
			version: "auto",
			isClientOnly: false
		});
	} catch (e) {
		launchModification({
			isOutdated: true
		});
		return;
	}
	
	launchModification();
})();
