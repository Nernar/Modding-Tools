const ModificationSource = {};

ModificationSource.selector = function() {
	let control = new MenuWindow();
	control.setOnClickListener(function() {
		attachProjectTool();
	});
	if (!this.attachSources(control)) {
		control.addMessage("worldSelectionRange", translate("There's we can't find any modification. Please, consider developer about that cause."));
	}
	control.show();
};

ModificationSource.findModList = function() {
	return tryout(function() {
		let mods = Packages.com.zhekasmirnov.apparatus.modloader.ApparatusModLoader.getSingleton().getAllMods();
		let sorted = new java.util.ArrayList();
		for (let i = 0; i < mods.size(); i++) {
			let mod = mods.get(i);
			if (mod instanceof Packages.com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod) {
				sorted.add(mod.getLegacyModInstance());
			}
		}
		return sorted;
	}, function(e) {
		return INNERCORE_PACKAGE.mod.build.ModLoader.instance.modsList;
	});
};

ModificationSource.attachSources = function(control) {
	let modsList = this.findModList();
	if (modsList == null || modsList.size() == 0) {
		return false;
	}
	control.addCategory(translate("Which modification will be changed?"));
	for (let i = 0; i < modsList.size(); i++) {
		let mod = modsList.get(i);
		this.attachSource(control, mod);
	}
	return true;
};

ModificationSource.attachSource = function(control, mod) {
	let type = mod.getBuildType().toString(),
		dir = new java.io.File(mod.dir).getName(),
		version = mod.getInfoProperty("version") || "1.0",
		key = BitmapDrawableFactory.generateKeyFor("support/" + mod.getName(), false),
		icon = (BitmapDrawableFactory.isMapped(key) ? key : null);
	if (icon == null) {
		if ($.FileTools.exists(mod.dir + "mod_icon_dark.png")) {
			icon = mod.dir + "mod_icon_dark.png";
		} else if ($.FileTools.exists(mod.dir + "mod_icon.png")) {
			icon = mod.dir + "mod_icon.png";
		} else if ($.FileTools.exists(mod.dir + "icon.png")) {
			icon = mod.dir + "icon.png";
		} else {
			icon = "support";
		}
	}
	control.addMessage(icon, translate(mod.getName()) + " " + translate(version) +
		"\n/" + dir + " / " + translate(type), function() {
			ModificationSource.rebuild(mod, type);
		});
};

ModificationSource.rebuild = function(mod, type) {
	if (type == "release") {
		confirm(translate("Decompilation"), translate("Modification currently was compiled into dexes.") + " " + translate("If you're developer, it may be decompiled.") + " " + translate("Do you want to continue?"), function() {
			handleThread(function() {
				ModificationSource.requireDecompilerAsync(mod);
				handle(function() {
					ModificationSource.confirmSwitchBuild(mod);
					ModificationSource.selector();
				});
			});
			MenuWindow.hideCurrently();
		});
	} else if (type == "develop") {
		confirm(translate("Compilation"), translate("Modification will be dexed and switched to release type.") + " " + translate("Do you want to continue?"), function() {
			handleThread(function() {
				let result = ModificationSource.requireDexerAsync(mod);
				handle(function() {
					if (result.reported && result.reported.length > 0) {
						result.reported.forEach(function(element) {
							element && reportError(element);
						});
					}
					if (!result.wasFailed) ModificationSource.confirmSwitchBuild(mod);
					confirm(translate(result.name) + " " + translate(result.version), (result.wasFailed ?
							translate("Something went wrong during compilation process.") + " " + translate("Checkout reports below to see more details.") :
							translate("Modification successfully compiled.") + " " + translate("You can switch build type in next window.")) + " " +
						translate("Founded sources count") + ": " + (result.buildConfig ? tryout(function() {
							return result.buildConfig.getAllSourcesToCompile(true)
						}, function() {
							return result.buildConfig.getAllSourcesToCompile();
						}).size() : 0) + ".\n" +
						translate("Do you want to review report?"),
						function() {
							if (result.messages && result.messages.length > 0) {
								confirm(translate("Report"), result.messages.join("\n"));
							}
						});
					ModificationSource.selector();
				});
			});
			MenuWindow.hideCurrently();
		});
	}
};

ModificationSource.requireDexerAsync = function(mod, yields) {
	let dexer = AsyncStackedSnackSequence.access("compiler.dns", mod, function(who) {
		yields = who;
	});
	if (yields !== false) dexer.assureYield();
	return yields;
};

ModificationSource.requireDecompilerAsync = function(mod, yields) {
	let formatter = AsyncStackedSnackSequence.access("decompiler.dns", mod, function(who) {
		yields = who;
	});
	if (yields !== false) formatter.assureYield();
	return yields;
};

ModificationSource.confirmSwitchBuild = function(mod) {
	confirm(translate("Switch build type"), translate("Do you want to switch modification build type in build.config?"), function() {
		ModificationSource.switchBuild(mod, mod.getBuildType().toString());
		ModificationSource.selector();
	});
};

ModificationSource.switchBuild = function(mod, type) {
	if (type === undefined) {
		type = mod.getBuildType().toString();
	}
	if (type == "release") {
		mod.setBuildType("develop");
	} else if (type == "develop") {
		mod.setBuildType("release");
	} else showHint(translate("Build type %s is unsupported", translate(type)));
};
