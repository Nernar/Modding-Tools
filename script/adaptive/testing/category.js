const recursiveRefresh = function(result, file, key) {
	let name = Files.getNameWithoutExtension(file.getName());
	key = String(key === undefined ? name : key);
	if (!key.toLowerCase().endsWith(name.toLowerCase())) {
		name = name.substring(0, 1).toUpperCase() + name.substring(1);
		key += name;
	}
	if (file.isDirectory()) {
		let list = file.listFiles();
		for (let i = 0; i < list.length; i++) {
			recursiveRefresh(result, list[i], key);
		}
	} else if (file.getName().endsWith(".dnr")) {
		result.push(key);
	}
};

const refreshCategoriedIcons = function() {
	refreshCategoriedIcons.currently = new Object();
	let file = new java.io.File(Dirs.ASSET);
	if (!file.exists()) throw null;
	let list = file.listFiles();
	for (let i = 0; i < list.length; i++) {
		let category = new Array(), name = list[i].getName();
		if (list[i].isFile()) {
			if (name.endsWith(".dnr")) {
				if (refreshCategoriedIcons.currently["$"]) {
					category = refreshCategoriedIcons.currently["$"];
				}
				recursiveRefresh(category, list[i]);
				name = "$";
			}
		} else recursiveRefresh(category, list[i]);
		if (category.length > 0) {
			category.sort();
			refreshCategoriedIcons.currently[name] = category;
		}
	}
};

refreshCategoriedIcons();

const attachCategoriedIcons = function(control) {
	if (isEmpty(refreshCategoriedIcons.currently)) {
		MCSystem.throwException("At least one category must be defined");
	}
	let categories = new Array();
	for (let category in refreshCategoriedIcons.currently) {
		categories.push(String(category));
	}
	categories.sort();
	for (let c = 0; c < categories.length; c++) {
		let name = categories[c], items = refreshCategoriedIcons.currently[name];
		if (name != "$") control.addCategory(name);
		for (let i = 0; i < items.length; i++) {
			control.addMessage(items[i], items[i]);
		}
	}
};

return function() {
	handle(function() {
		let control = new MenuWindow();
		control.setOnClickListener(function() {
			attachDebugTestTool();
		});
		control.addHeader().setLogo("supportDumpCreator");
		attachCategoriedIcons(control);
		control.show();
	});
};
