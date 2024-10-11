atlas2colormap = function(inputFolder, outputJson, appendToExisting, minifyJson) {
	if (arguments.length < 2) {
		MCSystem.throwException("atlas2colormap: Usage: <inputFolder> <outputJson> [appendToExisting] [minifyJson]");
	}

	log("atlas2colormap: " + inputFolder + " -> " + outputJson);

	let textures = Files.listFiles(inputFolder, "relative", ["png", "tga"]);
	outputJson = Files.of(outputJson);
	if (Files.isDirectory(outputJson)) {
		MCSystem.throwException("atlas2colormap: Output json cannot be written!");
	}
	let colormap = {};
	if (appendToExisting && Files.isFile(outputJson)) {
		colormap = JSON.parse(Files.read(outputJson));
	}

	let width, height, pixels;
	for (let i = 0, l = textures.length; i < l; i++) {
		let texture = Files.of(modpackDirectory, textures[i]);
		let extension = Files.extension(textures[i]);
		if (Files.extension(textures[i]) == "tga") {
			let buffer = Files.readAsBytes(texture);
			pixels = net.npe.tga.TGAReader.read(buffer, net.npe.tga.TGAReader.ARGB);
			width = net.npe.tga.TGAReader.getWidth(buffer);
			height = net.npe.tga.TGAReader.getHeight(buffer); 
		} else {
			let bitmap = android.graphics.BitmapFactory.decodeFile(texture);
			width = bitmap.getWidth();
			height = bitmap.getHeight();
			pixels = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, width * height);
			bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
			bitmap.recycle();
		}
		let quantizer = new net.agilob.jhlabs.filter.OctTreeQuantizer();
		quantizer.setup(1);
		quantizer.addPixels(pixels, 0, width * height);
		let table = quantizer.buildColorTable();
		let color = 0;
		for (let i = 0; i < pixels.length; i++) {
			let next = table[quantizer.getIndexForColor(pixels[i])];
			if (next == 0) {
				continue;
			}
			color = next;
			if (color != -16777216) {
				break;
			}
		}
		colormap[textures[i].substring(0, textures[i].length - extension.length - 1)] = color;
	}

	Files.write(outputJson, minifyJson ? JSON.stringify(colormap) : JSON.stringify(colormap, null, "\t"));
};
