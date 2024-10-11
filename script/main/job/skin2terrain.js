skin2terrain = function(skin, x, y, z, octaveRadius, octaveHeight, blockSource) {
	if (arguments.length < 4) {
		MCSystem.throwException("skin2terrain: Usage: <skin> <x> <y> <z> [octaveRadius] [octaveHeight] [blockSource]");
	}

	log("skin2terrain: " + skin + " at " + x + ", " + y + ", " + z);

	let bitmap = BitmapDrawableFactory.wrap(skin);
	if (bitmap == null) {
		MCSystem.throwException("skin2terrain: Invalid input bitmap, wrapping it cancelled!");
	}
	if (bitmap.getWidth() < 64 || bitmap.getHeight() < 32) {
		MCSystem.throwException("skin2terrain: Bitmap sizes must be 64x32 or larger, otherwise building may cause problems; please, upscale your image.");
	}

	let atlas = {
		// wool
		"35:0": "wool_colored_white",
		"35:1": "wool_colored_orange",
		"35:2": "wool_colored_magenta",
		"35:3": "wool_colored_light_blue",
		"35:4": "wool_colored_yellow",
		"35:5": "wool_colored_lime",
		"35:6": "wool_colored_pink",
		"35:7": "wool_colored_gray",
		"35:8": "wool_colored_silver",
		"35:9": "wool_colored_cyan",
		"35:10": "wool_colored_purple",
		"35:11": "wool_colored_blue",
		"35:12": "wool_colored_brown",
		"35:13": "wool_colored_green",
		"35:14": "wool_colored_red",
		"35:15": "wool_colored_black",
		// concrete
		"236:0": "concrete_white",
		"236:1": "concrete_orange",
		"236:2": "concrete_magenta",
		"236:3": "concrete_light_blue",
		"236:4": "concrete_yellow",
		"236:5": "concrete_lime",
		"236:6": "concrete_pink",
		"236:7": "concrete_gray",
		"236:8": "concrete_silver",
		"236:9": "concrete_cyan",
		"236:10": "concrete_purple",
		"236:11": "concrete_blue",
		"236:12": "concrete_brown",
		"236:13": "concrete_green",
		"236:14": "concrete_red",
		"236:15": "concrete_black",
		// clay
		"159:0": "hardened_clay_stained_white",
		"159:1": "hardened_clay_stained_orange",
		"159:2": "hardened_clay_stained_magenta",
		"159:3": "hardened_clay_stained_light_blue",
		"159:4": "hardened_clay_stained_yellow",
		"159:5": "hardened_clay_stained_lime",
		"159:6": "hardened_clay_stained_pink",
		"159:7": "hardened_clay_stained_gray",
		"159:8": "hardened_clay_stained_silver",
		"159:9": "hardened_clay_stained_cyan",
		"159:10": "hardened_clay_stained_purple",
		"159:11": "hardened_clay_stained_blue",
		"159:12": "hardened_clay_stained_brown",
		"159:13": "hardened_clay_stained_green",
		"159:14": "hardened_clay_stained_red",
		"159:15": "hardened_clay_stained_black",
		// others
		"82:0": "clay",
		"172:0": "hardened_clay"
	};

	let colormap = JSON.parse(Files.read(Dirs.ASSET + "terrain_colormap.json"));
	if (isEmpty(colormap)) {
		Logger.Log("skin2terrain: " + Files.relative(Dirs.ASSET + "terrain_colormap.json", __dir__) + " asset should exists, using raw-mode otherwise!", "WARNING");
		atlas = {
			"236:0": android.graphics.Color.parseColor("#ced4d4"),
			"236:1": android.graphics.Color.parseColor("#e16101"),
			"236:2": android.graphics.Color.parseColor("#a72f9e"),
			"236:3": android.graphics.Color.parseColor("#2389c6"),
			"236:4": android.graphics.Color.parseColor("#f2b116"),
			"236:5": android.graphics.Color.parseColor("#5faa1a"),
			"236:6": android.graphics.Color.parseColor("#d6668f"),
			"236:7": android.graphics.Color.parseColor("#383b3f"),
			"236:8": android.graphics.Color.parseColor("#7c7c72"),
			"236:9": android.graphics.Color.parseColor("#157787"),
			"236:10": android.graphics.Color.parseColor("#641f9b"),
			"236:11": android.graphics.Color.parseColor("#2e3090"),
			"236:12": android.graphics.Color.parseColor("#613d21"),
			"236:13": android.graphics.Color.parseColor("#4a5c26"),
			"236:14": android.graphics.Color.parseColor("#8c2020"),
			"236:15": android.graphics.Color.parseColor("#0a0c11")
		};
	} else {
		for (let element in atlas) {
			atlas[element] = colormap[atlas[element]];
			if (atlas[element] === undefined) {
				Logger.Log("skin2terrain: Not found atlas colormap " + element, "WARNING");
				delete atlas[element];
			}
		}
	}

	let modifier = Math.round(bitmap.getWidth() / 16);
	octaveRadius = parseFloat(octaveRadius) || 1;
	octaveHeight = parseFloat(octaveHeight) || 0.275;

	let uv = {
		headFront: [2, 2, 2, 2],
		headBack: [6, 2, 2, 2],
		headLeft: [4, 2, 2, 2],
		headUp: [2, 0, 2, 2],
		headRight: [0, 2, 2, 2],
		headDown: [4, 0, 2, 2],
		hatFront: [10, 2, 2, 2],
		hatBack: [14, 2, 2, 2],
		hatLeft: [12, 2, 2, 2],
		hatUp: [10, 0, 2, 2],
		hatRight: [8, 2, 2, 2],
		hatDown: [12, 0, 2, 2],
		bodyFront: [5, 5, 2, 3],
		bodyBack: [8, 5, 2, 3],
		bodyLeft: [7, 5, 1, 3],
		bodyUp: [5, 4, 2, 1],
		bodyRight: [4, 5, 1, 3],
		bodyDown: [7, 4, 2, 1],
		armFront: [11, 5, 1, 3],
		armBack: [13, 5, 1, 3],
		armLeft: [12, 5, 1, 3],
		armUp: [11, 4, 1, 1],
		armRight: [10, 5, 1, 3],
		armDown: [12, 4, 1, 1],
		legFront: [1, 5, 1, 3],
		legBack: [3, 5, 1, 3],
		legLeft: [2, 5, 1, 3],
		legUp: [1, 4, 1, 1],
		legRight: [0, 5, 1, 3],
		legDown: [2, 4, 1, 1]
	};

	let parts = [];
	let colours = {};

	for (let element in uv) {
		let location = uv[element];
		let exist = false;
		let colour = colours[element] = [];
		for (let dx = 0; dx < location[2] * modifier; dx++) {
			for (let dy = 0; dy < location[3] * modifier; dy++) {
				let pixel = bitmap.getPixel(location[0] * modifier + dx, location[1] * modifier + dy);
				if (pixel != 0) {
					exist = true;
				}
				colour.push(pixel);
			}
		}
		if (exist) {
			parts.push(element);
		}
	}

	let location = {
		head: ["head", -1, 6, -1, 1, 8, 1, false],
		hat: ["hat", -1, 6, -1, 1, 8, 1, false],
		body: ["body", -0.5, 3, -1, 0.5, 6, 1, false],
		leftArm: ["arm", -0.5, 3, -2, 0.5, 6, -1, true],
		rightArm: ["arm", -0.5, 3, 1, 0.5, 6, 2, false],
		leftLeg: ["leg", -0.5, 0, -1, 0.5, 3, 0, true],
		rightLeg: ["leg", -0.5, 0, 0, 0.5, 3, 1, false]
	};

	function findNearestBlockInAtlas(color) {
		let dist;
		let range = Number.MAX_VALUE;
		let block = null;
		let hsv1 = java.lang.reflect.Array.newInstance(java.lang.Float.TYPE, 3);
		android.graphics.Color.colorToHSV(java.lang.Integer.valueOf(color), hsv1);
		let x1 = octaveRadius * hsv1[2] * hsv1[1] * Math.cos(hsv1[0] * Math.PI / 180);
		let y1 = octaveRadius * hsv1[2] * hsv1[1] * Math.sin(hsv1[0] * Math.PI / 180);
		let z1 = octaveHeight * (1 - hsv1[2]);
		for (let element in atlas) {
			let hsv2 = java.lang.reflect.Array.newInstance(java.lang.Float.TYPE, 3);
			android.graphics.Color.colorToHSV(java.lang.Integer.valueOf(atlas[element]), hsv2);
			let x2 = octaveRadius * hsv2[2] * hsv2[1] * Math.cos(hsv2[0] * Math.PI / 180);
			let y2 = octaveRadius * hsv2[2] * hsv2[1] * Math.sin(hsv2[0] * Math.PI / 180);
			let z2 = octaveHeight * (1 - hsv2[2]);
			if ((dist = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)) < range) {
				block = element;
				range = dist;
			}
		}
		return block;
	}

	function getBlockIdData(pixel) {
		if (pixel == 0 || pixel === undefined) {
			return null;
		}
		return findNearestBlockInAtlas(pixel).split(":");
	}

	function buildPartAtLocation(blockSource, x1, y1, z1, x2, y2, z2, colour, mirrored) {
		let pixel = 0;
		for (let dx = mirrored ? x2 : x1; (mirrored ? dx >= x1 : dx <= x2); (mirrored ? dx-- : dx++)) {
			for (let dz = mirrored ? z2 : z1; (mirrored ? dz >= z1 : dz <= z2); (mirrored ? dz-- : dz++)) {
				for (let dy = y2; dy >= y1; dy--) {
					let blockIdData = getBlockIdData(colour[pixel++]);
					if (blockIdData == null) {
						if (colour[pixel] === undefined) {
							log("skin2terrain: Not found pixel " + pixel + " in " + dx + ", " + dy + ", " + dz);
						}
						continue;
					}
					blockSource.setBlock(dx, dy, dz, parseInt(blockIdData[0]), parseInt(blockIdData[1]));
				}
			}
		}
	}

	function buildColourAtLocation(blockSource, x, y, z, where) {
		if (parts.indexOf(where[0] + "Down") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[2] * modifier, z + where[3] * modifier,
				x + where[4] * modifier - 1, y + where[2] * modifier, z + where[6] * modifier - 1, colours[where[0] + "Down"], where[7]);
		}
		if (parts.indexOf(where[0] + "Up") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[5] * modifier - 1, z + where[3] * modifier,
				x + where[4] * modifier - 1, y + where[5] * modifier - 1, z + where[6] * modifier - 1, colours[where[0] + "Up"], where[7]);
		}
		if (where[0] == "head") {
			if (parts.indexOf(where[0] + "Back") != -1) {
				buildPartAtLocation(blockSource, x + where[4] * modifier - 1, y + where[2] * modifier, z + where[3] * modifier,
					x + where[4] * modifier - 1, y + where[5] * modifier - 1, z + where[6] * modifier - 1, colours[where[0] + "Back"], where[7]);
			}
		}
		if (parts.indexOf(where[0] + "Right") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[2] * modifier, z + (where[7] ? where[3] * modifier : where[6] * modifier - 1),
				x + where[4] * modifier - 1, y + where[5] * modifier - 1, z + (where[7] ? where[3] * modifier : where[6] * modifier - 1), colours[where[0] + "Right"], false);
		}
		if (parts.indexOf(where[0] + "Left") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[2] * modifier, z + (where[7] ? where[6] * modifier - 1 : where[3] * modifier),
				x + where[4] * modifier - 1, y + where[5] * modifier - 1, z + (where[7] ? where[6] * modifier - 1 : where[3] * modifier), colours[where[0] + "Left"], false);
		}
		if (where[0] != "head") {
			if (parts.indexOf(where[0] + "Back") != -1) {
				buildPartAtLocation(blockSource, x + where[4] * modifier - 1, y + where[2] * modifier, z + where[3] * modifier,
					x + where[4] * modifier - 1, y + where[5] * modifier - 1, z + where[6] * modifier - 1, colours[where[0] + "Back"], where[7]);
			}
		}
		if (parts.indexOf(where[0] + "Front") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[2] * modifier, z + where[3] * modifier,
				x + where[1] * modifier, y + where[5] * modifier - 1, z + where[6] * modifier - 1, colours[where[0] + "Front"], where[7]);
		}
	}

	function buildDependentEdge(blockSource, x1, y1, z1, x2, y2, z2, something) {
		// '*' - set block if requirement found
		// 'x' - requirement block before placed
		//   * * * * * * * *  
		// * x x x x x x x x *
		// * x             x *
	}

	function buildDependentCompoundVertex(blockSource, x1, y1, z1, x2, y2, z2, something) {
		// '*' - set block if requirement found
		// 'x' - requirement block before placed
		// * x             x *
		// x                 x
		//                    
	}

	function buildHatAtLocation(blockSource, x, y, z, where) {
		if (parts.indexOf(where[0] + "Down") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[2] * modifier - 1, z + where[3] * modifier,
				x + where[4] * modifier - 1, y + where[2] * modifier - 1, z + where[6] * modifier - 1, colours[where[0] + "Down"], where[7]);
		}
		if (parts.indexOf(where[0] + "Up") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[5] * modifier, z + where[3] * modifier,
				x + where[4] * modifier - 1, y + where[5] * modifier, z + where[6] * modifier - 1, colours[where[0] + "Up"], where[7]);
		}
		if (parts.indexOf(where[0] + "Back") != -1) {
			buildPartAtLocation(blockSource, x + where[4] * modifier, y + where[2] * modifier, z + where[3] * modifier,
				x + where[4] * modifier, y + where[5] * modifier - 1, z + where[6] * modifier - 1, colours[where[0] + "Back"], where[7]);
		}
		if (parts.indexOf(where[0] + "Right") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[2] * modifier, z + (where[7] ? where[3] * modifier - 1 : where[6] * modifier),
				x + where[4] * modifier - 1, y + where[5] * modifier - 1, z + (where[7] ? where[3] * modifier - 1 : where[6] * modifier), colours[where[0] + "Right"], false);
		}
		if (parts.indexOf(where[0] + "Left") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier, y + where[2] * modifier, z + (where[7] ? where[6] * modifier : where[3] * modifier - 1),
				x + where[4] * modifier - 1, y + where[5] * modifier - 1, z + (where[7] ? where[6] * modifier : where[3] * modifier - 1), colours[where[0] + "Left"], false);
		}
		if (parts.indexOf(where[0] + "Front") != -1) {
			buildPartAtLocation(blockSource, x + where[1] * modifier - 1, y + where[2] * modifier, z + where[3] * modifier,
				x + where[1] * modifier - 1, y + where[5] * modifier - 1, z + where[6] * modifier - 1, colours[where[0] + "Front"], where[7]);
		}
	}

	blockSource = blockSource || BlockSource.getDefaultForActor(getPlayerEnt());
	for (let element in location) {
		if (element != "hat") {
			buildColourAtLocation(blockSource, x, y, z, location[element]);
		} else {
			buildHatAtLocation(blockSource, x, y, z, location[element]);
		}
	}
};
