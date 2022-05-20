const attachCategoriedIcons = function(control) {
	if (isEmpty(BitmapDrawableFactory.mapped) && isEmpty(BitmapDrawableFactory.required)) {
		MCSystem.throwException("At least one category must be defined");
	}
	for (let who in BitmapDrawableFactory.mapped) {
		control.addMessage(who, who);
	}
	control.addHeader().setLogo("support");
	for (let who in BitmapDrawableFactory.required) {
		control.addMessage(who, who);
	}
};

return function() {
	handle(function() {
		let control = new MenuWindow();
		control.setOnClickListener(function() {
			DEBUG_TEST_TOOL.menu();
		});
		attachCategoriedIcons(control);
		control.show();
	}, function(e) {
		traceOrReport(e);
		DEBUG_TEST_TOOL.menu();
	});
};
