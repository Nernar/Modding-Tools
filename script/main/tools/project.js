const Tools = {};

const PROJECT_TOOL = (function() {
	return new ProjectTool({
		tools: {},
		contentProjectDescriptor: function(tool) {
			let project = ProjectProvider.getProject().getAll();
			if (project.length > 0) {
				let categories = {};
				for (let i = 0; i < project.length; i++) {
					let longTermSupportIndex = i;
					let entry = project[i];
					let type = entry.type || "unknown";
					if (!categories.hasOwnProperty(type)) {
						categories[type] = {
							title: type,
							items: []
						};
					}
					if (!PROJECT_TOOL.tools.hasOwnProperty(type)) {
						if (Tools.hasOwnProperty(type)) {
							Logger.Log("Dev Editor: Try registering tool " + type + " in menu if you need to interact with project", "WARNING");
						}
						categories[type].items.push({
							icon: "inspectorObject",
							title: translate("Unsupported module"),
							description: translate("not installed or loaded"),
							hold: function() {
								PROJECT_TOOL.confirmProjectEntryRemoval(longTermSupportIndex);
							}
						});
						continue;
					}
					let factory = PROJECT_TOOL.tools[type];
					if (categories[type].title == type) {
						categories[type].title = factory.getEntriesCategory() || type;
					}
					let descriptor = {
						icon: factory.getImage(),
						title: factory.getTitle(),
						click: function() {
							attachEditorTool(Tools[type], entry);
						},
						hold: function() {
							PROJECT_TOOL.confirmProjectEntryRemoval(longTermSupportIndex, descriptor.title);
						}
					};
					try {
						factory.observeEntry(entry, descriptor, i);
					} catch (e) {
						descriptor.description = formatExceptionReport(e, false);
						Logger.Log("Dev Editor: contentProjectDescriptor: " + e, "WARNING");
					}
					categories[type].items.push(descriptor);
				}
				let items = [];
				for (let type in categories) {
					items.push(categories[type]);
				}
				return items;
			}
		},
		
		contentEntryDescriptor: function(tool) {
			if (!isEmpty(tool.tools)) {
				let items = [];
				for (let id in tool.tools) {
					let entry = tool.tools[id];
					let longTermSupportIdentifier = id;
					items.push({
						icon: entry.getImage(),
						title: entry.getTitle(),
						badgeText: entry.getBadgeText(),
						badgeOverlay: entry.getBadgeOverlay(),
						click: function(tool, item) {
							attachEditorTool(Tools[longTermSupportIdentifier]);
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
								explorer.attach();
							}
						}]
					};
				}
			}]
		},
		
		confirmProjectEntryRemoval: function(index, title) {
			confirm(title || translate("Entry removal"),
				translate("Entry contents will be removed.") + "\n" + translate("Do you wish to continue?"),
				function() {
					ProjectProvider.getProject().getAll().splice(index, 1);
					PROJECT_TOOL.describeMenu();
				});
		}
		// TODO: Register replace, merge, open actions in editors.
		// Some realization implemented in previous commits, but
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
		handle(function() {
			if (!accepted) {
				if (source !== undefined) {
					return attachProjectTool(undefined, post);
				}
				MCSystem.throwException("Dev Editor: Something went wrong, try again later");
			}
			if (accepted) {
				try {
					PROJECT_TOOL.describe();
					post && post(PROJECT_TOOL);
					ProjectProvider.setOpenedState(false);
					PROJECT_TOOL.unqueue();
					accepted = false;
				} catch (e) {
					reportError(e);
				}
			}
			if (accepted) {
				PROJECT_TOOL.deattach();
			}
		});
	});
};

const attachEditorTool = function(who, what, post) {
	if (!who.isAttached()) {
		who.attach();
	}
	PROJECT_TOOL.deattach();
	who.queue(what);
	handleThread(function() {
		try {
			who.sequence();
			let accepted = true;
			if (who instanceof EditorTool) {
				accepted = who.open(what);
			}
			handle(function() {
				try {
					if (!accepted) {
						MCSystem.throwException("Dev Editor: Target project is not validated, aborting!");
					}
					if (accepted) {
						try {
							who.describe();
							post && post(who);
							who.unqueue();
							accepted = false;
						} catch (e) {
							if (e != null) {
								reportError(e);
							}
						}
					}
					if (accepted) {
						who.deattach();
						attachProjectTool();
					}
				} catch (e) {
					reportError(e);
					attachProjectTool();
				}
			});
		} catch (e) {
			// Throw null when startup interrupted, nothing will be reported
			if (e != null) {
				reportError(e);
			}
			handle(function() {
				try {
					who.deattach();
				} catch (e) {
					Logger.Log("Dev Editor: Tool.deattach: " + e, "WARNING");
				}
				attachProjectTool();
			});
		}
	});
};
