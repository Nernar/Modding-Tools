/*
    _____               ______    _ _ _             
   |  __ \             |  ____|  | (_) |            
   | |  | | _____   __ | |__   __| |_| |_ ___  _ __ 
   | |  | |/ _ \ \ / / |  __| / _` | | __/ _ \| '__|
   | |__| |  __/\ V /  | |___| (_| | | || (_) | |   
   |_____/ \___| \_/   |______\__,_|_|\__\___/|_|   
                                                    
                                                    
   Copyright 2018-2020 Nernar (github.com/nernar)
   
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

MCSystem.setLoadingTip("Initialization Script");

// Menu content settings
let warningMessage = null;
let maxWindows = 5;
let saveCoords = false;
let autosave = true;
let autosaveInterface = false;
let autosavePeriod = 45;
let entityBoxType = true;
let fontScale = uiScaler = 1.0;
let drawSelection = true;
let autosaveProjectable = true;
let injectBorder = false;
let transparentBoxes = true;
let menuDividers = false;
let supportSupportables = true;
let loadSupportables = true;
let hintStackableDenied = true;
let alwaysIndexate = false;
let maximumHints = 50;
let showProcesses = true;
let noImportedScripts = true;
let keyExpiresSoon = false;
let ignoreKeyDeprecation = false;
let projectHeaderBackground = false;
let debugAnimationsEnabled = true;
let useOldExplorer = false;
let showedFocusableAnimationsHint = false;
let importAutoselect = false;

// Interface and mod data
const __code__ = "develop-alpha-0.3.3-05.09.2020-0";
const __author__ = __mod__.getInfoProperty("author");
const __version__ = __mod__.getInfoProperty("version");
const __description__ = __mod__.getInfoProperty("description");
let typeface = android.graphics.Typeface.MONOSPACE;
let isSupportEnv = false, currentEnvironment = __name__;

MCSystem.setLoadingTip("Import Libraries");
const isInstant = !!this.isInstant;
IMPORT("Retention:2");

reportError.setTitle(__name__ + " " + __version__);
reportError.setInfoMessage("An error occurred while executing the mod. " +
	"If the develop process is affected, try export all non-saved data. " +
	"Send a screenshot of error to our group or save the error in the internal storage.");

reportError.addDebugValue("isHorizon", isHorizon);
reportError.addDebugValue("interfaceScale", uiScaler);
reportError.addDebugValue("fontSizeScale", fontScale);
reportError.addDebugValue("loadSupportables", loadSupportables);
reportError.addDebugValue("autosaveEnabled", autosave);
reportError.addDebugValue("moveMapping", saveCoords);
reportError.addDebugValue("useBoxSizes", uiScaler);
reportError.addDebugValue("drawSelection", drawSelection);

let alreadyHasDate = false;
reportError.setStackAction(function(err) {
	let message = reportError.getCode(err) + ": " + reportError.getStack(err),
		file = new java.io.File(Dirs.LOGGING, __code__ + ".log");
	if (!file.exists()) Files.write(file, reportError.prepareDebugInfo());
	if (!reportError.alreadyHasDate) {
		Files.addText(file, "\n" + reportError.getLaunchTime());
		reportError.alreadyHasDate = true;
	}
	Files.addText(file, "\n" + message);
	showHint(translate("Error stack saved into internal storage"), Ui.Color.YELLOW);
});

reportError.prepareDebugInfo = function() {
	return __name__ + " " + __version__ + " by " + __author__ + " for " + (isHorizon ? "Horizon" : "Inner Core") +
		" Report Log\nBuild " + __code__.toUpperCase() + ", ANDROID " + android.os.Build.VERSION.SDK_INT;
};

Ui.getFontSize = function(size) {
	return Math.round(this.getX(size) / this.Display.DENSITY * fontScale);
};
Ui.getX = function(x) {
	return x > 0 ? Math.round(this.Display.WIDTH / (1280 / x) * uiScaler) : x;
};
Ui.getY = function(y) {
	return y > 0 ? Math.round(this.Display.HEIGHT / (720 / y) * uiScaler) : y;
};

IMPORT("Network:1");

Network.prototype.getFormattedSize = function() {
    return Files.prepareFormattedSize(this.getSize());
};

Network.Reader.prototype.getThread = function() {
    return this.thread || null;
};
Network.Reader.prototype.readAsync = function(post) {
    let scope = this;
    this.thread = handleThread(function() {
        scope.read();
        delete scope.thread;
        post && post(scope.getResult());
    });
};
Network.Reader.prototype.assureYield = function() {
    try {
        if (!this.getThread()) return false;
        while (this.inProcess()) java.lang.Thread.yield();
        return this.getReadedCount() >= 0;
    } catch (e) {
        return false;
    }
};

Network.Writer.prototype.getThread = function() {
    return this.thread || null;
};
Network.Writer.prototype.downloadAsync = function(post) {
	let scope = this;
	this.thread = handleThread(function() {
		scope.download();
		delete scope.thread;
		post && post();
	});
};
Network.Writer.prototype.assureYield = function() {
	try {
		if (!this.getThread()) return false;
		while (this.inProcess()) java.lang.Thread.yield();
		return this.getReadedCount() >= 0;
	} catch (e) {
		return false;
	}
};

IMPORT("ModBrowser.Query:1");
IMPORT("Transition:5");
IMPORT("Scene:3");
IMPORT("Action:3");

function getPlayerEnt() {
	return parseInt(Player.get());
}
