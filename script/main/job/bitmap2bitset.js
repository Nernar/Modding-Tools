bitmap2bitset = function(inputDirectory, outputDirectory, maximumSize, ignoredBitmaps) {
	if (arguments.length < 2) {
		MCSystem.throwException("bitmap2bitset: Usage: <inputDirectory> <outputDirectory> [maximumSize] [ignoredBitmaps]");
	}

	log("bitmap2bitset: " + inputDirectory + " -> " + outputDirectory);

	inputDirectory = Files.of(inputDirectory);
	let icons = Files.listFiles(inputDirectory, "relative", "png");
	if (icons == null || icons.length == 0) {
		MCSystem.throwException("bitmap2bitset: Input directory is not directory or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (!Files.isDirectoryOrNew(outputDirectory)) {
		MCSystem.throwException("bitmap2bitset: Output directory cannot be written!");
	}
	maximumSize = maximumSize !== undefined ? parseInt(maximumSize) : 128;
	maximumSize = Math.max(Math.min(maximumSize, 256), 1);

	for (let i = 0, l = icons.length; i < l; i++) {
		let relative = Files.extension(icons[i], null);
		let output = Files.of(outputDirectory, relative + ".bitset");
		let bitmap = BitmapFactory.decodeFile(Files.of(inputDirectory, icons[i]));
		if (bitmap.getWidth() > maximumSize || bitmap.getHeight() > maximumSize) {
			bitmap.recycle();
			log("bitmap2bitset: Bitmap " + relative + " skipped, because maximum " + maximumSize + " resolution allowed");
			if (ignoredBitmaps != null) {
				ignoredBitmaps.push(icons[i]);
			}
			continue;
		}
		let array = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, bitmap.getWidth() * bitmap.getHeight());
		bitmap.getPixels(array, 0, bitmap.getWidth(), 0, 0, bitmap.getWidth(), bitmap.getHeight());
		let bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, (bitmap.getWidth() * bitmap.getHeight() >> 3) + 2);
		bytes[0] = bitmap.getWidth() - 129;
		bytes[1] = bitmap.getHeight() - 129;
		bitmap.recycle();
		let setOfBit = java.util.BitSet.valueOf(bytes);
		for (let a = 0, b = array.length; a < b; a++) {
			if (array[a] < -1) {
				log("bitmap2bitset: Pixel " + a + " in " + relative + " out of range -1..0: " + array[a]);
				if (ignoredBitmaps != null) {
					ignoredBitmaps.push(icons[i]);
					break;
				}
			}
			setOfBit.set(16 + a, !!array[a]);
		}
		if (ignoredBitmaps == null || ignoredBitmaps.indexOf(icons[i]) == -1) {
			Files.write(output, setOfBit.toByteArray());
		}
	}
};

bitmap2bitsetBase64 = function(inputDirectory, outputJson, maximumSize, ignoredBitmaps, simplifyKeys) {
	if (arguments.length < 2) {
		MCSystem.throwException("bitmap2bitsetBase64: Usage: <inputDirectory> <outputJson> [maximumSize] [ignoredBitmaps] [simplifyKeys]");
	}

	log("bitmap2bitsetBase64: " + inputDirectory + " -> " + outputJson);

	inputDirectory = Files.of(inputDirectory);
	let icons = Files.listFiles(inputDirectory, "relative", "png");
	if (icons == null || icons.length == 0) {
		MCSystem.throwException("bitmap2bitsetBase64: Input directory is not directory or empty!");
	}
	outputJson = Files.of(outputJson);
	if (!Files.isFileOrNew(outputJson)) {
		MCSystem.throwException("bitmap2bitsetBase64: Output json cannot be written!");
	}
	maximumSize = maximumSize !== undefined ? parseInt(maximumSize) : 128;
	maximumSize = Math.max(Math.min(maximumSize, 256), 1);

	let base64 = {};
	for (let i = 0, l = icons.length; i < l; i++) {
		let relative = Files.extension(icons[i], null);
		let inputFile = Files.of(inputDirectory, icons[i]);
		let bitmap = BitmapFactory.decodeFile(inputFile);
		if (bitmap.getWidth() > maximumSize || bitmap.getHeight() > maximumSize) {
			bitmap.recycle();
			log("bitmap2bitsetBase64: Bitmap " + relative + " skipped, because maximum " + maximumSize + " resolution allowed");
			if (ignoredBitmaps != null) {
				ignoredBitmaps.push(icons[i]);
			}
			continue;
		}
		let array = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, bitmap.getWidth() * bitmap.getHeight());
		bitmap.getPixels(array, 0, bitmap.getWidth(), 0, 0, bitmap.getWidth(), bitmap.getHeight());
		let bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, (bitmap.getWidth() * bitmap.getHeight() >> 3) + 2);
		bytes[0] = bitmap.getWidth() - 129;
		bytes[1] = bitmap.getHeight() - 129;
		bitmap.recycle();
		let setOfBit = java.util.BitSet.valueOf(bytes);
		for (let a = 0, b = array.length; a < b; a++) {
			if (array[a] < -1) {
				log("bitmap2bitsetBase64: Pixel " + a + " in " + relative + " out of range -1..0: " + array[a]);
				if (ignoredBitmaps != null) {
					ignoredBitmaps.push(icons[i]);
					break;
				}
			}
			setOfBit.set(16 + a, !!array[a]);
		}
		if (ignoredBitmaps == null || ignoredBitmaps.indexOf(icons[i]) == -1) {
			if (simplifyKeys) {
				relative = BitmapDrawableFactory.generateKeyFor(relative, false);
			}
			base64[relative] = Base64.encodeToString(setOfBit.toByteArray());
		}
	}

	Files.write(outputJson, JSON.stringify(base64));
};
