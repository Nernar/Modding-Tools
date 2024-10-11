structure2json = function(inputPath, outputPath, internKeys, internValues, palette) {
	if (arguments.length < 2) {
		MCSystem.throwException("structure2json: Usage: <inputFile> <outputFile> [internKeys] [internValues] [palette]");
	}

	log("structure2json: " + inputPath + " -> " + outputPath);

	let outputFile = Files.of(outputPath);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("structure2json: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let inputFile = Files.of(inputPath);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("structure2json: Input path not exists or is directory");
	}

	let input = new java.io.FileInputStream(inputFile);
	let type;
	let stream = (function() {
		type = "network";
		return com.nukkitx.nbt.NbtUtils.createNetworkReader(input, !!internKeys, !!internValues);
		try {
			type = "gzip";
			return com.nukkitx.nbt.NbtUtils.createGZIPReader(input, !!internKeys, !!internValues);
		} catch (e) {
			try {
				type = "le";
				return com.nukkitx.nbt.NbtUtils.createReaderLE(input, !!internKeys, !!internValues);
			} catch (e) {
				type = "common";
				return com.nukkitx.nbt.NbtUtils.createReader(input, !!internKeys, !!internValues);
			}
		}
	})();

	let nbt = stream.readTag();
	try {
		stream.close();
	} catch (e) {}
	$.FileTools.writeFileText(outputFile.getPath() + ".txt", nbt.toString());

	let deserialize = function(what) {
		if (what instanceof com.nukkitx.nbt.NbtMap) {
			let iterator = what.keySet().iterator();
			let value = {};
			while (iterator.hasNext()) {
				let key = iterator.next();
				value[key] = deserialize(what.get(key));
				if (palette && key == "Name") {
					if (!palette.hasOwnProperty(value[key])) {
						let name = value[key];
						if (name.indexOf("minecraft:") != 0) {
							let index = name.indexOf(":");
							if (index != -1) {
								value[key] = "minecraft:block_" + name.substring(index + 1, name.length);
								name += " -> " + value[key];
							}
						}
						palette[name] = null;
					}
				}
			}
			return value;
		}
		if (what instanceof com.nukkitx.nbt.NbtList) {
			let value = [];
			for (let i = 0; i < what.size(); i++) {
				let entry = what.get(i);
				value.push(deserialize(entry));
			}
			return value;
		}
		return deserializeNbt(what);
	};

	let raw = deserialize(nbt);
	if (typeof raw == "object") {
		raw = JSON.stringify(raw, null, "\t");
	}
	$.FileTools.writeFileText(outputFile.getPath(), raw);
};
