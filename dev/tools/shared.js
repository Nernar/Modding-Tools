/**
 * TODO: Reshape to storage -> message.js -> AdditionalMessage.
 */
const checkForAdditionalInformation = function(control) {
	if (hasAdditionalInformation(warningMessage)) {
		control.addMessage("menuLoginServer", translate(warningMessage), function(message) {
			control.removeElement(message), warningMessage = null;
		});
	}
	if (ProjectProvider.getCount() == 0 && random(0, 4) == 0)
		if (hasAdditionalInformation("editorCreateInformation"))
			control.addMessage("blockModuleVariation", translate("Load or create your first editor, it'll appear here."));
	if (noImportedScripts && random(0, 4) == 0)
		if (hasAdditionalInformation("scriptImportInformation"))
			control.addMessage("explorerExtensionScript", translate("Use scripts from your mods to import, simply find them in internal exporer."));
	if (keyExpiresSoon && random(0, 9) == 0)
		if (hasAdditionalInformation("keyExpiresNotification"))
			control.addMessage("menuLoginKey", translate("Key needs validation and will be expires soon. Please, check network connection, or you have risk to lost testing abilities."));
};

const hasAdditionalInformation = function(message) {
	if (!message) {
		return false;
	}
	if (checkForAdditionalInformation.already.indexOf(message) == -1) {
		return (checkForAdditionalInformation.already.push(message), true);
	}
	return false;
};

const resetAdditionalInformation = function() {
	checkForAdditionalInformation.already = new Array();
};

resetAdditionalInformation();

const selectProjectData = function(result, action, type, single) {
	try {
		if (!result || result.length == 0) return;
		let items = new Array(),
			data = new Array(),
			selected = new Array();
		result.forEach(function(element, index) {
			if (element && (type !== undefined ? element.type == type : true)) {
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
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		builder.setTitle(translate("Element selector"));
		single ? builder.setItems(items, action ? function(dialog, item) {
			try { action(data[item]); }
			catch (e) { reportError(e); }
		} : null) : builder.setMultiChoiceItems(items, selected, function(dialog, item, active) {
			try { selected[item] = active; }
			catch (e) { reportError(e); }
		});
		builder.setNegativeButton(translate("Cancel"), null);
		if (!single) {
			builder.setNeutralButton(translate("All"), action ? function() {
				try { action(data); }
				catch (e) { reportError(e); }
			} : null);
			builder.setPositiveButton(translate("Select"), action ? function() {
				try {
					let value = new Array();
					selected.forEach(function(element, index) {
						element && value.push(data[index]);
					});
					if (value.length == 0) {
						selectProjectData(data, action, type, single);
					} else action(value);
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
};

const showSupportableInfo = function(mod) {
	try {
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		builder.setTitle(translate(mod.modName) + " " + mod.version);
		builder.setMessage((mod.description ? translate(mod.description) + "\n" : new String()) +
			translate("Developer: %s", (mod.author || translate("Unknown")) + "\n" +
				translate("State: %s", translate(mod.result == true ? "ACTIVE" :
					mod.result == false ? "OUTDATED" : mod.result instanceof Error == true ?
					"FAILED" : !mod.result ? "DISABLED" : "UNKNOWN"))));
		builder.setNegativeButton(translate("Remove"), function() {
			handle(function() {
				confirm(translate("Warning!"), translate("Supportable will be uninstalled with all content inside, please notice that's you're data may be deleted.") + " " +
					translate("Do you want to continue?"),
					function() {
						if (mod.result == true) {
							showHint(translate("Restart game for better stability"));
						}
						eval(mod.modName.replace(" ", new String()) + " = null;");
						ExecutableSupport.uninstall(mod.modName);
						ProjectEditor.menu();
					});
			});
		});
		builder.setPositiveButton(translate("OK"), null);
		builder.create().show();
		return true;
	} catch (e) {
		reportError(e);
	}
	return false;
};

const confirm = function(title, message, action) {
	handle(function() {
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_Dialog);
		builder.setTitle(title || translate("Confirmation"));
		if (message) builder.setMessage(String(message));
		builder.setNegativeButton(translate("Cancel"), null);
		builder.setPositiveButton(translate("Yes"), action ? function() {
			try { action && action(); }
			catch (e) { reportError(e); }
		} : null);
		builder.setCancelable(false);
		builder.create().show();
	});
};

const selectFile = function(formats, onSelect, outside) {
	const show = function(path, notRoot) {
		try {
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
					try {
						if (notRoot && i == 0) {
							let file = new java.io.File(path),
								parent = file.getParent();
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
				builder.create().show();
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
	};
	show(Dirs.EXPORT, true);
};

const saveFile = function(currentName, formats, onSelect, outside) {
	let currentFormat = 0;
	if (useOldExplorer && !Array.isArray(formats)) {
		formats = [formats];
	}
	const show = function(path, notRoot) {
		try {
			if (useOldExplorer) {
				let files = Files.listFileNames(path),
					generated = Files.listDirectoryNames(path),
					formatted = Files.checkFormats(files, formats);
				if (notRoot) generated.unshift(translate("... parent folder"));
				for (let item in formatted) generated.push(formatted[item]);
				let layout = new android.widget.LinearLayout(context);
				layout.setGravity(Ui.Gravity.CENTER);
				let edit = new android.widget.EditText(context);
				currentName && edit.setText(currentName);
				edit.setHint(translate("project"));
				edit.setTextColor(Ui.Color.WHITE);
				edit.setHintTextColor(Ui.Color.LTGRAY);
				edit.setBackgroundDrawable(null);
				edit.setCursorVisible(false);
				edit.setMaxLines(1);
				layout.addView(edit);
				let text = new android.widget.TextView(context);
				text.setText(formats[currentFormat]);
				text.setTextColor(Ui.Color.WHITE);
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
					try {
						if (notRoot && i == 0) {
							let file = new java.io.File(path),
								parent = file.getParent();
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
				builder.create().show();
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
				currentName && rename.setCurrentName(currentName);
				rename.setOnApproveListener(function(window, file, last) {
					explorer.dismiss();
					onSelect && onSelect(file, last);
				});
				explorer.show();
			}
		} catch (e) {
			reportError(e);
		}
	};
	show(Dirs.EXPORT, true);
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
