const divideBox = function(box) {
	let block = {
			x1: Math.floor(box[0]),
			y1: Math.floor(box[1]),
			z1: Math.floor(box[2]),
			x2: Math.ceil(box[3]),
			y2: Math.ceil(box[4]),
			z2: Math.ceil(box[5])
		},
		rem = {
			// Local in-block solid location inside 1x1x1 AABB
			x1: Math.abs(box[0] >= 0 ? box[0] : 0 + box[0]) % 1,
			y1: Math.abs(box[1] >= 0 ? box[1] : 0 + box[1]) % 1,
			z1: Math.abs(box[2] >= 0 ? box[2] : 0 + box[2]) % 1,
			x2: Math.abs(box[3] >= 0 ? box[3] : 0 + box[3]) % 1,
			y2: Math.abs(box[4] >= 0 ? box[4] : 0 + box[4]) % 1,
			z2: Math.abs(box[5] >= 0 ? box[5] : 0 + box[5]) % 1
		},
		result = new Object(),
		hasBoxes = false;
	// Divide anything boxes inside ceil block section
	for (let dx = block.x1; dx < block.x2; dx++) {
		let x1 = dx == block.x1 && rem.x1 > 0 ? rem.x1 : 0,
			x2 = dx + 1 == block.x2 && rem.x2 > 0 ? rem.x2 : 1;
		for (let dy = block.y1; dy < block.y2; dy++) {
			let y1 = dy == block.y1 && rem.y1 > 0 ? rem.y1 : 0,
				y2 = dy + 1 == block.y2 && rem.y2 > 0 ? rem.y2 : 1;
			for (let dz = block.z1; dz < block.z2; dz++) {
				let z1 = dz == block.z1 && rem.z1 > 0 ? rem.z1 : 0,
					z2 = dz + 1 == block.z2 && rem.z2 > 0 ? rem.z2 : 1;
				if (!result[dx]) {
					result[dx] = new Object();
				}
				if (!result[dx][dy]) {
					result[dx][dy] = new Object();
				}
				// Will be availabled with box[x][y][z] without overlay
				result[dx][dy][dz] = [x1, y1, z1, x2, y2, z2];
				if (box.length > 6) {
					result[dx][dy][dz].push(box[6]);
				}
				if (box.length > 7) {
					result[dx][dy][dz].push(box[7]);
				}
				hasBoxes = true;
			}
		}
	}
	// Inflate overlay box if out of section, that
	// means this block size much more ceil block
	if (!hasBoxes) {
		let dx = block.x1,
			dy = block.y1,
			dz = block.z1,
			x = block.x2 - dx,
			y = block.y2 - dy,
			z = block.z2 - dz;
		if ((x == 0 && y == 1 && z == 1) || (x == 1 && y == 0 && z == 1) || (x == 1 && y == 1 && z == 0)) {
			// Fix override with next placed block
			x == 0 && dx > 0 && (dx--);
			y == 0 && dy > 0 && (dy--);
			z == 0 && dz > 0 && (dz--);
			result[dx] = new Object();
			result[dx][dy] = new Object();
			result[dx][dy][dz] = [rem.x1 > 0 ? rem.x1 : 0, rem.x2 > 0 ? rem.x2 : 1, rem.y1 > 0 ? rem.y1 : 0, rem.y2 > 0 ? rem.y2 : 1, rem.z1 > 0 ? rem.z1 : 0, rem.z2 > 0 ? rem.z2 : 1];
			if (box.length > 6) {
				result[dx][dy][dz].push(box[6]);
			}
			if (box.length > 7) {
				result[dx][dy][dz].push(box[7]);
			}
			hasBoxes = true;
		}
	}
	// Illegal box coordinates, as it is really developer exception
	return hasBoxes ? result : block.x1 > block.x2 ? "x1 > x2" : block.y1 > block.y2 ? "y1 > y2" : z1 > z2 ? "z1 > z2" :
		block.x1 == block.x2 ? "x1 = x2" : block.y1 == block.y2 ? "y1 = y2" : z1 == z2 ? "z1 = z2" : undefined;
};

