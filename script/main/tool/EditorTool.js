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
	let self = this;
	Object.defineProperty(this, "data", {
		enumerable: true,
		get: function() {
			if (self.worker === undefined) {
				MCSystem.throwException("ModdingTools: EditorTool data associated with worker was not found, are you sure that any project opened?");
			}
			return self.worker.data;
		}
	});
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
	delete this.worker;
	let worker = this.getWorkerFor(source);
	let project = worker.getProject();
	if ((index = ProjectProvider.indexOf(project)) == -1) {
		ProjectProvider.setupEditor(ProjectProvider.opened.object.push(project) - 1, worker);
		// TODO: Project will be crashed if old-type rebuildable data is used
		// if ((index = ProjectProvider.indexOf(project)) == -1) {
			// return false;
		// }
	} else {
		ProjectProvider.setupEditor(index, worker);
	}
	this.worker = worker;
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
		if (!this.hasParser()) {
			MCSystem.throwException("ModdingTools: No parser, try override EditorTool.hasParser");
		}
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
	if (!this.hasMerger()) {
		MCSystem.throwException("ModdingTools: No merger, try override EditorTool.hasMerger");
	}
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
		if (!this.hasParser()) MCSystem.throwException("ModdingTools: Requested js parsing, but there is no parser!");
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
		if (!this.hasConverter()) MCSystem.throwException("ModdingTools: Requested js converter, but there is no converter!");
		let active = Date.now();
		try {
			converter.attach(project);
			converter.executeAsync(function(link, result) {
				if (link.hasResult()) {
					Files.write(file, result);
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				} else reportError(link.getLastException());
			});
		} catch (e) {
			reportError(e);
		}
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
	return new Worker(source);
};

EditorTool.prototype.toProject = function() {
	let worker = this.getWorker();
	if (!worker) MCSystem.throwException("ModdingTools: EditorTool.toProject: No attached worker, are you sure that project prepared?");
	return worker.getProject();
};

EditorTool.prototype.fromProject = function(source) {
	let worker = this.getWorker();
	if (!worker) MCSystem.throwException("ModdingTools: EditorTool.fromProject: No attached worker, are you sure that project prepared?");
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
