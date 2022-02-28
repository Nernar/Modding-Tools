const updateAndReattach = function() {
	handle(function() {
		let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
		if (snack !== null) snack.dismiss();
		snack = new HintAlert();
		snack.setMaximumStacked(5);
		snack.setConsoleMode(true);
		snack.show();
	});
};

REQUIRE("the-begin-narration.dns");

return function() {
	updateAndReattach();
	showHint("...", Interface.Color.RED);
	showHint(translateCode(68147221) + ": ...");
	showHint(translateCode(68147221) + ": " + translateCode(2057560) + "...");
	showHint(translateCode(68147221) + ": " + translateCode(2050569) + ".");
	showHint(translateCode(68147221) + ": " + translateCode(1970600048).toUpperCase() + "!");
	showHint(translateCode(-1478856006, translateCode(1970600048)));
	showHint(translateCode(1970600048) + ": " + translateCode(79462) + "...");
	showHint(translateCode(857634239, [translateCode(2333), translateCode(68147221)]));
	showHint(translateCode(1970600048) + ": " + translateCode(68147221) + "?");
	showHint(translateCode(1970600048) + ": " + translateCode(543270481) + "?");
	showHint(translateCode(-115671214, translateCode(68147221)));
	showHint(translateCode(1970600048) + ": " + translateCode(2119) + "?..");
	showHint(translateCode(1970600048) + ": " + translateCode(1640602775) + "?");
	showHint(translateCode(1823643522, translateCode(68147221)));
	showHint(translateCode(68147221) + ": " + translateCode(-753049471) + "...");
	showHint(translateCode(1214760478, [translateCode(68147221), translateCode(2050569)]));
	showHint(translateCode(68147221) + ": ... " + translateCode(-845363641) + ".");
	showHint("...", Interface.Color.RED);
	showHint(translateCode(-214916102) + ": " + translateCode(2480147) + " 1, " + translateCode(-1891298259) + " 7", Interface.Color.GREEN);
};
