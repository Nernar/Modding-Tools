const $ = new JavaImporter();
$.importPackage(findCorePackage().mod.build);
$.importPackage(findCorePackage().mod.executable);

if (!(TARGET instanceof $.Mod)) {
	MCSystem.throwException("Modification instance must be passed");
}

const resolveReadable = function(type) {
	return tryout(function() {
		let stroke = String(translate(String(type.toString())));
		return stroke.charAt(0).toUpperCase() + stroke.substring(1);
	}, function(e) {
		return e.name;
	});
};

const resolvePrefix = function(count, prefix) {
	return tryout(function() {
		return count > 1 ? String(translate(prefix, count)) : new String();
	}, function(e) {
		return e.name;
	});
};

const report = function(message, error, dangerous) {
	if (error !== undefined) {
		report.stack.push(error);
	}
	seek(message, 0, dangerous ?
		Interface.Color.RED : Interface.Color.YELLOW);
	dangerous && (report.dangerous = true);
};

report.stack = new Array();
report.dangerous = false;

let collected = new Array();
let buildConfig = mod.buildConfig;

let name = mod.getName();
let version = mod.getInfoProperty("version");
prepare(translate(name) + " " + translate(version));

let sources = buildConfig.getAllSourcesToCompile(),
	count = Number(sources.size());

Translation.addTranslation("Preparing %s", {
	ru: "Подготавливается %s"
});

seek(translate("Preparing %s", translateCounter(count, "nothing",
	"%s1 source", "%s" + (count % 10) + " sources", "%s sources", [count])));

let container = mod.createCompiledSources();
container.reset();

Translation.addTranslation("Source %s", {
	ru: "Исходник %s"
});
Translation.addTranslation("preloader", {
	ru: "предзагрузчик"
});
Translation.addTranslation("launcher", {
	ru: "лаунчер"
});
Translation.addTranslation("mod", {
	ru: "мод"
});
Translation.addTranslation("custom", {
	ru: "прочее"
});
Translation.addTranslation("library", {
	ru: "библиотека"
});
Translation.addTranslation("Something wrong with .includes", {
	ru: "Что-то не так с .includes"
});
Translation.addTranslation("Compiling %s", {
	ru: "Компиляция %s"
});
Translation.addTranslation("Couldn't found source", {
	ru: "Источник попросту не существует"
});
Translation.addTranslation("Compilation script failed", {
	ru: "Не удалось скомпилировать скрипт"
});

let targeted = sources.iterator();
while (targeted.hasNext()) {
	let source = targeted.next();
	seek(resolveReadable(source.sourceType) + " " + source.path + resolvePrefix(targeted, " (" + source + "/%s)"), 1);
	let buildableDir = buildConfig.findRelatedBuildableDir(source),
		files = null;
	if (buildableDir != null) {
		files = tryout(function() {
			let file = new java.io.File(mod.dir, buildableDir.dir);
			return $.BuildHelper.readIncludesFile(file);
		}, function(e) {
			report(translate("Something wrong with .includes"), e);
		}, files);
	}
	if (files == null) {
		let file = new java.io.File(mod.dir + source.path);
		files = new java.util.ArrayList();
		files.add(file);
	}
	shrink(files.size());
	let container = this.getOutputContainer();
	for (let i = 1; i <= files.size(); i++) {
		let file = files.get(i - 1);
		seek(translate("Compiling %s", file.getName() + resolvePrefix(files.size(), " (" + i + "/%s)")), 1);
		tryout(function() {
			let reader = new java.io.FileReader(file);
			tryout.call(function() {
				let hashable = java.lang.String(source.path + "$" + file.getAbsolutePath() + "$" + file.length()),
					targetCompilation = container.getTargetCompilationFile(Hashable.toMD5(hashable.getBytes()));
				$.Compiler.compileScriptToFile(reader, targetCompilation.getName(), targetCompilation.getAbsolutePath());
				container.addCompiledSource(source.path, targetCompilation, source.sourceName);
			}, function(e) {
				report(translate("Compilation script failed"), e, true);
			});
		}, function(e) {
			report(translate("Couldn't found source"), e, true);
		});
		require(index + i);
	}
}

Translation.addTranslation("Dexed", {
	ru: "Одексировано"
});

setCompletionMessage(translate("Dexed"));

return {
	name: name,
	version: version,
	buildConfig: buildConfig,
	reported: report.stack,
	messages: new Array(),
	wasFailed: report.dangerous
};
