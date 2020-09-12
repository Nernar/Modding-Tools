function playTransition(worker, frame) {
	try {
		if (Transition.isTransitioning()) {
			showHint(translate("Transition are already transitioning"), Ui.Color.YELLOW);
			return false;
		}
		if (TransitionEditor.data.transition) let transition = TransitionEditor.data.transition;
		else let transition = TransitionEditor.data.transition = new Transition();
		transition.withEntity(worker.Define.getEntity() || getPlayerEnt());
		transition.setFramesPerSecond(worker.Define.getFps() || 60);
		transition.getFrameCount() > 0 && transition.clearFrames();
		if (typeof frame == "undefined") {
			let point = worker.Define.getStarting();
			transition.withFrom(point.x, point.y, point.z, point.yaw, point.pitch);
			transition.withFrames(worker.Animation.getAnimate(0).asArray());
		} else {
			let real = worker.Animation.getAnimate(0).getFrameCoords(frame - 1);
			transition.withFrom(real.x, real.y, real.z, real.yaw, real.pitch);
			let frame = worker.Animation.getAnimate(0).getFrame(frame);
			transition.addFrame(frame.x, frame.y, frame.z,
				frame.yaw, frame.pitch, frame.duration, frame.interpolator);
		}
		transition.withOnFinishListener(function() {
			handle(function() {
				TransitionEditor.create();
			});
		});
		transition.start();
		return true;
	} catch(e) {
		reportError(e);
	}
	return false;
}

function stopTransition(worker) {
	try {
		if (!Transition.isTransitioning()) {
			showHint(translate("Transition are already stopped"), Ui.Color.YELLOW);
			return false;
		}
		if (!TransitionEditor.data.transition) {
			showHint(translate("Transition isn't setted up"), Ui.Color.YELLOW);
			return false;
		}
		TransitionEditor.data.transition.stop();
		return true;
	} catch(e) {
		reportError(e);
	}
	return false;
}

function sceneToScript(project) {
	let frames = project.frames,
		point = project.point;
	
	let result = "let transition = new Transition();";
	if (project.fps && project.fps != 60) {
		result += "\n";
		result += "transition.setFramesPerSecond(" + project.fps + ");";
	}
	if (project.entity != getPlayerEnt()) {
		result += "\n";
		result += "transition.withEntity(" + project.entity + ");";
	}
	result += "\n";
	result += "transition.withFrom(" + point[0] + ", " + point[1] + ", " + point[2] + ", " + point[3] + ", " + point[4] + ");";
	if (frames.length > 0) {
		result += "\n";
		for (let i in frames) {
			let frame = frames[i];
			result += "\n";
			result += "transition.addFrame(" + frame[0] + ", " + frame[1] + ", " + frame[2] + ", " + frame[3] + ", " + frame[4] + ", " + frame[5];
			if (frame.length > 6) result += ", Transition.Interpolator." + (frame[6] == 1 ? "ACCELERATE" : frame[6] == 2 ? "DECELERATE" : frame[6] == 3 ? "ACCELERATE_DECELERATE" : "LINEAR");
			result += ");";
		}
	}
	result += "\n\n";
	result += "Callback.addCallback(\"LevelLoaded\", function() {";
	if (project.entity == getPlayerEnt()) {
		result += "\n\t";
		result += "transition.withEntity(Player.get());";
	}
	result += "\n\t";
	result += "transition.start();";
	result += "\n";
	result += "});";
	
	return result;
}

function drawTransitionPoints(worker) {
	try {
		if (!Level.isLoaded()) return false;
		// TODO: Add spawn particles
		// if (selectMode == 4)
		// return true;
	} catch(e) {
		reportError(e);
	}
	return false;
}

