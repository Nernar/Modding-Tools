file2bitmap = function(input) {
	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("file2bitmap: Input path not exists or directory");
	}

	try {
		let bitmap = android.graphics.BitmapFactory.decodeFile(inputFile);
		if (bitmap == null) {
			throw null;
		}
		return bitmap;
	} catch (e) {
		let buffer = Files.readAsBytes(inputFile);

		let pixels = Packages.net.npe.tga.TGAReader.read(buffer, Packages.net.npe.tga.TGAReader.ARGB);
		let width = Packages.net.npe.tga.TGAReader.getWidth(buffer);
		let height = Packages.net.npe.tga.TGAReader.getHeight(buffer);

		return android.graphics.Bitmap.createBitmap(pixels, width, height, android.graphics.Bitmap.Config.ARGB_8888);
	}
};

tga2png = function(input, output) {
	if (arguments.length < 2) {
		MCSystem.throwException("tga2png: Usage: <inputFile> <outputFile>");
	}

	log("tga2png: " + input + " -> " + output);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("tga2png: Input path not exists or is directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("tga2png: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let buffer = Files.readAsBytes(inputFile);
	let pixels = Packages.net.npe.tga.TGAReader.read(buffer, Packages.net.npe.tga.TGAReader.ARGB);
	let width = Packages.net.npe.tga.TGAReader.getWidth(buffer);
	let height = Packages.net.npe.tga.TGAReader.getHeight(buffer);

	Files.ensureFile(output);
	let bitmap = android.graphics.Bitmap.createBitmap(pixels, width, height, android.graphics.Bitmap.Config.ARGB_8888);
	bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, new java.io.FileOutputStream(outputFile));
	bitmap.recycle();
};
