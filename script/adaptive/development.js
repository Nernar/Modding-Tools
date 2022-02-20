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
			checkEvaluate();
		});
		category.addItem("blockDefineType", translate("Check"), function() {
			evaluateScope();
		});
		category.addItem("explorerExtensionScript", translate("Launch"), function() {
			checkEvaluate.loadEvaluate();
		});
		category.addItem("worldShape", translate("Require"), function() {
			let files = Files.listFileNames(Dirs.EVALUATE, true),
				more = Files.listFileNames(Dirs.ADAPTIVE, true);
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
		category.addItem("explorer", translate("Explorer"), function() {
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
	if (index == 3) {
		AsyncSnackSequence.access("resource.js", [Dirs.IMAGE, Dirs.ASSET]).assureYield();
		BitmapDrawableFactory.mapDirectory(Dirs.ASSET, true);
	}
	let process = this.__process.apply(this, arguments);
	if (index == 2) {
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
		if (!isInstant) {
			AsyncSnackSequence.access("translation.js", [__dir__ + "script/main/", __dir__ + "script/main/translation.js"]).assureYield();
		}
	} else if (index == 3) {
		AsyncSnackSequence.access("script.js", [Dirs.EVALUATE + "testing/", Dirs.TESTING]).assureYield();
		AsyncSnackSequence.access("script.js", [Dirs.ADAPTIVE + "testing/", Dirs.TESTING]).assureYield();
		if (debugIgnoreLockedBackground) {
			let popup = BitmapDrawableFactory.getMappedFileByKey("popup");
			BitmapDrawableFactory.mapAs("popupSelectionLocked", popup);
			BitmapDrawableFactory.mapAs("popupSelectionQueued", popup);
		}
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
