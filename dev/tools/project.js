const ProjectEditor = {
	data: new Object(),
	create: function() {
		selectMode = 0;
		ProjectProvider.setOpenedState(false);
		let button = new ControlButton();
		button.setIcon("menu");
		button.setOnClickListener(function() {
			ProjectEditor.menu();
		});
		button.show();
	},
	menu: function() {
		prepareAdditionalInformation(3 + Number(isAnyCustomSupportableLoaded()) + Number(REVISION.indexOf("alpha") != -1),
			(3 + Number(isAnyCustomSupportableLoaded()) + Number(REVISION.indexOf("alpha") != -1)) * 2);
		let control = new MenuWindow();
		attachWarningInformation(control);
		control.setOnClickListener(function() {
			ProjectEditor.create();
		});
		let header = control.addProjectHeader();
		if (ProjectProvider.isInitialized()) {
			let project = ProjectProvider.getProject();
			if (project && project.getCount()) {
				let content = project.getAll(),
					blocks = project.getBlocks();
				if (blocks && blocks.length > 0) {
					let category = header.addCategory(translate("Blocks"));
					for (let i = 0; i < blocks.length; i++) {
						let block = content[blocks[i]],
							models = block.renderer.length + block.collision.length;
						category.addItem("block", block.define.id,
							translateCounter(models, "no models", "%s1 model",
								"%s" + (models % 10) + " models", "%s models", [models]));
					}
					category.setOnItemClickListener(function(item, index) {
						let real = blocks[index],
							block = content[real];
						attachBlockTool(real, function(tool) {
							content.splice(real, 1);
							content.unshift(block);
							project.setCurrentlyId(0);
						});
						control.hide();
					});
					category.setOnItemHoldListener(function(item, index) {
						confirm(translate("Warning!"),
							translate("Selected worker will be removed, including all it's data.") + " " +
							translate("Do you want to continue?"),
							function() {
								let position = blocks[index];
								if (position >= 0 && position < content.length) {
									content.splice(position, 1);
									showHint(translate("Worker has been removed"));
								} else showHint(translate("Something went wrong"));
								ProjectEditor.menu();
							});
						return true;
					});
				}
				if (REVISION.indexOf("alpha") != -1) {
					let entities = project.getEntities();
					if (entities && entities.length > 0) {
						let category = header.addCategory(translate("Entities"));
						for (let i = 0; i < entities.length; i++) {
							let entity = content[entities[i]],
								models = entity.visual.length;
							category.addItem("entity", entity.define.id,
								translateCounter(models, "no models /\ tree", "%s1 model /\ tree",
									"%s" + (models % 10) + " models \/ tree", "%s models \/ tree", [models]));
						}
						category.setOnItemClickListener(function(item, index) {
							let real = entities[index],
								entity = content[real];
							if (EntityEditor.open(real)) {
								content.splice(real, 1);
								content.unshift(entity);
								project.setCurrentlyId(0);
								control.hide();
							}
						});
						category.setOnItemHoldListener(function(item, index) {
							confirm(translate("Warning!"),
								translate("Selected worker will be removed, including all it's data.") + " " +
								translate("Do you want to continue?"),
								function() {
									let position = entities[index];
									if (position >= 0 && position < content.length) {
										content.splice(position, 1);
										showHint(translate("Worker has been removed"));
									} else showHint(translate("Something went wrong"));
									ProjectEditor.menu();
								});
							return true;
						});
					}
				}
				let transitions = project.getTransitions();
				if (transitions && transitions.length > 0) {
					let category = header.addCategory(translate("Transitions"));
					for (let i = 0; i < transitions.length; i++) {
						let transition = content[transitions[i]],
							animates = transition.animation.length;
						category.addItem("transition", translate("Transition"), translateCounter(animates, "no animates", "%s1 animate",
							"%s" + (animates % 10) + " animates", "%s animates", [animates]) + " / " + translate("%s fps", transition.define.fps || 60));
					}
					category.setOnItemClickListener(function(item, index) {
						let real = transitions[index],
							transition = content[real];
						if (TransitionEditor.open(real)) {
							content.splice(real, 1);
							content.unshift(transition);
							project.setCurrentlyId(0);
							control.hide();
						}
					});
					category.setOnItemHoldListener(function(item, index) {
						confirm(translate("Warning!"),
							translate("Selected worker will be removed, including all it's data.") + " " +
							translate("Do you want to continue?"),
							function() {
								let position = transitions[index];
								if (position >= 0 && position < content.length) {
									content.splice(position, 1);
									showHint(translate("Worker has been removed"));
								} else showHint(translate("Something went wrong"));
								ProjectEditor.menu();
							});
						return true;
					});
				}
			}
		} else ProjectProvider.create();
		attachAdditionalInformation(control);
		let category = control.addCategory(translate("Editors"));
		category.addItem("block", translate("Block"), function() {
			attachBlockTool();
			control.hide();
		});
		category.addItem("entity", translate("Entity"), function() {
			if (REVISION.indexOf("alpha") != -1) {
				EntityEditor.create();
				control.hide();
				showHint(translate("Not developed yet"));
			} else showHint(translate("This content will be availabled soon"));
		}).setBackground(REVISION.indexOf("alpha") == -1 ? "popupSelectionLocked" : "popupSelectionQueued");
		category.addItem("animation", translate("Animation"), function() {
			if (REVISION.startsWith("develop")) {
				AnimationWindow.create();
				control.hide();
			} else showHint(translate("This content will be availabled soon"));
		}).setBackground("popupSelectionLocked");
		category.addItem("transition", translate("Transition"), function() {
			TransitionEditor.create();
			control.hide();
		});
		if (loadSupportables && supportSupportables && Setting) {
			category.addItem("world", translate("World"), function() {
				if (Level.isLoaded()) {
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
					} else control.hide();
				} else showHint(translate("Supportable module can't be loaded at menu"));
			}).setOnHoldListener(function(item) {
				return showSupportableInfo(Setting);
			});
		}
		attachAdditionalInformation(control);
		category = control.addCategory(translate("Project"));
		category.addItem("menuProjectLoad", translate("Open"), function() {
			let formats = [".dnp", ".ndb", ".nds", ".js"];
			if (ModelConverter) formats.push(".json");
			selectFile(formats, function(file) {
				ProjectEditor.replace(file);
			});
		});
		category.addItem("menuProjectImport", translate("Import"), function() {
			let formats = [".dnp", ".ndb", ".nds", ".js"];
			if (ModelConverter) formats.push(".json");
			selectFile(formats, function(file) {
				ProjectEditor.add(file);
			});
		});
		category.addItem("menuProjectSave", translate("Export"), function() {
			saveFile(ProjectEditor.data.name, ".dnp", function(file, i) {
				ProjectEditor.save(file, i);
			});
		});
		category.addItem("menuProjectManual", translate("Tutorial"), function() {
			if (REVISION.indexOf("alpha") != -1) {
				confirm(translate(NAME) + " " + translate(VERSION), translate("You're sure want to review basics tutorial?"), function() {
					TutorialSequence.ButtonInteraction.execute();
					control.hide();
				});
			} else showHint(translate("This content will be availabled soon"));
		}).setBackground(REVISION.indexOf("alpha") == -1 ? "popupSelectionLocked" : "popupSelectionQueued");
		category.addItem("menuProjectManage", translate("Reset"), function() {
			confirm(translate("Creating project"),
				translate("Current project will be erased, all unsaved data will be lost.") + " " +
				translate("Do you want to continue?"),
				function() {
					ProjectProvider.create(), ProjectEditor.menu();
				});
		});
		attachAdditionalInformation(control);
		if (REVISION.indexOf("alpha") != -1) {
			category = control.addCategory(translate("Debug & testing"));
			category.addItem("menuBoardConfig", translate("Debug"), function() {
				control.hide();
				DebugEditor.menu();
			}).setBackground("popupSelectionQueued");
			category.addItem("menuBoardInsert", translate("Console"), function() {
				ConsoleViewer.show();
				control.hide();
			}).setBackground("popupSelectionQueued");
			category.addItem("worldActionMeasure", translate("Log"), function() {
				LogViewer.show();
			}).setBackground("popupSelectionQueued");
			category.addItem("explorer", translate("Explorer"), function() {
				let explorer = new ExplorerWindow();
				explorer.setMultipleSelectable(true);
				let bar = explorer.addPath();
				bar.setOnOutsideListener(function(bar) {
					explorer.dismiss();
				});
				bar.setPath(__dir__);
				explorer.show();
			}).setBackground("popupSelectionQueued");
			category.addItem("support", translate("Mods"), function() {
				ModificationSource.selector();
			}).setBackground("popupSelectionQueued");
			attachAdditionalInformation(control);
		}
		if (isAnyCustomSupportableLoaded()) {
			category = control.addCategory(translate("Supportables")).setOnHoldItemListener(function(item, index) {
				return showSupportableInfo([UIEditor, WorldEdit, DumpCreator, RunJSingame, InstantRunner][index]);
			});
			if (UIEditor) category.addItem(UIEditor.icon, translate("UIEditor"), function() {
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
					ProjectEditor.create();
					isSupportEnv = false;
					currentEnvironment = __name__;
					retraceOrReport(result);
					return;
				}
				if (!hintStackableDenied) {
					showHint(translate(UIEditor.modName) + " " + translate(UIEditor.version));
					showHint(translate(UIEditor.author));
				} else showHint(translate(UIEditor.modName) + " - " + translate(UIEditor.author));
				control.hide();
			});
			if (WorldEdit) category.addItem(WorldEdit.icon, translate("WorldEdit"), function() {
				let result = WorldEdit(function() {
					try {
						let array = new Array();
						for (let item in Commands) {
							let command = Commands[item];
							array.push(command.name + (command.args && command.args.length > 0 ? " " +
								command.args : new String()) + "\n" + Translation.translate(command.description));
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
			});
			if (DumpCreator) category.addItem(DumpCreator.icon, translate("Dumper"), function() {
				let result = DumpCreator(function() {
					try {
						return __makeAndSaveDump__.dumped;
					} catch (e) {
						return e;
					}
				})[0];
				confirm(translate(DumpCreator.modName), translate(result ? "Dump will be saved into supportable directory. Do you want to overwrite it?" :
					Level.isLoaded() ? "Dump will be generated and saved into supportable directory. This will be take a few seconds. Continue?" :
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
			});
			if (RunJSingame) category.addItem(RunJSingame.icon, translate("Run JS"), function() {
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
			});
			if (InstantRunner) category.addItem(InstantRunner.icon, translate("IRunner"), function() {
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
			});
			attachAdditionalInformation(control);
		}
		control.show();
		finishAttachAdditionalInformation();
	},
	add: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					let current = ProjectProvider.getProject();
					selected.forEach(function(value) {
						current.getAll().push(value);
					});
					ProjectEditor.menu();
					showHint(translate("Imported success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			});
		} else if (name.endsWith(".json")) {
			let active = Date.now();
			convertJsonBlock(Files.read(file), function(result) {
				let current = ProjectProvider.getProject();
				current.getAll().push(result);
				ProjectEditor.menu();
				showHint(translate("Converted success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".ndb")) {
			let active = Date.now();
			tryout(function() {
				let current = ProjectProvider.getProject(),
					obj = compileData(Files.read(file)),
					result = convertNdb(obj);
				current.getAll().push(result);
				ProjectEditor.menu();
				showHint(translate("Imported success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".nds")) {
			let active = Date.now();
			tryout(function() {
				let current = ProjectProvider.getProject(),
					obj = compileData(Files.read(file)),
					result = convertNds(obj);
				current.getAll().push(result);
				ProjectEditor.menu();
				showHint(translate("Imported success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			importScript(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					let current = ProjectProvider.getProject();
					selected.forEach(function(value) {
						current.getAll().push(value);
					});
					ProjectEditor.menu();
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			});
		}
	},
	replace: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				let current = ProjectProvider.create();
				current.object = result;
				ProjectEditor.menu();
				showHint(translate("Loaded success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".json")) {
			let active = Date.now();
			convertJsonBlock(Files.read(file), function(result) {
				let current = ProjectProvider.create();
				current.object = [result];
				ProjectEditor.menu();
				showHint(translate("Converted success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".ndb")) {
			let active = Date.now();
			tryout(function() {
				let current = ProjectProvider.create(),
					obj = compileData(Files.read(file));
				current.object = [convertNdb(obj)];
				ProjectEditor.menu();
				showHint(translate("Loaded success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".nds")) {
			let active = Date.now();
			tryout(function() {
				let current = ProjectProvider.create(),
					obj = compileData(Files.read(file));
				current.object = [convertNds(obj)];
				ProjectEditor.menu();
				showHint(translate("Loaded success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			importScript(file.getPath(), function(result) {
				let current = ProjectProvider.create();
				current.object = result;
				ProjectEditor.menu();
				showHint(translate("Converted success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		}
	},
	save: function(file, i) {
		let name = (ProjectEditor.data.name = i, file.getName()),
			project = ProjectProvider.getProject().getAll();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		}
	}
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
				let formats = tool.getExtensions();
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
	ProjectProvider.setOpenedState(false);
	this.getProject().callAutosave();
	let instance = this;
	checkValidate(function() {
		delete instance.worker;
		ProjectEditor.menu();
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
