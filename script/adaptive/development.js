Translation.addTranslation("Development", {
	ru: "Разработка"
});
Translation.addTranslation("Launch", {
	ru: "Запуск"
});
Translation.addTranslation("Require", {
	ru: "Запрос"
});
Translation.addTranslation("What's need to require?", {
	ru: "Что нужно запросить?"
});
Translation.addTranslation("Check", {
	ru: "Отладить"
});

MenuWindow.__parseJson = MenuWindow.parseJson;

let debugAttachControlTools = true;
MenuWindow.parseJson = function() {
	let instanceOrJson = MenuWindow.__parseJson.apply(this, arguments);
	if (debugAttachControlTools && REVISION.startsWith("develop")) {
		let category = instanceOrJson.addCategory(translate("Development"));
		category.addItem("menuBoardInsert", translate("Evaluate"), function() {
			RuntimeCodeEvaluate.showSpecifiedDialog();
		});
		category.addItem("inspectorType", translate("Check"), function() {
			CHECKOUT("provider.js", null, function(who) {
				evaluateScope();
			});
		});
		category.addItem("explorerExtensionScript", translate("Launch"), function() {
			RuntimeCodeEvaluate.loadEvaluate();
		});
		category.addItem("inspectorObject", translate("Require"), function() {
			let files = Files.listFileNames(Dirs.EVALUATE, true),
				more = Files.listFileNames(Dirs.SCRIPT_ADAPTIVE, true);
			files = Files.checkFormats(files.concat(more), ".js");
			for (let i = 0; i < files.length; i++) {
				let file = files[i];
				if (REQUIRE.loaded.indexOf(file) != -1) {
					if (REQUIRE.results[file] === undefined) {
						files.splice(i, 1);
						i--;
					}
				}
			}
			select(translate("What's need to require?"), files, function(index, path) {
				let output = REQUIRE(path);
				if (typeof output == "function") {
					output();
				} else if (output !== undefined) {
					showHint(output);
				}
			});
		});
		category.addItem("explorerImport", translate("File Manager"), function() {
			attachAdvancedExplorer();
		});
	}
	return instanceOrJson;
};

LaunchSequence.__create = LaunchSequence.create;

let debugAttachBackground = false;

LaunchSequence.create = function() {
	CHECKOUT("interface/background.js", null, function(who) {
		if (debugAttachBackground) {
			attachBackground();
		}
	});
	this.__create.apply(this, arguments);
	CHECKOUT("provider.js", null, function(who) {
		attachEvalButton();
	});
};

Translation.addTranslation("If you're wouldn't see development panel here, it may be removed.", {
	ru: "Если панель разработчика сейчас не нужна, она может быть удалена."
});
Translation.addTranslation("Modification is outgoing to produce? Let's compile anything that's we're developed!", {
	ru: "Модификация подготовлена к производству? Давайте скомпилируем все, что мы разработали!"
});

LaunchSequence.__process = LaunchSequence.process;

let debugIgnoreLockedBackground = true;

LaunchSequence.process = function(index) {
	if (index == 1) {
		showHint.unstackLaunch();
	} else if (index == 3) {
		if ($.FileTools.exists(Dirs.INTERNAL_UI)) {
			AsyncSnackSequence.access("packer.dns", [Dirs.INTERNAL_UI, Dirs.ASSET, 192]).assureYield();
		}
		BitmapDrawableFactory.mapDirectory(Dirs.ASSET, true);
	}
	let process = this.__process.apply(this, arguments);
	if (index == 2) {
		if (debugIgnoreLockedBackground) {
			let popup = BitmapDrawableFactory.getMappedFileByKey("popup");
			BitmapDrawableFactory.mapAs("popupSelectionLocked", popup);
			BitmapDrawableFactory.mapAs("popupSelectionQueued", popup);
		}
		CHECKOUT("produce.js", null, function(who) {
			AdditionalMessageFactory.registerClickable("menuProjectManage", translate("If you're wouldn't see development panel here, it may be removed."), 1, function(message) {
				debugAttachControlTools = !debugAttachControlTools;
				let control = message.getWindow();
				control.removeElement(message);
				control.removeElement(0);
			}, function() {
				return debugAttachControlTools;
			});
			AdditionalMessageFactory.registerClickable("explorerImport", translate("Modification is outgoing to produce? Let's compile anything that's we're developed!"), 0.5, function(message) {
				REQUIRE("produce.js")(function() {
					UniqueHelper.requireDestroy();
					WindowProvider.destroy();
					CHECKOUT("provider.js", null, function(who) {
						attachEvalButton();
					});
				});
			});
		});
		AsyncSnackSequence.access("translation.dns", [__dir__ + "script/main/", __dir__ + "script/main/translation.js"]).assureYield();
	} else if (index == 3) {
		tryoutSafety(function() {
			if ($.FileTools.exists(Dirs.EVALUATE + "testing/")) {
				AsyncSnackSequence.access("script.dns", [Dirs.EVALUATE + "testing/", Dirs.SCRIPT_TESTING]).assureYield();
			}
			if ($.FileTools.exists(Dirs.SCRIPT_ADAPTIVE + "testing/")) {
				AsyncSnackSequence.access("script.dns", [Dirs.SCRIPT_ADAPTIVE + "testing/", Dirs.SCRIPT_TESTING]).assureYield();
			}
			if ($.FileTools.exists(Dirs.SCRIPT_ADAPTIVE + "sequence/")) {
				AsyncSnackSequence.access("script.dns", [Dirs.SCRIPT_ADAPTIVE + "sequence/", Dirs.SCRIPT_REVISION + "sequence/"]).assureYield();
			}
			let internal = new java.io.File(Dirs.SCRIPT_ADAPTIVE + "bridge.js");
			if (!internal.exists()) {
				return;
			}
			let reader = new java.io.FileReader(internal);
			INNERCORE_PACKAGE.mod.executable.Compiler.compileScriptToFile(reader, "bridge", Dirs.SCRIPT_REVISION + "bridge.jar");
		});
	}
	return process;
};

SHARE({
	debugAttachControlTools: {
		enumerable: true,
		get: function() {
			return debugAttachControlTools;
		},
		set: function(v) {
			debugAttachControlTools = Boolean(v);
		}
	},
	debugAttachBackground: {
		enumerable: true,
		get: function() {
			return debugAttachBackground;
		},
		set: function(v) {
			debugAttachBackground = Boolean(v);
		}
	},
	debugIgnoreLockedBackground: {
		enumerable: true,
		get: function() {
			return debugIgnoreLockedBackground;
		},
		set: function(v) {
			debugIgnoreLockedBackground = Boolean(v);
		}
	}
});

CHECKOUT("development/explorer.js");
