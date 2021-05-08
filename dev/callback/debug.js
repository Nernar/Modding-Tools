Callback.addCallback("CoreEngineLoaded", function(api) {
	context.runOnUiThread(function() {
		let window = context.getWindow();
		if (__code__.startsWith("testing")) {
			window.addFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE);
		}
		if (isHorizon) {
			if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
				window.setDecorFitsSystemWindows(false);
				let controller = window.getInsetsController();
				if (controller != null) {
					controller.hide(android.view.WindowInsets.Type.statusBars() | android.view.WindowInsets.Type.navigationBars());
					controller.setSystemBarsBehavior(android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
				}
			} else {
				window.getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_IMMERSIVE);
			}
			window.addFlags(android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
		}
	});
});

try {
	if (__code__.startsWith("develop")) {
		MCSystem.setLoadingTip("Profiling Process");
		
		context.runOnUiThread(function() {
			show.button = new android.widget.Button(context);
			show.button.setText("Eval");
			show.button.setOnClickListener(show);
			
			show.window = new FocusableWindow();
			show.window.setGravity(Ui.Gravity.BOTTOM | Ui.Gravity.RIGHT);
			show.window.setContent(show.button);
			show.window.show();
		});
		
		let folder = new java.io.File(Dirs.IMAGE);
		let out = new java.io.File(Dirs.ASSET);
		ImageFactory.encodeFolder(folder, out, true);
	}
} catch (e) {
	__code__.startsWith("develop") && reportError(e);
}

// try {
	// ExecutableSupport.newInstance("zhekasmirnov.launcher.mod.build.ModLoader").instance.modsList.remove(__mod__);
// } catch (e) {
	// __code__.startsWith("develop") && reportError(e);
	// Logger.Log("Dev Editor assertion failed, it's may cause some problems", "Warning");
// }
