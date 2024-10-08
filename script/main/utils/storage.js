const monthToName = function(number) {
	let monthes = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return translate(monthes[number < 0 ? 0 : number > 11 ? 11 : number]);
};

const stringifyObject = function(obj, beautify, callback) {
	if (callback === undefined) {
		callback = {};
	}

	const recursiveStringify = function(obj, identation, depth) {
		if (callback.onUpdate) {
			callback.onUpdate();
		}

		if (obj === null || obj === undefined) {
			return "null";
		}

		switch (typeof obj) {
			case "string":
				obj = new java.lang.String(obj);
				obj = obj.replaceAll("\"", "\\\\\"");
				obj = obj.replaceAll("\t", "\\\\t");
				obj = obj.replaceAll("\n", "\\\\n");
				return "\"" + obj + "\"";

			case "number":
				return "" + preround(obj);

			case "boolean":
				return "" + obj;

			case "object":
				if (depth > 5) {
					return null;
				}

				let entries = [];
				let newLine = false;
				let insertNewLineNow = false;

				if (Array.isArray(obj)) {
					for (let i = 0; i < obj.length; i++) {
						let result = recursiveStringify(obj[i], identation, depth + 1);
						if (result && result.length > 0) {
							if (beautify) {
								if (result.indexOf("\n") != -1 || result.length > 48 || result.charAt(0) == "{") {
									entries.push((entries.length > 0 ? "\n" + identation.replace("\t", "") : "") + result);
									newLine = insertNewLineNow = true;

								} else if (insertNewLineNow) {
									entries.push("\n" + identation.replace("\t", "") + result);
									insertNewLineNow = false;

								} else if (entries.length > 0) {
									entries.push(" " + result);
								} else {
									entries.push(result);
								}
							} else {
								entries.push(result);
							}
						}
					}

					return "[" + entries.join(",") + "]";
				} else {
					if (obj["class"] !== undefined) {
						return;
					}

					for (let item in obj) {
						let result = recursiveStringify(obj[item], identation + "\t", depth + 1);
						if (result && result.length > 0) {
							if (beautify) {
								if (result.indexOf("\n") != -1 || result.length > 8) {
									entries.push((entries.length > 0 ? "\n" + identation : "") + item + ": " + result);
									newLine = insertNewLineNow = true;

								} else if (insertNewLineNow) {
									entries.push("\n" + identation + item + ": " + result);
									insertNewLineNow = false;

								} else if (entries.length > 0) {
									entries.push(" " + item + ": " + result);
								} else {
									entries.push(item + ": " + result);
								}
							} else {
								entries.push(item + ":" + result);
							}
						}
					}

					if (entries.length == 0) {
						return "{}";
					}

					let before = beautify ? newLine ? "{\n" + identation : "{ " : "{";
					let after = beautify ? newLine ? "\n" + identation.replace("\t", "") + "}" : " }" : "}";
					return before + entries.join(",") + after;
				}

			default:
				if (callback.onPassed) {
					callback.onPassed(obj, typeof obj);
				}
		}
	};

	if (typeof obj == "object" && !Array.isArray(obj)) {
		return recursiveStringify(obj, "\t", 0);
	}
	return recursiveStringify(obj, "", 0);
};

const readFile = function(path, asBytes, action) {
	handleThread(function() {
		let file = Files.of(path);
		if (!file.exists()) return;
		let readed = asBytes ? Files.readAsBytes(file) : Files.read(file);
		if (typeof action == "function") action(readed);
	});
};

const exportProject = function(object, isAutosave, path, action) {
	return AsyncSequence.access("internal.dns", [path, object, 30,
		isAutosave ? translate("Autosaving") : translate("Exporting"),
		isAutosave ? translate("Autosaved") : translate("Exported")], action, new SnackSequence());
};

