function Project(obj) {
	this.object = new Array();
	this.isOpened = false;
	this.currentId = -1;
	
	this.callAutosave = function() {
		if (!autosave || this.isAutosaving) {
			this.updateCurrentWorker();
			return;
		}
		try {
			var scope = this;
			this.isAutosaving = true;
			this.updateCurrentWorker();
			exportProject(autosaveProjectable ? this.getAll() : this.getCurrentObject(), true,
				Dirs.AUTOSAVE + "/" + this.getProjectTime() + ".dnp",
				function(result) { delete scope.isAutosaving; });
		} catch(e) {
			reportError(e);
		}
	};
	this.getProjectTime = function() {
		var time = new Date(this.time);
		if (!this.time) return translate("Autosave %s", random(0, 10000000));
		return monthToName(time.getMonth()) + " " + time.getDate() + ", " + time.getFullYear() + " " +
			(time.getHours() >= 10 ? time.getHours() : "0" + time.getHours()) + ":" +
			(time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()) + ":" +
			(time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds());
	};
	
	this.getByType = function(type) {
		var obj = this.getAll(), values = new Array();
		for (var i = 0; i < this.getCount(); i++)
			obj[i].type == type && values.push(i);
		return values;
	};
	this.getBlocks = function() {
		return this.getByType("block");
	};
	this.getEntities = function() {
		return this.getByType("entity");
	};
	this.getTransitions = function() {
		return this.getByType("transition");
	};
	this.getAll = function() {
		return this.object;
	};
	this.getCount = function() {
		return this.getAll().length;
	};
	
	this.getCurrentId = function() {
		return this.currentId;
	};
	this.getCurrentObject = function() {
		var id = this.getCurrentId(),
			obj = this.getAll()[id];
		if (obj) return obj;
		delete this.worker;
		this.currentId = -1;
		return null;
	};
	this.getCurrentType = function() {
		var object = this.getCurrentObject();
		return object ? object.type : null;
	};
	this.getCurrentWorker = function() {
		return this.worker || null;
	};
	this.updateCurrentWorker = function() {
		var id = this.getCurrentId(),
			worker = this.getCurrentWorker();
		if (!worker || id < 0) return;
		this.getAll()[id] = worker.getProject();
	};
	this.switchToWorker = function(worker) {
		this.worker = worker;
	};
	this.getIdByObject = function(obj) {
		var content = this.getAll();
		return content.indexOf(obj);
	};
	this.setCurrentlyId = function(id) {
		this.currentId = new Number(id);
	};
	this.updatePopup = function(name, x, y) {
		// TODO
	};
	
	obj && (this.object = obj);
}

function monthToName(number) {
	var monthes = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return translate(monthes[number < 0 ? 0 : number > 11 ? 11 : number]);
}

function stringifyObject(obj, identate, action, hint, complete) {
	var progress = 0, count = 0, indexated = false, done = false, active = Date.now();
	function recursiveHint() {
		handle(function() {
			if (indexated) showHint((hint || translate("Stringify")) + " (" + Math.floor(progress / count * 100) + "%)");
			else if (!indexated) showHint((hint || translate("Indexating")) + " (" + count + ")");
			else if (!done) showHint(translate("Working"));
			if (!done || progress < count) recursiveHint();
			else if (done) showHint((complete || translate("Done")) + " " + translate("as %s ms", active)),
				hintStackableDenied = state, maximumHints = max;
		}, 50);
	}
	if (showProcesses) {
		var window = UniqueHelper.getWindow("HintAlert"),
			state = hintStackableDenied, max = maximumHints;
		window && window.setStackable(false);
		maximumHints = 0, hintStackableDenied = true;
		recursiveHint();
	}
	function recursiveIndexate(obj) {
		try {
			count++;
			if (obj && typeof obj == "object")
				for (var i in obj)
					recursiveIndexate(obj[i]);
		} catch(e) {
			count++;
		}
	}
	handleThread(function() {
		try {
			recursiveIndexate(obj), indexated = true;
			var result = stringifyObjectUnsafe(obj, identate, {
				onUpdate: function() {
					progress++;
				},
				onPassed: function(result, type) {
					handle(function() {
						confirm(type, translate("Unknown or unsupported stringify type for:") + " " + result);
					});
				}
			});
			action && result && action(result);
			active = Date.now() - active, done = true;
		} catch(e) {
			reportError(e);
			done = true;
		}
	});
}

