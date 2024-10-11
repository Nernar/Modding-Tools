folderTarget = function(file, optExtension) {
	let files = Files.listFiles(file, "file", optExtension);
	if (files == null /* || files.length == 0 */) {
		MCSystem.throwException("folderTarget: Input path does not exists or is empty!");
	}
	return files;
};

mirrorToFolder = function(what, input, output, optInExtension, optOutExtension) {
	if (arguments.length < 3) {
		MCSystem.throwException("mirrorToFolder: Target must contain action, path and output");
	}
	log("mirrorToFolder: " + input + ".. -> " + output + "..");

	let target = folderTarget(input, optInExtension);
	let result = [];
	for (let i = 0; i < target.length; i++) {
		let readable = Files.relative(target[i], input);
		let name = Files.basename(readable, true);
		if (typeof optOutExtension == "string") {
			name += optOutExtension;
		}
		let args = Array.prototype.slice.call(arguments, 5);
		args.unshift(Files.join(output, name));
		args.unshift(target[i].getPath());
		result.push(what.apply(this, args));
	}
	return result;
};

toInFolder = function(what, input, output, optInExtension) {
	if (arguments.length < 3) {
		MCSystem.throwException("toInFolder: Target must contain action, path and output");
	}
	log("toInFolder: " + input + ".. -> " + output);

	let target = folderTarget(input, optInExtension);
	let outputFile = Files.of(output);
	if (!Files.isFileDirectoryOrNew(outputFile) || Files.isDirectory(outputFile)) {
		MCSystem.throwException("toInFolder: Output path is directory (or parent is file) but should be file!");
	}

	let result = [];
	for (let i = 0; i < target.length; i++) {
		let args = Array.prototype.slice.call(arguments, 4);
		args.unshift(outputFile.getPath());
		args.unshift(target[i].getPath());
		result.push(what.apply(this, args));
	}
	return result;
};
