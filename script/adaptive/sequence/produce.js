prepare(translate(NAME) + " " + translate(VERSION));
encount(8);

const copyOrThrow = function(from, to, explore, simpleCompare, includeDirectories) {
	if (!Files.copyAndCompare(from, to, explore, simpleCompare, includeDirectories)) {
		MCSystem.throwException("Failed to copy with comparing " + from + " to " + to);
	}
};

const copyAndClearOrThrow = function(from, to, explore, simpleCompare, includeDirectories) {
	copyOrThrow(from, to, explore, simpleCompare, includeDirectories);
	Files.deleteRecursive(from, explore);
};

const readBuildConfigToSources = function(path) {
	let config = new java.io.File(path, "build.config");
	config = compileData(Files.read(config));
	let files = config.compile.map(function(source) {
		return source.path;
	});
	// Target sources wasn't included right here
	let directories = config.buildDirs.map(function(source) {
		return source.dir;
	});
	return {
		compile: files,
		buildDirs: directories,
		type: config.defaultConfig.buildType
	};
};

const rewriteReleasedBuildConfig = function(path) {
	let config = new java.io.File(path, "build.config"),
		build = compileData(Files.read(config));
	build.buildDirs = new Array();
	for (let i = 0; i < build.resources.length; i++) {
		let resource = build.resources[i];
		if (resource && resource.path) {
			let file = new java.io.File(path, resource.path);
			if (file.exists()) continue;
		}
		build.resources.splice(i, 1);
		i--;
	}
	build.defaultConfig.buildType = "release";
	Files.write(config, JSON.stringify(build, true, "\t"));
};

Translation.addTranslation("Cleaning previous .backup", {
	ru: "Очистка предыдущего .backup"
});

seek(translate("Cleaning previous .backup"), 1);
Files.deleteRecursive(Dirs.BACKUP, true);

Translation.addTranslation("Cuting resources to .backup", {
	ru: "Перемещение ресурсов в .backup"
});

seek(translate("Cuting resources to .backup"), 1);
copyAndClearOrThrow(Dirs.ASSET, Dirs.BACKUP + "assets/", true, false, true);
copyOrThrow(Dirs.BACKUP + "assets/font.ttf", Dirs.ASSET + "font.ttf");
copyAndClearOrThrow(Dirs.EXPORT, Dirs.BACKUP + "projects/", true, true, true);
copyAndClearOrThrow(Dirs.TESTING, Dirs.BACKUP + "script/testing/", true, true, true);
copyAndClearOrThrow(Dirs.TODO, Dirs.BACKUP + ".todo/", true, false, true);
copyAndClearOrThrow(__dir__ + ".vscode/", Dirs.BACKUP + ".vscode/", true, false, true);
copyAndClearOrThrow(__dir__ + ".preview/", Dirs.BACKUP + ".preview/", true, false, true);
copyAndClearOrThrow(__dir__ + "adb/", Dirs.BACKUP + "adb/", true, false, true);
copyAndClearOrThrow(__dir__ + "typings/", Dirs.BACKUP + "typings/", true, false, true);
copyAndClearOrThrow(__dir__ + ".gitignore", Dirs.BACKUP + ".gitignore", false, false, false);
copyAndClearOrThrow(__dir__ + ".placeholder.ico", Dirs.BACKUP + ".placeholder.ico", false, false, false);
copyAndClearOrThrow(__dir__ + "LICENSE", Dirs.BACKUP + "LICENSE", false, false, false);
copyAndClearOrThrow(__dir__ + "README.md", Dirs.BACKUP + "README.md", false, false, false);
copyAndClearOrThrow(__dir__ + "README-ru.md", Dirs.BACKUP + "README-ru.md", false, false, false);

Translation.addTranslation("Compiling resources and scripts", {
	ru: "Компиляция ресурсов и скриптов"
});

seek(translate("Compiling resources and scripts"), 1);
INSTANCE.access("resource.js", [Dirs.IMAGE, Dirs.ASSET]).assureYield();
INSTANCE.access("script.js", [Dirs.EVALUATE + "testing/", Dirs.TESTING]).assureYield();
copyAndClearOrThrow(Dirs.IMAGE, Dirs.BACKUP + "gui/", true, false, true);
copyAndClearOrThrow(Dirs.EVALUATE, Dirs.BACKUP + ".eval/", true, false, true);

Translation.addTranslation("Checking %s scripts requireable", {
	ru: "Проверка запускаемости %s скриптов"
});
Translation.addTranslation("Incorrupted script %s", {
	ru: "Разрушенный скрипт %s"
});