let TransitionEditor = {
	data: new Object(),
	reset: function() {
		this.data.worker = ProjectEditor.addTransition();
		ProjectEditor.setOpenedState(true);
		this.data.worker.Animation.createAnimate();
		this.unselect();
	},
	unselect: function() {
		this.data.frame = -1;
		Popups.closeIfOpened("frame_select");
		delete this.data.selected;
	},
	create: function() {
		let autosaveable = !ProjectEditor.isOpened();
		if (!this.data.worker) this.reset();
		autosaveable && ProjectEditor.initializeAutosave(this.data.worker);
		this.data.hasAnimate = this.data.worker.Animation.getAnimateCount() > 0
			&& this.data.worker.Animation.getAnimate(0).getFrameCount() > 0;
		this.data.isStarted = !!Transition.currently;
		drawTransitionPoints(this.data.worker);
		
		let button = new ControlButton();
		button.setIcon("menu");
		button.setOnClickListener(function() {
			TransitionEditor.menu();
			menu.dismiss();
		});
		button.show();
		
		let menu = new MenuWindow();
		let group = menu.addGroup("transition");
		if (this.data.hasAnimate)
			group.addItem(this.data.isStarted ? "transitionModulePreview" : "transitionModulePause", this.Transition.play);
		group.addItem("transitionModuleMove", this.Transition.move);
		group.addItem("transitionModuleRotate", this.Transition.rotate);
		group.addItem("transitionModuleFps", this.reframe);
		group.addItem("transitionModuleReload", this.reload);
		group = menu.addGroup("transitionFrameFrames");
		if (this.data.hasAnimate) {
			group.addItem("transitionFrameFrames", this.Frame.select);
			group.addItem("transitionFrameAdd", this.Frame.add);
			group.addItem(this.data.isStarted ? "transitionFramePreview" : "transitionFramePause", this.Frame.play);
			group.addItem("transitionFrameMove", this.Frame.move);
			group.addItem("transitionFrameRotate", this.Frame.rotate);
			group.addItem("transitionFrameDuration", this.Frame.durate);
			group.addItem("transitionFrameInterpolator", this.Frame.interpolator);
			group.addItem("transitionFrameRemove", this.Frame.remove);
		} else group.addItem("transitionFrameAdd", this.Frame.add);
		this.data.selected >= 0 && menu.selectGroup(this.data.selected);
		menu.setOnSelectListener(function(group, index, selected, count) {
			if (selected) (drawTransitionPoints(TransitionEditor.data.worker),
				TransitionEditor.data.selected = index);
			else {
				delete TransitionEditor.data.selected;
				selectMode = 0, drawTransitionPoints(TransitionEditor.data.worker);
			}
		});
		menu.show();
	},
	menu: function(view) {
		let control = new ControlWindow();
		control.setOnClickListener(function() {
			TransitionEditor.create();
		}).addHeader();
		let category = control.addCategory(translate("Editor"));
		category.addItem("menuProjectLoad", translate("Open"), function() {
			selectFile([".dnp", ".nds", ".js"], function(file) {
				TransitionEditor.replace(file);
			});
		});
		category.addItem("menuProjectImport", translate("Import"), function() {
			selectFile([".dnp", ".nds", ".js"], function(file) {
				TransitionEditor.add(file);
			});
		});
		category.addItem("menuProjectSave", translate("Export"), function() {
			saveFile(TransitionEditor.data.name, [".dnp", ".js"], function(file, i) {
				TransitionEditor.save(file, i);
			});
		});
		category.addItem("menuProjectLeave", translate("Back"), function() {
			control.dismiss();
			Popups.closeAll(), TransitionEditor.unselect();
			ProjectEditor.setOpenedState(false);
			ProjectEditor.getProject().callAutosave();
			delete TransitionEditor.data.worker;
			StartEditor.menu();
		});
		checkForAdditionalInformation(control);
		category = control.addCategory(translate("Transition"));
		category.addItem("entityModuleSelect", translate("Entity"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't hit entity at menu"));
				return;
			}
			showHint(translate("Hit entity"));
			control.dismiss();
			selectMode = 2;
			
			let button = new ControlButton();
			button.setIcon("menuModuleBack");
			button.setOnClickListener(function() {
				TransitionEditor.create();
				selectMode = 0;
			});
			button.show();
		});
		category.addItem("transitionModuleReload", translate("Reload"), function() {
			selectMode = 0;
			if (drawTransitionPoints(TransitionEditor.data.worker))
				showHint(translate("Transition updated"));
			else showHint(translate("Nothing to update"));
		});
		if (TransitionEditor.data.worker.Define.getEntity() != getPlayerEnt()) {
			let hasResetMessage = false;
			category.addItem("menuConfigReset", translate("Player"), function() {
				if (!hasResetMessage) {
					let message = control.addMessage("menuModuleWarning", translate("Current entity will be lost.") + " " + translate("Touch here to confirm."),
						function() {
							TransitionEditor.data.worker.Define.setEntity(getPlayerEnt());
							control.removeElement(message), TransitionEditor.create();
						});
					handle(function() {
						control.scrollToElement(message);
					}, 500);
					handle(function() {
						control.removeElement(message);
						hasResetMessage = false;
					}, 5000);
					hasResetMessage = true;
				}
			});
		}
		resetAdditionalInformation();
		control.show();
	},
	open: function(index) {
		let obj = ProjectEditor.getEditorById(index);
		if (!obj) {
			showHint(translate("Can't find opened editor at %s position", index));
			return false;
		}
		let worker = this.data.worker = new TransitionWorker(obj);
		ProjectEditor.setupEditor(index, worker);
		ProjectEditor.setOpenedState(true);
		TransitionEditor.unselect(), TransitionEditor.create();
		return true;
	},
	add: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				handle(function() {
					active = Date.now() - active;
					selectProjectData(result, function(selected) {
						active = Date.now() - active;
						let current = TransitionEditor.data.worker.getProject();
						selected.forEach(function(element, index) {
							current = assign(current, element);
						});
						TransitionEditor.data.worker.loadProject(current);
						drawTransitionPoints(TransitionEditor.data.worker);
						showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
					});
				});
			});
		} else if (name.endsWith(".nds")) {
			let active = Date.now();
			handle(function() {
				let current = TransitionEditor.data.worker.getProject(),
					obj = compileData(Files.read(file)),
					result = convertNds(obj),
					assigned = assign(current, result);
				TransitionEditor.data.worker.loadProject(assigned);
				drawTransitionPoints(TransitionEditor.data.worker);
				showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
			});
		}
	},
	replace: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				handle(function() {
					active = Date.now() - active;
					selectProjectData(result, function(selected) {
						active = Date.now() - active;
						TransitionEditor.data.worker.loadProject(selected);
						drawTransitionPoints(TransitionEditor.data.worker);
						showHint(translate("Loaded success") + " " + translate("as %s ms", Date.now() - active));
					}, true);
				});
			});
		} else if (name.endsWith(".nds")) {
			let active = Date.now();
			handle(function() {
				let current = TransitionEditor.data.worker.getProject(),
					obj = compileData(Files.read(file)),
					result = convertNds(obj);
				TransitionEditor.data.worker.loadProject(result);
				drawTransitionPoints(TransitionEditor.data.worker);
				showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
			});
		}
		Popups.closeAll();
		TransitionEditor.unselect();
	},
	save: function(file, i) {
		let name = (TransitionEditor.data.name = i, file.getName()),
			project = TransitionEditor.data.worker.getProject();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		}
	},
	reload: function(view) {
		if (drawTransitionPoints(TransitionEditor.data.worker))
			showHint(translate("Transition updated"));
		else showHint(translate("Nothing to update"));
	},
	Transition: {
		play: function(view) {
			if (!Level.isLoaded()) {
				showHint(translate("Can't play transitions at menu"));
				return;
			}
			let transition = TransitionEditor.data.transition;
			if (transition && transition.isStarted()) {
				if (stopTransition(TransitionEditor.data.worker))
					showHint(translate("Transition stopped"));
			} else playTransition(TransitionEditor.data.worker),
				TransitionEditor.create();
		},
		move: function(view) {
			let point = TransitionEditor.data.worker.Define.getStarting();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			popup.setBaseMathes([1, 10, 100]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Define.moveStarting("x", value);
			});
			group.setOnLongChangeListener(function(index) {
				return preround(Entity.getX(getPlayerEnt()), 1);
			});
			group.addItem(point.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Define.moveStarting("y", value);
			});
			group.setOnLongChangeListener(function(index) {
				return preround(Entity.getY(getPlayerEnt()), 1);
			});
			group.addItem(point.y);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Define.moveStarting("z", value);
			});
			group.setOnLongChangeListener(function(index) {
				return preround(Entity.getZ(getPlayerEnt()), 1);
			});
			group.addItem(point.z);
			popup.addButtonElement(translate("Current all"), function() {
				popup.callLongChangeForAll();
			});
			Popups.open(popup, "transition_move");
		},
		rotate: function(view) {
			let point = TransitionEditor.data.worker.Define.getStarting();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Rotate"));
			popup.setBaseMathes([10, 100]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Define.moveStarting("yaw", value);
			});
			group.setOnLongChangeListener(function(index) {
				return preround(Entity.getYaw(getPlayerEnt()), 2);
			});
			group.addItem(point.yaw);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Define.moveStarting("pitch", value);
			});
			group.setOnLongChangeListener(function(index) {
				return preround(Entity.getPitch(getPlayerEnt()), 2);
			});
			group.addItem(point.pitch);
			popup.addButtonElement(translate("Current all"), function() {
				popup.callLongChangeForAll();
			});
			Popups.open(popup, "transition_rotate");
		}
	},
	Frame: {
		hasSelection: function() {
			return TransitionEditor.data.frame >= 0;
		},
		select: function(view) {
			let popup = new ListingPopup();
			popup.setTitle(translate("Frames"));
			popup.setOnHideListener(function() {
				selectMode = 0;
				drawTransitionPoints(TransitionEditor.data.worker);
			});
			popup.setOnSelectListener(function(index) {
				selectMode = 4;
				TransitionEditor.data.frame = index;
				drawTransitionPoints(TransitionEditor.data.worker);
			});
			for (let i = 0; i < TransitionEditor.data.worker.Animation.getAnimate(0).getFrameCount(); i++) {
				popup.addButtonElement(translate("Frame %s", i + 1));
			}
			popup.selectButton(TransitionEditor.data.frame);
			popup.setSelectMode(true);
			Popups.open(popup, "frame_select");
		},
		add: function(view) {
			if (TransitionEditor.data.hasAnimate) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function (index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function () {
					let index = (TransitionEditor.data.frame = TransitionEditor.data.worker.Animation.getAnimate(0).addFrame());
					showHint(translate("Frame %s added", index + 1));
					drawTransitionPoints(TransitionEditor.data.worker);
				});
				popup.addButtonElement(translate("Currently"), function () {
					let index = (TransitionEditor.data.frame = TransitionEditor.data.worker.Animation.getAnimate(0).addFrame());
					TransitionEditor.data.worker.Animation.getAnimate(0).setupFrame(index);
					showHint(translate("Frame %s added as currently", index + 1));
					drawTransitionPoints(TransitionEditor.data.worker);
				});
				popup.addButtonElement(translate("Copy current"), function () {
					let last = TransitionEditor.data.frame, index = (TransitionEditor.data.frame = TransitionEditor.data.worker.Animation.getAnimate(0).cloneFrame(last));
					showHint(translate("Frame %s cloned to %s", [last + 1, index + 1]));
					drawTransitionPoints(TransitionEditor.data.worker);
				});
				Popups.open(popup, "frame_add");
			} else {
				TransitionEditor.data.frame = TransitionEditor.data.worker.Animation.getAnimate(0).addFrame();
				TransitionEditor.create();
				showHint(translate("First frame added"));
				drawTransitionPoints(TransitionEditor.data.worker);
			}
		},
		play: function(view) {
			if (!Level.isLoaded()) {
				showHint(translate("Can't play transitions at menu"));
				return;
			}
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let transition = TransitionEditor.data.transition,
				selected = TransitionEditor.data.frame;
			if (transition && transition.isStarted()) {
				if (stopTransition(TransitionEditor.data.worker))
					showHint(translate("Transition stopped"));
			} else playTransition(TransitionEditor.data.worker, selected),
				TransitionEditor.create();
		},
		move: function(view) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = TransitionEditor.data.frame,
				frame = TransitionEditor.data.worker.Animation.getAnimate(0).getFrame(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			popup.setBaseMathes([1, 10, 100]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Animation.getAnimate(0).moveFrame(selected, "x", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = TransitionEditor.data.worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getX(getPlayerEnt()) - real.x, 1);
			});
			group.addItem(frame.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Animation.getAnimate(0).moveFrame(selected, "y", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = TransitionEditor.data.worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getY(getPlayerEnt()) - real.y, 1);
			});
			group.addItem(frame.y);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Animation.getAnimate(0).moveFrame(selected, "z", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = TransitionEditor.data.worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getZ(getPlayerEnt()) - real.z, 1);
			});
			group.addItem(frame.z);
			popup.addButtonElement(translate("Current all"), function() {
				popup.callLongChangeForAll();
			});
			Popups.open(popup, "frame_move");
		},
		rotate: function(view) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = TransitionEditor.data.frame,
				frame = TransitionEditor.data.worker.Animation.getAnimate(0).getFrame(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Rotate"));
			popup.setBaseMathes([10, 100]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Animation.getAnimate(0).moveFrame(selected, "yaw", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = TransitionEditor.data.worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getYaw(getPlayerEnt()) - real.yaw, 2);
			});
			group.addItem(frame.yaw);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Animation.getAnimate(0).moveFrame(selected, "pitch", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = TransitionEditor.data.worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getPitch(getPlayerEnt()) - real.pitch, 2);
			});
			group.addItem(frame.pitch);
			popup.addButtonElement(translate("Current all"), function() {
				popup.callLongChangeForAll();
			});
			Popups.open(popup, "frame_rotate");
		},
		durate: function(view) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = TransitionEditor.data.frame,
				frame = TransitionEditor.data.worker.Animation.getAnimate(0).getFrame(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Duration"));
			popup.setBaseMathes([1, 10, 100]);
			let group = popup.addGroup();
			group.setOnChangeListener(function(index, value) {
				TransitionEditor.data.worker.Animation.getAnimate(0).durateFrame(selected, value);
			});
			group.addItem(frame.duration);
			group.removeName();
			Popups.open(popup, "frame_durate");
		},
		interpolator: function(view) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = TransitionEditor.data.frame,
				frame = TransitionEditor.data.worker.Animation.getAnimate(0).getFrame(selected);
			let popup = new ListingPopup();
			popup.setSelectMode(true);
			popup.setTitle(translate("Interpolator"));
			popup.addButtonElement(translate("Linear"));
			popup.addButtonElement(translate("Accelerate"));
			popup.addButtonElement(translate("Decelerate"));
			popup.addButtonElement(translate("Ac-Decelerate"));
			popup.selectButton(frame.interpolator || 0);
			popup.setOnSelectListener(function(index) {
				if (index == 0) {
					TransitionEditor.data.worker.Animation.getAnimate(0).resetInterpolation(selected);
					showHint(translate("Interpolator disabled"));
				} else {
					TransitionEditor.data.worker.Animation.getAnimate(0).interpolateFrame(selected, index);
					showHint(translate("Interpolator setted"));
				}
			});
			Popups.open(popup, "frame_interpolator");
		},
		remove: function() {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this frame?"),
				function() {
					TransitionEditor.data.worker.Animation.getAnimate(0).removeFrame(TransitionEditor.data.frame);
					TransitionEditor.data.frame = TransitionEditor.data.frame > 0 ? TransitionEditor.data.frame - 1 : 0;
					if (TransitionEditor.data.worker.Animation.getAnimate(0).getFrameCount() == 0) TransitionEditor.create();
					Popups.closeAllByTag("frame");
					showHint(translate("Frame deleted"));
				});
		}
	},
	reframe: function(view) {
		let define = TransitionEditor.data.worker.Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("FPS"));
		popup.addEditElement(translate("Frames/sec."), define.getFps() || 60);
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			define.setFps(compileData(values[0], "number"));
			showHint(translate("Data saved"));
		}).setBackground("ground");
		Popups.open(popup, "reframe");
	}
};

