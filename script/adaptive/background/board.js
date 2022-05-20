const playTrack = function(time, buffer, delay) {
	handleThread(function() {
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
			ph = 0.0;
		audioTrack.play();
		playTrack.track = audioTrack;
		while (playTrack.track == audioTrack) {
			for (let b = 0; b < buffer.length; b++) {
				let note = buffer[b];
				if (note === undefined) continue;
				for (let m = 0; m < attachKeyboard.modifier; m++) {
					let evaluate = Date.now();
					for (let i = 0; i < buffsize; i++) {
						samples[i] = amp * Math.sin(ph);
						ph += twopi * note / 4000;
					}
					audioTrack.write(samples, 0, buffsize);
					let left = Date.now() - evaluate;
					if (time && left < time) {
						Interface.sleepMilliseconds(time - left);
					}
				}
			}
			delay !== undefined && Interface.sleepMilliseconds(delay);
		}
		audioTrack.stop();
		audioTrack.release();
	});
};

const reindexateText = function(items) {
	for (let i = 0; i < items.length; i++) {
		let view = items[i].getChildAt(0),
			text = String(view.getText()),
			index = text.indexOf(" ");
		view.setText(i + text.substring(index));
	}
};

Translation.addTranslation("Track creator", {
	ru: "Создатель треков"
});

const updateTrackTitle = function(popup) {
	popup.setTitle(translate("Track creator") + " *" + (attachKeyboard.modifier < 8 ?
		MathUtils.mathDivider(attachKeyboard.modifier / 8) : preround(attachKeyboard.modifier / 8, 1)));
};

const updateTrackNotesCount = function(text) {
	text.setText(String(attachKeyboard.track.length));
};

Translation.addTranslation("Currently track", {
	ru: "Текущий трек"
});
Translation.addTranslation("Create new track", {
	ru: "Создание нового трека"
});
Translation.addTranslation("Currently track will be lost and stopped.", {
	ru: "Текущий трек будет потерян и остановлен."
});
Translation.addTranslation("bass", {
	ru: "бас"
});
Translation.addTranslation("bit", {
	ru: "бит"
});
Translation.addTranslation("note", {
	ru: "нота"
});
Translation.addTranslation("Goat", {
	ru: "Коза"
});

const attachKeyboard = function() {
	let popup = new HieraclyPopup();
	updateTrackTitle(popup);
	popup.addFooter("blockRemove", function(view) {
		tryout(function() {
			let index = attachKeyboard.track.push(0) - 1;
			popup.addItem(index + " ");
			updateTrackNotesCount(text);
		});
	});
	popup.addFooter("blockUpdate", function(view) {
		tryout(function() {
			let index = attachKeyboard.track.push(60) - 1;
			popup.addItem(index + " - " + translate("bass"));
			updateTrackNotesCount(text);
		});
	});
	popup.addFooter("blockSlice", function(view) {
		tryout(function() {
			let index = attachKeyboard.track.push(120) - 1;
			popup.addItem(index + " - " + translate("bit"));
			updateTrackNotesCount(text);
		});
	});
	popup.addFooter("blockInsection", function(view) {
		tryout(function() {
			let index = attachKeyboard.track.push(150) - 1;
			popup.addItem(index + " - " + translate("note"));
			updateTrackNotesCount(text);
		});
	});
	popup.addFooter("menuBoard", function(view) {
		tryout(function() {
			evaluateScope(attachKeyboard.track, translate("Currently track"));
		}, function(e) {
			confirm(translate("Currently track"), attachKeyboard.track.join(", "));
		});
	});
	let text = new android.widget.TextView(context);
	text.setPadding(Interface.getY(30), 0, Interface.getY(5), 0);
	text.setTextSize(Interface.getFontSize(22));
	text.setTextColor(Interface.Color.WHITE);
	text.setTypeface(typeface);
	popup.views.footer.addView(text);
	popup.views.footers.push(text);
	popup.setOnClickListener(function(name, parent, view) {
		name = String(view.getChildAt(0).getText());
		let index = parseInt(name.split(" ", 1)[0]);
		attachKeyboard.track.splice(index, 1);
		popup.views.content.removeViewAt(index);
		popup.views.items.splice(index, 1);
		reindexateText(popup.views.items);
		updateTrackNotesCount(text);
	});
	let seek = new android.widget.SeekBar(context);
	seek.setMax(63);
	seek.setProgress(attachKeyboard.modifier + 1);
	seek.setOnSeekBarChangeListener({
		onProgressChanged: function(view, progress) {
			tryout(function() {
				attachKeyboard.modifier = Number(progress) + 1;
				updateTrackTitle(popup);
			});
		}
	});
	new BitmapDrawable("popup").attachAsBackground(seek);
	let params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.weight = 0.1;
	popup.getContainer().addView(seek, params);
	popup.setOnDismissListener(function() {
		attachKeyboard.track = [];
		showHint(translate("Goat"));
		stopTune();
	});
	updateTrackNotesCount(text);
	Popups.open(popup, "track");
	playTrack(25, attachKeyboard.track);
};

attachKeyboard.track = [];
attachKeyboard.modifier = 8;

return function(watcher) {
	handle(function() {
		attachKeyboard();
		watcher && watcher(attachKeyboard.track);
	});
};
