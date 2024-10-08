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

const getDebugScripts = function() {
	let evaluates = Files.listFiles(Dirs.EVALUATE, "relative", "js");
	let adaptives = Files.listFiles(Dirs.SCRIPT_ADAPTIVE, "relative", "js");
	let files = evaluates && adaptives ? evaluates.concat(adaptives) : (evaluates || adaptives || []);
	for (let file, i = 0; i < files.length; i++) {
		if (REQUIRE.loaded.indexOf(file = files[i]) != -1) {
			if (REQUIRE.results[file] === undefined) {
				files.splice(i--, 1);
			}
		}
	}
	return files;
};

SHARE("getDebugScripts", getDebugScripts);

let debugAttachControlTools = true;

MenuWindow.parseJson = function() {
	let instanceOrJson = MenuWindow.__parseJson.apply(this, arguments);
	if (debugAttachControlTools && REVISION.startsWith("develop")) {
		let category = instanceOrJson.addCategory(translate("Development"));
		category.addItem("menuBoardInsert", translate("Evaluate"), function() {
			RuntimeCodeEvaluate.showSpecifiedDialog();
		});
		category.addItem("inspectorType", translate("Check"), function() {
			CHECKOUT("provider.js", function(who) {
				evaluateScope();
			});
		});
		category.addItem("explorerExtensionScript", translate("Launch"), function() {
			RuntimeCodeEvaluate.loadEvaluate();
		});
		category.addItem("inspectorObject", translate("Require"), function() {
			select(translate("What's need to require?"), getDebugScripts(), function(index, path) {
				let output = REQUIRE(path);
				if (typeof output == "function") {
					output();
				} else if (output !== undefined) {
					showHint(output);
				}
			});
		});
		category.addItem("explorerImport", translate("Manager"), function() {
			attachAdvancedExplorer();
		});
		category.addItem("explorerExtensionImage", translate("Pack"), function() {
			handleThread(function() {
				if ($.FileTools.exists(Dirs.INTERNAL_UI)) {
					AsyncSequence.access("packer.dns", [Dirs.INTERNAL_UI, Dirs.ASSET, 192], null, new SnackSequence()).assureYield();
				}
				BitmapDrawableFactory.mapDirectory(Dirs.ASSET, true);
			});
		});
		category.addItem("explorerExtensionJson", translate("Locale"), function() {
			handleThread(function() {
				let script = Files.listFiles([__dir__, "script", "main"]);
				if ($.FileTools.exists(Dirs.SCRIPT_ADAPTIVE)) {
					AsyncSequence.access("translation.dns", [Files.listFiles(Dirs.SCRIPT_ADAPTIVE).concat(script), __dir__ + "script/main/translation.js", __dir__ + "script/"], null, new SnackSequence()).assureYield();
				} else {
					AsyncSequence.access("translation.dns", [script, __dir__ + "script/main/translation.js"], null, new SnackSequence()).assureYield();
				}
				let file = Files.of(__dir__).getParentFile();
				let parent = file.listFiles();
				for (let i = 0; i < parent.length; i++) {
					let name = ("" + parent[i].getName()).toLowerCase();
					if (name.indexOf("modding-tools-") != 0 || name == "modding-tools-template") {
						continue;
					}
					let target = Files.listFiles([parent[i], "script", "main"]);
					AsyncSequence.access("translation.dns", [target.slice().concat(script), parent[i].getPath() + "/script/main/translation.js", file.getPath() + "/", target], null, new SnackSequence()).assureYield();
				}
			});
		});
		category.addItem("explorerExtensionScript", translate("Compile"), function() {
			handleThread(function() {
				if ($.FileTools.exists(Dirs.SCRIPT_ADAPTIVE + "sequence/")) {
					AsyncSequence.access("script.dns", [Dirs.SCRIPT_ADAPTIVE + "sequence/", Dirs.SCRIPT_REVISION + "sequence/"], null, new SnackSequence()).assureYield();
				}
				let internal = Files.of(Dirs.SCRIPT_ADAPTIVE + "bridge.js");
				if (!Files.isFile(internal)) {
					log("Modding Tools: Internal bridge is not found, normally it should be recompiled!");
					return;
				}
				let reader = new java.io.FileReader(internal);
				InnerCorePackages.mod.executable.Compiler.compileScriptToFile(reader, "bridge", Dirs.SCRIPT_REVISION + "bridge.dex");
				showHint(translate("Bridge might be reloaded after restart"));
			});
		});
	}
	return instanceOrJson;
};

let debugAttachBackground = false;

(function(self) {
	let action;
	ControlFragment.CollapsedButton.prototype.resetContainer = function() {
		self.apply(this, arguments);
		if (this.patchedToEvaluation) {
			return;
		}
		this.patchedToEvaluation = true;
		this.setOnHoldListener(function(fragment) {
			if (typeof action == "function") {
				if (action.apply(this, arguments) == true) {
					return true;
				}
			}
			RuntimeCodeEvaluate.showSpecifiedDialog();
			return true;
		});
		this.setOnHoldListener = function(what) {
			action = what;
		};
	};
})(ControlFragment.CollapsedButton.prototype.resetContainer);

Translation.addTranslation("If you're wouldn't see development panel here, it may be removed.", {
	ru: "Если панель разработчика сейчас не нужна, она может быть удалена."
});
Translation.addTranslation("Modification is outgoing to produce? Let's compile anything that's we're developed!", {
	ru: "Модификация подготовлена к производству? Давайте скомпилируем все, что мы разработали!"
});

let debugIgnoreLockedBackground = false;

AdditionalMessageFactory.registerClickable("menuProjectManage", translate("If you're wouldn't see development panel here, it may be removed."), 1, function(message) {
	debugAttachControlTools = !debugAttachControlTools;
	let control = message.getWindow();
	control.removeElement(message);
	control.removeElement(0);
}, function() {
	return debugAttachControlTools;
});

CHECKOUT("produce.js", function(who) {
	AdditionalMessageFactory.registerClickable("explorerImport", translate("Modification is outgoing to produce? Let's compile anything that's we're developed!"), 0.5, function(message) {
		REQUIRE("produce.js")(function() {
			UniqueHelper.requireDestroy();
			WindowProvider.destroy();
		});
	});
});

SHARE({
	debugAttachControlTools: {
		enumerable: true,
		get: function() {
			return debugAttachControlTools;
		},
		set: function(v) {
			debugAttachControlTools = !!v;
		}
	},
	debugAttachBackground: {
		enumerable: true,
		get: function() {
			return debugAttachBackground;
		},
		set: function(v) {
			debugAttachBackground = !!v;
			CHECKOUT("interface/background.js", function(who) {
				if (debugAttachBackground) {
					attachBackground();
				} else {
					deattachBackground();
				}
			});
		}
	},
	debugIgnoreLockedBackground: {
		enumerable: true,
		get: function() {
			return debugIgnoreLockedBackground;
		},
		set: function(v) {
			debugIgnoreLockedBackground = !!v;
			if (debugIgnoreLockedBackground) {
				let popup = BitmapDrawableFactory.getMappedFileByKey("popup");
				BitmapDrawableFactory.mapAs("popupSelectionLocked", popup);
				BitmapDrawableFactory.mapAs("popupSelectionQueued", popup);
			}
		}
	}
});

function incontextualTest(scope) {
	__debug_typecheck__(scope);
	contextualTest(function(index) {
		__debug_typecheck__(scope);
		if (index == 2) {
			print(scope.okayge);
		}
	});
}

SHARE("incontextualTest", incontextualTest);
