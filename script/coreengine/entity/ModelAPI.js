function ModelWatcher(entity, model) {}
function ModelAPI(parentModel) {}

var ce_default_entity_render = {};
ce_default_entity_render.getRenderType = function() {
	return 4097;
};
ce_default_entity_render.getId = function() {
	return 4097;
};
ce_default_entity_render.getID = function() {
	return 4097;
};
ce_default_entity_render.init = function(params) {};
ce_default_entity_render.initModel = function() {};
ce_default_entity_render.checkChangeable = function() {};
ce_default_entity_render.rebuild = function() {};
ce_default_entity_render.getModel = function() {};
ce_default_entity_render.transform = function() {};
ce_default_entity_render.getPart = function(name) {
	return null;
};
ce_default_entity_render.addPart = function(name, params) {
	/* JavaException: java.lang.RuntimeException: addPart got invalid part name, it must be formatted as parentPartName.newPartName */
};
ce_default_entity_render.setPartParams = function(name, params) {
	/* JavaException: java.lang.RuntimeException: setPart got invalid part name test */
};
ce_default_entity_render.setPart = function(name, data, params) {
	/* JavaException: java.lang.RuntimeException: setPart got invalid part name test */
};
ce_default_entity_render._setPartRecursive = function(part, data, coords) {};
ce_default_entity_render.localCache = {};
ce_default_entity_render.fromCache = function(data) {};
ce_default_entity_render.toCache = function() {
	return null;
};
ce_default_entity_render.saveState = function(name, isLocal) {};
ce_default_entity_render.loadState = function(name, isLocal) {
	return true;
};
ce_default_entity_render.loadInitialState = function(name) {};
ce_default_entity_render.saveToNext = function(name, isLocal) {};
ce_default_entity_render.isEmpty = true;
ce_default_entity_render.isChangeable = true;
ce_default_entity_render.renderer = {};
ce_default_entity_render.renderer.humanoid = null;
ce_default_entity_render.renderer.release = function() {};
ce_default_entity_render.renderer.skin = null;
ce_default_entity_render.renderer.scale = 1;
ce_default_entity_render.renderer.addFinalizeCallback = function() {};
ce_default_entity_render.renderer.getRenderType = function() {};
ce_default_entity_render.renderer.transform = {};
ce_default_entity_render.renderer.transform.rotate = function() {};
ce_default_entity_render.renderer.transform.unlock = function() {};
ce_default_entity_render.renderer.transform.clear = function() {};
ce_default_entity_render.renderer.transform.scale = function() {};
ce_default_entity_render.renderer.transform.matrix = function() {};
ce_default_entity_render.renderer.transform.translate = function() {};
ce_default_entity_render.renderer.transform.hashCode = function() {};
ce_default_entity_render.renderer.transform.lock = function() {};
ce_default_entity_render.renderer.transform.toString = function() {};
ce_default_entity_render.renderer.finalizeable = null;
ce_default_entity_render.renderer.hashCode = function() {};
ce_default_entity_render.renderer.model = {};
ce_default_entity_render.renderer.model.hasPart = function() {};
ce_default_entity_render.renderer.model.part = null;
ce_default_entity_render.renderer.model.getPart = function() {};
ce_default_entity_render.renderer.model.hashCode = function() {};
ce_default_entity_render.renderer.model.reset = function() {};
ce_default_entity_render.renderer.model.toString = function() {};
ce_default_entity_render.renderer.model.clearAllParts = function() {};
ce_default_entity_render.renderer.setFinalizeable = function() {};
ce_default_entity_render.renderer.renderType = 4099;
ce_default_entity_render.renderer.getModel = function() {};
ce_default_entity_render.renderer.pointer = -1828105568;
ce_default_entity_render.renderer.setScale = function() {};
ce_default_entity_render.renderer.getPointer = function() {};
ce_default_entity_render.renderer.setSkin = function() {};
ce_default_entity_render.renderer.isHumanoid = true;
ce_default_entity_render.renderer.getScale = function() {};
ce_default_entity_render.renderer.toString = function() {};
ce_default_entity_render.model = {};
ce_default_entity_render.model.hasPart = function() {};
ce_default_entity_render.model.part = null;
ce_default_entity_render.model.getPart = function() {};
ce_default_entity_render.model.hashCode = function() {};
ce_default_entity_render.model.reset = function() {};
ce_default_entity_render.model.toString = function() {};
ce_default_entity_render.model.clearAllParts = function() {};
ce_default_entity_render.parts = {};
ce_default_entity_render.parts.head = {};
ce_default_entity_render.parts.head.textureOffset = null;
ce_default_entity_render.parts.head.getMesh = function() {};
ce_default_entity_render.parts.head.setMesh = function() {};
ce_default_entity_render.parts.head.offset = null;
ce_default_entity_render.parts.head.rotation = null;
ce_default_entity_render.parts.head.clear = function() {};
ce_default_entity_render.parts.head.setTextureOffset = function() {};
ce_default_entity_render.parts.head.setRotation = function() {};
ce_default_entity_render.parts.head.setTextureSize = function() {};
ce_default_entity_render.parts.head.textureSize = null;
ce_default_entity_render.parts.head.setOffset = function() {};
ce_default_entity_render.parts.head.hashCode = function() {};
ce_default_entity_render.parts.head.toString = function() {};
ce_default_entity_render.parts.head.addPart = function() {};
ce_default_entity_render.parts.head.mesh = null;
ce_default_entity_render.parts.head.addBox = function() {};
ce_default_entity_render.parts.body = {};
ce_default_entity_render.parts.body.textureOffset = null;
ce_default_entity_render.parts.body.getMesh = function() {};
ce_default_entity_render.parts.body.setMesh = function() {};
ce_default_entity_render.parts.body.offset = null;
ce_default_entity_render.parts.body.rotation = null;
ce_default_entity_render.parts.body.clear = function() {};
ce_default_entity_render.parts.body.setTextureOffset = function() {};
ce_default_entity_render.parts.body.setRotation = function() {};
ce_default_entity_render.parts.body.setTextureSize = function() {};
ce_default_entity_render.parts.body.textureSize = null;
ce_default_entity_render.parts.body.setOffset = function() {};
ce_default_entity_render.parts.body.hashCode = function() {};
ce_default_entity_render.parts.body.toString = function() {};
ce_default_entity_render.parts.body.addPart = function() {};
ce_default_entity_render.parts.body.mesh = null;
ce_default_entity_render.parts.body.addBox = function() {};
ce_default_entity_render.parts.leftArm = {};
ce_default_entity_render.parts.leftArm.textureOffset = null;
ce_default_entity_render.parts.leftArm.getMesh = function() {};
ce_default_entity_render.parts.leftArm.setMesh = function() {};
ce_default_entity_render.parts.leftArm.offset = null;
ce_default_entity_render.parts.leftArm.rotation = null;
ce_default_entity_render.parts.leftArm.clear = function() {};
ce_default_entity_render.parts.leftArm.setTextureOffset = function() {};
ce_default_entity_render.parts.leftArm.setRotation = function() {};
ce_default_entity_render.parts.leftArm.setTextureSize = function() {};
ce_default_entity_render.parts.leftArm.textureSize = null;
ce_default_entity_render.parts.leftArm.setOffset = function() {};
ce_default_entity_render.parts.leftArm.hashCode = function() {};
ce_default_entity_render.parts.leftArm.toString = function() {};
ce_default_entity_render.parts.leftArm.addPart = function() {};
ce_default_entity_render.parts.leftArm.mesh = null;
ce_default_entity_render.parts.leftArm.addBox = function() {};
ce_default_entity_render.parts.rightArm = {};
ce_default_entity_render.parts.rightArm.textureOffset = null;
ce_default_entity_render.parts.rightArm.getMesh = function() {};
ce_default_entity_render.parts.rightArm.setMesh = function() {};
ce_default_entity_render.parts.rightArm.offset = null;
ce_default_entity_render.parts.rightArm.rotation = null;
ce_default_entity_render.parts.rightArm.clear = function() {};
ce_default_entity_render.parts.rightArm.setTextureOffset = function() {};
ce_default_entity_render.parts.rightArm.setRotation = function() {};
ce_default_entity_render.parts.rightArm.setTextureSize = function() {};
ce_default_entity_render.parts.rightArm.textureSize = null;
ce_default_entity_render.parts.rightArm.setOffset = function() {};
ce_default_entity_render.parts.rightArm.hashCode = function() {};
ce_default_entity_render.parts.rightArm.toString = function() {};
ce_default_entity_render.parts.rightArm.addPart = function() {};
ce_default_entity_render.parts.rightArm.mesh = null;
ce_default_entity_render.parts.rightArm.addBox = function() {};
ce_default_entity_render.parts.leftLeg = {};
ce_default_entity_render.parts.leftLeg.textureOffset = null;
ce_default_entity_render.parts.leftLeg.getMesh = function() {};
ce_default_entity_render.parts.leftLeg.setMesh = function() {};
ce_default_entity_render.parts.leftLeg.offset = null;
ce_default_entity_render.parts.leftLeg.rotation = null;
ce_default_entity_render.parts.leftLeg.clear = function() {};
ce_default_entity_render.parts.leftLeg.setTextureOffset = function() {};
ce_default_entity_render.parts.leftLeg.setRotation = function() {};
ce_default_entity_render.parts.leftLeg.setTextureSize = function() {};
ce_default_entity_render.parts.leftLeg.textureSize = null;
ce_default_entity_render.parts.leftLeg.setOffset = function() {};
ce_default_entity_render.parts.leftLeg.hashCode = function() {};
ce_default_entity_render.parts.leftLeg.toString = function() {};
ce_default_entity_render.parts.leftLeg.addPart = function() {};
ce_default_entity_render.parts.leftLeg.mesh = null;
ce_default_entity_render.parts.leftLeg.addBox = function() {};
ce_default_entity_render.parts.rightLeg = {};
ce_default_entity_render.parts.rightLeg.textureOffset = null;
ce_default_entity_render.parts.rightLeg.getMesh = function() {};
ce_default_entity_render.parts.rightLeg.setMesh = function() {};
ce_default_entity_render.parts.rightLeg.offset = null;
ce_default_entity_render.parts.rightLeg.rotation = null;
ce_default_entity_render.parts.rightLeg.clear = function() {};
ce_default_entity_render.parts.rightLeg.setTextureOffset = function() {};
ce_default_entity_render.parts.rightLeg.setRotation = function() {};
ce_default_entity_render.parts.rightLeg.setTextureSize = function() {};
ce_default_entity_render.parts.rightLeg.textureSize = null;
ce_default_entity_render.parts.rightLeg.setOffset = function() {};
ce_default_entity_render.parts.rightLeg.hashCode = function() {};
ce_default_entity_render.parts.rightLeg.toString = function() {};
ce_default_entity_render.parts.rightLeg.addPart = function() {};
ce_default_entity_render.parts.rightLeg.mesh = null;
ce_default_entity_render.parts.rightLeg.addBox = function() {};
ce_default_entity_render.parts.headwear = {};
ce_default_entity_render.parts.headwear.textureOffset = null;
ce_default_entity_render.parts.headwear.getMesh = function() {};
ce_default_entity_render.parts.headwear.setMesh = function() {};
ce_default_entity_render.parts.headwear.offset = null;
ce_default_entity_render.parts.headwear.rotation = null;
ce_default_entity_render.parts.headwear.clear = function() {};
ce_default_entity_render.parts.headwear.setTextureOffset = function() {};
ce_default_entity_render.parts.headwear.setRotation = function() {};
ce_default_entity_render.parts.headwear.setTextureSize = function() {};
ce_default_entity_render.parts.headwear.textureSize = null;
ce_default_entity_render.parts.headwear.setOffset = function() {};
ce_default_entity_render.parts.headwear.hashCode = function() {};
ce_default_entity_render.parts.headwear.toString = function() {};
ce_default_entity_render.parts.headwear.addPart = function() {};
ce_default_entity_render.parts.headwear.mesh = null;
ce_default_entity_render.parts.headwear.addBox = function() {};
ce_default_entity_render.renderId = 4099;
ce_default_entity_render.setTextureResolution = function() {};

