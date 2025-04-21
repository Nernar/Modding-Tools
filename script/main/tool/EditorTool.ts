class EditorTool extends SidebarTool {
	worker: Nullable<Worker>;
	explorerLastName: Nullable<string>;

	constructor(object?: Partial<EditorTool>) {
		super(object);
	}
	override reset() {
		super.reset();
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
					MCSystem.throwException("Modding Tools: EditorTool data associated with worker was not found, are you sure that any project opened?");
				}
				return self.worker.data;
			}
		});
	}
	getExplorerLastName() {
		return this.explorerLastName || null;
	}
	setExplorerLastName(name: string) {
		this.explorerLastName = "" + name;
	}
	resetExplorerLastName() {
		return delete this.explorerLastName;
	}
	getExtensions(type) {
		let formats = ["dnp"];
		if (type == EditorTool.ExtensionType.EXPORT) {
			if (this.hasConverter()) {
				formats.push("js");
			}
		} else if (this.hasParser()) {
			formats.push("js");
		}
		return formats;
	}
	hasConverter() {
		let converter = this.getConverter();
		return converter instanceof ScriptConverter;
	}
	getConverter() {
		return null;
	}
	hasMerger() {
		let merger = this.getMerger();
		return typeof merger == "function";
	}
	getMerger() {
		return null;
	}
	hasParser() {
		return false;
	}
	override getInteractionDescriptor() {
		if (this.worker === undefined) {
			return null;
		}
		return super.getInteractionDescriptor();
	}
	override getMenuDescriptor() {
		if (this.worker === undefined) {
			return null;
		}
		return super.getMenuDescriptor();
	}
	override getSidebarDescriptor() {
		if (this.worker === undefined) {
			return null;
		}
		return super.getSidebarDescriptor();
	}
	// Control descriptor will be obtained in any case,
	// even if project has not yet been loaded.
	open(source?: Project) {
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
		let location = ProjectProvider.indexOf(project);
		if (location != -1) {
			ProjectProvider.opened.object.splice(location, 1);
			if (index > location) {
				index--;
			}
		}
		if (index == -1) {
			ProjectProvider.setupEditor(ProjectProvider.opened.object.push(project) - 1, worker);
		} else {
			ProjectProvider.setupEditor(index, worker);
		}
		this.worker = worker;
		this.unselect(true);
		if (!this.isAttached()) this.attach();
		ProjectProvider.setOpenedState(true);
		ProjectProvider.initializeAutosave();
		return true;
	}
	selectData(where: any[], multiple?: boolean, post?: (selected: any) => void) {
		selectProjectData(where, function(selected) {
			typeof post == "function" && post(selected);
		}, this.getProjectType(), !multiple);
	}
	replace(file: java.io.File) {
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
				MCSystem.throwException("Modding Tools: No parser, try override EditorTool.hasParser");
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
	}
	merge(file: java.io.File) {
		let merger = this.getMerger();
		if (!this.hasMerger()) {
			MCSystem.throwException("Modding Tools: No merger, try override EditorTool.hasMerger");
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
			if (!this.hasParser()) MCSystem.throwException("Modding Tools: Requested js parsing, but there is no parser!");
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
	}
	export(file: java.io.File) {
		let name = file.getName(),
			project = this.toProject();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		} else if (name.endsWith(".js")) {
			let converter = this.getConverter();
			if (!this.hasConverter()) MCSystem.throwException("Modding Tools: Requested js converter, but there is no converter!");
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
	}
	leave() {
		this.deattach();
		delete this.worker;
		let self = this;
		attachProjectTool(undefined, function(tool) {
			tool.getProject().callAutosave();
			self.unselect(true);
		});
	}
	getProject() {
		return ProjectProvider.getProject() || null;
	}
	getProjectType() {
		let project = this.toProject();
		if (!project) return "unknown";
		return project.type;
	}
	getWorker() {
		return this.worker || null;
	}
	getWorkerFor(source?: Project) {
		return new Worker(source);
	}
	toProject() {
		let worker = this.getWorker();
		if (!worker) MCSystem.throwException("Modding Tools: EditorTool.toProject: No attached worker, are you sure that project prepared?");
		return worker.getProject();
	}
	fromProject(source?: Project) {
		let worker = this.getWorker();
		if (!worker) MCSystem.throwException("Modding Tools: EditorTool.fromProject: No attached worker, are you sure that project prepared?");
		worker.loadProject(source);
		this.unselect(true);
		handle.call(this, function() {
			this.describe();
		});
	}
	unselect(force?: boolean) {
		if (force) Popups.closeAll();
	}
}

namespace EditorTool {
	export enum ExtensionType {
		REPLACE = 0,
		MERGE = 1,
		EXPORT = 2
	}
}
