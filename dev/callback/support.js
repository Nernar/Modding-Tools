Callback.addCallback("CoreEngineLoaded", function(api) {
	handle(function() {
		let window = context.getWindow();
		if (isHorizon) {
			if (android.os.Build.VERSION.SDK_INT >= 30) {
				window.setDecorFitsSystemWindows(false);
				let controller = window.getInsetsController();
				if (controller != null) {
					controller.hide(android.view.WindowInsets.Type.statusBars() | android.view.WindowInsets.Type.navigationBars());
					controller.setSystemBarsBehavior(android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
				}
			} else window.getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_IMMERSIVE);
			window.addFlags(android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
		}
	});
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
	} catch (e) {
		reportError(e);
		return;
	}
	try {
		if (ExecutableSupport.isModuleMissed()) {
			MCSystem.setLoadingTip("Loading Supportables");
			UIEditor = importMod("UIEditor", function() {
				let DevEditor = ModAPI.requireAPI("DevEditor");
				if (!this.Windows) {
					return false;
				}
				let menu = Windows.menu || null;
				if (menu) {
					let source = java.lang.String.valueOf(String(menu)),
						index = source.indexOf("{");
					if (index > -1) {
						let injectable = "if (DevEditor.isLocked()) return;\n" +
							"if (layout.getChildCount() == 1) DevEditor.createAndLock();",
							first = source.substring(0, index + 1),
							second = source.substring(index + 2, source.length() - 1);
						Windows.menu = eval(first + "\n" + injectable + "\nelse " + second);
					} else return false;
				} else return false;
				return true;
			});
			Setting = importMod("Setting", function() {
				let DevEditor = ModAPI.requireAPI("DevEditor");
				if (typeof this.rover == "undefined" || !this.removeMenu) {
					return false;
				}
				rover = false;
				if (removeMenu) {
					let source = java.lang.String.valueOf(String(removeMenu)),
						index = source.indexOf("{");
					if (index > -1) {
						let injectable = "if (!rover) DevEditor.createAndLock();",
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
				if (!this.__makeAndSaveDump__) {
					return false;
				}
				let originalAlert = alert;
				alert = function(text) {
					if (text == "Dump generated") {
						__makeAndSaveDump__.dumped = true;
					}
					originalAlert && originalAlert(text);
				};
				return true;
			});
			InstantRunner = importMod("InstantRunner", function() {
				if (!this.openAndroidUI || !this.container) {
					return false;
				}
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
			TPSmeter = importMod("TPS meter");
		} else supportSupportables = false;
	} catch (e) {
		reportError(e);
	}
});

const refreshSupportablesIcons = function() {
	try {
		ExecutableSupport.refreshIcon(UIEditor);
		ExecutableSupport.refreshIcon(Setting);
		ExecutableSupport.refreshIcon(DumpCreator);
		ExecutableSupport.refreshIcon(InstantRunner);
		ExecutableSupport.refreshIcon(WorldEdit);
		ExecutableSupport.refreshIcon(TPSmeter);
	} catch (e) {
		reportError(e);
	}
};
