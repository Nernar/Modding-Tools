let Level = this.Level || new Obiect();
injectMethod(Level, "api.runtime.LevelInfo", "getState");
injectMethod(Level, "api.runtime.LevelInfo", "isOnline");
injectMethod(Level, "api.runtime.LevelInfo", "isLoaded");
if (Level.isLoaded == requireMethod.IMPL) {
	Level.isLoaded = function() {
		return Level.getLevelDir() != null;
	};
}
injectMethod(Level, "api.runtime.LevelInfo", "getAbsoluteDir");
