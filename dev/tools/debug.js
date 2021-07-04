const LogViewer = {
	FREQUENCY: 250,
	show: function() {
		let popup = new ListingPopup();
		popup.setTitle(translate("Currently log"));
		let horizontal = new android.widget.HorizontalScrollView(context);
		popup.views.content.addView(horizontal);
		let text = new android.widget.TextView(context);
		text.setPadding(Interface.getY(10), 0, Interface.getY(10), 0);
		text.setTextSize(Interface.getFontSize(12));
		text.setTextColor(Interface.Color.WHITE);
		if (typeface) text.setTypeface(typeface);
		horizontal.addView(text);
		let seek = new android.widget.SeekBar(context);
		seek.setMax(39);
		seek.setProgress((LogViewer.FREQUENCY - 50) / 50);
		seek.setOnSeekBarChangeListener({
			onProgressChanged: function(view, progress) {
				tryout.call(LogViewer, function() {
					this.FREQUENCY = preround(progress * 50 + 50);
				});
			}
		});
		let params = new android.widget.LinearLayout.
			LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
		params.weight = 0.1;
		popup.getContainer().addView(seek, params);
		handleThread(function() {
			let log = java.lang.Class.forName("zhekasmirnov.launcher.api.log.ICLog", true, context.getClass().getClassLoader()),
				filter = log.getMethod("getLogFilter").invoke(null);
			do {
				if (popup.isExpanded()) {
					let result = filter.buildFilteredLog(false);
					handle(function() {
						text.setText(result);
						if (text.getMeasuredHeight() - popup.views.scroll.getScrollY() < Interface.Display.HEIGHT) {
							popup.views.scroll.scrollTo(horizontal.getScrollX(), text.getMeasuredHeight());
						}
					});
					Interface.sleepMilliseconds(LogViewer.FREQUENCY);
				}
			} while (popup.name && Popups.hasOpenedByName(popup.name));
		});
		Popups.open(popup, "innercore_log");
	}
};

const ConsoleViewer = {
	show: function() {
		let button = new ControlButton();
		button.setIcon("menuBack");
		button.setOnClickListener(function() {
			let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
			if (snack !== null) snack.dismiss();
			ProjectEditor.create();
			Popups.closeIfOpened("evaluate");
		});
		button.show();

		ConsoleViewer.setupConsole();
		ConsoleViewer.addEditable();
	},
	setupConsole: function() {
		let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (snack !== null) snack.dismiss();
		snack = new HintAlert();
		snack.setConsoleMode(true);
		snack.setMaximumStacked(8);
		snack.pin();
		snack.show();
	},
	addEditable: function() {
		let popup = new ListingPopup();
		popup.setTitle(translate("Evaluate"));
		popup.addEditElement(translate("Hi, I'm evaluate stroke"), "29 / 5");
		popup.addButtonElement(translate("Eval"), function() {
			let values = popup.getAllEditsValues();
			if (String(values[0]).length > 0) {
				showHint(" > " + values[0]);
				let result = compileData(values[0]);
				if (result.lineNumber !== undefined) {
					showHint(result.message, Interface.Color.RED);
				} else showHint(String(result), Interface.Color.LTGRAY);
			}
		}).setBackground("popup");
		popup.setOnDismissListener(function() {
			let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
			if (snack !== null) ConsoleViewer.addEditable();
		});
		Popups.open(popup, "evaluate");
	}
};

const DebugEditor = {
	data: new Object(),
	create: function() {
		let button = new ControlButton();
		button.setIcon("menuProjectManage");
		button.setOnClickListener(function() {
			DebugEditor.menu();
		});
		button.show();
	},
	menu: function() {
		if (DebugEditor.data.tests !== undefined) {
			let control = new MenuWindow();
			control.setOnClickListener(function() {
				DebugEditor.create();
			});
			control.addMessage("menuProjectLeave", translate("Dev Editor") + ": " + translate("Leave"), function() {
				ProjectEditor.menu();
			});
			control.addCategory(translate("Debug"));
			this.attachTestsList(control);
			control.show();
		} else {
			let tests = DebugEditor.data.tests = new Object();
			FetchTestsSequence.execute(tests);
		}
	},
	attachTestsList: function(control) {
		let tests = DebugEditor.data.tests;
		for (let name in tests) {
			this.attachTest(name, tests[name], control);
		}
		if (isEmpty(tests)) {
			control.addMessage("menuBoardConfig", translate("Developer hasn't provided any test for that build. Please, checkout that section for next time."));
		}
	},
	attachTest: function(path, information, control) {
		if (information !== null) {
			control.addMessage(information.icon || "support", translate(information.title || "Test"), function() {
				confirm(translate("Test") + ": " + path, translate(information.description || "This process may takes some time, don't leave before process is fully completed. Anyway, your projects is always safe."), function() {
					control.hide();
					DebugEditor.requireTest(path + ".dns", information.mobility || information.counter);
				});
			});
		}
	},
	fetchInformation: function(path) {
		return tryout(function() {
			let file = new java.io.File(Dirs.TESTING, path + ".json");
			if (!file.exists()) throw null;
			return compileData(Files.read(file));
		}, function(e) {
			return null;
		}, {
			title: path,
			icon: "menuBoardWarning"
		});
	},
	requireTest: function(path, timing) {
		tryout(function() {
			if (typeof timing != "number" && timing !== true) {
				DebugEditor.create();
			}
			REQUIRE(path)();
			if (typeof timing == "number") {
				handle(function() {
					DebugEditor.create();
				}, timing);
			}
		}, function(e) {
			DebugEditor.create();
			retraceOrReport(e);
		});
	}
};

