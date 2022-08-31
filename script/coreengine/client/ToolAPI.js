var ToolAPI = {};
ToolAPI.blockMaterials = {};
ToolAPI.blockMaterials.stone = {};
ToolAPI.blockMaterials.stone.multiplier = 3.3333333333333335;
ToolAPI.blockMaterials.stone.name = "stone";
ToolAPI.blockMaterials.wood = {};
ToolAPI.blockMaterials.wood.multiplier = 1;
ToolAPI.blockMaterials.wood.name = "wood";
ToolAPI.blockMaterials.dirt = {};
ToolAPI.blockMaterials.dirt.multiplier = 1;
ToolAPI.blockMaterials.dirt.name = "dirt";
ToolAPI.blockMaterials.plant = {};
ToolAPI.blockMaterials.plant.multiplier = 1;
ToolAPI.blockMaterials.plant.name = "plant";
ToolAPI.blockMaterials.fibre = {};
ToolAPI.blockMaterials.fibre.multiplier = 1;
ToolAPI.blockMaterials.fibre.name = "fibre";
ToolAPI.blockMaterials.cobweb = {};
ToolAPI.blockMaterials.cobweb.multiplier = 3.3333333333333335;
ToolAPI.blockMaterials.cobweb.name = "cobweb";
ToolAPI.blockMaterials.unbreaking = {};
ToolAPI.blockMaterials.unbreaking.multiplier = 999999999;
ToolAPI.blockMaterials.unbreaking.name = "unbreaking";
ToolAPI.toolMaterials = {};
ToolAPI.toolMaterials.wood = {};
ToolAPI.toolMaterials.wood.level = 1;
ToolAPI.toolMaterials.wood.durability = 60;
ToolAPI.toolMaterials.wood.damage = 2;
ToolAPI.toolMaterials.wood.efficiency = 2;
ToolAPI.toolMaterials.wood.name = "wood";
ToolAPI.toolMaterials.stone = {};
ToolAPI.toolMaterials.stone.level = 2;
ToolAPI.toolMaterials.stone.durability = 132;
ToolAPI.toolMaterials.stone.damage = 3;
ToolAPI.toolMaterials.stone.efficiency = 4;
ToolAPI.toolMaterials.stone.name = "stone";
ToolAPI.toolMaterials.iron = {};
ToolAPI.toolMaterials.iron.level = 3;
ToolAPI.toolMaterials.iron.durability = 251;
ToolAPI.toolMaterials.iron.damage = 4;
ToolAPI.toolMaterials.iron.efficiency = 6;
ToolAPI.toolMaterials.iron.name = "iron";
ToolAPI.toolMaterials.golden = {};
ToolAPI.toolMaterials.golden.level = 1;
ToolAPI.toolMaterials.golden.durability = 33;
ToolAPI.toolMaterials.golden.damage = 2;
ToolAPI.toolMaterials.golden.efficiency = 12;
ToolAPI.toolMaterials.golden.name = "golden";
ToolAPI.toolMaterials.diamond = {};
ToolAPI.toolMaterials.diamond.level = 4;
ToolAPI.toolMaterials.diamond.durability = 1562;
ToolAPI.toolMaterials.diamond.damage = 5;
ToolAPI.toolMaterials.diamond.efficiency = 8;
ToolAPI.toolMaterials.diamond.name = "diamond";
ToolAPI.toolMaterials.netherite = {};
ToolAPI.toolMaterials.netherite.level = 4;
ToolAPI.toolMaterials.netherite.durability = 2032;
ToolAPI.toolMaterials.netherite.damage = 6;
ToolAPI.toolMaterials.netherite.efficiency = 9;
ToolAPI.toolMaterials.netherite.name = "netherite";
ToolAPI.toolData = {};
ToolAPI.blockData = {};
ToolAPI.needDamagableItemFix = false;
ToolAPI.addBlockMaterial = function(name, breakingMultiplier) {
	return null;
};
ToolAPI.addToolMaterial = function(name, material) {
	return null;
};
ToolAPI.registerTool = function(id, toolMaterial, blockMaterials, params) {
	/* TypeError: Cannot call method "setMaxDamage" of null */
};
ToolAPI.registerSword = function(id, toolMaterial, params) {
	/* TypeError: Cannot call method "setMaxDamage" of null */
};
ToolAPI.registerBlockMaterial = function(uid, materialName, level, isNative) {
	return null;
};
ToolAPI.registerBlockDiggingLevel = function(uid, level) {
	return null;
};
ToolAPI.registerBlockMaterialAsArray = function(materialName, UIDs, isNative) {
	return null;
};
ToolAPI.refresh = function() {
	return null;
};
ToolAPI.getBlockData = function(blockID) {
	return {
		material: {
			multiplier: 3.3333333333333335,
			name: "stone"
		},
		level: 1,
		isNative: true
	};
};
ToolAPI.getBlockMaterial = function(blockID) {
	return {
		multiplier: 3.3333333333333335,
		name: "stone"
	};
};
ToolAPI.getBlockDestroyLevel = function(blockID) {
	return 1;
};
ToolAPI.getEnchantExtraData = function(extra) {
	return {
		silk: false,
		fortune: 0,
		efficiency: 0,
		unbreaking: 0,
		experience: 0,
		all: {}
	};
};
ToolAPI.fortuneDropModifier = function(drop, level) {
	return 1;
};
ToolAPI.getDestroyTimeViaTool = function(fullBlock, toolItem, coords, ignoreNative) {
	return 1.5;
};
ToolAPI.getToolData = function(itemID) {
	return null;
};
ToolAPI.getToolLevel = function(itemID) {
	return 0;
};
ToolAPI.getToolLevelViaBlock = function(itemID, blockID) {
	return 0;
};
ToolAPI.getCarriedToolData = function() {
	return {
		brokenId: 0,
		damage: 0,
		toolMaterial: {
			level: 3,
			durability: 251,
			damage: 4,
			efficiency: 6,
			name: "iron"
		},
		blockMaterials: {
			fibre: true
		},
		calcDestroyTime: (function (tool, coords, block, timeData, defaultTime) {return defaultTime;}),
		isWeapon: true
	};
};
ToolAPI.getCarriedToolLevel = function() {
	return 3;
};
ToolAPI.startDestroyHook = function(coords, block, carried) {
	return null;
};
ToolAPI.destroyBlockHook = function(coords, block, item, player) {
	return null;
};
ToolAPI.LastAttackTime = 0;
ToolAPI.playerAttackHook = function(attacker, victim, item) {
	return null;
};
ToolAPI.resetEngine = function() {
	return null;
};
ToolAPI.dropExpOrbs = function(x, y, z, value) {
	return null;
};
ToolAPI.dropOreExp = function(coords, minVal, maxVal, modifier, blockSource) {
	return null;
};
ToolAPI.getBlockMaterialName = function(blockID) {
	return "stone";
};
