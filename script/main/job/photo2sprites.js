photo2sprites = function(inputPhoto, outputDirectory, spriteCountX, spriteCountY, spriteWidth, spriteHeight, paddingLeft, paddingTop, paddingRight, paddingBottom, offsetX, offsetY, backgroundRange1, backgroundRange2) {
	if (arguments.length < 6) {
		MCSystem.throwException("photo2sprites: Usage: <inputPhoto> <outputDirectory> <spriteCountX> <spriteCountY> <spriteWidth> <spriteHeight> [paddingLeft] [paddingTop] [paddingRight] [paddingBottom] [offsetX] [offsetY] [backgroundRange1] [backgroundRange2]");
	}

	log("photo2sprites: " + inputPhoto + ".. -> " + outputDirectory);

	if (!Files.isFile((inputPhoto = Files.of(inputPhoto)))) {
		MCSystem.throwException("photo2sprites: Input photo should be file!");
	}
	if (!Files.isDirectoryOrNew((outputDirectory = Files.of(outputDirectory)))) {
		MCSystem.throwException("photo2sprites: Output directory cannot be written!");
	}
	if (spriteCountX <= 0 || spriteCountX == null || isNaN(spriteCountX) || spriteCountY <= 0 || spriteCountY == null || isNaN(spriteCountY)) {
		MCSystem.throwException("photo2sprites: Sprite count X/Y should be sprite per side length, most likely it was miscalculated!");
	}
	(paddingLeft < 0 || paddingLeft == null || isNaN(paddingLeft)) && (paddingLeft = 0);
	(paddingTop < 0 || paddingTop == null || isNaN(paddingTop)) && (paddingTop = 0);
	(paddingRight < 0 || paddingRight == null || isNaN(paddingRight)) && (paddingRight = 0);
	(paddingBottom < 0 || paddingBottom == null || isNaN(paddingBottom)) && (paddingBottom = 0);
	(offsetX == null || isNaN(offsetX)) && (offsetX = 0);
	(offsetY == null || isNaN(offsetY)) && (offsetY = 0);

	let background = null;
	if (backgroundRange1 != null && backgroundRange2 != null) {
		let r1 = (backgroundRange1 >> 16) & 0xff;
		let g1 = (backgroundRange1 >> 8) & 0xff;
		let b1 = backgroundRange1 & 0xff;
		let r2 = (backgroundRange2 >> 16) & 0xff;
		let g2 = (backgroundRange2 >> 8) & 0xff;
		let b2 = backgroundRange2 & 0xff;
		background = [
			Math.min(r1, r2), Math.min(g1, g2), Math.min(b1, b2),
			Math.max(r1, r2), Math.max(g1, g2), Math.max(b1, b2)
		];
	}

	let photo = BitmapFactory.decodeFile(inputPhoto);
	if (photo == null) {
		MCSystem.throwException("photo2sprites: Invalid or unsupported photo type!");
	}
	try {
		let width = photo.getWidth();
		let spritesheetWidth = width - paddingLeft - paddingRight;
		let offsetSpritesheetWidth = spritesheetWidth;
		for (let i = 1; i < spriteCountX; i++) {
			offsetSpritesheetWidth -= Array.isArray(offsetX) ? offsetX[i - 1] : offsetX;
		}
		let height = photo.getHeight();
		let spritesheetHeight = height - paddingTop - paddingBottom;
		let offsetSpritesheetHeight = spritesheetHeight;
		for (let i = 1; i < spriteCountY; i++) {
			offsetSpritesheetHeight -= Array.isArray(offsetY) ? offsetY[i - 1] : offsetY;
		}
		let densityX = 0;
		if (Array.isArray(spriteWidth)) {
			for (let i = 0; i < spriteCountX; i++) {
				densityX += spriteWidth[i];
			}
			densityX = offsetSpritesheetWidth / densityX;
		} else {
			densityX = offsetSpritesheetWidth / (spriteCountX * spriteWidth);
		}
		let densityY = 0;
		if (Array.isArray(spriteHeight)) {
			for (let i = 0; i < spriteCountY; i++) {
				densityY += spriteHeight[i];
			}
			densityY = offsetSpritesheetHeight / densityY;
		} else {
			densityY = offsetSpritesheetHeight / (spriteCountY * spriteHeight);
		}
		for (let x = 0, paddingX = paddingLeft; x < spriteCountX; x++) {
			x > 0 && (paddingX += Array.isArray(offsetX) ? offsetX[x - 1] : offsetX);
			let spriteWidthOnExport = Array.isArray(spriteWidth) ? spriteWidth[x] : spriteWidth;
			let spriteWidthOnPhoto = spriteWidthOnExport * densityX;
			for (let y = 0, paddingY = paddingTop; y < spriteCountY; y++) {
				y > 0 && (paddingY += Array.isArray(offsetY) ? offsetY[y - 1] : offsetY);
				let spriteHeightOnExport = Array.isArray(spriteHeight) ? spriteHeight[y] : spriteHeight;
				let spriteHeightOnPhoto = spriteHeightOnExport * densityY;
				let sprite = android.graphics.Bitmap.createBitmap(spriteWidthOnExport, spriteHeightOnExport, android.graphics.Bitmap.Config.ARGB_8888);
				try {
					for (let sx = 0; sx < spriteWidthOnExport; sx++) {
						let spriteXOnPhoto = paddingX + sx * densityX;
						for (let sy = 0; sy < spriteHeightOnExport; sy++) {
							let spriteYOnPhoto = paddingY + sy * densityY;
							let lx = spriteXOnPhoto + densityX * 0.375;
							let ly = spriteYOnPhoto + densityY * 0.375;
							let cx = spriteXOnPhoto + densityX * 0.5;
							let cy = spriteYOnPhoto + densityY * 0.5;
							let rx = spriteXOnPhoto + densityX * 0.625;
							let ry = spriteYOnPhoto + densityY * 0.625;
							let ltpixel = photo.getPixel(lx, ly);
							let lcpixel = photo.getPixel(lx, cy);
							let lbpixel = photo.getPixel(lx, ry);
							let ctpixel = photo.getPixel(cx, ly);
							let cpixel = photo.getPixel(cx, cy);
							let cbpixel = photo.getPixel(cx, ry);
							let rtpixel = photo.getPixel(rx, ly);
							let rcpixel = photo.getPixel(rx, cy);
							let rbpixel = photo.getPixel(rx, ry);
							if (ltpixel == lcpixel && lcpixel == lbpixel && lbpixel == ctpixel && ctpixel == cpixel && cpixel == cbpixel && cbpixel == rtpixel && rtpixel == rcpixel && rcpixel == rbpixel) {
								if (backgroundRange1 == cpixel || backgroundRange2 == cpixel) {
									continue;
								}
								if (background != null) {
									let r = (cpixel >> 16) & 0xff;
									let g = (cpixel >> 8) & 0xff;
									let b = cpixel & 0xff;
									if (r >= background[0] && g >= background[1] && b >= background[2] && r <= background[3] && g <= background[4] && b <= background[5]) {
										continue;
									}
								}
								sprite.setPixel(sx, sy, cpixel);
							}
						}
					}
					let outputFile = new java.io.File(outputDirectory, x + "_" + y + ".png");
					outputFile = new java.io.FileOutputStream(outputFile);
					try {
						sprite.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputFile);
					} finally {
						outputFile.close();
					}
				} finally {
					sprite.recycle();
				}
				paddingY += spriteHeightOnPhoto;
			}
			paddingX += spriteWidthOnPhoto;
		}
	} finally {
		photo.recycle();
	}
};
