/**
 * Little specification: sound with a certain frequency
 * plays at the system level, it will not be recorded by
 * built-in recorder on screen during recording, it is used
 * exclusively for debugging purposes.
 */
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
