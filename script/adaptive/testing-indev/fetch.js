IMPORT("ModBrowser.Query:1");

Translation.addTranslation("%s\/%s mods", {
	ru: "%s\/%s модов"
});

return function() {
	handleThread(function() {
		let list = BrowserWorker.fetchList(),
			count = BrowserWorker.getCount();
		handle(function() {
			confirm(translate("%s\/%s mods", [list.length, count]), list.join("\n"));
		});
	});
};
