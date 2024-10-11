lang2json = function(input, output, beautify, delimiter) {
	if (arguments.length < 2) {
		MCSystem.throwException("lang2json: Usage: <langFile> <jsonFile> [beautify] [delimiter]");
	}

	log("lang2json: " + input + ".. -> " + output);

	let inputFile = Files.of(input);
	if (!Files.isFile(inputFile)) {
		MCSystem.throwException("lang2json: Input path not exists or is directory");
	}
	let lines = Files.readAsLinesUnsafe(inputFile);

	let outputFile = Files.of(output);
	if (!Files.isFileOrNew(outputFile)) {
		MCSystem.throwException("lang2json: Output path is directory");
	}

	delimiter = delimiter || "=";

	let json = {};
	for (let i = 0, l = lines.length; i < l; i++) {
		let line = lines[i].trimLeft();
		if (line.substring(0, 1) == "#" || line.substring(0, 2) == "//" || line == "") {
			continue;
		}
		let index = line.indexOf(delimiter);
		if (index == -1) {
			Logger.Log("lang2json: Invalid stroke " + stringifyObject(line) + " no key or accessor found", "WARNING");
			continue;
		}
		let key = line.substring(0, index);
		if (json.hasOwnProperty(key)) {
			Logger.Log("lang2json: Duplicate key " + stringifyObject(key) + " in " + stringifyObject(line), "INFO");
		}
		let value = line.substring(index + delimiter.length);
		if ((index = value.indexOf("#")) != -1 || (index = value.indexOf("//")) != -1) {
			value = value.substring(0, index).trimRight();
		}
		json[key] = value;
	}

	Files.writeUnsafe(outputFile, JSON.stringify(json, null, beautify ? "\t" : null));
};

json2translation = function(input, output, skipUnderscores) {
	if (arguments.length < 2) {
		MCSystem.throwException("json2translation: Usage: <langDirectory> <translationFile> [skipUnderscores]");
	}

	log("json2translation: " + input + ".. -> " + output);

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("json2translation: Output path is directory");
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

json2translationNoKeys = function(input, output, defaultLanguage, insertDefaultTranslations, skipUnderscores) {
	if (arguments.length < 2) {
		MCSystem.throwException("json2translationNoKeys: Usage: <langDirectory> <translationFile> [defaultLanguage] [insertDefaultTranslations] [skipUnderscores]");
	}

	log("json2translationNoKeys: " + input + ".. -> " + output);

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("json2translationNoKeys: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	defaultLanguage = defaultLanguage || "en_US";

	folderTarget(input, "lang").forEach(function(file) {
		let language = Files.basename(file, true);
		let outputJson = Files.of(input, language + ".json");
		if (!Files.isFile(outputJson)) {
			Logger.Log("json2translationNoKeys: Flushing language " + language + " to JSON", "INFO");
			lang2json(file, outputJson, true);
		}
	});

	let defaultFile = Files.of(input, defaultLanguage + ".json");
	if (!Files.isFile(defaultFile)) {
		defaultLanguage = defaultLanguage.toLowerCase();
		defaultFile = Files.of(input, defaultLanguage + ".json");
		if (!Files.isFile(defaultFile)) {
			let index = defaultLanguage.indexOf("_");
			if (index != -1) {
				defaultLanguage = defaultLanguage.substring(0, index);
				defaultFile = Files.of(input, defaultLanguage + ".json");
			}
		}
	}
	if (!Files.isFile(defaultFile)) {
		MCSystem.throwException("json2translationNoKeys: Default language " + defaultLanguage + " could not be found");
	}
	let keys = JSON.parse("" + $.FileTools.readFileText(defaultFile.getPath()));

	let json = {};
	folderTarget(input, "json").forEach(function(file) {
		let language = Files.basename(file, true);
		if (language == "languages" || language == "language_names" || defaultLanguage.toLowerCase() == language.toLowerCase()) {
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
			let value = target[key];
			if (keys.hasOwnProperty(key)) {
				key = keys[key];
			} else if (!insertDefaultTranslations) {
				Logger.Log("json2translationNoKeys: Illegal key '" + key + "' in " + language + ", it was not found in default translations", "WARNING");
				continue;
			}
			if (!json.hasOwnProperty(key)) {
				json[key] = {};
			}
			json[key][language] = unescape("" + value);
		}
	});

	for (let key in keys) {
		if (skipUnderscores !== false && key.indexOf("_") == 0) {
			continue;
		}
		if (!json.hasOwnProperty(keys[key])) {
			if (insertDefaultTranslations) {
				json[keys[key]] = {};
			}
			Logger.Log("json2translationNoKeys: Not found translations for default key '" + key + "'", "WARNING");
		}
	}

	let target = [];
	for (let key in json) {
		target.push("Translation.addTranslation(" + stringifyObject(key) + ", " + stringifyObject(json[key], true) + ");");
	}
	$.FileTools.writeFileText(outputFile.getPath(), target.join("\n"));
};
