const TutorialSequence = function(obj) {
	Sequence.apply(this, arguments);
};

TutorialSequence.prototype = new Sequence;

TutorialSequence.prototype.create = function() {
	let snack = new HintAlert();
	snack.setStackable(true);
	snack.setConsoleMode(true);
	snack.setMaximumStacked(5);
	snack.setTime(1750);
	this.hint = snack;
};

TutorialSequence.prototype.requiresUserInteraction = function() {
	return this.interaction === true;
};

TutorialSequence.prototype.next = function(value, index) {
	if (this.requiresUserInteraction()) {
		return 0;
	}
	let label = this.goto;
	if (label !== undefined) {
		delete this.goto;
		return label;
	}
	if (this.interaction === false) {
		delete this.interaction;
	}	
	return Sequence.prototype.next.apply(this, arguments);
};

TutorialSequence.prototype.process = function(index) {
	if (index == 0) {
		java.lang.Thread.sleep(1);
	}
	return index;
};

TutorialSequence.prototype.unpinAndClear = function() {
	this.hint.unpin();
	while (this.hint.getStackedCount() > 0) {
		this.hint.removeFirstStacked();
	}
	this.hint.clearStack();
};

TutorialSequence.prototype.requireInteract = function() {
	if (this.interaction === false) {
		delete this.interaction;
		return false;
	}
	this.interaction = true;
	this.hint.pin();
	return true;
};

TutorialSequence.prototype.touchCorrectly = function() {
	this.interaction = false;
	this.unpinAndClear();
	if (random(0, 1) == 0) {
		this.hint.addMessage(translate("Perfectly!"));
	} else this.hint.addMessage(translate("Well done!"));
	this.hint.show();
};

TutorialSequence.prototype.tounchIncorrecrly = function() {
	let index = this.hint.getStackedCount() - 1;
	if (index < 0) this.hint.addMessage(translate("Nope"));
	else this.hint.flashHint(index, $.Color.YELLOW);
};

TutorialSequence.prototype.complete = function() {
	this.hint.hide();
	this.unpinAndClear();
	delete this.hint;
	if (!this.isOneRequired()) {
		if (this.hasNextSequence()) {
			this.getNextSequence().execute();
		}
	}
};

TutorialSequence.prototype.isOneRequired = function() {
	return this.hieracly === true;
};

TutorialSequence.prototype.setIsOneRequired = function(one) {
	if (one === true) this.hieracly = true;
	else delete this.hieracly;
};

TutorialSequence.prototype.hasNextSequence = function() {
	let next = this.getNextSequence;
	if (next === undefined) return false;
	return next() !== undefined;
};

TutorialSequence.Welcome = new TutorialSequence({
	count: 2,
	update: function(progress, index) {
		if (index == 1) {
			this.hint.addMessage(translate("Howdy and welcome to Dev Editor!"));
			this.hint.addMessage(translate("Tool from developers to developers."));
			this.hint.addMessage(translate("Let's see, what's we're prepared here."));
			this.hint.show();
		}
	},
	process: function(index) {
		if (index == 1) {
			java.lang.Thread.sleep(500);
		} else if (index == 2) {
			java.lang.Thread.sleep(this.hint.getTime() * 3);
		}
		return TutorialSequence.prototype.process.apply(this, arguments);
	},
	getNextSequence: function() {
		return TutorialSequence.ButtonInteraction;
	}
});

TutorialSequence.ButtonInteraction = new TutorialSequence({
	count: 5,
	update: function(progress, index) {
		let sequence = this;
		if (index == 1) {
			let control = new ControlWindow();
			control.setHideableInside(false);
			control.setButtonImage("menu");
			control.transformButton();
			control.show();
			this.currently = control;
		} else if (index == 2) {
			this.hint.addMessage(translate("That button is key to start process."));
			this.hint.addMessage(translate("It's contains many tools inside."));
			if (!this.isOneRequired()) {
				this.hint.addMessage(translate("Let's click it and look to abilities."));
			} else this.hint.addMessage(translate("You must click it to open control menu."));
			this.hint.show();
		} else if (index == 3) {
			this.currently.setOnButtonClickListener(function() {
				sequence.touchCorrectly();
			});
		} else if (index == 4) {
			this.requireInteract();
		}
	},
	process: function(index) {
		if (index == 1) {
			java.lang.Thread.sleep(500);
		} else if (index == 2) {
			java.lang.Thread.sleep(1000);
		} else if (index == 3) {
			java.lang.Thread.sleep(this.hint.getTime() * 2.5);
		} else if (index == 4) {
			java.lang.Thread.sleep(this.hint.getTime() * 1.5);
		} else if (index == 5) {
			java.lang.Thread.sleep(this.hint.getTime());
		}
		return TutorialSequence.prototype.process.apply(this, arguments);
	},
	touchCorrectly: function() {
		this.goto = 5;
		if (this.currently !== undefined) {
			this.currently.hide();
			delete this.currently;
		}
		TutorialSequence.prototype.touchCorrectly.apply(this, arguments);
	},
	getNextSequence: function() {
		return TutorialSequence.ControlMeeting;
	}
});

