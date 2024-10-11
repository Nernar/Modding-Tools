devs2anywhere = function(inputDirectory, outputDirectory) {
	if (arguments.length < 2) {
		MCSystem.throwException("devs2anywhere: Usage: <inputDirectory> <outputDirectory>");
	}

	log("devs2anywhere: " + inputDirectory + " -> " + outputDirectory);

	let photos = Files.listFiles(inputDirectory, "relative", "jpg");
	if (photos == null || photos.length == 0) {
		MCSystem.throwException("devs2anywhere: Input photos directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (!Files.isDirectoryOrNew(outputDirectory)) {
		MCSystem.throwException("devs2anywhere: Output directory cannot be written!");
	}
	let cipher = javax.crypto.Cipher.getInstance("AES/CBC/PKCS5Padding");
	cipher.init(1, new javax.crypto.spec.SecretKeySpec(javax.crypto.SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1").generateSecret(new javax.crypto.spec.PBEKeySpec([97, 100, 109, 105, 110], [97, 100, 109, 105, 110], 10, 128)).getEncoded(), "AES"), new javax.crypto.spec.IvParameterSpec([56, 49, 49, 57, 55, 52, 53, 49, 49, 51, 49, 53, 52, 49, 50, 48]));

	let faces = {
		"hee0.jpg": [1368, 582, 1602, 822],
		"hee1.jpg": [636, 36, 960, 324],
		"hee10.jpg": [60, 315, 270, 630, 510, 360, 660, 510],
		"hee11.jpg": [72, 162, 180, 246],
		"hee12.jpg": [480, 441, 648, 642],
		"hee13.jpg": [402, 375, 861, 855, 1302, 501, 1662, 861],
		"hee14.jpg": [111, 195, 252, 324],
		"hee15.jpg": [594, 906, 1266, 1638],
		"hee16.jpg": [435, 645, 546, 822],
		"hee17.jpg": [145, 354, 330, 582],
		"hee18.jpg": [312, 75, 501, 366],
		"hee19.jpg": [852, 126, 1095, 387],
		"hee2.jpg": [1026, 216, 1435, 771, 1650, 165, 2256, 744],
		"hee20.jpg": [318, 312, 768, 810],
		"hee21.jpg": [285, 224, 345, 282],
		"hee22.jpg": [594, 312, 870, 672],
		"hee23.jpg": [114, 1068, 366, 1230],
		"hee24.jpg": [690, 450, 845, 624],
		"hee25.jpg": [156, 54, 660, 366],
		"hee26.jpg": [15, 105, 237, 402],
		"hee27.jpg": [243, 213, 624, 852],
		"hee28.jpg": [174, 31, 174 + 736, 31 + 1002],
		"hee29.jpg": [115, 89, 115 + 1299, 89 + 1713],
		"hee3.jpg": [984, 405, 1602, 1266],
		"hee30.jpg": [247, 50, 247 + 165, 50 + 269],
		"hee4.jpg": [1122, 921, 1302, 1113],
		"hee5.jpg": [132, 102, 1326, 2082],
		"hee6.jpg": [276, 414, 843, 1035],
		"hee7.jpg": [342, 276, 561, 630],
		"hee8.jpg": [537, 816, 1056, 1470],
		"hee9.jpg": [294, 141, 534, 381, 90, 315, 258, 444, 915, 546, 1002, 618],
		"incredible0.jpg": [300, 195, 372, 285, 126, 351, 189, 438, 485, 357, 540, 435, 576, 600, 615, 636, 219, 435, 255, 495, 561, 132, 597, 171, 114, 465, 156, 507, 180, 534],
		"legendary0.jpg": [321, 264, 642, 747],
		"legendary1.jpg": [30, 0, 610, 640],
		"legendary2.jpg": [1002, 561, 1449, 1077],
		"legendary3.jpg": [801, 1185, 1122, 1716],
		"legendary4.jpg": [1164, 933, 1512, 1392],
		"legendary5.jpg": [195, 66, 435, 375],
		"legendary6.jpg": [177, 285, 1395, 2124],
		"legendary7.jpg": [666, 864, 666 + 472, 864 + 647],
		"legendary8.jpg": [4, 270, 4 + 1267, 270 + 1491],
		"legendary9.jpg": [64, 68, 64 + 388, 68 + 417],
		"nice0.jpg": [582, 387, 792, 615],
		"nice1.jpg": [765, 456, 1071, 756],
		"nice10.jpg": [1194, 603, 1647, 1182],
		"nice11.jpg": [364, 366, 525, 573],
		"nice12.jpg": [600, 267, 942, 609],
		"nice13.jpg": [528, 762, 762, 1077],
		"nice14.jpg": [213, 600, 636, 1188],
		"nice15.jpg": [447, 177, 513, 288],
		"nice16.jpg": [924, 807, 1077, 1017],
		"nice17.jpg": [798, 963, 1176, 1551],
		"nice18.jpg": [1215, 564, 1677, 1191],
		"nice19.jpg": [564, 426, 753, 597],
		"nice2.jpg": [282, 468, 485, 714],
		"nice20.jpg": [153, 492, 783, 1347],
		"nice21.jpg": [1119, 678, 1641, 1281],
		"nice22.jpg": [774, 168, 951, 528],
		"nice23.jpg": [258, 195, 414, 327, 408, 420, 486, 486],
		"nice24.jpg": [1137, 231, 1209, 312],
		"nice25.jpg": [117, 594, 1020, 1521],
		"nice26.jpg": [72, 87, 213, 264],
		"nice27.jpg": [240, 69, 333, 201],
		"nice3.jpg": [105, 267, 378, 561],
		"nice4.jpg": [654, 567, 753, 684],
		"nice5.jpg": [102, 204, 384, 573],
		"nice6.jpg": [519, 354, 633, 456],
		"nice7.jpg": [336, 291, 507, 504, 9, 36, 255, 369, 540, 450, 747, 756],
		"nice8.jpg": [402, 375, 1155, 1500],
		"nice9.jpg": [213, 465, 984, 1389]
	};

	let unfaces = {};
	for (let i = 0, l = photos.length; i < l; i++) {
		let result = Files.readAsBytes(Files.of(inputDirectory, photos[i]));
		let name = decodeURI(toDigestMd5(result));
		let output = Files.of(outputDirectory, name);
		let naming = decodeURI(Files.basename(photos[i]));
		let killer = naming[0] == "n" ? 0 : naming[0] == "h" ? 1 : naming[0] == "l" ? 2 : naming[0] == "i" ? 3 : -1;
		if (unfaces[killer] == null) {
			unfaces[killer] = {};
		}
		unfaces[killer][name] = faces[naming];
		let bitmap = android.graphics.BitmapFactory.decodeByteArray(result, 0, result.length);
		let bos = new java.io.ByteArrayOutputStream();
		bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, 50, bos);
		Files.write(output, cipher.doFinal(bos.toByteArray()));
	}
	Files.write(Files.of(outputDirectory, "face_uv.json"), JSON.stringify(unfaces));
};
