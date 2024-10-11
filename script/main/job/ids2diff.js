ids2diff = function(left, right, output) {
	if (arguments.length < 3) {
		MCSystem.throwException("ids2diff: Usage: <leftFile> <rightFile> <outputFile>");
	}

	log("ids2diff: " + left + ", " + right + " -> " + output);

	let leftFile = Files.of(left);
	if (!leftFile.exists() || leftFile.isDirectory()) {
		MCSystem.throwException("ids2diff: Left path not exists or directory");
	}

	let rightFile = Files.of(right);
	if (!rightFile.exists() || rightFile.isDirectory()) {
		MCSystem.throwException("ids2diff: Right path not exists or directory");
	}

	let outputFile = Files.of(output);
	if (outputFile.isDirectory()) {
		MCSystem.throwException("ids2diff: Output path is directory");
	}
	outputFile.getParentFile().mkdirs();

	let leftJson = JSON.parse(Files.read(leftFile));
	let rightJson = JSON.parse(Files.read(rightFile));

	function compare(left, right) {
		let differences = [];
		for (let key in left) {
			if (right[key] == null) {
				differences.push(key);
			}
		}
		for (let key in right) {
			if (left[key] == null && differences.indexOf(key) == -1) {
				differences.push(key);
			}
		}
		return differences;
	}

	let differences = {};
	differences.blocks = compare(leftJson.id.blocks, rightJson.id.blocks);
	differences.items = compare(leftJson.id.items, rightJson.id.items);
	Files.write(outputFile, JSON.stringify(differences));
};
