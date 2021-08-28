const minifySource = function(text, callback) {
	if (text !== null && text !== undefined) {
		text = encodeURI(text).replace(/%5B/g, "[").replace(/%5D/g, "]");
	}
	handleThread(function() {
		let reader = new Network.Reader("https://javascript-minifier.com/raw?input=" + text);
		reader.setCallback({
			onComplete: function(reader) {
				showHint(translate("Completed"));
			}
		});
		let result = reader.read();
		callback && callback(result);
	});
};

return function() {
	selectFile(".js", function(input) {
		let text = Files.read(input);
		minifySource(text, function(result) {
			let name = Files.getNameWithoutExtension(input.getName()) + ".min.js",
				file = new java.io.File(input.getParentFile().getPath(), name);
			Files.write(file, result);
		});
	});
};
