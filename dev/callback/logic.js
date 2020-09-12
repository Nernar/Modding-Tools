MCSystem.setLoadingTip("Injecting Callbacks");

function updateSettings() {
	try {
		// Update settings from config (worth updating?)
		uiScaler = __config__.getNumber("interface.interface_scale");
		(uiScaler > 2 && (uiScaler = 2) || uiScaler < 0.5 && (uiScaler = 0.5)) && __config__.set("interface.interface_scale", uiScaler);
		fontScale = __config__.getNumber("interface.font_scale");
		(fontScale > 2 && (fontScale = 2) || fontScale < 0.5 && (fontScale = 0.5)) && __config__.set("interface.font_scale", fontScale);
		maxWindows = __config__.getNumber("interface.max_windows");
		(maxWindows > 10 && (maxWindows = 10) || maxWindows < 1 && (maxWindows = 1)) && __config__.set("interface.max_windows", maxWindows);
		maximumHints = __config__.getNumber("performance.maximum_hints");
		(maximumHints > 100 && (maximumHints = 100) || maximumHints < 1 && (maximumHints = 1)) && __config__.set("performance.maximum_hints", uiScaler);
		menuDividers = __config__.getBool("interface.show_dividers");
		autosave = __config__.getBool("project.autosave");
		autosaveInterface = __config__.getBool("project.autosave_interface");
		autosavePeriod = __config__.getNumber("project.autosave_period");
		autosavePeriod != 0 && (autosavePeriod > 300 && (autosavePeriod = 300) || autosavePeriod < 5 && (autosavePeriod = 5)) && __config__.set("project.autosave_period", autosavePeriod);
		autosaveProjectable = __config__.getBool("project.autosave_projectable");
		saveCoords = __config__.getBool("project.move_mapping");
		entityBoxType = __config__.getBool("render.use_box_sizes");
		drawSelection = __config__.getBool("render.draw_selection");
		injectBorder = __config__.getBool("render.inject_border");
		transparentBoxes = __config__.getBool("render.transparent_boxes");
		if (!isHorizon) {
			transparentBoxes = false;
			__config__.set("render.transparent_boxes", transparentBoxes);
		}
		hintStackableDenied = !__config__.getBool("performance.hint_stackable");
		if (supportSupportables) {
			loadSupportables = __config__.getBool("supportable.enabled");
		} else {
			Logger.Log("Supportables disabled, because it's not approved by developer", "Dev-Core");
		}
		debugAnimationsEnabled = __config__.getBool("performance.debug_animations");
		projectHeaderBackground = __config__.getBool("interface.header_background");
		showProcesses = __config__.getBool("performance.show_processes");
		ignoreKeyDeprecation = __config__.getBool("user_login.ignore_deprecation");
		noImportedScripts = !__config__.getBool("user_login.imported_script");
		useOldExplorer = __config__.getBool("deprecated.use_old_explorer");
		importAutoselect = __config__.getBool("project.import_autoselect");
		__config__.save();
	} catch (e) {
		reportError(e);
	}
}

let selectMode = 0;
Callback.addCallback("ItemUse", function(coords, item, block) {
	context.runOnUiThread(function() {
		try {
			if (selectMode == 1) {
				// Block selection by tapping
				let render = new ICRender.Model();
				render.addEntry(new BlockRenderer.Model(block.id, block.data));
				BlockRenderer.enableCoordMapping(block.id, block.data, render);
				BlockEditor.data.worker.Define.addMapping(coords.x, coords.y, coords.z);
				selectMode = 0, BlockEditor.create();
			} else if (selectMode == 6) {
				// Entity summon by tapping
				let position = coords.relative;
				(position.x += .5, position.y += .5, position.z += .5);
				let custom = Entity.spawnCustomAtCoords("__editorEntity__", position);
				Entity.setMobile(custom.entity, false);
				EntityEditor.data.worker.Define.addEntity(custom.entity);
				showHint(translate("Entity summoned"));
				selectMode = 0, EntityEditor.create();
			}
		} catch(e) {
			reportError(e);
		}
	});
});
