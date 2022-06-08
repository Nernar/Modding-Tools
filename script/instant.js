(function() {
	const launchModification = function(additionalScope) {
		if (additionalScope !== undefined) {
			__mod__.RunMod(additionalScope);
			return;
		}
		Launch();
	};
	
	launchModification();
})();
