const monthToName = function(number) {
	let monthes = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return translate(monthes[number < 0 ? 0 : number > 11 ? 11 : number]);
};

const stringifyObject = function(obj, identate, callback) {
	if (callback === undefined) {
		callback = {};
	}
	const recursiveStringify = function(obj, tabs) {
		if (callback.onUpdate) {
			callback.onUpdate();
		}
		if (obj === null) {
			return "null";
		}
		switch (typeof obj) {
			case "undefined":
				return "undefined";
			case "string":
				obj = new java.lang.String(obj);
				obj = obj.replaceAll("\"", "\\\\\"");
				obj = obj.replaceAll("\t", "\\\\t");
				obj = obj.replaceAll("\n", "\\\\n");
				return "\"" + obj + "\"";
			case "number":
				return String(preround(obj));
			case "boolean":
				return String(obj);
			case "object":
				if (Array.isArray(obj)) {
					let array = [],
						tabbed = false;
					for (let i = 0; i < obj.length; i++) {
						let result = recursiveStringify(obj[i], tabs);
						if (result && result.length > 0) {
							if (identate) {
								if (result.indexOf("\n") != -1 || result.length > 48) {
									if (!tabbed) {
										tabbed = true;
										tabs += "\t";
									}
									array.push(result + (i < obj.length ? "\n" + tabs : String()));
								} else if (i != 0) {
									array.push(" " + result);
								} else array.push(result);
							} else array.push(result);
						}
					}
					return "[" + array.join(",") + "]";
				} else {
					let array = [],
						tabbed = false,
						last, count = 0;
					for (let counted in obj) {
						last = counted;
						count++;
					}
					for (let item in obj) {
						let result = recursiveStringify(obj[item], tabs);
						if (result && result.length > 0) {
							if (identate) {
								if (result.indexOf("\n") != -1 || result.length > 8) {
									if (!tabbed) {
										tabbed = true;
										tabs += "\t";
									}
									array.push(item + ": " + result + (item != last ? "\n" + tabs : String()));
								} else if (item != 0) {
									array.push(" " + item + ": " + result);
								} else array.push(result);
							} else array.push("\"" + item + "\":" + result);
						}
					}
					let joined = array.join(",");
					return (identate ? tabbed ? "{\n" + tabs : "{ " : "{") + joined +
						(identate ? tabbed ? tabs.replace("\t", String()) + "\n}" : " }" : "}");
				}
			default:
				if (callback.onPassed) {
					callback.onPassed(obj, typeof obj);
				}
		}
	};
	return recursiveStringify(obj, String());
};

const readFile = function(path, isBytes, action) {
	handleThread(function() {
		let file = new java.io.File(String(path));
		if (!file.exists()) return;
		let readed = isBytes ? Files.readBytes(file) : Files.read(file);
		if (typeof action == "function") action(readed);
	});
};

const exportProject = function(object, isAutosave, path, action) {
	return AsyncSnackSequence.access("internal.dns", [path, object, 30,
		isAutosave ? translate("Autosaving") : translate("Exporting"),
		isAutosave ? translate("Autosaved") : translate("Exported")], action);
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
		let file = new java.io.File(path);
		do {
			let config = new java.io.File(file, "build.config");
			if (config.exists()) return config;
			file = file.getParentFile();
		} while (file && file.exists());
	} catch (e) {
		Logger.Log("ModdingTools: findBuildConfigLocation: " + e, "WARNING");
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
		let location = Files.shrinkPathes(buildConfigFile.getParentFile(), path);
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
			source: new java.io.File(buildConfigFile.getParentFile(), sourcePath).getPath()
		};
	} catch (e) {
		if (e != null) {
			Logger.Log("ModdingTools: getSourceInBuildConfigDescription: " + e, "WARNING");
		}
	}
	return {
		api: "CoreEngine"
	};
};
