class InteractionTool extends Tool {
	protected interactionDescriptor: CallableJsonProperty1<FocusablePopup[], (FocusablePopup | IFocusablePopup)[]>;
	protected interactionWindows: Nullable<FocusablePopup[]>;

	constructor(object?: Partial<InteractionTool>) {
		super(object);
	}
	override reset() {
		super.reset();
		this.interactionDescriptor = [];
	}
	getInteractionWindows() {
		return this.interactionWindows || null;
	}
	getInteractionDescriptor() {
		return this.interactionDescriptor || null;
	}
	describeInteraction() {
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
	}
	override describe() {
		super.describe();
		this.describeInteraction();
	}
	attachInteraction(id: string) {
		let interaction = this.getInteractionWindows();
		if (interaction == null) {
			interaction = this.interactionWindows = [];
		}
		let descriptor = calloutOrParse(this, this.getInteractionDescriptor(), interaction);
		if (descriptor == null) descriptor = {};
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
			MCSystem.throwException("Modding Tools: Interaction window must be instance of FocusablePopup or UniqueWindow");
		}
		instance.attach();
		interaction.push(instance);
	}
	inInteraction(id: string) {
		let interaction = this.getInteractionWindows();
		if (interaction == null) return false;
		for (let i = 0; i < interaction.length; i++) {
			let uid = interaction[i] instanceof FocusablePopup ?
				interaction[i].getId() : interaction[i].TYPE;
			if (uid == id) return true;
		}
		return false;
	}
	deattachInteraction(id: string) {
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
	}
	override deattach() {
		let interaction = this.getInteractionWindows();
		if (interaction != null) {
			for (let i = 0; i < interaction.length; i++) {
				interaction[i].dismiss();
			}
			delete this.interactionWindows;
		}
		Tool.prototype.deattach.apply(this, arguments);
	}
	interact(id: string) {
		if (this.inInteraction(id)) {
			this.deattachInteraction(id);
			return false;
		}
		this.attachInteraction(id);
		return true;
	}
	hideInteraction() {
		let interaction = this.getInteractionWindows();
		if (interaction == null) return;
		for (let i = 0; i < interaction.length; i++) {
			interaction[i].dismiss();
		}
	}
	showInteraction() {
		let interaction = this.getInteractionWindows();
		if (interaction == null) return;
		for (let i = 0; i < interaction.length; i++) {
			interaction[i].attach();
		}
	}
	override hide() {
		this.hideInteraction();
		super.hide();
	}
	override collapse() {
		this.hideInteraction();
		super.collapse();
	}
	override control() {
		super.control();
		this.showInteraction();
	}
}