var BASIC_NULL_RENDER = {};
BASIC_NULL_RENDER.getRenderType = function() {
	return 4096;
};
BASIC_NULL_RENDER.getId = function() {
	return 4096;
};
BASIC_NULL_RENDER.getID = function() {
	return 4096;
};
BASIC_NULL_RENDER.init = function(params) {};
BASIC_NULL_RENDER.initModel = function() {};
BASIC_NULL_RENDER.checkChangeable = function() {};
BASIC_NULL_RENDER.rebuild = function() {};
BASIC_NULL_RENDER.getModel = function() {};
BASIC_NULL_RENDER.transform = function() {};
BASIC_NULL_RENDER.getPart = function(name) {
	return null;
};
BASIC_NULL_RENDER.addPart = function(name, params) {
	/* JavaException: java.lang.RuntimeException: addPart got invalid part name, it must be formatted as parentPartName.newPartName */
};
BASIC_NULL_RENDER.setPartParams = function(name, params) {
	/* JavaException: java.lang.RuntimeException: setPart got invalid part name test */
};
BASIC_NULL_RENDER.setPart = function(name, data, params) {
	/* JavaException: java.lang.RuntimeException: setPart got invalid part name test */
};
BASIC_NULL_RENDER._setPartRecursive = function(part, data, coords) {};
BASIC_NULL_RENDER.localCache = {};
BASIC_NULL_RENDER.fromCache = function(data) {};
BASIC_NULL_RENDER.toCache = function() {
	return null;
};
BASIC_NULL_RENDER.saveState = function(name, isLocal) {};
BASIC_NULL_RENDER.loadState = function(name, isLocal) {
	return true;
};
BASIC_NULL_RENDER.loadInitialState = function(name) {};
BASIC_NULL_RENDER.saveToNext = function(name, isLocal) {};
BASIC_NULL_RENDER.isEmpty = true;
BASIC_NULL_RENDER.isChangeable = true;
BASIC_NULL_RENDER.renderer = {};
BASIC_NULL_RENDER.renderer.humanoid = null;
BASIC_NULL_RENDER.renderer.release = function() {};
BASIC_NULL_RENDER.renderer.skin = null;
BASIC_NULL_RENDER.renderer.scale = 1;
BASIC_NULL_RENDER.renderer.addFinalizeCallback = function() {};
BASIC_NULL_RENDER.renderer.getRenderType = function() {};
BASIC_NULL_RENDER.renderer.transform = {};
BASIC_NULL_RENDER.renderer.transform.rotate = function() {};
BASIC_NULL_RENDER.renderer.transform.unlock = function() {};
BASIC_NULL_RENDER.renderer.transform.clear = function() {};
BASIC_NULL_RENDER.renderer.transform.scale = function() {};
BASIC_NULL_RENDER.renderer.transform.matrix = function() {};
BASIC_NULL_RENDER.renderer.transform.translate = function() {};
BASIC_NULL_RENDER.renderer.transform.hashCode = function() {};
BASIC_NULL_RENDER.renderer.transform.lock = function() {};
BASIC_NULL_RENDER.renderer.transform.toString = function() {};
BASIC_NULL_RENDER.renderer.finalizeable = null;
BASIC_NULL_RENDER.renderer.hashCode = function() {};
BASIC_NULL_RENDER.renderer.model = {};
BASIC_NULL_RENDER.renderer.model.hasPart = function() {};
BASIC_NULL_RENDER.renderer.model.part = null;
BASIC_NULL_RENDER.renderer.model.getPart = function() {};
BASIC_NULL_RENDER.renderer.model.hashCode = function() {};
BASIC_NULL_RENDER.renderer.model.reset = function() {};
BASIC_NULL_RENDER.renderer.model.toString = function() {};
BASIC_NULL_RENDER.renderer.model.clearAllParts = function() {};
BASIC_NULL_RENDER.renderer.setFinalizeable = function() {};
BASIC_NULL_RENDER.renderer.renderType = 4101;
BASIC_NULL_RENDER.renderer.getModel = function() {};
BASIC_NULL_RENDER.renderer.pointer = -1828105120;
BASIC_NULL_RENDER.renderer.setScale = function() {};
BASIC_NULL_RENDER.renderer.getPointer = function() {};
BASIC_NULL_RENDER.renderer.setSkin = function() {};
BASIC_NULL_RENDER.renderer.isHumanoid = true;
BASIC_NULL_RENDER.renderer.getScale = function() {};
BASIC_NULL_RENDER.renderer.toString = function() {};
BASIC_NULL_RENDER.model = {};
BASIC_NULL_RENDER.model.hasPart = function() {};
BASIC_NULL_RENDER.model.part = null;
BASIC_NULL_RENDER.model.getPart = function() {};
BASIC_NULL_RENDER.model.hashCode = function() {};
BASIC_NULL_RENDER.model.reset = function() {};
BASIC_NULL_RENDER.model.toString = function() {};
BASIC_NULL_RENDER.model.clearAllParts = function() {};
BASIC_NULL_RENDER.parts = {};
BASIC_NULL_RENDER.parts.head = {};
BASIC_NULL_RENDER.parts.head.textureOffset = null;
BASIC_NULL_RENDER.parts.head.getMesh = function() {};
BASIC_NULL_RENDER.parts.head.setMesh = function() {};
BASIC_NULL_RENDER.parts.head.offset = null;
BASIC_NULL_RENDER.parts.head.rotation = null;
BASIC_NULL_RENDER.parts.head.clear = function() {};
BASIC_NULL_RENDER.parts.head.setTextureOffset = function() {};
BASIC_NULL_RENDER.parts.head.setRotation = function() {};
BASIC_NULL_RENDER.parts.head.setTextureSize = function() {};
BASIC_NULL_RENDER.parts.head.textureSize = null;
BASIC_NULL_RENDER.parts.head.setOffset = function() {};
BASIC_NULL_RENDER.parts.head.hashCode = function() {};
BASIC_NULL_RENDER.parts.head.toString = function() {};
BASIC_NULL_RENDER.parts.head.addPart = function() {};
BASIC_NULL_RENDER.parts.head.mesh = null;
BASIC_NULL_RENDER.parts.head.addBox = function() {};
BASIC_NULL_RENDER.parts.body = {};
BASIC_NULL_RENDER.parts.body.textureOffset = null;
BASIC_NULL_RENDER.parts.body.getMesh = function() {};
BASIC_NULL_RENDER.parts.body.setMesh = function() {};
BASIC_NULL_RENDER.parts.body.offset = null;
BASIC_NULL_RENDER.parts.body.rotation = null;
BASIC_NULL_RENDER.parts.body.clear = function() {};
BASIC_NULL_RENDER.parts.body.setTextureOffset = function() {};
BASIC_NULL_RENDER.parts.body.setRotation = function() {};
BASIC_NULL_RENDER.parts.body.setTextureSize = function() {};
BASIC_NULL_RENDER.parts.body.textureSize = null;
BASIC_NULL_RENDER.parts.body.setOffset = function() {};
BASIC_NULL_RENDER.parts.body.hashCode = function() {};
BASIC_NULL_RENDER.parts.body.toString = function() {};
BASIC_NULL_RENDER.parts.body.addPart = function() {};
BASIC_NULL_RENDER.parts.body.mesh = null;
BASIC_NULL_RENDER.parts.body.addBox = function() {};
BASIC_NULL_RENDER.parts.leftArm = {};
BASIC_NULL_RENDER.parts.leftArm.textureOffset = null;
BASIC_NULL_RENDER.parts.leftArm.getMesh = function() {};
BASIC_NULL_RENDER.parts.leftArm.setMesh = function() {};
BASIC_NULL_RENDER.parts.leftArm.offset = null;
BASIC_NULL_RENDER.parts.leftArm.rotation = null;
BASIC_NULL_RENDER.parts.leftArm.clear = function() {};
BASIC_NULL_RENDER.parts.leftArm.setTextureOffset = function() {};
BASIC_NULL_RENDER.parts.leftArm.setRotation = function() {};
BASIC_NULL_RENDER.parts.leftArm.setTextureSize = function() {};
BASIC_NULL_RENDER.parts.leftArm.textureSize = null;
BASIC_NULL_RENDER.parts.leftArm.setOffset = function() {};
BASIC_NULL_RENDER.parts.leftArm.hashCode = function() {};
BASIC_NULL_RENDER.parts.leftArm.toString = function() {};
BASIC_NULL_RENDER.parts.leftArm.addPart = function() {};
BASIC_NULL_RENDER.parts.leftArm.mesh = null;
BASIC_NULL_RENDER.parts.leftArm.addBox = function() {};
BASIC_NULL_RENDER.parts.rightArm = {};
BASIC_NULL_RENDER.parts.rightArm.textureOffset = null;
BASIC_NULL_RENDER.parts.rightArm.getMesh = function() {};
BASIC_NULL_RENDER.parts.rightArm.setMesh = function() {};
BASIC_NULL_RENDER.parts.rightArm.offset = null;
BASIC_NULL_RENDER.parts.rightArm.rotation = null;
BASIC_NULL_RENDER.parts.rightArm.clear = function() {};
BASIC_NULL_RENDER.parts.rightArm.setTextureOffset = function() {};
BASIC_NULL_RENDER.parts.rightArm.setRotation = function() {};
BASIC_NULL_RENDER.parts.rightArm.setTextureSize = function() {};
BASIC_NULL_RENDER.parts.rightArm.textureSize = null;
BASIC_NULL_RENDER.parts.rightArm.setOffset = function() {};
BASIC_NULL_RENDER.parts.rightArm.hashCode = function() {};
BASIC_NULL_RENDER.parts.rightArm.toString = function() {};
BASIC_NULL_RENDER.parts.rightArm.addPart = function() {};
BASIC_NULL_RENDER.parts.rightArm.mesh = null;
BASIC_NULL_RENDER.parts.rightArm.addBox = function() {};
BASIC_NULL_RENDER.parts.leftLeg = {};
BASIC_NULL_RENDER.parts.leftLeg.textureOffset = null;
BASIC_NULL_RENDER.parts.leftLeg.getMesh = function() {};
BASIC_NULL_RENDER.parts.leftLeg.setMesh = function() {};
BASIC_NULL_RENDER.parts.leftLeg.offset = null;
BASIC_NULL_RENDER.parts.leftLeg.rotation = null;
BASIC_NULL_RENDER.parts.leftLeg.clear = function() {};
BASIC_NULL_RENDER.parts.leftLeg.setTextureOffset = function() {};
BASIC_NULL_RENDER.parts.leftLeg.setRotation = function() {};
BASIC_NULL_RENDER.parts.leftLeg.setTextureSize = function() {};
BASIC_NULL_RENDER.parts.leftLeg.textureSize = null;
BASIC_NULL_RENDER.parts.leftLeg.setOffset = function() {};
BASIC_NULL_RENDER.parts.leftLeg.hashCode = function() {};
BASIC_NULL_RENDER.parts.leftLeg.toString = function() {};
BASIC_NULL_RENDER.parts.leftLeg.addPart = function() {};
BASIC_NULL_RENDER.parts.leftLeg.mesh = null;
BASIC_NULL_RENDER.parts.leftLeg.addBox = function() {};
BASIC_NULL_RENDER.parts.rightLeg = {};
BASIC_NULL_RENDER.parts.rightLeg.textureOffset = null;
BASIC_NULL_RENDER.parts.rightLeg.getMesh = function() {};
BASIC_NULL_RENDER.parts.rightLeg.setMesh = function() {};
BASIC_NULL_RENDER.parts.rightLeg.offset = null;
BASIC_NULL_RENDER.parts.rightLeg.rotation = null;
BASIC_NULL_RENDER.parts.rightLeg.clear = function() {};
BASIC_NULL_RENDER.parts.rightLeg.setTextureOffset = function() {};
BASIC_NULL_RENDER.parts.rightLeg.setRotation = function() {};
BASIC_NULL_RENDER.parts.rightLeg.setTextureSize = function() {};
BASIC_NULL_RENDER.parts.rightLeg.textureSize = null;
BASIC_NULL_RENDER.parts.rightLeg.setOffset = function() {};
BASIC_NULL_RENDER.parts.rightLeg.hashCode = function() {};
BASIC_NULL_RENDER.parts.rightLeg.toString = function() {};
BASIC_NULL_RENDER.parts.rightLeg.addPart = function() {};
BASIC_NULL_RENDER.parts.rightLeg.mesh = null;
BASIC_NULL_RENDER.parts.rightLeg.addBox = function() {};
BASIC_NULL_RENDER.parts.headwear = {};
BASIC_NULL_RENDER.parts.headwear.textureOffset = null;
BASIC_NULL_RENDER.parts.headwear.getMesh = function() {};
BASIC_NULL_RENDER.parts.headwear.setMesh = function() {};
BASIC_NULL_RENDER.parts.headwear.offset = null;
BASIC_NULL_RENDER.parts.headwear.rotation = null;
BASIC_NULL_RENDER.parts.headwear.clear = function() {};
BASIC_NULL_RENDER.parts.headwear.setTextureOffset = function() {};
BASIC_NULL_RENDER.parts.headwear.setRotation = function() {};
BASIC_NULL_RENDER.parts.headwear.setTextureSize = function() {};
BASIC_NULL_RENDER.parts.headwear.textureSize = null;
BASIC_NULL_RENDER.parts.headwear.setOffset = function() {};
BASIC_NULL_RENDER.parts.headwear.hashCode = function() {};
BASIC_NULL_RENDER.parts.headwear.toString = function() {};
BASIC_NULL_RENDER.parts.headwear.addPart = function() {};
BASIC_NULL_RENDER.parts.headwear.mesh = null;
BASIC_NULL_RENDER.parts.headwear.addBox = function() {};
BASIC_NULL_RENDER.renderId = 4101;
BASIC_NULL_RENDER.setTextureResolution = function() {};