TutorialSequence.ControlMeeting = new TutorialSequence({
	count: 7,
	update: function(progress, index) {
		let sequence = this;
		if (index == 1) {
			let control = new MenuWindow();
			control.setTouchable(false);
			this.header = control.addHeader();
			category = control.addCategory(translate("Project"));
			category.addItem("menuProjectLoad", translate("Open"));
			category.addItem("menuProjectImport", translate("Import"));
			category.addItem("menuProjectSave", translate("Export"));
			category.addItem("menuProjectManual", translate("Tutorial"));
			category.addItem("menuProjectManage", translate("Manage"));
			control.show();
			this.currently = control;
		} else if (index == 2) {
			this.hint.addMessage(translate("That's menu created to control content."));
			this.hint.addMessage(translate("Your spot between code and interface."));
			this.hint.addMessage(translate("Editors section exists for adding workers."));
			this.hint.addMessage(translate("You may create, remove, load and export them."));
			this.hint.addMessage(translate("Horewer, it's not all exiting abilities."));
			this.hint.addMessage(translate("Dev Editor handles content inside projects."));
			this.hint.addMessage(translate("Project filled with created editors."));
			if (!this.isOneRequired()) {
				this.hint.addMessage(translate("And editor is adding by us for this time."));
				this.hint.addMessage(translate("But that's ability beholds to you."));
			} else this.hint.addMessage(translate("And editor may be added by your wish."));
			this.hint.show();
		} else if (index == 3) {
			this.currently.scrollToElement(this.header, this.hint.getTime() / 4);
		} else if (index == 4) {
			this.currently.scrollDown(this.hint.getTime() * 2);
		} else if (index == 5) {
			this.currently.scrollTo(0, this.hint.getTime() / 2);
		}
	},
	process: function(index) {
		if (index == 1) {
			java.lang.Thread.sleep(500);
		} else if (index == 2) {
			java.lang.Thread.sleep(1000);
		} else if (index == 3) {
			java.lang.Thread.sleep(this.hint.getTime() * 2);
		} else if (index == 4) {
			java.lang.Thread.sleep(this.hint.getTime() * 2.5);
		} else if (index == 5) {
			java.lang.Thread.sleep(this.hint.getTime() * 2.5);
			if (this.isOneRequired()) {
				this.goto = 7;
			}
		} else if (index == 6) {
			java.lang.Thread.sleep(this.hint.getTime());
		} else if (index == 7) {
			java.lang.Thread.sleep(this.hint.getTime());
		}
		return TutorialSequence.prototype.process.apply(this, arguments);
	},
	complete: function() {
		if (this.currently !== undefined) {
			this.currently.hide();
			delete this.currently;
			delete this.header;
		}
		TutorialSequence.prototype.complete.apply(this, arguments);
	},
	getNextSequence: function() {
		return TutorialSequence.SidebarInteraction;
	}
});

