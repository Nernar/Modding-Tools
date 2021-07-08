const LayerDrawable = function(layers) {
	this.clearLayers();
	if (layers !== undefined) {
		this.addLayers(layers);
	}
	ScheduledDrawable.call(this);
};

LayerDrawable.prototype = new ScheduledDrawable;

LayerDrawable.prototype.process = function() {
	let layers = new Array();
	for (let i = 0; i < this.getLayerCount(); i++) {
		let drawable = this.getLayerAt(i);
		if (drawable instanceof ScheduledDrawable) {
			if (!drawable.isProcessed()) {
				drawable.toDrawable();
				while (drawable.isProcessing()) {
					java.lang.Thread.yield();
				}
			}
		}
		if (drawable instanceof Drawable) {
			layers.push(drawable.toDrawable());
		} else layers.push(drawable);
	}
	return new android.graphics.drawable.LayerDrawable(layers);
};

LayerDrawable.prototype.clearLayers = function() {
	this.layers = new Array();
	this.invalidate();
};

LayerDrawable.prototype.getLayers = function() {
	return this.layers;
};

LayerDrawable.prototype.getLayerCount = function() {
	return this.getLayers().length;
};

LayerDrawable.prototype.indexOfLayer = function(layer) {
	return this.getLayers().indexOf(layer);
};

LayerDrawable.prototype.getLayerAt = function(index) {
	return this.getLayers()[index] || null;
};

LayerDrawable.prototype.addLayer = function(layer) {
	this.getLayers().push(layer);
	this.invalidate();
};

LayerDrawable.prototype.addLayers = function(layers) {
	if (!Array.isArray(layers)) layers = [layers];
	this.layers = this.getLayers().concat(layers);
	this.invalidate();
};

LayerDrawable.prototype.hasLayer = function(layer) {
	return this.getLayers().indexOf(layer) !== -1;
};

LayerDrawable.prototype.removeLayer = function(layer) {
	let layers = this.getLayers(),
		index = layers.indexOf(layer);
	if (index == -1) return;
	layers.splice(index, 1);
	this.invalidate();
};

LayerDrawable.prototype.toString = function() {
	return "[LayerDrawable " + this.getLayers() + "]";
};

LayerDrawable.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof LayerDrawable)) {
		json = instanceOrJson;
		instanceOrJson = new LayerDrawable();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("layers")) {
		let layers = calloutOrParse(json, json.layers, [this, instanceOrJson]);
		if (layers !== null && typeof layers == "object") {
			if (!Array.isArray(layers)) layers = [layers];
			for (let i = 0; i < layers.length; i++) {
				let layer = calloutOrParse(layers, layers[i], [this, json, instanceOrJson]);
				instanceOrJson.addLayer(Drawable.parseJson.call(this, layer));
			}
		}
	}
	return instanceOrJson;
};
