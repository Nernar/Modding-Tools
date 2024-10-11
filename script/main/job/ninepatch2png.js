
rescaleNinepatch = (function() {
	let canvas = new android.graphics.Canvas();
	return function(bitmap, width, height, recycle) {
		let source = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
		canvas.setBitmap(source);
		let ninepatch = new android.graphics.NinePatch(bitmap, bitmap.getNinePatchChunk());
		ninepatch.draw(canvas, new android.graphics.Rect(0, 0, width, height));
		if (recycle) {
			bitmap.recycle();
		}
		return source;
	};
})();

ninepatch2png = function(inputDirectory, outputDirectory, rescaleFunction) {
	if (arguments.length < 2) {
		MCSystem.throwException("ninepatch2png: Usage: <inputDirectory> <outputDirectory> [rescaleFunction]");
	}

	log("ninepatch2png: " + inputDirectory + " -> " + outputDirectory);

	let ninepatches = Files.listFiles(inputDirectory, "relative", "png");
	if (ninepatches == null || ninepatches.length == 0) {
		MCSystem.throwException("ninepatch2png: Input ninepatches directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (!Files.isDirectoryOrNew(outputDirectory)) {
		MCSystem.throwException("ninepatch2png: Output directory cannot be written!");
	}

	for (let i = 0, l = ninepatches.length; i < l; i++) {
		let inputFile = Files.of(inputDirectory, ninepatches[i]);
		let bitmap = BitmapFactory.decodeFile(inputFile);
		if (rescaleFunction != null) {
			let bounds = rescaleFunction(Files.extension(ninepatches[i], null), bitmap);
			if (bounds != null) {
				bitmap = rescaleNinepatch(bitmap, bounds[0], bounds[1], true);
			}
		}
		let outputFile = Files.of(outputDirectory, ninepatches[i]);
		if ("" + inputFile == "" + outputFile) {
			Files.copy(inputFile, Files.of(inputDirectory, ninepatches[i] + ".bak"));
		}
		let outputStream = new java.io.FileOutputStream(outputFile);
		bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);
		bitmap.recycle();
		try {
			outputStream.close();
		} catch (e) {}
	}
};

/*
ninepatch2png(__dir__ + "ninepatches", __dir__ + "images", function(relative, bitmap) {
	if (relative == "background") {
		return [748, 396];
	} else if (relative == "frame") {
		return [453, 258];
	} else if (relative == "panel") {
		return [195, 64];
	} else if (relative == "button_normal" || relative == "button_normal_hover") {
		return [236, 36];
	}
});
*/
