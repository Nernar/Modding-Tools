/**
 * Runs code in a separate data stream.
 */
const runAtScope = function(code, scope, name) {
	let scriptable = org.mozilla.javascript.ScriptableObject,
		source = name ? __name__ + "$" + name : "<no name>",
		ctx = org.mozilla.javascript.Context.enter();
	ctx.setLanguageVersion(200);
	let standart = ctx.initStandardObjects(null, !1);
	for (let item in scope) {
		scriptable.putProperty(standart, "" + item, scope[item]);
	}
	scope = new Object();
	try {
		scope.result = ctx.evaluateString(standart, code, source, 0, null);
	} catch (e) {
		scope.error = e;
	}
	return scope;
};

const REQUIRE = function(path) {
	if (REQUIRE.loaded.indexOf(path) == -1) {
		if (__code__.startsWith("develop")) {
			MCSystem.setLoadingTip("Requiring " + path);
			let file = new java.io.File(Dirs.EVALUATE, path);
			if (!file.exists()) throw null;
			let source = Files.read(file).toString(),
				code ="(function() {\n" + source + "\n})();",
				scope = runAtScope(code, REQUIRE.getScope(), path.replace(/\W/g, "$"));
			if (scope.error) throw scope.error;
			REQUIRE.results[path] = scope.result;
			REQUIRE.loaded.push(path);
			MCSystem.setLoadingTip(new String());
		}
	}
	return REQUIRE.results[path];
};

REQUIRE.loaded = new Array();
REQUIRE.results = new Object();

REQUIRE.getScope = function() {
	let scope = __mod__.compiledModSources.get(0).evaluateStringInScope("this");
	return assign(scope, {
		print: print,
		MCSystem: MCSystem,
		SHARE: function(name, obj) {
			if (__code__.startsWith("develop")) {
				scope[name] = obj;
			}
		},
		FIND: function(name) {
			if (__code__.startsWith("develop")) {
				this[name] = scope.eval(name);
			}
		}
	});
};

const restart = function() {
	if (!isSupportEnv) {
		return;
	}
	context.runOnUiThread(function() {
		StartEditor.create();
		currentEnvironment = __name__;
	});
	isSupportEnv = false;
};

const playTune = function(time, min, max, static) {
	handleThread(function() {
		let buffsize = android.media.AudioTrack.getMinBufferSize(4000,
			android.media.AudioFormat.CHANNEL_OUT_MONO,
			android.media.AudioFormat.ENCODING_PCM_16BIT);
		let audioTrack = new android.media.AudioTrack(android.media.AudioManager.STREAM_MUSIC,
			4000, android.media.AudioFormat.CHANNEL_OUT_MONO,
			android.media.AudioFormat.ENCODING_PCM_16BIT,
			buffsize, android.media.AudioTrack.MODE_STREAM);
		let samples = java.lang.reflect.Array.newInstance(java.lang.Short.TYPE, buffsize),
			amp = 10000, twopi = 8. * Math.atan(1.), ph = 0.0;
		audioTrack.play();
		playTune.track = audioTrack;
		while (playTune.track == audioTrack) {
			let evaluate = Date.now(), statable;
			if (!static) {
				statable = min + Math.random() * (max - min);
			}
			for (let i = 0; i < buffsize; i++) {
				samples[i] = amp * Math.sin(ph);
				ph += twopi * (!static ? statable : min +
					Math.random() * (max - min)) / 4000;
			}
			audioTrack.write(samples, 0, buffsize);
			let left = Date.now() - evaluate;
			if (time && left < time) {
				Ui.sleepMilliseconds(time - left);
			}
		}
		audioTrack.stop();
		audioTrack.release();
	});
};

const stopTune = function() {
	delete playTune.track;
};
