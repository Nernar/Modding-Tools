/*
      _____                     
     / ____|                    
    | (___   ___ ___ _ __   ___ 
     \___ \ / __/ _ \ '_ \ / _ \
     ____) | (_|  __/ | | |  __/
    |_____/ \___\___|_| |_|\___|
                                
                                
   Copyright 2019-2020 Nernar (github.com/nernar)

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

LIBRARY({
	name: "Scene",
	version: 3,
	shared: true,
	api: "AdaptedScript",
	dependencies: ["Retention:2"]
});

IMPORT("Retention:2");

/**
 * Allows you to create a logical timer that
 * can used for game events by ticks.
 * @param {function} params Tick listener
 * @param {object} params Parameters
 * @param {string} params Instance id
 * @param {number} params Tick time
 */
function Scene(params) {
	let count = Scene.instances.push(this);
	this.id = "scene" + count;
	this.tick = this.real = 0;
	this.isRunned = false;
	this.sleep = 50;
	
	this.setOnInitializationListener = function(action) {
		action && (this.__init = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};
	
	this.applyParams = function(params) {
		for (let item in params) {
			let param = params[item];
			switch(item) {
				case "hooks":
				case "actions":
				case "listeners":
					param.onInit && this.setOnInitializationListener(param.onInit);
					param.onRun && this.setOnRunListener(param.onRun);
					param.onTick && this.setOnTickListener(param.onTick);
					param.onFinish && this.setOnFinishListener(param.onFinish);
					param.onPause && this.setOnPauseListener(param.onPause);
					param.onDestroy && this.setOnDestroyListener(param.onDestroy);
					break;
				case "game":
				case "time":
					if (typeof param == "number") this.setTickTime(param);
					else if (typeof param == "object" && !Array.isArray(param)) {
						param.isStatic && this.setIsStatic(param.isStatic);
						param.tick && this.setTickTime(param.tick);
					}
					break;
				case "tick":
				case "wait":
				case "sleep":
					this.setTickTime(param);
					break;
				case "static":
				case "isStatic":
					this.setIsStatic(param);
					break;
			}
		}
	};
	
	this.create = function() {
		let scope = this;
		if (this.thread) return;
		this.tick = this.real = 0;
		this.thread = new java.lang.Thread(function() {
			while (scope && scope.thread && scope.sleep > 0) {
				try {
					if (scope.thread.isInterrupted()) return;
					if (scope.isRunned) {
						scope.tick == 0 && Ui.sleepMilliseconds(scope.sleep);
						(scope.tick++, scope.real += scope.sleep);
						scope.__tick && scope.__tick(scope);
						if (scope.thread.isInterrupted()) return;
						Ui.sleepMilliseconds(scope.sleep);
					} else if (!scope.thread.isInterrupted())
						Ui.sleepMilliseconds(1);
				} catch (e) {
					if (e.message == "java.lang.InterruptedException: null") {
						break;
					}
					reportError(e);
				}
			}
			scope.destroy();
		}), this.thread.start();
		this.__create && this.__create(this);
		return this;
	};
	
	this.setIsStatic = function(static) {
		static && (this.sleep = 0);
	};
	this.setTickTime = function(time) {
		typeof time == "number" && (this.sleep = time);
	};
	this.handle = function(action) {
		if (!context) return false;
		let scope = this;
		context.runOnUiThread(function() {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
		return true;
	};
	
	this.run = function(post) {
		Logger.Log("Running " + this.id, "Scene");
		let scope = this;
		if (this.isRunned) return;
		this.isRunned = true;
		this.tick = this.real = 0;
		this.__run && this.__run(this);
		post && handle(function() {
			post(scope);
		}, this.sleep);
	};
	this.pause = function(time) {
		let scope = this;
		this.isRunned = false;
		time && handle(function() {
			scope.isRunned = true;
		}, time);
		this.__pause && this.__pause(this);
	};
	this.finish = function() {
		Logger.Log("Finishing " + this.id, "Scene");
		this.isRunned = false;
		this.__finish && this.__finish(this);
		this.tick = this.real = 0;
	};
	this.destroy = function() {
		if (this.thread) this.thread.interrupt();
		delete this.thread;
		this.isRunned = false;
		this.tick = this.real = 0;
		Scene.instances.splice(count - 1, 1);
		this.__destroy && this.__destroy(this);
	};
	
	this.setOnRunListener = function(action) {
		action && (this.__run = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};
	this.setOnTickListener = function(action) {
		action && (this.__tick = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};
	this.setOnPauseListener = function(action) {
		action && (this.__pause = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};
	this.setOnFinishListener = function(action) {
		action && (this.__finish = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};
	this.setOnDestroyListener = function(action) {
		action && (this.__destroy = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};
	this.setOnCreateListener = function(action) {
		action && (this.__create = function(scope) {
			try { action(scope); }
			catch (e) { reportError(e); }
		});
	};
	
	if (params) {
		if (typeof params == "function") this.setOnTickListener(params);
		else if (typeof params == "object") this.applyParams(params);
		else if (typeof params == "string") return Scene.findSceneById(params);
		else if (typeof params == "number") this.setTickTime(params);
		else throw "Scene can't be created with invalid type of params";
	}
	this.__init && this.__init(this);
};

Scene.instances = [];
Scene.prepare = function() {
	Scene.instances.forEach(function(i) {
		i.sleep > 0 && i.create();
	});
};
Scene.findSceneById = function(id) {
	let instances = Scene.instances;
	for (let i = 0; i < instances.length; i++)
		if (instances[i].id == id) return instances[i];
};
Scene.destroy = function() {
	Scene.instances.forEach(function(i) {
		i.thread && i.destroy();
	});
};

EXPORT("Scene", Scene);
