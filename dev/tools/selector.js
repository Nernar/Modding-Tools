let StartEditor = {
	data: new Object(),
	create: function() {
		try {
			selectMode = 0;
			ProjectEditor.setOpenedState(false);
			let button = new ControlButton();
			button.setIcon("menu");
			button.setOnClickListener(function() {
				StartEditor.menu();
			});
			button.show();
		} catch (e) {
			reportError(e);
		}
	},
	menu: function() {
		try {
			let control = new ControlWindow();
			control.setOnClickListener(function() {
				StartEditor.create();
			});
			let header = control.addProjectHeader();
			if (ProjectEditor.isInitialized()) {
				let project = ProjectEditor.getProject();
				if (project && project.getCount()) {
					let content = project.getAll(),
						blocks = project.getBlocks();
					if (blocks && blocks.length > 0) {
						let category = header.addCategory(translate("Blocks"));
						for (let i = 0; i < blocks.length; i++) {
							let block = content[blocks[i]], models = block.
								renderer.length + block.collision.length;
							category.addItem("block", block.define.id,
								translateCounter(models, "no models", "%s1 model",
								"%s" + (models % 10) + " models", "%s models", [models]));
						}
						category.setOnItemClickListener(function(item, index) {
							let real = blocks[index], block = content[real];
							if (BlockEditor.open(real)) content.splice(real, 1),
								content.unshift(block), project.setCurrentlyId(0),
								control.dismiss();
						});
					}
					let entities = project.getEntities();
					if (entities && entities.length > 0) {
						let category = header.addCategory(translate("Entities"));
						for (let i = 0; i < entities.length; i++) {
							let entity = content[entities[i]], models = entity.visual.length;
							category.addItem("entity", entity.define.id,
								translateCounter(models, "no models /\ tree", "%s1 model /\ tree",
								"%s" + (models % 10) + " models \/ tree", "%s models \/ tree", [models]));
						}
						category.setOnItemClickListener(function(item, index) {
							let real = entities[index], entity = content[real];
							if (EntityEditor.open(real)) content.splice(real, 1),
								content.unshift(entity), project.setCurrentlyId(0),
								control.dismiss();
						});
					}
					let transitions = project.getTransitions();
					if (transitions && transitions.length > 0) {
						let category = header.addCategory(translate("Transitions"));
						for (let i = 0; i < transitions.length; i++) {
							let transition = content[transitions[i]], animates = transition.animation.length;
							category.addItem("transition", translate("Transition") + " (" + (transition.define.
								fps || 60) + " fps)", translateCounter(animates, "no animates", "%s1 animate",
								"%s" + (animates % 10) + " animates", "%s animates", [animates]));
						}
						category.setOnItemClickListener(function(item, index) {
							let real = transitions[index], transition = content[real];
							if (TransitionEditor.open(real)) content.splice(real, 1),
								content.unshift(transition), project.setCurrentlyId(0),
								control.dismiss();
						});
					}
				}
			} else ProjectEditor.create();
			let category = control.addCategory(translate("Editors"));
			category.addItem("block", translate("Block"), function() {
				BlockEditor.create();
				control.dismiss();
			});
			category.addItem("entity", translate("Entity"), function() {
				showHint(translate("This content will be awailabled soon"));
				// EntityEditor.create();
				// control.dismiss();
			}).setBackground("popupSelectionLocked");
			category.addItem("animation", translate("Animation"), function() {
				showHint(translate("This content will be awailabled soon"));
				// AnimationWindow.create();
				// control.dismiss();
			}).setBackground("popupSelectionLocked");
			category.addItem("transition", translate("Transition"), function() {
				TransitionEditor.create();
				control.dismiss();
			});
			if (loadSupportables && supportSupportables && Setting)
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
							return false;
						})[0];
						if (result != true) {
							StartEditor.create();
							isSupportEnv = false;
							currentEnvironment = __name__;
							if (result != false) reportError(result);
						} else control.dismiss();
					} else showHint(translate("Supportable module can't be loaded at menu"));
				});
			checkForAdditionalInformation(control);
			category = control.addCategory(translate("Project"));
			category.addItem("menuProjectLoad", translate("Open"), function() {
				let formats = [".dnp", ".ndb", ".nds", ".js"];
				if (ModelConverter) formats.push(".json");
				selectFile(formats, function(file) {
					StartEditor.replace(file);
				});
			});
			category.addItem("menuProjectImport", translate("Import"), function() {
				let formats = [".dnp", ".ndb", ".nds", ".js"];
				if (ModelConverter) formats.push(".json");
				selectFile(formats, function(file) {
					StartEditor.add(file);
				});
			});
			category.addItem("menuProjectSave", translate("Export"), function() {
				saveFile(StartEditor.data.name, [".dnp", ".js"], function(file, i) {
					StartEditor.save(file, i);
				});
			});
			category.addItem("menuLoginServer", translate("Upload")).setBackground("popupSelectionLocked");
			category.addItem("menuProjectManage", translate("Manage"), function() {
				confirm(translate("Creating project"),
					translate("Current project will be erased, all unsaved data will be lost.") + " " +
					translate("Do you want to continue?"), function() {
						ProjectEditor.create(), StartEditor.menu();
					});
			});
			checkForAdditionalInformation(control);
			if (__code__.startsWith("develop")) {
				category = control.addCategory(translate("Debug"));
				category.addItem(null, translate("Minify"), function() {
					selectFile([".js"], function(file) {
						let text = Files.read(file);
						saveFile(null, [".js"], function(file) {
							minifyJs(text, function(result) {
								Files.write(file, result);
							});
						});
					});
				});
				category.addItem(null, translate("Fetch"), function() {
					handleThread(function() {
						let list = BrowserWorker.fetchList();
						let count = BrowserWorker.getCount();
						handle(function() {
							confirm(list.length + "/" + count + " mods", list.join("\n"));
						});
					});
				});
				category.addItem(null, translate("Install"), function() {
					handleThread(function() {
						new java.io.File(__dir__ + "mods").mkdirs();
				    	let worker = new BrowserWorker();
				    	let fetched = new Array();
				    	worker.setCallback({
				    		onFetchMod: function(list, mod) {
				    			fetched.push(mod.title + " " + mod.version_name);
				    			print(mod.title + ": " + mod.description);
				    		},
				    		onUrlChanged: function(reader, url) {
				    			print("new url: " + url);
				    		},
				    		onReadLine: function(reader, result, line) {
				    			print(line);
				    		}
				    	});
				    	let list = worker.getList();
				    	for (let i = 0; i < list.length; i++) {
				    		let file = new java.io.File(__dir__ + "mods", list[i].title);
				    		if (!file.exists()) file.mkdirs();
				    		else Files.deleteDir(file.getPath());
				    		worker.download(list[i].id, file);
				    	}
				    	handle(function() {
				    		confirm("Done", "Downloaded " + list.length + " mods\n" + fetched.join("\n"));
							Files.write(new java.io.File(__dir__ + "mods", "fetch.json"), JSON.stringify(list));
				    	});
					});
				});
				checkForAdditionalInformation(control);
			}
			if (loadSupportables && supportSupportables && (DumpCreator || UIEditor || InstantRunner || WorldEdit)) {
				category = control.addCategory(translate("Supportables"));
				if (DumpCreator) category.addItem(DumpCreator.icon, translate("Dumper"), function() {
					let result = DumpCreator(function() {
						try {
							return __makeAndSaveDump__.dumped;
						} catch (e) {
							return e;
						}
						return false;
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
								return false;
							})[0];
							if (evaluate != true && evaluate != false) reportError(evaluate);
					});
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
						return false;
					})[0];
					if (result != true) {
						StartEditor.create();
						isSupportEnv = false;
						currentEnvironment = __name__;
						if (result != false) reportError(result);
						return;
					}
					if (!hintStackableDenied) {
						showHint(UIEditor.modName + " " + UIEditor.version);
						showHint(UIEditor.author);
					} else showHint(UIEditor.modName + " - " + UIEditor.author);
					control.dismiss();
				});
				if (InstantRunner) category.addItem(InstantRunner.icon, translate("IRunner"), function() {
					let result = InstantRunner(function() {
						try {
							openAndroidUI();
							return true;
						} catch (e) {
							return e;
						}
						return false;
					})[0];
					if (result != true && result != false) reportError(result);
					if (!hintStackableDenied) {
						showHint(InstantRunner.modName + " " + InstantRunner.version);
						showHint(InstantRunner.author);
					} else showHint(InstantRunner.modName + " - " + InstantRunner.author);
				});
				if (WorldEdit) category.addItem(WorldEdit.icon, translate("WorldEdit"), function() {
					let result = WorldEdit(function() {
						try {
							let array = new Array();
							for (let i in Commands) {
								let command = Commands[i];
								array.push(command.name + (command.args && command.args.length > 0 ?
									" " + command.args : "") + "\n" + command.description);
							}
							return array.join("\n\n");
						} catch (e) {
							return e;
						}
						return null;
					})[0];
					if (result instanceof Error) reportError(result);
					else if (result) confirm(WorldEdit.modName + " " + WorldEdit.version, result);
					if (!hintStackableDenied) {
						showHint(WorldEdit.modName + " " + WorldEdit.version);
						showHint(WorldEdit.author);
					} else showHint(WorldEdit.modName + " - " + WorldEdit.author);
				});
				checkForAdditionalInformation(control);
			}
			resetAdditionalInformation();
			control.show();
		} catch (e) {
			reportError(e);
		}
	},
	add: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				handle(function() {
					active = Date.now() - active;
					selectProjectData(result, function(selected) {
						active = Date.now() - active;
						let current = ProjectEditor.getProject();
						current.object = assign(current.getAll(), selected);
						StartEditor.menu();
						showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
					});
				});
			});
		} else if (name.endsWith(".json")) {
			let active = Date.now();
			convertJsonBlock(Files.read(file), function(result) {
				let current = ProjectEditor.getProject();
				current.object = assign(current.getAll(), [result]);
				StartEditor.menu();
				showHint(translate("Converted success") + " " + translate("as %s ms", Date.now() - active));
			});
		} else if (name.endsWith(".ndb")) {
			let active = Date.now();
			handle(function() {
				let current = ProjectEditor.getProject(),
					obj = compileData(Files.read(file)),
					result = [convertNdb(obj)];
				current.object = assign(current.getAll(), result);
				StartEditor.menu();
				showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
			});
		} else if (name.endsWith(".nds")) {
			let active = Date.now();
			handle(function() {
				let current = ProjectEditor.getProject(),
					obj = compileData(Files.read(file)),
					result = [convertNds(obj)];
				current.object = assign(current.getAll(), result);
				StartEditor.menu();
				showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
			});
		}
	},
	replace: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				handle(function() {
					let current = ProjectEditor.create();
					current.object = assign(current.getAll(), result);
					StartEditor.menu();
					showHint(translate("Loaded success") + " " + translate("as %s ms", Date.now() - active));
				});
			});
		} else if (name.endsWith(".json")) {
			let active = Date.now();
			convertJsonBlock(Files.read(file), function(result) {
				let current = ProjectEditor.create();
				current.object = [result];
				StartEditor.menu();
				showHint(translate("Converted success") + " " + translate("as %s ms", Date.now() - active));
			});
		} else if (name.endsWith(".ndb")) {
			let active = Date.now();
			handle(function() {
				let current = ProjectEditor.create(),
					obj = compileData(Files.read(file));
				current.object = [convertNdb(obj)];
				StartEditor.menu();
				showHint(translate("Loaded success") + " " + translate("as %s ms", Date.now() - active));
			});
		} else if (name.endsWith(".nds")) {
			let active = Date.now();
			handle(function() {
				let current = ProjectEditor.create(),
					obj = compileData(Files.read(file));
				current.object = [convertNds(obj)];
				StartEditor.menu();
				showHint(translate("Loaded success") + " " + translate("as %s ms", Date.now() - active));
			});
		}
	},
	save: function(file, i) {
		let name = (StartEditor.data.name = i, file.getName()),
			project = ProjectEditor.getProject().getAll();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		}
	}
};

