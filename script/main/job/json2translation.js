json2translation = function(input, output, skipUnderscores) {
	if (arguments.length < 2) {
		throw new java.lang.IllegalArgumentException("json2translation: Usage: <langDirectory> <translationFile> [skipUnderscores]");
	}

	log("json2translation: " + input + ".. -> " + output);

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		throw new java.lang.IllegalArgumentException("json2translation: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let json = {};
	folderTarget(input, "lang").forEach(function(file) {
		let language = Files.basename(file, true);
		let outputJson = Files.of(input, language + ".json");
		if (!Files.isFile(outputJson)) {
			Logger.Log("json2translation: Flushing language " + language + " to JSON", "INFO");
			lang2json(file, outputJson, true);
		}
	});
	folderTarget(input, "json").forEach(function(file) {
		let language = Files.basename(file, true);
		if (language == "languages" || language == "language_names") {
			return;
		}
		let index = language.indexOf("_");
		if (index != -1) {
			language = language.substring(0, index);
		}
		let target = JSON.parse("" + $.FileTools.readFileText(file.getPath()));
		for (let key in target) {
			if (skipUnderscores !== false && key.indexOf("_") == 0) {
				continue;
			}
			if (!json.hasOwnProperty(key)) {
				json[key] = {};
			}
			json[key][language] = unescape("" + target[key]);
		}
	});

	let target = [];
	for (let key in json) {
		target.push("Translation.addTranslation(" + stringifyObject(key) + ", " + stringifyObject(json[key], true) + ");");
	}
	$.FileTools.writeFileText(outputFile.getPath(), target.join("\n"));
};
