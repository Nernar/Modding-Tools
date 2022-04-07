const playTransition = function(worker, frame) {
	return tryout(function() {
		if (Transition.isTransitioning()) {
			showHint(translate("Transition is already transitioning"), Interface.Color.YELLOW);
			return false;
		}
		if (!TransitionEditor.data.transition) {
			TransitionEditor.data.transition = new Transition();
		}
		let transition = TransitionEditor.data.transition;
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
				TRANSITION_TOOL.describeSidebar();
			});
		});
		transition.start();
		return true;
	}, false);
};

const stopTransition = function(worker) {
	return tryout(function() {
		if (!Transition.isTransitioning()) {
			showHint(translate("Transition is already stopped"), Interface.Color.YELLOW);
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

const drawTransitionPoints = function(tool) {
	return tryout(function() {
		let worker = tool.getWorker();
		if (!worker || !LevelInfo.isLoaded()) {
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

const isNonStandardEntity = function(tool) {
	return tryout(function() {
		return tool.getWorker().Define.getEntity() != getPlayerEnt();
	}, false);
};

const TRANSITION_TOOL = (function() {
	return new EditorTool({
		controlDescriptor: {
			logotype: function(tool, control) {
				if (selectMode == 2 || selectMode == 4) {
					return "transitionFrameMove";
				}
				return "transition";
			},
			collapsedClick: function(tool, control) {
				if (selectMode == 2 || selectMode == 4) {
					let previous = selectMode;
					selectMode = 0;
					if (previous == 4) {
						drawTransitionPoints(tool);
					}
					tool.describeControl();
					tool.control();
					return;
				}
				EditorTool.prototype.controlDescriptor.collapsedClick.apply(this, arguments);
			}
		},
		menuDescriptor: {
			elements: [function(tool, json, menu) {
				if (LevelInfo.isLoaded()) {
					return {
						type: "category",
						title: translate("Transition"),
						items: [{
							icon: "transitionCamera",
							title: translate("Camera"),
							click: function(tool, item) {
								showHint(translate("Hit entity"));
								selectMode = 2;
								tool.describeControl();
								tool.collapse();
							}
						}, function(tool, category) {
							if (isNonStandardEntity(tool)) {
								let hasRemoveMessage = false;
								return {
									icon: "transitionPlayer",
									title: translate("Player"),
									click: function(tool, item) {
										if (!hasRemoveMessage) {
											let message = control.addMessage("menuBoardWarning", translate("Current entity will be lost.") + " " + translate("Touch here to confirm."),
												function() {
													let worker = tool.getWorker();
													worker.Define.setEntity(getPlayerEnt());
													drawTransitionPoints(tool);
													tool.describeMenu();
													delete message;
												});
											handle(function() {
												if (message !== undefined) {
													control.scrollToElement(message);
												}
											}, 500);
											handle(function() {
												if (message !== undefined) {
													control.removeElement(message);
												}
												hasRemoveMessage = false;
											}, 5000);
											hasRemoveMessage = true;
										}
									}
								};
							}
						}, {
							icon: "worldSelectionRange",
							title: translate("Pathes"),
							click: function() {
								selectMode = 4;
								TransitionEditor.unselect();
								tool.describeControl();
								tool.collapse();
							}
						}, {
							icon: "transitionUpdate",
							title: translate("Reload"),
							click: function(tool, item) {
								if (selectMode != 0) {
									selectMode = 0;
									tool.describe();
								}
								TransitionEditor.reload();
							}
						}]
					};
				}
				// in menu
			}]
		},
		sidebarDescriptor: {
			groups: [{
				icon: "transition",
				items: [function(tool, json, group, sidebar) {
					if (TransitionEditor.data.hasAnimate) {
						return Transition.isTransitioning() ? {
							icon: "transitionAnimatePlay"
						} : {
							icon: "transitionAnimatePause"
						};
					}
				}, {
					icon: "transitionAnimateMove"
				}, {
					icon: "transitionAnimateRotate"
				}, {
					icon: "transitionAnimateFps"
				}, function(tool, json, group, sidebar) {
					if (LevelInfo.isLoaded()) {
						return {
							icon: "transitionUpdate"
						};
					}
				}]
			}, {
				icon: "transitionFrameSelect",
				items: [function(tool, json, group, sidebar) {
					if (TransitionEditor.data.hasAnimate) {
						let selector = [{
							icon: "transitionFrameSelect"
						}, {
							icon: "transitionFrameAdd"
						}];
						if (TransitionEditor.Frame.hasSelection()) {
							return selector.concat([Transition.isTransitioning() ? {
								icon: "transitionFramePlay"
							} : {
								icon: "transitionFramePause"
							}, {
								icon: "transitionFrameMove"
							}, {
								icon: "transitionFrameRotate"
							}, {
								icon: "transitionFrameDurate"
							}, {
								icon: "transitionFrameInterpolate"
							}, {
								icon: "transitionFrameRemove"
							}]);
						}
						return selector;
					}
					return {
						icon: "transitionFrameAdd"
					};
				}]
			}]
		},
		onSelectItem: function(sidebar, group, item, groupIndex, itemIndex) {
			if (groupIndex == 0) {
				if (!TransitionEditor.data.hasAnimate) {
					itemIndex++;
				}
				if (itemIndex == 0) {
					return TransitionEditor.Transition.play(this);
				} else if (itemIndex == 1) {
					return TransitionEditor.Transition.move(this);
				} else if (itemIndex == 2) {
					return TransitionEditor.Transition.rotate(this);
				} else if (itemIndex == 3) {
					return TransitionEditor.reframe(this);
				} else if (itemIndex == 4) {
					return TransitionEditor.reload(this);
				}
			} else if (groupIndex == 1) {
				if (TransitionEditor.data.hasAnimate) {
					if (itemIndex == 0) {
						return TransitionEditor.Frame.select(this);
					} else if (itemIndex == 1) {
						return TransitionEditor.Frame.add(this);
					} else if (itemIndex == 2) {
						return TransitionEditor.Frame.play(this);
					} else if (itemIndex == 3) {
						return TransitionEditor.Frame.move(this);
					} else if (itemIndex == 4) {
						return TransitionEditor.Frame.rotate(this);
					} else if (itemIndex == 5) {
						return TransitionEditor.Frame.durate(this);
					} else if (itemIndex == 6) {
						return TransitionEditor.Frame.interpolator(this);
					} else if (itemIndex == 7) {
						return TransitionEditor.Frame.remove(this);
					}
				} else if (itemIndex == 0) {
					return TransitionEditor.Frame.add(this);
				}
			}
			showHint(translate("Not developed yet"));
		},
		onFetchGroup: function(sidebar, group, index) {
			if (index == 0) {
				return translate("Animate define properties");
			} else if (index == 1) {
				return translate("Frames actions");
			}
			return translate("Deprecated translation");
		},
		onFetchItem: function(sidebar, group, item, groupIndex, itemIndex) {
			if (groupIndex == 0) {
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
			} else if (groupIndex == 1) {
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
			}
			return translate("Deprecated translation");
		},
		onSelectGroup: function(sidebar, group, index, last, count) {
			drawTransitionPoints(this);
		},
		onUndockGroup: function(sidebar, group, index, previous) {
			if (!previous) {
				selectMode = 0;
				drawTransitionPoints(this);
			}
		},
		getExtensions: function(type) {
			let source = EditorTool.prototype.getExtensions.apply(this, arguments);
			if (type != EditorTool.ExtensionType.EXPORT) {
				source = source.concat([".nds", ".dea"]);
			}
			return source;
		},
		replace: function(file) {
			let name = file.getName(),
				instance = this;
			if (name.endsWith(".nds") || name.endsWith(".deb")) {
				let active = Date.now();
				tryout(function() {
					let obj = compileData(Files.read(file)),
						result = convertNds(obj);
					instance.fromProject(result);
					showHint(translate("Imported success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			}
			EditorTool.prototype.replace.apply(this, arguments);
		},
		merge: function(file) {
			let merger = this.getMerger();
			if (!this.hasMerger()) MCSystem.throwException(null);
			let name = file.getName(),
				project = this.toProject(),
				instance = this;
			if (name.endsWith(".nds") || name.endsWith(".deb")) {
				let active = Date.now();
				handleThread(function() {
					let obj = compileData(Files.read(file)),
						result = convertNds(obj);
					merger(project, result, function(output) {
						instance.fromProject(output);
						showHint(translate("Merged success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
				});
			}
			EditorTool.prototype.merge.apply(this, arguments);
		},
		getWorkerFor: function(source) {
			if (source !== undefined) {
				return new TransitionWorker(source);
			}
			return ProjectProvider.addTransition();
		},
		getMerger: function() {
			return mergeConvertedTransition;
		},
		getConverter: function() {
			return new TransitionConverter();
		},
		hasParser: function() {
			return true;
		},
		unselect: function(force) {
			delete TransitionEditor.data.frame;
			Popups.closeIfOpened("frame_select");
			drawTransitionPoints(this);
			EditorTool.prototype.unselect.apply(this, arguments);
		}
	});
})();

const attachTransitionTool = function(source, post) {
	TRANSITION_TOOL.attach();
	TRANSITION_TOOL.queue();
	handleThread(function() {
		let accepted = TRANSITION_TOOL.open(source);
		handle(function() {
			if (accepted) {
				tryout(function() {
					post && post(TRANSITION_TOOL);
					TransitionEditor.attach(TRANSITION_TOOL);
					accepted = false;
				});
			}
			if (accepted) {
				TRANSITION_TOOL.leave();
			}
		});
	});
};

const TransitionEditor = {
	data: new Object(),
	resetIfNeeded: function(tool) {
		let worker = tool.getWorker();
		if (worker.Animation.getAnimateCount() == 0) {
			worker.Animation.createAnimate();
		}
	},
	attach: function(tool) {
		let worker = tool.getWorker();
		this.resetIfNeeded(tool);
		this.data.hasAnimate = worker.Animation.getAnimateCount() > 0 &&
			worker.Animation.getAnimate(0).getFrameCount() > 0;
		drawTransitionPoints(tool);
		if (!tool.isAttached()) {
			tool.attach();
		}
		tool.describe();
		tool.control();
	},
	reload: function(tool) {
		let worker = tool.getWorker();
		if (drawTransitionPoints(tool)) {
			showHint(translate("Transition updated"));
		} else showHint(translate("Nothing to update"));
	},
	Transition: {
		play: function(tool) {
			if (!LevelInfo.isLoaded()) {
				showHint(translate("Can't play transitions at menu"));
				return;
			}
			let worker = tool.getWorker(),
				transition = TransitionEditor.data.transition;
			if (transition && transition.isStarted()) {
				if (stopTransition(worker)) {
					showHint(translate("Transition stopped"));
				}
			} else {
				playTransition(worker);
				tool.describeSidebar();
			}
		},
		move: function(tool) {
			let worker = tool.getWorker(),
				point = worker.Define.getStarting();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			popup.setBaseMathes([1, 10, 100]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				worker.Define.moveStarting("x", value);
			});
			group.setOnLongChangeListener(function(index) {
				return preround(Entity.getX(getPlayerEnt()), 1);
			});
			group.addItem(point.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				worker.Define.moveStarting("y", value);
			});
			group.setOnLongChangeListener(function(index) {
				return preround(Entity.getY(getPlayerEnt()), 1);
			});
			group.addItem(point.y);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				worker.Define.moveStarting("z", value);
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
		rotate: function(tool) {
			let worker = tool.getWorker(),
				point = worker.Define.getStarting();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Rotate"));
			popup.setBaseMathes([10, 100]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				worker.Define.moveStarting("yaw", value);
			});
			group.setOnLongChangeListener(function(index) {
				return preround(Entity.getYaw(getPlayerEnt()), 2);
			});
			group.addItem(point.yaw);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				worker.Define.moveStarting("pitch", value);
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
		select: function(tool) {
			let worker = tool.getWorker();
			let popup = new ListingPopup();
			popup.setTitle(translate("Frames"));
			popup.setOnDismissListener(function() {
				selectMode = 0;
				drawTransitionPoints(tool);
			});
			for (let i = 0; i < worker.Animation.getAnimate(0).getFrameCount(); i++) {
				popup.addButtonElement(translate("Frame %s", i + 1));
			}
			popup.setOnSelectListener(function(index) {
				selectMode = 4;
				TransitionEditor.data.frame = index;
				drawTransitionPoints(tool);
			});
			popup.selectButton(TransitionEditor.data.frame);
			popup.setSelectMode(true);
			Popups.open(popup, "frame_select");
		},
		add: function(tool) {
			let worker = tool.getWorker();
			if (TransitionEditor.data.hasAnimate) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let index = (TransitionEditor.data.frame = worker.Animation.getAnimate(0).addFrame());
					showHint(translate("Frame %s added", index + 1));
					drawTransitionPoints(tool);
				});
				if (LevelInfo.isLoaded()) {
					popup.addButtonElement(translate("Currently"), function() {
						let selected = TransitionEditor.Frame.hasSelection(),
							index = (TransitionEditor.data.frame = worker.Animation.getAnimate(0).addFrame());
						worker.Animation.getAnimate(0).setupFrame(index);
						if (!selected) tool.describeSidebar();
						showHint(translate("Frame %s added as currently", index + 1));
						drawTransitionPoints(tool);
					});
				}
				if (TransitionEditor.Frame.hasSelection()) {
					popup.addButtonElement(translate("Copy current"), function() {
						let last = TransitionEditor.data.frame,
							index = (TransitionEditor.data.frame = worker.Animation.getAnimate(0).cloneFrame(last));
						showHint(translate("Frame %s cloned to %s", [last + 1, index + 1]));
						drawTransitionPoints(tool);
					});
				}
				Popups.open(popup, "frame_add");
			} else {
				TransitionEditor.data.frame = worker.Animation.getAnimate(0).addFrame();
				TransitionEditor.attach(tool);
				showHint(translate("First frame added"));
			}
		},
		play: function(tool) {
			if (!LevelInfo.isLoaded()) {
				showHint(translate("Can't play transitions at menu"));
				return;
			}
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let worker = tool.getWorker(),
				transition = TransitionEditor.data.transition,
				selected = TransitionEditor.data.frame;
			if (transition && transition.isStarted()) {
				if (stopTransition(worker)) {
					showHint(translate("Transition stopped"));
				}
			} else {
				playTransition(worker, selected);
				tool.describeSidebar();
			}
		},
		move: function(tool) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let worker = tool.getWorker(),
				selected = TransitionEditor.data.frame,
				frame = worker.Animation.getAnimate(0).getFrame(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			popup.setBaseMathes([1, 10, 100]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				worker.Animation.getAnimate(0).moveFrame(selected, "x", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getX(getPlayerEnt()) - real.x, 1);
			});
			group.addItem(frame.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				worker.Animation.getAnimate(0).moveFrame(selected, "y", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getY(getPlayerEnt()) - real.y, 1);
			});
			group.addItem(frame.y);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				worker.Animation.getAnimate(0).moveFrame(selected, "z", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getZ(getPlayerEnt()) - real.z, 1);
			});
			group.addItem(frame.z);
			popup.addButtonElement(translate("Current all"), function() {
				popup.callLongChangeForAll();
			});
			Popups.open(popup, "frame_move");
		},
		rotate: function(tool) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let worker = tool.getWorker(),
				selected = TransitionEditor.data.frame,
				frame = worker.Animation.getAnimate(0).getFrame(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Rotate"));
			popup.setBaseMathes([10, 100]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				worker.Animation.getAnimate(0).moveFrame(selected, "yaw", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getYaw(getPlayerEnt()) - real.yaw, 2);
			});
			group.addItem(frame.yaw);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				worker.Animation.getAnimate(0).moveFrame(selected, "pitch", value);
			});
			group.setOnLongChangeListener(function(index) {
				let real = worker.Animation.getAnimate(0).getFrameCoords(selected);
				return preround(Entity.getPitch(getPlayerEnt()) - real.pitch, 2);
			});
			group.addItem(frame.pitch);
			popup.addButtonElement(translate("Current all"), function() {
				popup.callLongChangeForAll();
			});
			Popups.open(popup, "frame_rotate");
		},
		durate: function(tool) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let worker = tool.getWorker(),
				selected = TransitionEditor.data.frame,
				frame = worker.Animation.getAnimate(0).getFrame(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Duration"));
			popup.setBaseMathes([1, 10, 100]);
			let group = popup.addGroup();
			group.setOnChangeListener(function(index, value) {
				worker.Animation.getAnimate(0).durateFrame(selected, value);
			});
			group.addItem(frame.duration);
			group.removeName();
			Popups.open(popup, "frame_durate");
		},
		interpolator: function(tool) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let worker = tool.getWorker(),
				selected = TransitionEditor.data.frame,
				frame = worker.Animation.getAnimate(0).getFrame(selected);
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
					worker.Animation.getAnimate(0).resetInterpolation(selected);
					showHint(translate("Interpolator disabled"));
				} else {
					worker.Animation.getAnimate(0).interpolateFrame(selected, index);
					showHint(translate("Interpolator setted"));
				}
			});
			Popups.open(popup, "frame_interpolator");
		},
		remove: function(tool) {
			if (!TransitionEditor.Frame.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this frame?"),
				function() {
					let worker = tool.getWorker();
					worker.Animation.getAnimate(0).removeFrame(TransitionEditor.data.frame);
					TransitionEditor.data.frame = TransitionEditor.data.frame > 0 ? TransitionEditor.data.frame - 1 : 0;
					if (worker.Animation.getAnimate(0).getFrameCount() == 0) {
						TransitionEditor.attach(tool);
					}
					Popups.closeAllByTag("frame");
					showHint(translate("Frame deleted"));
				});
		}
	},
	reframe: function(tool) {
		let worker = tool.getWorker();
		let popup = new ListingPopup();
		popup.setTitle(translate("FPS"));
		popup.addEditElement(translate("Frames/sec."), worker.Define.getFps() || 60);
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			worker.Define.setFps(compileData(values[0], "number"));
			showHint(translate("Data saved"));
		});
		Popups.open(popup, "reframe");
	}
};
