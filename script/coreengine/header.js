/*

   Copyright 2022 Nernar (github.com/nernar)
   
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

try {
	runCustomSource("script/adaptedscript.js");
	let scope = __mod__.compiledCustomSources.get("script/adaptedscript.js").scriptScope;
	for (let anything in scope) {
		this[anything] = scope[anything];
	}
} catch (e) {
	Logger.Log("ModdingTools: CoreEngine API: " + e, "ERROR");
}

var __version__ = 16;
var __name__ = "core-engine";
var __dir__ = __packdir__ + "innercore/coreengine";
var __modpack__ = {};

var __global__ = this;
var CORE_ENGINE_CONFIG_LOCK = 4;
var CORE_ENGINE_API_LEVEL = 12;
var CORE_ENGINE_VERSION = "2.1";

var BlockID = {};
var ItemID = {};

function importLib() {}
function IMPORT() {}
function IMPORT_NATIVE() {}
function WRAP_NATIVE() {}
function WRAP_JAVA() {}
function print() {}
function __debug_typecheck__() {}

function runVersionDependentDataScript(name) {}
function getVersionDependentDataScript(name) {
	return "";
}

function getPlayerZ() {
	return -0.17998993396759033;
}
function getPlayerY() {
	return -0.17998993396759033;
}
function getPlayerX() {
	return -0.17998993396759033;
}
function getMcContext() {
	return {};
}

var MCPE_VERSION_SUPPORT = {};
MCPE_VERSION_SUPPORT[11] = true;
MCPE_VERSION_SUPPORT[16] = true;

var MCPE_VERSION = {};
MCPE_VERSION.str = "1.16.201";
MCPE_VERSION.array = [ 1, 16, 201 ];
MCPE_VERSION.main = 16;

function getMCPEVersion() {
	return MCPE_VERSION;
}

var GuiUtils = {};
GuiUtils.Run = function(func) {};

var nonSavesObjectSaver = 859053837;

var __RAD_TO_DEGREES = 180 / Math.PI;
function __radToDegrees(x) {
	return x * __RAD_TO_DEGREES;
}
function __degreesToRad(x) {
	return x / __RAD_TO_DEGREES;
}
function __normalizeAngle(x) {
	while (x > Math.PI * 2) {
		x -= Math.PI * 2;
	}
	while (x < 0) {
		x += Math.PI * 2;
	}
	return x;
}
function __targetValue(x, val, speed) {
	return x + Math.min(Math.max(-speed, val - x), speed);
}
function __targetAngle(angle, target, speed) {
	angle = __normalizeAngle(angle);
	target = __normalizeAngle(target);
	if (target - Math.PI > angle) {
		target -= Math.PI * 2;
	}
	if (angle - Math.PI > target) {
		target += Math.PI * 2;
	}
	return __targetValue(angle, target, speed);
}

function setPlayerItem(id, count, data, extra) {}

function NativeAPI_getData() {}
function NativeAPI_getTile() {}
function NativeAPI_getTileAndData() {}
function NativeAPI_setTile() {}

function Particle_addFarParticle() {}
function Particle_addParticle() {}

function ResetInGameAPIs() {}
