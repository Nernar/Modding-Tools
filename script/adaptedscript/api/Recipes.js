var Recipes = {};
Recipes.__placeholder = function() {};
Recipes.addFurnace = function(obj1, obj2, obj3, obj4, obj5) {};
Recipes.addFurnaceFuel = function(int1, int2, int3) {};
Recipes.addShaped = function(what, arr1, arr2, func, str) {
	return Recipes.getRecipeByUid(null);
};
Recipes.addShaped2 = function(int1, int2, int3, arr1, arr2, func, str) {
	return Recipes.getRecipeByUid(null);
};
Recipes.addShapedGeneric = function(what, arr1, arr2, func, str, bool) {
	return Recipes.getRecipeByUid(null);
};
Recipes.addShapedVanilla = function(what, arr1, arr2, func, str) {
	return Recipes.getRecipeByUid(null);
};
Recipes.addShapeless = function(what, arr, func, str) {
	return Recipes.getRecipeByUid(null);
};
Recipes.addShapeless2 = function(int1, int2, int3, arr, func, str) {
	return Recipes.getRecipeByUid(null);
};
Recipes.addShapelessGeneric = function(what, arr, func, str, bool) {
	return Recipes.getRecipeByUid(null);
};
Recipes.addShapelessVanilla = function(what, arr, func, str) {
	return Recipes.getRecipeByUid(null);
};
Recipes.deleteRecipe = function(what) {};
Recipes.getAllFurnaceRecipes = function() {};
Recipes.getAllWorkbenchRecipes = function() {};
Recipes.getFuelBurnDuration = function(int1, int2) {};
Recipes.getFurnaceRecipeResult = function(int1, int2, str) {};
Recipes.getFurnaceRecipesByResult = function(int1, int2, str) {};
Recipes.getRecipeByField = function(obj, str) {
	return Recipes.getRecipeByUid(null);
};
Recipes.getRecipeByUid = function(obj) {
	return {
    	addToVanillaWorkbench: function() {},
    	addVariants: function(arrayList) {},
    	getCallback: function() {},
    	getEntry: function(char) {},
    	getEntryCodes: function() {},
    	getEntryCollection: function() {},
    	getPrefix: function() {},
    	getRecipeMask: function() {},
    	getRecipeUid: function() {},
    	getResult: function() {},
    	getSortedEntries: function() {},
    	isMatchingField: function(field) {},
    	isMatchingPrefix: function(str) {},
    	isMatchingResult: function(int1, int2, int3) {},
    	isPossibleForInventory: function(hashMap) {},
    	isValid: function() {},
    	isVanilla: function() {},
    	provideRecipe: function(field) {},
    	provideRecipeForPlayer: function(field, long) {},
    	putIntoTheField: function(field, long) {},
    	setCallback: function(func) {},
    	setEntries: function(hashMap) {},
    	setPattern: function(strOrEntriesArr) {},
    	setPrefix: function(str) {},
    	setVanilla: function(bool) {}
	};
};
Recipes.getRecipeResult = function(obj, str) {
	return Recipes.provideRecipe(obj, str);
};
Recipes.getWorkbenchRecipesByIngredient = function(int1, int2) {};
Recipes.getWorkbenchRecipesByResult = function(int1, int2, int3) {};
Recipes.provideRecipe = function(obj, str) {
	return {
    	getCount: function() {},
    	getData: function() {},
    	getExtra: function() {},
    	getExtraValue: function() {},
    	getId: function() {}
	};
};
Recipes.provideRecipeForPlayer = function(obj1, str, obj2) {
	return Recipes.provideRecipe(obj1, str);
};
Recipes.removeFurnaceFuel = function(int1, int2) {};
Recipes.removeFurnaceRecipe = function(int1, int2) {};
Recipes.removeWorkbenchRecipe = function(int1, int2, int3) {};