function stringifyObjectUnsafe(obj, identate, callback) {
	if (callback == undefined) callback = new Object();
	function recursiveStringify(obj, tabs) {
		callback.onUpdate && callback.onUpdate();
		try {
			if (obj === null) return "null";
			switch (typeof obj) {
				case "undefined":
					return "undefined";
				case "string":
					obj = new java.lang.String(obj);
					obj = obj.replaceAll("\"", "\\\\\"");
					obj = obj.replaceAll("\t", "\\\\t");
					obj = obj.replaceAll("\n", "\\\\n");
					return "\"" + obj + "\"";
				case "number":
					return "" + preround(obj);
				case "boolean":
					return "" + obj;
				case "object":
					if(typeof obj.length != "undefined") {
						var array = new Array(), tabbed = false;
						for (var i = 0; i < obj.length; i++) {
							var result = recursiveStringify(obj[i], tabs);
							if(result && result.length > 0) {
								if (identate) {
									if (result.indexOf("\n") != -1 || result.length > 48) {
										if (!tabbed) tabbed = true, tabs += "\t";
										array.push(result + (i < obj.length ? "\n" + tabs : ""));
									} else if (i != 0) {
										array.push(" " + result);
									} else array.push(result);
								} else array.push(result);
							}
						}
						return "[" + array.join(",") + "]";
					} else {
						var array = new Array(), tabbed = false, last, count = 0;
						for (var c in obj) last = c, count++;
						for (var i in obj) {
							var result = recursiveStringify(obj[i], tabs);
							if (result && result.length > 0) {
								if (identate) {
									if (result.indexOf("\n") != -1 || result.length > 8) {
										if (!tabbed) tabbed = true, tabs += "\t";
										array.push(i + ": " + result + (i != last ? "\n" + tabs : ""));
									} else if (i != 0) {
										array.push(" " + i + ": " + result);
									} else array.push(result);
								} else array.push("\"" + i + "\":" + result);
							}
						}
						var joined = array.join(",");
						return (identate ? tabbed ? "{\n" + tabs : "{ " : "{") + joined +
							(identate ? tabbed ? tabs.replace("\t", "") + "\n}" : " }" : "}");
					}
				default:
					callback.onPassed && callback.onPassed(obj, typeof obj);
			}
		} catch(e) {
			reportError(e);
		}
	}
	return recursiveStringify(obj, "");
}

function readFile(path, isBytes, action) {
	try {
		handleThread(function() {
			try {
				var file = new java.io.File("" + path);
				if (!file.exists()) return;
				var readed = isBytes ? Files.readBytes(file) : Files.read(file);
				action && action(readed);
			} catch(e) {
				reportError(e);
			}
		});
	} catch(e) {
		reportError(e);
	}
}

function compileToProduce(string) {
	try {
		Encyption.updateKey("nernar", "editorProject");
		return Encyption.encryptString("" + string);
	} catch(e) {
		__code__.startsWith("develop") && reportError(e);
		return e.name + "\n" + e.stack;
	}
	return null;
}

function exportProject(object, isAutosave, path, action) {
	try {
		stringifyObject(object, false, function(result) {
			var file = new java.io.File("" + path);
			result = compileToProduce(result);
			file.getParentFile().mkdirs();
			if (!isAutosave && file.exists()) {
				handle(function() {
					confirm(translate("File is exists"),
						translate("File is already created. This process will be rewrite it. Continue?"),
						function() {
							Files.writeBytes(file, result);
							action && action(result);
						});
				});
			} else {
				Files.writeBytes(file, result);
				action && action(result);
			}
		}, isAutosave ? translate("Autosaving") : translate("Exporting"),
			isAutosave ? translate("Autosaved") : translate("Exported"));
	} catch(e) {
		reportError(e);
	}
}

