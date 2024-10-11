structureConversionPalette = function(target) {
	let reader = new java.io.FileReader(Files.of(target));
	reader = java.io.BufferedReader(reader);
	let palette = {};
	let line;
	while (line = reader.readLine()) {
		line = "" + line;
		if (line.charAt(0) == "*") {
			continue;
		}
		let index = line.indexOf("->");
		if (index == -1) {
			let what = line.trim();
			if (what.length == 0) {
				continue;
			}
			palette[what] = what;
			continue;
		}
		let what = line.substring(0, index).trim();
		let lastIndex = line.lastIndexOf("->");
		let who = line.substring(lastIndex + 2, line.length).trim();
		if (what.length == 0 || who.length == 0) {
			log("structureConversionPalette: Palette line \"" + line + "\" malformed: object or subject identifier is empty");
			continue;
		}
		if (palette.hasOwnProperty(what)) {
			log("structureConversionPalette: Ppalette already has property " + what + ", it will be overriden");
		}
		palette[what] = who;
	}
	try {
		reader.close();
	} catch (e) {}
	return palette;
};

structure2mcstructure = function(input, output, palette, internKeys, internValues) {
	if (arguments.length < 3) {
		MCSystem.throwException("structure2mcstructure: Usage: <inputFile> <outputFile> <palette> [internKeys] [internValues]");
	}

	log("structure2mcstructure: " + input + " -> " + output);

	let paletteConversion = (function(target) {
		if (typeof target == "object") {
			return target;
		}
		let paletteFile = Files.of(target);
		if (!paletteFile.exists() || paletteFile.isDirectory()) {
			MCSystem.throwException("structure2mcstructure: Palette path not exists or is directory");
		}
		return structureConversionPalette(paletteFile);
	})(palette);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("structure2mcstructure: Input path not exists or is directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("structure2mcstructure: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let input = new java.io.FileInputStream(inputFile);
	let reader = com.nukkitx.nbt.NbtUtils.createGZIPReader(input, !!internKeys, !!internValues);

	let nbt = reader.readTag();
	try {
		reader.close();
	} catch (e) {}
	if (!(nbt instanceof com.nukkitx.nbt.NbtMap)) {
		MCSystem.throwException("structure2mcstructure: Input structure malformed, root tag must be compound");
	}

	let mcstructure = com.nukkitx.nbt.NbtMap.builder();
	mcstructure.putInt("format_version", 1);
	let sizes = nbt.getList("size", com.nukkitx.nbt.NbtType.INT);
	mcstructure.putList("size", com.nukkitx.nbt.NbtType.INT, sizes);

	let nbtPalette = nbt.getList("palette", com.nukkitx.nbt.NbtType.COMPOUND);
	let paletteNbtConversionStates = {};
	let paletteNbtConversionIndex = 0;
	let paletteNbtStates = {};
	for (let i = 0; i < nbtPalette.size(); i++) {
		let entry = nbtPalette.get(i);
		let identifier = entry.getString("Name");
		if (!paletteConversion.hasOwnProperty(identifier)) {
			log("structure2mcstructure: State id " + identifier + " will be ignored");
			continue;
		}
		paletteNbtStates[paletteNbtConversionIndex] = entry;
		paletteNbtConversionStates[i] = paletteNbtConversionIndex++;
	}

	let nbtBlocks = nbt.getList("blocks", com.nukkitx.nbt.NbtType.COMPOUND);
	let blocks = {};
	let blockEntityData = {};
	for (let i = 0; i < nbtBlocks.size(); i++) {
		let block = nbtBlocks.get(i);
		let state = block.getInt("state");
		if (!paletteNbtConversionStates.hasOwnProperty(state)) {
			continue;
		}
		let position = block.getList("pos", com.nukkitx.nbt.NbtType.INT);
		let element = position.get(0) + "," + position.get(1) + "," + position.get(2);
		blocks[element] = paletteNbtConversionStates[state];
		let compound = block.getCompound("nbt", null);
		if (compound != null) {
			blockEntityData[element] = compound;
		}
	}

	let width = sizes.get(0);
	let height = sizes.get(1);
	let length = sizes.get(2);
	let indices = java.lang.reflect.Array.newInstance(java.lang.Integer, width * height * length);
	let waterlogged = java.lang.reflect.Array.newInstance(java.lang.Integer, width * height * length);
	let positionData = {};
	let index = 0;
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			for (let z = 0; z < length; z++) {
				waterlogged[index] = -1;
				if (blockEntityData.hasOwnProperty(x + "," + y + "," + z)) {
					positionData[index] = x + "," + y + "," + z;
				}
				if (!blocks.hasOwnProperty(x + "," + y + "," + z)) {
					indices[index++] = -1;
					continue;
				}
				indices[index++] = blocks[x + "," + y + "," + z];
			}
		}
	}
	indices = new com.nukkitx.nbt.NbtList(com.nukkitx.nbt.NbtType.INT, indices);
	waterlogged = new com.nukkitx.nbt.NbtList(com.nukkitx.nbt.NbtType.INT, waterlogged);

	let structure = com.nukkitx.nbt.NbtMap.builder();
	structure.putList("block_indices", com.nukkitx.nbt.NbtType.LIST, indices, waterlogged);

	structure.putList("entities", com.nukkitx.nbt.NbtType.COMPOUND);

	let structurePalette = com.nukkitx.nbt.NbtMap.builder();
	let structurePaletteDefault = com.nukkitx.nbt.NbtMap.builder();
	let structurePaletteDefaultBlockData = com.nukkitx.nbt.NbtMap.builder();

	let blockPalette = java.lang.reflect.Array.newInstance(com.nukkitx.nbt.NbtMap, paletteNbtConversionIndex);
	for (let i = 0; i < paletteNbtConversionIndex; i++) {
		let block = com.nukkitx.nbt.NbtMap.builder();
		let entry = paletteNbtStates[i];
		block.putString("name", paletteConversion[entry.getString("Name")]);
		block.putCompound("states", entry.getCompound("Properties"));
		block.putInt("version", 17825806);
		blockPalette[i] = block.build();
	}
	let structurePaletteBlockData = com.nukkitx.nbt.NbtMap.builder();
	for (let element in positionData) {
		structurePaletteBlockData.putCompound("block_entity_data", blockEntityData[positionData[element]]);
		structurePaletteDefaultBlockData.putCompound(element, structurePaletteBlockData.build());
	}

	structurePaletteDefault.putList("block_palette", com.nukkitx.nbt.NbtType.COMPOUND, blockPalette);
	structurePaletteDefault.putCompound("block_position_data", structurePaletteDefaultBlockData.build());
	structurePalette.putCompound("default", structurePaletteDefault.build());
	structure.putCompound("palette", structurePalette.build());
	mcstructure.put("structure", structure.build());

	let output = new java.io.FileOutputStream(outputFile);
	let stream = com.nukkitx.nbt.NbtUtils.createWriterLE(output);
	mcstructure.putList("structure_world_origin", com.nukkitx.nbt.NbtType.INT,
		java.lang.Integer.valueOf(0), java.lang.Integer.valueOf(0), java.lang.Integer.valueOf(0));
	stream.writeTag(mcstructure.build());
	try {
		stream.close();
	} catch (e) {}
};
