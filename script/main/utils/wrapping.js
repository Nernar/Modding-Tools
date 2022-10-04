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
 * @param {Object} [scope] fo resolve
 * @param {string} [name] of script
 * @param {boolean} [isFatal] syntax error will be fatal or not
 * @returns evaluate [[result]] or [[error]]
 */
const runAtScope = function(what, scope, name, isFatal) {
	let source = name ? NAME + "$" + name : "<no name>";
	if (scope == null || typeof scope != "object") {
		let executable = __mod__.compiledModSources.get(0);
		scope = CONTEXT.newObject(executable.getScope());
	}
	let result = {
		source: source.replace(/[^\w\$\<\>\.\-\s]/gi, "$")
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
			Logger.Log(name + ": " + message + " (at " + sourceURI + "#" + line + ")", isFatal ? "ERROR" : "WARNING");
			Logger.Log(name + ": " + lineText, isFatal ? "ERROR" : "WARNING");
			Logger.Log(name + ": " + String(" ").repeat(lineOffset) + "^", isFatal ? "ERROR" : "WARNING");
			if (collector && collector.error) collector.error.apply(this, arguments);
		},
		warning: function(message, sourceURI, line, lineText, lineOffset) {
			Logger.Log(name + ": " + message + " (at " + sourceURI + "#" + line + ")", isFatal ? "WARNING" : "INFO");
			Logger.Log(name + ": " + lineText, isFatal ? "WARNING" : "INFO");
			Logger.Log(name + ": " + String(" ").repeat(lineOffset) + "^", isFatal ? "WARNING" : "INFO");
			if (collector && collector.warning) collector.warning.apply(this, arguments);
		},
		runtimeError: function(message, sourceURI, line, lineText, lineOffset) {
			return new org.mozilla.javascript.EvaluatorException(message, sourceURI, line, lineText, lineOffset);
		}
	});
};

const newRuntimeCompilerEnvirons = function(reporter) {
	let compilerEnv = new org.mozilla.javascript.CompilerEnvirons();
	compilerEnv.initFromContext(CONTEXT);
	compilerEnv.setErrorReporter(reporter);
	compilerEnv.setGenerateDebugInfo(false);
	compilerEnv.setGeneratingSource(false);
	compilerEnv.setRecoverFromErrors(true);
	// Requires setGeneratingSource(true)
	// compilerEnv.setIdeMode(true);
	return compilerEnv;
};

const findWrappedScript = function(path) {
	let file = new java.io.File(path);
	if (file.exists()) return file;
	file = new java.io.File(Dirs.SCRIPT_REVISION, path);
	if (file.exists()) return file;
	file = new java.io.File(Dirs.EVALUATE, path);
	if (file.exists()) return file;
	file = new java.io.File(Dirs.SCRIPT_ADAPTIVE, path);
	if (file.exists()) return file;
	return null;
};

const UNWRAP = function(path, scope) {
	let who = UNWRAP.initScriptable(path);
	if (scope !== undefined && scope !== null) {
		who = assign(who, scope);
	}
	let file = findWrappedScript(path);
	if (REVISION.startsWith("develop") && path.endsWith(".js")) {
		if (file == null) {
			MCSystem.throwException("ModdingTools: Not found " + path + " script");
		}
		log("ModdingTools: Wrapping " + file + " script");
		let source = Files.read(file).toString(),
			code = "(function() {\n" + source + "\n})();",
			scope = runAtScope(code, who, path);
		if (scope.error) throw scope.error;
		return scope.result;
	}
	if (file == null) {
		MCSystem.throwException("ModdingTools: Not found " + path + " executable");
	}
	try {
		let source = decompileExecuteable(Files.readBytes(file)),
			code = "(function() {\n" + source + "\n})();",
			scope = runAtScope(code, who, path);
		if (scope.error) throw scope.error;
		return scope.result;
	} catch (e) {
		if (REVISION.indexOf("develop") != -1) {
			reportError(e);
		}
	}
	return null;
};

UNWRAP.initScriptable = function(name) {
	let scope = __mod__.compiledModSources.get(0).getScope();
	return {
		SHARE: function(name, obj) {
			if (REVISION.startsWith("develop")) {
				if (typeof name == "object") {
					Object.defineProperties(scope, name);
				} else {
					scope[name] = obj;
				}
			}
		},
		log: function(message) {
			log(name + ": " + message);
		},
		__path__: name
	};
};

const REQUIRE = function(path, scope) {
	if (REQUIRE.loaded.indexOf(path) == -1) {
		MCSystem.setLoadingTip(NAME + ": Requiring " + path);
		REQUIRE.results[path] = UNWRAP(path, scope);
		REQUIRE.loaded.push(path);
		MCSystem.setLoadingTip(NAME);
	}
	return REQUIRE.results[path];
};

REQUIRE.loaded = [];
REQUIRE.results = {};

const CHECKOUT = function(path, scope, post) {
	try {
		let something = REQUIRE(path, scope);
		post && post(something);
		return something;
	} catch (e) {
		Logger.Log("ModdingTools: CHECKOUT: " + e, "WARNING");
	}
	return null;
};

const findTranslationByHash = function(hash, fallback) {
	hash = java.lang.Integer.valueOf(hash);
	if (translateCode.currentLanguageTranslations) {
		let translation = translateCode.currentLanguageTranslations.get(null).get(hash);
		if (translation) {
			return translation;
		}
	}
	if (translateCode.defaultLanguageTranslations) {
		let translation = translateCode.defaultLanguageTranslations.get(null).get(hash);
		if (translation) {
			return translation;
		}
	}
	if (fallback) {
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
				return String(value);
			});
			text = java.lang.String.format(text, args);
		}
		return String(text);
	} catch (e) {
		log("ModdingTools: translateCode: " + e);
	}
	return "...";
};

try {
	let $ = new JavaImporter(InnerCorePackages.api.runtime.other),
		clazz = $.NameTranslation.__javaObject__,
		field = clazz.getDeclaredField("currentLanguageTranslations");
	field.setAccessible(true);
	translateCode.currentLanguageTranslations = field;
	if (isHorizon) {
		let proto = clazz.getDeclaredField("defaultLanguageTranslations");
		proto.setAccessible(true);
		translateCode.defaultLanguageTranslations = proto;
	}
} catch (e) {
	if (REVISION.indexOf("develop") != -1) {
		reportError(e);
	}
}
