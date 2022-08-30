var CustomEnchant = {};
CustomEnchant.getEnchantById = function(id) {
	return {
    	getAttackDamageBonusProvider: function() {},
    	getDoPostAttackListener: function() {},
    	getDoPostHurtListener: function() {},
    	getProtectionBonusProvider: function() {},
    	setAttackDamageBonusProvider: function(damageBonusProvider) {},
    	setDescription: function(str) {},
    	setFrequency: function(number) {},
    	setIsDiscoverable: function(bool) {},
    	setIsLootable: function(bool) {},
    	setIsTreasure: function(bool) {},
    	setMask: function(number) {},
    	setMasks: function(int1, int2) {},
    	setMinMaxCost: function(float1, float2, optFloat3, optFloat4, optFloat5, optFloat6) {},
    	setMinMaxLevel: function(min, max) {},
    	setPostAttackCallback: function(doPostAttackListener) {},
    	setPostHurtCallback: function(doPostHurtListener) {},
    	setProtectionBonusProvider: function(protectionBonusProvider) {}
	};
};
CustomEnchant.getEnchantByNameId = function(str) {
	return CustomEnchant.getEnchantById(0);
};
CustomEnchant.newEnchant = function(str1, str2) {
	return CustomEnchant.getEnchantById(0);
};
