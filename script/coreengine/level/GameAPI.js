var GameAPI = {};
GameAPI.prevent = function() {
	return null;
};
GameAPI.isActionPrevented = function() {
	return true;
};
GameAPI.message = function(msg) {
	return null;
};
GameAPI.tipMessage = function(msg) {
	return null;
};
GameAPI.dialogMessage = function(message, title) {
	return null;
};
GameAPI.setDifficulty = function(difficulty) {
	return null;
};
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
GameAPI.isItemSpendingAllowed = function(player) {
	return false;
};
GameAPI.simulateBackPressed = function() {
	return null;
};
