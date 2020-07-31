var UIEditor, Setting, DumpCreator, InstantRunner, WorldEdit;

Callback.addCallback("CoreEngineLoaded", function(api) {
	try {
		api.ModAPI.registerAPI("DevInterface", {
			createAndLock: function() {
				restart();
			},
			getCurrentEnvironment: function() {
				return currentEnvironment;
			},
			isLocked: function() {
				return !isSupportEnv;
			},
			doNotLaunch: function() {
				initializeLiquidation();
			}
		});
	} catch(e) {
		reportError(e);
		return;
	}
	
	try {
		if (ExecutableSupport.isModuleMissed()) {
			MCSystem.setLoadingTip("Loading Supportables");
			
			UIEditor = importMod("UIEditor", function() {
				var DevInterface = ModAPI.requireAPI("DevInterface");
				if (!this.Windows) return false;
				var menu = Windows.menu || null;
				if (menu) {
					var source = java.lang.String.valueOf("" + menu),
						index = source.indexOf("{");
					if (index > -1) {
						var injectable = "if (DevInterface.isLocked()) return;\n" +
							"if (layout.getChildCount() == 1) DevInterface.createAndLock();",
							first = source.substring(0, index + 1),
							second = source.substring(index + 2, source.length() - 1);
						Windows.menu = eval(first + "\n" + injectable + "\nelse " + second);
					} else return false;
				} else return false;
				return true;
			});
			
			Setting = importMod("Setting", function() {
				var DevInterface = ModAPI.requireAPI("DevInterface");
				if (typeof this.rover == "undefined" || !this.removeMenu) return false;
				if ((rover = false, removeMenu)) {
					var source = java.lang.String.valueOf("" + removeMenu),
						index = source.indexOf("{");
					if (index > -1) {
						var injectable = "if (!rover) DevInterface.createAndLock();",
							first = source.substring(0, index + 1),
							second = source.substring(index + 2, source.length() - 1);
						removeMenu = eval(first + "\n" + injectable + "\n " + second);
					} else return false;
				} else return false;
				Callback.addCallback("LevelLeft", function() {
					if (!DevInterface.isLocked() && DevInterface.getCurrentEnvironment() == __name__) {
						DevInterface.createAndLock(), rover = false;
					}
				});
				return true;
			});
			
			DumpCreator = importMod("Dump Creator", function() {
				if (!this.alert || !this.__makeAndSaveDump__) return false;
				var originalAlert = alert;
				alert = function(text) {
					if (text == "Dump generated") __makeAndSaveDump__.dumped = true;
					originalAlert && originalAlert(text);
				};
				return true;
			});
			
			InstantRunner = importMod("InstantRunner", function() {
				if (!this.openAndroidUI) return false;
				if (!this.container) this.container = new Object();
				container.close = new Function(),
				container.isOpened = function() {
					return true;
				};
				return true;
			});
			
			WorldEdit = importMod("WorldEdit", function() {
				return !!this.Commands;
			});
		} else supportSupportables = false;
	} catch(e) {
		reportError(e);
	}
});
