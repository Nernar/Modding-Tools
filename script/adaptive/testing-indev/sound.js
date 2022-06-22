IMPORT("Music");

Translation.addTranslation("Load any world firstly", {
	ru: "Для начала загрузите любой мир"
});

return function() {
	if (!Level.isLoaded()) {
		showHint(translate("Load any world firstly"));
		return;
	}
	let music = new Music();
	music.setVolume(95);
	music.resizeSource(0.8);
	music.setIsDynamical(true);
	music.setReceiver(Player.get());
	music.updateVolume(function() {
		return random(90, 100);
	});
	music.randomizeSource(function(music, baseSource) {
		return "radio_" + random(0, 3) + ".mp3";
	});
	music.setAsCustom(function(music) {
		var position = Player.getPosition();
		position.z += random(9.5, 10);
		return position;
	});
	music.setIsReversedSource(false);
	music.play();
};
