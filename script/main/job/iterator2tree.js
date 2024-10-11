iterator2tree = function(input, output) {
	if (arguments.length < 2) {
		MCSystem.throwException("iterator2tree: Usage: <inputFile> <outputFile>");
	}

	log("iterator2tree: " + input + " -> " + output);

	let inputFile = Files.of(input);
	if (!inputFile.exists() || inputFile.isDirectory()) {
		MCSystem.throwException("iterator2tree: Input path not exists or is directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("iterator2tree: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let target = {};
	let json = JSON.parse("" + $.FileTools.readFileText(inputFile.getPath()));
	for (let element in json) {
		if (element.indexOf("/") == -1) {
			target[element] = json[element];
			continue;
		}
		let tree = element.split("/");
		let contextual = target;
		for (let i = 0; i < tree.length; i++) {
			if (i == tree.length - 1) {
				contextual[tree[i]] = json[element];
				break;
			}
			let next = contextual[tree[i]];
			if (next == null || typeof next != "object") {
				contextual[tree[i]] = {};
			}
			contextual = contextual[tree[i]];
		}
	}
	$.FileTools.writeFileText(outputFile.getPath(), JSON.stringify(target, null, "\t"));
};
