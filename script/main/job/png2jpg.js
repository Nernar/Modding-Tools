png2jpg = function(inputDirectory, outputDirectory, quality) {
	if (arguments.length < 2) {
		MCSystem.throwException("png2jpg: Usage: <inputDirectory> <outputDirectory> [quality=75]");
	}

	log("png2jpg: " + inputDirectory + ".. -> " + outputDirectory);

	let images = Files.listFiles(inputDirectory, "relative", "png");
	if (images == null || images.length == 0) {
		MCSystem.throwException("png2jpg: Input images directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (Files.isFile(inputDirectory) && Files.isDirectory(outputDirectory)) {
		outputDirectory = Files.of(outputDirectory, Files.extension(Files.basename(inputDirectory), "jpg"));
	}
	quality = quality >= 0 && quality <= 100 ? quality : 75;

	for (let i = 0, l = images.length; i < l; i++) {
		let inputFile = Files.of(inputDirectory, images[i]);
		let outputFile = Files.of(outputDirectory, Files.extension(images[i], "jpg"));
		if (Files.isFileDirectoryOrNew(outputFile)) {
			let bitmap = BitmapFactory.decodeFile(inputFile);
			try {
				bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, quality, new java.io.FileOutputStream(outputFile));
			} finally {
				bitmap.recycle();
			}
		}
	}
};