function decompileFromProduce(bytes) {
	try {
		Encyption.updateKey("nernar", "editorProject");
		return "" + Encyption.decryptAsString(bytes);
	} catch(e) {
		__code__.startsWith("develop") && reportError(e);
		return e.name + "\n" + e.stack;
	}
	return null;
}

function importProject(path, action) {
	try {
		readFile(path, true, function(bytes) {
			var result = decompileFromProduce(bytes),
				data = compileData(result, "object");
			if (data && !(data instanceof Error))
				typeof data.length != "undefined" ?
					action(data) : action([data]);
			else handle(function() {
				confirm(translate("Can't open file"),
					translate("Looks like, project is damaged. Check project and following exception information:") +
						"\n" + (data ? data.name + ": " + data.message : translate("Empty project")) + "\n\n" +
						translate("Do you want to retry?"), function() { importProject(path, action); });
			});
		});
	} catch(e) {
		reportError(e);
	}
}

var ProjectEditor = {
	create: function() {
		var opened = this.opened = new Project();
		return (opened.time = Date.now(), opened);
	},
	addWorker: function(worker) {
		this.setupEditor(this.opened.object.push
			(worker.getProject()) - 1, worker);
		return worker;
	},
	addBlock: function() {
		var worker = new BlockWorker();
		return this.addWorker(worker);
	},
	addEntity: function() {
		var worker = new EntityWorker();
		return this.addWorker(worker);
	},
	addTransition: function() {
		var worker = new TransitionWorker();
		return this.addWorker(worker);
	},
	getProject: function() {
		return this.opened;
	},
	getEditorById: function(index) {
		var project = this.getProject();
		if (!project) return null;
		var obj = project.getAll();
		return obj[index] || null;
	},
	isInitialized: function() {
		return !!this.getProject();
	},
	isOpened: function() {
		var project = this.getProject();
		if(!project) return false;
		return project.isOpened;
	},
	getCount: function() {
		var project = this.getProject();
		if (!project) return 0;
		return project.getCount();
	},
	setOpenedState: function(state) {
		var project = this.getProject();
		if (!project) return;
		project.isOpened = !!state;
	},
	getCurrentType: function() {
		var project = this.getProject();
		if (!project || !project.isOpened)
			return "none";
		return project.getCurrentType();
	},
	initializeAutosave: function() {
		var scope = this, project = this.getProject();
		if (!autosave || this.thread) {
			project.updateCurrentWorker();
			return;
		}
		scope.thread = handleThread(function() {
			do {
				(!project.isAutosaving) && project.callAutosave();
				Ui.sleepMilliseconds(autosavePeriod * 1000);
			} while (project.isOpened);
			delete scope.thread;
		});
	},
	indexOf: function(obj) {
		var project = this.getProject();
		if (!project) return -1;
		return project.getAll().indexOf(obj);
	},
	setupEditor: function(id, worker) {
		var project = this.getProject();
		if (!project) return;
		project.switchToWorker(worker);
		project.setCurrentlyId(id);
	},
	popEditor: function() {
		var project = this.getProject();
		if (!project) return;
		project.getAll().pop();
		delete project.worker;
	}
};

function compileScript(text) {
	var code = "(function() {\n" + text + "\nreturn __data__;\n})();",
		scope = runAtScope(code, getScriptScope(), "Dev Editor$import.js");
	noImportedScripts = false, __config__.set("user_login.imported_script", true);
	return scope.error ? (reportError(scope.error), null) : scope.result;
}