const ModificationSource = {
	selector: function() {
		let control = new MenuWindow();
		control.setOnClickListener(function() {
			ProjectEditor.create();
		});
		if (!this.attachSources(control)) {
			control.addMessage("worldSelectionRange", translate("There's we can't find any modification. Please, consider developer about that cause."));
		}
		if (supportSupportables) {
			this.attachSupportables(control);
		}
		control.show();
	},
	attachSources: function(control) {
		let loader = ExecuteableSupport.newInstance("zhekasmirnov.launcher.mod.build.ModLoader");
		if (loader == null) return false;
		let modsList = loader.instance.modsList;
		if (modsList.size() == 0) return false;
		control.addCategory(translate("What do you want to compile?"));
		for (let i = 0; i < modsList.size(); i++) {
			let mod = modsList.get(i);
			this.attachSource(control, mod);
		}
		return true;
	},
	attachSupportables: function(control) {
		let supportables = ExecuteableSupport.getModList();
		if (supportables.length == 0) return false;
		control.addCategory(translate("Or maybe checkout supportables"));
		for (let i = 0; i < supportables.length; i++) {
			let mod = supportables[i];
			this.attachSource(control, mod);
		}
		return true;
	},
	attachSource: function(control, mod) {
		let count = mod.getAllExecutables().size(),
			type = mod.getBuildType().toString();
		control.addMessage("worldSelectionLimit" + (count > 0 ? count > 5 ? count > 10 ? count > 15 ? "Infinity" : "Maximal" : "Normal" : "Minimal" : "Custom"), translate(mod.getName()) +
			"\n" + translateCounter(count, "no sources", "%s1 source", "%s" + (count % 10) + " sources", "%s sources", [count]) + " / " + translate(type),
			function() {
				ModificationSource.rebuild(mod, type);
			});
	},
	rebuild: function(mod, type) {
		if (type == "release") {
			confirm(translate("Switch build type"), translate("Do you want to switch modification build type in build.config?"), function() {
				ModificationSource.switchBuild(mod, mod.getBuildType().toString());
				ModificationSource.selector();
			});
		} else if (type == "develop") {
			confirm(translate("Compilation"), translate("Modification will be dexed and switched to release type.") + " " + translate("Do you want to continue?"), function() {
				handleThread(function() {
					let result = ModificationSource.requireDexerAsync(mod);
					handle(function() {
						if (result.reported && result.reported.length > 0) {
							result.reported.forEach(function(element) {
								element && retraceOrReport(element);
							});
						}
						if (!result.wasFailed) ModificationSource.rebuild(mod, "release");
						confirm(translate(result.name) + " " + translate(result.version), (result.wasFailed ?
								translate("Something went wrong during compilation process.") + " " + translate("Checkout reports below to see more details.") :
								translate("Modification successfully compiled.") + " " + translate("You can switch build type in next window.")) + " " +
							translate("Founded sources count") + ": " + (result.buildConfig ? result.buildConfig.getAllSourcesToCompile().size() : 0) + ".\n" +
							translate("Do you want to review report?"),
							function() {
								if (result.messages && result.messages.length > 0) {
									confirm(translate("Report"), result.messages.join("\n"));
								}
							});
						ModificationSource.selector();
					});
				});
				MenuWindow.hideCurrently();
			});
		}
	},
	requireDexerAsync: function(mod, yields) {
		let dexer = REQUIRE("redexer.dns")(mod);
		if (yields !== false) dexer.assureYield();
		return dexer.toResult();
	},
	switchBuild: function(mod, type) {
		if (type === undefined) {
			type = mod.getBuildType().toString();
		}
		if (type == "release") {
			mod.setBuildType("develop");
		} else if (type == "develop") {
			mod.setBuildType("release");
		} else showHint(translate("Build type %s is unsupported", translate(type)));
	}
};

const LevelProvider = new Object();

LevelProvider.attach = function() {
	let overlay = new OverlayWindow();
	this.overlay = overlay;
};

LevelProvider.getOverlayWindow = function() {
	return this.overlay || null;
};

LevelProvider.isAttached = function() {
	return this.getOverlayWindow() !== null;
};

LevelProvider.getFormattedTps = function() {
	let tps = preround(TPSMeter.getTps(), 1);
	if (tps < 0.1) return "<0.1";
	if (tps >= 1000) return "999.9";
	return new java.lang.Float(tps);
};

LevelProvider.update = function() {
	let overlay = this.getOverlayWindow();
	if (overlay === null) return false;
	if (!thereIsNoTPSMeter) {
		let tps = this.getFormattedTps(); // 20.0
		overlay.setText(translate("%stps", tps));
		return true;
	}
	return false;
};

LevelProvider.updateRecursive = function() {
	let instance = this;
	handle(function() {
		if (instance.update() && Level.isLoaded()) {
			instance.updateRecursive();
		}
	}, 500);
};

LevelProvider.show = function() {
	let overlay = this.getOverlayWindow();
	if (overlay === null) return;
	this.update() && overlay.show();
	this.updateRecursive();
};

LevelProvider.hide = function() {
	let overlay = this.getOverlayWindow();
	if (overlay === null) return;
	overlay.hide();
};
