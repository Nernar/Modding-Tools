const RuntimeCodeEvaluate = {};

RuntimeCodeEvaluate.setupNewContext = function() {
	let somewhere = this.somewhere = {};
	runCustomSource("runtime.js", {
		GLOBAL: somewhere
	});
	if (isEmpty(somewhere)) {
		MCSystem.throwException("Runtime couldn't be resolved");
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
	return executable.parentContext.evaluateString(executable.scriptScope, what, executable.name, 0, null);
};

RuntimeCodeEvaluate.showSpecifiedDialog = function(source, where, location) {
	let fragment = new EditorFragment();
	let edit = fragment.getEditorView();
	source === undefined && (source = RuntimeCodeEvaluate.lastCode);
	where === undefined && (where = RuntimeCodeEvaluate.lastExecutable);
	location === undefined && (location = RuntimeCodeEvaluate.lastLocation);
	if (source !== undefined) edit.setText(String(source));
	
	let dialog = new android.app.AlertDialog.Builder(context,
		android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setPositiveButton(translate("Evaluate"), function() {
		let something = tryout(function() {
			RuntimeCodeEvaluate.lastCode = String(edit.getText().toString());
			RuntimeCodeEvaluate.lastExecutable = where;
			RuntimeCodeEvaluate.lastLocation = location;
			if (where !== undefined && where !== null) {
				return where.evaluateStringInScope(RuntimeCodeEvaluate.lastCode);
			}
			return eval(RuntimeCodeEvaluate.lastCode);
		});
		if (something !== undefined) {
			showHint(something);
		}
	});
	dialog.setNeutralButton(translate("Export"), function() {
		tryout(function() {
			RuntimeCodeEvaluate.lastCode = String(edit.getText().toString());
			RuntimeCodeEvaluate.lastExecutable = where;
			RuntimeCodeEvaluate.lastLocation = location;
			RuntimeCodeEvaluate.exportEvaluate();
		});
	});
	dialog.setNegativeButton(translate("Cancel"), null);
	dialog.setCancelable(false).setView(fragment.getContainer());
	dialog.setTitle(location === undefined ? translate(NAME) + " " + translate(VERSION) : String(location));
	let something = dialog.create();
	something.getWindow().setLayout(Interface.Display.WIDTH / 1.3, Interface.Display.HEIGHT / 1.1);
	something.show();
	(function() {
		for (let i = 0; i < arguments.length; i++) {
			if (arguments[i] == 0) {
				continue;
			}
			let view = something.findViewById(arguments[i]);
			if (view != null) {
				return view;
			}
		}
		MCSystem.throwException("ModdingTools: not found actual android dialog title, using custom view");
	})(context.getResources().getIdentifier("alertTitle", "id", context.getPackageName()),
		context.getResources().getIdentifier("alertTitle", "id", "android"),
		android.R.id.title).setOnClickListener(function(view) {
		tryout(function() {
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
		});
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
	return require.call(this, function() {
		let specified = this.resolveSpecifiedTypeSources(modification, type);
		return specified && (someone[name] = specified) != null;
	}, new Function(), false);
};

RuntimeCodeEvaluate.resolveSpecifiedModificationSources = function(modification) {
	let someone = {};
	this.putSpecifiedTypeSources(modification, someone, "compiledModSources", "modification");
	this.putSpecifiedTypeSources(modification, someone, "compiledLauncherScripts", "launcher");
	this.putSpecifiedTypeSources(modification, someone, "compiledLibs", "library");
	this.putSpecifiedTypeSources(modification, someone, "compiledPreloaderScripts", "preloader");
	this.putSpecifiedTypeSources(modification, someone, "compiledInstantScripts", "instant");
	// TODO: Custom must additionaly added byself, but not required at all
	if (isEmpty(someone)) {
		return null;
	}
	someone.__mod__ = modification;
	return someone;
};

RuntimeCodeEvaluate.resolveAvailabledExecutables = function(callback) {
	let sources = ModificationSource.findModList(),
		modByName = [];
	for (let i = 0; i < sources.size(); i++) {
		let modification = sources.get(i);
		callback && callback(i + 1, sources.size());
		let someone = this.resolveSpecifiedModificationSources(modification);
		someone && modByName.push(someone);
	}
	return modByName;
};