function checkForAdditionalInformation(control) {
	if (hasAdditionalInformation(warningMessage)) {
		control.addMessage("menuLoginServer", translate(warningMessage), function(message) {
			control.removeElement(message), warningMessage = null;
		});
	}
	if (ProjectEditor.getCount() == 0 && random(0, 4) == 0)
		if (hasAdditionalInformation("editorCreateInformation"))
			control.addMessage("blockModuleVariation", translate("Load or create your first editor, it'll appear here."));
	if (noImportedScripts && random(0, 4) == 0)
		if (hasAdditionalInformation("scriptImportInformation"))
			control.addMessage("explorerExtensionScript", translate("Use scripts from your mods to import, simply find them in internal exporer."));
	if (keyExpiresSoon && random(0, 9) == 0)
		if (hasAdditionalInformation("keyExpiresNotification"))
			control.addMessage("menuLoginKey", translate("Key needs validation and will be expires soon. Please, check network connection, or you have risk to lost testing abilities."));
	if (ProjectEditor.getCurrentType() == "block") {
		let worker = ProjectEditor.getProject().getCurrentWorker();
		if (worker && (worker.Renderer.getModelCount() > 1 || worker.Collision.getModelCount() > 1))
			if (hasAdditionalInformation("moreOneModelsWarning"))
				control.addMessage("blockRenderMove", translate("Opened editor contains >1 models one of type. At currently moment, editor doesn't support few models.") +
					" " + translate("Touch here to merge all models."), function(message) {
						confirm(translate("Outliner"), translate("All models will be merged into one.") +
							" " + translate("Do you want to continue?"), function() {
								let active = Date.now(),
									renderer = worker.Renderer.getModels(),
									collision = worker.Collision.getModels();
								if (renderer && renderer.length > 1) {
									let source = renderer[0].params;
									for (let i = 1; i < renderer.length; i++)
										source = assign(source, renderer[i].params);
									worker.Renderer.setParams([source]);
								}
								if (collision && collision.length > 1) {
									let source = collision[0].params;
									for (let i = 1; i < collision.length; i++)
										source = assign(source, collision[i].params);
									worker.Collision.setParams([source]);
								}
								control.removeElement(message);
								showHint(translate("Merged") + " " + translate("as %s ms", Date.now() - active));
							});
					});
	}
	// TODO: Add more hints
}

