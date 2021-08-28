Translation.addTranslation("Do you want to restore development backup?", {
	ru: "Вы хотите восстановить резервную копию разработчика?"
});
Translation.addTranslation("Do you ready to compile modification as produce?", {
	ru: "Вы готовы скомпилировать модификацию в производство?"
});
Translation.addTranslation("Please, be sure that you're backup wouldn't removed before processing!", {
	ru: "Пожалуйста, убедитесь что текущая резервная копия не пострадает в процессе!"
});

return function(confirmedPostAction) {
	handle(function() {
		let title = translate(NAME) + " " + translate(VERSION),
			type = __mod__.getBuildType().toString();
		if (type == "release") {
			confirm(title, translate("Do you want to restore development backup?"), function() {
				let who = AsyncStackedSnackSequence.access("restore.js");
				confirmedPostAction && confirmedPostAction(who);
			});
		} else if (type == "develop") {
			confirm(title, translate("Do you ready to compile modification as produce?"), function() {
				let who = AsyncStackedSnackSequence.access("produce.js");
				confirmedPostAction && confirmedPostAction(who);
			});
			if (new java.io.File(Dirs.BACKUP).exists()) {
				confirm(title, translate("Please, be sure that you're backup wouldn't removed before processing!"));
			}
		}
	});
};