Translation.addTranslation("Oh nose divider talked", {
	ru: "О нет, сказал разделитель"
});
Translation.addTranslation("%s box ignored, because %s", {
	ru: "%s коробка проигнорирована, ибо %s"
});

const divideRender = function(boxes) {
	let result = new Object();
	if (!Array.isArray(boxes)) {
		return result;
	}
	let warn = new Array();
	for (let i = 0; i < boxes.length; i++) {
		let divide = divideBox(boxes[i]);
		if (typeof divide == "object") {
			for (let x in divide) {
				for (let y in divide[x]) {
					for (let z in divide[x][y]) {
						if (!result[x]) {
							result[x] = new Object();
						}
						if (!result[x][y]) {
							result[x][y] = new Object();
						}
						if (!result[x][y][z]) {
							result[x][y][z] = new Array();
						}
						result[x][y][z].push(divide[x][y][z]);
					}
				}
			}
		} else {
			warn.push(translate("%s box ignored, because %s", [i, divide]));
		}
	}
	// There is may be too much warnings
	if (warn.length > 0) {
		confirm(translate("Oh nose divider talked"), warn.join("\n"));
	}
	return result;
};

const modelToDivideableArray = function(model) {
	let totally = new Array();
	if (!model || model.getBoxes === undefined) {
		return totally;
	}
	let boxes = model.getBoxes();
	boxes.forEach(function(value) {
		let box = new Array();
		box.push(value.x1);
		box.push(value.y1);
		box.push(value.z1);
		box.push(value.x2);
		box.push(value.y2);
		box.push(value.z2);
		let texture = value.texture;
		if (texture) {
			if (texture.length > 1) {
				box.push(texture);
			} else if (texture.length == 1) {
				box.push(texture[0][0]);
				box.push(texture[0][1]);
			}
		}
		totally.push(box);
	});
	return totally;
};

const divideableArrayToModel = function(array) {
	let totally = new Array();
	if (!Array.isArray(array)) {
		return totally;
	}
	array.forEach(function(value) {
		let box = new Object();
		box.x1 = value[0];
		box.y1 = value[1];
		box.z1 = value[2];
		box.x2 = value[3];
		box.y2 = value[4];
		box.z2 = value[5];
		let texture = value[6];
		if (value.length > 7) {
			box.texture = [[texture, value[7]]];
		} else if (value.length > 6) {
			box.texture = texture;
		}
		totally.push(box);
	});
	return totally;
};

Translation.addTranslation("%s boxes divided into %s blocks", {
	ru: "%s коробок разделены в %s блоков"
});

const divideIntoPreview = function(render, collision) {
	let divided = divideRender(render),
		shape = divideRender(collision),
		boxes = new Array(),
		blocks = 0,
		count = 0;
	render && (count += render.length);
	collision && (count += collision.length);
	// Parse anything divided to model by internal converter
	let converter = new BlockConverter();
	for (let x in divided) {
		for (let y in divided[x]) {
			for (let z in divided[x][y]) {
				let element = new Array();
				element.push("// block " + x + ", " + y + ", " + z);
				if (divided[x][y][z]) {
					let anywhere = divided[x][y][z];
					anywhere = divideableArrayToModel(anywhere);
					anywhere = converter.buildModel(anywhere, "model");
					anywhere && element.push(anywhere);
					if (shape[x] && shape[x][y] && shape[x][y][z]) {
						let somewhere = shape[x][y][z];
						somewhere = divideableArrayToModel(somewhere);
						somewhere = converter.buildModel(somewhere, "shape");
						somewhere && element.push(somewhere);
					}
					blocks++;
				}
				boxes.push(element.join("\n"));
			}
		}
	}
	showHint(translate("%s boxes divided into %s blocks", [count, blocks]));
	return boxes.join("\n\n");
};

return function(render, collision) {
	if (render && !Array.isArray(render)) {
		render = modelToDivideableArray(render);
	}
	if (collision && !Array.isArray(collision)) {
		collision = modelToDivideableArray(collision);
	}
	return divideIntoPreview(render, collision);
};
