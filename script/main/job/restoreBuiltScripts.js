restoreBuiltScripts = function(script, directory, includes) {
	if (arguments.length < 2) {
		MCSystem.throwException("restoreBuiltScripts: Usage: <scriptFile> <outputDirectory> [includesCustomName]");
	}

	let inputScript = Files.of(script);
	if (inputScript.isDirectory() || !inputScript.exists()) {
		MCSystem.throwException("restoreBuiltScripts: Built script file does not exists or is directory");
	}
	let lines = Files.readAsLines(inputScript);

	let outputDirectory = Files.of(directory);
	if (Files.isFile(outputDirectory)) {
		MCSystem.throwException("restoreBuiltScripts: Output script directory is file");
	} else if (outputDirectory.exists()) {
		Files.remove(outputDirectory);
	}

	let includesFile = Files.of(outputDirectory, includes || ".includes");
	if (Files.isDirectory(includesFile)) {
		MCSystem.throwException("restoreBuiltScripts: Output includes file is directory");
	}

	let filename = null;
	let offset = -1;

	for (let i = 0, l = lines.length; i < l; i++) {
		if (lines[i].startsWith("// file: ")) {
			if (filename != null) {
				let output = Files.of(outputDirectory, filename);
				if (Files.isFile(output)) {
					Logger.Log("restoreBuiltScripts: " + filename + " already exists, appending code to it!", "WARNING");
					Files.append(output, lines.slice(offset, i).join("\n").trim() + "\n", 2);
				} else {
					Files.write(output, lines.slice(offset, i).join("\n").trim() + "\n");
				}
			}
			filename = lines[i].substring(9);
			Files.append(includesFile, filename, offset != -1);
			offset = i + 1;
		}
	}
	if (offset != -1) {
		Files.write(Files.of(outputDirectory, filename), lines.slice(offset).join("\n").trim() + "\n");
		Files.append(includesFile, "\n");
	}
};
