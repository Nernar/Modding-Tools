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

parseTextureFile = function(what) {
	if (what.indexOf("/") != -1) {
		what = Files.basename(what);
	}
	let underscore = what.lastIndexOf("_");
	if (underscore > 0) {
		let meta = what.substring(underscore + 1, underscore.length) - 0;
		if (!isNaN(meta)) {
			return [what.substring(0, underscore), meta];
		}
	}
	return [what, 0];
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

colormap2id = function(blocksJson, atlasJson, colormapJson, outputJson) {
	if (arguments.length < 4) {
		MCSystem.throwException("colormap2id: Usage: <blocksJson> <atlasJson> <colormapJson> <outputJson>");
	}

	log("colormap2id: " + colormapJson + " -> " + outputJson);

	blocksJson = Files.of(blocksJson);
	if (!Files.isFile(blocksJson)) {
		MCSystem.throwException("colormap2id: Input blocks json is not found!");
	}
	atlasJson = Files.of(atlasJson);
	if (!Files.isFile(atlasJson)) {
		MCSystem.throwException("colormap2id: Input atlas json is not found!");
	}
	colormapJson = Files.of(colormapJson);
	if (!Files.isFile(colormapJson)) {
		MCSystem.throwException("colormap2id: Input colormap json is not found!");
	}
	outputJson = Files.of(outputJson);
	if (Files.isDirectory(outputJson)) {
		MCSystem.throwException("colormap2id: Output json cannot be written!");
	}

	let blocks = compileData(Files.read(blocksJson));
	let atlas = compileData(Files.read(atlasJson));
	let colormap = JSON.parse(Files.read(colormapJson));

	let mapping = {};
	for (let element in atlas.texture_data) {
		let textures = atlas.texture_data[element == "grass_top" ? "grass_side" : element].textures;
		let shortcut = [];
		if (!Array.isArray(textures)) {
			textures = [textures];
		}
		for (let i = 0; i < textures.length; i++) {
			let texture = textures[i];
			if (typeof texture == "object") {
				if (texture.hasOwnProperty("overlay_color")) {
					shortcut[i] = android.graphics.Color.parseColor(texture.overlay_color) - 0;
					continue;
				}
				texture = texture.path;
			}
			if (colormap.hasOwnProperty(texture)) {	
				shortcut[i] = colormap[texture];
				continue;
			}
			let index = texture.lastIndexOf("/");
			if (index != -1) {
				texture = texture.substring(index + 1, texture.length);
				if (colormap.hasOwnProperty(texture)) {
					shortcut[i] = colormap[texture];
					continue;
				}
			}
			Logger.Log("colormap2id: Not found atlas element " + element + ":" + i, "WARNING");
		}
		if (shortcut.length == 0) {
			Logger.Log("colormap2id: Not found atlas " + element, "WARNING");
			continue;
		}
		mapping[element] = shortcut;
	}

	let ids = {};
	for (let identifier in blocks) {
		let texture = blocks[identifier].textures;
		if (typeof texture == "object") {
			// atlas will be bring on top block side
			if (texture.hasOwnProperty("up")) {
				texture = texture.up;
			} else {
				// then use first one
				for (let element in texture) {
					texture = texture[element];
					break;
				}
			}
		}
		// on some air or something similar
		if (texture === undefined) {
			continue;
		}
		if (mapping.hasOwnProperty(texture)) {
			ids[identifier] = mapping[texture];
			continue;
		}
		Logger.Log("colormap2id: Not found texture '" + texture + "'", "WARNING");
	}
	Files.write(outputJson, JSON.stringify(ids, null, "\t"));
};

colormapMergeId = function(colormapDirectory, idsDirectory, outputJson, minifyJson) {
	if (arguments.length < 3) {
		MCSystem.throwException("colormapMergeId: Usage: <colormapDirectory> <idsDirectory> <outputJson> [minifyJson]");
	}

	log("colormapMergeId: " + idsJson + " -> " + outputJson);

	let colormapJsons = Files.listFiles(colormapDirectory, "relative", "json");
	if (colormapJsons == null || colormapJsons.length == 0) {
		MCSystem.throwException("colormapMergeId: Input colormap directory does not exists or empty!");
	}
	let idsJsons = Files.listFiles(idsDirectory, "relative", "json");
	if (idsJsons == null || idsJsons.length == 0) {
		MCSystem.throwException("colormapMergeId: Input ids directory does not exists or empty!");
	}

	let colormap = {};
	for (let i = 0, l = colormapJsons.length; i < l; i++) {
		let json = JSON.parse(Files.read(Files.of(colormapDirectory, colormapJsons[i])));
		if (json == null) {
			Logger.Log("colormapMergeId: Malformed colormap " + colormapJsons[i], "WARNING");
			continue;
		}
		for (let element in json) {
			if (!colormap.hasOwnProperty(element)) {
				colormap[element] = json[element];
			} else {
				for (let c = 0; c < json[element].length; c++) {
					if (json[element][c] === undefined || json[element][c] === null) {
						continue;
					}
					if (!(colormap[element][c] === undefined || colormap[element][c] === null)) {
						log("colormapMergeId: Override " + element + ":" + c + " will be applied on " + colormapJsons[i]);
					}
					colormap[element][c] = json[element][c];
				}
			}
		}
	}

	let merged = {};
	for (let i = 0, l = idsJsons.length; i < l; i++) {
		let json = JSON.parse(Files.read(Files.of(idsDirectory, idsJsons[i])));
		if (json == null) {
			Logger.Log("colormapMergeId: Malformed ids " + idsJsons[i], "WARNING");
			continue;
		}
		for (let element in json) {
			let result = [];
			for (let r = 0, m = json[element].length; r < m; r++) {
				if (json[element][r] == null) {
					continue;
				}
				let atlas = parseTextureFile(json[element][r]);
				if (colormap.hasOwnProperty(atlas[0])) {
					result[r] = colormap[atlas[0]][atlas[1]];
					if (typeof result[r] != "number") {
						Logger.Log("colormapMergeId: Colormap " + atlas[0] + ":" + atlas[1] + " not found in " + element, "WARNING");
						result[r] = -1;
					}
				}
			}
			if (merged.hasOwnProperty(element)) {
				for (let r = 0; r < result.length; r++) {
					if (typeof merged[element][r] == "number") {
						if (result[r] == -1 || merged[element][r] == result[r]) {
							continue;
						}
						log("colormapMergeId: Replacing " + merged[element][r] + " -> " + result[r] + " in " + element);
					}
					merged[element][r] = result[r];
				}
				continue;
			}
			if (result.length == 0) {
				log("colormapMergeId: Not found any texture in " + element);
				continue;
			}
			merged[element] = result;
		}
	}
	Files.write(outputJson, minifyJson ? JSON.stringify(merged) : JSON.stringify(merged, null, "\t"));
};
