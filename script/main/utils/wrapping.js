const compileString = function(source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.compileString(CONTEXT, source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.compileString(source, sourceName, lineno, securityDomain);
};

const compileReader = function(reader, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.compileReader(CONTEXT, reader, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.compileReader(reader, sourceName, lineno, securityDomain);
};

const compileFunction = function(scope, source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.compileFunction(CONTEXT, scope, source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.compileFunction(scope, source, sourceName, lineno, securityDomain);
};

const compileUniversal = function(what, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv) {
	if (what instanceof java.io.Reader) {
		return compileReader.apply(this, arguments);
	}
	return compileString.apply(this, arguments);
};

const evaluateString = function(scope, source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.evaluateString(CONTEXT, scope, source, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.evaluateString(scope, source, sourceName, lineno, securityDomain);
};

const evaluateReader = function(scope, reader, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv) {
	if (isHorizon) {
		return Packages.io.nernar.moddingtools.rhino.EvaluatorFactory.evaluateReader(CONTEXT, scope, reader, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv);
	}
	return CONTEXT.evaluateReader(scope, reader, sourceName, lineno, securityDomain);
};

const evaluateUniversal = function(scope, what, sourceName, lineno, securityDomain, evaluator, reporter, compilerEnv) {
	if (what instanceof java.io.Reader) {
		return evaluateReader.apply(this, arguments);
	}
	return evaluateString.apply(this, arguments);
};

/**
 * Runs code/reader in a separate data stream.
 * @param {string|java.io.Reader} what something to evaluate
 * @param {object} [scope] to resolve global variables
 * @param {string} [name] of running script in debuggers
 * @param {object} [prototype] to resolve this variables
 * @param {boolean} [isFatal] syntax error will be fatal or not
 * @returns evaluate `result` or `error`
 */
const runAtScope = function(what, scope, name, prototype, isFatal) {
	name = name ? NAME + "$" + name : "<no name>";
	if (scope == null || typeof scope != "object") {
		let executable = __mod__.compiledModSources.get(0);
		scope = CONTEXT.newObject(executable.getScope());
	}
	if (prototype != null) {
		scope = org.mozilla.javascript.ScriptRuntime.enterWith(prototype, CONTEXT, scope);
	}
	let result = {
		source: name.replace(/[^\w\$\<\>\.\-\s]/gi, "$")
	};
	resolveThrowable.invoke(function() {
		if (isHorizon) {
			result.compilationErrorReporter = newLoggingErrorReporter(result.source, isFatal);
			result.compilerEnvirons = newRuntimeCompilerEnvirons(result.compilationErrorReporter);
		}
		result.result = evaluateUniversal(scope, what, result.source, 0, null, null, result.compilationErrorReporter || null, result.compilerEnvirons || null);
	}, function(th) {
		Logger.Log(result.source + ": " + InnerCorePackages.api.log.ICLog.getStackTrace(th), isFatal ? "ERROR" : "WARNING");
		if (th instanceof org.mozilla.javascript.JavaScriptException) {
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
};

const newLoggingErrorReporter = function(name, isFatal, collector) {
	return new org.mozilla.javascript.ErrorReporter({
		error: function(message, sourceURI, line, lineText, lineOffset) {
			if (collector == null || (collector.error != null && collector.error.apply(this, arguments) !== false)) {
				Logger.Log(name + ": " + message + " (at " + sourceURI + "#" + line + ")", isFatal ? "ERROR" : "WARNING");
				if (lineText != null && lineText.length > 0) {
					Logger.Log(name + ": " + lineText, isFatal ? "ERROR" : "WARNING");
					Logger.Log(name + ": " + " ".repeat(lineOffset) + "^", isFatal ? "ERROR" : "WARNING");
				}
			}
		},
		warning: function(message, sourceURI, line, lineText, lineOffset) {
			if (collector == null || (collector.warning != null && collector.warning.apply(this, arguments) !== false)) {
				Logger.Log(name + ": " + message + " (at " + sourceURI + "#" + line + ")", isFatal ? "WARNING" : "INFO");
				if (lineText != null && lineText.length > 0) {
					Logger.Log(name + ": " + lineText, isFatal ? "WARNING" : "INFO");
					Logger.Log(name + ": " + " ".repeat(lineOffset) + "^", isFatal ? "WARNING" : "INFO");
				}
			}
		},
		runtimeError: function(message, sourceURI, line, lineText, lineOffset) {
			return new org.mozilla.javascript.EvaluatorException(message, sourceURI, line, lineText, lineOffset);
		}
	});
};

const newRuntimeCompilerEnvirons = function(reporter) {
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
};

const Wrappables = [
	Dirs.SCRIPT_REVISION,
	Dirs.SCRIPT_ADAPTIVE,
	Dirs.EVALUATE
];

const findWrappedScript = function(path) {
	let offset = 0;
	let filename = path;
	do {
		if (Files.isFile(filename)) {
			return Files.of(filename);
		}
		filename = Files.join(Wrappables[offset++], path);
	} while (offset <= Wrappables.length);
	return null;
};

const UNWRAP = function(path, prototype, scope, mergeScriptables) {
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
};

UNWRAP.initScriptable = function(path, name) {
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
};

const REQUIRE = function(path, prototype, scope) {
	if (REQUIRE.loaded.indexOf(path) == -1) {
		MCSystem.setLoadingTip(NAME + ": Requiring " + path);
		REQUIRE.results[path] = UNWRAP(path, prototype, scope);
		REQUIRE.loaded.push(path);
		MCSystem.setLoadingTip(NAME);
	}
	return REQUIRE.results[path];
};

REQUIRE.loaded = [];
REQUIRE.results = {};

const CHECKOUT = function(path, then, prototype, scope) {
	try {
		let result = REQUIRE(path, prototype, scope);
		then && then(result);
		return result;
	} catch (e) {
		Logger.Log("Modding Tools: CHECKOUT: " + e, "WARNING");
	}
	return null;
};

let currentLanguageTranslations;
let defaultLanguageTranslations;

const findTranslationByHash = function(hash, fallback) {
	hash = java.lang.Integer.valueOf(hash);
	if (currentLanguageTranslations) {
		let translation = currentLanguageTranslations.get(null).get(hash);
		if (translation) {
			return translation;
		}
	}
	if (defaultLanguageTranslations) {
		let translation = defaultLanguageTranslations.get(null).get(hash);
		if (translation) {
			return translation;
		}
	}
	if (fallback !== undefined) {
		return fallback;
	}
	return translate("Deprecated translation");
};

const translateCode = function(hash, args, fallback) {
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
};

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
