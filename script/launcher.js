if (this.isInstant === undefined) {
	Launch();
} else if (!__mod__.isModRunning) {
	__mod__.RunMod({
		isInstant: false
	});
}

try {
	ConfigureMultiplayer({
		isClientOnly: true
	});
} catch (e) {
	Logger.Log("Modding Tools: Client outdated, this may create unexpected behavior! Please, upgrade Inner Core to Horizon.", "WARNING");
}
