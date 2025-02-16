splitFile = function(fileDirectory, outputDirectory, chunkSize, copyUnchangedFiles) {
	if (arguments.length < 2) {
		MCSystem.throwException("splitFile: Usage: <fileDirectory> <outputDirectory> [chunkSize] [copyUnchangedFiles]");
	}

	log("splitFile: " + fileDirectory + ".. -> " + outputDirectory);

	let files = Files.listFiles(fileDirectory, "relative");
	if (files == null || files.length == 0) {
		MCSystem.throwException("splitFile: Input files directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (Files.isFile(fileDirectory) && Files.isDirectory(outputDirectory)) {
		outputDirectory = Files.of(outputDirectory, Files.basename(fileDirectory, true));
	}
	chunkSize > 0 || (chunkSize = 1048576);

	for (let index = 0, size = files.length; index < size; index++) {
		let inputFile = Files.of(fileDirectory, files[index]);
		files[index] || (files[index] = Files.basename(fileDirectory));
		let suffix = 1, offset = 0, outputFile, writer, line;

		let reader = new java.io.FileReader(inputFile);
        reader = new java.io.BufferedReader(reader);
		while ((line = reader.readLine()) != null) {
			let bytes = java.lang.String.valueOf(line).getBytes("UTF-8");
			if (writer == null || offset >= chunkSize || (offset > 0 && offset + bytes.length > chunkSize)) {
				try {
					writer == null || writer.close();
				} catch (e) {}
				outputFile = Files.of(outputDirectory, files[index] + "." + java.lang.String.format("%03.0f", suffix++));
				if (!Files.isFileOrNew(outputFile)) {
					MCSystem.throwException("splitFile: Output file " + files[index] + " chunk " + suffix + " cannot be written!");
				}
				writer = new java.io.FileWriter(outputFile);
				writer = new java.io.BufferedWriter(writer);
				writer = new java.io.PrintWriter(writer);
				offset = 0;
			}
			writer.println(line);
			offset += bytes.length;
		}
        try {
            reader.close();
        } catch (e) {}
		try {
			writer == null || writer.close();
		} catch (e) {}

		if (suffix <= 1) {
			if (outputFile == null) {
				Logger.Log("splitFile: Input file " + files[index] + " is empty or cannot be readen!", "WARNING");
				continue;
			}
			if (copyUnchangedFiles) {
				Files.copy(outputFile, Files.of(outputDirectory, files[index]));
			}
			Files.remove(outputFile);
		} else {
			Logger.Log("splitFile: Written file " + files[index] + " with " + suffix + " chunks.", "INFO");
		}
	}
};
