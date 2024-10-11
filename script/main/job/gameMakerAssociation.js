gameMakerAssociation = function(scriptDirectory, outputDirectory) {
	if (arguments.length < 2) {
		MCSystem.throwException("gameMakerAssociation: Usage: <scriptDirectory> <outputDirectory>");
	}

	log("gameMakerAssociation: " + scriptDirectory + " -> " + outputDirectory);

	let scripts = Files.listFiles(scriptDirectory, "relative");
	if (scripts == null || scripts.length == 0) {
		MCSystem.throwException("gameMakerAssociation: Input scripts directory does not exists or empty!");
	}
	outputDirectory = Files.of(outputDirectory);
	if (!Files.isDirectoryOrNew(outputDirectory)) {
		MCSystem.throwException("gameMakerAssociation: Output directory cannot be written!");
	}

	let recompared = {
		create: [],
		alarm: [],
		other: [],
		unsorted: [],
		draw: [],
		step: [],
		destroy: []
	};
	for (let i = 0, l = scripts.length; i < l; i++) {
		let basename = Files.basename(scripts[i], true);
		if (basename.indexOf("_Create_") > 0) {
			recompared.create.push(scripts[i]);
		} else if (basename.indexOf("_Alarm_") > 0) {
			recompared.alarm.push(scripts[i]);
		} else if (basename.indexOf("_Other_") > 0) {
			recompared.other.push(scripts[i]);
		} else if (basename.indexOf("_Draw_") > 0) {
			recompared.draw.push(scripts[i]);
		} else if (basename.indexOf("_Step_") > 0) {
			recompared.step.push(scripts[i]);
		} else if (basename.indexOf("_Destroy_") > 0) {
			recompared.destroy.push(scripts[i]);
		} else {
			recompared.unsorted.push(scripts[i]);
		}
	}

	for (let category in recompared) {
		for (let i = 0, l = recompared[category].length; i < l; i++) {
			let shrink = recompared[category][i];
			let expression = /[\/|\^](.+)_([^_]+?)_([^_]+?)\.(.+)$/.exec(shrink);
			if (expression.length >= 5) {
				let result = Files.readAsLines(Files.of(scriptDirectory, shrink)).join("\n    ");
				let output = Files.of(outputDirectory, expression[1] + "." + expression[4]);
				let comment = "/** " + expression[2] + "[" + expression[3] + "] */\n    ";
				if (Files.isFile(output)) {
					Files.append(output, comment + result, 2);
				} else {
					Files.write(output, comment + result);
				}
			}
		}
	}
};
