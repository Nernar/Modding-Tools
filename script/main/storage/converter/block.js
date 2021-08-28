const BlockConverter = new Function();

BlockConverter.prototype = new ScriptConverter;
BlockConverter.prototype.TYPE = "block";

BlockConverter.prototype.process = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		MCSystem.throwException("BlockConverter can process only non-null Object instances");
	}
	let result = this.result = new Array();
	if (obj.define) {
		let define = this.buildDefine(obj);
		define && result.push(define);
	}
	if (obj.renderer) {
		let renderer = this.buildRenderer(obj);
		renderer && result.push(renderer);
	}
	if (obj.collision) {
		let collision = this.buildCollision(obj);
		collision && result.push(collision);
	}
	return this.getCurrentlyReaded();
};

BlockConverter.prototype.getAndAttachWorker = function() {
	if (!this.worker) {
		this.worker = new BlockWorker();
	}
	return this.worker;
};

BlockConverter.prototype.getIdentifier = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		return "unknown";
	}
	return obj.id || obj.define ? obj.define.id :
		this.getAndAttachWorker().Define.getIdentificator();
};

BlockConverter.prototype.buildDefine = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		return null;
	}
	let define = obj.define,
		result = new Array();
	if (!define) return null;
	result.push("IDRegistry.genBlockID(\"" + this.getIdentifier(obj) + "\");");
	result.push("Block.createBlock(\"" + this.getIdentifier(obj) + "\"");
	if (define.data && define.data.length > 0) {
		result[result.length - 1] += ", " + define.data;
	}
	if (define.special) {
		result[result.length - 1] += ", " + define.special;
	}
	result[result.length - 1] += ");";
	if (define.shape) {
		if (result.length > 0) result.push(String());
		result.push("Block.setShape(BlockID." + this.getIdentifier(obj) + ", " + this.buildBox(define.shape) + ");");
	}
	return result.length > 0 ? result.join("\n") : null;
};

BlockConverter.prototype.buildRenderer = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		return null;
	}
	let renderer = obj.renderer,
		result = new Array();
	if (!renderer) return null;
	for (let i = 0; i < renderer.length; i++) {
		let model = renderer[i];
		if (!model) continue;
		if (i > 0) result.push(String());
		result.push("let " + this.resolvePrefix("renderer", renderer, i) + " = new ICRender.Model();");
		result.push("BlockRenderer.setStaticICRender(BlockID." + this.getIdentifier(obj) + ", " +
			(renderer.length == 1 ? "-1" : i) + ", " + this.resolvePrefix("renderer", renderer, i) + ");");
		result.push("let " + this.resolvePrefix("model", renderer, i) + " = BlockRenderer.createModel();");
		let boxes = this.buildModel(model.boxes, this.resolvePrefix("model", renderer, i));
		if (boxes) result.push(boxes);
		result.push("renderer.addEntry(" + this.resolvePrefix("model", renderer, i) + ");");
	}
	return result.length > 0 ? result.join("\n") : null;
};

BlockConverter.prototype.buildCollision = function(obj) {
	if (!obj || !(obj instanceof Object)) {
		return null;
	}
	let collision = obj.collision,
		result = new Array();
	if (!collision) return null;
	for (let i = 0; i < collision.length; i++) {
		let model = collision[i];
		if (!model) continue;
		if (i > 0) result.push(String());
		result.push("let " + this.resolvePrefix("collision", collision, i) + " = new ICRender.CollisionShape();");
		result.push("BlockRenderer.setCustomCollisionShape(BlockID." + this.getIdentifier(obj) + ", " +
			(collision.length == 1 ? "-1" : i) + ", " + this.resolvePrefix("collision", collision, i) + ");");
		result.push("let " + this.resolvePrefix("shape", collision, i) + " = BlockRenderer.createModel();");
		let boxes = this.buildModel(model.boxes, this.resolvePrefix("shape", collision, i));
		if (boxes) result.push(boxes);
		result.push("collision.addEntry(" + this.resolvePrefix("shape", collision, i) + ");");
	}
	return result.length > 0 ? result.join("\n") : null;
};

BlockConverter.prototype.buildModel = function(model, prefix) {
	if (!model || !Array.isArray(model)) {
		return null;
	}
	let result = new Array();
	for (let i = 0; i < model.length; i++) {
		let box = model[i];
		if (!box) continue;
		result.push(prefix + ".addBox(" + this.buildBox(box) + ");");
	}
	return result.length > 0 ? result.join("\n") : null;
};

BlockConverter.prototype.buildBox = function(box) {
	if (box.texture) {
		if (box.texture.length > 1) {
			return MathUtils.mathDivider(box.x1) + ", " + MathUtils.mathDivider(box.y1) + ", " + MathUtils.mathDivider(box.z1) + ", " +
				MathUtils.mathDivider(box.x2) + ", " + MathUtils.mathDivider(box.y2) + ", " + MathUtils.mathDivider(box.z2) + ", " + stringifyObjectUnsafe(box.texture, true);
		}
		if (box.texture.length == 1) {
			return MathUtils.mathDivider(box.x1) + ", " + MathUtils.mathDivider(box.y1) + ", " + MathUtils.mathDivider(box.z1) + ", " +
				MathUtils.mathDivider(box.x2) + ", " + MathUtils.mathDivider(box.y2) + ", " + MathUtils.mathDivider(box.z2) + ", " +
				(typeof box.texture[0][0] != "number" ? "\"" + box.texture[0][0] + "\"" : box.texture[0][0]) + (box.texture[0][1] !== undefined ? ", " + box.texture[0][1] : String());
		}
	}
	return MathUtils.mathDivider(box.x1) + ", " + MathUtils.mathDivider(box.y1) + ", " + MathUtils.mathDivider(box.z1) + ", " +
		MathUtils.mathDivider(box.x2) + ", " + MathUtils.mathDivider(box.y2) + ", " + MathUtils.mathDivider(box.z2);
};
