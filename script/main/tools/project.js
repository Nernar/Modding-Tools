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
