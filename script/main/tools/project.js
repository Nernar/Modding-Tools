const ProjectTool = function(object) {
	ControlTool.apply(this, arguments);
};

ProjectTool.prototype = new ControlTool;

ProjectTool.prototype.reset = function() {
	ControlTool.prototype.reset.apply(this, arguments);
	this.controlDescriptor.logotype = "menu";
	this.contentProjectDescriptor = [];
	this.contentEntryDescriptor = [];
	this.menuDescriptor.elements = [{
		type: "projectHeader",
		categories: function(tool) {
			return tool.contentProjectDescriptor;
		}
	}, {
		type: "category",
		title: translate("Editors"),
		items: function(tool) {
			return tool.contentEntryDescriptor;
		}
	}, {
		type: "category",
		title: translate("Project"),
		items: [{
			icon: "menuProjectLoad",
			title: translate("Open"),
			click: function(tool, item) {
				let formats = tool.getExtensions(ProjectTool.ExtensionType.REPLACE);
				if (formats && formats.length > 0) {
					selectFile(formats, function(file) {
						tool.replace(file);
					});
					return;
				}
				showHint(translate("There's no availabled entry to replace"));
			}
		}, {
			icon: "menuProjectImport",
			title: translate("Merge"),
			click: function(tool, item) {
				let formats = tool.getExtensions(ProjectTool.ExtensionType.MERGE);
				if (formats && formats.length > 0) {
					selectFile(formats, function(file) {
						tool.merge(file);
					});
					return;
				}
				showHint(translate("There's no availabled entry to merge"));
			}
		}, {
			icon: "menuProjectSave",
			title: translate("Export"),
			click: function(tool, item) {
				let formats = tool.getExtensions(ProjectTool.ExtensionType.EXPORT);
				if (formats && formats.length > 0) {
					let lastName = tool.getExplorerLastName();
					saveFile(lastName, formats, function(file, name) {
						tool.export(file);
						tool.setExplorerLastName(name);
					});
					return;
				}
				showHint(translate("There's no availabled entry to export"));
			}
		}, {
			icon: "menuProjectManual",
			title: translate("Tutorial"),
			click: function(tool, item) {
				if (REVISION.indexOf("alpha") != -1) {
					confirm(translate(NAME) + " " + translate(VERSION), translate("You're sure want to review basics tutorial?"), function() {
						TutorialSequence.ButtonInteraction.execute();
						tool.deattach();
					});
				} else showHint(translate("This content will be availabled soon"));
			}
		}, {
			icon: "menuProjectStar",
			title: translate("Reset"),
			click: function(tool, item) {
				confirm(translate("Creating project"),
					translate("Current project will be erased, all unsaved data will be lost.") + " " +
					translate("Do you want to continue?"), function() {
						tool.fromProject();
				});
			}
		}]
	}];
};

ProjectTool.prototype.getExplorerLastName = function() {
	return this.explorerLastName || null;
};

ProjectTool.prototype.setExplorerLastName = function(name) {
	this.explorerLastName = String(name);
};

ProjectTool.prototype.resetExplorerLastName = function() {
	return delete this.explorerLastName;
};

ProjectTool.prototype.getExtensions = function(type) {
	let formats = [".dnp"];
	if (type == ProjectTool.ExtensionType.EXPORT) {
		if (this.hasConverter()) formats.push(".js");
	} else formats.push(".js");
	return formats;
};

ProjectTool.prototype.hasConverter = function() {
	let converter = this.getConverter();
	return converter instanceof ScriptConverter;
};

ProjectTool.prototype.getConverter = new Function();

ProjectTool.prototype.open = function(source) {
	let project = ProjectProvider.create();
	if (source !== undefined) {
		project.object = source;
	}
	if (!this.isAttached()) this.attach();
	return true;
};

ProjectTool.prototype.selectData = function(where, multiple, post) {
	selectProjectData(where, function(selected) {
		typeof post == "function" && post(selected);
	}, undefined, !multiple);
};

