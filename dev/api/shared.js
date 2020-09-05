function restart() {
	if (!isSupportEnv) return;
	context.runOnUiThread(function() {
		StartEditor.create();
		currentEnvironment = __name__;
	}), isSupportEnv = false;
}

function playTune(time, min, max, static) {
	handleThread(function() {
		var buffsize = android.media.AudioTrack.getMinBufferSize(4000,
			android.media.AudioFormat.CHANNEL_OUT_MONO,
			android.media.AudioFormat.ENCODING_PCM_16BIT);
		var audioTrack = new android.media.AudioTrack(android.media.AudioManager.STREAM_MUSIC,
			4000, android.media.AudioFormat.CHANNEL_OUT_MONO,
			android.media.AudioFormat.ENCODING_PCM_16BIT,
			buffsize, android.media.AudioTrack.MODE_STREAM);
		var samples = java.lang.reflect.Array.newInstance(java.lang.Short.TYPE, buffsize),
			amp = 10000, twopi = 8. * Math.atan(1.), ph = 0.0;
		(audioTrack.play(), playTune.track = audioTrack);
		while (playTune.track == audioTrack) {
			var evaluate = Date.now();
			if (!static) var statable = min + Math.random() * (max - min);
			for (var i = 0; i < buffsize; i++) {
				samples[i] = (amp * Math.sin(ph));
				ph += twopi * (!static ? statable : min +
					Math.random() * (max - min)) / 4000;
			}
			audioTrack.write(samples, 0, buffsize);
			var left = Date.now() - evaluate;
			if (time && left < time) Ui.sleepMilliseconds(time - left);
		}
		audioTrack.stop();
		audioTrack.release();
	});
}

function stopTune() {
	delete playTune.track;
}
