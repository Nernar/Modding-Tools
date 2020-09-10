function TransitionWorker(obj) {
	let worker = this;
	this.getProject = function() {
		return {
			type: "transition",
			define: this.Define.getParams(),
			animation: this.Animation.getParams()
		};
	};
	this.loadProject = function(obj) {
		obj.define && this.Define.setParams(obj.define);
		obj.animation && this.Animation.setParams(obj.animation);
	};
	this.Define = {
		params: {
			entity: getPlayerEnt(),
			starting: new Object()
		},
		getParams: function() {
			return this.params;
		},
		getStarting: function() {
			return this.getParams().starting;
		},
		getEntity: function() {
			return this.getParams().entity;
		},
		getFps: function() {
			return this.getParams().fps;
		},
		setParams: function(params) {
			for (let name in params) this.params[name] = params[name];;
		},
		setEntity: function(entity) {
			this.params.entity = entity;
		},
		setFps: function(fps) {
			this.params.fps = fps;
		},
		moveStarting: function(axis, value) {
			let starting = this.getStarting();
			axis && (starting[axis] = value);
		},
		resetStarting: function() {
			let starting = this.getStarting(),
				coords = Entity.getPosition(this.getEntity()),
				angle = Entity.getRotation(this.getEntity());
			starting.x = preround(coords[0], 1);
			starting.y = preround(coords[1], 1);
			starting.z = preround(coords[2], 1);
			starting.yaw = preround(angle[0], 2);
			starting.pitch = preround(angle[1], 2);
		}
	};
	this.Animation = {
		animates: new Array(),
		createAnimate: function() {
			let animates = this.getAnimates();
			animates.push(new this.Animate());
			return animates.length - 1;
		},
		removeAnimate: function(index) {
			let animates = this.getAnimates();
			animates.splice(index, 1);
		},
		getAnimate: function(index) {
			return this.getAnimates()[index];
		},
		getAnimates: function() {
			return this.animates;
		},
		getAnimateCount: function() {
			return this.getAnimates().length;
		},
		getFrameCount: function() {
			let count = 0;
			for (let i = 0; i < this.getAnimateCount(); i++)
				count += this.getAnimate(i).getFrameCount();
			return count;
		},
		getParams: function() {
			let params = [];
			for (let i = 0; i < this.getAnimateCount(); i++)
				params.push(this.getAnimate(i).params);
			return params;
		},
		setParams: function(params) {
			this.animates = new Array();
			for (let i = 0; i < params.length; i++) {
				let animate = this.createAnimate();
				this.getAnimate(animate).params = params[i];
			}
		},
		Animate: function() {
			this.params = {
				frames: new Array()
			};
			
			// Create and removing
			this.addFrame = function() {
				let frames = this.getFrames();
				frames.push({
					x: 0, y: 0, z: 0,
					yaw: 0, pitch: 0,
					duration: 3
				});
				return frames.length - 1;
			};
			this.cloneFrame = function(index) {
				let frames = this.getFrames();
				frames.push(assign(frames[index]));
				return frames.length - 1;
			};
			this.removeFrame = function(index) {
				let frames = this.getFrames();
				frames.splice(index, 1);
			};
			
			// Get params and sizes
			this.getFrame = function(index) {
				return this.getFrames()[index];
			};
			this.getFrames = function() {
				return this.params.frames;
			};
			this.getFrameCount = function() {
				return this.getFrames().length;
			};
			this.setupFrame = function(index) {
				let real = this.getFrameCoords(index), frame = this.getFrame(index),
					coords = Entity.getPosition(worker.Define.getEntity()),
					angle = Entity.getLookAngle(worker.Define.getEntity());
				frame.x = preround(coords[0] - real.x, 1);
				frame.y = preround(coords[1] - real.y, 1);
				frame.z = preround(coords[2] - real.z, 1);
				frame.yaw = preround(angle[0] - real.yaw, 2);
				frame.pitch = preround(angle[1] - real.pitch, 2);
			};
			this.asArray = function() {
				let frames = this.getFrames(),
					result = new Array();
				for (let i = 0; i < frames.length; i++) {
					let frame = frames[i],
						index = result.push([frame.x, frame.y, frame.z,
						frame.yaw, frame.pitch, frame.duration]) - 1;
					if (this.hasInterpolator(i))
						result[index].interpolator = frame.interpolator;
				}
				return result;
			};
			this.getFrameCoords = function(index) {
				let point = new Object(), frames = this.getFrames(),
					starting = worker.Define.getStarting();
				for (let i in starting)
					point[i] = starting[i];
				for (let i = 0; i < index; i++)
					for (let f in point)
						point[f] += frames[i][f];
				return point;
			};
			
			// Move and durate
			this.moveFrame = function(index, axis, value) {
				let frame = this.getFrame(index);
				axis && (frame[axis] = value);
			};
			this.durateFrame = function(index, value) {
				let frame = this.getFrame(index);
				frame.duration = value;
			};
			this.hasInterpolator = function(index) {
				let frame = this.getFrame(index);
				return typeof frame.interpolator != "undefined";
			};
			this.resetInterpolation = function(index) {
				if (this.hasInterpolator(index))
					delete this.getFrame(index).interpolator;
			};
			this.interpolateFrame = function(index, value) {
				let frame = this.getFrame(index);
				frame.interpolator = value;
			};
			
			// Scene actions
			this.durateScene = function(value) {
				let count = this.getFrameCount();
				for (let i = 0; i < count; i++)
					this.durateFrame(i, value / count);
			};
		}
	};
	this.Define.resetStarting();
	obj && this.loadProject(obj);
}