shrink(1);
let scripts = Files.listFileNames(Dirs.TESTING, true);
if (scripts.length > 0) {
	seek(translate("Checking %s scripts requireable", scripts.length));
	for (let i = 0; i < scripts.length; i++) {
		let name = Files.getNameWithoutExtension(scripts[i]);
		tryout(function() {
			REQUIRE(name + ".dns");
		}, function(e) {
			seek(translate("Incorrupted script %s", name));
		});
	}
}

Translation.addTranslation("Copying original supportables", {
	ru: "Копирование оригинальных модулей"
});
Translation.addTranslation("Resolving and compile %s", {
	ru: "Обработка и компиляция %s"
});
Translation.addTranslation("Cleaning uncompiled sources", {
	ru: "Очистка нескомпилированных исходников"
});
Translation.addTranslation("Supportables was compiled", {
	ru: "Модули были скомпилированы"
});

if (supportSupportables) {
	let supportables = ExecuteableSupport.getModList();
	if (supportables.length > 0) {
		seek(translate("Copying original supportables"), 1);
		copyOrThrow(Dirs.SUPPORT, Dirs.BACKUP + "support/", true, false, true);
		shrink(1);
		for (let i = 0; i < supportables.length; i++) {
			let directory = supportables[i].dir;
			seek(translate("Resolving and compile %s", supportables[i].getName()));
			let build = readBuildConfigToSources(directory);
			if (build.type == "develop") {
				let report = new Array();
				INSTANCE.access("compiler.dns", supportables[i]).assureYield();
				for (let i = 0; i < report.length; i++) {
					retraceOrReport(report[i]);
				}
				rewriteReleasedBuildConfig(directory, build);
			}
			seek(translate("Cleaning uncompiled sources"));
			for (let c = 0; c < build.compile.length; c++) {
				Files.deleteRecursive(directory + build.compile[c], true);
			}
			for (let b = 0; b < build.buildDirs.length; b++) {
				Files.deleteRecursive(directory + build.buildDirs[b], true);
			}
		}
		seek(translate("Supportables was compiled"), 1);
	} else {
		shrink(3);
	} 
} else {
	shrink(3);
}

Translation.addTranslation("Preparing sources", {
	ru: "Подготовка исходников"
});

seek(translate("Preparing sources"));
let build = readBuildConfigToSources(__dir__);
if (build.compile.length == 0) {
	MCSystem.throwException("There's no sources to compile");
}

Translation.addTranslation("Found %s potential source files", {
	ru: "Найдено %s потенциальных исполняемых файла"
});
Translation.addTranslation("Found %s potential build directories", {
	ru: "Найдена %s потенциальная сборочная папка"
});

seek(translate("Found %s potential source files", build.compile.length));
if (build.buildDirs.length > 0) {
	seek(translate("Found %s potential build directories", build.buildDirs.length));
	let revision = new java.io.File(__dir__, "dev/header.js"),
		text = Files.read(revision);
	Files.write(revision, String(text).replace("REVISION = \"develop-", "REVISION = \"testing-"));
}

let report = new Array();
INSTANCE.access("compiler.dns", __mod__).assureYield();
if (report.length > 0) {
	for (let i = 0; i < report.length; i++) {
		retraceOrReport(report[i]);
	}
	MCSystem.throwException("Compilation was failed");
}

Translation.addTranslation("Cleaning and copying sources", {
	ru: "Очистка и копирование исходников"
});

copyOrThrow(__dir__ + "build.config", Dirs.BACKUP + "build.config");
rewriteReleasedBuildConfig(__dir__, build);
seek(translate("Cleaning and copying sources"), 1);
for (let c = 0; c < build.compile.length; c++) {
	copyAndClearOrThrow(__dir__ + build.compile[c], Dirs.BACKUP + build.compile[c], true, false, true);
}
for (let b = 0; b < build.buildDirs.length; b++) {
	copyAndClearOrThrow(__dir__ + build.buildDirs[b], Dirs.BACKUP + build.buildDirs[b], true, false, true);
}
copyOrThrow(Dirs.BACKUP + "assets/blocks-0.json", Dirs.ASSET + "blocks-0.json");
copyOrThrow(Dirs.BACKUP + "assets/blocks-12.json", Dirs.ASSET + "blocks-12.json");
let files = Files.listFileNames(Dirs.BACKUP + "script/testing/", true);
files = Files.checkFormats(files, ".json");
for (let i = 0; i < files.length; i++) {
	copyOrThrow(Dirs.BACKUP + "script/testing/" + files[i], Dirs.TESTING + files[i]);
}

Translation.addTranslation("Switched to produce", {
	ru: "Подготовлено к производству"
});

setCompletionMessage(translate("Switched to produce"));
