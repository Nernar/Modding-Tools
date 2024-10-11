imposeMaterial = function(bitmap, color) {
	let result = new android.graphics.Bitmap.createBitmap
		(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
	let canvas = new android.graphics.Canvas(result);
	let paint = new android.graphics.Paint();
	if (color !== undefined) {
		paint.setColorFilter(new android.graphics.LightingColorFilter(color, 0));
	}
	canvas.drawBitmap(bitmap, 0, 0, paint);
	return result;
};

overlayColor = function(input, output, color) {
	if (arguments.length < 3) {
		MCSystem.throwException("overlayColor: Usage: <inputFile> <outputFile> <color>");
	}
	log("overlayColor: " + input + " -> " + output);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("overlayColor: Input path not exists or directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("overlayColor: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let bitmap = android.graphics.BitmapFactory.decodeFile(inputFile);
	let imposed = imposeMaterial(bitmap, color);
	try {
	    bitmap.recycle();
	} catch (e) {}
	$.FileTools.writeBitmap(outputFile.getPath(), imposed);
	try {
		imposed.recycle();
	} catch (e) {}
};