function getScriptScope() {
	var __data__ = [];
	var Callback = {
		addCallback: function(name, func) {}
	};
	var BlockID = {};
	var IDRegistry = {
		fromString: function(id) {
			return BlockID[id] || -1;
		},
		genBlockID: function(name) {
			var nid = (BlockID[name] = __data__.length);
			__data__[nid] = {
				type: "block",
				define: {
					id: name
				},
				renderer: new Array(),
				collision: new Array()
			};
			return nid;
		}
	};
	var Block = {
		createBlock: function(id, data, special) {
			var nid = IDRegistry.fromString(id);
			if (!nid) return;
			data && (__data__[nid].define.data = data);
			special && (__data__[nid].define.special = special);
		},
		createSpecialType: function(params) {
			return params;
		},
		setShape: function(id, x1, y1, z1, x2, y2, z2) {
			__data__[id].collision.push({
				boxes: [{
					x1: x1, y1: y1, z1: z1,
					x2: x2, y2: y2, z2: z2
				}]
			});
		},
		setBlockShape: function(id, pos1, pos2) {
			__data__[id].collision.push({
				boxes: [{
					x1: pos1.x, y1: pos1.y, z1: pos1.z,
					x2: pos2.x, y2: pos2.y, z2: pos2.z
				}]
			});
		}
	};
	var ICRender = {
		Model: function() {
			this.renderer = [];
			this.addEntry = function(model) {
				model && this.renderer.push({
					boxes: model.boxes
				});
			};
		}
	};
	var BlockRenderer = {
		Model: function() {
			this.boxes = [];
			this.addBox = function(x1, y1, z1, x2, y2, z2, texture, data) {
				this.boxes.push({
					x1: x1, y1: y1, z1: z1,
					x2: x2, y2: y2, z2: z2,
					texture: texture, data: data
				});
			};
		},
		createModel: function() {
			return new this.Model();
		},
		setStaticICRender: function(id, meta, render) {
			if (!(id >= 0)) __data__.push({
				type: "block",
				define: {
					id: "invalidIdentifier"
				},
				renderer: render.renderer,
				collision: new Array()
			});
			else __data__[id].renderer = render.renderer;
		},
		enableCoordMapping: function(id, meta, render) {
			this.setStaticICRender(id, meta, render);
		}
	};
	var Transition = function(obj) {
		this.__data__ = (__data__[__data__.length] = {
			type: "transition",
			define: {
				starting: new Object()
			},
			animation: [{
				frames: new Array()
			}]
		});
		this.__compareVectorPoint = function(index, request) {};
		this.addFrame = function(x, y, z, yaw, pitch, duration, interpolator) {
			var index = this.__data__.animation[0].frames.push({
				x: x, y: y, z: z,
				yaw: yaw, pitch: pitch,
				duration: duration || 1 / (this.__data__.define.fps || 60)
			}) - 1;
			if (typeof interpolator != "undefined")
				this.__data__.animation[0].frames[index].interpolator = interpolator;
		};
		this.addPoint = function(x, y, z, yaw, pitch) {};
		this.getRelativePoint = function() {};
		this.setPoint = function(x, y, z, yaw, pitch) {};
		this.setFramesPerSecond = function(limit) {
			this.__data__.define.fps = limit;
		};
		this.start = function() {};
		this.stop = function() {};
		this.isStarted = function() {};
		this.withFrom = function(x, y, z, yaw, pitch) {
			this.__data__.define.starting = {
				x: x, y: y, z: z,
				yaw: yaw, pitch: pitch
			};
		};
		this.withEntity = function(entity) {
			this.__data__.define.entity = entity;
		};
		this.withOnStartListener = function(listener) {};
		this.withOnFrameListener = function(listener) {};
		this.withOnFinishListener = function(listener) {};
		this.withFrames = function(frames) {
			for (var i = 0; i < frames.length; i++)
				this.addFrame(frames[i].x, frames[i].y, frames[i].z,
					frames[i].yaw, frames[i].pitch,
					frames[i].duration, frames[i].vector);
		};
		if (obj) {
			typeof obj == "object" && this.withFrames(obj);
			typeof obj == "number" && this.withEntity(obj);
		}
	};
	Transition.Interpolator = {
		LINEAR: 0,
		ACCELERATE: 1,
		DECELERATE: 2,
		ACCELERATE_DECELERATE: 3
	};
	return {
		__data__: __data__,
		Callback: Callback,
		BlockID: BlockID,
		IDRegistry: IDRegistry,
		Block: Block,
		ICRender: ICRender,
		BlockRenderer: BlockRenderer,
		Transition: Transition
	};
}
