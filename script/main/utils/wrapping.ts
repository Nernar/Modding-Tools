function compileString(source: string, sourceName: string, lineno: number, securityDomain: any, evaluator: any, reporter: any, compilerEnv: any) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.compileString(CONTEXT, source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.compileString(source, sourceName, lineno, securityDomain);
}

function compileReader(reader: java.io.Reader, sourceName: string, lineno: number, securityDomain: any, evaluator: any, reporter: any, compilerEnv: any) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.compileReader(CONTEXT, reader, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.compileReader(reader, sourceName, lineno, securityDomain);
}

function compileFunction(scope: Scriptable, source: string, sourceName: string, lineno: number, securityDomain: any, evaluator: any, reporter: any, compilerEnv: any) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.compileFunction(CONTEXT, scope, source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.compileFunction(scope, source, sourceName, lineno, securityDomain);
}

function compileUniversal(what: string | java.io.Reader, sourceName: string, lineno: number, securityDomain: any, evaluator: any, reporter: any, compilerEnv: any) {
	if (what instanceof java.io.Reader) {
		return compileReader.apply(this, arguments);
	}
	return compileString.apply(this, arguments);
}

function evaluateString(scope: Scriptable, source: string, sourceName: string, lineno: number, securityDomain: any, evaluator: any, reporter: any, compilerEnv: any) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.evaluateString(CONTEXT, scope, source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.evaluateString(scope, source, sourceName, lineno, securityDomain);
}

function evaluateReader(scope: Scriptable, reader: java.io.Reader, sourceName: string, lineno: number, securityDomain: any, evaluator: any, reporter: any, compilerEnv: any) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.evaluateReader(CONTEXT, scope, reader, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.evaluateReader(scope, reader, sourceName, lineno, securityDomain);
}

function evaluateUniversal(scope: Scriptable, what: string | java.io.Reader, sourceName: string, lineno: number, securityDomain: any, evaluator: any, reporter: any, compilerEnv: any) {
	if (what instanceof java.io.Reader) {
		return evaluateReader.apply(this, arguments);
	}
	return evaluateString.apply(this, arguments);
}

interface RunInScopeResult {
	source: string;
	compilationErrorReporter?: any;
	compilerEnvirons?: any;
	result?: any;
	error?: Scriptable;
}

/**
 * Runs code/reader in a separate data stream.
 * @param what something to evaluate
 * @param scope to resolve global variables
 * @param name of running script in debuggers
 * @param prototype to resolve this variables
 * @param isFatal syntax error will be fatal or not
 * @returns evaluate `result` or `error`
 */
function runAtScope(what: string | java.io.Reader, scope?: Scriptable, name?: string, prototype?: Scriptable, isFatal?: boolean) {
	name = name ? NAME + "$" + name : "<no name>";
	if (scope == null || typeof scope != "object") {
		let executable = __mod__.compiledModSources.get(0);
		scope = CONTEXT.newObject(executable.getScope());
	}
	if (prototype != null) {
		scope = org.mozilla.javascript.ScriptRuntime.enterWith(prototype, CONTEXT, scope);
	}
	let result: RunInScopeResult = {
		source: name.replace(/[^\w\$\<\>\.\-\s]/gi, "$")
	};
	resolveThrowable.invoke(() => {
		if (isHorizon) {
			result.compilationErrorReporter = newLoggingErrorReporter(result.source, isFatal);
			result.compilerEnvirons = newRuntimeCompilerEnvirons(result.compilationErrorReporter);
		}
		result.result = evaluateUniversal(scope, what, result.source, 0, null, null, result.compilationErrorReporter || null, result.compilerEnvirons || null);
	}, (th) => {
		Logger.Log(result.source + ": " + InnerCorePackages.api.log.ICLog.getStackTrace(th), isFatal ? "ERROR" : "WARNING");
		if (th instanceof org.mozilla.javascript.JavaScriptException) {
			/// @ts-ignore
			result.error = th.getValue();
			return;
		}
		try {
			MCSystem.throwException(th != null ? th.toString() : "null");
		} catch (e) {
			result.error = e;
		}
	});
	return result;
}

interface LoggingErrorCollector {
	error?(message: string, sourceURI: string, line: number, lineText: string, lineOffset: number): boolean;
	warning?(message: string, sourceURI: string, line: number, lineText: string, lineOffset: number): boolean;
	runtimeError?(message: string, sourceURI: string, line: number, lineText: string, lineOffset: number): java.lang.Throwable;
}

function newLoggingErrorReporter(name: string, isFatal?: boolean, collector?: LoggingErrorCollector) {
	return new org.mozilla.javascript.ErrorReporter({
		error(message: string, sourceURI: string, line: number, lineText: string, lineOffset: number) {
			if (collector == null || (collector.error != null && collector.error.apply(this, arguments) !== false)) {
				Logger.Log(name + ": " + message + " (at " + sourceURI + "#" + line + ")", isFatal ? "ERROR" : "WARNING");
				if (lineText != null && lineText.length > 0) {
					Logger.Log(name + ": " + lineText, isFatal ? "ERROR" : "WARNING");
					Logger.Log(name + ": " + " ".repeat(lineOffset) + "^", isFatal ? "ERROR" : "WARNING");
				}
			}
		},
		warning(message: string, sourceURI: string, line: number, lineText: string, lineOffset: number) {
			if (collector == null || (collector.warning != null && collector.warning.apply(this, arguments) !== false)) {
				Logger.Log(name + ": " + message + " (at " + sourceURI + "#" + line + ")", isFatal ? "WARNING" : "INFO");
				if (lineText != null && lineText.length > 0) {
					Logger.Log(name + ": " + lineText, isFatal ? "WARNING" : "INFO");
					Logger.Log(name + ": " + " ".repeat(lineOffset) + "^", isFatal ? "WARNING" : "INFO");
				}
			}
		},
		runtimeError(message: string, sourceURI: string, line: number, lineText: string, lineOffset: number) {
			return new org.mozilla.javascript.EvaluatorException(message, sourceURI, line, lineText, lineOffset);
		}
	});
}

