mergeAtlasTools = function(input, output, colors, optInExtension) {
	if (arguments.length < 3) {
		MCSystem.throwException("mergeAtlasTools: Usage: <inputDirectory> <outputDirectory> <colors> [textureExtension]");
	}

	log("mergeAtlasTools: " + input + ".. -> " + output + "..");

	let handleBitmap = android.graphics.BitmapFactory.decodeFile(input + "/handle.png");
	let handlePommelBitmap = android.graphics.BitmapFactory.decodeFile(input + "/handle_pommel.png");
	let handleShortBitmap = android.graphics.BitmapFactory.decodeFile(input + "/handle_short.png");
	let handleSwordBitmap = android.graphics.BitmapFactory.decodeFile(input + "/handle_sword.png");

	let decodeFolder = function(where, optExtension) {
		let input = folderTarget(where, optExtension);
		return input.map(function(what) {
			return android.graphics.BitmapFactory.decodeFile(what);
		});
	};

	let imposeMaterialOnHandle = function(handle, material, color) {
		let bitmap = new android.graphics.Bitmap.createBitmap
			(material.getWidth(), material.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
		let canvas = new android.graphics.Canvas(bitmap);
		let paint = new android.graphics.Paint();
		if (color !== undefined) {
			paint.setColorFilter(new android.graphics.LightingColorFilter(color, 0));
		}
		for (let i = 0; i < material.getHeight() / handle.getHeight(); i++) {
			canvas.drawBitmap(handle, 0, handle.getHeight() * i, paint);
		}
		paint.reset();
		paint.setXfermode(new android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_ATOP));
		canvas.drawBitmap(material, 0, 0, paint);
		return bitmap;
	};

	let files = folderTarget(input + "/materials", optInExtension);
	let materials = decodeFolder(input + "/materials", optInExtension);
	let handles = materials.slice().map(function(what, index) {
		return imposeMaterialOnHandle(handleBitmap, what, colors[files[index].getName()]);
	});
	let handlePommels = materials.slice().map(function(what, index) {
		return imposeMaterialOnHandle(handlePommelBitmap, what, colors[files[index].getName()]);
	});
	let handleShorts = materials.slice().map(function(what, index) {
		return imposeMaterialOnHandle(handleShortBitmap, what, colors[files[index].getName()]);
	});
	let handleSwords = materials.slice().map(function(what, index) {
		return imposeMaterialOnHandle(handleSwordBitmap, what, colors[files[index].getName()]);
	});

	let imposeToolOnMaterial = function(material, tool) {
		let height = Math.max(material.getHeight(), tool.getHeight());
		let modifier = Math.min(material.getHeight(), tool.getHeight());
		let bitmap = new android.graphics.Bitmap.createBitmap
			(material.getWidth(), height, android.graphics.Bitmap.Config.ARGB_8888);
		let canvas = new android.graphics.Canvas(bitmap);
		let paint = new android.graphics.Paint();
		if (height == material.getHeight()) {
			canvas.drawBitmap(material, 0, 0, paint);
			for (let i = 0; i < height / modifier; i++) {
				canvas.drawBitmap(tool, 0, modifier * i, paint);
			}
		} else {
			for (let i = 0; i < height / modifier; i++) {
				canvas.drawBitmap(material, 0, modifier * i, paint);
			}
			canvas.drawBitmap(tool, 0, 0, paint);
		}
		return bitmap;
	};

	let imposeFolderTools = function(path, handles, output, optExtension) {
		let imposed = {};
		try {
			let files = folderTarget(path, optExtension);
			let tools = decodeFolder(path, optExtension);
			for (let i = 0; i < handles.length; i++) {
				for (let t = 0; t < tools.length; t++) {
					let name = Files.basename(files[t], true);
					imposed[name + "_" + i + ".png"] = imposeToolOnMaterial(handles[i], tools[t]);
				}
			}
		} catch (e) {
			reportError(e);
		}
		let folder = Files.relative(path, input);
		$.FileTools.mkdirs(output + "/" + folder);
		for (let identifier in imposed) {
			$.FileTools.writeBitmap(output + "/" + folder + "/" + identifier, imposed[identifier]);
		}
	};

	imposeFolderTools(input + "/pickaxe", handles, output, optInExtension);
	imposeFolderTools(input + "/hoe", handles, output, optInExtension);
	imposeFolderTools(input + "/pickaxe", handleShorts, output + "/short", optInExtension);
	imposeFolderTools(input + "/hoe", handleShorts, output + "/short", optInExtension);
	imposeFolderTools(input + "/axe", handleShorts, output, optInExtension);
	imposeFolderTools(input + "/shovel", handlePommels, output, optInExtension);
	imposeFolderTools(input + "/sword", handleSwords, output, optInExtension);
};
