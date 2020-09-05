function EntityWorker(obj) {
	var worker = this;
	this.getProject = function() {
		return {
			type: "entity",
			define: this.Define.getParams(),
			visual: this.Visual.getParams()
		};
	};
	this.loadProject = function(obj) {
		obj.define && this.Define.setParams(obj.define);
		obj.visual && this.Visual.setParams(obj.visual);
	};
	this.Define = {
		params: {
			id: "customEntity",
			entities: new Array()
		},
		addEntity: function(entity) {
			var entities = this.getEntities(),
				index = this.getEntityIndex(entity);
			if (index == -1) entities.push(entity);
			else entities.splice(index, 1);
			return index == -1;
		},
		getParams: function() {
			return this.params;
		},
		getParamCount: function() {
			return this.getParams().length;
		},
		getEntities: function() {
			return this.getParams().entities;
		},
		getEntityIndex: function(entity) {
			return this.getEntities().indexOf(entity);
		},
		getIdentificator: function() {
			return this.getParams().id;
		},
		setParams: function(params) {
			for (var name in params) this.params[name] = params[name];
		},
		setIdentificator: function(id) {
			this.getParams().id = id;
		}
	};
	this.Event = {
		// TODO
	};
	this.Description = {
		// TODO
	};
	this.Visual = {
		models: [],
		createModel: function() {
			var models = this.getModels();
			models.push(new this.Model());
			return models.length - 1;
		},
		removeModel: function(index) {
			var models = this.getModels();
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
		getParams: function() {
			var params = [];
			for (var i = 0; i < this.getModelCount(); i++) {
				var model = this.getModel(i);
				var editable = model.params;
				editable.assigment = model.getAssigment();
				params.push(editable);
			}
			return params;
		},
		setParams: function(params) {
			for (var i = 0; i < params.length; i++) {
				var model = this.createModel();
				var editable = this.getModel(model);
				editable.setAssigment(params[i].assigment);
				delete params[i].assigment;
				editable.params = params[i];
			}
		},
		Model: function() {
			var model = this;
			this.assigment = new Array();
			this.params = {
				texture: "entity/steve.png"
			};
			
			this.getTexture = function() {
				return this.params.texture;
			};
			this.getEditable = function() {
				return this.assigment;
			};
			this.getAssigment = function(obj) {
				if (!obj) obj = this;
				var result = [];
				var assigment = obj.assigment;
				for (var name in assigment) {
					var element = assigment[name];
					var params = element.getParams();
					if (element instanceof this.Bone) {
						params.children = this.getAssigment(element);
						params.type = "bone";
					} else if (element instanceof this.Box)
						params.type = "box";
					else continue;
					result.push(params);
				}
				return result;
			};
			this.setTexture = function(path) {
				this.params.texture = path;
			};
			this.setAssigment = function(assigment, obj) {
				if (!obj) obj = this;
				obj.assigment = [];
				for (var name in assigment) {
					var element = assigment[name];
					if (element.type == "bone") {
						var bone = new this.Bone(element);
						bone.setAssigment(element.children);
						delete element.children;
						bone.setParent(obj);
						obj.assigment.push(bone);
					} else if (element.type == "box") {
						var box = new this.Box(element);
						box.setParent(obj);
						obj.assigment.push(box);
					}
				}
			};
			this.Bone = function(obj) {
				this.assigment = new Array();
				this.params = {
					name: "bone"
				};
				
				// Bone properties
				this.getParams = function() {
					return this.params;
				};
				this.getParent = function() {
					return this.params.parent;
				};
				this.getName = function() {
					return this.params.name;
				};
				this.getEditable = function() {
					return this.assigment;
				};
				this.getAssigment = function() {
					return model.getAssigment(this);
				};
				this.setParams = function(params) {
					for (var name in params) this.params[name] = params[name];
				};
				this.setParent = function(parent) {
					this.params.parent = parent;
				};
				this.setName = function(name) {
					this.params.name = name;
				};
				this.setAssigment = function(assigment) {
					model.setAssigment(assigment, this);
				};
				
				// Assigment properties
				this.getBones = function() {
					var bones = new Array();
					var editable = this.getEditable();
					for (var name in editable) {
						var element = editable[name];
						if (element instanceof model.Bone)
							bones.push(element);
					}
					return bones;
				};
				this.getBone = function(index) {
					var bones = this.getBones();
					return bones[index] || null;
				};
				this.getBoneCount = function() {
					return this.getBones().length;
				};
				this.getBoxes = function() {
					var boxes = new Array();
					var editable = this.getEditable();
					for (var name in editable) {
						var element = editable[name];
						if (element instanceof model.Box)
							boxes.push(element);
					}
					return boxes;
				};
				this.getBox = function(index) {
					var boxes = this.getBoxes();
					return boxes[index] || null;
				};
				this.getBoxCount = function() {
					return this.getBoxes().length;
				};
				
				// Assigment manage
				this.addBox = function() {
					var box = new model.Box();
					var editable = this.getEditable();
					return editable.push(box) - 1;
				};
				this.addBone = function() {
					model.addBone(this);
				};
				this.cloneBox = function(index) {
					var editable = this.getEditable();
					return editable[index].clone();
				};
				this.removeBox = function(index) {
					var editable = this.getEditable();
					editable[index].remove();
				};
				this.removeBone = function(index) {
					model.removeBone(this, index);
				};
				
				// Bone manage
				this.prepareRotation = function() {
					if (!this.params.rotation)
						this.params.rotation = [0, 0, 0];
					return this.params.rotation;
				};
				this.rotate = function(axis, value) {
					axis == "x" && (axis = 0);
					axis == "y" && (axis = 1);
					axis == "z" && (axis = 2);
					var rotate = this.prepareRotation();
					axis >= 0 && (rotate[axis] = value);
				};
				this.getRotation = function() {
					var rotate = this.prepareRotation();
					return {
						x: rotate[0],
						y: rotate[1],
						z: rotate[2]
					};
				};
				this.prepareOffset = function() {
					if (!this.params.offset)
						this.params.offset = [0, 0, 0];
					return this.params.offset;
				};
				this.offset = function(axis, value) {
					axis == "x" && (axis = 0);
					axis == "y" && (axis = 1);
					axis == "z" && (axis = 2);
					var offset = this.prepareOffset();
					axis >= 0 && (offset[axis] = value);
				};
				this.getOffset = function() {
					var offset = this.prepareOffset();
					return {
						x: offset[0],
						y: offset[1],
						z: offset[2]
					};
				};
				
				obj && this.setParams(obj);
			};
			this.Box = function(obj) {
				this.params = {
					x: 0, y: 0, z: 0,
					width: 1, height: 1, length: 1
				};
				
				// Get params and sizes
				this.getParams = function() {
					return this.params;
				};
				this.getParent = function() {
					return this.params.parent;
				};
				this.getSize = function() {
					var params = this.params;
					return {
						x: params.width,
						y: params.height,
						z: params.length
					};
				};
				this.getRadius = function() {
					var size = this.getSize();
					return {
						x: size.x / 2,
						y: size.y / 2,
						z: size.z / 2
					};
				};
				this.getCoords = function() {
					var radius = this.getRadius(),
						params = this.getParams();
					return {
						x1: params.x - radius.x,
						x2: params.x + radius.x,
						y1: params.y - radius.y,
						y2: params.y + radius.y,
						z1: params.z - radius.z,
						z2: params.z + radius.z
					};
				};
				this.setParams = function(params) {
					for (var name in params) this.params[name] = params[name];
				};
				this.setParent = function(parent) {
					this.params.parent = parent;
				};
				this.setCoords = function(coords) {
					this.params.width = coords.x2 - coords.x1;
					this.params.height = coords.y2 - coords.y1;
					this.params.length = coords.z2 - coords.z1;
					this.params.x = coords.x1 + (this.params.width / 2);
					this.params.y = coords.y1 + (this.params.height / 2);
					this.params.z = coords.z1 + (this.params.length / 2);
				};
				
				// Assigment edit
				this.clone = function() {
					var parent = this.params.parent;
					if (!parent) return -1;
					var tree = parent.getEditable();
					tree.push(new model.Box(this.params));
					return tree.length - 1;
				};
				this.remove = function() {
					var parent = this.params.parent;
					if (!parent) return;
					var tree = parent.getEditable();
					var index = tree.indexOf(this);
					tree.splice(index, 1);
				};
				
				// Base manipulate
				this.resize = function(axis) {
					axis == "x" && (axis = "width");
					axis == "y" && (axis = "height");
					axis == "z" && (axis = "length");
					axis && (this.params[axis] = value);
				};
				this.scretch = function(axis, value) {
					var coords = this.getCoords();
					axis && (coords[axis] = value);
					this.setCoords(coords);
				};
				this.scale = function(axis, value) {
					axis && (this.params[axis] = value);
				};
				this.move = function(axis, value) {
					if (!axis) return;
					var coords = this.getCoords(),
						size = this.getSize();
					coords[axis + "1"] = value;
					coords[axis + "2"] = value + size[axis];
					this.setCoords(coords);
				};
				this.prepareVertex = function() {
					if (!this.params.uv)
						this.params.uv = [0, 0];
					return this.params.uv;
				};
				this.vertex = function(axis, value) {
					axis == "x" && (axis = 0);
					axis == "y" && (axis = 1);
					axis == "u" && (axis = 0);
					axis == "v" && (axis = 1);
					var vertex = this.prepareVertex();
					axis >= 0 && (vertex[axis] = value);
				};
				this.getVertex = function() {
					var vertex = this.prepareVertex();
					return {
						x: vertex[0],
						y: vertex[1]
					};
				};
				
				// Mirror and rotate
				this.mirror = function(orientate) {
					var coords = this.getCoords();
					if (orientate == 0) {
						var x1 = coords.x1, x2 = coords.x2;
						coords.x2 = 2 * coords.x2 - x1;
						coords.x1 = 2 * coords.x2 - x2;
					} else if (orientate == 1) {
						var y1 = coords.y1, y2 = coords.y2;
						coords.y2 = 2 * coords.y2 - y1;
						coords.y1 = 2 * coords.y2 - y2;
					} else if (orientate == 2) {
						var z1 = coords.z1, z2 = coords.z2;
						coords.z2 = 2 * coords.z2 - z1;
						coords.z1 = 2 * coords.z2 - z2;
					}
					this.setCoords(coords);
				};
				this.rotate = function(orientate, angle) {
					var coords = this.getCoords();
					if (angle == 0) {
						if (orientate == 0) {
							var tech = coords.y1;
							coords.y1 = coords.z1;
							coords.z1 = tech;
							tech = coords.y2;
							coords.y2 = coords.y2;
							coords.z2 = tech;
							this.mirror(1);
							this.mirror(2);
						} else if (orientate == 1) {
							var tech = coords.x1;
							coords.x1 = coords.z1;
							coords.z1 = tech;
							tech = coords.x2;
							coords.x2 = coords.z2;
							coords.z2 = tech;
							this.mirror(0);
							this.mirror(2);
						} else if (orientate == 2) {
							var tech = coords.x1;
							coords.x1 = coords.y1;
							coords.y1 = tech;
							tech = coords.x2;
							coords.x2 = coords.y2;
							coords.y2 = tech;
							this.mirror(0);
							this.mirror(1);
						}
					} else if (angle == 1) {
						if (orientate == 0) {
							this.mirror(1);
							this.mirror(2);
						} else if (orientate == 1) {
							this.mirror(0);
							this.mirror(2);
						} else if (orientate == 2) {
							this.mirror(0);
							this.mirror(1);
						}
					} else if (angle == 2) {
						if (orientate == 0) {
							var tech = coords.y1;
							coords.y1 =- coords.z1;
							coords.z1 =- tech;
							tech = coords.y2;
							coords.y2 =- coords.z2;
							coords.z2 =- tech;
							coords.y1 += coords.y1;
							coords.y2 += coords.y1;
							coords.z1 += coords.z1;
							coords.z2 += coords.z1;
						} else if (orientate == 1) {
							var tech = coords.x1;
							coords.x1 =- coords.z1;
							coords.z1 =- tech;
							tech = coords.x2;
							coords.x2 =- coords.z2;
							coords.z2 =- tech;
							coords.x1 += coords.x1;
							coords.x2 += coords.x1;
							coords.z1 += coords.z1;
							coords.z2 += coords.z1;
						} else if (orientate == 2) {
							var tech = coords.x1;
							coords.x1 =- coords.y1;
							coords.y1 =- tech;
							tech = coords.x2;
							coords.x2 =- coords.y2;
							coords.y2 =- tech;
							coords.x1 += coords.x1;
							coords.x2 += coords.x1;
							coords.y1 += coords.y1;
							coords.y2 += coords.y1;
						}
					}
					this.setCoords(coords);
				};
				
				obj && this.setParams(obj);
			};
			
			// Assigment manage
			this.addBone = function(obj) {
				if (!obj) obj = this;
				var bone = new this.Bone();
				var editable = obj.getEditable();
				return editable.push(bone) - 1;
			};
			this.cloneAssigment = function(index, obj) {
				if (!obj) obj = this;
				var tree = obj.getEditable();
				var children = tree[index];
				if (children instanceof this.Box) obj.clone();
				else if(children instanceof this.Bone) {
					var place = tree.push(new model.Bone(children.params)) - 1;
					tree[place].setAssigment(children.getAssigment());
				}
				return tree.length - 1;
			};
			this.getAssigmentSize = function() {
				return this.getEditable().length;
			};
			this.getIndex = function(index) {
				return this.getEditable()[index];
			};
			this.getName = function(index) {
				var assigment = this.getIndex(index);
				if (assigment instanceof this.Bone)
					return assigment.getName();
				return translate("Non-assigment");
			};
			this.removeAssigment = function(index, obj) {
				if (!obj) obj = this;
				var tree = obj.getEditable();
				tree.splice(index, 1);
			};
		}
	};
	this.AI = {
		// TODO
	};
	obj && this.loadProject(obj);
}
