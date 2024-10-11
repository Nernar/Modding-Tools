betterQuestingTheme = function(atlasFile, themesJson, outputDirectory) {
	if (arguments.length < 3) {
		MCSystem.throwException("betterQuestingTheme: Usage: <atlasFile> <themesJson> <outputDirectory>");
	}

	log("betterQuestingTheme: " + themesJson + " -> " + outputDirectory);

	atlasFile = Files.of(atlasFile);
	if (!Files.isFile(atlasFile)) {
		MCSystem.throwException("betterQuestingTheme: Atlas should be existing file!");
	}
	atlasFile = BitmapFactory.decodeFile(atlasFile);
	themesJson = Files.of(themesJson);
	if (!Files.isFile(themesJson)) {
		MCSystem.throwException("betterQuestingTheme: Themes json should be existing file!");
	}
	themesJson = JSON.parse(Files.read(themesJson));
	outputDirectory = Files.of(outputDirectory);
	if (!Files.isDirectoryOrNew(outputDirectory)) {
		MCSystem.throwException("betterQuestingTheme: Output path should be directory!");
	}

	for (let i = 0, l = themesJson.length; i < l; i++) {
		let output = Files.of(outputDirectory, themesJson[i].themeID.replace(/:/g, "/"));
		Files.ensureDirectory(output);
		let slices = {};
		for (let texture in themesJson[i].textures) {
			let inside = themesJson[i].textures[texture];
			if (inside.textureType == "betterquesting:texture_sliced") {
				let bitmap = android.graphics.Bitmap.createBitmap(atlasFile,
					inside.bounds[0], inside.bounds[1], inside.bounds[2], inside.bounds[3]);
				let bitmapCopy = bitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
				bitmap.recycle();
				let bitmapFile = Files.of(output, texture.replace(/betterquesting:/g, "") + ".png");
				Files.ensureFileDirectory(bitmapFile);
				$.FileTools.writeBitmap(bitmapFile, bitmapCopy);
				bitmapCopy.recycle();
				let sliced = android.graphics.Bitmap.createBitmap(atlasFile,
					inside.bounds[0] + inside.padding[0], inside.bounds[1] + inside.padding[1],
					inside.bounds[2] - inside.padding[0] - inside.padding[2], inside.bounds[3] - inside.padding[1] - inside.padding[3]);
				let slicedCopy = sliced.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
				sliced.recycle();
				let slicedFile = Files.of(output, "sliced", texture.replace(/betterquesting:/g, "") + ".png");
				Files.ensureFileDirectory(slicedFile);
				$.FileTools.writeBitmap(slicedFile, slicedCopy);
				slicedCopy.recycle();
				slices[texture.replace(/betterquesting:/g, "")] = [inside.padding[0], inside.padding[1]];
			}
		}
		if (!isEmpty(slices)) {
			Files.write(Files.of(output, "slices.json"), JSON.stringify(slices, null, "\t"));
		}

		let colors = {};
		for (let color in themesJson[i].colors) {
			let inside = themesJson[i].colors[color];
			if (inside.colorType == "betterquesting:color_static") {
				colors[color.replace(/betterquesting:/g, "")] = "#" + inside.color;
			} else if (inside.colorType == "betterquesting:color_pulse") {
				colors[color.replace(/betterquesting:/g, "")] = ["#" + inside.color1.color, "#" + inside.color2.color];
			}
		}
		if (!isEmpty(colors)) {
			Files.write(Files.of(output, "colors.json"), JSON.stringify(colors, null, "\t"));
		}

		let lines = {};
		for (let line in themesJson[i].lines) {
			let inside = themesJson[i].lines[line];
			if (inside.lineType == "betterquesting:line_simple") {
				lines[line.replace(/betterquesting:/g, "")] = inside.stippleMask;
			}
		}
		if (!isEmpty(lines)) {
			Files.write(Files.of(output, "lines.json"), JSON.stringify(lines, null, "\t"));
		}
	}

	atlasFile.recycle();
};
