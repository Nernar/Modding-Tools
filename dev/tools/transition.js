const playTransition = function(worker, frame) {
	return tryout(function() {
		if (Transition.isTransitioning()) {
			showHint(translate("Transition are already transitioning"), Interface.Color.YELLOW);
			return false;
		}
		if (TransitionEditor.data.transition) let transition = TransitionEditor.data.transition;
		else transition = TransitionEditor.data.transition = new Transition();
		transition.withEntity(worker.Define.getEntity() || getPlayerEnt());
		transition.setFramesPerSecond(worker.Define.getFps() || 60);
		transition.getFrameCount() > 0 && transition.clearFrames();
		if (frame == undefined || frame == null) {
			let point = worker.Define.getStarting();
			transition.withFrom(point.x, point.y, point.z, point.yaw, point.pitch);
			transition.withFrames(worker.Animation.getAnimate(0).asArray());
		} else {
			let real = worker.Animation.getAnimate(0).getFrameCoords(frame);
			transition.withFrom(real.x, real.y, real.z, real.yaw, real.pitch);
			let offset = worker.Animation.getAnimate(0).getFrame(frame);
			transition.addFrame(offset.x, offset.y, offset.z,
				offset.yaw, offset.pitch, offset.duration, offset.interpolator);
		}
		transition.withOnFinishListener(function() {
			handle(function() {
				TransitionEditor.create();
			});
		});
		transition.start();
		return true;
	}, false);
};

const stopTransition = function(worker) {
	return tryout(function() {
		if (!Transition.isTransitioning()) {
			showHint(translate("Transition are already stopped"), Interface.Color.YELLOW);
			return false;
		}
		if (!TransitionEditor.data.transition) {
			showHint(translate("Transition isn't setted up"), Interface.Color.YELLOW);
			return false;
		}
		TransitionEditor.data.transition.stop();
		return true;
	}, false);
};

const drawTransitionPoints = function(worker) {
	return tryout(function() {
		if (!worker || !Level.isLoaded()) {
			return false;
		}
		if (selectMode == 4) {
			for (let i = 0; i < worker.Animation.getAnimateCount(); i++) {
				let animate = worker.Animation.getAnimate(i);
				if (animate !== null) {
					for (let f = 0; f < animate.getFrameCount(); f++) {
						let coords = animate.getFrameCoords(f), frame = animate.getFrame(f);
						if (drawSelection && Popups.hasOpenedByName("frame_select")) {
							if (TransitionEditor.data.frame == f) {
								Particles.addParticle(ParticleType.heart, coords.x, coords.y, coords.z, 0, 0, 0, -1);
							} else Particles.addParticle(ParticleType.happyVillager, coords.x, coords.y, coords.z, 0, 0, 0, 0);
						}
						let previous = {
							x: 0,
							y: 0,
							z: 0,
							yaw: 0,
							pitch: 0
						};
						let request = [frame.x / transitionSideDividers, frame.y / transitionSideDividers, frame.z / transitionSideDividers, frame.yaw / transitionSideDividers,
							frame.pitch / transitionSideDividers, transitionSideDividers, frame.duration / transitionSideDividers, frame.interpolator];
						for (let i = 0; i < transitionSideDividers; i++) {
							let point = Transition.compareVectorPoint(request, i);
							Particles.addParticle(ParticleType.flame, coords.x + previous.x, coords.y + previous.y, coords.z + previous.z,
								(point.x + previous.x) / 20, (point.y + previous.y) / 20, (point.z + previous.z) / 20, 0);
							previous.x += point.x;
							previous.y += point.y;
							previous.z += point.z;
							previous.yaw += point.yaw;
							previous.pitch += point.pitch;
						}
					}
				}
			}
		}
		autosavePeriod == 0 && ProjectProvider.getProject().callAutosave();
		return true;
	}, false);
};

const mergeConvertedTransition = function(project, source, action) {
	handleThread(function() {
		if (source === null || source === undefined) {
			action && action(project);
			return;
		}
		if (!Array.isArray(source)) source = [source];
		if (project === null || project === undefined) {
			project = new Object();
		}
		source.forEach(function(element, index) {
			if (element === null || element === undefined) {
				return;
			}
			if (element.define !== undefined) {
				let entity = element.define.entity;
				if (entity !== undefined) {
					if (project.define === undefined) project.define = new Object();
					let currently = project.define.entity;
					if (currently === undefined) {
						project.define.entity = entity;
					}
				}
				let fps = element.define.fps;
				if (fps !== undefined) {
					if (project.define === undefined) project.define = new Object();
					let currently = project.define.fps;
					if (currently === undefined || currently < data) {
						project.define.fps = fps;
					}
				}
				let starting = element.define.starting;
				if (starting !== undefined) {
					if (project.define === undefined) project.define = new Object();
					let currently = project.define.starting;
					if (currently === undefined) {
						project.define.starting = starting;
					}
				}
			}
			if (element.animation !== undefined) {
				let animate = element.animation[0];
				if (animate !== undefined) {
					if (project.animation === undefined) project.animation = new Array();
					project.animation[0] = merge(project.animation[0], animate);
				}
			}
		});
		action && action(project);
	});
};

