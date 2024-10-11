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
