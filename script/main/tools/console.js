const CONSOLE_TOOL = (function() {
	return new Tool({
		controlDescriptor: {
			logotype: "menuBack",
			collapsedClick: function(tool, control) {
				tool.deattach();
			}
		},
		deattach: function() {
			let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
			if (snack !== null) snack.dismiss();
			Popups.closeIfOpened("evaluate");
			attachProjectTool(function() {
				Tool.prototype.deattach.apply(this, arguments);
			});
		},
		attach: function() {
			Tool.prototype.attach.apply(this, arguments);
			this.setupConsole();
			this.addEditable();
		},
		setupConsole: function() {
			let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
			if (snack !== null) snack.dismiss();
			snack = new HintAlert();
			snack.setConsoleMode(true);
			snack.setMaximumStacked(8);
			snack.pin();
			snack.show();
		},
		addEditable: function() {
			let popup = new ListingPopup();
			popup.setTitle(translate("Evaluate"));
			popup.addEditElement(translate("Hi, I'm evaluate stroke"), "29 / 5");
			popup.addButtonElement(translate("Eval"), function() {
				let values = popup.getAllEditsValues();
				if (String(values[0]).length > 0) {
					showHint(" > " + values[0]);
					let result = compileData(values[0]);
					if (result.lineNumber !== undefined) {
						showHint(result.message, $.Color.RED);
					} else showHint(String(result), $.Color.LTGRAY);
				}
			}).setBackground("popup");
			let instance = this;
			popup.setOnDismissListener(function() {
				let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
				if (snack !== null) instance.addEditable();
			});
			Popups.open(popup, "evaluate");
		}
	});
})();

const attachConsoleTool = function(post) {
	CONSOLE_TOOL.attach();
	CONSOLE_TOOL.queue();
	handle(function() {
		CONSOLE_TOOL.collapse();
		let accepted = true;
		tryout(function() {
			post && post(CONSOLE_TOOL);
			accepted = false;
		});
		if (accepted) {
			attachProjectTool(function() {
				CONSOLE_TOOL.deattach();
			});
		}
	});
};
