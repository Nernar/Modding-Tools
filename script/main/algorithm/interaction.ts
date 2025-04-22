/**
 * Used to import, load, replace or merge project
 * provider data. User may select any availabled
 * data or {@link complete} willn't launched.
 * @param projectData selectable data
 * @param complete to do with data
 * @param projectType project required type
 * @param chooseSingle is requires single selection
 */
function selectProjectData<T extends Scriptable>(
	projectData: T[],
	complete: (data: T[]) => void,
	projectType: string,
	chooseSingle?: boolean
) {
	if (!projectData || projectData.length == 0) return;
	let items = [],
		data = [],
		selected = [];
	projectData.forEach(function(element, index) {
		if (element && (projectType === undefined || element.type == projectType)) {
			items.push(element.define && element.define.id !== undefined ? element.define.id : "unknown");
			(!chooseSingle) && selected.push(importAutoselect);
			data.push(element);
		}
	});
	if (items.length == 0) {
		showHint(translate("There's doesn't has any availabled data"));
		return;
	}
	if (items.length == 1) {
		complete && complete(chooseSingle ? data[0] : data);
		return;
	}
	select(translate("Element selector"), items, (selected, items) => {
		let value = [];
		if (typeof selected == "object") {
			selected.forEach(function(element, index) {
				element && value.push(data[index]);
			});
		} else if (selected >= 0) {
			value.push(data[selected]);
		}
		complete && complete(value);
	}, !chooseSingle, selected);
}

/**
 * @requires `isAndroid()`
 */
function confirm(
	title: Nullable<string>,
	message: Nullable<string>,
	complete?: () => void,
	confirmation?: Nullable<string>
) {
	handle(function() {
		let builder = new android.app.AlertDialog.Builder(getContext(),
			android.R.style.Theme_DeviceDefault_Dialog);
		if (title !== undefined) builder.setTitle(title || translate("Confirmation"));
		if (message !== undefined) builder.setMessage("" + message);
		builder.setNegativeButton(translate("Cancel"), function() {
			hideInsetsOnScreen();
		});
		builder.setPositiveButton(confirmation || translate("Yes"), function() {
			try {
				complete && complete();
			} catch (e) {
				reportError(e);
			}
			hideInsetsOnScreen();
		});
		builder.setCancelable(false);
		builder.create().show();
	});
}

function willBeDeletedSoonSoYouShouldntUseIt() {
	let files = getDebugScripts();
	ShellObserver.trim();
	java.lang.System.out.println(ColorToCLI.DIM + "Requireable scripts: " + files.join(", ") + ColorToCLI.RESET);
	let selected = 0;
	while (ShellObserver.isInteractive()) {
		java.lang.System.out.print("\r" + " ".repeat(80));
		java.lang.System.out.print("\rWhat's need to require? " + ColorToCLI.INVERSE + files[selected] + ColorToCLI.RESET);
		let keys = ShellObserver.read();
		if (keys[0] == 27 && keys[2] == 91) {
			if (keys[4] == 65) {
				selected = selected <= 0 ? files.length - 1 : selected - 1;
			} else if (keys[4] == 66) {
				selected = selected < files.length - 1 ? selected + 1 : 0;
			}
		} else if (keys[0] == 3) {
			java.lang.System.out.print("\r" + " ".repeat(80));
			ShellObserver.leave();
			break;
		} else if (keys[0] == 10) {
			java.lang.System.out.println("\rWhat's need to require? " + ColorToCLI.DIM + files[selected] + ColorToCLI.RESET);
			try {
				let output = REQUIRE(files[selected]);
				if (typeof output == "function") {
					output();
				} else if (output !== undefined) {
					java.lang.System.out.println(ColorToCLI.ITALIC + files[selected] + ": " + output + ColorToCLI.RESET);
				}
			} catch (e) {
				reportError(e);
			}
		} else if (keys[0] == 9) {
			java.lang.System.out.print("\r");
			willBeDeletedSoonSoYouShouldntUseIt();
			return;
		}
	}
	java.lang.System.out.println("\r" + NAME + " " + VERSION + " (" + REVISION + ")");
}

/**
 * @requires `isAndroid()`
 */
function select(
	title: Nullable<string>,
	items: string[],
	complete: (approved: boolean[], items: string | string[]) => void,
	multiple?: boolean,
	checked?: boolean[]
) {
	handle(function() {
		if (!Array.isArray(items)) {
			MCSystem.throwException("Modding Tools: Nothing to select inside select()!");
		}
		let builder = new android.app.AlertDialog.Builder(getContext(),
			android.R.style.Theme_DeviceDefault_Dialog);
		if (title !== undefined) {
			builder.setTitle(title || translate("Selection"));
		}
		builder.setNegativeButton(translate("Cancel"), function() {
			hideInsetsOnScreen();
		});
		if (multiple) {
			if (checked === undefined) checked = [];
			builder.setMultiChoiceItems(items, checked, (dialog, index, active) => {
				try {
					checked[index] = !!active;
				} catch (e) {
					reportError(e);
				}
			});
			builder.setNeutralButton(translate("All"), () => {
				try {
					for (let i = 0; i < checked.length; i++) {
						checked[i] = true;
					}
					complete && complete(checked, items);
				} catch (e) {
					reportError(e);
				}
				hideInsetsOnScreen();
			});
			builder.setPositiveButton(translate("Select"), () => {
				try {
					if (checked.indexOf(true) == -1) {
						select(title, items, complete, multiple, checked);
					} else {
						complete && complete(checked, items);
					}
				} catch (e) {
					reportError(e);
				}
				hideInsetsOnScreen();
			});
		} else {
			builder.setItems(items, (dialog, index) => {
				try {
					complete && complete(index, items[index]);
				} catch (e) {
					reportError(e);
				}
				hideInsetsOnScreen();
			});
		}
		builder.setCancelable(false);
		builder.create().show();
	});
}