function hasAdditionalInformation(message) {
	if (!message) return false;
	if (checkForAdditionalInformation.already.indexOf(message) == -1)
		return (checkForAdditionalInformation.already.push(message), true);
	return false;
}

function resetAdditionalInformation() {
	checkForAdditionalInformation.already = new Array();
}

resetAdditionalInformation();

function selectProjectData(result, action, single) {
	try {
		if (!result || result.length == 0) return;
		if (result.length == 1) {
			action && action(single ? result[0] : result);
			return;
		}
		let items = [], selected = [], real = [];
		result.forEach(function(element, index) {
			if (element && element.type) {
				switch (element.type) {
					case "block":
						let renderers = element.renderer.length + element.collision.length;
						items.push(translate("Block: %s", element.define.id) + "\n"
							+ translateCounter(renderers, "no models", "%s1 model",
							"%s" + (renderers % 10) + " models", "%s models", [renderers]));
						break;
					case "entity":
						let models = element.visual.length;
						items.push(translate("Entity: %s", element.define.id) + "\n"
							+ translateCounter(models, "no models /\ tree", "%s1 model /\ tree",
							"%s" + (models % 10) + " models \/ tree", "%s models \/ tree", [models]));
						break;
					case "transition":
						let animates = element.animation.length;
						items.push(translate("Transition: %s", (element.define.fps || 60) + " fps") + "\n"
							+ translateCounter(animates, "no animates", "%s1 animate",
							"%s" + (animates % 10) + " animates", "%s animates", [animates]));
						break;
				}
				(!single) && selected.push(!!importAutoselect);
				real.push(index);
			}
		});
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		builder.setTitle(translate("Element selector"));
		single ? builder.setItems(items, action ? function(dialog, item) {
			try { action(result[real[item]]); }
			catch (e) { reportError(e); }
		} : null) : builder.setMultiChoiceItems(items, selected, function(dialog, item, active) {
			try { selected[item] = active; }
			catch (e) { reportError(e); }
		});
		builder.setNegativeButton(translate("Cancel"), null);
		if (!single) {
			builder.setNeutralButton(translate("All"), action ? function() {
				try { action(result); }
				catch (e) { reportError(e); }
			} : null);
			builder.setPositiveButton(translate("Select"), action ? function() {
				try {
					let value = new Array();
					selected.forEach(function(element, index) {
						element && value.push(result[real[index]]);
					});
					if (value.length == 0)
						selectProjectData(result, action);
					else action(value);
				} catch (e) {
					reportError(e);
				}
			} : null);
		}
		builder.setCancelable(false);
		builder.create().show();
	} catch (e) {
		reportError(e);
	}
}

