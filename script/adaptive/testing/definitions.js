Translation.addTranslation("Firstly, place correctly %s into modification", {
	ru: "Для начала поместите корректный %s в модификацию"
});

return function() {
	let file = new java.io.File(__dir__, "sound_definitions.json");
	if (!file.exists()) {
		showHint(translate("Firstly, place correctly %s into modification", file.getName()));
		return;
	}
	let json = compileData(Files.read(file), "object"),
		categories = {},
		result = [];
	for (let item in json) {
		let currently = json[item];
		if (typeof currently != "object") continue;
		let category = currently.category;
		if (category === undefined) {
			if (result.length == 0) {
				result.push(item);
				continue;
			}
			result[0] += ", " + item;
			continue;
		}
		if (categories[category] === undefined) {
			categories[category] = [];
		}
		categories[category].push(item);
	}
	for (let category in categories) {
		result.push(category + ": " + categories[category].join(", "));
	}
	
	let output = new java.io.File(__dir__, file.getName().replace(".json", ".txt"));
	Files.write(output, result.join("\n\n"));
};