var ce_missing_entity_texture = {};
ce_missing_entity_texture.path = "images/mob/ce_missing_entity_texture.png";
ce_missing_entity_texture.isAnimated = false;
ce_missing_entity_texture.animator = {};
ce_missing_entity_texture.animator.animation = [];
ce_missing_entity_texture.animator.animationDelay = 1;
ce_missing_entity_texture.animator.animationOffsets = {};
ce_missing_entity_texture.animator.animationOffsets[0] = 0;
ce_missing_entity_texture.animator.getOffset = function(token) {};
ce_missing_entity_texture.animator.setOffset = function(token, offset) {};
ce_missing_entity_texture.animator.getGlobalTime = function() {
	return 33236038520.82;
};
ce_missing_entity_texture.animator.getTime = function(token) {
	return 33236038520.96;
};
ce_missing_entity_texture.animator.resetAnimation = function(token) {};
ce_missing_entity_texture.animator.getFrameNumber = function(token) {};
ce_missing_entity_texture.animator.setDelay = function(delay) {};
ce_missing_entity_texture.animator.setAnimation = function(arr) {};
ce_missing_entity_texture.animator.clearAnimation = function() {};
ce_missing_entity_texture.animator.addFrame = function(frame) {};
ce_missing_entity_texture.animator.getFrame = function(token) {};
ce_missing_entity_texture.animator.inherit = function(animator) {
	/* TypeError: Cannot read property "animationDelay" from undefined */
};
ce_missing_entity_texture.resolution = {};
ce_missing_entity_texture.resolution.w = 64;
ce_missing_entity_texture.resolution.h = 32;
ce_missing_entity_texture.setTexture = function(path) {
	return null;
};
ce_missing_entity_texture.setResolution = function(w, h) {
	return null;
};
ce_missing_entity_texture.setAnimation = function(animation, delay) {
	return null;
};
ce_missing_entity_texture.resetAnimation = function(token) {
	return null;
};
ce_missing_entity_texture.getTexture = function(token) {
	/* TypeError: Cannot read property "length" from undefined */
};
ce_missing_entity_texture.getResolution = function() {
	return null;
};
ce_missing_entity_texture.pixelScale = 1;
ce_missing_entity_texture.setPixelScale = function(scale) {
	return null;
};

