if (!Array.isArray(TARGET) || TARGET.length < 2) {
	MCSystem.throwException("Target must contain path and output");
}

let target = (function(path) {
	let file = new java.io.File(path);
	if (file.isDirectory()) {
		let files = Files.listFileNames(path, true);
		files = Files.checkFormats(files, ".png");
		let uncounted = new Array();
		for (let i = 0; i < files.length; i++) {
			let currently = new String(files[i]);
			uncounted.push(new java.io.File(path, currently));
		}
		return uncounted;
	} else if (file.exists()) {
		return [file];
	}
	MCSystem.throwException("Input path does not exists");
})(TARGET[0]);

let output = new java.io.File(TARGET[1]);
output.mkdirs();

encount(target.length);

for (let i = 0; i < target.length; i++) {
	let readable = Files.shrinkPathes(TARGET[0], target[i].getPath());
	seek(readable, 1);
	let name = Files.getNameWithoutExtension(readable) + ".dnr",
		output = new java.io.File(TARGET[1], name),
		result = Files.readBytes(target[i]);
	Files.createNewWithParent(output.getPath());
	Files.writeBytes(output, encodeResource(result));
}

Translation.addTranslation("Textures compressed", {
	ru: "Ресурсы упакованы"
});

setCompletionMessage(translate("Textures compressed"));