function convertJsonBlock(string, action) {
	if (!ModelConverter) return;
	let runned = compileData("(function() {\n" + ModelConverter + "\n" +
		"document.getElementById(\"name\").value = " + string + ";\n" +
		"myFunction();\nreturn {\nvalue: document.getElementById(\"frm2\").value,\n" +
		"logged: console.logged.join(\"\\n\")\n};\n})()",
		"object", {
			document: {
				elements: {
					name: new Object(),
					frm2: new Object()
				},
				getElementById: function(id) {
					return this.elements[id] || null;
				}
			},
			console: {
				logged: new Array(),
				log: function(e) {
					this.logged.push(e.message);
				}
			}
		});
	if (runned instanceof Error) reportError(runned);
	else if (runned && runned.value) {
		let compiled = compileScript(runned);
		if (compiled && compiled[0]) action && action(compiled[0]);
		else confirm(translate("Compilation failed"),
			translate("Converter generated invalid script, they can't be runned.") + " " +
				translate("Retry compile with another converted model.") + " " +
				translate("Save exported result?"), function() {
					saveFile(translate("converted"), [".js"], function(file) {
						Files.write(file, runned.value);
					});
				});
		if (runned.logged) confirm(translate("Script report"),
			translate("Script logging have several messages:") + "\n" + runned.logged);
	}
}

