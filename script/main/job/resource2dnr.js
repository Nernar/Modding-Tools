resource2dnr = function(resourceDirectory, outputDirectory) {
	if (arguments.length < 2) {
		MCSystem.throwException("resource2dnr: Usage: <resourceDirectory> <outputDirectory>");
	}

	log("resource2dnr: " + resourceDirectory + ".. -> " + outputDirectory);

	let resources = Files.listFiles(resourceDirectory, "relative", "png");
	if (resources == null || resources.length == 0) {
		MCSystem.throwException("resource2dnr: Input resources directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (Files.isFile(resourceDirectory) && Files.isDirectory(outputDirectory)) {
		outputDirectory = Files.of(outputDirectory, Files.extension(Files.basename(resourceDirectory), "dnr"));
	}

	for (let i = 0, l = resources.length; i < l; i++) {
		let inputFile = Files.of(resourceDirectory, resources[i]);
		let outputFile = Files.of(outputDirectory, Files.extension(resources[i], "dnr"));
		let resource = Files.readAsBytes(inputFile);
		Files.write(outputFile, encodeResource(resource));
	}
};
