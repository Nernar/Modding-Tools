if (!Array.isArray(TARGET) || TARGET.length < 2) {
	MCSystem.throwException("Target must contain path and output");
}

let target = (function(path) {
	let file = new java.io.File(path);
	if (file.isDirectory()) {
		let files = Files.listFileNames(path, true);
		files = Files.checkFormats(files, ".js");
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
if (!output.exists()) {
	Files.createNewWithParent(output);
} else if (!output.isFile()) {
	MCSystem.throwException("Output must be file");
}

const DEPRECATED_HINT = " // DEPRECATED";

const locateStroke = function(source) {
	let index = String(source).search(/"/m);
	if (index < 1 || String(source).charAt(index - 1) != "\\") {
		return index;
	}
	return locateStroke(String(source).substring(index + 1));
};

const locateOpenBracket = function(source) {
	return String(source).search(/\{|\(|\[/m);
};

const locateCloseBracket = function(source) {
	return String(source).search(/\}|\)|\]/m);
};

const locateArgumentEnd = function(source) {
	return String(source).search(/\}|\)|\]|,/m);
};

const fetchLocatedStroke = function(located, source) {
	let index = locateStroke(source);
	if (index < 0) return String();
	let stroke = source.slice(0, index);
	if (stroke.length > 0) located.push(stroke);
	return source.substring(index + 1);
};

const fetchStrokesInsideBracket = function(located, source) {
	while (true) {
		let stroke = locateStroke(source),
			more = locateOpenBracket(source),
			less = locateCloseBracket(source);
		if (stroke != -1 && stroke < more && stroke < less) {
			source = fetchLocatedStroke(located, source.substring(stroke + 1));
			continue;
		}
		if (more != -1 && more < less) {
			source = fetchStrokesInsideBracket(located, source.substring(more + 1));
			continue;
		}
		if (less != -1) {
			return source.substring(less + 1);
		}
		return String();
	}
};

const fetchStrokesInsideArgument = function(located, source) {
	while (true) {
		let stroke = locateStroke(source),
			more = locateOpenBracket(source),
			less = locateArgumentEnd(source);
		if (stroke != -1 && stroke < more && stroke < less) {
			source = fetchLocatedStroke(located, source.substring(stroke + 1));
			continue;
		}
		if (more != -1 && more < less) {
			source = fetchStrokesInsideBracket(located, source.substring(more + 1));
			continue;
		}
		if (less != -1) {
			return source.substring(less + 1);
		}
		return String();
	}
};

const locateTranslate = function(source) {
	let index = String(source).search(/translate\(/m);
	if (index < 1 || /[^\w\B\.\$]/.test(String(source).charAt(index - 1))) {
		return index == -1 ? index : index + 9;
	}
	return locateTranslate(String(source).substring(index + 10));
};

const locateAddTranslation = function(source) {
	let index = String(source).search(/Translation\.addTranslation\(/m);
	if (index < 1 || /[^\w\B\.\$]/.test(String(source).charAt(index - 1))) {
		return index == -1 ? index : index + 26;
	}
	return locateAddTranslation(String(source).substring(index + 27));
};

const getTranslateableStrokes = function(source) {
	let located = new Array(), index;
	while ((index = locateTranslate(source)) != -1) {
		source = fetchStrokesInsideArgument(located, source.substring(index + 1));
	}
	return located;
};

const getAlreadyTranslatedStrokes = function(source) {
	let located = new Array(), index;
	while ((index = locateAddTranslation(source)) != -1) {
		source = fetchStrokesInsideArgument(located, source.substring(index + 1));
	}
	return located;
};

const updateDeprecationsWarning = function(source, deprecated) {
	let located = new Array(), result = source, index, addition = 0, removed = 0;
	while ((index = locateAddTranslation(source)) != -1) {
		source = fetchStrokesInsideArgument(located, source.substring(index + 1));
		let cursor = result.lastIndexOf(source);
		if (result.charAt(cursor) != ";") {
			let end = fetchStrokesInsideBracket(new Array(), source);
			cursor = result.lastIndexOf(end);
			if (result.charAt(cursor) != ";") {
				located = new Array();
				continue;
			}
		}
		cursor++;
		let inserted = false;
		for (let i = 0; i < located.length; i++) {
			let element = located[i],
				older = deprecated.indexOf(element);
			if (older != -1) {
				deprecated.splice(i, 1);
				inserted = true;
				break;
			}
		}
		let deprecation = result.slice(cursor, cursor + DEPRECATED_HINT.length);
		if (!deprecation.startsWith(" //") && inserted) {
			result = result.substring(0, cursor) +
				DEPRECATED_HINT + result.substring(cursor);
			addition++;
		} else if (deprecation == DEPRECATED_HINT && !inserted) {
			result = result.substring(0, cursor) +
				result.substring(cursor + DEPRECATED_HINT.length);
			removed++;
		}
		located = new Array();
	}
	return {
		source: result,
		addition: addition,
		removed: removed
	};
};

const hasDuplicates = function(located) {
	for (let i = 0; i < located.length; i++) {
		let element = located[i];
		if (located.lastIndexOf(element) != i) {
			return true;
		}
	}
	return false;
};

const removeDuplicates = function(located) {
	for (let i = 0; i < located.length; i++) {
		let element = located[i];
		if (located.lastIndexOf(element) != i) {
			located.splice(i, 1);
			i--;
		}
	}
};

const compareChanges = function(older, current) {
	let located = new Array();
	for (let i = 0; i < current.length; i++) {
		let element = current[i];
		if (older.indexOf(element) == -1) {
			located.push(element);
		}
	}
	return located;
};

const requireScriptTranslations = function(required) {
	return required.map(function(element, index, array) {
		return "Translation.addTranslation(\"" + element + "\", {});";
	});
};

let older = new Array();
let current = new Array();
encount(target.length * 2 + 2);

for (let i = 0; i < target.length; i++) {
	let readable = Files.shrinkPathes(TARGET[0], target[i].getPath());
	seek(readable, 1);
	let result = Files.read(target[i]),
		previous = getAlreadyTranslatedStrokes(result),
		next = getTranslateableStrokes(result);
	older = older.concat(previous);
	current = current.concat(next);
}

Translation.addTranslation("Fetching changes", {
	ru: "Получение изменений"
});

seek(translate("Fetching changes"), 1);

let deprecated = compareChanges(current, older);
hasDuplicates(current) && removeDuplicates(current);
let required = compareChanges(older, current);

Translation.addTranslation("Adding translations", {
	ru: "Добавление переводов"
});

seek(translate("Adding translations"), 1);

let added = 0;
if (required !== null) {
	added += required.length;
	let readed = requireScriptTranslations(required);
	Files.addText(output, "\n" + readed.join("\n"));
}

let deprecation = 0;
for (let i = 0; i < target.length; i++) {
	let readable = Files.shrinkPathes(TARGET[0], target[i].getPath());
	seek(readable, 1);
	let result = Files.read(target[i]),
		workout = updateDeprecationsWarning(result, deprecated);
	if (workout.addition > 0 || workout.removed > 0) {
		Files.write(element, workout.source);
		deprecation += workout.addition + workout.removed;
	}
}

Translation.addTranslation("Changes will be detected and synced", {
	ru: "Изменения найдены и синхронизированы"
});
Translation.addTranslation("Added new translations", {
	ru: "Добавлены новые переводы"
});
Translation.addTranslation("Edited deprecated translations", {
	ru: "Изменены устаревшие переводы"
});
Translation.addTranslation("Translations refetched", {
	ru: "Переводы перепроверены"
});

setCompletionMessage((function() {
	if (added > 0 && deprecation > 0) {
		return translate("Changes will be detected and synced") + " (" + added + "/" + deprecation + ")";
	}
	if (added > 0) {
		return translate("Added new translations") + " (" + added + ")";
	}
	if (deprecation > 0) {
		return translate("Edited deprecated translations") + " (" + deprecation + ")";
	}
	return translate("Translations refetched");
})());
