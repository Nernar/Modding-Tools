const LaunchSequence = new LogotypeSequence({
	count: 3,
	create: function(value) {
		if (REVISION.startsWith("develop") || isFirstLaunch()) {
			if (REVISION.startsWith("develop") && $.FileTools.exists(Dirs.INTERNAL_UI)) {
				BitmapDrawableFactory.mapDirectory(Dirs.INTERNAL_UI, true);
			}
			BitmapDrawableFactory.mapDirectory(Dirs.ASSET, true);
			LogotypeSequence.prototype.create.apply(this, arguments);
		}
	},
	getExpirationTime: function() {
		return isFirstLaunch() ? LogotypeSequence.prototype.getExpirationTime.apply(this, arguments) : 0;
	},
	process: function(index) {
		index = LogotypeSequence.prototype.process.apply(this, arguments);
		if (index == 1) {
			updateSettings();
			if (REVISION.startsWith("develop") && $.FileTools.exists(Dirs.INTERNAL_UI)) {
				BitmapDrawableFactory.mapDirectory(Dirs.INTERNAL_UI, true);
			}
			BitmapDrawableFactory.mapDirectory(Dirs.ASSET, true);
			$.FileTools.assureDir(Dirs.PROJECT);
		} else if (index == 2) {
			AssetFactory.loadAsset("minecraftFont", "font.ttf");
			typeface = AssetFactory.createFont("minecraft");
			AssetFactory.loadAsset("jetBrainsMonoFont", "JetBrainsMono-Regular.ttf");
			typefaceJetBrains = AssetFactory.createFont("jetBrainsMono");
			registerAdditionalInformation();
		} else if (index == 3) {
			try {
				if (isInstant) {
					Callback.invokeCallback("Instant:ModdingTools", API);
				} else {
					Callback.invokeCallback("ModdingTools", API);
				}
			} catch (e) {
				Logger.Log("ModdingTools: Modules initialization aborted due to Callback.invoke", "ERROR");
				reportError(e);
			}
		}
		return index;
	},
	cancel: function(error) {
		let sequence = this;
		confirm(translate(NAME) + " " + translate(VERSION),
			translate("Launch sequence interrupted or handled exception.") + " " +
			translate("Do you want to retry modification launch?"), function() {
				handle(function() {
					sequence.execute();
				}, sequence.getExpirationTime() * 2);
			});
		if (!isFirstLaunch()) LogotypeSequence.prototype.create.call(this);
		LogotypeSequence.prototype.cancel.apply(this, arguments);
	},
	complete: function(active) {
		LogotypeSequence.prototype.complete.apply(this, arguments);
		if (firstLaunchTutorial && isFirstLaunch()) {
			TutorialSequence.Welcome.execute();
		} else {
			try {
				prepareEnvironmentIfNeeded();
			} catch (e) {
				if (REVISION.indexOf("develop") != -1) {
					reportError(e);
				}
			}
			attachProjectTool(undefined, function() {
				if (showHint.launchStacked !== undefined) {
					showHint.unstackLaunch();
				}
				LevelProvider.attach();
				if ($.LevelInfo.isLoaded()) {
					LevelProvider.show();
				}
			});
		}
		loadSetting("user_login.first_launch", "boolean", false);
		__config__.save();
	}
});
