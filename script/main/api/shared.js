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
		Logger.Log(source + ": " + findCorePackage().api.log.ICLog.getStackTrace(th), "WARNING");
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
			MCSystem.throwException("Not found " + path + " script");
		}
		Logger.Log("Wrapping " + file + " script", "MOD");
		let source = Files.read(file).toString(),
			code = "(function() {\n" + source + "\n})();",
			scope = runAtScope(code, who, path);
		if (scope.error) throw scope.error;
		return scope.result;
	} else if (file == null && REVISION.indexOf("alpha") != -1) {
		let file = new java.io.File(Dirs.SCRIPT_TESTING, path);
		if (!file.exists()) {
			MCSystem.throwException("Not found " + path + " testing executable");
		}
		Logger.Log("Unwrapping " + file + " source", "MOD");
		return tryoutSafety(function() {
			let source = decompileExecuteable(Files.readBytes(file)),
				code = "(function() {\n" + source + "\n})();",
				scope = runAtScope(code, who, path);
			if (scope.error) throw scope.error;
			return scope.result;
		}, null);
	}
	if (file == null) {
		MCSystem.throwException("Not found " + path + " executable");
	}
	return tryoutSafety(function() {
		let source = decompileExecuteable(Files.readBytes(file)),
			code = "(function() {\n" + source + "\n})();",
			scope = runAtScope(code, who, path);
		if (scope.error) throw scope.error;
		return scope.result;
	}, null);
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
			Logger.Log(message, name);
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
	return tryout(function() {
		let something = REQUIRE(path, scope);
		post && post(something);
		return something;
	}, function(e) {
		Logger.Log(e, "WARNING");
	}, null);
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
	return tryout(function() {
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
	}, "...");
};

tryoutSafety(function() {
	let $ = new JavaImporter(findCorePackage().api.runtime.other),
		clazz = $.NameTranslation.__javaObject__,
		field = clazz.getDeclaredField("currentLanguageTranslations");
	field.setAccessible(true);
	translateCode.currentLanguageTranslations = field;
	if (isHorizon) {
		let proto = clazz.getDeclaredField("defaultLanguageTranslations");
		proto.setAccessible(true);
		translateCode.defaultLanguageTranslations = proto;
	}
});

const playTuneDirectly = function() {
	let buffsize = android.media.AudioTrack.getMinBufferSize(4000,
		android.media.AudioFormat.CHANNEL_OUT_MONO,
		android.media.AudioFormat.ENCODING_PCM_16BIT);
	let audioTrack = new android.media.AudioTrack(android.media.AudioManager.STREAM_MUSIC,
		4000, android.media.AudioFormat.CHANNEL_OUT_MONO,
		android.media.AudioFormat.ENCODING_PCM_16BIT,
		buffsize, android.media.AudioTrack.MODE_STREAM);
	let samples = java.lang.reflect.Array.newInstance(java.lang.Short.TYPE, buffsize),
		amp = 10000,
		twopi = 8. * Math.atan(1.),
		ph = .0;
	audioTrack.play();
	return {
		track: audioTrack,
		write: function(duration, min, max, static) {
			let evaluate = Date.now(),
				statable;
			if (!static) {
				statable = random(min, max);
			}
			let required = Math.round(buffsize / 180 * duration);
			for (let i = 0; i < buffsize; i++) {
				ph += twopi * (!static ? statable : min +
					Math.random() * (max - min)) / 4000;
				if (required < i) samples[i] = 0;
				else samples[i] = amp * Math.sin(ph);
			}
			audioTrack.write(samples, 0, buffsize);
			return Date.now() - evaluate;
		},
		sleepDuration: function(duration, offset) {
			if (duration != null && offset < duration) {
				Interface.sleepMilliseconds(duration - offset);
			}
		},
		writeDirectly: function(duration, min, max, static) {
			let offset = this.write(duration, min, max, static);
			this.sleepDuration(duration, offset);
		},
		writeThenSleep: function(duration, min, max, static) {
			let offset = this.write(duration, min, max, static),
				instance = this;
			handleThread(function() {
				instance.sleepDuration(duration, offset);
				audioTrack.flush();
			});
		},
		writeThenRelease: function(duration, min, max, static) {
			let offset = this.write(duration, min, max, static),
				instance = this;
			handleThread(function() {
				instance.sleepDuration(duration, offset);
				instance.release();
			});
		},
		writeAsync: function(duration, min, max, static) {
			let instance = this;
			handleThread(function() {
				instance.write(duration, min, max, static);
			});
		},
		release: function() {
			if (this.track !== undefined) {
				audioTrack.stop();
				audioTrack.release();
			}
			delete this.track;
		}
	};
};

const playTune = function(duration, min, max, static, forever) {
	let track = playTuneDirectly();
	playTune.track = track;
	handleThread(function() {
		do {
			track.writeDirectly(duration, min, max, static);
		} while (forever !== false && playTune.track == track);
		track.release();
	});
};

const stopTune = function() {
	delete playTune.track;
};

const requireLogotype = function() {
	return tryoutSafety(function() {
		if (REVISION.indexOf("alpha") != -1) {
			return "logo_alpha";
		} else if (REVISION.indexOf("beta") != -1) {
			return "logo_beta";
		} else if (REVISION.indexOf("preview") != -1) {
			return "logo_preview";
		}
	}, "logo");
};

const requireInvertedLogotype = function() {
	let logotype = requireLogotype();
	if (logotype == "logo") return "logo_beta";
	if (logotype == "logo_alpha") return "logo_preview";
	if (logotype == "logo_beta") return "logo";
	if (logotype == "logo_preview") return "logo_alpha";
	Logger.Log("No inverted logotype for " + logotype, "INFO");
};

const isInvertedLogotype = function() {
	let logotype = requireLogotype();
	if (logotype == "logo_alpha") return true;
	if (logotype == "logo_beta") return true;
	return false;
};
