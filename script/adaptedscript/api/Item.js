var Item = {};
Item.addCreativeGroup = function(str1, str2, arr) {};
Item.addToCreative = function(category, id, data, extra) {};
Item.addToCreativeGroup = function(str1, str2, number) {};
Item.createArmorItem = function(int1, str1, str2, str3, int2, str4, int3, int4, int5, double) {
	return Item.getItemById(int1);
};
Item.createFoodItem = function(int1, str1, str2, str3, int2, int3) {
	return Item.getItemById(int1);
};
Item.createItem = function(int1, str1, str2, str3, int2) {
	return Item.getItemById(int1);
};
Item.createThrowableItem = function(int1, str1, str2, str3, int2) {
	return Item.getItemById(int1);
};
Item.getItemById = function(id) {
	return {
    	addRepairItem: function(id) {},
    	addRepairItems: function(ids) {},
    	setAllowedInOffhand: function(bool) {},
    	setArmorDamageable: function(bool) {},
    	setCreativeCategory: function(category) {},
    	setEnchantType: function(number) {},
    	setEnchantType: function(int1, int2) {},
    	setEnchantability: function(int1, int2) {},
    	setGlint: function(bool) {},
    	setHandEquipped: function(bool) {},
    	setLiquidClip: function(bool) {},
    	setMaxDamage: function(number) {},
    	setMaxStackSize: function(number) {},
    	setMaxUseDuration: function(number) {},
    	setProperties: function(str) {},
    	setStackedByData: function(bool) {},
    	setUseAnimation: function(number) {}
	};
};
Item.getMaxDamage = function(number) {};
Item.getMaxStackSize = function(int1, int2) {};
Item.getName = function(int1, int2, extra) {};
Item.invokeItemUseOn = function(id, count, data, obj1, int1, int2, int3, int4, double1, double2, double3, obj2) {};
Item.isGlintItemInstance = function(int1, int2, extra) {};
Item.isValid = function(id) {};
Item.overrideCurrentIcon = function(str, number) {};
Item.overrideCurrentName = function(str) {};
Item.setCategoryForId = function(id, category) {};
Item.setRequiresIconOverride = function(id, bool) {};
