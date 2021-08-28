if (!Array.isArray(TARGET) || TARGET.length < 2) {
	MCSystem.throwException("Target must contain path and output");
}

let target = (function(path) {
	let file = new java.io.File(path);
	if (file.isDirectory()) {
		let files = Files.listFileNames(path, true);
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

Translation.addTranslation("Resorting associated files", {
	ru: "Организация ассоциаций файлов"
});

encount(target.length + 1);
seek(translate("Resorting associated files"), 1);

const EXPRESSION = /[\/|\^](.+)_([^_]+?)_([^_]+?)\.(.+)$/;

let recompared = new Object();
recompared.create = new Array();
recompared.alarm = new Array();
recompared.other = new Array();
recompared.draw = new Array();
recompared.step = new Array();
recompared.destroy = new Array();
recompared.unsorted = new Array();
recompared.sequence = ["create", "alarm", "other", "unsorted", "draw", "step", "destroy"];
target.forEach(function(path) {
	if (path.indexOf("_Create_") > 0) {
		recompared.create.push(path);
	} else if (path.indexOf("_Alarm_") > 0) {
		recompared.alarm.push(path);
	} else if (path.indexOf("_Other_") > 0) {
		recompared.other.push(path);
	} else if (path.indexOf("_Draw_") > 0) {
		recompared.draw.push(path);
	} else if (path.indexOf("_Step_") > 0) {
		recompared.step.push(path);
	} else if (path.indexOf("_Destroy_") > 0) {
		recompared.destroy.push(path);
	} else {
		recompared.unsorted.push(path);
	}
});
target = new Array();
recompared.sequence.forEach(function(category) {
	let somewhere = recompared[category];
	for (let i = 0; i < somewhere.length; i++) {
		let currently = String(somewhere[i]);
		target.push(new java.io.File(path, currently));
	}
});

const expressionToName = function(expression) {
	return "/** " + expression[2] + "[" + expression[3] + "] */\n    ";
};

for (let i = 0; i < target.length; i++) {
	let shrink = Files.shrinkPathes(TARGET[0], input.getPath());
	seek(shrink, 1);
	if (!shrink || shrink.length == 0) continue;
	let expression = EXPRESSION.exec(shrink);
	if (expression.length < 5) continue;
	let name = expression[1] + "." + expression[4],
		result = Files.read(input, true).join("\n    "),
		output = new java.io.File(TARGET[1], name);
	if (output.exists()) {
		Files.addText(output, "\n\n" + expressionToName(expression) + result);
	} else {
		Files.createNewWithParent(output.getPath());
		Files.write(output, expressionToName(expression) + result);
	}
}

Translation.addTranslation("Associated", {
	ru: "Ассоциировано"
});

setCompletionMessage(translate("Associated"));
