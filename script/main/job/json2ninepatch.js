getJsonNinepatch = function(width, height, source, type, scale) {
	if (typeof scale != "number") {
		scale = 1;
	}
	if (!Array.isArray(source) || source.length == 0 || source.length % 2 == 1 || (source.length == 4 && (type == 0 || type == 1))) {
		if (type == 2) {
			return;
		}
		return [[0, type == 0 ? (width - 1) * scale : (height - 1) * scale]];
	}
	if (source.length != 4 && (type == 0 || type == 1)) {
		return [[source.length == 2 || source.length == 6
				? source[type] * scale : source[type * 2] * scale,
			source.length == 2 || source.length == 6
				? ((type == 0 ? width : height) - source[type] - 1) * scale
				: source[type * 2 + 1] * scale]];
	}
	if (source.length == 4) {
		return [source[0] * scale, source[1] * scale, source[2] * scale, source[3] * scale];
	}
	return source.length == 2 ? undefined
		: source.length == 6 ? [source[2] * scale, source[3] * scale, source[4] * scale, source[5] * scale]
		: [source[4] * scale, source[5] * scale, source[6] * scale, source[7] * scale];
};

json2ninepatch = function(inputDirectory, outputDirectory, upscaleFactor) {
	if (arguments.length < 2) {
		MCSystem.throwException("json2ninepatch: Usage: <inputDirectory> <outputDirectory> [upscaleFactor]");
	}

	log("json2ninepatch: " + inputDirectory + " -> " + outputDirectory);

	inputDirectory = Files.of(inputDirectory);
	if (!Files.isDirectory(inputDirectory)) {
		MCSystem.throwException("json2ninepatch: Input directory does not exists, it should contain ninepatch.json!");
	}
	let ninepatchJson = Files.of(inputDirectory, "ninepatch.json");
	if (!Files.isFile(ninepatchJson)) {
		MCSystem.throwException("json2ninepatch: Input directory does not contain ninepatch.json!");
	}
	let ninepatches = JSON.parse(Files.read(ninepatchJson));
	if (upscaleFactor != null) {
		upscaleFactor = Math.min(2048, Math.max(upscaleFactor, 0));
	}
	outputDirectory = Files.of(outputDirectory);
	if (!Files.isDirectoryOrNew(outputDirectory)) {
		MCSystem.throwException("json2ninepatch: Output directory cannot be written!");
	}

	for (let path in ninepatches) {
		let inputFile = Files.of(inputDirectory, path);
		if (!Files.isFile(inputFile)) {
			Logger.Log("json2ninepatch: Image '" + path + "' does not exist in specified directory!", "WARNING");
			continue;
		}
		let bounds = Files.prepareBounds(inputFile);
		let outputFile = Files.of(outputDirectory, Files.extension(path, "png"));
		let xRegions = getJsonNinepatch(bounds[0], bounds[1], ninepatches[path], 0, upscaleFactor);
		let yRegions = getJsonNinepatch(bounds[0], bounds[1], ninepatches[path], 1, upscaleFactor);
		let margins = getJsonNinepatch(bounds[0], bounds[1], ninepatches[path], 2, upscaleFactor)
		png2ninepatch(inputFile, outputFile, xRegions, yRegions, margins, upscaleFactor);
	}
};
