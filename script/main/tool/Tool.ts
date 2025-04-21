class Tool {
	protected state: number = Tool.State.INACTIVE;
	protected controlDescriptor: CallableJsonProperty1<ControlWindow, IControlWindow>;
	protected controlWindow: Nullable<ControlWindow>;

	constructor(object?: Partial<Tool>) {
		this.reset();
		if (object && typeof object == "object") {
			merge(this, object);
		}
	}
	reset() {
		const descriptor: IControlWindow<ThisType<this>> = {};
		descriptor.logotypeBackground = "popupControl";
		descriptor.buttonBackground = "popupButton";
		descriptor.logotypeProgress = (...args) => {
			return calloutOrParse(descriptor, descriptor.logotype, Array.prototype.slice.call(args));
		};
		descriptor.logotypeOutside = (...args) => {
			let drawable = calloutOrParse(descriptor, descriptor.logotypeProgress, Array.prototype.slice.call(args));
			return {
				bitmap: drawable,
				tint: ColorDrawable.parseColor("LTGRAY")
			};
		};
		descriptor.logotype = () => requireLogotype();
		descriptor.buttonClick = (...args) => {
			try {
				if (typeof this.onControlClick == "function") {
					this.onControlClick.apply(this, Array.prototype.slice.call(args, 1));
				}
			} catch (e) {
				reportError(e);
			}
		};
		descriptor.buttonHold = () => {
			try {
				this.collapse();
			} catch (e) {
				reportError(e);
			}
			return true;
		};
		descriptor.collapsedClick = () => {
			try {
				this.control();
			} catch (e) {
				reportError(e);
			}
		};
		descriptor.hideable = false;
		this.controlDescriptor = descriptor;
	}
	getState(): number {
		return this.state;
	}
	getControlWindow() {
		return this.controlWindow || null;
	}
	getControlDescriptor() {
		return this.controlDescriptor || null;
	}
	describeControl() {
		let control = this.getControlWindow();
		if (control == null) return;
		ControlWindow.parseJson.call(this, control, this.getControlDescriptor());
	}
	describe() {
		this.describeControl();
	}
	attach() {
		if (this.isAttached()) {
			MCSystem.throwException("Modding Tools: You are must deattach tool firstly!");
		}
		this.controlWindow = new ControlWindow();
		this.state = Tool.State.ATTACHED;
		this.describeControl();
	}
	onControlClick(control: ControlWindow) {
	}
	isAttached() {
		return this.state != Tool.State.INACTIVE;
	}
	deattach() {
		this.state = Tool.State.INACTIVE;
		let control = this.getControlWindow();
		if (control == null) return;
		control.dismiss();
		delete this.controlWindow;
	}
	hide() {
		this.state = Tool.State.ATTACHED;
		let control = this.getControlWindow();
		if (control == null) return;
		control.dismiss();
	}
	isVisible() {
		return this.isAttached() && this.state != Tool.State.ATTACHED;
	}
	control() {
		this.state = Tool.State.FACED;
		let control = this.getControlWindow();
		if (control == null) return;
		control.transformButton();
		control.attach();
		hideInsetsOnScreen();
	}
	isFaced() {
		return this.state == Tool.State.FACED;
	}
	collapse() {
		this.state = Tool.State.COLLAPSED;
		let control = this.getControlWindow();
		if (control == null) return;
		control.transformCollapsedButton();
		control.attach();
		hideInsetsOnScreen();
	}
	isCollapsed() {
		return this.state == Tool.State.COLLAPSED;
	}
	queue(what: any) {
		this.state = Tool.State.QUEUED;
		let control = this.getControlWindow();
		if (control == null) return;
		control.transformLogotype();
		control.attach();
	}
	sequence(sequence: Nullable<Sequence>) {
		if (sequence instanceof Sequence) {
			if (sequence.getThread() == null) {
				if (sequence instanceof ControlSequence) {
					sequence.execute(this, this.getControlWindow());
				} else {
					sequence.execute(this);
				}
			}
			if (!sequence.assureYield()) {
				MCSystem.throwException("Modding Tools: Tool sequence is cancelled, interrupted or not completed successfully!");
			}
		}
	}
	isQueued() {
		return this.state == Tool.State.QUEUED;
	}
	unqueue() {
		this.control();
	}
}

namespace Tool {
	export const State = {
		INACTIVE: 0,
		ATTACHED: 1,
		FACED: 2,
		COLLAPSED: 3,
		QUEUED: 4
	};
}
