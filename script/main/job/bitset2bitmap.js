/*
0      47  /
1-10   48  0..9
11-36  65  A..Z
37     95  _
38-63  97  a..z
*/

bitsToInteger = function(bitset, offset, radix) {
	let integer = 0;
	for (let bit = 0; bit < radix; bit++) {
		integer += bitset.get(offset + bit) * Math.pow(2, bit);
	}
	return integer;
};

bitset2bitmap = function(inputDirectory, outputDirectory) {
	if (arguments.length < 2) {
		MCSystem.throwException("bitset2bitmap: Usage: <inputDirectory> <outputDirectory>");
	}

	log("bitset2bitmap: " + inputDirectory + " -> " + outputDirectory);

	let files = Files.listFiles(inputDirectory, "relative", "bitset");
	if (files == null || files.length == 0) {
		MCSystem.throwException("bitset2bitmap: Input bitsets directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (!Files.isDirectoryOrNew(outputDirectory)) {
		MCSystem.throwException("bitset2bitmap: Output directory cannot be written!");
	}
	inputDirectory = Files.of(inputDirectory);

	for (let i = 0, l = files.length; i < l; i++) {
		let relative = Files.extension(files[i], null);
		let output = Files.of(outputDirectory, relative + ".png");
		let bytes = Files.readAsBytes(Files.of(inputDirectory, files[i]));
		// let width = bytes[0] + 129;
		// let height = bytes[1] + 129;
		let setOfBit = java.util.BitSet.valueOf(bytes);
		let width = bitsToInteger(setOfBit, 0, 8);
		let height = bitsToInteger(setOfBit, 8, 8);
		let pixels = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, width * height);
		for (let a = 0; a < pixels.length; a++) {
			pixels[a] = -setOfBit.get(a + 16);
		}
		Files.ensureFile(output);
		let bitmap = android.graphics.Bitmap.createBitmap(pixels, width, height, android.graphics.Bitmap.Config.ARGB_4444);
		bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, new java.io.FileOutputStream(output));
		bitmap.recycle();
	}
};