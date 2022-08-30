var ICRender = {};
ICRender.getGroup = function(str) {
	return {
    	add: function(int1, int2) {},
    	getName: function() {},
    	onIdDataIterated: function(int1, int2) {}
    };
};
ICRender.getUnnamedGroup = function() {
	return ICRender.getGroup(null);
};