TutorialSequence.SidebarInteraction = new TutorialSequence({
	count: 13,
	update: function(progress, index) {
		let sequence = this;
		if (index == 1) {
			let sidebar = new SidebarWindow();
			sidebar.show();
			this.currently = sidebar;
		} else if (index == 2) {
			this.hint.addMessage(translate("Well, with button we're have there sidebar."));
			this.hint.addMessage(translate("Currently it collapsed, so we're must open it."));
			this.hint.addMessage(translate("Sidebar designed to pleasant working with environment."));
			this.hint.addMessage(translate("We're mean, most of editors handles in-world."));
			this.hint.addMessage(translate("So, that menu requires smallest space on screen."));
			this.hint.addMessage(translate("This fact gives your ability to interact with world."));
			this.hint.addMessage(translate("Currently selected tab is main for most editors."));
			this.hint.addMessage(translate("There's collected identifiers, variations, etc."));
			this.hint.addMessage(translate("It will be helpful to add define information."));
			this.hint.addMessage(translate("Let's change sidebar tab to second."));
			this.hint.show();
		// Hold tutorial starts here.
		} else if (index == 8) {
			this.hint.addMessage(translate("You may have a logical question:"));
			this.hint.addMessage(translate("how to recognize what hides behind every icon?"));
			this.hint.addMessage(translate("Every sidebar filled with holdable elements."));
			this.hint.addMessage(translate("Let's try hold any element right now."));
			this.hint.show();
		} else if (index == 9) {
			this.currently.setOnGroupFetchListener(function() {
				sequence.touchCorrectly(2);
			});
			this.currently.setOnItemFetchListener(function() {
				sequence.touchCorrectly(3);
			});
		} else if (index == 10) {
			this.interaction = true;
			this.hint.pin();
		} else if (index == 11) {
			this.hint.addMessage(translate("Every element may be holded too."));
			this.goto = 13;
		} else if (index == 12) {
			this.hint.addMessage(translate("Every tab may be holded too."));
		} else if (index == 13) {
			this.unpinAndClear();
		}
		if (index == 11 || index == 12) {
			this.hint.addMessage(translate("You may checkout that self later inside editors."));
			this.hint.addMessage(translate("So, there's must be element description."));
			this.hint.addMessage(translate("But we're just learning and there's nothing."));
			this.hint.show();
		}
	},
	process: function(index) {
		if (index == 1) {
			java.lang.Thread.sleep(500);
		} else if (index == 2) {
			java.lang.Thread.sleep(1000);
		} else if (index == 3) {
			java.lang.Thread.sleep(this.hint.getTime() * 2.5);
		} else if (index == 4) {
			java.lang.Thread.sleep(this.hint.getTime() * 2);
		} else if (index == 5) {
			java.lang.Thread.sleep(this.hint.getTime() * 3.5);
		} else if (index == 6) {
			java.lang.Thread.sleep(this.hint.getTime() * 1.5);
		} else if (index == 7) {
			java.lang.Thread.sleep(this.hint.getTime());
		} else if (index == 8) {
			java.lang.Thread.sleep(this.hint.getTime() * 4);
		} else if (index == 9) {
			java.lang.Thread.sleep(this.hint.getTime() * 2.5);
		} else if (index == 11 || index == 12) {
			java.lang.Thread.sleep(this.hint.getTime() * 2);
		}
		return TutorialSequence.prototype.process.apply(this, arguments);
	},
	touchCorrectly: function(process) {
		if (process == 1) {
			this.goto = 9;
		} else if (process == 2 || process == 3) {
			this.goto = 11 + Number(process == 3);
			this.currently.setOnGroupFetchListener(null);
			this.currently.setOnItemFetchListener(null);
		}
		TutorialSequence.prototype.touchCorrectly.apply(this, arguments);
	},
	complete: function() {
		if (this.currently !== undefined) {
			this.currently.hide();
			delete this.currently;
		}
		TutorialSequence.prototype.complete.apply(this, arguments);
	},
	getNextSequence: function() {
		return TutorialSequence.PopupInteraction;
	}
});

TutorialSequence.PopupInteraction = new TutorialSequence({
	getNextSequence: function() {
		return TutorialSequence.ProjectMeeting;
	}
});

TutorialSequence.ProjectMeeting = new TutorialSequence({
	getNextSequence: function() {
		return TutorialSequence.ControlInteraction;
	}
});

TutorialSequence.ControlInteraction = new TutorialSequence({
	getNextSequence: function() {
		return TutorialSequence.ExplorerInteraction;
	}
});

TutorialSequence.ExplorerInteraction = new TutorialSequence({
	getNextSequence: function() {
		return TutorialSequence.Complete;
	}
});

TutorialSequence.Complete = new TutorialSequence({
	count: 2,
	update: function(progress, index) {
		if (index == 1) {
			LaunchSequence.create();
		}
	},
	process: function(index) {
		if (index == 1) {
			java.lang.Thread.sleep(500);
		} else if (index == 2) {
			java.lang.Thread.sleep(this.hint.getTime());
		}
		return TutorialSequence.prototype.process.apply(this, arguments);
	},
	complete: function() {
		LaunchSequence.complete();
		TutorialSequence.prototype.complete.apply(this, arguments);
	}
});
