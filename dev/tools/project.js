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
		let control = new ControlWindow();
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
						if (BlockEditor.open(real)) {
							content.splice(real, 1);
							content.unshift(block);
							project.setCurrentlyId(0);
							control.dismiss();
						}
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
								control.dismiss();
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
							control.dismiss();
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
			BlockEditor.create();
			control.dismiss();
		});
		category.addItem("entity", translate("Entity"), function() {
			if (REVISION.indexOf("alpha") != -1) {
				EntityEditor.create();
				control.dismiss();
				showHint(translate("Not developed yet"));
			} else showHint(translate("This content will be availabled soon"));
		}).setBackground(REVISION.indexOf("alpha") == -1 ? "popupSelectionLocked" : "popupSelectionQueued");
		category.addItem("animation", translate("Animation"), function() {
			if (REVISION.startsWith("develop")) {
				AnimationWindow.create();
				control.dismiss();
			} else showHint(translate("This content will be availabled soon"));
		}).setBackground("popupSelectionLocked");
		category.addItem("transition", translate("Transition"), function() {
			TransitionEditor.create();
			control.dismiss();
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
						reportError(result);
					} else control.dismiss();
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
					control.dismiss();
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
				DebugEditor.menu();
				control.dismiss();
			}).setBackground("popupSelectionQueued");
			category.addItem("menuBoardInsert", translate("Console"), function() {
				ConsoleViewer.show();
				control.dismiss();
			}).setBackground("popupSelectionQueued");
			category.addItem("worldActionMeasure", translate("Log"), function() {
				LogViewer.show();
			}).setBackground("popupSelectionQueued");
			category.addItem("worldLayerMove", translate("Hieracly"), function() {
				let popup = new HieraclyPopup();
				popup.setTitle(translate("Bones"));
				popup.setOnClickListener(function(name, parents) {
					showHint(name + ": " + parents.join(", "));
				});
				popup.setOnSelectListener(function(name, parents) {
					showHint(name + ": " + parents.join(","));
				});
				popup.addFooter("controlAdd");
				popup.addFooter("controlEdit");
				popup.addFooter("controlRemove");
				popup.addGroup("body");
				popup.addItem("main", "body");
				popup.addItem("side", "body");
				popup.addItem("outside");
				popup.addItem("attachment", "body");
				popup.addItem("hat", "body");
				popup.addGroup("chestplate", "body");
				popup.addItem("tail", "chestplate");
				popup.addItem("paw", "chestplate");
				popup.addGroup("horns", "chestplate");
				popup.addItem("box", "horns");
				popup.addItem("container", "body");
				Popups.open(popup, "bone_select");
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
					reportError(result);
					return;
				}
				if (!hintStackableDenied) {
					showHint(translate(UIEditor.modName) + " " + translate(UIEditor.version));
					showHint(translate(UIEditor.author));
				} else showHint(translate(UIEditor.modName) + " - " + translate(UIEditor.author));
				control.dismiss();
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
				} else if (result) reportError(result);
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
					if (evaluate != true) reportError(evaluate);
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
				if (result != true) reportError(result);
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
				if (result != true) reportError(result);
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
