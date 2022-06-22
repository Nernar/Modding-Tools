IMPORT("ModBrowser.Query");

Translation.addTranslation("Downloaded", {
	ru: "Загружено"
});
Translation.addTranslation("%s mods", {
	ru: "%s модов"
});

let catchLastAvailabledId = function() {
	let query = new ModBrowser.Query.List();
	query.setIsHorizon(isHorizon);
	query.setSort(ModBrowser.Query.Sort.NEW);
	query.setLimit(1 + (!isHorizon));
	query.read();
	let json = query.getJSON();
	return json[json.length - 1].id;
};

return function() {
	checkOnlineable(function() {
		let downloaded = [];
		let lastId = catchLastAvailabledId();
		print("1 -> " + lastId);
		for (let i = 1; i <= lastId; i++) {
			let query = new ModBrowser.Query.Description();
			query.setLanguage(Translation.getLanguage());
			query.setIsHorizon(isHorizon);
			query.setCommentLimit(0);
			query.setId(i);
			tryout(function() {
				query.read();
				let description = query.getJSON();
				if (description.error) {
					throw null;
				}
				downloaded.push(i + ": " + description.title + " (" + description.author_name + ")");
				let author = new java.io.File(__dir__ + "modbrowser/" + description.author_name);
				author.mkdirs();
				tryout(function() {
					let downloader = ModBrowser.getDownloader(i, isHorizon);
					downloader.setPath(author.getPath() + "/" + description.title + ".icmod");
					downloader.download();
				}, function(e) {
					tryout(function() {
						if (isHorizon) {
							let downloader = ModBrowser.getDownloader(i, !isHorizon);
							downloader.setPath(author.getPath() + "/" + description.title + ".icmod");
							downloader.download();
							return;
						}
						throw null;
					}, function(e) {
						let flag = new java.io.File(author.getPath() + "/" + description.title + "." + i + ".noicmod");
						flag.createNewFile();
					});
				});
				print(downloaded[downloaded.length - 1]);
			}, new Function());
			java.lang.Thread.sleep(50 + 50 * Math.random());
		}
		let list = new java.io.File(__dir__ + "modbrowser/list.txt");
		Files.write(list, downloaded.join("\n"));
		confirm(translate("Downloaded") + " " + translate("%s mods", downloaded.length), downloaded.join("\n"));
	});
};
