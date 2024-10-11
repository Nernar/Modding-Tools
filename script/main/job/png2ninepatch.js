png2ninepatch = function(inputFile, outputFile, xRegions, yRegions, margins, upscaleFactor) {
	if (arguments.length < 4) {
		MCSystem.throwException("png2ninepatch: Usage: <inputFile> <outputFile> <xRegions> <yRegions> [margins] [upscaleFactor]");
	}

	log("png2ninepatch: " + inputFile + " -> " + outputFile);

	if (!(Array.isArray(xRegions) && Array.isArray(yRegions))) {
		MCSystem.throwException("png2ninepatch: Both xRegions and yRegions should be provided!");
	}
	inputFile = Files.of(inputFile);
	if (!Files.isFile(inputFile)) {
		MCSystem.throwException("png2ninepatch: Input file does not exists or directory!");
	}
	outputFile = Files.of(outputFile);
	if (!Files.isFileOrNew(outputFile)) {
		MCSystem.throwException("png2ninepatch: Output ninepatch cannot be written!");
	}

	let bitmap = BitmapFactory.decodeFile(inputFile);
	if (upscaleFactor != null) {
		upscaleFactor = Math.min(2048, Math.max(upscaleFactor, 0));
		let upscaled = BitmapFactory.createScaled(bitmap, bitmap.getWidth() * upscaleFactor, bitmap.getHeight() * upscaleFactor);
		bitmap.recycle();
		bitmap = upscaled;
	}
	let baos = new java.io.ByteArrayOutputStream();
	bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, baos);
	baos.flush();
	let data = out.toByteArray();

	function writeNinepatchRegions(data, buffer) {
		if (!Array.isArray(data)) {
			return;
		}
		for (let i = 0, l = data.length; i < l; i++) {
			buffer.putInt(data[i][0]);
			buffer.putInt(data[i][1] + 1);
		}
	}

	function getNinepatchRegions(divs, max) {
		if (!Array.isArray(divs)) {
			return 0;
		}
		let count = 0;
		for (let i = 0, l = divs.length; i < l; i++) {
			if (i == 0 && divs[i][0] != 0) {
				count++;
			}
			if (i > 0) {
				count++;
			}
			count++;
			if (i == divs.length - 1 && divs[i][1] < max) {
				count++;
			}
		}
		return count;
	}

	let colours = [];
	for (let j = 0, m = getNinepatchRegions(xRegions, bitmap.getWidth()) * getNinepatchRegions(yRegions, bitmap.getHeight()); j < m; j++) {
		colours.push(1);
	}
	bitmap.recycle();
	let xDivs = xRegions.length * 2;
	let yDivs = yRegions.length * 2;
	let buffer = java.nio.ByteBuffer.allocate((xDivs + yDivs + colours.length) * 4 + 32).order(java.nio.ByteOrder.BIG_ENDIAN);
	buffer.put(1);
	buffer.put(xDivs);
	buffer.put(yDivs);
	buffer.put(colours.length);
	buffer.putInt(0);
	buffer.putInt(0);
	if (Array.isArray(margins) && margins.length >= 4) {
		buffer.putInt(margins[0]); // left
		buffer.putInt(margins[1]); // right
		buffer.putInt(margins[2]); // top
		buffer.putInt(margins[3]); // bottom
	} else {
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(0);
	}
	buffer.putInt(0);
	writeNinepatchRegions(xRegions, buffer);
	writeNinepatchRegions(yRegions, buffer);
	for (let j = 0, m = colours.length; j < m; j++) {
		buffer.putInt(colours[j]);
	}

	let nptc = buffer.array();
	let nptcLen = java.nio.ByteBuffer.allocate(4).putInt(nptc.length).array();
	let nptcTypeArray = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4);
	nptcTypeArray[0] = 110;
	nptcTypeArray[1] = 112;
	nptcTypeArray[2] = 84;
	nptcTypeArray[3] = 99;
	let nptcType = java.nio.ByteBuffer.allocate(4).put(nptcTypeArray).array();
	let crc = new java.util.zip.CRC32();
	crc.update(nptcType);
	crc.update(nptc);

	let outputStream = new java.io.FileOutputStream(outputFile);
	outputStream.write(data, 0, data.length - 12);
	outputStream.write(nptcLen);
	outputStream.write(nptcType);
	outputStream.write(nptc);
	outputStream.write(
		java.nio.ByteBuffer.allocate(4)
			.putInt(java.lang.Long.valueOf(crc.getValue()).intValue())
			.array());
	outputStream.write(data, data.length - 12, 12);
	outputStream.flush();
	try {
		outputStream.close();
	} catch (e) {}
};
