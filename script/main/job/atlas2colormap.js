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

atlasInnerCore2colormap = function(modpackDirectory, outputJson, appendToExisting, minifyJson) {
	if (arguments.length < 2) {
		MCSystem.throwException("atlasInnerCore2colormap: Usage: <modpackDirectory> <outputJson> [appendToExisting] [minifyJson]");
	}

	log("atlasInnerCore2colormap: " + modpackDirectory + " -> " + outputJson);

	let mods = Files.listDirectories(modpackDirectory, "relative", function(file, relative) {
		return Files.isFile(Files.of(file, "build.config"));
	});
	outputJson = Files.of(outputJson);
	if (Files.isDirectory(outputJson)) {
		MCSystem.throwException("atlasInnerCore2colormap: Output json cannot be written!");
	}
	let colormap = {};
	if (appendToExisting && Files.isFile(outputJson)) {
		colormap = JSON.parse(Files.read(outputJson));
	}

	let resources = [];
	for (let i = 0, l = mods.length; i < l; i++) {
		let buildConfig = Files.read(Files.of(modpackDirectory, mods[i], "build.config"));
		try {
			buildConfig = JSON.parse(buildConfig);
			if (buildConfig.resources != null) {
				for (let j = 0, m = buildConfig.resources.length; j < m; j++) {
					let entry = buildConfig.resources[j];
					if (entry.resourceType == "resource") {
						let terrainDirectory = Files.of(modpackDirectory, mods[i], entry.path);
						if (Files.isDirectory(terrainDirectory)) {
							terrainDirectory = Files.of(terrain, "terrain-atlas");
							if (Files.isDirectory(terrainDirectory)) {
								resources.push(Files.relative(terrainDirectory, modpackDirectory));
							}
						}
					}
				}
			}
		} catch (e) {
			Logger.Log("atlasInnerCore2colormap(" + mods[i] + "): Malformed build.config, skipping it!", "WARNING");
		}
	}

	let textures = [];
	for (let i = 0, l = resources.length; i < l; i++) {
		textures.concat(Files.listFiles(Files.of(modpackDirectory, resources[i]), "relative", ["png", "tga"], function(file, relative) {
			return relative.indexOf(".anim.") == -1;
		}, modpackDirectory));
	}

	let width, height, pixels;
	for (let i = 0, l = textures.length; i < l; i++) {
		let texture = Files.of(modpackDirectory, textures[i]);
		let extension = Files.extension(textures[i]);
		let basename = Files.basename(textures[i], extension);
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
		let address = parseTextureFile(basename);
		if (address[1] >= 128) {
			Logger.Log("atlasInnerCore2colormap: Texture " + address[0] + " will be skipped because too high meta is used: " + address[1], "WARNING");
			continue;
		} else if (colormap[address[0]] == null) {
			colormap[address[0]] = [];
		} else if (!(colormap[address[0]][address[1]] === undefined || colormap[address[0]][address[1]] == color)) {
			Logger.Log("atlasInnerCore2colormap: Color will be overriden " + colormap[address[0]][address[1]] + " -> " + color + " in " + address[0] + ":" + address[1], "INFO");
		}
		colormap[address[0]][address[1]] = color;
	}

	Files.write(outputJson, minifyJson ? JSON.stringify(colormap) : JSON.stringify(colormap, null, "\t"));
};
