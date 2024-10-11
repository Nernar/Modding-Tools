dumpVanillaBlocks = function(output) {
	if (arguments.length < 1) {
		MCSystem.throwException("dumpVanillaBlocks: Usage: <outputJson>");
	}

	log("dumpVanillaBlocks: .. -> " + output);

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("dumpVanillaBlocks: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let buffer = {};
	for (let stringId, variants, tile, id = -512; id < 256; id++) {
		if ((stringId = IDRegistry.getStringIdAndTypeForItemId(id)) == null) {
			continue;
		}
		stringId = stringId.substring(stringId.indexOf(":") + 1);
		if (stringId.substring(stringId.length - 9) == "#negative") {
			stringId = stringId.substring(0, stringId.length - 9);
		}
		variants = [Item.getName(id, 0)];
		for (let variant, data = 1; data < 16; data++) {
			if (variants[variants.length - 1] == (variant = Item.getName(id, data))) {
				break;
			}
			variants.push(variant);
		}
		tile = id < 0 ? 255 - id : id;
		buffer[id] = {
			id: stringId,
			variants: variants,
			material: Block.getMaterial(tile),
			solid: Block.isSolid(tile),
			can_contain_liquid: Block.canContainLiquid(tile),
			can_be_extra_block: Block.canBeExtraBlock(tile),
			light_level: Block.getLightLevel(tile),
			light_opacity: Block.getLightOpacity(tile),
			render_layer: Block.getRenderLayer(tile),
			render_type: Block.getRenderType(tile),
			translucency: preround(Block.getTranslucency(tile)),
			destroy_time: preround(Block.getDestroyTime(tile)),
			explosion_resistance: preround(Block.getExplosionResistance(tile)),
			friction: preround(Block.getFriction(tile)),
			map_color: Block.getMapColor(tile)
		};
	}

	Files.write(outputFile, JSON.stringify(buffer, null, "\t"));
};
