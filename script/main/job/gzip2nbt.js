gzip2le = function(input, output, internKeys, internValues) {
	if (arguments.length < 2) {
		MCSystem.throwException("gzip2le: Usage: <inputFile> <outputFile> [internKeys] [internValues]");
	}

	log("gzip2le: " + input + " -> " + output);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("gzip2le: Input path not exists or is directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("gzip2le: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let input = new java.io.FileInputStream(inputFile);
	let reader = Packages.com.nukkitx.nbt.NbtUtils.createGZIPReader(input, !!internKeys, !!internValues);
	let output = new java.io.FileOutputStream(outputFile);
	let stream = Packages.com.nukkitx.nbt.NbtUtils.createWriterLE(output);
	stream.writeTag(reader.readTag());
	try {
		reader.close();
	} catch (e) {}
	try {
		stream.close();
	} catch (e) {}
};

gzip2nbt = function(input, output, internKeys, internValues) {
	if (arguments.length < 2) {
		MCSystem.throwException("gzip2nbt: Usage: <inputFile> <outputFile> [internKeys] [internValues]");
	}
	log("gzip2nbt: " + input + " -> " + output);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("gzip2nbt: Input path not exists or directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("gzip2nbt: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let input = new java.io.FileInputStream(inputFile);
	let reader = Packages.com.nukkitx.nbt.NbtUtils.createGZIPReader(input, !!internKeys, !!internValues);
	let output = new java.io.FileOutputStream(outputFile);
	let stream = Packages.com.nukkitx.nbt.NbtUtils.createWriter(output);
	stream.writeTag(reader.readTag());
	try {
		reader.close();
	} catch (e) {}
	try {
		stream.close();
	} catch (e) {}
};