var ce_default_entity_texture = {};
ce_default_entity_texture.path = "images/mob/ce_default_entity_texture.png";
ce_default_entity_texture.isAnimated = false;
ce_default_entity_texture.animator = {};
ce_default_entity_texture.animator.animation = [];
ce_default_entity_texture.animator.animationDelay = 1;
ce_default_entity_texture.animator.animationOffsets = {};
ce_default_entity_texture.animator.animationOffsets[0] = 0;
ce_default_entity_texture.animator.getOffset = function(token) {};
ce_default_entity_texture.animator.setOffset = function(token, offset) {};
ce_default_entity_texture.animator.getGlobalTime = function() {
	return 33236038524.48;
};
ce_default_entity_texture.animator.getTime = function(token) {
	return 33236038524.6;
};
ce_default_entity_texture.animator.resetAnimation = function(token) {};
ce_default_entity_texture.animator.getFrameNumber = function(token) {};
ce_default_entity_texture.animator.setDelay = function(delay) {};
ce_default_entity_texture.animator.setAnimation = function(arr) {};
ce_default_entity_texture.animator.clearAnimation = function() {};
ce_default_entity_texture.animator.addFrame = function(frame) {};
ce_default_entity_texture.animator.getFrame = function(token) {};
ce_default_entity_texture.animator.inherit = function(animator) {
	/* TypeError: Cannot read property "animationDelay" from undefined */
};
ce_default_entity_texture.resolution = {};
ce_default_entity_texture.resolution.w = 64;
ce_default_entity_texture.resolution.h = 32;
ce_default_entity_texture.setTexture = function(path) {
	return null;
};
ce_default_entity_texture.setResolution = function(w, h) {
	return null;
};
ce_default_entity_texture.setAnimation = function(animation, delay) {
	return null;
};
ce_default_entity_texture.resetAnimation = function(token) {
	return null;
};
ce_default_entity_texture.getTexture = function(token) {
	/* TypeError: Cannot read property "length" from undefined */
};
ce_default_entity_texture.getResolution = function() {
	return null;
};
ce_default_entity_texture.pixelScale = 8;
ce_default_entity_texture.setPixelScale = function(scale) {
	return null;
};
