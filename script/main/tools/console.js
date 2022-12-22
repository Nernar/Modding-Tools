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
			snack.attach();
		},
		addEditable: function() {
			let popup = new ExpandablePopup("evaluate");
			popup.setTitle(translate("Evaluate"));
			let layout = popup.getFragment();
			let input = layout.addPropertyInput(translate("Hi, I'm evaluate stroke"), "29 / 5");
			layout.addSolidButton(translate("Eval"), function() {
				let action = input.getText().trim();
				if (action.length > 0) {
					showHint(" > " + action);
					let result = compileData(action);
					if (result.lineNumber !== undefined) {
						showHint(result.message, ColorDrawable.parseColor("RED"));
					} else showHint("" + result, ColorDrawable.parseColor("LTGRAY"));
				}
			});
			popup.setIsMayDismissed(false);
			popup.show();
		}
	});
})();

const attachConsoleTool = function(post) {
	CONSOLE_TOOL.attach();
	CONSOLE_TOOL.queue();
	handle(function() {
		CONSOLE_TOOL.collapse();
		let accepted = true;
		try {
			post && post(CONSOLE_TOOL);
			accepted = false;
		} catch (e) {
			reportError(e);
		}
		if (accepted) {
			attachProjectTool(function() {
				CONSOLE_TOOL.deattach();
			});
		}
	});
};
