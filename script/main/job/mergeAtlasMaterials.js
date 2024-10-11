mergeAtlasMaterials = function(input, output, colors, optInExtension) {
	if (arguments.length < 3) {
		MCSystem.throwException("mergeAtlasMaterials: Usage: <inputDirectory> <outputDirectory> <colors> [textureExtension]");
	}

	log("mergeAtlasMaterials: " + input + ".. -> " + output + "..");

	let decodeFolder = function(where, optExtension) {
		let input = folderTarget(where, optExtension);
		return input.map(function(what) {
			return android.graphics.BitmapFactory.decodeFile(what);
		});
	};

	let files = folderTarget(input, optInExtension);
	let materials = decodeFolder(input, optInExtension);
	let target = {};
	for (let i = 0; i < materials.length; i++) {
		let key = Files.basename(files[i], true);
		let index = key.indexOf("_");
		let shrinked = key.substring(0, index);
		for (let element in colors) {
			try {
    			if (colors[element].hasOwnProperty(key)) {
    				target[key + "/" + element + ".png"] = imposeMaterial(materials[i], android.graphics.Color.parseColor(colors[element][key]));
    				continue;
    			}
    			if (colors[element].hasOwnProperty(shrinked)) {
    				target[key + "/" + element + ".png"] = imposeMaterial(materials[i], android.graphics.Color.parseColor(colors[element][shrinked]));
    				continue;
    			}
    			log("mergeAtlasMaterials: " + element + " skipped, not found in [" + key + "," + shrinked + "]");
    		} catch (e) {
    			Logger.Log("mergeAtlasMaterials: " + key + "/" + element + ": " + e, "INFO");
    		}
		}
		try {
			materials[i].recycle();
		} catch (e) {}
	}

	for (let identifier in target) {
		let file = Files.of(output, identifier);
		Files.isFileDirectoryOrNew(file);
		$.FileTools.writeBitmap(file.getPath(), target[identifier]);
		try {
			target[identifier].recycle();
		} catch (e) {}
	}
};
