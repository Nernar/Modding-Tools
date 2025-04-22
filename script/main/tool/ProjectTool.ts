class ProjectTool extends MenuTool {
	protected contentProjectDescriptor: MenuWindow.IProjectHeader["categories"];
	protected contentEntryDescriptor: MenuWindow.ICategory["items"];
	private explorerLastName: Nullable<string>;
	static launchDependencies: boolean;
	static instantLaunchDependencies: boolean;

	constructor(object?: Partial<ProjectTool>) {
		super(object);
	}
	override reset() {
		MenuTool.prototype.reset.apply(this, arguments);
		this.controlDescriptor.logotype = "menu";
		this.contentProjectDescriptor = [];
		this.contentEntryDescriptor = [];
		this.menuDescriptor.elements = [{
			type: "projectHeader",
			categories: function(tool) {
				return calloutOrParse(this, tool.contentProjectDescriptor, Array.prototype.slice.call(arguments));
			}
		}, function(tool) {
			let items = calloutOrParse(this, tool.contentEntryDescriptor, Array.prototype.slice.call(arguments));
			if (items == null || items.length == 0) {
				return {
					type: "message",
					icon: "menuProjectManual",
					message: translate("Howdy and welcome to Modding Tools!") + "\n" + translate("Unfortunately, you didn't install any module to start something bewitching.") + " " + translate("Come back here when you find something worthwhile in Mod Browser.")
				};
			}
			return {
				type: "category",
				title: translate("Editors"),
				items: items
			};
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
				background: "popupSelectionQueued",
				click: function(tool, item) {
					showHint(translate("This content will be availabled soon"));
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
	}
	override unqueue() {
		if (isAndroid()) {
			super.unqueue();
			return;
		}
		if (ShellObserver.isInteractive()) {
			this.menu();
		}
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
	getExtensions(type: ProjectTool.ExtensionType) {
		let formats = ["dnp"];
		if (type == ProjectTool.ExtensionType.EXPORT) {
			if (this.hasConverter()) {
				formats.push("js");
			}
		} else {
			// TODO: Minimum one editor with parser required
			formats.push("js");
		}
		return formats;
	}
	hasConverter() {
		let converter = this.getConverter();
		return converter instanceof ScriptConverter;
	}
	getConverter() {
	}
	open(source?: Project) {
		let project = ProjectProvider.getProject();
		if (!ProjectProvider.isInitialized()) {
			project = ProjectProvider.create();
		}
		if (source !== undefined) {
			project.object = source;
		}
		if (!this.isAttached()) this.attach();
		return true;
	}
	selectData(where: any[], multiple?: boolean, post?: (selected: any) => void) {
		selectProjectData(where, function(selected) {
			typeof post == "function" && post(selected);
		}, undefined, !multiple);
	}
	replace(file: java.io.File) {
		let name = file.getName(),
			instance = this;
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				instance.fromProject(result);
				showHint(translate("Loaded success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			importScript(file.getPath(), function(result) {
				instance.fromProject(result);
				showHint(translate("Converted success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		}
	}
	merge(file: java.io.File) {
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
	}
	export(file: java.io.File) {
		let name = file.getName(),
			project = this.toProject();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		} else if (name.endsWith(".js")) {
			let converter = this.getConverter();
			if (!this.hasConverter()) {
				MCSystem.throwException("Modding Tools: No converter, try override ProjectTool.hasConverter!");
			}
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
	getProject() {
		return ProjectProvider.getProject() || null;
	}
	toProject() {
		let project = this.getProject();
		if (!project) MCSystem.throwException("Modding Tools: Not found attached Project, toProject is not availabled");
		return project.getAll() || null;
	}
	fromProject(source?: Project) {
		let project = ProjectProvider.create();
		if (source !== undefined) {
			project.object = source;
		}
		this.describe();
	}
}

namespace ProjectTool {
	export enum ExtensionType {
		REPLACE = 0,
		MERGE = 1,
		EXPORT = 2
	}
	export class MenuFactory {
		private projectType: Nullable<string>;

		constructor(object?: Partial<MenuFactory>, projectType?: Nullable<string>) {
			if (object && typeof object == "object") {
				merge(this, object);
			}
			this.projectType = projectType;
		}
		getTitle() {
			return translate("Editor");
		}
		getImage() {
			return "support";
		}
		getBackground() {
			return null;
		}
		getBadgeText() {
			return null;
		}
		getBadgeOverlay() {
			return null;
		}
		getEntriesCategory() {
			return null;
		}
		getProjectType() {
			return this.projectType || null;
		}
		observeEntry(what, to, index) {
			to.description = translate("%s bytes", JSON.stringify(what).length);
		}
	}
}
