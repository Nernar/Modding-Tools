extractPocketAtlas = function(spritePath, metaPath, outputPath, dumpUnknownUVs) {
	if (arguments.length < 3) {
		MCSystem.throwException("extractPocketAtlas: Usage: <spriteFile> <metaFile> <outputDirectory> [dumpUnknownUVs]");
	}

	log("file2bitmap: " + spritePath + ", " + metaPath + " -> " + outputPath);

	let spriteFile = Files.of(spritePath);
	if (!spriteFile.exists() || spriteFile.isDirectory()) {
		MCSystem.throwException("extractPocketAtlas: Sprite path not exists or directory");
	}
	let sprite = file2bitmap(spriteFile);
	if (sprite == null) {
		MCSystem.throwException("extractPocketAtlas: Sprite is not image or not supported");
	}

	let metaFile = Files.of(metaPath);
	if (!metaFile.exists() || metaFile.isDirectory()) {
		MCSystem.throwException("extractPocketAtlas: Meta path not exists or directory");
	}
	let meta = JSON.parse(Files.readUnsafe(metaFile));

	let outputFile = Files.of(outputPath);
	if (outputFile.isFile()) {
		MCSystem.throwException("extractPocketAtlas: Output path is file");
	}
	outputFile.mkdirs();

	let spriteBitmap, spriteCanvas, transparentPaint;
	if (dumpUnknownUVs !== false) {
		spriteBitmap = sprite.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
		spriteCanvas = new android.graphics.Canvas(spriteBitmap);
		transparentPaint = new android.graphics.Paint();
		transparentPaint.setXfermode(new android.graphics.PorterDuffXfermode(
			android.graphics.PorterDuff.Mode.CLEAR
		));
	}

	for (let i = 0, l = meta.length; i < l; i++) {
		for (let m = 0, n = meta[i].uvs.length; m < n; m++) {
			let uv = meta[i].uvs[m];
			let ox = Math.round(uv[0] * uv[4]);
			let oy = Math.round(uv[1] * uv[5]);
			let sx = Math.round(uv[2] * uv[4]);
			let sy = Math.round(uv[3] * uv[5]);
	
			let bitmap = new android.graphics.Bitmap.createBitmap(sprite, ox, oy, sx - ox, sy - oy);
			bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, new java.io.FileOutputStream(
				Files.of(outputFile, (meta[i].name !== undefined ? meta[i].name : i) + (n > 1 ? "_" + m : "") + ".png")
			));
			try {
				bitmap.recycle();
			} catch (e) {}

			if (meta[i].name == "flowing_water" || meta[i].name == "flowing_lava") {
				sx += sx - ox;
				sy += sy - oy;

				let flowing = new android.graphics.Bitmap.createBitmap(sprite, ox, oy, sx - ox, sy - oy);
				flowing.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, new java.io.FileOutputStream(
					Files.of(outputFile, (meta[i].name !== undefined ? meta[i].name : i) + (n > 1 ? "_sprite_" + m : "_sprite") + ".png")
				));
				try {
					flowing.recycle();
				} catch (e) {}
			}

			if (dumpUnknownUVs !== false) {
				spriteCanvas.drawRect(ox, oy, sx, sy, transparentPaint);
			}
		}
	}

	if (dumpUnknownUVs !== false) {
		let existingUVs = false;
		for (let ox = 0, dx = spriteBitmap.getWidth(); ox < dx; ox++) {
			for (let oy = 0, dy = spriteBitmap.getHeight(); oy < dy; oy++) {
				if ((existingUVs = spriteBitmap.getPixel(ox, oy) != 0)) {
					break;
				}
			}
			if (existingUVs) {
				break;
			}
		}
		if (existingUVs) {
			spriteBitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, new java.io.FileOutputStream(
				Files.of(outputFile, "unknown_uvs.png")
			));
		}
		try {
			spriteBitmap.recycle();
		} catch (e) {}
	}
	try {
		sprite.recycle();
	} catch (e) {}
};
