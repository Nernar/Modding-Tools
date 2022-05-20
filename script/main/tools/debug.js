const LogViewer = {
	span: function(text, color) {
		let spannable = new android.text.SpannableString(text);
		spannable.setSpan(new android.text.style.ForegroundColorSpan(color), 0, text.length, android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
		return spannable;
	},
	append: function(text, scroll, horizontal, prefix, message, color) {
		text.post(function() {
			if (color !== undefined && color != 0) {
				text.append(LogViewer.span("\n" + (prefix != "undefined" ? prefix + "/" + message : "" + message), color));
			} else {
				text.append("\n" + (prefix != "undefined" ? prefix + "/" + message : "" + message));
			}
			scroll.scrollTo(horizontal.getScrollX(), text.getMeasuredHeight());
		});
	},
	handle: function(text, scroll, horizontal, message) {
		if (message == null) {
			return;
		}
		// let color = message.prefix.toFontColor();
		// color = Interface.Color.parse(color);
		if (message.type.level == 3) {
			return this.append(text, scroll, horizontal, message.strPrefix, message.message, Interface.Color.RED);
		}
		if (message.strPrefix == "WARNING") {
			return this.append(text, scroll, horizontal, message.strPrefix, message.message, Interface.Color.YELLOW);
		}
		if (message.type.level == 2 || message.strPrefix == "INFO") {
			return this.append(text, scroll, horizontal, message.strPrefix, message.message, Interface.Color.GREEN);
		} else if (message.type.level == 1 || message.strPrefix == "DEBUG") {
			return this.append(text, scroll, horizontal, message.strPrefix, message.message, Interface.Color.GRAY);
		}
		if (message.strPrefix == "MOD") {
			return this.append(text, scroll, horizontal, message.strPrefix, message.message);
		}
		return this.append(text, scroll, horizontal, message.strPrefix, message.message, Interface.Color.LTGRAY);
	},
	show: function() {
		let popup = new ListingPopup();
		popup.setTitle(translate("Currently log"));
	   	popup.views.scroll.setLayoutParams(new android.widget.LinearLayout.
			LayoutParams(Interface.Display.WIDTH / 4, Interface.Display.HEIGHT / 3));
		let horizontal = new android.widget.HorizontalScrollView(context);
		let text = new android.widget.TextView(context);
		text.setPadding(Interface.getY(10), 0, Interface.getY(10), 0);
		text.setTextSize(Interface.getFontSize(12));
	   	text.setTextColor(Interface.Color.WHITE);
		text.setTypeface(android.graphics.Typeface.MONOSPACE);
		text.setText(NAME + " " + REVISION);
		popup.views.content.addView(horizontal);
		horizontal.addView(text);
		let filter = findCorePackage().api.log.ICLog.getLogFilter();
		let messagesField = getClass(filter).__javaObject__.getDeclaredField("logMessages");
		messagesField.setAccessible(true);
		let messages = messagesField.get(filter);
		Popups.open(popup, "logging");
		let count = messages.size();
		handleThread(function() {
			while (popup.isOpened()) {
				if (popup.isExpanded()) {
					let next = messages.size();
					if (next > count) {
						for (let i = count; i < next; i++) {
							LogViewer.handle(text, popup.views.scroll, horizontal, messages.get(i));
						}
						count = next;
					}
				}
				java.lang.Thread.yield();
			}
		});
	}
};

const CONSOLE_TOOL = (function() {
	return new Tool({
		controlDescriptor: {
			logotype: "menuBack",
			collapsedClick: function(tool, control) {
				tool.deattach();
			}
		},
		deattach: function() {
			let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
			if (snack !== null) snack.dismiss();
			Popups.closeIfOpened("evaluate");
			attachProjectTool(function() {
				Tool.prototype.deattach.apply(this, arguments);
			});
		},
		attach: function() {
			Tool.prototype.attach.apply(this, arguments);
			this.setupConsole();
			this.addEditable();
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
			let instance = this;
			popup.setOnDismissListener(function() {
				let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
				if (snack !== null) instance.addEditable();
			});
			Popups.open(popup, "evaluate");
		}
	});
})();

const attachConsoleTool = function(post) {
	CONSOLE_TOOL.attach();
	CONSOLE_TOOL.queue();
	handle(function() {
		CONSOLE_TOOL.collapse();
		let accepted = true;
		tryout(function() {
			post && post(CONSOLE_TOOL);
			accepted = false;
		});
		if (accepted) {
			attachProjectTool(function() {
				CONSOLE_TOOL.deattach();
			});
		}
	});
};

const DEBUG_TEST_TOOL = (function() {
	return new ControlTool({
		controlDescriptor: {
			logotype: function(tool, control) {
				return "menuProjectManage";
			}
		},
		menuDescriptor: {
			elements: function(tool, menu) {
				let selector = [{
					type: "message",
					icon: "menuProjectLeave",
					message: translate("Dev Editor") + ": " + translate("Leave"),
					click: function() {
						attachProjectTool(function() {
							tool.deattach();
						});
					}
				}, {
					type: "category",
					title: translate("Debug")
				}];
				let list = DebugEditor.data.tests;
				if (list) {
					for (let test in list) {
						let descriptor = tool.getTestDescriptor(test, list[test]);
						if (descriptor) selector.push(descriptor);
					}
					if (selector.length <= 2) {
						return selector.concat([{
							type: "message",
							icon: "menuBoardConfig",
							message: translate("Developer hasn't provided any test for that build. Please, checkout that section for next time.")
						}]);
					}
				}
				return selector;
			}
		},
		getTestDescriptor: function(path, json) {
			let information = DebugEditor.fetchInformation(path);
			if (information) {
				let instance = this;
				return {
					type: "message",
					icon: information.icon || "support",
					message: translate(information.title || "Test"),
					click: function() {
						confirm(translate("Test") + ": " + path, translate(information.description || "This process may takes some time, don't leave before process is fully completed. Anyway, your projects is always safe."),
							function() {
								instance.evaluateTest(path + ".dns", information.mobility || information.counter);
							});
					}
				};
			}
			return null;
		},
		evaluateTest: function(path, timing) {
			tryout.call(this, function() {
				if (typeof timing == "number" || timing == true) {
					this.hide();
				}
				REQUIRE(path)();
				if (typeof timing == "number") {
					handle.call(this, function() {
						this.menu();
					}, timing);
				}
			}, function(e) {
				this.control();
				retraceOrReport(e);
			});
		}
	});
})();

const attachDebugTestTool = function(post) {
	DEBUG_TEST_TOOL.attach();
	if (!DebugEditor.data.tests) {
		let list = DebugEditor.data.tests = {};
		FetchTestsSequence.execute(list);
	}
	DEBUG_TEST_TOOL.queue();
	handleThread(function() {
		FetchTestsSequence.assureYield();
		handle(function() {
			DEBUG_TEST_TOOL.describeMenu();
			if (DEBUG_TEST_TOOL.isQueued()) {
				DEBUG_TEST_TOOL.menu();
			}
			let accepted = true;
			tryout(function() {
				post && post(DEBUG_TEST_TOOL);
				accepted = false;
			});
			if (accepted) {
				attachProjectTool(function() {
					DEBUG_TEST_TOOL.deattach();
				});
			}
		});
	});
};

const DebugEditor = {
	data: {},
	fetchInformation: function(path) {
		return tryout(function() {
			let file = new java.io.File(Dirs.SCRIPT_TESTING, path + ".json");
			if (!file.exists()) throw null;
			return compileData(Files.read(file));
		}, function(e) {
			return null;
		}, {
			title: path,
			icon: "menuBoardWarning"
		});
	}
};

const ModificationSource = {
	selector: function() {
		let control = new MenuWindow();
		control.setOnClickListener(function() {
			attachProjectTool();
		});
		if (!this.attachSources(control)) {
			control.addMessage("worldSelectionRange", translate("There's we can't find any modification. Please, consider developer about that cause."));
		}
		if (supportSupportables) {
			this.attachSupportables(control);
		}
		control.show();
	},
	findModList: function() {
		return tryout(function() {
			let mods = Packages.com.zhekasmirnov.apparatus.modloader.ApparatusModLoader.getSingleton().getAllMods();
			let sorted = new java.util.ArrayList();
			for (let i = 0; i < mods.size(); i++) {
				let mod = mods.get(i);
				if (mod instanceof Packages.com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod) {
					sorted.add(mod.getLegacyModInstance());
				}
			}
			return sorted;
		}, function(e) {
			return findCorePackage().mod.build.ModLoader.instance.modsList;
		});
	},
	attachSources: function(control) {
		let modsList = this.findModList();
		if (modsList == null || modsList.size() == 0) {
			return false;
		}
		control.addCategory(translate("Which modification will be changed?"));
		for (let i = 0; i < modsList.size(); i++) {
			let mod = modsList.get(i);
			this.attachSource(control, mod);
		}
		return true;
	},
	attachSupportables: function(control) {
		/* let supportables = ExecuteableSupport.getModList();
		if (supportables.length == 0) return false;
		control.addCategory(translate("Or maybe checkout supportables"));
		for (let i = 0; i < supportables.length; i++) {
			let mod = supportables[i];
			this.attachSource(control, mod);
		}
		return true; */
		return false;
	},
	attachSource: function(control, mod) {
		let type = mod.getBuildType().toString(),
			dir = new java.io.File(mod.dir).getName(),
			version = mod.getInfoProperty("version") || "1.0",
			key = BitmapDrawableFactory.generateKeyFor("support/" + mod.getName(), false),
			icon = (BitmapDrawableFactory.isMapped(key) ? key : null);
		if (icon == null) {
			if (FileTools.exists(mod.dir + "mod_icon_dark.png")) {
				icon = mod.dir + "mod_icon_dark.png";
			} else if (FileTools.exists(mod.dir + "mod_icon.png")) {
				icon = mod.dir + "mod_icon.png";
			} else if (FileTools.exists(mod.dir + "icon.png")) {
				icon = mod.dir + "icon.png";
			} else {
				icon = "support";
			}
		}
		control.addMessage(icon, translate(mod.getName()) + " " + translate(version) +
			"\n/" + dir + " / " + translate(type), function() {
				ModificationSource.rebuild(mod, type);
			});
	},
	rebuild: function(mod, type) {
		if (type == "release") {
			confirm(translate("Decompilation"), translate("Modification currently was compiled into dexes.") + " " + translate("If you're developer, it may be decompiled.") + " " + translate("Do you want to continue?"), function() {
				// LogViewer.show();
				handleThread(function() {
					ModificationSource.requireDecompilerAsync(mod);
					handle(function() {
						ModificationSource.confirmSwitchBuild(mod);
						ModificationSource.selector();
						// Popups.closeIfOpened("logging");
					});
				});
				MenuWindow.hideCurrently();
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
						if (!result.wasFailed) ModificationSource.confirmSwitchBuild(mod);
						confirm(translate(result.name) + " " + translate(result.version), (result.wasFailed ?
								translate("Something went wrong during compilation process.") + " " + translate("Checkout reports below to see more details.") :
								translate("Modification successfully compiled.") + " " + translate("You can switch build type in next window.")) + " " +
							translate("Founded sources count") + ": " + (result.buildConfig ? tryout(function() {
								return result.buildConfig.getAllSourcesToCompile(true)
							}, function() {
								return result.buildConfig.getAllSourcesToCompile();
							}).size() : 0) + ".\n" +
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
		let dexer = AsyncStackedSnackSequence.access("compiler.js", mod, function(who) {
			yields = who;
		});
		if (yields !== false) dexer.assureYield();
		return yields;
	},
	requireDecompilerAsync: function(mod, yields) {
		let formatter = AsyncStackedSnackSequence.access("decompiler.js", mod, function(who) {
			yields = who;
		});
		if (yields !== false) formatter.assureYield();
		return yields;
	},
	confirmSwitchBuild: function(mod) {
		confirm(translate("Switch build type"), translate("Do you want to switch modification build type in build.config?"), function() {
			ModificationSource.switchBuild(mod, mod.getBuildType().toString());
			ModificationSource.selector();
		});
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

const LevelProvider = {};

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
	if (tps < .1 || tps >= 1000) return "0.0";
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
		if (instance.update() && LevelInfo.isLoaded()) {
			instance.updateRecursive();
		}
	}, 500);
};

LevelProvider.show = function() {
	let overlay = this.getOverlayWindow();
	if (overlay === null) return;
	if (this.update()) {
		overlay.show();
		this.updateRecursive();
	}
};

LevelProvider.hide = function() {
	let overlay = this.getOverlayWindow();
	if (overlay === null) return;
	overlay.hide();
};

const RuntimeCodeEvaluate = {};

RuntimeCodeEvaluate.setupNewContext = function() {
	let somewhere = this.somewhere = {};
	runCustomSource("runtime.js", {
		GLOBAL: somewhere
	});
	if (isEmpty(somewhere)) {
		MCSystem.throwException("Runtime couldn't be resolved");
	}
	return somewhere;
};

RuntimeCodeEvaluate.getContextOrSetupIfNeeded = function() {
	if (this.somewhere !== undefined) {
		return this.somewhere;
	}
	return this.setupNewContext();
};

RuntimeCodeEvaluate.showSpecifiedDialog = function(source, where) {
	let edit = new android.widget.EditText(context);
	edit.setHint(translate("Hi, I'm evaluate stroke"));
	source === undefined && (source = RuntimeCodeEvaluate.lastCode);
	where === undefined && (where = RuntimeCodeEvaluate.lastExecutable);
	if (source !== undefined) edit.setText(String(source));
	edit.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
		android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
		android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	edit.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
		android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
	edit.setTypeface(android.graphics.Typeface.MONOSPACE);
	edit.setTextColor(android.graphics.Color.WHITE);
	edit.setTextSize(Interface.getFontSize(21));
	edit.setHorizontalScrollBarEnabled(true);
	edit.setHorizontallyScrolling(true);
	edit.setSingleLine(false);
	edit.setMinLines(3);
	
	let dialog = new android.app.AlertDialog.Builder(context,
		android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setPositiveButton(translate("Evaluate"), function() {
		let something = tryout(function() {
			RuntimeCodeEvaluate.lastCode = String(edit.getText().toString());
			RuntimeCodeEvaluate.lastExecutable = where;
			if (where !== undefined && where !== null) {
				return where.evaluateStringInScope(RuntimeCodeEvaluate.lastCode);
			}
			return eval(RuntimeCodeEvaluate.lastCode);
		});
		if (something !== undefined) {
			showHint(something);
		}
	});
	dialog.setNeutralButton(translate("Export"), function() {
		tryout(function() {
			RuntimeCodeEvaluate.lastCode = String(edit.getText().toString());
			RuntimeCodeEvaluate.lastExecutable = where;
			RuntimeCodeEvaluate.exportEvaluate();
		});
	});
	dialog.setNegativeButton(translate("Cancel"), null);
	dialog.setCancelable(false).setView(edit);
	let something = dialog.create();
	tryout(function() {
		let identifier = context.getResources().getIdentifier("alertTitle", "id", context.getPackageName());
		if (identifier <= 0) {
			identifier = context.getResources().getIdentifier("alertTitle", "id", "android");
		}
		let title = something.findViewById(identifier > 0 ? identifier : android.R.id.title);
		if (title == null) {
			MCSystem.throwException("ModdingTools: not found actual android dialog title, using custom view");
		}
		return title;
	}, function(any) {
		Logger.Log(any, "INFO");
		let title = new android.widget.TextView(context);
		title.setPadding(Interface.getY(32), Interface.getY(16), Interface.getY(32), 0);
		title.setTextSize(Interface.getFontSize(36));
		title.setTextColor(Interface.Color.WHITE);
		title.setText(translate(NAME) + " " + translate(VERSION));
		something.setCustomTitle(title);
		return title;
	}).setOnClickListener(function(view) {
		tryout(function() {
			let executables = RuntimeCodeEvaluate.resolveAvailabledExecutables();
			let realExecutablePointer = [];
			let readableArray = [];
			for (let i = 0; i < executables.length; i++) {
				for (let element in executables[i]) {
					if (element == "__mod__") {
						continue;
					}
					for (let s = 0; s < executables[i][element].length; s++) {
						let source = executables[i][element][s];
						readableArray.push(executables[i].__mod__.name + ": " + source.name + " (" + element + ")");
						realExecutablePointer.push(source);
					}
				}
			}
			select(translate("Evaluate In"), readableArray, function(index, value) {
				where = realExecutablePointer[index];
				showHint(value);
			});
		});
	});
	something.getWindow().setLayout(Interface.Display.WIDTH / 1.3, Interface.Display.WRAP);
	something.show();
};

RuntimeCodeEvaluate.exportEvaluate = function() {
	saveFile(undefined, ".js", function(file) {
		Files.write(file, RuntimeCodeEvaluate.lastCode);
	}, undefined, Dirs.EVALUATE);
};

RuntimeCodeEvaluate.loadEvaluate = function() {
	selectFile(".js", function(file) {
		RuntimeCodeEvaluate.lastCode = Files.read(file);
		RuntimeCodeEvaluate.showSpecifiedDialog();
	}, undefined, Dirs.EVALUATE);
};

RuntimeCodeEvaluate.resolveSpecifiedTypeSources = function(modification, type) {
	let sources = modification[type];
	if (sources && sources.size() > 0) {
		let source = [];
		for (let w = 0; w < sources.size(); w++) {
			source.push(sources.get(w));
		}
		return source;
	}
	return null;
};

RuntimeCodeEvaluate.putSpecifiedTypeSources = function(modification, someone, type, name) {
	return require.call(this, function() {
		let specified = this.resolveSpecifiedTypeSources(modification, type);
		return specified && (someone[name] = specified) != null;
	}, new Function(), false);
};

RuntimeCodeEvaluate.resolveSpecifiedModificationSources = function(modification) {
	let someone = {};
	this.putSpecifiedTypeSources(modification, someone, "compiledModSources", "modification");
	this.putSpecifiedTypeSources(modification, someone, "compiledLauncherScripts", "launcher");
	this.putSpecifiedTypeSources(modification, someone, "compiledLibs", "library");
	this.putSpecifiedTypeSources(modification, someone, "compiledPreloaderScripts", "preloader");
	this.putSpecifiedTypeSources(modification, someone, "compiledInstantScripts", "instant");
	// TODO: Custom must additionaly added byself
	if (isEmpty(someone)) {
		return null;
	}
	someone.__mod__ = modification;
	return someone;
};

RuntimeCodeEvaluate.resolveAvailabledExecutables = function(callback) {
	let sources = ModificationSource.findModList(),
		modByName = [];
	for (let i = 0; i < sources.size(); i++) {
		let modification = sources.get(i);
		callback && callback(i + 1, sources.size());
		let someone = this.resolveSpecifiedModificationSources(modification);
		someone && modByName.push(someone);
	}
	return modByName;
};
