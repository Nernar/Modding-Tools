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
const REVISION = "develop-alpha-0.4-19.06.2022-0";
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

// Runtime changed values
let warningMessage = null;

// Definitions for default values
let firstLaunchTutorial = REVISION.startsWith("testing");
let typeface = android.graphics.Typeface.MONOSPACE;
let typefaceJetBrains = android.graphics.Typeface.MONOSPACE;

IMPORT("JsonIo:1");

if (this.isInstant === undefined) {
	this.isInstant = false;
}

IMPORT("Retention:5");

const tryoutSafety = function(action, report, basic) {
	return tryout.call(this, action, function(e) {
		REVISION.startsWith("develop") && retraceOrReport(e);
		if (typeof report == "function") return report.apply(this, arguments);
	}, report !== undefined && typeof report != "function" ? report : basic);
};

Interface.getFontSize = function(size) {
	return Math.round(this.getX(size) / this.Display.DENSITY * fontScale);
};

Interface.getX = function(x) {
	return x > 0 ? Math.round(this.Display.WIDTH / (1280 / x) * uiScaler) : x;
};

Interface.getY = function(y) {
	return y > 0 ? Math.round(this.Display.HEIGHT / (720 / y) * uiScaler) : y;
};

const prepareDebugInfo = function() {
	return NAME + " " + VERSION + " by " + AUTHOR + " for " + (isHorizon ? "Horizon" : "Inner Core") + " " + minecraftVersion +
		" Report Log\nREVISION " + REVISION.toUpperCase() + ", ANDROID " + android.os.Build.VERSION.SDK_INT;
};

let alreadyHasDate = false;
reportError.setStackAction(function(err) {
	let message = reportError.getCode(err) + ": " + reportError.getStack(err),
		file = new java.io.File(Dirs.LOGGING, REVISION + ".log");
	if (file.isDirectory()) {
		Files.deleteRecursive(file.getPath());
	}
	file.getParentFile().mkdirs();
	if (!file.exists()) {
		Files.write(file, prepareDebugInfo());
	}
	if (!alreadyHasDate) {
		Files.addText(file, "\n" + reportError.getLaunchTime());
		alreadyHasDate = true;
	}
	Files.addText(file, "\n" + message);
	showHint(translate("Error stack saved into internal storage"));
});

reportError.setReportAction(function(err) {
	Logger.Log(reportError.getCode(err) + ": " + err, "ERROR");
});

IMPORT("Drawable:1");

const INNERCORE_PACKAGE = isHorizon ? Packages.com.zhekasmirnov.innercore : Packages.zhekasmirnov.launcher;

IMPORT("Stacktrace:2");

const retraceOrReport = function(error) {
	error && Logger.Log(error, "WARNING");
	if (REVISION.startsWith("develop")) {
		reportTrace(error);
	} else {
		reportError(error);
	}
};

if (REVISION.startsWith("develop")) {
	reportTrace.setupPrint(function(message) {
		message !== undefined && showHint(message);
	});
	if (isInstant) {
		reportTrace.reloadModifications();
	}
	tryout(function() {
		let $ = new JavaImporter(INNERCORE_PACKAGE.mod.executable.library),
			dependency = new $.LibraryDependency("Retention");
		dependency.setParentMod(__mod__);
		let library = $.LibraryRegistry.resolveDependency(dependency);
		if (!library.isLoaded()) {
			MCSystem.throwException("Retention.js library required for this modification");
		}
		library.getScope().reportError = reportTrace;
	});
}

IMPORT("Action:4");
IMPORT("Sequence:1");

const $ = {
	CORE_ENGINE_API_LEVEL: 0
};

const isCoreEngineLoaded = function() {
	return $.CORE_ENGINE_API_LEVEL != 0;
};

getPlayerEnt = function() {
	if (LevelInfo.isLoaded()) {
		return Number(Player.get());
	}
	return 0;
};

IMPORT("Network:2");

FileTools = INNERCORE_PACKAGE.utils.FileTools;
LevelInfo = INNERCORE_PACKAGE.api.runtime.LevelInfo;