function showSupportableInfo(mod) {
	try {
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		builder.setTitle(translate(mod.modName) + " " + mod.version);
		builder.setMessage((mod.description ? translate(mod.description) + "\n" : "") +
			translate("Developer: %s", (mod.author || translate("Unknown")) + "\n" +
			translate("State: %s", "" + translate(mod.result == true ? "ACTIVE" :
				mod.result == false ? "OUTDATED" : mod.result instanceof Error == true ?
				"FAILED" : !mod.result ? "DISABLED" : "UNKNOWN"))));
		builder.setPositiveButton(translate("OK"), null);
		builder.create().show();
	} catch (e) {
		reportError(e);
	}
}

function confirm(title, message, action) {
	try {
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		builder.setTitle(title || translate("Confirmation"));
		if (message) builder.setMessage("" + message);
		builder.setNegativeButton(translate("Cancel"), null);
		builder.setPositiveButton(translate("Yes"), action ? function() {
			try { action && action(); }
			catch (e) { reportError(e); }
		} : null);
		builder.setCancelable(false);
		builder.create().show();
	} catch (e) {
		reportError(e);
	}
}

function selectFile(formats, onSelect, outside) {
	show(Dirs.EXPORT, true);
	function show(path, notRoot) {
		try {
			if (useOldExplorer) {
				let files = Files.listFileNames(path),
					generated = Files.listDirectoryNames(path),
					formatted = Files.checkFormats(files, formats);
				if (notRoot) generated.unshift(translate("... parent folder"));
				for (let i in formatted) generated.push(formatted[i]);
				
				let builder = new android.app.AlertDialog.Builder(context, android.R.style.Theme_Holo_Dialog);
				builder.setTitle(("" + path).replace(Dirs.EXTERNAL, ""));
				builder.setNegativeButton(translate("Cancel"), null);
				builder.setItems(generated, function(d, i) {
					try {
						if (notRoot && i == 0) {
							let file = new java.io.File(path), parent = file.getParent();
							show(parent, Dirs.EXTERNAL == parent + "/" ? false : true);
						} else {
							let file = new java.io.File(path, generated[i]);
							if (file.isDirectory()) show(file.getPath(), true);
							else if (onSelect) onSelect(file);
						}
					} catch (e) {
						reportError(e);
					}
				});
				
				let alert = builder.create();
				alert.show();
			} else {
				let explorer = new ExplorerWindow();
				formats && explorer.setFilter(formats);
				let bar = explorer.addPath();
				bar.setPath(path), bar.setOnOutsideListener(function(bar) {
					explorer.dismiss();
					outside && outside();
				});
				explorer.setOnApproveListener(function(window, files) {
					explorer.dismiss();
					onSelect && onSelect(files[0]);
				});
				explorer.show();
			}
		} catch (e) {
			reportError(e);
		}
	}
}

