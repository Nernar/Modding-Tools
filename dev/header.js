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

// menu content settings
var warningMessage = null;
var maxWindows = 5;
var saveCoords = false;
var autosave = true;
var autosaveInterface = false;
var autosavePeriod = 45;
var entityBoxType = true;
var fontScale = uiScaler = 1.0;
var drawSelection = true;
var autosaveProjectable = true;
var injectBorder = false;
var transparentBoxes = true;
var menuDividers = false;
var supportSupportables = true;
var loadSupportables = true;
var hintStackableDenied = true;
var alwaysIndexate = false;
var maximumHints = 50;
var showProcesses = true;
var noImportedScripts = true;
var keyExpiresSoon = false;
var ignoreKeyDeprecation = false;
var projectHeaderBackground = false;
var debugAnimationsEnabled = true;
var useOldExplorer = false;
var showedFocusableAnimationsHint = false;
var importAutoselect = false;

// interface & mod data
var __code__ = "develop-alpha-0.3.3-31.07.2020-0";
var __author__ = __mod__.getInfoProperty("author");
var __version__ = __mod__.getInfoProperty("version");
var __description__ = __mod__.getInfoProperty("description");
var typeface = android.graphics.Typeface.MONOSPACE;
var isSupportEnv = false, currentEnvironment = __name__;

MCSystem.setLoadingTip("Import Libraries");
var isInstant = !!this.isInstant;
IMPORT("Retention:2");
IMPORT("Transition:5");
IMPORT("Scene:3");
IMPORT("Action:3");

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

var alreadyHasDate = false;
reportError.setStackAction(function(err) {
	var message = reportError.getCode(err) + ": " + reportError.getStack(err),
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

function getPlayerEnt() {
	return parseInt(Player.get());
}