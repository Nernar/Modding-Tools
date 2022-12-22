/**
 * @requires `isAndroid()`
 */
const RuntimeCodeEvaluate = {};

RuntimeCodeEvaluate.setupNewContext = function() {
	let somewhere = this.somewhere = {};
	runCustomSource("runtime.js", {
		GLOBAL: somewhere
	});
	if (isEmpty(somewhere)) {
		MCSystem.throwException("ModdingTools: Runtime could not be resolved!");
	}
	return somewhere;
};

RuntimeCodeEvaluate.getContextOrSetupIfNeeded = function() {
	if (this.somewhere !== undefined) {
		return this.somewhere;
	}
	return this.setupNewContext();
};

RuntimeCodeEvaluate.evaluateInRuntime = function(executable, what) {
	let context = this.getContextOrSetupIfNeeded();
	return executable.parentContext.evaluateString(context || executable.scriptScope, what, executable.name, 0, null);
};

RuntimeCodeEvaluate.showSpecifiedDialog = function(source, where, location) {
	let fragment = new EditorFragment();
	let edit = fragment.getEditorView();
	source === undefined && (source = RuntimeCodeEvaluate.lastCode);
	where === undefined && (where = RuntimeCodeEvaluate.lastExecutable);
	location === undefined && (location = RuntimeCodeEvaluate.lastLocation);
	if (source !== undefined) edit.setText(String(source));

	let dialog = new android.app.AlertDialog.Builder(getContext(),
		android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setPositiveButton(translate("Evaluate"), function() {
		let something;
		try {
			RuntimeCodeEvaluate.lastCode = "" + edit.getText().toString();
			RuntimeCodeEvaluate.lastExecutable = where;
			RuntimeCodeEvaluate.lastLocation = location;
			if (where !== undefined && where !== null) {
				something = where.evaluateStringInScope(RuntimeCodeEvaluate.lastCode);
			} else {
				something = eval(RuntimeCodeEvaluate.lastCode);
			}
		} catch (e) {
			reportError(e);
		}
		if (something !== undefined) {
			showHint(something);
		}
	});
	dialog.setNeutralButton(translate("Export"), function() {
		try {
			RuntimeCodeEvaluate.lastCode = "" + edit.getText().toString();
			RuntimeCodeEvaluate.lastExecutable = where;
			RuntimeCodeEvaluate.lastLocation = location;
			RuntimeCodeEvaluate.exportEvaluate();
		} catch (e) {
			reportError(e);
		}
	});
	dialog.setNegativeButton(translate("Cancel"), null);
	dialog.setCancelable(false).setView(fragment.getContainer());
	dialog.setTitle(location === undefined ? translate(NAME) + " " + translate(VERSION) : String(location));
	let something = dialog.create();
	something.getWindow().setLayout(getDisplayPercentWidth(70), android.view.WindowManager.LayoutParams.MATCH_PARENT);
	something.show();
	let titleView = (function() {
		for (let i = 0; i < arguments.length; i++) {
			if (arguments[i] == 0) {
				continue;
			}
			let view = something.findViewById(arguments[i]);
			if (view != null) {
				return view;
			}
		}
		MCSystem.throwException("ModdingTools: Not found actual android dialog title, using custom view");
	})(getContext().getResources().getIdentifier("alertTitle", "id", getContext().getPackageName()),
		getContext().getResources().getIdentifier("alertTitle", "id", "android"),
		android.R.id.title);
	titleView.setOnClickListener(function(view) {
		try {
			let executables = RuntimeCodeEvaluate.resolveAvailabledExecutables();
			let realExecutablePointer = [];
			let readableArray = [];
			for (let i = 0; i < executables.length; i++) {
				for (let element in executables[i]) {
					if (element == "__mod__") {
						continue;
					}
					for (let s = 0; s < executables[i][element].length; s++) {
						let source = executables[i][element][s];
						readableArray.push(executables[i].__mod__.name + ": " + source.name + " (" + element + ")");
						realExecutablePointer.push(source);
					}
				}
			}
			select(translate("Evaluate In"), readableArray, function(index, value) {
				where = realExecutablePointer[index];
				location = value;
				something.setTitle(location);
			});
		} catch (e) {
			reportError(e);
		}
	});
	titleView = titleView.getParent();
	let buttonLayout = something.getButton(android.app.Dialog.BUTTON_NEUTRAL).getParent().getParent();
	registerKeyboardWatcher(function(onScreen) {
		titleView.setVisibility(onScreen ? android.view.View.GONE : android.view.View.VISIBLE);
		buttonLayout.setVisibility(onScreen ? android.view.View.GONE : android.view.View.VISIBLE);
	});
};

RuntimeCodeEvaluate.exportEvaluate = function() {
	saveFile(undefined, ".js", function(file) {
		Files.write(file, RuntimeCodeEvaluate.lastCode);
	}, undefined, Dirs.EVALUATE);
};

RuntimeCodeEvaluate.loadEvaluate = function() {
	selectFile(".js", function(file) {
		RuntimeCodeEvaluate.lastCode = Files.read(file);
		RuntimeCodeEvaluate.showSpecifiedDialog();
	}, undefined, Dirs.EVALUATE);
};

RuntimeCodeEvaluate.resolveSpecifiedTypeSources = function(modification, type) {
	let sources = modification[type];
	if (sources && sources.size() > 0) {
		let source = [];
		for (let w = 0; w < sources.size(); w++) {
			source.push(sources.get(w));
		}
		return source;
	}
	return null;
};

RuntimeCodeEvaluate.putSpecifiedTypeSources = function(modification, someone, type, name) {
	try {
		let specified = this.resolveSpecifiedTypeSources(modification, type);
		return specified && (someone[name] = specified) != null;
	} catch (e) {
		Logger.Log("ModdingTools: RuntimeCodeEvaluate.putSpecifiedTypeSources: " + e, "INFO");
	}
	return false;
};

RuntimeCodeEvaluate.resolveSpecifiedModificationSources = function(modification) {
	let someone = {};
	this.putSpecifiedTypeSources(modification, someone, "compiledModSources", "modification");
	this.putSpecifiedTypeSources(modification, someone, "compiledLauncherScripts", "launcher");
	this.putSpecifiedTypeSources(modification, someone, "compiledLibs", "library");
	this.putSpecifiedTypeSources(modification, someone, "compiledPreloaderScripts", "preloader");
	this.putSpecifiedTypeSources(modification, someone, "compiledInstantScripts", "instant");
	// TODO: Custom sources must additionaly added manually, but not required at all.
	// It must be called by the `runCustomSource` function from parent script.
	if (isEmpty(someone)) {
		return null;
	}
	someone.__mod__ = modification;
	return someone;
};

RuntimeCodeEvaluate.getModListImpl = function() {
	try {
		let mods = Packages.com.zhekasmirnov.apparatus.modloader.ApparatusModLoader.getSingleton().getAllMods();
		let sorted = new java.util.ArrayList();
		for (let i = 0; i < mods.size(); i++) {
			let mod = mods.get(i);
			if (mod instanceof Packages.com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod) {
				sorted.add(mod.getLegacyModInstance());
			}
		}
		return sorted;
	} catch (e) {
		return InnerCorePackages.mod.build.ModLoader.instance.modsList;
	}
};

RuntimeCodeEvaluate.resolveAvailabledExecutables = function(callback) {
	let sources = this.getModListImpl(),
		modByName = [];
	for (let i = 0; i < sources.size(); i++) {
		let modification = sources.get(i);
		callback && callback(i + 1, sources.size());
		let someone = this.resolveSpecifiedModificationSources(modification);
		someone && modByName.push(someone);
	}
	return modByName;
};