function saveFile(currentName, formats, onSelect, outside) {
	let currentFormat = 0;
	show(Dirs.EXPORT, true);
	function show(path, notRoot) {
		try {
			if (useOldExplorer) {
				let files = Files.listFileNames(path),
					generated = Files.listDirectoryNames(path),
					formatted = Files.checkFormats(files, formats);
				if (notRoot) generated.unshift(translate("... parent folder"));
				for (let i in formatted) generated.push(formatted[i]);
				
				let layout = new android.widget.LinearLayout(context);
				layout.setGravity(Ui.Gravity.CENTER);
				let edit = new android.widget.EditText(context);
				currentName && edit.setText(currentName);
				edit.setHint(translate("project"));
				edit.setTextColor(Ui.Color.WHITE);
				edit.setHintTextColor(Ui.Color.LTGRAY);
				edit.addTextChangedListener({
					onTextChanged: function(text) {
						if (text.length > 0) currentName = "" + text;
						else currentName = translate("project");
					}
				});
				edit.setBackgroundDrawable(null);
				edit.setCursorVisible(false);
				edit.setMaxLines(1);
				layout.addView(edit);
				let text = new android.widget.TextView(context);
				text.setText(formats[currentFormat]);
				text.setTextColor(Ui.Color.WHITE);
				text.setOnClickListener(function() {
					if (currentFormat == formats.length - 1) currentFormat = 0;
					else currentFormat++;
					text.setText(formats[currentFormat]);
				});
				layout.addView(text);
				
				let builder = new android.app.AlertDialog.Builder(context, android.R.style.Theme_Holo_Dialog);
				builder.setTitle(("" + path).replace(Dirs.EXTERNAL, ""));
				builder.setPositiveButton(translate("Export"), function() {
					let file = new java.io.File(path, edit.getText() + text.getText());
					if (onSelect) onSelect(file, currentName);
				});
				builder.setNegativeButton(translate("Cancel"), null);
				builder.setItems(generated, function(d, i) {
					try {
						if (notRoot && i == 0) {
							let file = new java.io.File(path), parent = file.getParent();
							show(parent, Dirs.EXTERNAL == parent + "/" ? false : true);
						} else {
							let file = new java.io.File(path, generated[i]);
							if (file.isDirectory()) show(file.getPath(), true);
							else if (onSelect) onSelect(file, currentName);
						}
					} catch (e) {
						reportError(e);
					}
				});
				builder.setView(layout);
				
				let alert = builder.create();
				alert.show();
			} else {
				let explorer = new ExplorerWindow();
				formats && explorer.setFilter(formats);
				let bar = explorer.addPath();
				bar.setPath(path), bar.setOnOutsideListener(function(bar) {
					explorer.dismiss();
					outside && outside();
				});
				let rename = explorer.addRename();
				rename.setAvailabledTypes(formats);
				currentName && rename.setName(currentName);
				rename.setOnApproveListener(function(window, file, last) {
					explorer.dismiss();
					onSelect && onSelect(file, last);
				});
				explorer.show();
			}
		} catch (e) {
			reportError(e);
		}
	}
}

function compileData(text, type, scope) {
	if (type == "string") text = "\"" + text + "\"";
	let code = "(function() { return " + text + "; })();",
		scope = runAtScope(code, scope || {}, "Dev Editor$compile.js");
	return scope.error ? scope.error : !type ? scope.result :
		type == "string" ? ("" + scope.result) :
		type == "number" ? parseInt(scope.result) :
		type == "float" ? parseFloat(scope.result) :
		type == "object" ? scope.result : null;
}

function preround(number, fixed) {
	// Avoids large fractions in project
	typeof fixed == "undefined" && (fixed = 6);
	return parseFloat(new Number(number).toFixed(fixed));
}
