script2dns = function(scriptDirectory, outputDirectory) {
	if (arguments.length < 2) {
		MCSystem.throwException("script2dns: Usage: <scriptDirectory> <outputDirectory>");
	}

	log("script2dns: " + scriptDirectory + ".. -> " + outputDirectory);

	let scripts = Files.listFiles(scriptDirectory, "relative", "js");
	if (scripts == null || scripts.length == 0) {
		MCSystem.throwException("script2dns: Input scripts directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (Files.isFile(scriptDirectory) && Files.isDirectory(outputDirectory)) {
		outputDirectory = Files.of(outputDirectory, Files.extension(Files.basename(scriptDirectory), "dns"));
	}

	for (let i = 0, l = scripts.length; i < l; i++) {
		let inputFile = Files.of(scriptDirectory, scripts[i]);
		let outputFile = Files.of(outputDirectory, Files.extension(scripts[i], "dns"));
		let executable = Files.read(inputFile).trim();
		Files.write(outputFile, compileExecuteable(executable));
	}
};
