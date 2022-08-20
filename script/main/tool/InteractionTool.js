const InteractionTool = function(object) {
	Tool.apply(this, arguments);
};

InteractionTool.prototype = new Tool;

InteractionTool.prototype.reset = function() {
	Tool.prototype.reset.apply(this, arguments);
	this.interactionDescriptor = {};
};

InteractionTool.prototype.getInteractionWindows = function() {
	return this.interactionWindows || null;
};

InteractionTool.prototype.getInteractionDescriptor = function() {
	return this.interactionDescriptor || null;
};

InteractionTool.prototype.describeInteraction = function() {
	let interaction = this.getInteractionWindows();
	if (interaction == null) return;
	let descriptor = calloutOrParse(this, this.getInteractionDescriptor(), interaction);
	for (let i = 0; i < interaction.length; i++) {
		let uid = interaction[i] instanceof FocusablePopup ?
			interaction[i].getId() : interaction[i].TYPE;
		if (!descriptor.hasOwnProperty(uid)) {
			interaction[i].dismiss();
			interaction.splice(i, 1);
			if (interaction.length == 0) {
				delete this.interactionWindows;
			}
			i--;
			continue;
		}
		FocusablePopup.parseJson.call(this, interaction[i], descriptor[uid]);
	}
};

InteractionTool.prototype.describe = function() {
	Tool.prototype.describe.apply(this, arguments);
	this.describeInteraction();
};

InteractionTool.prototype.attachInteraction = function(id) {
	let interaction = this.getInteractionWindows();
	if (interaction == null) {
		interaction = this.interactionWindows = [];
	}
	let descriptor = calloutOrParse(this, this.getInteractionDescriptor(), interaction);
	for (let i = 0; i < interaction.length; i++) {
		let uid = interaction[i] instanceof FocusablePopup ?
			interaction[i].getId() : interaction[i].TYPE;
		if (uid == id) {
			WindowProxy.parseJson.call(this, interaction[i], descriptor[uid]);
			return;
		}
	}
	let instance = WindowProxy.parseJson.call(this, descriptor[id]);
	if (instance instanceof FocusablePopup) {
		instance.setId(id);
	} else if (instance instanceof UniqueWindow) {
		instance.TYPE = id;
	} else {
		if (interaction.length == 0) {
			delete this.interactionWindows;
		}
		MCSystem.throwException("ModdingTools: Interaction window must be instance of FocusablePopup or UniqueWindow");
	}
	instance.attach();
	interaction.push(instance);
};

InteractionTool.prototype.inInteraction = function(id) {
	let interaction = this.getInteractionWindows();
	if (interaction == null) return false;
	for (let i = 0; i < interaction.length; i++) {
		let uid = interaction[i] instanceof FocusablePopup ?
			interaction[i].getId() : interaction[i].TYPE;
		if (uid == id) return true;
	}
	return false;
};

InteractionTool.prototype.deattachInteraction = function(id) {
	let interaction = this.getInteractionWindows();
	if (interaction == null) return;
	for (let i = 0; i < interaction.length; i++) {
		let uid = interaction[i] instanceof FocusablePopup ?
			interaction[i].getId() : interaction[i].TYPE;
		if (uid == id) {
			interaction[i].dismiss();
			interaction.splice(i, 1);
			if (interaction.length == 0) {
				delete this.interactionWindows;
			}
			return;
		}
	}
};

InteractionTool.prototype.deattach = function() {
	let interaction = this.getInteractionWindows();
	if (interaction != null) {
		for (let i = 0; i < interaction.length; i++) {
			interaction[i].dismiss();
		}
		delete this.interactionWindows;
	}
	Tool.prototype.deattach.apply(this, arguments);
};

InteractionTool.prototype.interact = function(id) {
	if (this.inInteraction(id)) {
		this.deattachInteraction(id);
		return false;
	}
	this.attachInteraction(id);
	return true;
};

InteractionTool.prototype.hideInteraction = function() {
	let interaction = this.getInteractionWindows();
	if (interaction == null) return;
	for (let i = 0; i < interaction.length; i++) {
		interaction[i].dismiss();
	}
};

InteractionTool.prototype.showInteraction = function() {
	let interaction = this.getInteractionWindows();
	if (interaction == null) return;
	for (let i = 0; i < interaction.length; i++) {
		interaction[i].attach();
	}
};

InteractionTool.prototype.hide = function() {
	this.hideInteraction();
	Tool.prototype.hide.apply(this, arguments);
};

InteractionTool.prototype.collapse = function() {
	this.hideInteraction();
	Tool.prototype.collapse.apply(this, arguments);
};

InteractionTool.prototype.control = function() {
	Tool.prototype.control.apply(this, arguments);
	this.showInteraction();
};

InteractionTool.State = clone(Tool.State);