/**
 * @requires `isAndroid()`
 */
function selectFile(
	extensions: string | string[],
	complete: (file: java.io.File) => void,
	accept?: () => boolean,
	directory?: Nullable<java.io.File | string>
) {
	handle(function() {
		let explorer = new ExplorerWindow();
		extensions && explorer.setFilter(extensions);
		let bar = explorer.addPath().setPath(directory || Dirs.PROJECT);
		bar.setOnOutsideListener(() => {
			if (accept !== undefined) {
				accept && accept() !== false && explorer.dismiss();
			} else {
				explorer.dismiss();
			}
		});
		explorer.setOnSelectListener((popup, file) => {
			explorer.dismiss();
			complete && complete(file);
		});
		explorer.attach();
	});
}

/**
 * @requires `isAndroid()`
 */
function saveFile(
	name: Nullable<string>,
	extensions: string | string[],
	complete: (file: java.io.File, name: string) => void,
	accept?: () => boolean,
	directory?: Nullable<java.io.File | string>
) {
	handle(function() {
		let explorer = new ExplorerWindow();
		extensions && explorer.setFilter(extensions);
		let bar = explorer.addPath().setPath(directory || Dirs.PROJECT);
		bar.setOnOutsideListener(() => {
			if (accept !== undefined) {
				accept && accept() !== false && explorer.dismiss();
			} else {
				explorer.dismiss();
			}
		});
		let rename = explorer.addRename();
		extensions && rename.setAvailabledTypes(extensions);
		name && rename.setCurrentName(name);
		rename.setOnApproveListener((widget, file, last) => {
			let approve = function() {
				explorer.dismiss();
				complete && complete(file, last);
			};
			if (file.exists()) {
				confirm(translate("File is exists"), translate("File is already created, that process will be rewrite it. Continue?"), function() {
					approve();
				});
			} else approve();
		});
		explorer.attach();
	});
}

/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */

function registerAdditionalInformation() {
	if (AdditionalMessageFactory.getRegisteredCount() > 0) AdditionalMessageFactory.resetAll();
	AdditionalMessageFactory.register("inspectorType", translate("Modification still in development state, so something may not work properly."), .2);
	AdditionalMessageFactory.register("explorerExtensionProject", translate("Load or create your first editor, it'll appear here."), .75, function() {
		return ProjectProvider.getCount() == 0;
	});
	AdditionalMessageFactory.register("explorerExtensionScript", translate("Use scripts from your mods to import, simply find them in internal exporer."), .5, function() {
		return noImportedScripts;
	});
	AdditionalMessageFactory.registerClickable("menuNetworkUser", translate("Want to follow modification updates? Checkout out VK community and starts to be part of it!"), .15, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://vk.com/club168765348"));
		getContext().startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("menuNetworkSupport", translate("Enjoying development process? Let's discuss, donate and write any suggestions to our messages."), .1, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://vk.com/donut/club168765348"));
		getContext().startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("menuNetworkConnect", translate("We're in search of developers for project. You may contribute and reshare our open source code."), .1, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://github.com/nernar/modding-tools"));
		getContext().startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("renderDefineItem", translate("Do you want to see new abilities before it released? Join reopened testing team right now!"), .5, function(message) {
		let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
			android.net.Uri.parse("https://t.me/ntInsideChat"));
		getContext().startActivity(intent);
	});
	AdditionalMessageFactory.registerClickable("menuBoardConfig", translate("Too much messages on screen? You may deny hint sequences and view only recents."), .25, function(message) {
		hintStackableDenied = !loadSetting("performance.hint_stackable", "boolean", false);
		showHint(translate("Option successfully changed"));
		let control = message.getWindow();
		control.removeFragment(message);
		__config__.save();
	}, function() {
		return !hintStackableDenied;
	});
	AdditionalMessageFactory.registerClickable("menuBoardConfig", translate("Don't want to lost any information from messages? Try allow hints sequences."), .25, function(message) {
		hintStackableDenied = !loadSetting("performance.hint_stackable", "boolean", true);
		showHint(translate("Option successfully changed"));
		let control = message.getWindow();
		control.removeFragment(message);
		__config__.save();
	}, function() {
		return hintStackableDenied;
	});
	AdditionalMessageFactory.registerClickable("explorerSelectionWhole", translate("Have troubles with interface scales? Try to reset it with default sizes."), .5, function(message) {
		uiScaler = loadSetting("interface.interface_scale", "number", 1., 1.);
		fontScale = loadSetting("interface.font_scale", "number", 1., 1.);
		showHint(translate("Option successfully changed"));
		let control = message.getWindow();
		control.removeFragment(message);
		__config__.save();
	}, function() {
		return uiScaler != 1. || fontScale != 1.;
	});
}