let needTransitionReset = false;
Callback.addCallback("LevelPreLoaded", function() {
	try {
		// Reset entity if entity isn't defined
		if (ProjectEditor.getCurrentType() == "transition" &&
			TransitionEditor.data.worker.Define.getEntity() == -1)
				TransitionEditor.data.worker.Define.setEntity(getPlayerEnt()),
					needTransitionReset = true;
	} catch(e) {
		reportError(e);
	}
});

Callback.addCallback("LevelLoaded", function() {
	context.runOnUiThread(function() {
		try {
			if (needTransitionReset) {
				TransitionEditor.data.worker.Define.resetStarting();
				Popups.closeAllByTag("transition");
				needTransitionReset = false;
			}
		} catch(e) {
			reportError(e);
		}
	});
});

Callback.addCallback("EntityHurt", function(attacker, victim) {
	context.runOnUiThread(function() {
		try {
			// Hit entity selection
			if (selectMode == 2 && attacker == getPlayerEnt()) {
				TransitionEditor.data.worker.Define.setEntity(victim);
				showHint(translate("Entity selected"));
				selectMode = 0, TransitionEditor.create();
			}
		} catch(e) {
			reportError(e);
		}
	});
});

Callback.addCallback("tick", function() {
	try {
		// Mostly spawn selection particles
		if (ProjectEditor.getCurrentType() == "transition")
			drawTransitionPoints(TransitionEditor.data.worker);
	} catch(e) {
		reportError(e);
	}
});
