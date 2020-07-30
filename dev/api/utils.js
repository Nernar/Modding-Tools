function convertNdb(obj) {
	if (!obj) return null;
	var worker = new BlockWorker();
	worker.Renderer.createModel();
	worker.Collision.createModel();
	var result = worker.getProject();
	obj.namedID && (result.define.id = obj.namedID);
	obj.defineData && Array.isArray(obj.defineData) &&
		stringifyObject(obj.defineData, true, function(string) {
			string && string.length > 0 && (result.define.data = string);
		});
	obj.blockType && !Array.isArray(obj.blockType) &&
		stringifyObject(obj.blockType, true, function(string) {
			string && string.length > 0 && (result.define.special = string);
		});
	if (obj.shape && obj.shape.length == 6) {
		result.define.shape = new Object();
		result.define.shape.x1 = obj.shape[0];
		result.define.shape.y1 = obj.shape[1];
		result.define.shape.z1 = obj.shape[2];
		result.define.shape.x2 = obj.shape[3];
		result.define.shape.y2 = obj.shape[4];
		result.define.shape.z2 = obj.shape[5];
	}
	if (obj.point && obj.point.length == 3) {
		result.define.mapped[0] = new Object();
		result.define.mapped[0].x = obj.point[0];
		result.define.mapped[0].y = obj.point[1];
		result.define.mapped[0].z = obj.point[2];
	}
	if (obj.boxes && Array.isArray(obj.boxes)) {
		obj.boxes.forEach(function(element, index) {
			result.renderer[0].boxes[index] = new Object();
			result.renderer[0].boxes[index].x1 = element[0];
			result.renderer[0].boxes[index].y1 = element[1];
			result.renderer[0].boxes[index].z1 = element[2];
			result.renderer[0].boxes[index].x2 = element[3];
			result.renderer[0].boxes[index].y2 = element[4];
			result.renderer[0].boxes[index].z2 = element[5];
			if (element.length < 7) result.renderer[0].boxes[index].texture = element[6];
			else result.renderer[0].boxes[index].texture = [[element[6], element[7]]];
		});
	}
	return result;
}

function convertNds(obj) {
	if (!obj) return null;
	var worker = new TransitionWorker();
	worker.Animation.createAnimate();
	var result = worker.getProject();
	obj.entity && (result.define.entity = obj.entity);
	if (obj.point && obj.point.length == 5) {
		result.define.starting.x = obj.point[0];
		result.define.starting.y = obj.point[1];
		result.define.starting.z = obj.point[2];
		result.define.starting.yaw = obj.point[3];
		result.define.starting.pitch = obj.point[4];
	}
	if (obj.frames && Array.isArray(obj.frames)) {
		obj.frames.forEach(function(element, index) {
			result.animation[0].frames[index] = new Object();
			result.animation[0].frames[index].x = element[0];
			result.animation[0].frames[index].y = element[1];
			result.animation[0].frames[index].z = element[2];
			result.animation[0].frames[index].yaw = element[3];
			result.animation[0].frames[index].pitch = element[4];
			result.animation[0].frames[index].duration = element[5];
			if (element.length > 6 && element[6]) switch (element[6]) {
				case "center": case 1:
					result.animation[0].frames[index].interpolator =
						Transition.Interpolator.ACCELERATE_DECELERATE;
					break;
				case "start": case "left": case 2:
					result.animation[0].frames[index].interpolator =
							Transition.Interpolator.DECELERATE;
					break;
				case "end": case "right": case 3:
					result.animation[0].frames[index].interpolator =
							Transition.Interpolator.ACCELERATE;
					break;
			}
		});
	}
	return result;
}

function handleThread(action) {
	var thread = new java.lang.Thread(function() {
		try { action && action(); }
		catch(e) { reportError(e); }
	});
	handleThread.stack.push(thread);
	return (thread.start(), thread);
}

handleThread.stack = new Array();
handleThread.clear = function() {
	handleThread.stack.forEach(function(thread) {
		thread && !thread.isInterrupted() && thread.interrupt();
	});
	handleThread.stack = new Array();
};

var MathUtils = new Object();
MathUtils.mathDivider = function(number) {
	if (number % 100000000 == 0) return Math.round(number / 1e8) + "e8";
	if (number % 10000000 == 0) return Math.round(number / 1e7) + "e7";
	if (number % 1000000 == 0) return Math.round(number / 1e6) + "e6";
	if (number % 100000 == 0) return Math.round(number / 1e5) + "e5";
	if (number % 10000 == 0) return Math.round(number / 1e4) + "e4";
	if (number % 1000 == 0) return Math.round(number / 1e3) + "e3";
	if (number % 100 == 0) return Math.round(number / 1e2) + "e2";
	if (number % 1 == 0) return number;
	if (number % 0.125 == 0) return Math.round(number * 8) + "/8";
	if (number % 0.0625 == 0) return Math.round(number * 16) + "/16";
	if (number % 0.03125 == 0) return Math.round(number * 32) + "/32";
	if (number % 0.015625 == 0) return Math.round(number * 64) + "/64";
	if (number % 0.0078125 == 0) return Math.round(number * 128) + "/128";
	if (number % 0.00390625 == 0) return Math.round(number * 256) + "/256";
	if (number % 0.001953125 == 0) return Math.round(number * 512) + "/512";
	if (number % 0.0009765625 == 0) return Math.round(number * 1024) + "/1024";
	Logger.Log("Non-divideable number: " + number, "Dev-Editor");
	return number;
};

var Base64 = new Object();
Base64.encode = function(bytes) {
	return java.util.Base64.getEncoder().encode(bytes);
};
Base64.decode = function(bytes) {
	return java.util.Base64.getDecoder().decode(bytes);
};

var LoadingTipUtils = new Object();
LoadingTipUtils.setEncounter = function(tip) {
	this.encounter = new java.lang.String(tip);
	this.updateCounter(0);
};
LoadingTipUtils.hasEncounter = function() {
	return !!this.encounter;
};
LoadingTipUtils.updateCounter = function(count) {
	if (!this.encounter) return;
	this.result = this.encounter.replaceAll("%count", count);
	MCSystem.setLoadingTip(this.result || "");
};
LoadingTipUtils.resetEncounter = function() {
	delete this.encounter;
	delete this.result;
	MCSystem.setLoadingTip("");
};

Math.RAD = 180 / Math.PI;