const compileData = function(text, type, additional) {
	if (type == "string") {
		text = new java.lang.String(text);
		text = text.replaceAll("\"", "\\\\\"");
		text = text.replaceAll("\t", "\\\\t");
		text = text.replaceAll("\n", "\\\\n");
		text = "\"" + text + "\"";
	}
	let code = "(function() { return " + text + "; })();",
		scope = runAtScope(code, additional, "compile.js");
	return scope.error ? scope.error : !type ? scope.result :
		type == "boolean" ? !!scope.result :
		type == "string" ? "" + scope.result :
		type == "number" ? parseFloat(scope.result) :
		type == "integer" ? parseInt(scope.result) :
		type == "object" ? scope.result : null;
};

const formatExceptionReport = function(error, upper) {
	let report = localizeError(error),
		point = report.charAt(report.length - 1);
	if (!/\.|\!|\?/.test(point)) report += ".";
	let char = report.charAt(0);
	if (upper) char = char.toUpperCase();
	else if (upper !== null) char = char.toLowerCase();
	if (error && typeof error == "object" && error.lineNumber !== undefined) {
		return char + report.substring(1) + " (#" + error.lineNumber + ")";
	}
	return char + report.substring(1);
};

const importProject = function(path, action) {
	readFile(path, true, function(bytes) {
		let result = decompileFromProduce(bytes),
			data = compileData(result, "object");
		if (data && data.lineNumber === undefined) {
			handle(function() {
				action && (data.length !== undefined ?
					action(data) : action([data]));
			});
		} else {
			if (REVISION.startsWith("develop")) {
				reportError(data);
			}
			confirm(translate("Impossible open file"),
				translate("Looks like, project is damaged. Check project and following exception information:") +
				" " + (data ? formatExceptionReport(data) : translate("empty project.")) + "\n\n" +
				translate("Do you want to retry?"),
					function() {
						importProject(path, action);
					});
		}
	});
};

const findBuildConfigLocation = function(path) {
	try {
		let file = Files.of(path);
		do {
			let config = Files.of(file, "build.config");
			if (config.exists()) return config;
			file = file.getParentFile();
		} while (file && file.exists());
	} catch (e) {
		Logger.Log("Modding Tools: findBuildConfigLocation: " + e, "WARNING");
	}
	return null;
};

const findSourceInBuildConfigLocation = function(buildConfig, path) {
	 let highestPath = null;
	 let sourcePath = null;
	 for (let i = 0; i < buildConfig.buildDirs.length; i++) {
	 	let dir = buildConfig.buildDirs[i];
	 	// Same path as final one, no duplicate is needed here
	 	if (path == dir.targetSource) {
	 		return null;
	 	}
	 	if (path.indexOf(dir.dir) == 0 || path.indexOf(dir.dir) == 1) {
	 		if (highestPath == null || dir.dir.length > highestPath.length) {
	 			highestPath = dir.dir;
	 			sourcePath = dir.targetSource;
	 		}
	 	}
	 }
	 return sourcePath;
};

const getSourceInBuildConfigDescription = function(path) {
	try {
		let buildConfigFile = findBuildConfigLocation(path);
		if (buildConfigFile == null) throw null;
		let location = Files.relative(path, buildConfigFile.getParentFile());
		let buildConfig = compileData(Files.read(buildConfigFile), "object");
		// If source is not found, only main path will be used
		let sourcePath = findSourceInBuildConfigLocation(buildConfig, location);
		let api = buildConfig.defaultConfig.api;
		for (let i = 0; i < buildConfig.compile.length; i++) {
			let source = buildConfig.compile[i];
			if (source.path == sourcePath) {
				api = source.api || api;
			}
		}
		return sourcePath == null ? {
			api: api
		} : {
			api: api,
			source: Files.of(buildConfigFile.getParentFile(), sourcePath).getPath()
		};
	} catch (e) {
		if (e != null) {
			Logger.Log("Modding Tools: getSourceInBuildConfigDescription: " + e, "WARNING");
		}
	}
	return {
		api: "CoreEngine"
	};
};
