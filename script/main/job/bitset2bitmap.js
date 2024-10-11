/*
0      47  /
1-10   48  0..9
11-36  65  A..Z
37     95  _
38-63  97  a..z
*/

sbit2ascii = function(sbit) {
	let code = sbit == 0 ? 47 : 95;
	if (sbit > 0 && sbit != 37) {
		if (sbit < 12) {
			code = sbit + 47;
		} else if (sbit < 37) {
			code = sbit + 54;
		} else if (sbit < 64) {
			code = sbit + 59;
		}
	}
	return String.fromCharCode(code);
};

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

/*
0-7    label size    byte
8++    label         sbit of letter
14-21  width         byte
22-29  height        byte
30++   filled image  bit of pixel
*/

readSbit = function(bitset, offset) {
	let symbols = [];
	for (let symbol = 0, length = bitsToInteger(bitset, offset, 8); symbol < length; symbol++) {
		symbols.push(sbit2ascii(bitsToInteger(bitset, offset + 8 + (symbol * 6), 6)));
	}
	return symbols.join("");
};

bitsetOfBitmap2bitmap = function(inputBitsetOfBitmap, outputDirectory) {
	if (arguments.length < 2) {
		MCSystem.throwException("bitsetOfBitmap2bitmap: Usage: <inputBitsetOfBitmap> <outputDirectory>");
	}

	log("bitsetOfBitmap2bitmap: " + inputBitsetOfBitmap + " -> " + outputDirectory);

	inputBitsetOfBitmap = Files.of(inputBitsetOfBitmap);
	if (!Files.isFile(inputBitsetOfBitmap)) {
		MCSystem.throwException("bitsetOfBitmap2bitmap: Input bitset of bitmap does not exists!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (!Files.isDirectoryOrNew(outputDirectory)) {
		MCSystem.throwException("bitsetOfBitmap2bitmap: Output directory cannot be written!");
	}

	let bitsetOfBitmap = Files.readAsBytes(inputBitsetOfBitmap);
	let setOfBit = java.util.BitSet.valueOf(bitsetOfBitmap);
	let offset = 0;

	while (bitsToInteger(setOfBit, offset, 8) != 0) {
		let label = readSbit(setOfBit, offset);
		offset += 8 + label.length * 6;
		let output = Files.of(outputDirectory, label + ".png");
		let width = bitsToInteger(setOfBit, offset, 8);
		let height = bitsToInteger(setOfBit, offset + 8, 8);
		offset += 16;
		let pixels = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, width * height);
		for (let a = 0; a < pixels.length; a++) {
			pixels[a] = -setOfBit.get(offset++);
		}
		Files.ensureFile(output);
		let bitmap = android.graphics.Bitmap.createBitmap(pixels, width, height, android.graphics.Bitmap.Config.ARGB_4444);
		bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, new java.io.FileOutputStream(output));
		bitmap.recycle();
	}
};
