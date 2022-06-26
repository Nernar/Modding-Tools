/*

   Copyright 2018-2022 Nernar (github.com/nernar)
   
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
const REVISION = "develop-alpha-0.4-26.06.2022-1";
const NAME = __mod__.getInfoProperty("name");
const AUTHOR = __mod__.getInfoProperty("author");
const VERSION = __mod__.getInfoProperty("version");
const DESCRIPTION = __mod__.getInfoProperty("description");

// Configurable: autosave
let autosave = true;
let autosavePeriod = 45;
let autosaveProjectable = true;

// Configurable: interface
let maxWindows = 8;
let fontScale = uiScaler = 1.;
let menuDividers = false;
let projectHeaderBackground = false;

// Configurable: messages
let hintStackableDenied = false;
let maximumHints = 25;
let showProcesses = true;
let safetyProcesses = true;

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
let typeface = android.graphics.Typeface.MONOSPACE;
let typefaceJetBrains = android.graphics.Typeface.MONOSPACE;

IMPORT("JsonIo");

if (this.isInstant === undefined) {
	this.isInstant = false;
}

IMPORT("Retention");

const tryoutSafety = function(action, report, basic) {
	return tryout.call(this, action, function(e) {
		REVISION.startsWith("develop") && reportError(e);
		if (typeof report == "function") return report.apply(this, arguments);
	}, report !== undefined && typeof report != "function" ? report : basic);
};

IMPORT("Stacktrace");

const prepareDebugInfo = function() {
	return NAME + " " + VERSION + " by " + AUTHOR + " for " + (isHorizon ? "Horizon" : "Inner Core") + " " + minecraftVersion +
		" Report Log\nREVISION " + REVISION.toUpperCase() + ", ANDROID " + android.os.Build.VERSION.SDK_INT;
};

registerReportAction((function() {
	let alreadyHasDate = false;
	return function(error) {
		error && Logger.Log("ModdingTools: " + error, "WARNING");
		reportTrace(error);
		let message = reportTrace.toCode(error) + ": " + error + "\n" +
				(error ? error.stack : null),
			file = new java.io.File(Dirs.LOGGING, REVISION + ".log");
		if (file.isDirectory()) {
			Files.deleteRecursive(file.getPath());
		}
		file.getParentFile().mkdirs();
		if (!file.exists()) {
			Files.write(file, prepareDebugInfo());
		}
		if (!alreadyHasDate) {
			Files.addText(file, "\n" + launchTime);
			alreadyHasDate = true;
		}
		Files.addText(file, "\n" + message);
	};
})());

reportTrace.setupPrint(function(message) {
	message !== undefined && showHint(message);
});

/**
 * getY -> dip = 0,66525
 * getX -> dip = 0,83333
 */
toComplexUnitDip = (function() {
    let self = toComplexUnitDip;
	return function(value) {
		return self(value) * uiScaler;
	};
})();

/**
 * getFontSize -> sp = 0,38095
 */
toComplexUnitSp = (function() {
	let self = toComplexUnitSp;
	return function(value) {
		return self(value) * fontScale;
	};
})();

IMPORT("Drawable");

const INNERCORE_PACKAGE = isHorizon ? Packages.com.zhekasmirnov.innercore : Packages.zhekasmirnov.launcher;

IMPORT("Action");
IMPORT("Sequence");

const CoreEngine = {
	CORE_ENGINE_API_LEVEL: 0
};

let $ = new JavaImporter();
$.importClass(android.view.ViewGroup);
$.importClass(android.view.View);
$.importClass(android.view.Gravity);
$.importClass(android.graphics.Color);
$.importClass(android.graphics.Shader);
$.importClass(android.support.v4.view.ViewCompat);
$.importClass(android.widget.ImageView);
$.importClass(android.widget.LinearLayout);
$.importClass(android.widget.ListView);
$.importClass(java.util.concurrent.TimeUnit);
$.importClass(INNERCORE_PACKAGE.utils.FileTools);
$.importClass(INNERCORE_PACKAGE.api.runtime.LevelInfo);

const isCoreEngineLoaded = function() {
	return CoreEngine.CORE_ENGINE_API_LEVEL != 0;
};

getPlayerEnt = function() {
	if ($.LevelInfo.isLoaded()) {
		return Number(Player.get());
	}
	return 0;
};

IMPORT("Network");
