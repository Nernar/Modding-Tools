const ProjectTool = function(object) {
	MenuTool.apply(this, arguments);
};

ProjectTool.prototype = new MenuTool;

ProjectTool.prototype.reset = function() {
	MenuTool.prototype.reset.apply(this, arguments);
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
				} else reportError(link.getLastException());
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

ProjectTool.MenuFactory.prototype.getImage = function() {
	return "support";
};

ProjectTool.MenuFactory.prototype.getBackground = function() {
	return null;
};