let TransitionEditor = {
	data: new Object(),
	reset: function() {
		this.data.worker = ProjectProvider.addTransition();
		ProjectProvider.setOpenedState(true);
		this.data.worker.Animation.createAnimate();
		this.unselect();
	},
	unselect: function() {
		this.data.frame = -1;
		Popups.closeIfOpened("frame_select");
		delete this.data.selected;
	},
	create: function() {
		let autosaveable = !ProjectProvider.isOpened();
		if (!this.data.worker) this.reset();
		autosaveable && ProjectProvider.initializeAutosave(this.data.worker);
		this.data.hasAnimate = this.data.worker.Animation.getAnimateCount() > 0 &&
			this.data.worker.Animation.getAnimate(0).getFrameCount() > 0;
		this.data.isStarted = !!Transition.currently;
		let button = new ControlButton();
		button.setIcon("transition");
		button.setOnClickListener(function() {
			TransitionEditor.menu();
			sidebar.dismiss();
		});
		button.show();
		let sidebar = new SidebarWindow(),
			group = sidebar.addGroup("transition");
		if (this.data.hasAnimate) {
			group.addItem(this.data.isStarted ? "transitionAnimatePlay" : "transitionAnimatePause", this.Transition.play);
		}
		group.addItem("transitionAnimateMove", this.Transition.move);
		group.addItem("transitionAnimateRotate", this.Transition.rotate);
		group.addItem("transitionAnimateFps", this.reframe);
		group.addItem("transitionUpdate", this.reload);
		group.setOnItemFetchListener(function(group, item, groupIndex, itemIndex) {
			if (!TransitionEditor.data.hasAnimate) {
				itemIndex++;
			}
			if (itemIndex == 0) {
				return translate("Plays or stops animate");
			} else if (itemIndex == 1) {
				return translate("Moves startup location");
			} else if (itemIndex == 2) {
				return translate("Moves startup rotation");
			} else if (itemIndex == 3) {
				return translate("Changes frames per second");
			} else if (itemIndex == 4) {
				return translate("Updates animate");
			}
		});
		group = sidebar.addGroup("transitionFrameSelect");
		if (this.data.hasAnimate) {
			group.addItem("transitionFrameSelect", this.Frame.select);
			group.addItem("transitionFrameAdd", this.Frame.add);
			group.addItem(this.data.isStarted ? "transitionFramePlay" : "transitionFramePause", this.Frame.play);
			group.addItem("transitionFrameMove", this.Frame.move);
			group.addItem("transitionFrameRotate", this.Frame.rotate);
			group.addItem("transitionFrameDurate", this.Frame.durate);
			group.addItem("transitionFrameInterpolate", this.Frame.interpolator);
			group.addItem("transitionFrameRemove", this.Frame.remove);
		} else group.addItem("transitionFrameAdd", this.Frame.add);
		group.setOnItemFetchListener(function(group, item, groupIndex, itemIndex) {
			if (TransitionEditor.data.hasAnimate) {
				if (itemIndex == 0) {
					return translate("Selects currently frame");
				} else if (itemIndex == 1) {
					return translate("Creates and clones frames");
				} else if (itemIndex == 2) {
					return translate("Plays or stops frame");
				} else if (itemIndex == 3) {
					return translate("Moves frame location");
				} else if (itemIndex == 4) {
					return translate("Moves frame rotation");
				} else if (itemIndex == 5) {
					return translate("Changes frame duration");
				} else if (itemIndex == 6) {
					return translate("Set up frame velocity vector");
				} else if (itemIndex == 7) {
					return translate("Removes frame");
				}
			} else if (itemIndex == 0) {
				return translate("Creates first frame");
			}
		});
		if (this.data.selected >= 0) sidebar.select(this.data.selected);
		sidebar.setOnGroupSelectListener(function(window, group, index, previous, count) {
			TransitionEditor.data.selected = index;
			drawTransitionPoints(TransitionEditor.data.worker);
		});
		sidebar.setOnGroupUndockListener(function(window, group, index, previous) {
			if (!previous) {
				delete TransitionEditor.data.selected;
				drawTransitionPoints(TransitionEditor.data.worker);
			}
		});
		sidebar.setOnGroupFetchListener(function(window, group, index) {
			if (index == 0) {
				return translate("Animate define properties");
			} else if (index == 1) {
				return translate("Frames actions");
			}
		})
		sidebar.show();
		drawTransitionPoints(this.data.worker);
	},
	menu: function() {
		prepareAdditionalInformation(3, 1);
		let control = new MenuWindow();
		attachWarningInformation(control);
		control.setOnClickListener(function() {
			TransitionEditor.create();
		}).addHeader();
		attachAdditionalInformation(control);
		let category = control.addCategory(translate("Editor"));
		category.addItem("menuProjectLoad", translate("Open"), function() {
			selectFile([".dnp", ".nds", ".js"], function(file) {
				TransitionEditor.replace(file);
			});
		});
		category.addItem("menuProjectImport", translate("Merge"), function() {
			selectFile([".dnp", ".nds", ".js"], function(file) {
				TransitionEditor.merge(file);
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
			ProjectProvider.setOpenedState(false);
			ProjectProvider.getProject().callAutosave();
			checkValidate(function() {
				delete TransitionEditor.data.worker;
				ProjectEditor.menu();
			});
		});
		attachAdditionalInformation(control);
		category = control.addCategory(translate("Transition"));
		category.addItem("transitionCamera", translate("Camera"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't change camera at menu"));
				return;
			}
			showHint(translate("Hit entity"));
			control.dismiss();
			selectMode = 2;
			let button = new ControlButton();
			button.setIcon("menuBack");
			button.setOnClickListener(function() {
				TransitionEditor.create();
				selectMode = 0;
			});
			button.show();
		});
		if (TransitionEditor.data.worker.Define.getEntity() != getPlayerEnt()) {
			let hasResetMessage = false;
			category.addItem("transitionPlayer", translate("Player"), function() {
				if (!hasResetMessage) {
					let message = control.addMessage("menuBoardWarning", translate("Current entity will be lost.") + " " + translate("Touch here to confirm."),
						function() {
							TransitionEditor.data.worker.Define.setEntity(getPlayerEnt());
							control.dismiss(), TransitionEditor.create();
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
		category.addItem("worldSelectionRange", translate("Pathes"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't draw points in menu"));
				return;
			}
			control.dismiss();
			selectMode = 4;
			let button = new ControlButton();
			button.setIcon("menuBack");
			button.setOnClickListener(function() {
				TransitionEditor.create();
				selectMode = 0;
			});
			button.show();
			TransitionEditor.unselect();
		});
		category.addItem("transitionUpdate", translate("Reload"), function() {
			selectMode = 0;
			TransitionEditor.reload();
		});
		attachAdditionalInformation(control);
		control.show();
		finishAttachAdditionalInformation();
	},
	open: function(source) {
		if (typeof source != "object") {
			source = ProjectProvider.getEditorById(source);
		}
		let index = ProjectProvider.indexOf(source);
		if (!source) {
			showHint(translate("Can't find opened editor at %s position", source));
			return false;
		}
		Popups.closeAll();
		let worker = this.data.worker = new TransitionWorker(source);
		if (index == -1) index = ProjectProvider.getCount();
		ProjectProvider.setupEditor(index, worker);
		TransitionEditor.unselect();
		TransitionEditor.create();
		ProjectProvider.setOpenedState(true);
		MenuWindow.dismissCurrently();
		return true;
	},
	merge: function(file) {
		let name = file.getName(),
			project = TransitionEditor.data.worker.getProject();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					mergeConvertedTransition(project, selected, function(output) {
						TransitionEditor.data.worker.loadProject(output);
						drawTransitionPoints(TransitionEditor.data.worker);
						showHint(translate("Merged success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
				}, "transition");
			});
		} else if (name.endsWith(".nds")) {
			let active = Date.now();
			tryout(function() {
				let obj = compileData(Files.read(file)),
					result = convertNds(obj);
				mergeConvertedTransition(project, result, function(output) {
					TransitionEditor.data.worker.loadProject(output);
					drawTransitionPoints(TransitionEditor.data.worker);
					showHint(translate("Merged success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			});
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			importScript(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					mergeConvertedTransition(project, selected, function(output) {
						TransitionEditor.data.worker.loadProject(output);
						drawTransitionPoints(TransitionEditor.data.worker);
						showHint(translate("Merged success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
				}, "transition");
			});
		}
	},
	replace: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					TransitionEditor.open(selected);
					showHint(translate("Loaded success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				}, "transition", true);
			});
		} else if (name.endsWith(".nds")) {
			let active = Date.now();
			tryout(function() {
				let current = TransitionEditor.data.worker.getProject(),
					obj = compileData(Files.read(file)),
					result = convertNds(obj);
				TransitionEditor.open(result);
				showHint(translate("Imported success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			importScript(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					TransitionEditor.open(selected);
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				}, "transition", true);
			});
		}
	},
	save: function(file, i) {
		let name = (TransitionEditor.data.name = i, file.getName()),
			project = TransitionEditor.data.worker.getProject();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		} else if (name.endsWith(".js")) {
			let converter = new TransitionConverter();
			converter.attach(project);
			let active = Date.now();
			converter.executeAsync(function(link, result) {
				if (link.hasResult()) {
					Files.write(file, result);
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				} else reportError(link.getLastException());
			});
		}
	},
	reload: function() {
		if (drawTransitionPoints(TransitionEditor.data.worker)) {
			showHint(translate("Transition updated"));
		} else showHint(translate("Nothing to update"));
	},
	Transition: {
		play: function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't play transitions at menu"));
				return;
			}
			let transition = TransitionEditor.data.transition;
			if (transition && transition.isStarted()) {
				if (stopTransition(TransitionEditor.data.worker)) {
					showHint(translate("Transition stopped"));
				}
			} else playTransition(TransitionEditor.data.worker),
				TransitionEditor.create();
		},
		move: function() {
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
		rotate: function() {
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
		select: function() {
			let popup = new ListingPopup();
			popup.setTitle(translate("Frames"));
			popup.setOnCloseListener(function() {
				selectMode = 0;
				drawTransitionPoints(TransitionEditor.data.worker);
			});
			for (let i = 0; i < TransitionEditor.data.worker.Animation.getAnimate(0).getFrameCount(); i++) {
				popup.addButtonElement(translate("Frame %s", i + 1));
			}
			popup.setOnSelectListener(function(index) {
				selectMode = 4;
				TransitionEditor.data.frame = index;
				drawTransitionPoints(TransitionEditor.data.worker);
			});
			popup.selectButton(TransitionEditor.data.frame);
			popup.setSelectMode(true);
			Popups.open(popup, "frame_select");
		},
		add: function() {
			if (TransitionEditor.data.hasAnimate) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let index = (TransitionEditor.data.frame = TransitionEditor.data.worker.Animation.getAnimate(0).addFrame());
					showHint(translate("Frame %s added", index + 1));
					drawTransitionPoints(TransitionEditor.data.worker);
				});
				if (Level.isLoaded()) {
					popup.addButtonElement(translate("Currently"), function() {
						let index = (TransitionEditor.data.frame = TransitionEditor.data.worker.Animation.getAnimate(0).addFrame());
						TransitionEditor.data.worker.Animation.getAnimate(0).setupFrame(index);
						showHint(translate("Frame %s added as currently", index + 1));
						drawTransitionPoints(TransitionEditor.data.worker);
					});
				}
				if (TransitionEditor.Frame.hasSelection()) {
					popup.addButtonElement(translate("Copy current"), function() {
						let last = TransitionEditor.data.frame,
							index = (TransitionEditor.data.frame = TransitionEditor.data.worker.Animation.getAnimate(0).cloneFrame(last));
						showHint(translate("Frame %s cloned to %s", [last + 1, index + 1]));
						drawTransitionPoints(TransitionEditor.data.worker);
					});
				}
				Popups.open(popup, "frame_add");
			} else {
				TransitionEditor.data.frame = TransitionEditor.data.worker.Animation.getAnimate(0).addFrame();
				TransitionEditor.create();
				showHint(translate("First frame added"));
				drawTransitionPoints(TransitionEditor.data.worker);
			}
		},
		play: function() {
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
				if (stopTransition(TransitionEditor.data.worker)) {
					showHint(translate("Transition stopped"));
				}
			} else playTransition(TransitionEditor.data.worker, selected),
				TransitionEditor.create();
		},
		move: function() {
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
		rotate: function() {
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
		durate: function() {
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
		interpolator: function() {
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
	reframe: function() {
		let define = TransitionEditor.data.worker.Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("FPS"));
		popup.addEditElement(translate("Frames/sec."), define.getFps() || 60);
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			define.setFps(compileData(values[0], "number"));
			showHint(translate("Data saved"));
		}).setBackground("popup");
		Popups.open(popup, "reframe");
	}
};
