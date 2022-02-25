const FetchTestsSequence = new LogotypeSequence({
	uncount: function(value) {
		if (value === undefined) return 0;
		let files = Files.listFileNames(Dirs.TESTING, true),
			scripts = Files.checkFormats(files, ".dns"),
			index = scripts.indexOf("attach.dns");
		if (index != -1) {
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
			json = DebugEditor.fetchInformation(name);
		if (json !== null) {
			tryout(function() {
				if (REQUIRE(name + ".dns") !== undefined) {
					value[name] = json;
				}
			});
		}
		return ++index;
	},
	cancel: function(error) {
		handle(function() {
			waitUntilEditorLaunched();
		}, this.getExpirationTime() * 2);
		LogotypeSequence.prototype.cancel.apply(this, arguments);
	},
	complete: function(active) {
		handle(function() {
			DebugEditor.menu();
		}, this.getExpirationTime());
		LogotypeSequence.prototype.complete.apply(this, arguments);
	}
});
