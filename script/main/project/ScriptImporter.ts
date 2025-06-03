namespace ScriptImporterFactory {
	export const scopes: Scriptable[] = [];
	export const scopeByKey: { [key: string]: Scriptable } = {};
	export function getScopes() {
		return ScriptImporterFactory.scopes;
	}
	export function getScopeKeys() {
		return Object.keys(ScriptImporterFactory.scopeByKey);
	}
	export function getScopesByKey(key: string) {
		if (ScriptImporterFactory.scopeByKey.hasOwnProperty(key)) {
			return ScriptImporterFactory.scopeByKey[key];
		}
		return null;
	}
	export function buildAdaptedScript() {
		runCustomSource("script/adaptedscript.js");
		let executable = __mod__.compiledCustomSources.get("script/adaptedscript.js");
		return new ScriptImporter(executable, CONTEXT.newObject(executable.scriptScope));
	}
	export function buildCoreEngine() {
		runCustomSource("script/coreengine.js");
		let executable = __mod__.compiledCustomSources.get("script/coreengine.js");
		return new ScriptImporter(executable, CONTEXT.newObject(executable.scriptScope.CoreAPI));
	}
	export function build(source: any) {
		if (source.api == "CoreEngine") {
			return this.buildCoreEngine();
		} else if (source.api == "AdaptedScript") {
			return this.buildAdaptedScript();
		}
		Logger.Log("Modding Tools: Api " + source.api + " is not supported or found", "WARNING");
		return null;
	}
	export function injectScopes(where: any) {
		let injected = [];
		for (let i = 0; i < ScriptImporterFactory.scopes.length; i++) {
			try {
				injected.push(ScriptImporterFactory.scopes[i].call(where));
			} catch (e) {
				Logger.Log("Modding Tools: ScriptImporterFactory.injectScopes#" + i + ": " + e, "WARNING");
			}
		}
		return injected;
	};
	export function injectScopesByKey(key: string, where: any) {
		let scopes = ScriptImporterFactory.scopeByKey[key];
		if (scopes == null) {
			return [];
		}
		let injected = [];
		for (let i = 0; i < scopes.length; i++) {
			try {
				injected.push(scopes[i].call(where));
			} catch (e) {
				Logger.Log("Modding Tools: ScriptImporterFactory.injectScopesByKey#" + key + ".." + i + ": " + e, "WARNING");
			}
		}
		return injected;
	}
}

class ScriptImporter {
	executable: any;
	scope: Scriptable;
	key: string;
	constructor(executable: any, scope: Scriptable, key?: string) {
		this.executable = executable;
		this.scope = scope;
		if (key !== undefined) {
			this.key = key;
		}
	}
	inject(what: string) {
		if (what !== undefined) {
			this.key = what;
		}
		if (this.key !== undefined) {
			return ScriptImporterFactory.injectScopesByKey(this.key, this.scope);
		}
		return ScriptImporterFactory.injectScopes(this.scope);
	}
	compile(who: string, ...optVariants: string[]) {
		/*
		let script = Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.evaluateStringWithCorruptions(CONTEXT, this.scope, who, "script.js", 0, null);
		if (script instanceof Packages.io.nernar.moddingtools.rhino.CorruptedScript) {
			let corruptions = script.getCorruptions();
			for (let i = 0; i < corruptions.size(); i++) {
				let corruption = corruptions.get(i);
				Logger.Log("Modding Tools: " + corruption.cause + " (" + corruption.startLineNumber + " -> " + corruption.endLineNumber + ")", "INFO");
			}
			Logger.Log("Modding Tools: These " + corruptions.size() + " errors will be ignored, however, in normal case, they might not have occurred.", "INFO");
		}
		*/
		let collectedMessages = [];
		let compilationErrorReporter = null;
		let compilerEnvirons = null;
		if (isHorizon) {
			compilationErrorReporter = newLoggingErrorReporter("Modding Tools", false, {
				error(message: string, sourceURI: string, line: number, lineText: string, lineOffset: number) {
					collectedMessages.push("E/" + message + " (at " + sourceURI + "#" + line + ")");
					if (lineText != null) {
						collectedMessages.push("E/" + lineText);
						collectedMessages.push("E/" + " ".repeat(lineOffset) + "^");
					}
				},
				warning(message: string, sourceURI: string, line: number, lineText: string, lineOffset: number) {
					collectedMessages.push("W/" + message + " (at " + sourceURI + "#" + line + ")");
					if (lineText != null) {
						collectedMessages.push("W/" + lineText);
						collectedMessages.push("W/" + " ".repeat(lineOffset) + "^");
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
			resolveThrowable.invoke(() => {
				let file = Files.of(element);
				evaluateUniversal(this.scope, new java.io.FileReader(file), file.getName(), 0, null, null, compilationErrorReporter, compilerEnvirons);
			}, (th) => {
				Logger.Log("Modding Tools: " + element, "WARNING");
				Logger.Log("Modding Tools: " + InnerCorePackages.api.log.ICLog.getStackTrace(th), "WARNING");
				collectedMessages.push("E/" + element);
				collectedMessages.push("E/" + th);
			});
		}
		return collectedMessages;
	}
}

function registerScriptScope(who: Scriptable, key: string) {
	if (key !== undefined) {
		if (!ScriptImporterFactory.scopeByKey.hasOwnProperty(key)) {
			ScriptImporterFactory.scopeByKey[key] = [];
		}
		if (ScriptImporterFactory.scopeByKey[key].indexOf(who) != -1) {
			Logger.Log("Modding Tools: Script scope " + key + " already has registered function, nothing will happened", "INFO");
			return;
		}
		ScriptImporterFactory.scopeByKey[key].push(who);
	}
	if (ScriptImporterFactory.scopes.indexOf(who) == -1) {
		ScriptImporterFactory.scopes.push(who);
	}
}

function importScript(path: string, when: (results: any[]) => void, key: string) {
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
}

function compileScript(source: any, what: any, key: string) {
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
}
