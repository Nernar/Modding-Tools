collectModpackLibraries = function(modpack, output) {
	if (arguments.length < 2) {
		MCSystem.throwException("collectModpackLibraries: Usage: <modpackDirectory> <outputJson>");
	}

	let modpackDirectory = Files.of(modpack);
	if (modpackDirectory.isFile() || !modpackDirectory.exists()) {
		MCSystem.throwException("collectModpackLibraries: Modpack directory does not exists or file");
	}

	let outputJson = Files.of(output);
	if (outputJson.isDirectory()) {
		MCSystem.throwException("collectModpackLibraries: Output path is directory");
	}
	outputJson.getParentFile().mkdirs();

	let results = [];
	let mods = Files.listDirectories(modpackDirectory, "relative", function(file, relative) {
		return Files.isFile(Files.of(file, "build.config"));
	});

	for (let i = 0, l = mods.length; i < l; i++) {
		let directory = Files.of(modpackDirectory, mods[i]);
		let buildConfig = new $.BuildConfig(Files.of(directory, "build.config"));
		if (buildConfig.read()) {
			let modInfo = Files.read(Files.of(directory, "mod.info"));
			try {
				modInfo = JSON.parse(modInfo);
			} catch (e) {
				Logger.Log("collectModpackLibraries(" + mods[i] + "): Malformed 'mod.info' json, skipping it checking!", "WARNING");
				modInfo = null;
			}
			let modVersion = modInfo && modInfo.version ? "" + modInfo.version : null;
			if (modVersion != null && /^[0-9]/.test(modVersion)) {
				modVersion = "v" + modVersion;
			}
			let reference = mods[i].replace("/mods/", "/") + (modVersion != null ? " " + modVersion : "");
			$.LoadingUI.setTextAndProgressBar(reference, i / l * 0.75);

			let sources = buildConfig.getAllSourcesToCompile(true);
			for (let j = 0, m = sources.size(); j < m; j++) {
				let source = sources.get(j);
				if (source.sourceType == "library") {
					let reader = new java.io.FileReader(Files.of(directory, source.path));
					$.LoadingUI.setProgress((i / l + 1 / l * j / m) * 0.75);
					let library;
					try {
						library = $.Compiler.compileReader(reader, source.getCompilerConfig());
						__mod__.onImportExecutable(library);
					} catch (e) {
						Logger.Log("collectModpackLibraries(" + mods[i] + "/" + source.path + "): " + e, "ERROR");
						continue;
					}
					results.push({
						path: mods[i] + "/" + source.path,
						reference: reference,
						executable: library
					});
				}
			}
		} else {
			Logger.Log("collectModpackLibraries(" + mods[i] + "): Malformed 'build.config' json, skipping!", "ERROR");
		}
	}

	for (let i = 0, l = results.length; i < l; i++) {
		let library = results[i];
		$.LoadingUI.setTextAndProgressBar(library.reference, 0.75 + i / l / 8);
		$.LoadingUI.setTip("Initializing " + library.executable.name);
		let exception;
		try {
			library.executable.initialize();
			exception = library.executable.getLastRunException();
		} catch (e) {
			exception = e;
		}
		if (exception != null) {
			Logger.Log("collectModpackLibraries(" + library.path + "): " + exception, "ERROR");
			results.splice(i--, 1);
			l--;
			continue;
		}
		library.name = "" + library.executable.getLibName();
		library.version = library.executable.getVersionCode() - 0;
		library.shared = !!library.executable.isShared();
		// library.api = "" + library.executable.apiInstance.getName();
		let dependencies = library.executable.getDependencies();
		library.dependencies = [];
		for (let j = 0, m = dependencies.size(); j < m; j++) {
			library.dependencies.push("" + dependencies.get(j));
		}
	}

	for (let i = 0, l = results.length; i < l; i++) {
		let library = results[i];
		$.LoadingUI.setTextAndProgressBar(library.reference, 0.875 + i / l / 8);
		$.LoadingUI.setTip("Running " + library.executable.name);
		let exception;
		try {
			library.executable.load();
			exception = library.executable.getLastRunException();
		} catch (e) {
			exception = e;
		}
		if (exception != null) {
			Logger.Log("collectModpackLibraries(" + library.path + "): " + exception, "WARNING");
			library.error = "" + exception;
		}
		let exports = library.executable.getExportNames().iterator();
		library.exports = [];
		while (exports.hasNext()) {
			library.exports.push("" + exports.next());
		}
		delete library.executable;
	}

	$.LoadingUI.setTextAndProgressBar("Flushing...", 1.0);
	$.LoadingUI.setTip("");
	if (results.length != 0) {
		Files.write(outputJson, JSON.stringify(results, null, "\t"));
	}
};