IMPORT("ModBrowser.Query:1");

Translation.addTranslation("Downloaded", {
	ru: "Загружено"
});
Translation.addTranslation("%s mods", {
	ru: "%s модов"
});

return function() {
	handleThread(function() {
		let worker = new BrowserWorker(),
			fetched = new Array();
		worker.setCallback({
			onFetchMod: function(list, mod) {
				fetched.push(mod.title + " " + mod.version_name);
				showHint(mod.title + ": " + mod.description);
			}
		});
		let list = worker.getList();
		new java.io.File(__dir__ + "mods").mkdirs();
		for (let i = 0; i < list.length; i++) {
			let file = new java.io.File(__dir__ + "mods", list[i].title);
			if (!file.exists()) file.mkdirs();
			else Files.deleteDir(file.getPath());
			worker.download(list[i].id, file);
		}
		Files.write(new java.io.File(__dir__ + "mods", "fetch.json"), JSON.stringify(list));
		confirm(translate("Done"), translate("Downloaded") + " " + translate("%s mods", list.length), fetched.join("\n"));
	});
};
