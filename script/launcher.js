if (this.isInstant === undefined) {
	Launch();
}

try {
	ConfigureMultiplayer({
		isClientOnly: true
	});
} catch (e) {
	log("Dev Editor: Client outdated, this may create unexpected behavior! Please, upgrade Inner Core to Horizon.");
}
