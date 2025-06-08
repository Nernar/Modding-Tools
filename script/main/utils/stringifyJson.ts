function stringifyJson(
	what: any,
	keyReplacer?: (to: string, key: number | string, value: any) => string,
	valueReplacer?: (key: number | string, value: any) => any,
	tab?: string,
	shifted?: number,
	key?: number | string
): string {
	tab = tab ? "" + tab : "\t";
	shifted = shifted || 0;
	key = key || null;
	if (typeof valueReplacer == "function") {
		let next = valueReplacer(key, what);
		if (next !== undefined) {
			if (typeof next == "string") {
				return next;
			}
			what = next;
		}
	}
	if (what === undefined) {
		return null;
	}
	if (what == null) {
		return "null";
	}
	if (Array.isArray(what)) {
		let buffer: string[] = [];
		if (isLightweightArray(what)) {
			for (let i = 0; i < what.length; i++) {
				let next = stringifyJson(what[i], null, valueReplacer, null, 0, i);
				if (next == null) {
					continue;
				}
				buffer.push(next);
			}
			return buffer.length > 0 ? buffer[0].startsWith("[") ? "[" + buffer.join(", ") + "]" : "[ " + buffer.join(", ") + " ]" : "[]";
		}
		for (let i = 0; i < what.length; i++) {
			let next = stringifyJson(what[i], keyReplacer, valueReplacer, tab, shifted + 1, i);
			if (next == null) {
				continue;
			}
			buffer.push(next);
		}
		return buffer.length > 0 ? "[\n" + tab.repeat(shifted + 1) + buffer.join(",\n" + tab.repeat(shifted + 1)) + "\n" + tab.repeat(shifted) + "]" : "[]";
	}
	if (typeof what == "object") {
		let buffer: string[] = [];
		for (let element in what) {
			let to = element;
			if (typeof keyReplacer == "function") {
				to = keyReplacer(to, key, what[to]);
				if (!what.hasOwnProperty(to)) {
					continue;
				}
			}
			let next = stringifyJson(what[to], keyReplacer, valueReplacer, tab, shifted + 1, to);
			if (next == null) {
				continue;
			}
			buffer.push(to + ": " + next);
		}
		return buffer.length > 0 ? "{\n" + tab.repeat(shifted + 1) + buffer.join(",\n" + tab.repeat(shifted + 1)) + "\n" + tab.repeat(shifted) + "}" : "{}";
	}
	switch (typeof what) {
		case "boolean":
			return what ? "true" : "false";
		case "number":
			return "" + org.mozilla.javascript.ScriptRuntime.numberToString(what, 10);
		case "string":
			return "\"" + what + "\"";
		case "function":
			return what.toSource().trim();
	}
	log("Modding Tools: Unresolved property " + what + " with type " + typeof what);
	return null;
}

function isLightweightArray(what: any[]) {
	if (what.length > 8) {
		return false;
	}
	for (let i = 0; i < what.length; i++) {
		if (what[i] == null) {
			continue;
		}
		let type = typeof what[i];
		if (type == "boolean" || type == "undefined") {
			continue;
		}
		if (type == "string" || type == "number") {
			if (("" + what[i]).length > 25 - what.length) {
				return false;
			}
			continue;
		}
		if (type == "object") {
			if (Array.isArray(what[i]) && what.length == 1) {
				return isLightweightArray(what[i]);
			}
		}
		return false;
	}
	return true;
}

function stringifyJsonIndented(
	what: any,
	keyReplacer?: (to: string, key: number | string, value: any) => string,
	valueReplacer?: (key: number | string, value: any) => any,
	tab?: string,
	shifted?: number,
	key?: number | string
): string {
	tab = tab ? "" + tab : "\t";
	shifted = shifted || 0;
	return tab.repeat(shifted) + stringifyJson(what, keyReplacer, valueReplacer, tab, shifted, key);
}
