const DEBUG_TEST_TOOL = (function() {
	return new MenuTool({
		tests: {},
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
						attachProjectTool(undefined, function() {
							tool.deattach();
						});
					}
				}, {
					type: "category",
					title: translate("Debug")
				}];
				for (let test in tool.tests) {
					let descriptor = tool.getTestDescriptor(test, tool.tests[test]);
					if (descriptor) selector.push(descriptor);
				}
				if (selector.length <= 2) {
					return selector.concat([{
						type: "message",
						icon: "menuBoardConfig",
						message: translate("Developer hasn't provided any test for that build. Please, checkout that section for next time.")
					}]);
				}
				return selector;
			}
		},
		getTestDescriptor: function(path, json) {
			let information = this.fetchInformation(path);
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
		fetchInformation: function(path) {
			try {
				let file = new java.io.File(Dirs.SCRIPT_TESTING, path + ".json");
				if (!file.exists()) throw new java.lang.IllegalArgumentException("ModdingTools: Testing script " + path + " not found");
				return compileData(Files.read(file));
			} catch (e) {
				reportError(e);
			}
			return {
				title: path,
				icon: "menuBoardWarning"
			};
		},
		evaluateTest: function(path, timing) {
			try {
				if (typeof timing == "number" || timing == true) {
					this.hide();
				}
				REQUIRE(path)();
				if (typeof timing == "number") {
					handle.call(this, function() {
						this.menu();
					}, timing);
				}
			} catch (e) {
				this.control();
				reportError(e);
			}
		}
	});
})();

const attachDebugTestTool = function(post) {
	DEBUG_TEST_TOOL.attach();
	if (!DEBUG_TEST_TOOL.completedRequest) {
		FetchTestsSequence.execute(DEBUG_TEST_TOOL.tests);
		DEBUG_TEST_TOOL.completedRequest = true;
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
			try {
				post && post(DEBUG_TEST_TOOL);
				accepted = false;
			} catch (e) {
				reportError(e);
			}
			if (accepted) {
				attachProjectTool(function() {
					DEBUG_TEST_TOOL.deattach();
				});
			}
		});
	});
};

const FetchTestsSequence = new LogotypeSequence({
	uncount: function(value) {
		if (value === undefined) return 0;
		let files = Files.listFileNames(Dirs.SCRIPT_TESTING, true),
			scripts = Files.checkFormats(files, ".dns"),
			index = scripts.indexOf("attach.dns");
		if (index > -1) {
			scripts.splice(index, 1)
			REQUIRE("attach.dns");
		}
		this.targeted = scripts;
		return scripts.length;
	},
	next: function(value, index) {
		return this.targeted[index];
	},
	process: function(element, value, index) {
		let name = Files.getNameWithoutExtension(element),
			json = DEBUG_TEST_TOOL.fetchInformation(name);
		if (json) {
			try {
				if (REQUIRE(name + ".dns") !== undefined) {
					value[name] = json;
				}
			} catch (e) {
				reportError(e);
			}
		}
		return ++index;
	},
	cancel: function(error) {
		handle(function() {
			attachProjectTool();
		}, this.getExpirationTime() * 2);
		LogotypeSequence.prototype.cancel.apply(this, arguments);
	},
	complete: function(active) {
		handle(function() {
			DEBUG_TEST_TOOL.menu();
		}, this.getExpirationTime());
		LogotypeSequence.prototype.complete.apply(this, arguments);
	}
});
