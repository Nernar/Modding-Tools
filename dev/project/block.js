function BlockWorker(obj) {
	let worker = this;
	this.getProject = function() {
		return {
			type: "block",
			define: this.Define.getParams(),
			renderer: this.Renderer.getParams(),
			collision: this.Collision.getParams()
		};
	};
	this.loadProject = function(obj) {
		if (obj.define) {
			this.Define.setParams(obj.define);
		}
		if (obj.renderer) {
			this.Renderer.setParams(obj.renderer);
		}
		if (obj.collision) {
			this.Collision.setParams(obj.collision);
		}
	};
	this.Define = {
		params: {
			id: "customBlock",
			data: "[{\n\tname: \"Custom Block\",\n\ttexture: [[\"stone\", 0]],\n\tinCreative: true\n}]",
			mapped: new Array()
		},
		addMapping: function(x, y, z) {
			let mapped = this.getMapped(),
				index = this.getMapAtCoords(x, y, z);
			if (index == -1) {
				mapped.push({ x: x, y: y, z: z });
			} else {
				mapped.splice(index, 1);
			}
			return index == -1;
		},
		getParams: function() {
			return this.params;
		},
		getParamCount: function() {
			return this.getParams().length;
		},
		getMapped: function() {
			return this.getParams().mapped;
		},
		getMapAtCoords: function(x, y, z) {
			let mapped = this.getMapped();
			for (let i = 0; i < mapped.length; i++) {
				if (mapped[i].x == x && mapped[i].y == y && mapped[i].z == z) {
					return i;
				}
			}
			return -1;
		},
		getIdentificator: function() {
			return this.getParams().id;
		},
		getDefineData: function() {
			return this.getParams().data;
		},
		getSpecialType: function() {
			return this.getParams().special;
		},
		setParams: function(params) {
			for (let name in params) {
				this.params[name] = params[name];
			}
		},
		setIdentificator: function(id) {
			this.getParams().id = id;
		},
		setDefineData: function(data) {
			this.getParams().data = data;
		},
		setSpecialType: function(type) {
			this.getParams().special = type;
		}
	};
	this.Renderer = {
		models: new Array(),
		createModel: function() {
			let models = this.getModels();
			models.push(new this.Model());
			return models.length - 1;
		},
		removeModel: function(index) {
			let models = this.getModels();
			models.splice(index, 1);
		},
		getModel: function(index) {
			return this.getModels()[index];
		},
		getModels: function() {
			return this.models;
		},
		getModelCount: function() {
			return this.getModels().length;
		},
		getBoxCount: function() {
			let count = 0;
			for (let i = 0; i < this.getModelCount(); i++) {
				count += this.getModel(i).getBoxCount();
			}
			return count;
		},
		getParams: function() {
			let params = [];
			for (let i = 0; i < this.getModelCount(); i++) {
				params.push(this.getModel(i).params);
			}
			return params;
		},
		setParams: function(params) {
			this.models = new Array();
			for (let i = 0; i < params.length; i++) {
				let model = this.createModel();
				this.getModel(model).params = params[i];
			}
		},
		Model: function() {
			this.params = {
				boxes: new Array()
			};
			
			// Create and removing
			this.addBox = function(id, data) {
				let boxes = this.getBoxes();
				boxes.push({
					x1: 0, y1: 0, z1: 0,
					x2: 0.0625, y2: 0.0625, z2: 0.0625,
					texture: [[id, data]]
				});
				return boxes.length - 1;
			};
			this.cloneBox = function(index) {
				let boxes = this.getBoxes();
				boxes.push(assign(boxes[index]));
				return boxes.length - 1;
			};
			this.removeBox = function(index) {
				let boxes = this.getBoxes();
				boxes.splice(index, 1);
			};
			
			// Get params and sizes
			this.getBox = function(index) {
				return this.getBoxes()[index];
			};
			this.getBoxes = function() {
				return this.params.boxes;
			};
			this.getBoxCount = function() {
				return this.getBoxes().length;
			};
			this.getBoxSize = function(index) {
				let box = this.getBox(index);
				return {
					x: box.x2 - box.x1,
					y: box.y2 - box.y1,
					z: box.z2 - box.z1
				};
			};
			
			// Scretch and texture
			this.scretchBox = function(index, axis, value) {
				let box = this.getBox(index);
				if (axis) {
					box[axis] = value;
				}
			};
			this.moveBox = function(index, axis, value) {
				let size = this.getBoxSize(index);
				this.scretchBox(index, axis + 1, value);
				this.scretchBox(index, axis + 2, size[axis] + value);
			};
			this.textureBox = function(index, texture, data) {
				let box = this.getBox(index);
				box.texture = typeof texture == "object" ? texture : [[texture, data]];
			};
			this.textureBoxSide = function(index, side, texture, data) {
				let box = this.getBox(index);
				box.texture[side] = [texture, data];
			};
			
			// Mirror and rotate
			this.prepareOffset = function(offset) {
				if (!offset) {
					offset = new Object();
				}
				if (offset.x == undefined) {
					offset.x = 0;
				}
				if (offset.y == undefined) {
					offset.y = 0;
				}
				if (offset.z == undefined) {
					offset.z = 0;
				}
				return offset;
			};
			this.validateOrientate = function(orientate) {
				if (orientate == 0) {
					return "x";
				}
				if (orientate == 1) {
					return "y";
				}
				if (orientate == 2) {
					return "z";
				}
				let index = ["x", "y", "z"].indexOf(orientate);
				return index != -1 ? orientate : "x";
			};
			this.mirrorBoxTexture = function(index, orientate, side) {
				throw new Error("Box textures mirroring not implemented yet");
			};
			this.mirrorBox = function(index, orientate, side, offset) {
				let box = this.getBox(index);
				if (orientate == undefined) {
					return;
				}
				orientate = this.validateOrientate(orientate);
				if (side == undefined) {
					side = 0;
				}
				if (offset == undefined) {
					offset = 0;
				}
				let size = box[orientate + "2"] - box[orientate + "1"];
				if (side == 0) {
					box[orientate + "1"] += offset + size;
					box[orientate + "2"] += offset + size;
				} else if (side == 1) {
					box[orientate + "1"] -= offset + size;
					box[orientate + "2"] -= offset + size;
				}
			};
			this.mirrorBoxAtX = function(index, side, offset) {
				this.mirrorBox(index, "x", side, offset);
			};
			this.mirrorBoxAtY = function(index, side, offset) {
				this.mirrorBox(index, "y", side, offset);
			};
			this.mirrorBoxAtZ = function(index, side, offset) {
				this.mirrorBox(index, "z", side, offset);
			};
			// this.mirrorBox = function(index, orientate, offset) {
				// let box = this.getBox(index),
					// offset = this.prepareOffset(offset);
				// if (orientate == 0) {
					// let x1 = box.x1, x2 = box.x2;
					// box.x2 = 2 * box.x2 - x1;
					// box.x1 = 2 * box.x2 - x2;
				// } else if (orientate == 1) {
					// let y1 = box.y1, y2 = box.y2;
					// box.y2 = 2 * box.y2 - y1;
					// box.y1 = 2 * box.y2 - y2;
				// } else if (orientate == 2) {
					// let z1 = box.z1, z2 = box.z2;
					// box.z2 = 2 * box.z2 - z1;
					// box.z1 = 2 * box.z2 - z2;
				// }
			// };
			
			// this.rotateBox = function(index, orientate, angle) {
				// let box = this.getBox(index);
				// if (angle == 0) {
					// if (orientate == 0) {
						// let tech = box.y1;
						// box.y1 = box.z1;
						// box.z1 = tech;
						// tech = box.y2;
						// box.y2 = box.y2;
						// box.z2 = tech;
						// this.mirrorBox(index, 1);
						// this.mirrorBox(index, 2);
					// } else if (orientate == 1) {
						// let tech = box.x1;
						// box.x1 = box.z1;
						// box.z1 = tech;
						// tech = box.x2;
						// box.x2 = box.z2;
						// box.z2 = tech;
						// this.mirrorBox(index, 0);
						// this.mirrorBox(index, 2);
					// } else if (orientate == 2) {
						// let tech = box.x1;
						// box.x1 = box.y1;
						// box.y1 = tech;
						// tech = box.x2;
						// box.x2 = box.y2;
						// box.y2 = tech;
						// this.mirrorBox(index, 0);
						// this.mirrorBox(index, 1);
					// }
				// } else if (angle == 1) {
					// if (orientate == 0) {
						// this.mirrorBox(index, 1);
						// this.mirrorBox(index, 2);
					// } else if (orientate == 1) {
						// this.mirrorBox(index, 0);
						// this.mirrorBox(index, 2);
					// } else if (orientate == 2) {
						// this.mirrorBox(index, 0);
						// this.mirrorBox(index, 1);
					// }
				// } else if (angle == 2) {
					// if (orientate == 0) {
						// let tech = box.y1;
						// box.y1 =- box.z1;
						// box.z1 =- tech;
						// tech = box.y2;
						// box.y2 =- box.z2;
						// box.z2 =- tech;
						// box.y1 += box.y1;
						// box.y2 += box.y1;
						// box.z1 += box.z1;
						// box.z2 += box.z1;
					// } else if (orientate == 1) {
						// let tech = box.x1;
						// box.x1 =- box.z1;
						// box.z1 =- tech;
						// tech = box.x2;
						// box.x2 =- box.z2;
						// box.z2 =- tech;
						// box.x1 += box.x1;
						// box.x2 += box.x1;
						// box.z1 += box.z1;
						// box.z2 += box.z1;
					// } else if (orientate == 2) {
						// let tech = box.x1;
						// box.x1 =- box.y1;
						// box.y1 =- tech;
						// tech = box.x2;
						// box.x2 =- box.y2;
						// box.y2 =- tech;
						// box.x1 += box.x1;
						// box.x2 += box.x1;
						// box.y1 += box.y1;
						// box.y2 += box.y1;
					// }
				// }
			// };
			
			// Innersection
			this.checkBoxesInnersection = function(index1, index2) {
				let box1 = this.getBox(index1), box2 = this.getBox(index2);
				if (box1.x1 < box2.x2 && box1.x2 > box2.x1 || box1.x1 > box2.x1 && box1.x2 < box2.x2) {
					if (box1.y1 < box2.y2 && box1.y2 > box2.y1 || box1.y1 > box2.y1 && box1.y2 < box2.y2) {
						if (box1.z1 < box2.z2 && box2.z1 > box2.z1 || box1.z1 > box2.z1 && box1.z2 < box2.z2) {
							return true;
						}
					}
				}
				return false;
			};
			this.checkBoxInnersection = function(index) {
				let box = this.getBox(index), approved = new Array();
				for (let i = 0; i < this.getBoxCount(); i++) {
					if (i != index && this.checkBoxesInnersection(index, i)) {
						approved.push(i);
					}
				}
				return approved;
			};
			this.hasBoxInnersection = function(index) {
				let result = this.checkBoxInnersection(index);
				return result.length > 0;
			};
			this.checkInnersection = function() {
				let result = new Object();
				for (let i = 0; i < this.getBoxCount(); i++) {
					let approved = this.checkBoxInnersection(i);
					if (approved.length > 0) {
						result[i] = approved;
					}
				}
				return result;
			};
			this.hasInnersection = function() {
				let result = this.checkInnersection();
				for (let i in result) {
					return true;
				}
				return false;
			};
			
			// Model actions
			this.moveModel = function(axis, value) {
				for (let i = 0; i < this.getBoxCount(); i++) {
					this.moveBox(i, axis, this.getBox(i)[axis + 1] + value);
				}
			};
			this.textureModel = function(texture, data) {
				for (let i = 0; i < this.getBoxCount(); i++) {
					this.textureBox(i, texture, data);
				}
			};
			this.textureModelSide = function(side, texture, data) {
				for (let i = 0; i < this.getBoxCount(); i++) {
					this.textureBoxSide(i, side, texture, data);
				}
			};
			this.mirrorModel = function(orientate) {
				for (let i = 0; i < this.getBoxCount(); i++) {
					this.mirrorBox(i, orientate);
				}
			};
			this.rotateModel = function(orientate, angle) {
				for (let i = 0; i < this.getBoxCount(); i++) {
					this.rotateBox(i, orientate, angle);
				}
			};
		}
	};
	this.Collision = {
		models: new Array(),
		createModel: function() {
			let models = this.getModels();
			models.push(new this.Model());
			return models.length - 1;
		},
		removeModel: function(index) {
			let models = this.getModels();
			models.splice(index, 1);
		},
		getModel: function(index) {
			return this.getModels()[index];
		},
		getModels: function() {
			return this.models;
		},
		getModelCount: function() {
			return this.getModels().length;
		},
		getBoxCount: function() {
			let count = 0;
			for (let i = 0; i < this.getModelCount(); i++) {
				count += this.getModel(i).getBoxCount();
			}
			return count;
		},
		getParams: function() {
			let params = [];
			for (let i = 0; i < this.getModelCount(); i++) {
				params.push(this.getModel(i).params);
			}
			return params;
		},
		setParams: function(params) {
			this.models = new Array();
			for (let i = 0; i < params.length; i++) {
				let model = this.createModel();
				this.getModel(model).params = params[i];
			}
		},
		Model: function() {
			this.params = {
				boxes: new Array()
			};
			
			// Create and removing
			this.addBox = function() {
				let boxes = this.getBoxes();
				boxes.push({
					x1: 0, y1: 0, z1: 0,
					x2: 0.0625, y2: 0.0625, z2: 0.0625
				});
				return boxes.length - 1;
			};
			this.cloneBox = function(index) {
				let boxes = this.getBoxes();
				boxes.push(assign(boxes[index]));
				return boxes.length - 1;
			};
			this.removeBox = function(index) {
				let boxes = this.getBoxes();
				boxes.splice(index, 1);
			};
			
			// Get params and sizes
			this.getBox = function(index) {
				return this.getBoxes()[index];
			};
			this.getBoxes = function() {
				return this.params.boxes;
			};
			this.getBoxCount = function() {
				return this.getBoxes().length;
			};
			this.getBoxSize = function(index) {
				let box = this.getBox(index);
				return {
					x: box.x2 - box.x1,
					y: box.y2 - box.y1,
					z: box.z2 - box.z1
				};
			};
			
			// Scretch
			this.scretchBox = function(index, axis, value) {
				let box = this.getBox(index);
				if (axis) {
					box[axis] = value;
				}
			};
			this.moveBox = function(index, axis, value) {
				let size = this.getBoxSize(index);
				this.scretchBox(index, axis + 1, value);
				this.scretchBox(index, axis + 2, size[axis] + value);
			};
			
			
			// Mirror and rotate
			this.prepareOffset = function(offset) {
				if (!offset) {
					offset = new Object();
				}
				if (offset.x == undefined) {
					offset.x = 0;
				}
				if (offset.y == undefined) {
					offset.y = 0;
				}
				if (offset.z == undefined) {
					offset.z = 0;
				}
				return offset;
			};
			this.validateOrientate = function(orientate) {
				if (orientate == 0) {
					return "x";
				}
				if (orientate == 1) {
					return "y";
				}
				if (orientate == 2) {
					return "z";
				}
				let index = ["x", "y", "z"].indexOf(orientate);
				return index != -1 ? orientate : "x";
			};
			this.mirrorBox = function(index, orientate, side, offset) {
				let box = this.getBox(index);
				if (orientate == undefined) {
					return;
				}
				orientate = this.validateOrientate(orientate);
				if (side == undefined) {
					side = 0;
				}
				if (offset == undefined) {
					offset = 0;
				}
				let size = box[orientate + "2"] - box[orientate + "1"];
				if (side == 0) {
					box[orientate + "1"] += offset + size;
					box[orientate + "2"] += offset + size;
				} else if (side == 1) {
					box[orientate + "1"] -= offset + size;
					box[orientate + "2"] -= offset + size;
				}
			};
			this.mirrorBoxAtX = function(index, side, offset) {
				this.mirrorBox(index, "x", side, offset);
			};
			this.mirrorBoxAtY = function(index, side, offset) {
				this.mirrorBox(index, "y", side, offset);
			};
			this.mirrorBoxAtZ = function(index, side, offset) {
				this.mirrorBox(index, "z", side, offset);
			};
			// this.mirrorBox = function(index, orientate, offset) {
				// let box = this.getBox(index),
					// offset = this.prepareOffset(offset);
				// if (orientate == 0) {
					// let x1 = box.x1, x2 = box.x2;
					// box.x2 = 2 * box.x2 - x1;
					// box.x1 = 2 * box.x2 - x2;
				// } else if (orientate == 1) {
					// let y1 = box.y1, y2 = box.y2;
					// box.y2 = 2 * box.y2 - y1;
					// box.y1 = 2 * box.y2 - y2;
				// } else if (orientate == 2) {
					// let z1 = box.z1, z2 = box.z2;
					// box.z2 = 2 * box.z2 - z1;
					// box.z1 = 2 * box.z2 - z2;
				// }
			// };
			
			// this.rotateBox = function(index, orientate, angle) {
				// let box = this.getBox(index);
				// if (angle == 0) {
					// if (orientate == 0) {
						// let tech = box.y1;
						// box.y1 = box.z1;
						// box.z1 = tech;
						// tech = box.y2;
						// box.y2 = box.y2;
						// box.z2 = tech;
						// this.mirrorBox(index, 1);
						// this.mirrorBox(index, 2);
					// } else if (orientate == 1) {
						// let tech = box.x1;
						// box.x1 = box.z1;
						// box.z1 = tech;
						// tech = box.x2;
						// box.x2 = box.z2;
						// box.z2 = tech;
						// this.mirrorBox(index, 0);
						// this.mirrorBox(index, 2);
					// } else if (orientate == 2) {
						// let tech = box.x1;
						// box.x1 = box.y1;
						// box.y1 = tech;
						// tech = box.x2;
						// box.x2 = box.y2;
						// box.y2 = tech;
						// this.mirrorBox(index, 0);
						// this.mirrorBox(index, 1);
					// }
				// } else if (angle == 1) {
					// if (orientate == 0) {
						// this.mirrorBox(index, 1);
						// this.mirrorBox(index, 2);
					// } else if (orientate == 1) {
						// this.mirrorBox(index, 0);
						// this.mirrorBox(index, 2);
					// } else if (orientate == 2) {
						// this.mirrorBox(index, 0);
						// this.mirrorBox(index, 1);
					// }
				// } else if (angle == 2) {
					// if (orientate == 0) {
						// let tech = box.y1;
						// box.y1 =- box.z1;
						// box.z1 =- tech;
						// tech = box.y2;
						// box.y2 =- box.z2;
						// box.z2 =- tech;
						// box.y1 += box.y1;
						// box.y2 += box.y1;
						// box.z1 += box.z1;
						// box.z2 += box.z1;
					// } else if (orientate == 1) {
						// let tech = box.x1;
						// box.x1 =- box.z1;
						// box.z1 =- tech;
						// tech = box.x2;
						// box.x2 =- box.z2;
						// box.z2 =- tech;
						// box.x1 += box.x1;
						// box.x2 += box.x1;
						// box.z1 += box.z1;
						// box.z2 += box.z1;
					// } else if (orientate == 2) {
						// let tech = box.x1;
						// box.x1 =- box.y1;
						// box.y1 =- tech;
						// tech = box.x2;
						// box.x2 =- box.y2;
						// box.y2 =- tech;
						// box.x1 += box.x1;
						// box.x2 += box.x1;
						// box.y1 += box.y1;
						// box.y2 += box.y1;
					// }
				// }
			// };
			
			// Innersection
			this.checkBoxesInnersection = function(index1, index2) {
				let box1 = this.getBox(index1), box2 = this.getBox(index2);
				if (box1.x1 < box2.x2 && box1.x2 > box2.x1 || box1.x1 > box2.x1 && box1.x2 < box2.x2) {
					if (box1.y1 < box2.y2 && box1.y2 > box2.y1 || box1.y1 > box2.y1 && box1.y2 < box2.y2) {
						if (box1.z1 < box2.z2 && box2.z1 > box2.z1 || box1.z1 > box2.z1 && box1.z2 < box2.z2) {
							return true;
						}
					}
				}
				return false;
			};
			this.checkBoxInnersection = function(index) {
				let box = this.getBox(index), approved = new Array();
				for (let i = 0; i < this.getBoxCount(); i++) {
					if (i != index && this.checkBoxesInnersection(index, i)) {
						approved.push(i);
					}
				}
				return approved;
			};
			this.hasBoxInnersection = function(index) {
				let result = this.checkBoxInnersection(index);
				return result.length > 0;
			};
			this.checkInnersection = function() {
				let result = new Object();
				for (let i = 0; i < this.getBoxCount(); i++) {
					let approved = this.checkBoxInnersection(i);
					if (approved.length > 0) {
						result[i] = approved;
					}
				}
				return result;
			};
			this.hasInnersection = function() {
				let result = this.checkInnersection();
				for (let i in result) {
					return true;
				}
				return false;
			};
			
			// Model actions
			this.moveModel = function(axis, value) {
				for (let i = 0; i < this.getBoxCount(); i++) {
					this.moveBox(i, axis, this.getBox(i)[axis + 1] + value);
				}
			};
			this.mirrorModel = function(orientate) {
				for (let i = 0; i < this.getBoxCount(); i++) {
					this.mirrorBox(i, orientate);
				}
			};
			this.rotateModel = function(orientate, angle) {
				for (let i = 0; i < this.getBoxCount(); i++) {
					this.rotateBox(i, orientate, angle);
				}
			};
		}
	};
	obj && this.loadProject(obj);
}
