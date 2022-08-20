/**
 * Runs code in a separate data stream.
 * @param {string} code something to evaluate
 * @param {Object} [scope] fo resolve
 * @param {string} [name] of script
 * @returns evaluate [[result]] or [[error]]
 */
const runAtScope = function(code, scope, name) {
	let source = name ? NAME + "$" + name : "<no name>",
		executable = __mod__.compiledModSources.get(0);
	source = source.replace(/[^\w\$\<\>\.\-\s]/gi, "$");
	if (scope == null || typeof scope != "object") {
		scope = executable.parentContext.newObject(executable.getScope());
	}
	return resolveThrowable.invoke(function() {
		return {
			source: source,
			scope: scope,
			context: executable.parentContext,
			result: executable.parentContext.evaluateString(scope, code, source, 0, null)
		};
	}, function(th) {
		Logger.Log(source + ": " + InnerCorePackages.api.log.ICLog.getStackTrace(th), "WARNING");
		if (th instanceof org.mozilla.javascript.JavaScriptException) {
			return {
				error: th.getValue()
			};
		}
		return {
			error: new Error(th != null ? th.toString() : "null")
		};
	});
};

const findWrappedScript = function(path) {
	let file = new java.io.File(Dirs.SCRIPT_REVISION, path);
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
			MCSystem.throwException("ModdingTools: not found " + path + " script");
		}
		log("ModdingTools: wrapping " + file + " script");
		let source = Files.read(file).toString(),
			code = "(function() {\n" + source + "\n})();",
			scope = runAtScope(code, who, path);
		if (scope.error) throw scope.error;
		return scope.result;
	} else if (file == null && REVISION.indexOf("alpha") != -1) {
		let file = new java.io.File(Dirs.SCRIPT_TESTING, path);
		if (!file.exists()) {
			MCSystem.throwException("ModdingTools: not found " + path + " testing executable");
		}
		log("ModdingTools: wnwrapping " + file + " source");
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
	}
	if (file == null) {
		MCSystem.throwException("ModdingTools: not found " + path + " executable");
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
