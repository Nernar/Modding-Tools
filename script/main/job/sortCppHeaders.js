sortCppHeaders = function(inputDirectory, outputDirectory) {
	if (arguments.length < 2) {
		MCSystem.throwException("sortCppHeaders: Usage: <inputDirectory> <outputDirectory>");
	}

	log("sortCppHeaders: " + inputDirectory + ".. -> " + outputDirectory);

	let headers = Files.listFiles(inputDirectory, "relative", "h");
	if (headers == null || headers.length == 0) {
		MCSystem.throwException("sortCppHeaders: Input headers directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (Files.isFile(inputDirectory) && Files.isDirectory(outputDirectory)) {
		outputDirectory = Files.of(outputDirectory, Files.extension(Files.basename(inputDirectory), "h"));
	}

	for (let i = 0, l = headers.length; i < l; i++) {
		let inputFile = Files.of(inputDirectory, headers[i]);
		let outputFile = Files.of(outputDirectory, headers[i]);
		let lines = Files.readAsLines(inputFile);

		let chunks = [];
		for (let j = 0, m = lines.length, offset; j <= m; j++) {
			if (j != m && /^[\s\/]*(virtual )?void /.test(lines[j])) {
				offset == null && (offset = j);
			} else if (offset != null) {
				offset != j - 1 && chunks.push([offset, j]);
				offset = null;
			}
		}

		for (let j = 0, m = chunks.length; j < m; j++) {
			let chunk = lines.slice(chunks[j][0], chunks[j][1]);
			chunk = chunk.sort();
			chunk.unshift(chunks[j][0], chunks[j][1] - chunks[j][0]);
			Array.prototype.splice.apply(lines, chunk);
		}

		Files.writeLines(outputFile, lines);
		Logger.Log("sortCppHeaders: Sorted " + headers[i] + " " + lines.length + " lines " + (chunks.length > 0 ? "with " + chunks.length + " chunks" : "without chunks"));
	}
};
