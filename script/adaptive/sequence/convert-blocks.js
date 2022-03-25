Translation.addTranslation("Turning models into renders", {
	ru: "Превращаем модели в рендеры"
});
prepare("Turning models into renders");

if (!Array.isArray(TARGET) || TARGET.length < 2) {
	MCSystem.throwException("Target must contain path and output");
}

let target = (function(path) {
	let file = new java.io.File(path);
	if (file.isDirectory()) {
		let files = Files.listFileNames(path, true);
		files = Files.checkFormats(files, ".json");
		let uncounted = new Array();
		for (let i = 0; i < files.length; i++) {
			let currently = String(files[i]);
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
	let internal = Files.getNameWithoutExtension(readable),
		output = new java.io.File(TARGET[1], internal + ".js"),
		result = Files.read(target[i]);
	output.getParentFile().mkdirs();
	convertJsonBlock(result, function(converted) {
		let countedAnyFirstLetter = false;
		converted.define.id = internal.split("_").map(function(value) {
			if (!countedAnyFirstLetter && value.length == 0) return "_";
			return countedAnyFirstLetter ? value[0].toUpperCase() + value.slice(1) :
				(countedAnyFirstLetter = true, value);
		}).join("");
		let converter = new BlockConverter();
		converter.attach(converted);
		converter.execute();
		Files.write(output, converter.getResult());
	});
}

Translation.addTranslation("Exported %s block renders", {
	ru: "Сохранено %s рендеров блоков"
});
setCompletionMessage(translate("Exported %s block renders", target.length));
