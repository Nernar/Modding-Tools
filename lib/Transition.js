/*
     _______                  _ _   _             
    |__   __|                (_) | (_)            
       | |_ __ __ _ _ __  ___ _| |_ _  ___  _ __  
       | | '__/ _` | '_ \/ __| | __| |/ _ \| '_ \ 
       | | | | (_| | | | \__ \ | |_| | (_) | | | |
       |_|_|  \__,_|_| |_|___/_|\__|_|\___/|_| |_|
                                                  
                                                  
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

LIBRARY({
	name: "Transition",
	version: 1,
	shared: true,
	api: "CoreEngine",
	dependencies: ["Retention:1"]
});

IMPORT("Retention:1");

/**
 * Used to create transitions: special
 * animations moving creatures in the game.
 * @param {object} obj Setting frames
 * @param {number} obj Setting entity
 */
function Transition(obj) {
	var count = Transition.instances.push(this);
	this.id = "transition" + count;
	this.frames = new Array();
	this.fps = 60;

	this.__compareVectorPoint = function(index, request) {
		var frame = this.frames[index], center = frame[5] / 2, speedest = 1;
		frame[7] == Transition.Interpolator.ACCELERATE && (speedest = 2 * (request / frame[5]));
		frame[7] == Transition.Interpolator.DECELERATE && (speedest = 2 * ((frame[5] - request) / frame[5]));
		frame[7] == Transition.Interpolator.ACCELERATE_DECELERATE && (request < center ? (speedest = 2 * (request / center)) : (speedest = 2 * (frame[5] - request) / center));
		this.addPoint(frame[0] * speedest, frame[1] * speedest, frame[2] * speedest, frame[3] * speedest, frame[4] * speedest);
	};
	this.addFrame = function(x, y, z, yaw, pitch, duration, interpolator) {
		var request = this.fps * (duration > 0 ? duration : 1 / this.fps);
		this.frames.push(interpolator + "" != "undefined" ?
			[x / request, y / request, z / request, yaw / request, pitch / request, request, 1000 / this.fps, interpolator]
			: [x / request, y / request, z / request, yaw / request, pitch / request, request, 1000 / this.fps]);
		return this;
	};
	this.addPoint = function(x, y, z, yaw, pitch) {
		this.point[0] += x;
		this.point[1] += y;
		this.point[2] += z;
		this.point[3] += yaw;
		this.point[4] += pitch;
		return this;
	};
	this.getFrameCount = function() {
		return this.frames.length;
	};
	this.clearFrames = function() {
		this.frames = new Array();
	};

	this.getRelativePoint = function() {
		return {
			x: this.point[0] - this.starting[0],
			y: this.point[1] - this.starting[1],
			x: this.point[2] - this.starting[2],
			yaw: this.point[3] - this.starting[3],
			pitch: this.point[4] - this.starting[4]
		};
	};
	this.setPoint = function(x, y, z, yaw, pitch) {
		this.point = [x, y, z, yaw, pitch];
		return this;
	};
	this.setFramesPerSecond = function(limit) {
		this.fps = limit <= 240 ? limit : 60;
		return this;
	};

	this.start = function() {
		if(!this.entity) {
			Logger.Log("Entity is not defined", "TRANSITION");
			return;
		}
		if(!this.starting) {
			Logger.Log("Start point not setted up", "TRANSITION");
			return;
		}
		if(Transition.isTransitioning()) return;
		if(this.__thread == null) {
			var scope = Transition.currently = this;
			Threading.initThread(this.id, function() {
				scope.__thread = Threading.getThread(scope.id);
				try {
					var point = (scope.point = scope.starting.slice());
					if(scope.__start) scope.__start(scope);
					Entity.setMobile(scope.entity, false);
					for(var index = 0; index < scope.frames.length; index++) {
						var frame = scope.frames[index];
						for(var request = 0; request < frame[5]; request++) {
							scope.__compareVectorPoint(index, request);
							Entity.setPosition(scope.entity, point[0], point[1], point[2]);
							Entity.setLookAngle(scope.entity, point[3], point[4]);
							if(scope.__frame) scope.__frame(scope, index, request);
							if(scope.__thread) Ui.sleepMilliseconds(frame[6]);
							else (index = scope.frames.length) && (request = frame[5]);
						}
					}
					Entity.setMobile(scope.entity, true);
				} catch(e) {
					reportError(e);
				}
				if(scope.__finish) scope.__finish(scope);
				delete Transition.currently;
				delete scope.__thread;
			}, 0);
		}
		return this;
	};
	this.stop = function() {
		if(this.__thread) delete this.__thread;
		return this;
	};
	this.isStarted = function() {
		return typeof this.__thread != "undefined";
	};
	
	this.withFrames = function(frames) {
		for(var i = 0; i < frames.length; i++)
			this.addFrame(frames[i][0], frames[i][1], frames[i][2],
				frames[i][3], frames[i][4], frames[i][5], frames[i][6]);
		return this;
	};
	this.withFrom = function(x, y, z, yaw, pitch) {
		this.starting = [x, y, z, yaw, pitch];
		return this;
	};
	this.withEntity = function(entity) {
		this.entity = entity;
		return this;
	};
	
	this.withOnStartListener = function(action) {
		action && (this.__start = function(scope) {
			try { action(scope); }
			catch(e) { reportError(e); }
		});
		return this;
	};
	this.withOnFrameListener = function(listener) {
		action && (this.__frame = function(scope, index, request) {
			try { action(scope, index, request); }
			catch(e) { reportError(e); }
		});
		return this;
	};
	this.withOnFinishListener = function(listener) {
		action && (this.__finish = function(scope) {
			try { action(scope); }
			catch(e) { reportError(e); }
		});
		return this;
	};
	
	if(obj) {
		typeof obj == "object" && this.withFrames(obj);
		typeof obj == "number" && this.withEntity(obj);
	}
}

Transition.instances = [];
Transition.Interpolator = {
	LINEAR: 0,
	ACCELERATE: 1,
	DECELERATE: 2,
	ACCELERATE_DECELERATE: 3
};
Transition.getCurrently = function() {
	return this.currently;
};
Transition.isTransitioning = function() {
	return !!this.getCurrently();
};

Callback.addCallback("LevelLeft", function() {
	Transition.isTransitioning() &&
		Transition.getCurrently().stop();
});

EXPORT("Transition", Transition);