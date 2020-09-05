var UIEditor, Setting, DumpCreator, InstantRunner, WorldEdit, UtilsPlus, TPSMeter;

Callback.addCallback("CoreEngineLoaded", function(api) {
	try {
		api.ModAPI.registerAPI("DevEditor", {
			createAndLock: function() {
				restart();
			},
			getCurrentEnvironment: function() {
				return currentEnvironment;
			},
			isLocked: function() {
				return !isSupportEnv;
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
				var DevEditor = ModAPI.requireAPI("DevEditor");
				if (!this.Windows) return false;
				var menu = Windows.menu || null;
				if (menu) {
					var source = java.lang.String.valueOf("" + menu),
						index = source.indexOf("{");
					if (index > -1) {
						var injectable = "if (DevEditor.isLocked()) return;\n" +
							"if (layout.getChildCount() == 1) DevEditor.createAndLock();",
							first = source.substring(0, index + 1),
							second = source.substring(index + 2, source.length() - 1);
						Windows.menu = eval(first + "\n" + injectable + "\nelse " + second);
					} else return false;
				} else return false;
				return true;
			});
			
			Setting = importMod("Setting", function() {
				var DevEditor = ModAPI.requireAPI("DevEditor");
				if (typeof this.rover == "undefined" || !this.removeMenu) return false;
				if ((rover = false, removeMenu)) {
					var source = java.lang.String.valueOf("" + removeMenu),
						index = source.indexOf("{");
					if (index > -1) {
						var injectable = "if (!rover) DevEditor.createAndLock();",
							first = source.substring(0, index + 1),
							second = source.substring(index + 2, source.length() - 1);
						removeMenu = eval(first + "\n" + injectable + "\n " + second);
					} else return false;
				} else return false;
				Callback.addCallback("LevelLeft", function() {
					if (!DevEditor.isLocked() && DevEditor.getCurrentEnvironment() == __name__) {
						DevEditor.createAndLock(), rover = false;
					}
				});
				return true;
			});
			
			DumpCreator = importMod("Dump Creator", function() {
				if (!this.__makeAndSaveDump__) return false;
				var originalAlert = alert;
				alert = function(text) {
					if (text == "Dump generated") __makeAndSaveDump__.dumped = true;
					originalAlert && originalAlert(text);
				};
				return true;
			});
			
			InstantRunner = importMod("InstantRunner", function() {
				if (!this.openAndroidUI) return false;
				if (!this.container) return false;
				container = new Object();
				container.close = new Function();
				container.isOpened = function() {
					return true;
				};
				return true;
			});
			
			WorldEdit = importMod("WorldEdit", function() {
				return !!this.Commands;
			});
			
			UtilsPlus = importMod("Utils+");
			
			TPSMeter = importMod("TPS meter");
		} else supportSupportables = false;
	} catch(e) {
		reportError(e);
	}
});
