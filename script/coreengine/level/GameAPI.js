var GameAPI = {};
GameAPI.prevent = function() {};
GameAPI.isActionPrevented = function() {
	return true;
};
GameAPI.message = function(msg) {};
GameAPI.tipMessage = function(msg) {};
GameAPI.dialogMessage = function(message, title) {};
GameAPI.setDifficulty = function(difficulty) {};
GameAPI.getDifficulty = function() {
	return 2;
};
GameAPI.setGameMode = function(gameMode) {
	/* CRASH */
};
GameAPI.getGameMode = function() {
	return 1;
};
GameAPI.getMinecraftVersion = function() {
	return "1.16.201";
};
GameAPI.getEngineVersion = function() {
	return "2.1";
};
GameAPI.spendItemsInCreative = false;
GameAPI.isDeveloperMode = false;
GameAPI.isItemSpendingAllowed = function(player) {};
GameAPI.simulateBackPressed = function() {};
