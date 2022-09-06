const ScriptImporterFactory = {
	buildAdaptedScript: function() {
		runCustomSource("script/adaptedscript.js");
		let executable = __mod__.compiledCustomSources.get("script/adaptedscript.js");
		return new ScriptImporter(executable, CONTEXT.newObject(executable.scriptScope));
	},
	buildCoreEngine: function() {
		runCustomSource("script/coreengine.js");
		let executable = __mod__.compiledCustomSources.get("script/coreengine.js");
		return new ScriptImporter(executable, CONTEXT.newObject(executable.scriptScope.CoreAPI));
	},
	build: function(source) {
		if (source.api == "CoreEngine") {
			return this.buildCoreEngine();
		} else if (source.api == "AdaptedScript") {
			return this.buildAdaptedScript();
		}
		Logger.Log("ModdingTools: Api " + source.api + " is not supported or found", "WARNING");
		return null;
	}
};

const ScriptImporter = function(executable, scope, key) {
	this.inject = function(what) {
		if (what !== undefined) {
			key = what;
		}
		if (key !== undefined) {
			return ScriptImporterFactory.injectScopesByKey(key, scope);
		}
		return ScriptImporterFactory.injectScopes(scope);
	};
	this.compile = function(who, optVariants) {
		/*
		let script = Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.evaluateStringWithCorruptions(CONTEXT, scope, who, "script.js", 0, null);
		if (script instanceof Packages.io.nernar.moddingtools.rhino.CorruptedScript) {
			let corruptions = script.getCorruptions();
			for (let i = 0; i < corruptions.size(); i++) {
				let corruption = corruptions.get(i);
				Logger.Log("ModdingTools: " + corruption.cause + " (" + corruption.startLineNumber + " -> " + corruption.endLineNumber + ")", "INFO");
			}
			Logger.Log("ModdingTools: These " + corruptions.size() + " errors will be ignored, however, in normal case, they might not have occurred.", "INFO");
		}
		*/
		let collectedMessages = [];
		let compilationErrorReporter = null;
		let compilerEnvirons = null;
		if (isHorizon) {
			compilationErrorReporter = newLoggingErrorReporter("ModdingTools", false, {
				error: function(message, sourceURI, line, lineText, lineOffset) {
					collectedMessages.push("E/" + message + " (at " + sourceURI + "#" + line + ")");
					if (lineText != null) {
						collectedMessages.push("E/" + lineText);
						collectedMessages.push("E/" + String(" ").repeat(lineOffset) + "^");
					}
				},
				warning: function(message, sourceURI, line, lineText, lineOffset) {
					collectedMessages.push("W/" + message + " (at " + sourceURI + "#" + line + ")");
					if (lineText != null) {
						collectedMessages.push("W/" + lineText);
						collectedMessages.push("W/" + String(" ").repeat(lineOffset) + "^");
					}
				}
			});
			compilerEnvirons = newRuntimeCompilerEnvirons(compilationErrorReporter);
		}
		for (let i = 0; i < arguments.length; i++) {
			let element = arguments[i];
			if (element == null) {
				continue;
			}
			resolveThrowable.invoke(function() {
				let file = new java.io.File(element);
				evaluateUniversal(scope, new java.io.FileReader(file), file.getName(), 0, null, null, compilationErrorReporter, compilerEnvirons);
			}, function(th) {
				Logger.Log("ModdingTools: " + element, "WARNING");
				Logger.Log("ModdingTools: " + InnerCorePackages.api.log.ICLog.getStackTrace(th), "WARNING");
				collectedMessages.push("E/" + element);
				collectedMessages.push("E/" + th);
			});
		}
		return collectedMessages;
	};
};

const registerScriptScope = (function(everything, byKey) {
	ScriptImporterFactory.getScopes = function() {
		return everything;
	};
	ScriptImporterFactory.getScopeKeys = function() {
		return Object.keys(byKey);
	};
	ScriptImporterFactory.getScopesByKey = function(key) {
		if (byKey.hasOwnProperty(key)) {
			return byKey[key];
		}
		return null;
	};
	(function(what) {
		ScriptImporterFactory.injectScopes = function(where) {
			return what(everything, where);
		};
		ScriptImporterFactory.injectScopesByKey = function(key, where) {
			return what(byKey[key], where);
		};
	})(function(who, where) {
		if (who === undefined) {
			return [];
		}
		let injected = [];
		for (let i = 0; i < who.length; i++) {
			try {
				injected.push(who[i].call(where));
			} catch (e) {
				Logger.Log("ModdingTools: ScriptImporterFactory.inject#" + i + ": " + e, "WARNING");
			}
		}
		return injected;
	});
	return function(who, key) {
		if (key !== undefined) {
			if (!byKey.hasOwnProperty(key)) {
				byKey[key] = [];
			}
			if (byKey[key].indexOf(who) != -1) {
				Logger.Log("ModdingTools: Script scope " + key + " already has registered function, nothing will happened", "INFO");
				return;
			}
			byKey[key].push(who);
		}
		if (everything.indexOf(who) == -1) {
			everything.push(who);
		}
	}
})([], {});

const importScript = function(path, when, key) {
	let source = getSourceInBuildConfigDescription(path);
	let results = compileScript(source, [source.source, path], key);
	if (results != null) {
		when && handle(function() {
			when(results);
		});
	}
	if (noImportedScripts) {
		noImportedScripts = false;
		loadSetting("user_login.imported_script", "boolean", true);
		__config__.save();
	}
};

const compileScript = function(source, what, key) {
	let importer = ScriptImporterFactory.build(source);
	if (importer == null) return null;
	let results = importer.inject(key);
	let messages = (function() {
		if (Array.isArray(what)) {
			return importer.compile.apply(importer, what);
		}
		return importer.compile(what);
	})();
	if (messages.length > 0) {
		confirm(translate("Evaluator"), messages.join("\n"));
	}
	return results;
};
