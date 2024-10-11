translation = function(scriptDirectory, translationFile) {
	if (arguments.length < 2) {
		MCSystem.throwException("translation: Usage: <scriptDirectory> <translationFile>");
	}

	log("translation: " + scriptDirectory + ".. -> " + translationFile);

	let scripts = Files.listFiles(scriptDirectory, "relative", ["js", "ts"]);
	if (scripts == null || scripts.length == 0) {
		MCSystem.throwException("translation: Input scripts directory does not exists or empty!");
	}
	translationFile = Files.of(translationFile);
	if (!Files.isFileOrNew(translationFile)) {
		MCSystem.throwException("translation: Output translation should be file!");
	}

	function locateStroke(source) {
		let index = ("" + source).search(/"/m);
		if (index < 1 || ("" + source).charAt(index - 1) != "\\") {
			return index;
		}
		return locateStroke(("" + source).substring(index + 1));
	}

	function locateOpenBracket(source) {
		return ("" + source).search(/\{|\(|\[/m);
	}

	function locateCloseBracket(source) {
		return ("" + source).search(/\}|\)|\]/m);
	}

	function locateArgumentEnd(source) {
		return ("" + source).search(/\}|\)|\]|,/m);
	}

	function fetchLocatedStroke(located, source) {
		let index = locateStroke(source);
		if (index < 0) return "";
		let stroke = source.slice(0, index);
		if (stroke.length > 0) located.push(stroke);
		return source.substring(index + 1);
	}

	function fetchStrokesInsideBracket(located, source) {
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
			return "";
		}
	}

	function fetchStrokesInsideArgument(located, source) {
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
			return "";
		}
	}

	function locateTranslate(source) {
		let index = ("" + source).search(/translate\(/m);
		if (index < 1 || /[^\w\B\.\$]/.test(("" + source).charAt(index - 1))) {
			return index == -1 ? index : index + 9;
		}
		return locateTranslate(("" + source).substring(index + 10));
	}

	function locateAddTranslation(source) {
		let index = ("" + source).search(/Translation\.addTranslation\(/m);
		if (index < 1 || /[^\w\B\.\$]/.test(("" + source).charAt(index - 1))) {
			return index == -1 ? index : index + 26;
		}
		return locateAddTranslation(("" + source).substring(index + 27));
	}

	function getTranslateableStrokes(source) {
		let located = [], index;
		while ((index = locateTranslate(source)) != -1) {
			source = fetchStrokesInsideArgument(located, source.substring(index + 1));
		}
		return located;
	}

	function getAlreadyTranslatedStrokes(source) {
		let located = [], index;
		while ((index = locateAddTranslation(source)) != -1) {
			source = fetchStrokesInsideArgument(located, source.substring(index + 1));
		}
		return located;
	}

	const DEPRECATED_HINT = " // DEPRECATED";

	function updateDeprecationsWarning(source, deprecated) {
		let located = [], result = source, index, addition = 0, removed = 0;
		while ((index = locateAddTranslation(source)) != -1) {
			source = fetchStrokesInsideArgument(located, source.substring(index + 1));
			let cursor = result.lastIndexOf(source);
			if (result.charAt(cursor) != ";") {
				let end = fetchStrokesInsideBracket([], source);
				cursor = result.lastIndexOf(end);
				if (result.charAt(cursor) != ";") {
					located = [];
					continue;
				}
			}
			cursor++;
			let inserted = false;
			let pointer;
			for (let i = 0; i < located.length; i++) {
				let element = located[i],
					older = deprecated.indexOf(element);
				if (older != -1) {
					pointer = element;
					deprecated.splice(i, 1);
					inserted = true;
					break;
				}
			}
			let deprecation = result.slice(cursor, cursor + DEPRECATED_HINT.length);
			if (!deprecation.startsWith(" //") && inserted) {
				result = result.substring(0, cursor) +
					DEPRECATED_HINT + result.substring(cursor);
				log("translation: Not found '" + pointer + "', it will be deprecated!");
				addition++;
			} else if (deprecation == DEPRECATED_HINT && !inserted) {
				result = result.substring(0, cursor) +
					result.substring(cursor + DEPRECATED_HINT.length);
				log("translation: Removed reused deprecation '" + pointer + "'");
				removed++;
			}
			located = [];
		}
		return {
			source: result,
			addition: addition,
			removed: removed
		};
	}

	function hasDuplicates(located) {
		for (let i = 0; i < located.length; i++) {
			let element = located[i];
			if (located.lastIndexOf(element) != i) {
				return true;
			}
		}
		return false;
	}

	function removeDuplicates(located) {
		for (let i = 0; i < located.length; i++) {
			let element = located[i];
			if (located.lastIndexOf(element) != i) {
				located.splice(i, 1);
				i--;
			}
		}
	}

	function compareChanges(older, current) {
		let located = [];
		for (let i = 0; i < current.length; i++) {
			let element = current[i];
			if (older.indexOf(element) == -1) {
				located.push(element);
			}
		}
		return located;
	}

	function requireScriptTranslations(required) {
		return required.map(function(element, index, array) {
			return "Translation.addTranslation(" + stringifyObject(element) + ", {});";
		});
	}

	let older = [];
	let current = [];
	for (let i = 0, l = scripts.length; i < l; i++) {
		let result = Files.read(Files.of(scriptsDirectory, scripts[i]));
		let next = getTranslateableStrokes(result);
		current = current.concat(next);
		if (next.length > 0) {
			log("translation: Found in " + readable + " " + next.length + " translations");
		}
		let previous = getAlreadyTranslatedStrokes(result);
		older = older.concat(previous);
	}

	let deprecated = compareChanges(current, older);
	if (hasDuplicates(current)) {
		removeDuplicates(current);
	}
	let required = compareChanges(older, current);

	let added = 0;
	if (required != null) {
		added += required.length;
		let readed = requireScriptTranslations(required);
		Files.append(translationFile, readed.join("\n"), true);
	}

	let deprecation = 0;
	for (let i = 0, l = scripts.length; i < l; i++) {
		let script = Files.of(scriptDirectory, scripts[i]);
		let result = Files.read(script);
		let workout = updateDeprecationsWarning(result, deprecated);
		if (workout.addition > 0 || workout.removed > 0) {
			Files.write(script, workout.source);
			deprecation += workout.addition + workout.removed;
		}
	}
};