ProjectTool.prototype.replace = function(file) {
	let name = file.getName(),
		instance = this;
	if (name.endsWith(".dnp")) {
		let active = Date.now();
		importProject(file.getPath(), function(result) {
			instance.fromProject(selected);
			showHint(translate("Loaded success") + " " +
				translate("as %ss", preround((Date.now() - active) / 1000, 1)));
		});
	} else if (name.endsWith(".js")) {
		let active = Date.now();
		importScript(file.getPath(), function(result) {
			instance.fromProject(selected);
			showHint(translate("Converted success") + " " +
				translate("as %ss", preround((Date.now() - active) / 1000, 1)));
		});
	}
};

ProjectTool.prototype.merge = function(file) {
	let name = file.getName(),
		project = this.toProject(),
		instance = this;
	if (name.endsWith(".dnp")) {
		let active = Date.now();
		importProject(file.getPath(), function(result) {
			active = Date.now() - active;
			instance.selectData(result, true, function(selected) {
				active = Date.now() - active;
				selected.forEach(function(value) {
					project.getAll().push(value);
				});
				instance.describe();
				showHint(translate("Merged success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		});
	} else if (name.endsWith(".js")) {
		let active = Date.now();
		importScript(file.getPath(), function(result) {
			active = Date.now() - active;
			instance.selectData(result, true, function(selected) {
				active = Date.now() - active;
				selected.forEach(function(value) {
					project.getAll().push(value);
				});
				instance.describe();
				showHint(translate("Merged success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		});
	}
};

ProjectTool.prototype.export = function(file) {
	let name = file.getName(),
		project = this.toProject();
	if (name.endsWith(".dnp")) {
		exportProject(project, false, file.getPath());
	} else if (name.endsWith(".js")) {
		let converter = this.getConverter();
		if (!this.hasConverter()) MCSystem.throwException(null);
		let active = Date.now();
		tryout(function() {
			converter.attach(project);
			converter.executeAsync(function(link, result) {
				if (link.hasResult()) {
					Files.write(file, result);
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				} else retraceOrReport(link.getLastException());
			});
		});
	}
};

ProjectTool.prototype.toProject = function() {
	return ProjectProvider.getProject() || null;
};

ProjectTool.prototype.fromProject = function(source) {
	let project = ProjectProvider.create();
	if (source !== undefined) {
		project.object = source;
	}
	this.describe();
};

ProjectTool.ExtensionType = new Object();
ProjectTool.ExtensionType.REPLACE = 0;
ProjectTool.ExtensionType.MERGE = 1;
ProjectTool.ExtensionType.EXPORT = 2;

const PROJECT_TOOL = (function() {
	return new ProjectTool({
		contentEntryDescriptor: [{
			icon: "block",
			title: translate("Block"),
			click: function(tool, item) {
				attachBlockTool(function(next) {
					tool.deattach();
				});
			}
		}, {
			icon: "entity",
			title: translate("Entity"),
			background: function(tool) {
				return REVISION.indexOf("alpha") == -1 ? "popupSelectionLocked" : "popupSelectionQueued";
			},
			click: function(tool, item) {
				if (REVISION.indexOf("alpha") != -1) {
					EntityEditor.create();
					tool.deattach();
					showHint(translate("Not developed yet"));
				} else showHint(translate("This content will be availabled soon"));
			}
		}, {
			icon: "animation",
			title: translate("Animation"),
			background: "popupSelectionLocked",
			click: function(tool, item) {
				if (REVISION.startsWith("develop")) {
					AnimationWindow.create();
					tool.deattach();
				} else showHint(translate("This content will be availabled soon"));
			}
		}, {
			icon: "transition",
			title: translate("Transition"),
			click: function(tool, item) {
				TransitionEditor.create();
				tool.deattach();
			}
		}, function(tool) {
			if (supportSupportables) {
				return {
					icon: "world",
					title: translate("World"),
					click: function(tool, item) {
						if (loadSupportables && Setting) {
							if (LevelInfo.isLoaded()) {
								isSupportEnv = true;
								currentEnvironment = Setting.modName;
								let result = Setting(function() {
									try {
										rover = true;
										createButton();
										return true;
									} catch (e) {
										return e;
									}
								})[0];
								if (result != true) {
									ProjectEditor.create();
									isSupportEnv = false;
									currentEnvironment = __name__;
									retraceOrReport(result);
								} else tool.deattach();
							} else showHint(translate("Supportable module can't be loaded at menu"));
						}
					},
					hold: function(tool, item) {
						return showSupportableInfo(Setting);
					}
				};
			}
		}],
		contentProjectDescriptor: function(tool) {
			if (ProjectProvider.isInitialized()) {
				let categories = [],
					project = tool.toProject();
				if (project && project.getCount() > 0) {
					let content = project.getAll(),
						blocks = project.getBlocks();
					if (blocks && blocks.length > 0) {
						let category = categories.push({
							title: translate("Blocks"),
							clickItem: function(tool, item, index) {
								let real = blocks[index],
									block = content[real];
								attachBlockTool(real, function(next) {
									content.splice(real, 1);
									content.unshift(block);
									project.setCurrentlyId(0);
									tool.deattach();
								});
							},
							holdItem: function(tool, item, index) {
								confirm(translate("Warning!"),
									translate("Selected worker will be removed, including all it's data.") + " " +
									translate("Do you want to continue?"), function() {
										let position = blocks[index];
										if (position >= 0 && position < content.length) {
											content.splice(position, 1);
											showHint(translate("Worker has been removed"));
										} else showHint(translate("Something went wrong"));
										tool.describe();
									});
								return true;
							},
							items: []
						}) - 1;
						for (let i = 0; i < blocks.length; i++) {
							let block = content[blocks[i]],
								models = block.renderer.length + block.collision.length;
							categories[category].items.push({
								icon: "block",
								title: block.define.id,
								description: translateCounter(models, "no models", "%s1 model",
									"%s" + (models % 10) + " models", "%s models", [models])
							});
						}
					}
					if (REVISION.indexOf("alpha") != -1) {
						let entities = project.getEntities();
						if (entities && entities.length > 0) {
							let category = categories.push({
								title: translate("Entities"),
								clickItem: function(tool, item, index) {
									let real = entities[index],
										entity = content[real];
									if (EntityEditor.open(real)) {
										content.splice(real, 1);
										content.unshift(entity);
										project.setCurrentlyId(0);
										tool.deattach();
									}
								},
								holdItem: function(tool, item, index) {
									confirm(translate("Warning!"),
										translate("Selected worker will be removed, including all it's data.") + " " +
										translate("Do you want to continue?"), function() {
											let position = blocks[index];
											if (position >= 0 && position < content.length) {
												content.splice(position, 1);
												showHint(translate("Worker has been removed"));
											} else showHint(translate("Something went wrong"));
											tool.describe();
										});
									return true;
								},
								items: []
							}) - 1;
							for (let i = 0; i < entities.length; i++) {
								let entity = content[entities[i]],
									models = entity.visual.length;
								categories[category].items.push({
									icon: "entity",
									title: entity.define.id,
									description: translateCounter(models, "no models /\ tree", "%s1 model /\ tree",
										"%s" + (models % 10) + " models \/ tree", "%s models \/ tree", [models])
								});
							}
						}
					}
					let transitions = project.getTransitions();
					if (transitions && transitions.length > 0) {
						let category = categories.push({
							title: translate("Transitions"),
							clickItem: function(tool, item, index) {
								let real = transitions[index],
									transition = content[real];
								if (TransitionEditor.open(real)) {
									content.splice(real, 1);
									content.unshift(transition);
									project.setCurrentlyId(0);
									tool.deattach();
								}
							},
							holdItem: function(tool, item, index) {
								confirm(translate("Warning!"),
									translate("Selected worker will be removed, including all it's data.") + " " +
									translate("Do you want to continue?"), function() {
										let position = blocks[index];
										if (position >= 0 && position < content.length) {
											content.splice(position, 1);
											showHint(translate("Worker has been removed"));
										} else showHint(translate("Something went wrong"));
										tool.describe();
									});
								return true;
							},
							items: []
						}) - 1;
						for (let i = 0; i < transitions.length; i++) {
							let transition = content[transitions[i]],
								animates = transition.animation.length;
							categories[category].items.push({
								icon: "transition",
								title: translate("Transition"),
								description: translateCounter(animates, "no animates", "%s1 animate",
									"%s" + (animates % 10) + " animates", "%s animates", [animates]) + " / " + translate("%s fps", transition.define.fps || 60)
							});
						}
					}
				}
			}
		},
		menuDescriptor: {
			elements: [function(tool) {
				if (REVISION.indexOf("alpha") != -1) {
					return {
						type: "category",
						title: translate("Debug & testing"),
						background: "popupSelectionQueued",
						items: [{
							icon: "menuBoardConfig",
							title: translate("Tests"),
							click: function(tool, item) {
								tool.deattach();
								DebugEditor.menu();
							}
						}, {
							icon: "menuBoardInsert",
							title: translate("Console"),
							click: function(tool, item) {
								tool.deattach();
								ConsoleViewer.show();
							}
						}, {
							icon: "worldActionMeasure",
							title: translate("Log"),
							click: function(tool, item) {
								LogViewer.show();
							}
						}, {
							icon: "support",
							title: translate("Mods"),
							click: function(tool, item) {
								tool.deattach();
								ModificationSource.selector();
							}
						}, {
							icon: "explorer",
							title: translate("Explorer"),
							click: function(tool, item) {
								let explorer = new ExplorerWindow();
								explorer.setMultipleSelectable(true);
								let bar = explorer.addPath();
								bar.setOnOutsideListener(function(bar) {
									explorer.dismiss();
								});
								bar.setPath(__dir__);
								explorer.show();
							}
						}]
					};
				}
			}, function(tool) {
				if (isAnyCustomSupportableLoaded()) {
					return {
						type: "category",
						title: translate("Supportables"),
						holdItem: function(tool, item, index) {
							return showSupportableInfo([UIEditor, WorldEdit, DumpCreator, RunJSingame, InstantRunner][index]);
						},
						items: [function(tool) {
							if (UIEditor) {
								return {
									icon: UIEditor.icon,
									title: translate("UIEditor"),
									click: function(tool, item) {
										isSupportEnv = true;
										currentEnvironment = UIEditor.modName;
										let result = UIEditor(function() {
											try {
												start.open.click(null);
												return true;
											} catch (e) {
												return e;
											}
										})[0];
										if (result != true) {
											isSupportEnv = false;
											currentEnvironment = __name__;
											retraceOrReport(result);
											return;
										}
										if (!hintStackableDenied) {
											showHint(translate(UIEditor.modName) + " " + translate(UIEditor.version));
											showHint(translate(UIEditor.author));
										} else showHint(translate(UIEditor.modName) + " - " + translate(UIEditor.author));
										tool.deattach();
									}
								};
							}
						}, function(tool) {
							if (WorldEdit) {
								return {
									icon: WorldEdit.icon,
									title: translate("WorldEdit"),
									click: function(tool, item) {
										let result = WorldEdit(function() {
											try {
												let array = new Array();
												for (let item in Commands) {
													let command = Commands[item];
													array.push(command.name + (command.args && command.args.length > 0 ? " " +
														command.args : String()) + "\n" + Translation.translate(command.description));
												}
												return array.join("\n\n");
											} catch (e) {
												return e;
											}
										})[0];
										if (String(result) == result) {
											confirm(translate(WorldEdit.modName) + " " + translate(WorldEdit.version), result);
										} else if (result) retraceOrReport(result);
										if (!hintStackableDenied) {
											showHint(translate(WorldEdit.modName) + " " + translate(WorldEdit.version));
											showHint(translate(WorldEdit.author));
										} else showHint(translate(WorldEdit.modName) + " - " + translate(WorldEdit.author));
									}
								};
							}
						}, function(tool) {
							if (DumpCreator) {
								return {
									icon: DumpCreator.icon,
									title: translate("Dumper"),
									click: function(tool, item) {
										let result = DumpCreator(function() {
											try {
												return __makeAndSaveDump__.dumped;
											} catch (e) {
												return e;
											}
										})[0];
										confirm(translate(DumpCreator.modName), translate(result ? "Dump will be saved into supportable directory. Do you want to overwrite it?" :
											LevelInfo.isLoaded() ? "Dump will be generated and saved into supportable directory. This will be take a few seconds. Continue?" :
											"Launch dump generation in menu may cause crash, you can also enter into world. Continue anyway?"), function() {
											let evaluate = DumpCreator(function() {
												try {
													__makeAndSaveDump__();
													return true;
												} catch (e) {
													return e;
												}
											})[0];
											if (evaluate != true) retraceOrReport(evaluate);
										});
									}
								};
							}
						}, function(tool) {
							if (RunJSingame) {
								return {
									icon: RunJSingame.icon,
									title: translate("Run JS"),
									click: function(tool, item) {
										let result = RunJSingame(function() {
											try {
												MainUI.codeWindow();
												return true;
											} catch (e) {
												return e;
											}
										})[0];
										if (result != true) retraceOrReport(result);
										if (!hintStackableDenied) {
											showHint(translate(RunJSingame.modName) + " " + translate(RunJSingame.version));
											showHint(translate(RunJSingame.author));
										} else showHint(translate(RunJSingame.modName) + " - " + translate(RunJSingame.author));
									}
								};
							}
						}, function(tool) {
							if (InstantRunner) {
								return {
									icon: InstantRunner.icon,
									title: translate("IRunner"),
									click: function(tool, item) {
										let result = InstantRunner(function() {
											try {
												openAndroidUI();
												return true;
											} catch (e) {
												return e;
											}
										})[0];
										if (result != true) retraceOrReport(result);
										if (!hintStackableDenied) {
											showHint(translate(InstantRunner.modName) + " " + translate(InstantRunner.version));
											showHint(translate(InstantRunner.author));
										} else showHint(translate(InstantRunner.modName) + " - " + translate(InstantRunner.author));
									}
								};
							}
						}]
					};
				}
			}]
		},
		replace: function(file) {
			let name = file.getName(),
				instance = this;
			if (name.endsWith(".json")) {
				let active = Date.now();
				convertJsonBlock(Files.read(file), function(result) {
					instance.fromProject([result]);
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			} else if (name.endsWith(".ndb")) {
				let active = Date.now();
				tryout(function() {
					let obj = compileData(Files.read(file));
					instance.fromProject([convertNdb(obj)]);
					showHint(translate("Loaded success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			} else if (name.endsWith(".nds")) {
				let active = Date.now();
				tryout(function() {
					let obj = compileData(Files.read(file));
					instance.fromProject([convertNds(obj)]);
					showHint(translate("Loaded success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			}
			ProjectTool.prototype.replace.apply(this, arguments);
		},
		merge: function(file) {
			let name = file.getName(),
				project = this.toProject(),
				instance = this;
			if (name.endsWith(".json")) {
				let active = Date.now();
				convertJsonBlock(Files.read(file), function(result) {
					project.getAll().push(result);
					instance.describe();
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			} else if (name.endsWith(".ndb")) {
				let active = Date.now();
				tryout(function() {
					let obj = compileData(Files.read(file));
					project.getAll().push(convertNdb(obj));
					instance.describe();
					showHint(translate("Imported success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			} else if (name.endsWith(".nds")) {
				let active = Date.now();
				tryout(function() {
					let obj = compileData(Files.read(file));
					current.getAll().push(convertNds(obj));
					instance.describe();
					showHint(translate("Imported success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			}
			ProjectTool.prototype.merge.apply(this, arguments);
		}
	});
})();

const attachProjectTool = function(source, post) {
	if (!PROJECT_TOOL.isAttached()) {
		PROJECT_TOOL.attach();
	}
	PROJECT_TOOL.queue();
	handleThread(function() {
		let accepted = PROJECT_TOOL.open(source);
		handle(function() {
			if (accepted) {
				tryout(function() {
					post && post(PROJECT_TOOL);
					ProjectProvider.setOpenedState(false);
					PROJECT_TOOL.control();
					accepted = false;
				});
			}
			if (accepted) {
				PROJECT_TOOL.deattach();
			}
		});
	});
};

const EditorTool = function() {
	SidebarTool.apply(this, arguments);
};

EditorTool.prototype = new SidebarTool;

EditorTool.prototype.reset = function() {
	SidebarTool.prototype.reset.apply(this, arguments);
	this.menuDescriptor.elements = [{
		type: "header"
	}, {
		type: "category",
		title: translate("Editor"),
		items: [{
			icon: "menuProjectLoad",
			title: translate("Replace"),
			click: function(tool, item) {
				let formats = tool.getExtensions(EditorTool.ExtensionType.REPLACE);
				if (formats && formats.length > 0) {
					selectFile(formats, function(file) {
						tool.replace(file);
					});
					return;
				}
				showHint(translate("There's no availabled entry to replace"));
			}
		}, function(tool, category) {
			if (tool.hasMerger()) {
				return {
					icon: "menuProjectImport",
					title: translate("Merge"),
					click: function(tool, item) {
						let formats = tool.getExtensions(EditorTool.ExtensionType.MERGE);
						if (formats && formats.length > 0) {
							selectFile(formats, function(file) {
								tool.merge(file);
							});
							return;
						}
						showHint(translate("There's no availabled entry to merge"));
					}
				};
			}
		}, {
			icon: "menuProjectSave",
			title: translate("Export"),
			click: function(tool, item) {
				let formats = tool.getExtensions(EditorTool.ExtensionType.EXPORT);
				if (formats && formats.length > 0) {
					let lastName = tool.getExplorerLastName();
					saveFile(lastName, formats, function(file, name) {
						tool.export(file);
						tool.setExplorerLastName(name);
					});
					return;
				}
				showHint(translate("There's no availabled entry to export"));
			}
		}, {
			icon: "menuProjectLeave",
			title: translate("Back"),
			click: function(tool, item) {
				tool.leave();
			}
		}]
	}];
};

EditorTool.prototype.getExplorerLastName = function() {
	return this.explorerLastName || null;
};

EditorTool.prototype.setExplorerLastName = function(name) {
	this.explorerLastName = String(name);
};

EditorTool.prototype.resetExplorerLastName = function() {
	return delete this.explorerLastName;
};

EditorTool.prototype.getExtensions = function(type) {
	let formats = [".dnp"];
	if (type == EditorTool.ExtensionType.EXPORT) {
		if (this.hasConverter()) formats.push(".js");
	} else if (this.hasParser()) formats.push(".js");
	return formats;
};

EditorTool.prototype.hasConverter = function() {
	let converter = this.getConverter();
	return converter instanceof ScriptConverter;
};

EditorTool.prototype.getConverter = new Function();

EditorTool.prototype.hasMerger = function() {
	let merger = this.getMerger();
	return typeof merger == "function";
};

EditorTool.prototype.getMerger = new Function();

EditorTool.prototype.hasParser = function() {
	return false;
};

EditorTool.prototype.open = function(source) {
	let index = (function() {
		if (source !== undefined) {
			if (typeof source != "object") {
				source = ProjectProvider.getEditorById(source);
			}
			return ProjectProvider.indexOf(source);
		}
		return -1;
	})();
	let worker = this.worker = this.getWorkerFor(source);
	if (index == -1) index = ProjectProvider.getCount();
	if (source === undefined) index--;
	if (index == -1) return false;
	ProjectProvider.setupEditor(index, worker);
	if (!this.isAttached()) this.attach();
	ProjectProvider.setOpenedState(true);
	ProjectProvider.initializeAutosave();
	return true;
};

EditorTool.prototype.selectData = function(where, multiple, post) {
	selectProjectData(where, function(selected) {
		typeof post == "function" && post(selected);
	}, this.getProjectType(), !multiple);
};

EditorTool.prototype.replace = function(file) {
	let name = file.getName(),
		instance = this;
	if (name.endsWith(".dnp")) {
		let active = Date.now();
		importProject(file.getPath(), function(result) {
			active = Date.now() - active;
			instance.selectData(result, false, function(selected) {
				active = Date.now() - active;
				instance.fromProject(selected);
				showHint(translate("Loaded success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		});
	} else if (name.endsWith(".js")) {
		if (!this.hasParser()) MCSystem.throwException(null);
		let active = Date.now();
		importScript(file.getPath(), function(result) {
			active = Date.now() - active;
			instance.selectData(result, false, function(selected) {
				active = Date.now() - active;
				instance.fromProject(selected);
				showHint(translate("Converted success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		});
	}
};

EditorTool.prototype.merge = function(file) {
	let merger = this.getMerger();
	if (!this.hasMerger()) MCSystem.throwException(null);
	let name = file.getName(),
		project = this.toProject(),
		instance = this;
	if (name.endsWith(".dnp")) {
		let active = Date.now();
		importProject(file.getPath(), function(result) {
			active = Date.now() - active;
			instance.selectData(result, true, function(selected) {
				active = Date.now() - active;
				merger(project, selected, function(output) {
					instance.fromProject(output);
					showHint(translate("Merged success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			});
		});
	} else if (name.endsWith(".js")) {
		if (!this.hasParser()) MCSystem.throwException(null);
		let active = Date.now();
		importScript(file.getPath(), function(result) {
			active = Date.now() - active;
			instance.selectData(result, true, function(selected) {
				active = Date.now() - active;
				merger(project, selected, function(output) {
					instance.fromProject(output);
					showHint(translate("Merged success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			});
		});
	}
};

EditorTool.prototype.export = function(file) {
	let name = file.getName(),
		project = this.toProject();
	if (name.endsWith(".dnp")) {
		exportProject(project, false, file.getPath());
	} else if (name.endsWith(".js")) {
		let converter = this.getConverter();
		if (!this.hasConverter()) MCSystem.throwException(null);
		let active = Date.now();
		tryout(function() {
			converter.attach(project);
			converter.executeAsync(function(link, result) {
				if (link.hasResult()) {
					Files.write(file, result);
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				} else retraceOrReport(link.getLastException());
			});
		});
	}
};

EditorTool.prototype.leave = function() {
	this.deattach();
	let instance = this;
	delete instance.worker;
	attachProjectTool(undefined, function(tool) {
		tool.toProject().callAutosave();
		instance.unselect(true);
	});
};

EditorTool.prototype.getProject = function() {
	return ProjectProvider.getProject() || null;
};

EditorTool.prototype.getProjectType = function() {
	let project = this.toProject();
	if (!project) return "unknown";
	return project.type;
};

EditorTool.prototype.getWorker = function() {
	return this.worker || null;
};

EditorTool.prototype.getWorkerFor = function(source) {
	MCSystem.throwException("EditorTool.getWorkerFor must be implemented");
};

EditorTool.prototype.toProject = function() {
	let worker = this.getWorker();
	if (!worker) MCSystem.throwException(null);
	return worker.getProject();
};

EditorTool.prototype.fromProject = function(source) {
	let worker = this.getWorker();
	if (!worker) MCSystem.throwException(null);
	worker.loadProject(source);
	this.unselect(true);
	this.describe();
};

EditorTool.prototype.unselect = function(force) {
	if (force) Popups.closeAll();
};

EditorTool.ExtensionType = new Object();
EditorTool.ExtensionType.REPLACE = 0;
EditorTool.ExtensionType.MERGE = 1;
EditorTool.ExtensionType.EXPORT = 2;