function newRuntimeCompilerEnvirons(reporter?: any) {
	let compilerEnv = new org.mozilla.javascript.CompilerEnvirons();
	compilerEnv.initFromContext(CONTEXT);
	if (reporter != null) {
		compilerEnv.setErrorReporter(reporter);
	}
	compilerEnv.setGenerateDebugInfo(true);
	compilerEnv.setGeneratingSource(false);
	compilerEnv.setRecoverFromErrors(true);
	compilerEnv.setIdeMode(true);
	return compilerEnv;
}

const Wrappables = [
	Dirs.SCRIPT_REVISION,
	Dirs.SCRIPT_ADAPTIVE,
	Dirs.EVALUATE
];

function findWrappedScript(path: string): Nullable<string> {
	let offset = 0;
	let filename = path;
	do {
		if (Files.isFile(filename)) {
			return Files.of(filename);
		}
		filename = Files.join(Wrappables[offset++], path);
	} while (offset <= Wrappables.length);
	return null;
}

function UNWRAP(path: string, prototype?: Scriptable, scope?: Scriptable, mergeScriptables?: boolean): RunInScopeResult {
	let file = findWrappedScript(path);
	if (file == null) {
		MCSystem.throwException("Modding Tools: Not found '" + path + "' " + (path.endsWith(".dns") ? "executable" : "script") + ", maybe you should try register it via modifying Wrappables?");
	}
	let name = path.substring(path.lastIndexOf("/") + 1);
	if (scope == null || mergeScriptables) {
		let scriptable = UNWRAP.initScriptable(path, name);
		scope = mergeScriptables && scope != null ? assign(scriptable, scope) : scriptable;
	}
	try {
		let source = path.endsWith(".dns") ? decompileExecuteable(Files.readAsBytes(file)) : Files.read(file),
			code = "(function() {\n" + source + "\n})();",
			result = runAtScope(code, scope, name, prototype);
		if (result.error) throw result.error;
		return result.result;
	} catch (e) {
		if (!path.endsWith(".dns") || REVISION.indexOf("develop") != -1) {
			reportError(e);
		}
	}
	return null;
}

namespace UNWRAP {
	export function initScriptable(path, name) {
		let scope = __mod__.compiledModSources.get(0).getScope();
		return {
			__path__: path,
			__name__: name,
			log: function(message, prefix) {
				Logger.Log(name + ": " + message, prefix || "SCRIPT");
			},
			raise: function(message) {
				MCSystem.throwException(name + ": " + message);
			},
			SHARE: function(name, obj) {
				if (REVISION.startsWith("develop")) {
					if (typeof name == "object") {
						Object.defineProperties(scope, name);
					} else {
						scope[name] = obj;
					}
				}
			}
		};
	}
}

function REQUIRE(path: string, prototype?: Scriptable, scope?: Scriptable): RunInScopeResult {
	if (REQUIRE.loaded.indexOf(path) == -1) {
		MCSystem.setLoadingTip(NAME + ": Requiring " + path);
		REQUIRE.results[path] = UNWRAP(path, prototype, scope);
		REQUIRE.loaded.push(path);
		MCSystem.setLoadingTip(NAME);
	}
	return REQUIRE.results[path];
}

namespace REQUIRE {
	export const loaded: string[] = [];
	export const results: { [path: string]: RunInScopeResult } = {};
}

function CHECKOUT(path: string, then?: (result: RunInScopeResult) => void, prototype?: Scriptable, scope?: Scriptable): RunInScopeResult {
	try {
		let result = REQUIRE(path, prototype, scope);
		then && then(result);
		return result;
	} catch (e) {
		Logger.Log("Modding Tools: CHECKOUT: " + e, "WARNING");
	}
	return null;
}

let currentLanguageTranslations;
let defaultLanguageTranslations;

function findTranslationByHash(hash: number & string, fallback?: string): string {
	let jhash = java.lang.Integer.valueOf(hash);
	if (currentLanguageTranslations) {
		let translation = currentLanguageTranslations.get(null).get(jhash);
		if (translation) {
			return translation;
		}
	}
	if (defaultLanguageTranslations) {
		let translation = defaultLanguageTranslations.get(null).get(jhash);
		if (translation) {
			return translation;
		}
	}
	if (fallback !== undefined) {
		return fallback;
	}
	return translate("Deprecated translation");
}

function translateCode(hash: number & string, args?: any[], fallback?: string): string {
	try {
		let text = findTranslationByHash(hash, fallback);
		if (args !== undefined) {
			if (!Array.isArray(args)) {
				args = [args];
			}
			args = args.map(function(value) {
				return "" + value;
			});
			text = java.lang.String.format(text, args);
		}
		return "" + text;
	} catch (e) {
		log("Modding Tools: translateCode: " + e);
	}
	return "...";
}

try {
	let $ = new JavaImporter(InnerCorePackages.api.runtime.other),
		clazz = $.NameTranslation.__javaObject__,
		field = clazz.getDeclaredField("currentLanguageTranslations");
	field.setAccessible(true);
	currentLanguageTranslations = field;
	if (isHorizon) {
		let proto = clazz.getDeclaredField("defaultLanguageTranslations");
		proto.setAccessible(true);
		defaultLanguageTranslations = proto;
	}
} catch (e) {
	if (REVISION.indexOf("develop") != -1) {
		reportError(e);
	}
}
