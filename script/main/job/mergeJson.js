mergeJsonFiles = function(output, proto) {
	if (arguments.length == 1 && Array.isArray(output)) {
		return mergeJsonFiles.apply(this, output);
	}
	if (arguments.length < 2) {
		MCSystem.throwException("mergeJsonFiles: Usage: <outputFile> <prototypeFile> ...<inputFile>");
	}

	log("mergeJsonFiles: " + proto + ".. -> " + output);

	let protoFile = Files.of(proto);
	if (protoFile.isDirectory()) {
		MCSystem.throwException("mergeJsonFiles: Input path is directory");
	}
	proto = compileData(Files.read(proto));

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("mergeJsonFiles: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	for (let i = 2; i < arguments.length; i++) {
		proto = merge(proto, compileData(Files.read(arguments[i])));
	}
	Files.write(outputFile, stringifyObject(proto));
};

mergeJsonAtlases = function(atlas, input, output) {
	if (arguments.length < 3) {
		MCSystem.throwException("mergeJsonAtlases: Usage: <atlasName> <inputDirectoryOrFile> <outputFile>");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("mergeJsonAtlases: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let mergeable = Files.listFiles(input, "file", null, function(file) {
		return file.getName() == atlas;
	});
	if (mergeable == null || mergeable.length == 0) {
		MCSystem.throwException("mergeJsonAtlases: Directory is empty or atlas with given name does not exists");
	}
	mergeable.unshift(outputFile);

	log("mergeJsonAtlases: " + input + ", " + atlas + " -> " + output);

	mergeJsonFiles(mergeable);
};
