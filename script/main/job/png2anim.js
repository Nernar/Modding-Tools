png2anim = function(input, output, meta) {
	if (arguments.length < 2) {
		MCSystem.throwException("png2anim: Usage: <inputFile> <outputFile> [metaJson]");
	}

	log("png2anim: " + input + " -> " + output);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("png2anim: Input path not exists or is directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("png2anim: Output path is directory");
	}

	outputFile.getParentFile().mkdirs();
	if (meta && !meta.hasOwnProperty("animation")) {
		$.FileTools.copy(inputFile, outputFile);
		return;
	}

	let bitmap = android.graphics.BitmapFactory.decodeFile(inputFile);

	let frameDuration = parseInt(meta ? meta.animation.frametime : 0) || 20;
	let frameCount = bitmap.getHeight() / bitmap.getWidth();
	if (frameCount == 1) {
		$.FileTools.copy(inputFile, outputFile);
		try {
			bitmap.recycle();
		} catch (e) {}
		return;
	}
	if (frameCount % 1 > 0) {
		MCSystem.throwException("png2anim: Non-square image size " + bitmap.getWidth() + "x" + bitmap.getHeight());
	}

	let frameToCount = frameCount;
	if (meta && meta.animation.hasOwnProperty("frames")) {
		frameToCount = meta.animation.frames.length || frameToCount;
	}
	let frameBitmaps = [];
	for (let i = 0; i < frameCount; i++) {
		frameBitmaps.push(android.graphics.Bitmap.createBitmap(bitmap,
			0, i * bitmap.getWidth(), bitmap.getWidth(), bitmap.getWidth()));
	}
	try {
		bitmap.recycle();
	} catch (e) {}

	let image = android.graphics.Bitmap.createBitmap(bitmap.getWidth(),
		bitmap.getWidth() * frameToCount, android.graphics.Bitmap.Config.ARGB_8888);
	let canvas = new android.graphics.Canvas(image);
	let paint = new android.graphics.Paint();
	for (let i = 0; i < frameToCount; i++) {
		let current = i;
		if (meta && meta.animation.hasOwnProperty("frames")) {
			let next = meta.animation.frames[i];
			next = typeof next == "object" ? next.index : next;
			if (typeof next == "number" && !isNaN(next)) {
				current = next;
			}
		}
		canvas.drawBitmap(frameBitmaps[current], 0, i * bitmap.getWidth(), paint);
	}

	$.FileTools.writeBitmap(Files.basename(outputFile, true) + ".anim." + frameDuration + ".png", image);
	$.FileTools.writeBitmap(outputFile.getPath(), frameBitmaps[0]);
	try {
		image.recycle();
	} catch (e) {}
	try {
		frameBitmaps.forEach(function(what) {
			what.recycle();
		});
	} catch (e) {}
};

mcmeta2anim = function(input, output) {
	if (arguments.length < 2) {
		MCSystem.throwException("mcmeta2anim: Usage: <inputMetaFile> <outputFile>");
	}

	log("mcmeta2anim: " + input + " -> " + output);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("mcmeta2anim: Input path not exists or directory");
	}

	let mcmeta = JSON.parse("" + $.FileTools.readFileText(inputFile.getPath()));
	return png2anim(Files.basename(inputFile, true), output, mcmeta);
};
