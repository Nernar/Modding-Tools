const LogViewer = {
	FREQUENCY: 250,
	show: function() {
		handle(function() {
			let popup = new ListingPopup();
			popup.setTitle(translate("Currently log"));
			let horizontal = new android.widget.HorizontalScrollView(context);
			popup.views.content.addView(horizontal);
			let text = new android.widget.TextView(context);
			text.setPadding(Ui.getY(10), 0, Ui.getY(10), 0);
			text.setTextSize(Ui.getFontSize(12));
			text.setTextColor(Ui.Color.WHITE);
			if (typeface) text.setTypeface(typeface);
			horizontal.addView(text);
			let seek = new android.widget.SeekBar(context);
			seek.setMax(39);
			seek.setProgress((LogViewer.FREQUENCY - 50) / 50);
			seek.setOnSeekBarChangeListener({
				onProgressChanged: function(view, progress) {
					try {
						LogViewer.FREQUENCY = preround(progress * 50 + 50);
					} catch (e) {
						reportError(e);
					}
				}
			});
			let params = new android.widget.LinearLayout.
			LayoutParams(Ui.Display.MATCH, Ui.Display.MATCH);
			params.weight = 0.1;
			popup.getContent().addView(seek, params);
			handleThread(function() {
				let log = java.lang.Class.forName("zhekasmirnov.launcher.api.log.ICLog", true, context.getClass().getClassLoader()),
					filter = log.getMethod("getLogFilter").invoke(null);
				do {
					if (popup.isExpanded()) {
						let result = filter.buildFilteredLog(false);
						handle(function() {
							text.setText(result);
							if (text.getMeasuredHeight() - popup.views.scroll.getScrollY() < Ui.Display.HEIGHT) {
								popup.views.scroll.scrollTo(horizontal.getScrollX(), text.getMeasuredHeight());
							}
						});
						Ui.sleepMilliseconds(LogViewer.FREQUENCY);
					}
				} while (popup.name && Popups.hasOpenedByName(popup.name));
			});
			Popups.open(popup, "innercore_log");
		});
	}
};

const ConsoleViewer = {
	show: function() {
		handle(function() {
			let button = new ControlButton();
			button.setIcon("menuModuleBack");
			button.setOnClickListener(function() {
				let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
				if (snack !== null) snack.dismiss();
				ProjectEditor.create();
				Popups.closeAll();
			});
			button.show();

			ConsoleViewer.setupConsole();
			ConsoleViewer.addEditable();
		});
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
					showHint(result.message, Ui.Color.RED);
				} else showHint(String(result), Ui.Color.LTGRAY);
			}
		}).setBackground("ground");
		Popups.open(popup, "evaluate");
	}
};

const DebugEditor = {
	data: new Object(),
	create: function() {
		try {
			let button = new ControlButton();
			button.setIcon("menuProjectManage");
			button.setOnClickListener(function() {
				DebugEditor.menu();
			});
			button.show();
		} catch (e) {
			reportError(e);
		}
	},
	menu: function() {
		try {
			let control = new ControlWindow();
			control.setOnClickListener(function() {
				DebugEditor.create();
			});
			control.addMessage("menuProjectLeave", translate("Dev Editor") + ": " + translate("Leave"), function() {
				ProjectEditor.menu();
			});
			control.addCategory(translate("Debug"));
			this.attachTestsList(control);
			control.show();
		} catch (e) {
			reportError();
		}
	},
	attachTestsList: function(control) {
		let names = Files.listFileNames(Dirs.TESTING, true),
			formats = Files.checkFormats(names, ".dns");
		for (let i = 0; i < formats.length; i++) {
			let name = Files.getNameWithoutExtension(formats[i]);
			if (name == "attach") {
				formats.splice(i, 1);
				REQUIRE(name + ".dns");
				i--;
				continue;
			}
			this.attachTest(name, control);
		}
		if (formats.length == 0) {
			control.addMessage("menuConfig", translate("Developer hasn't provided any test for that build. Please, checkout that section for next time."));
		}
	},
	attachTest: function(path, control) {
		let information = this.fetchInformation(path);
		control.addMessage(information.icon || "support", translate(information.title || "Test"), function() {
			confirm(translate("Test") + ": " + path, translate(information.description || "This process may takes some time, don't leave before process is fully completed. Anyway, your projects is always safe."), function() {
				control.dismiss();
				DebugEditor.requireTest(path + ".dns", information.mobility || information.counter);
			});
		});
	},
	fetchInformation: function(path) {
		try {
			let file = new java.io.File(Dirs.TESTING, path + ".json");
			if (!file.exists()) throw null;
			return compileData(Files.read(file));
		} catch (e) {
			if (e === null) {
				return {
					title: path
				};
			}
		}
		return {
			title: path,
			icon: "menuModuleWarning"
		};
	},
	requireTest: function(path, timing) {
		try {
			REQUIRE(path)();
			if (typeof timing == "number") {
				handle(function() {
					DebugEditor.create();
				}, timing);
			} else if (timing != true) {
				DebugEditor.create();
			}
		} catch (e) {
			DebugEditor.create();
			reportError(e);
		}
	}
};
