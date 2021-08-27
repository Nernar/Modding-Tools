prepare(translate(NAME) + " " + translate(VERSION));
encount(3);

const copyOrThrow = function(from, to, explore, simpleCompare, includeDirectories) {
	if (!Files.copyAndCompare(from, to, explore, simpleCompare, includeDirectories)) {
		MCSystem.throwException("Failed to copy with comparing " + from + " to " + to);
	}
};

const copyAndClearOrThrow = function(from, to, explore, simpleCompare, includeDirectories) {
	copyOrThrow(from, to, explore, simpleCompare, includeDirectories);
	Files.deleteRecursive(from, explore);
};

Translation.addTranslation("Cleaning compiled resources", {
	ru: "Очистка скомпилированных ресурсов"
});

seek(translate("Cleaning compiled resources"), 1);
Files.deleteRecursive(Dirs.TESTING, true);
Files.deleteRecursive(Dirs.ASSET, true);
copyOrThrow(Dirs.BACKUP + "assets/font.ttf", Dirs.ASSET + "font.ttf");

Translation.addTranslation("Removing supportables and dexes", {
	ru: "Удаление модулей и одексирования"
});

seek(translate("Removing supportables and dexes"), 1);
__mod__.createCompiledSources().reset();
if (supportSupportables) {
	Files.deleteRecursive(Dirs.SUPPORT, true);
}

Translation.addTranslation("Merging .backup with modification", {
	ru: "Слияние .backup с модификацией"
});
Translation.addTranslation("Can't update build config", {
	ru: "Нельзя обновить сборочный конфиг"
});

seek(translate("Merging .backup with modification"), 1);
copyAndClearOrThrow(Dirs.BACKUP, __dir__, true, false, true);
let builder = ExecuteableSupport.getModBuilder();
if (builder !== null) {
	__mod__.buildConfig = builder.loadBuildConfigForDir(__dir__);
	__mod__.setBuildType("develop");
} else {
	seek(translate("Can't update build config"), Interface.Color.YELLOW);
}

Translation.addTranslation("Restored backup", {
	ru: "Резервная копия восстановлена"
});

setCompletionMessage(translate("Restored backup"));
