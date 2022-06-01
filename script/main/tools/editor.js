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
			return calloutOrParse(this, tool.contentProjectDescriptor, Array.prototype.slice.call(arguments));
		}
	}, {
		type: "category",
		title: translate("Editors"),
		items: function(tool) {
			return calloutOrParse(this, tool.contentEntryDescriptor, Array.prototype.slice.call(arguments));
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

ProjectTool.ExtensionType = {};
ProjectTool.ExtensionType.REPLACE = 0;
ProjectTool.ExtensionType.MERGE = 1;
ProjectTool.ExtensionType.EXPORT = 2;

ProjectTool.MenuFactory = function(object, type) {
	if (object != null && typeof object == "object") {
		merge(this, object);
	}
	this.getProjectType = function() {
		return type || null;
	};
};

ProjectTool.MenuFactory.prototype.getTitle = function() {
	return translate("Editor");
};

ProjectTool.MenuFactory.prototype.getIcon = function() {
	return "support";
};

ProjectTool.MenuFactory.prototype.getBackground = function() {
	return null;
};

const Tools = {};

const PROJECT_TOOL = (function() {
	return new ProjectTool({
		tools: {},
		contentEntryDescriptor: function(tool) {
			if (!isEmpty(tool.tools)) {
				let items = [];
				for (let id in tool.tools) {
					let entry = tool.tools[id];
					items.push({
						pointer: id,
						icon: entry.getIcon(),
						title: entry.getTitle(),
						click: function(tool, item) {
							let who = Tools[this.pointer];
							if (!who.isAttached()) {
								who.attach();
							}
							PROJECT_TOOL.deattach();
							who.queue();
							handleThread(function() {
								who.sequence();
								let accepted = true;
								if (who instanceof EditorTool) {
									accepted = who.open();
								}
								acquire(function() {
									if (accepted) {
										tryout(function() {
											who.describe();
											who.unqueue();
											accepted = false;
										});
									}
									if (accepted) {
										who.deattach();
										attachProjectTool();
									}
								}, function(e) {
									retraceOrReport(e);
									attachProjectTool();
								});
							}, function(e) {
								retraceOrReport(e);
								acquire(function() {
									attachProjectTool();
								});
							});
						}
					});
				}
				if (items.length > 0) {
					return items;
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
								attachDebugTestTool(function() {
									tool.deattach();
								});
							}
						}, {
							icon: "menuBoardInsert",
							title: translate("Console"),
							click: function(tool, item) {
								tool.deattach();
								attachConsoleTool();
							}
						}, {
							icon: "inspectorMeasure",
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
			}]
		}
		// TODO: register replace, merge, open actions in editors.
		// Some realization implemented in previous commit, but
		// it highly recommended to indent it inside that code.
	});
})();

const attachProjectTool = function(source, post) {
	if (!PROJECT_TOOL.isAttached()) {
		PROJECT_TOOL.attach();
	}
	PROJECT_TOOL.queue();
	handleThread(function() {
		PROJECT_TOOL.sequence();
		let accepted = PROJECT_TOOL.open(source);
		acquire(function() {
			if (accepted) {
				tryout(function() {
					PROJECT_TOOL.describe();
					post && post(PROJECT_TOOL);
					ProjectProvider.setOpenedState(false);
					PROJECT_TOOL.unqueue();
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
					acquire(function() {
						instance.fromProject(output);
						showHint(translate("Merged success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
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
					acquire(function() {
						instance.fromProject(output);
						showHint(translate("Merged success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
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

EditorTool.ExtensionType = {};
EditorTool.ExtensionType.REPLACE = 0;
EditorTool.ExtensionType.MERGE = 1;
EditorTool.ExtensionType.EXPORT = 2;
