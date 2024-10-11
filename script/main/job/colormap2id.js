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
