var MCSystem = {};
MCSystem.addRuntimePack = function(type, path) {};
MCSystem.debugAPILookUp = function() {};
MCSystem.debugBmp = function(obj) {};
MCSystem.debugStr = function(message) {};
MCSystem.evalInScope = function(str1, scope, str2) {};
MCSystem.forceNativeCrash = function() {};
MCSystem.getContext = function() {};
MCSystem.getCurrentThreadType = function() {};
MCSystem.getInnerCoreVersion = function() {};
MCSystem.getMinecraftVersion = function() {};
MCSystem.getNetwork = function() {
	return {
    	addClientInitializationPacket: function(str, clientInitializationPacketSender, packetListener) {},
    	addClientPacket: function(str, onPacketReceivedListener) {},
    	addClientPacket: function(str, onPacketReceivedListener, jobExecutor) {},
    	addServerInitializationPacket: function(str, serverInitializationPacketSender, onPacketReceivedListener) {},
    	addServerPacket: function(str, onPacketReceivedListener) {},
    	addServerPacket: function(str, onPacketReceivedListener, jobExecutor) {},
    	getClient: function() {},
    	getClientForPlayer: function(long) {},
    	getConnectedClients: function() {},
    	getConnectedPlayers: function() {},
    	getHandlerForPlayer: function(long) {},
    	getNetworkInstance: function() {},
    	getServer: function() {},
    	inRemoteWorld: function() {},
    	localToServerId: function(number) {},
    	sendServerMessage: function(str) {},
    	sendToAllClients: function(str, obj) {},
    	sendToServer: function(str, obj) {},
    	serverToLocalId: function(number) {},
    	throwInitializationPacketError: function(str) {}
	};
};
MCSystem.isDefaultPrevented = function() {};
MCSystem.isMainThreadStopped = function() {};
MCSystem.runAsUi = function(what) {};
MCSystem.runOnClientThread = function(what) {};
MCSystem.runOnMainThread = function(what) {};
MCSystem.setCustomFatalErrorCallback = function(what) {};
MCSystem.setCustomNonFatalErrorCallback = function(what) {};
MCSystem.setCustomStartupErrorCallback = function(what) {};
MCSystem.setLoadingTip = function(str) {};
MCSystem.setNativeThreadPriority = function(number) {};
MCSystem.simulateBackPressed = function() {};
MCSystem.throwException = function(str) {};
