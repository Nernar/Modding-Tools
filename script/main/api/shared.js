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
	return tryout(function() {
		return {
			source: source,
			scope: scope,
			context: executable.parentContext,
			result: executable.parentContext.evaluateString(scope, code, source, 0, null)
		};
	}, function(e) {
		return {
			error: e
		};
	});
};

const REQUIRE = function(path) {
	if (REQUIRE.loaded.indexOf(path) == -1) {
		MCSystem.setLoadingTip(NAME + ": Requiring " + path);
		if (REVISION.startsWith("develop") && path.endsWith(".js")) {
			let file = new java.io.File(Dirs.EVALUATE, path);
			if (!file.exists()) throw null;
			let source = Files.read(file).toString(),
				code = "(function() {\n" + source + "\n})();",
				scope = runAtScope(code, REQUIRE.getScope(path), path);
			if (scope.error) throw scope.error;
			REQUIRE.results[path] = scope.result;
			REQUIRE.loaded.push(path);
		} else if (REVISION.indexOf("alpha") != -1) {
			let file = new java.io.File(Dirs.TESTING, path);
			if (!file.exists()) throw null;
			let source = decompileExecuteable(Files.readBytes(file)),
				code = "(function() {\n" + source + "\n})();",
				scope = runAtScope(code, REQUIRE.getScope(path), path);
			if (scope.error) throw scope.error;
			REQUIRE.results[path] = scope.result;
			REQUIRE.loaded.push(path);
		}
		MCSystem.setLoadingTip(NAME);
	}
	return REQUIRE.results[path];
};

REQUIRE.loaded = new Array();
REQUIRE.results = new Object();

REQUIRE.getScope = function(name) {
	let scope = __mod__.compiledModSources.get(0).evaluateStringInScope("this");
	return assign(/* REVISION.indexOf("alpha") != -1 ? scope : */ new Object(), {
		SHARE: function(name, obj) {
			if (REVISION.startsWith("develop")) {
				if (typeof name == "object") {
					Object.defineProperties(scope, name);
				} else scope[name] = obj;
			}
		},
		FIND: function(name) {
			if (REVISION.startsWith("develop")) {
				this[name] = scope.eval(name);
			} else if (REVISION.startsWith("testing")) {
				this[name] = scope[name];
			}
		},
		CLASS: function(path, instant) {
			return ExecuteableSupport.newInstance(path, instant);
		},
		log: function(message) {
			Logger.Log(message, name);
		}
	});
};

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
	Logger.Log("No inverted logotype for " + logotype, "DEV-CORE");
};

const isInvertedLogotype = function() {
	let logotype = requireLogotype();
	if (logotype == "logo_alpha") return true;
	if (logotype == "logo_beta") return true;
	return false;
};
