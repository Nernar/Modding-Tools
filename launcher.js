const launchModification = function(additionalScope) {
	if (additionalScope !== undefined) {
		__mod__.RunMod(additionalScope);
		return;
	}
	Launch();
};

(function() {
	try {
		ConfigureMultiplayer({
			isClientOnly: true
		});
	} catch (e) {
		launchModification({
			isOutdated: true
		});
		return;
	}

	launchModification();
})();
