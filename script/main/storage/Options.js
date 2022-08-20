/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */

const Options = {};

Options.getValue = function(key) {
	let file = new java.io.File(Dirs.OPTION),
		reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file))),
		line = String(),
		result = String();
	while ((line = reader.readLine()) != null) {
		if (line.split(":")[0] == key) {
			result = line.split(":")[1];
			break;
		}
	}
	reader.close();
	return result;
};

Options.setValue = function(name, key) {
	let file = new java.io.File(Dirs.OPTION),
		reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file))),
		result = [],
		line;
	while ((line = reader.readLine()) != null) {
		if (line.split(":")[0] == name) {
			result.push(name + ":" + key);
		} else result.push(line);
	}
	Files.write(file, result.join("\n"));
};
