/**
 * Some useful code; warnings and information.
 */
function showHint(hint: string, color?: string | number, reawait?: boolean) {
	if (showHint.launchStacked !== undefined) {
		showHint.launchStacked.push({
			hint: hint,
			color: color,
			reawait: reawait
		});
		return;
	}
	Logger.Log("Modding Tools: " + hint, "MOD/HINT");
	handle(function() {
		let window = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (window === null) {
			window = new HintAlert();
		}
		window.setStackable(!hintStackableDenied);
		if (reawait && !window.canStackedMore()) {
			window.removeFirstStacked();
		}
		window.addMessage(hint, color, reawait);
		if (!window.isOpened()) window.attach();
	});
}

showHint.launchStacked = [];

showHint.unstackLaunch = function() {
	let stack = this.launchStacked;
	delete this.launchStacked;
	for (let i = 0; i < stack.length; i++) {
		showHint(stack[i].hint, stack[i].color, stack[i].reawait);
	}
};

/**
 * Little specification: sound with a certain frequency
 * plays at the system level, it will not be recorded by
 * built-in recorder on screen during recording, it is used
 * exclusively for debugging purposes.
 * @requires `isAndroid()`
 */
function playTuneDirectly() {
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
		write: function(duration: number, min: number, max: number, static?: boolean) {
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
		sleepDuration: function(duration: number, offset: number) {
			if (duration != null && offset < duration) {
				java.lang.Thread.sleep(duration - offset);
			}
		},
		writeDirectly: function(duration: number, min: number, max: number, static?: boolean) {
			let offset = this.write(duration, min, max, static);
			this.sleepDuration(duration, offset);
		},
		writeThenSleep: function(duration: number, min: number, max: number, static?: boolean) {
			let offset = this.write(duration, min, max, static),
				instance = this;
			handleThread(function() {
				instance.sleepDuration(duration, offset);
				audioTrack.flush();
			});
		},
		writeThenRelease: function(duration: number, min: number, max: number, static?: boolean) {
			let offset = this.write(duration, min, max, static),
				instance = this;
			handleThread(function() {
				instance.sleepDuration(duration, offset);
				instance.release();
			});
		},
		writeAsync: function(duration: number, min: number, max: number, static?: boolean) {
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
}

function playTune(duration: number, min: number, max: number, static?: boolean, forever?: boolean) {
	let track = playTuneDirectly();
	playTune.track = track;
	handleThread(function() {
		do {
			track.writeDirectly(duration, min, max, static);
		} while (forever !== false && playTune.track == track);
		track.release();
	});
}

playTune.track = null;

function stopTune() {
	delete playTune.track;
}

const NETWORK_RETRY_TIME = 60000;

function checkOnlineable(action) {
	handleThread(function() {
		if (!Connectivity.isOnline()) {
			warningMessage = "Please check network connection. Connect to collect updates, special events and prevent key deprecation.";
			handle(function() {
				checkOnlineable(action);
			}, NETWORK_RETRY_TIME);
			return;
		} else {
			warningMessage = null;
		}
		action && action();
	});
}
