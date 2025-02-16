/*

   Copyright 2018-2024 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

// Currently build information
const REVISION = "develop-alpha-0.4-16.02.2025-0";
const NAME = __mod__.getInfoProperty("name");
const AUTHOR = __mod__.getInfoProperty("author");
const VERSION = __mod__.getInfoProperty("version");
const DESCRIPTION = __mod__.getInfoProperty("description");
const API_VERSION = parseFloat(REVISION.split("-")[2]);
const PLATFORM = this.hasOwnProperty("android") ? "android" : "cli";

const isAndroid = function() {
	return PLATFORM == "android";
};
const isCLI = function() {
	return PLATFORM == "cli";
};

const SHELL = (function() {
	if (isCLI()) {
		return Packages.io.nernar.instant.cli.CLI.byPlatform();
	}
	return null;
})();

// Configurable: autosave
let autosave = true;
let autosavePeriod = 45;
let autosaveProjectable = true;

// Configurable: interface
let maxWindows = 8;
let uiScaler = 1.;
let fontScale = uiScaler;
let menuDividers = false;
let projectHeaderBackground = false;

// Configurable: messages
let hintStackableDenied = false;
let maximumHints = 25;
let showProcesses = true;

// Configurable: modules
let currentEnvironment = __name__;
let isSupportEnv = false;

// Configurable: explorer
let maximumThumbnailBounds = 96;
let maximumAllowedBounds = 1920;
let importAutoselect = false;

// Different values
let noImportedScripts = true;
let warningMessage = null;

// Definitions for default values
let firstLaunchTutorial = REVISION.startsWith("testing");
let typeface = isAndroid() ? android.graphics.Typeface.MONOSPACE : null;
let typefaceJetBrains = isAndroid() ? android.graphics.Typeface.MONOSPACE : null;

IMPORT("inherit");

if (this.isInstant === undefined) {
	this.isInstant = false;
}

IMPORT("Files");
IMPORT("Retention");
IMPORT("Stacktrace");

const prepareDebugInfo = function() {
	return NAME + " " + VERSION + " by " + AUTHOR + " for " + (isHorizon ? "Horizon" : "Inner Core") + " " + minecraftVersion +
		" Report Log\nREVISION " + REVISION.toUpperCase() + (isAndroid() ? ", ANDROID " + android.os.Build.VERSION.SDK_INT : ", CLI");
};

registerReportAction((function() {
	let alreadyHasDate = false;
	return function(error) {
		error && Logger.Log("Modding Tools: " + error + (
			error.lineNumber ? " (#" + error.lineNumber + ")" : ""
		) + (
			error.stack ? "\n" + error.stack : ""
		), "WARNING");
		if (isAndroid()) {
			reportTrace(error);
		}
		let message = reportTrace.toCode(error) + ": " + error + "\n" +
				(error ? error.stack : null),
			file = Files.of(Dirs.LOGGING, REVISION + ".log");
		if (!Files.isFile(file)) {
			Files.ensureFile(file);
			Files.write(file, prepareDebugInfo());
		}
		if (!alreadyHasDate) {
			Files.append(file, new Date(launchTime).toString() + "\n", true);
			alreadyHasDate = true;
		}
		Files.append(file, message);
	};
})());

reportTrace.setupPrint(function(message) {
	message !== undefined && showHint(message);
});

let toRawComplexUnitDip = toComplexUnitDip;

/**
 * getY -> dip = 0,66525
 * getX -> dip = 0,83333
 */
toComplexUnitDip = function(value) {
	return toRawComplexUnitDip(value) * uiScaler;
};

let toRawComplexUnitDp = toRawComplexUnitDip;

let toComplexUnitDp = function(value) {
	return toComplexUnitDip(value) * 0.625;
};

let toRawComplexUnitSp = toComplexUnitSp;

/**
 * getFontSize -> sp = 0,38095
 */
toComplexUnitSp = function(value) {
	return toRawComplexUnitSp(value) * fontScale;
};

IMPORT("Drawable");

const InnerCorePackages = isHorizon ? Packages.com.zhekasmirnov.innercore : Packages.zhekasmirnov.launcher;

IMPORT("Action");
IMPORT("Sequence");

const CoreEngine = {
	CORE_ENGINE_API_LEVEL: 0
};

let $ = new JavaImporter();
if (isAndroid()) {
	$.importClass(android.view.ViewGroup);
	$.importClass(android.view.View);
	$.importClass(android.view.Gravity);
	$.importClass(android.graphics.Color);
	$.importClass(android.graphics.Shader);
	$.importClass(android.support.v4.view.ViewCompat);
	$.importClass(android.widget.ImageView);
	$.importClass(android.widget.LinearLayout);
	$.importClass(android.widget.ListView);
}
$.importClass(java.util.concurrent.TimeUnit);
$.importClass(InnerCorePackages.utils.FileTools);
$.importClass(InnerCorePackages.api.runtime.LevelInfo);
// $.importClass(InnerCorePackages.mod.build.ExtractionHelper);
$.importClass(InnerCorePackages.mod.build.BuildConfig);
$.importClass(InnerCorePackages.mod.executable.Compiler);
$.importClass(InnerCorePackages.ui.LoadingUI);

const CONTEXT = (function() {
	try {
		return InnerCorePackages.mod.executable.Compiler.assureContextForCurrentThread();
	} catch (e) {
		return __mod__.compiledModSources.get(0).parentContext;
	}
})();

const isCoreEngineLoaded = function() {
	return CoreEngine.CORE_ENGINE_API_LEVEL != 0;
};

getPlayerEnt = function() {
	if ($.LevelInfo.isLoaded()) {
		return Number(Player.get());
	}
	return 0;
};

IMPORT("Connectivity");
