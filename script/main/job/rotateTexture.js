rotateBitmap = function(bitmap, degrees) {
	let matrix = new android.graphics.Matrix();
	matrix.postRotate(degrees);
	let frames = [];
	for (let i = 0; i < bitmap.getHeight() / bitmap.getWidth(); i++) {
		frames.push(
		    android.graphics.Bitmap.createBitmap(
		        bitmap, 0, bitmap.getWidth() * i, bitmap.getWidth(), bitmap.getWidth(), matrix, true
		    )
		);
	}
	let result = new android.graphics.Bitmap.createBitmap(
	    bitmap.getWidth(), bitmap.getWidth() * frames.length, android.graphics.Bitmap.Config.ARGB_8888
	);
	let canvas = new android.graphics.Canvas(result);
	let paint = new android.graphics.Paint();
	for (let i = 0; i < frames.length; i++) {
	    canvas.drawBitmap(frames[i], 0, bitmap.getWidth() * i, paint);
	    try {
	        frames[i].recycle();
	    } catch (e) {}
	}
	return result;
};

rotateTexture = function(input, output, degrees) {
	if (arguments.length < 3) {
		MCSystem.throwException("rotateTexture: Usage: <inputFile> <outputFile> <degrees>");
	}
	log("rotateTexture: " + input + " -> " + output);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("rotateTexture: Input path not exists or is directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("rotateTexture: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let bitmap = android.graphics.BitmapFactory.decodeFile(inputFile);
	let imposed = rotateBitmap(bitmap, degrees);
	try {
	    bitmap.recycle();
	} catch (e) {}
	$.FileTools.writeBitmap(outputFile.getPath(), imposed);
	try {
		imposed.recycle();
	} catch (e) {}
};
