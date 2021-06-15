/**
 * Attaches information messages to control menus.
 * Requires [[prepareAdditionalInformation]] call
 * to provide control sizes and limit count.
 * @param {ControlWindow} control menu to attach
 * @returns {boolean} can be attached more
 */
const attachAdditionalInformation = function(control) {
	let session = attachAdditionalInformation.session;
	if (session === undefined) throw null;
	return session.hasMore() && session.attachNext(control);
};

const attachWarningInformation = function(control) {
	if (keyExpiresSoon) {
		control.addMessage("menuNetworkKey", translate("Key needs validation and will be expires soon. Please, check network connection, or you have risk to lost testing abilities."));
	} else if (warningMessage !== null) {
		control.addMessage("menuNetwork", translate(warningMessage), function(message) {
			control.removeElement(message), warningMessage = null;
		});
	}
};

const prepareAdditionalInformation = function(count, limit) {
	attachAdditionalInformation.session = new AdditionalMessageFactory.Session(count, limit);
};

const finishAttachAdditionalInformation = function() {
	let session = attachAdditionalInformation.session;
	if (session === undefined) return false;
	session.complete();
	delete attachAdditionalInformation.session;
	return true;
};

const registerAdditionalInformation = function() {
	if (AdditionalMessageFactory.getRegisteredCount() > 0) AdditionalMessageFactory.resetAll();
	AdditionalMessageFactory.register("blockDefineType", translate("Modification still in development state, so something may not work properly."), 0.2);
	AdditionalMessageFactory.register("block", translate("Create custom variations, renders, shapes and collisions in-game with block editor."), 0.2);
	AdditionalMessageFactory.register("entity", translate("Add or load self render, visualize it and create custom intellect pathes in-game with entity editor."), 0);
	AdditionalMessageFactory.register("animation", translate("Transform custom shapes, visualize your own render and just draw it in-game with animation editor."), 0);
	AdditionalMessageFactory.register("transition", translate("Record wonderful video or make quest-modded map in-game with transition editor."), 0.2);
	AdditionalMessageFactory.register("world", translate("Manipulate with world regions, fill, replace and save your buildings with world editor."), 0.2);
	AdditionalMessageFactory.register("explorerExtensionProject", translate("Load or create your first editor, it'll appear here."), 0.75, function() {
		return ProjectProvider.getCount() == 0;
	});
	AdditionalMessageFactory.register("explorerExtensionScript", translate("Use scripts from your mods to import, simply find them in internal exporer."), 0.5, function() {
		return noImportedScripts;
	});
	AdditionalMessageFactory.registerClickable("menuBoard", translate("Have any suggestions to improve environment? Tell about it on our board in Trello!"), 0.1, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://trello.com/b/wzYtpA3W/dev-editor"));
		context.startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("menuNetworkUser", translate("Want to follow modification updates? Checkout out VK community and starts to be part of it!"), 0.15, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://vk.com/club168765348"));
		context.startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("menuNetworkSupport", translate("Enjoying development process? Let's discuss, donate and write any suggestions to our messages."), 0.1, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://vk.me/nernar"));
		context.startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("menuNetworkConnect", translate("We're in search of developers for project. You may contribute and reshare our open source code."), 0.1, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://github.com/nernar/dev-editor"));
		context.startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("animationItem", translate("Do you want to see new abilities before it released? Join reopened testing team right now!"), 0.25, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://vk.me/club168765348"));
		context.startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("menuBoardConfig", translate("Too much messages on screen? You may deny hint sequences and view only recents."), 0.25, function(message) {
		hintStackableDenied = !loadSetting("performance.hint_stackable", "boolean", false);
		showHint(translate("Option successfully changed"));
		let control = message.getWindow();
		control.removeElement(message);
		__config__.save();
	}, function() {
		return !hintStackableDenied;
	});
	AdditionalMessageFactory.registerClickable("menuBoardConfig", translate("Don't want to lost any information from messages? Try allow hints sequences."), 0.25, function(message) {
		hintStackableDenied = !loadSetting("performance.hint_stackable", "boolean", true);
		showHint(translate("Option successfully changed"));
		let control = message.getWindow();
		control.removeElement(message);
		__config__.save();
	}, function() {
		return hintStackableDenied;
	});
	AdditionalMessageFactory.registerClickable("explorerSelectionWhole", translate("Have troubles with interface scales? Try to reset it with default sizes."), 0.5, function(message) {
		uiScaler = loadSetting("interface.interface_scale", "number", 1.0, 1.0);
		fontScale = loadSetting("interface.font_scale", "number", 1.0, 1.0);
		showHint(translate("Option successfully changed"));
		let control = message.getWindow();
		control.removeElement(message);
		__config__.save();
	}, function() {
		return uiScaler != 1.0 || fontScale != 1.0;
	});
	if (supportSupportables) {
		AdditionalMessageFactory.registerClickable("support", translate("Want more? Enable supportables to resolve another developer modifications experience!"), 0.5, function(message) {
			loadSupportables = loadSetting("supportable.enabled", "boolean", true);
			showHint(translate("Supportables will be enabled with next launch"));
			let control = message.getWindow();
			control.removeElement(message);
			__config__.save();
		}, function() {
			return !loadSupportables;
		});
	}
	if (__code__.startsWith("develop")) {
		AdditionalMessageFactory.registerClickable("menuProjectManage", translate("If you're wouldn't see development panel here, it may be removed."), 1, function(message) {
			debugAttachControlTools = !debugAttachControlTools;
			let control = message.getWindow();
			control.removeElement(message);
			control.removeElement(0);
		}, function() {
			return debugAttachControlTools;
		});
		AdditionalMessageFactory.registerClickable("explorerImport", translate("Modification is outgoing to produce? Let's compile anything that's we're developed!"), 0.5, function(message) {
			REQUIRE("produce.js")(function() {
				UniqueHelper.requireDestroy();
				WindowProvider.destroy();
				if (__code__.startsWith("develop")) {
					attachEvalButton();
				}
			});
		});
	}
};

/**
 * Used to import, load, replace or merge project
 * provider data. User may select any availabled
 * data or [[action]] willn't launched.
 * @param {Array} result selectable data
 * @param {function} action to do with data
 * @param {string} type project required type
 * @param {boolean} single is requires single selection
 */
const selectProjectData = function(result, action, type, single) {
	tryout(function() {
		if (!result || result.length == 0) return;
		let items = new Array(),
			data = new Array(),
			selected = new Array();
		result.forEach(function(element, index) {
			if (element && (type === undefined || element.type == type)) {
				switch (element.type) {
					case "block":
						let renderers = element.renderer.length + element.collision.length;
						items.push(translate("Block: %s", element.define.id) + "\n" +
							translateCounter(renderers, "no models", "%s1 model",
								"%s" + (renderers % 10) + " models", "%s models", [renderers]));
						break;
					case "entity":
						let models = element.visual.length;
						items.push(translate("Entity: %s", element.define.id) + "\n" +
							translateCounter(models, "no models /\ tree", "%s1 model /\ tree",
								"%s" + (models % 10) + " models \/ tree", "%s models \/ tree", [models]));
						break;
					case "transition":
						let animates = element.animation.length;
						items.push(translate("Transition: %s", (element.define.fps || 60) + " fps") + "\n" +
							translateCounter(animates, "no animates", "%s1 animate",
								"%s" + (animates % 10) + " animates", "%s animates", [animates]));
						break;
				}
				(!single) && selected.push(importAutoselect);
				data.push(element);
			}
		});
		if (items.length == 0) {
			showHint(translate("There's doesn't has any availabled data"));
			return;
		}
		if (items.length == 1) {
			action && action(single ? data[0] : data);
			return;
		}
		select(translate("Element selector"), items, function(selected, items) {
			let value = new Array();
			selected.forEach(function(element, index) {
				element && value.push(data[index]);
			});
			action && action(value);
		}, !single, selected);
	});
};

const showSupportableInfo = function(mod) {
	return tryout(function() {
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		builder.setTitle(translate(mod.modName) + " " + translate(mod.version));
		builder.setMessage((mod.description && mod.description.length > 0 ? translate(mod.description) + "\n" : new String()) +
			translate("Developer: %s", translate(mod.author || "Unknown")) + "\n" + translate("State: %s", translate(mod.result === true ?
			"ACTIVE" : mod.result === false ? "OUTDATED" : mod.result.lineNumber !== undefined ? "FAILED" : !mod.result ? "DISABLED" : "UNKNOWN")));
		builder.setNegativeButton(translate("Remove"), function() {
			confirm(translate("Warning!"), translate("Supportable will be uninstalled with all content inside, please notice that's you're data may be deleted.") + " " +
				translate("Do you want to continue?"),
				function() {
					if (mod.result === true) {
						showHint(translate("Restart game for better stability"));
					}
					eval(mod.modName.replace(" ", new String()) + " = null;");
					ExecuteableSupport.uninstall(mod.modName);
					ProjectEditor.menu();
				});
		});
		builder.setPositiveButton(translate("OK"), null);
		builder.create().show();
		return true;
	}, false);
};

const confirm = function(title, message, action, button) {
	handle(function() {
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		if (title !== undefined) builder.setTitle(title || translate("Confirmation"));
		if (message !== undefined) builder.setMessage(String(message));
		builder.setNegativeButton(translate("Cancel"), null);
		builder.setPositiveButton(button || translate("Yes"), action ? function() {
			tryout(action);
		} : null);
		builder.setCancelable(false);
		builder.create().show();
	});
};

const select = function(title, items, action, multiple, approved) {
	handle(function() {
		if (!Array.isArray(items)) MCSystem.throwException("Nothing to select inside select()");
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		if (title !== undefined) builder.setTitle(title || translate("Selection"));
		builder.setNegativeButton(translate("Cancel"), null);
		if (multiple) {
			if (approved === undefined) approved = new Array();
			builder.setMultiChoiceItems(items, approved, function(dialog, index, active) {
				tryout(function() {
					approved[index] = Boolean(active);
				});
			});
			builder.setNeutralButton(translate("All"), action ? function() {
				tryout(function() {
					for (let i = 0; i < approved.length; i++) {
						approved[i] = true;
					}
					action && action(approved, items);
				});
			} : null);
			builder.setPositiveButton(translate("Select"), action ? function() {
				tryout(function() {
					if (approved.indexOf(true) == -1) {
						select(title, items, action, multiple, approved);
					} else action && action(approved, items);
				});
			} : null);
		} else {
			builder.setItems(items, function(dialog, index) {
				tryout(function() {
					action && action(index, items[index]);
				});
			})
		}
		builder.setCancelable(false);
		builder.create().show();
	});
};

const selectFile = function(formats, onSelect, outside, directory) {
	const show = function(path, notRoot) {
		tryout(function() {
			if (useOldExplorer) {
				let files = Files.listFileNames(path),
					generated = Files.listDirectoryNames(path),
					formatted = Files.checkFormats(files, formats);
				if (notRoot) generated.unshift(translate("... parent folder"));
				for (let item in formatted) generated.push(formatted[item]);
				let builder = new android.app.AlertDialog.Builder(context, android.R.style.Theme_Holo_Dialog);
				builder.setTitle(String(path).replace(Dirs.EXTERNAL, new String()));
				builder.setNegativeButton(translate("Cancel"), null);
				builder.setItems(generated, function(d, i) {
					tryout(function() {
						if (notRoot && i == 0) {
							let file = new java.io.File(path),
								parent = file.getParent();
							show(parent, Dirs.EXTERNAL == parent + "/" ? false : true);
						} else {
							let file = new java.io.File(path, generated[i]);
							if (file.isDirectory()) show(file.getPath(), true);
							else if (onSelect) onSelect(file);
						}
					});
				});
				builder.create().show();
			} else {
				let explorer = new ExplorerWindow();
				formats && explorer.setFilter(formats);
				let bar = explorer.addPath().setPath(path);
				bar.setOnOutsideListener(function(bar) {
					if (outside !== undefined) {
						outside && outside() !== false && explorer.dismiss();
					} else explorer.dismiss();
				});
				explorer.setOnSelectListener(function(popup, file) {
					explorer.dismiss();
					onSelect && onSelect(file);
				});
				explorer.show();
			}
		});
	};
	show(directory || Dirs.EXPORT, directory != Dirs.EXTERNAL);
};

const saveFile = function(currentName, formats, onSelect, outside, directory) {
	let currentFormat = 0;
	if (useOldExplorer && !Array.isArray(formats)) {
		formats = [formats];
	}
	const show = function(path, notRoot) {
		tryout(function() {
			if (useOldExplorer) {
				let files = Files.listFileNames(path),
					generated = Files.listDirectoryNames(path),
					formatted = Files.checkFormats(files, formats);
				if (notRoot) generated.unshift(translate("... parent folder"));
				for (let item in formatted) generated.push(formatted[item]);
				let layout = new android.widget.LinearLayout(context);
				layout.setGravity(Interface.Gravity.CENTER);
				let edit = new android.widget.EditText(context);
				edit.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
					android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
				edit.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN);
				currentName && edit.setText(currentName);
				edit.setHint(translate("project"));
				edit.setTextColor(Interface.Color.WHITE);
				edit.setHintTextColor(Interface.Color.LTGRAY);
				edit.setBackgroundDrawable(null);
				edit.setCursorVisible(false);
				edit.setMaxLines(1);
				layout.addView(edit);
				let text = new android.widget.TextView(context);
				text.setText(formats[currentFormat]);
				text.setTextColor(Interface.Color.WHITE);
				text.setOnClickListener(function() {
					if (currentFormat == formats.length - 1) {
						currentFormat = 0;
					} else currentFormat++;
					text.setText(formats[currentFormat]);
				});
				layout.addView(text);
				let builder = new android.app.AlertDialog.Builder(context, android.R.style.Theme_Holo_Dialog);
				builder.setTitle(String(path).replace(Dirs.EXTERNAL, new String()));
				builder.setPositiveButton(translate("Export"), function() {
					currentName = String(edit.getText().toString());
					if (currentName.length == 0) currentName = translate("project");
					let file = new java.io.File(path, currentName + text.getText());
					if (onSelect) onSelect(file, currentName);
				});
				builder.setNegativeButton(translate("Cancel"), null);
				builder.setItems(generated, function(d, i) {
					tryout(function() {
						if (notRoot && i == 0) {
							let file = new java.io.File(path),
								parent = file.getParent();
							show(parent, Dirs.EXTERNAL == parent + "/" ? false : true);
						} else {
							let file = new java.io.File(path, generated[i]);
							if (file.isDirectory()) show(file.getPath(), true);
							else if (onSelect) onSelect(file, currentName);
						}
					});
				});
				builder.setView(layout);
				builder.create().show();
			} else {
				let explorer = new ExplorerWindow();
				formats && explorer.setFilter(formats);
				let bar = explorer.addPath().setPath(path);
				bar.setOnOutsideListener(function(bar) {
					if (outside !== undefined) {
						outside && outside() !== false && explorer.dismiss();
					} else explorer.dismiss();
				});
				let rename = explorer.addRename();
				formats && rename.setAvailabledTypes(formats);
				currentName && rename.setCurrentName(currentName);
				rename.setOnApproveListener(function(widget, file, last) {
					explorer.dismiss();
					onSelect && onSelect(file, last);
				});
				explorer.show();
			}
		});
	};
	show(directory || Dirs.EXPORT, directory != Dirs.EXTERNAL);
};

const compileData = function(text, type, additional) {
	if (type == "string") text = "\"" + text + "\"";
	let code = "(function() { return " + text + "; })();",
		scope = runAtScope(code, additional, "compile.js");
	return scope.error ? scope.error : !type ? scope.result :
		type == "string" ? String(scope.result) :
		type == "number" ? parseInt(scope.result) :
		type == "float" ? parseFloat(scope.result) :
		type == "object" ? scope.result : null;
};
