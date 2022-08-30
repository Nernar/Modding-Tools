const Tool = function(object) {
	this.reset();
	if (typeof object == "object") {
		object && merge(this, object);
	}
};

Tool.prototype.reset = function() {
	let descriptor = {};
	descriptor.logotypeBackground = "popupControl";
	descriptor.buttonBackground = "popupButton";
	descriptor.logotypeProgress = function(tool, control) {
		return calloutOrParse(this, this.logotype, Array.prototype.slice.call(arguments));
	};
	descriptor.logotypeOutside = function(tool, control) {
		let drawable = calloutOrParse(this, this.logotypeProgress, Array.prototype.slice.call(arguments));
		return {
			bitmap: drawable,
			tint: $.Color.LTGRAY
		};
	};
	descriptor.logotype = function(tool, control) {
		return requireLogotype();
	};
	descriptor.buttonClick = function(tool, control) {
		try {
			if (typeof tool.onControlClick == "function") {
				let args = Array.prototype.slice.call(arguments, 1);
				tool.onControlClick.apply(tool, args);
			}
		} catch (e) {
			reportError(e);
		}
	};
	descriptor.buttonHold = function(tool, control) {
		try {
			tool.collapse();
		} catch (e) {
			reportError(e);
		}
		return true;
	};
	descriptor.collapsedClick = function(tool, control) {
		try {
			tool.control();
		} catch (e) {
			reportError(e);
		}
	};
	descriptor.hideable = false;
	this.controlDescriptor = descriptor;
};

Tool.prototype.getState = function() {
	return this.state;
};

Tool.prototype.getControlWindow = function() {
	return this.controlWindow || null;
};

Tool.prototype.getControlDescriptor = function() {
	return this.controlDescriptor || null;
};

Tool.prototype.describeControl = function() {
	let control = this.getControlWindow();
	if (control == null) return;
	ControlWindow.parseJson.call(this, control, this.getControlDescriptor());
};

Tool.prototype.describe = function() {
	this.describeControl();
};

Tool.prototype.attach = function() {
	if (this.isAttached()) {
		MCSystem.throwException("ModdingTools: You're must deattach tool firstly!");
	}
	this.controlWindow = new ControlWindow();
	this.state = Tool.State.ATTACHED;
	this.describeControl();
};

Tool.prototype.isAttached = function() {
	return this.state != Tool.State.INACTIVE;
};

Tool.prototype.deattach = function() {
	let control = this.getControlWindow();
	if (control == null) return;
	this.state = Tool.State.INACTIVE;
	control.dismiss();
	delete this.controlWindow;
};

Tool.prototype.hide = function() {
	let control = this.getControlWindow();
	if (control == null) return;
	this.state = Tool.State.ATTACHED;
	control.dismiss();
};

Tool.prototype.isVisible = function() {
	return this.isAttached() && this.state != Tool.State.ATTACHED;
};

Tool.prototype.control = function() {
	let control = this.getControlWindow();
	if (control == null) return;
	this.state = Tool.State.FACED;
	control.transformButton();
	control.attach();
};

Tool.prototype.isFaced = function() {
	return this.state == Tool.State.FACED;
};

Tool.prototype.collapse = function() {
	let control = this.getControlWindow();
	if (control == null) return;
	this.state = Tool.State.COLLAPSED;
	control.transformCollapsedButton();
	control.attach();
};

Tool.prototype.isCollapsed = function() {
	return this.state == Tool.State.COLLAPSED;
};

Tool.prototype.queue = function(what) {
	let control = this.getControlWindow();
	if (control == null) return;
	this.state = Tool.State.QUEUED;
	control.transformLogotype();
	control.attach();
};

Tool.prototype.sequence = function(sequence) {
	if (sequence instanceof Sequence) {
		sequence.assureYield();
	}
};

Tool.prototype.isQueued = function() {
	return this.state == Tool.State.QUEUED;
};

Tool.prototype.unqueue = function() {
	this.control();
};

Tool.State = {};
Tool.State.INACTIVE = 0;
Tool.State.ATTACHED = 1;
Tool.State.FACED = 2;
Tool.State.COLLAPSED = 3;
Tool.State.QUEUED = 4;

Tool.prototype.state = Tool.State.INACTIVE;
