var AddonEntityRegistry = {};
AddonEntityRegistry.data = {};
AddonEntityRegistry.data[-55834574845] = {};
AddonEntityRegistry.data[-55834574845].id = -55834574845;
AddonEntityRegistry.data[-55834574845].type = "minecraft:pig";
AddonEntityRegistry.data[-55834574845].getCommandCondition = function() {
	return "@e[x=0.5,y=-0.8999999761581421,z=0.5,r=0.0001]";
};
AddonEntityRegistry.data[-55834574845].exec = function(command) {
	return null;
};
AddonEntityRegistry.data[-55834574845].execAt = function(command, x, y, z) {
	return null;
};
AddonEntityRegistry.data[-55834574844] = {};
AddonEntityRegistry.data[-55834574844].id = -55834574844;
AddonEntityRegistry.data[-55834574844].type = "minecraft:pig";
AddonEntityRegistry.data[-55834574844].getCommandCondition = function() {
	return "@e[x=0.5,y=-0.8999999761581421,z=0.5,r=0.0001]";
};
AddonEntityRegistry.data[-55834574844].exec = function(command) {
	return null;
};
AddonEntityRegistry.data[-55834574844].execAt = function(command, x, y, z) {
	return null;
};
AddonEntityRegistry.awaitCallback = null;
AddonEntityRegistry.spawn = function(x, y, z, nameID) {
	return {
		id: -55834574843,
		type: "minecraft:pig",
		getCommandCondition: (function () {var position = EntityAPI.getPosition(this.id);return "@e[x=" + position.x + ",y=" + position.y + ",z=" + position.z + ",r=0.0001]";}),
		exec: (function (command) {return Commands.exec("execute " + this.getCommandCondition() + " ~ ~ ~ " + command);}),
		execAt: (function (command, x, y, z) {return Commands.exec("execute " + this.getCommandCondition() + " " + x + " " + y + " " + z + " " + command);})
	};
};
AddonEntityRegistry.getEntityData = function(entity) {
	return null;
};
AddonEntityRegistry.onEntityAdded = function(entity) {
	return null;
};

function AddonEntity(id, type) {
	return null;
}