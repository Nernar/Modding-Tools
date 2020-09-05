
/*
  _____               ______    _ _ _
 |  __ \             |  ____|  | (_) |
 | |  | | _____   __ | |__   __| |_| |_ ___  _ __
 | |  | |/ _ \ \ / / |  __| / _` | | __/ _ \| '__|
 | |__| |  __/\ V /  | |___| (_| | | || (_) | |
 |_____/ \___| \_/   |______\__,_|_|\__\___/|_|


       Developed by Nernar (vk.com/nernar)
   This code is a copyright, do not distribute.

*/

function dialog(properties) {
	Widgets.run(function() {
		var builder = new android.app.AlertDialog.Builder(Widgets.ctx, Widgets.dialogTheme);

		if(properties.title != null) builder.setTitle(properties.title);
		if(properties.message != null) builder.setMessage(properties.message);
		if(properties.view != null) builder.setView(properties.view);
		if(properties.cancelable != null) builder.setCancelable(properties.cancelable);

		if(properties.items != null) {
			var items = properties.items;
			builder.setItems(items.text, items.click ? function(interface, item) {
				try {
					items.click(interface, item);
				} catch(e) {}
			} : null);
		}

		if(properties.multi != null) {
			var multi = properties.multi;
			builder.setMultiChoiceItems(multi.text, multi.check ? multi.check : null, multi.click ? function(interface, item, active) {
				try {
					multi.click(interface, item, active);
				} catch(e) {}
			} : null);
		}

		if(properties.buttons != null) {
			var text = properties.buttons.text || [];
			var click = properties.buttons.click || [];
			if(text[0]) {
				builder.setNeutralButton(text[0], click[0] ? function() {
					try {
						click[0]();
					} catch(e) {}
				} : null);
			} if(text[1]) {
				builder.setNegativeButton(text[1], click[1] ? function() {
					try {
						click[1]();
					} catch(e) {}
				} : null);
			} if(text[2]) {
				builder.setPositiveButton(text[2], click[2] ? function() {
					try {
						click[2]();
					} catch(e) {}
				} : null);
			}
		}
		var width = UI.getScreenHeight()*1.6;
		var build = builder.create();
		if(properties)build.show();
		build.getWindow().setLayout(width, Widgets.size.wrap);
		return build;
	});
}
