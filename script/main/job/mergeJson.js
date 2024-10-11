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
