function registerCustomEntity() {
	return 0/* MobRegistry.registerEntity("__editorEntity__") */;
}

let TODO = registerCustomEntity();

function updateEntityRender() {
	if (!Level.isLoaded()) return;
	/* let model = eval(model2ToScript(EntityEditor.project));
	let texture = new Texture("mob/bonnie.png");
	model.setTexture(texture);
	TODO.customizeVisual({
		getModels: function() {
			return { "main": model };
		}
	}); */
	autosavePeriod == 0 && ProjectEditor.getProject().callAutosave();
}

function model2ToScript(obj) {
	let script = "";
	script += "let model = new EntityModel();\n";
	script += "let render = new Render();\n";
	for (let i in obj.elements) {
		let part = obj.elements[i], params = {};
		part.offset && (params.offset = part.offset);
		part.rotation && (params.rotation = part.rotation);
		let bones = part.bones.slice();
		script += "render.setPart(\"" + i + "\", " + JSON.stringify(bones, null, "\t") + ", " + JSON.stringify(params, null, "\t") + ");\n";
		// script += "render.getPart(\"" + i + "\").setOffset(" + part.offset.x + ", " + part.offset.y + ", " + part.offset.z + ");\n";
	}
	script += "model.setRender(render);";
	return script;
}

function geometryToModel2(obj) {
	let project = {
		texture: {
			width: obj.texturewidth,
			height: obj.textureheight
		},
		elements: {
			body: {
				bones: []
			},
			head: {
				bones: []
			},
			leftArm: {
				bones: []
			},
			rightArm: {
				bones: []
			},
			leftLeg: {
				bones: []
			},
			rightLeg: {
				bones: []
			}
		}
	};
	let parents = {
		hat: "head"
	};
	
	let bones = obj.bones;
	for (let i in bones) {
		let bone = bones[i], parent = bone.parent ? bone.parent : bone.name;
		parents[parent] && (parent = parents[parent]);
		!project.elements[bone.name] && (parents[bone.name] = parent);
		let part = project.elements[parent];
		if (!part || !bone.cubes) continue;
		bone.pivot && (part.offset = {
			x: bone.pivot[0],
			y: 24 - bone.pivot[1],
			z: bone.pivot[2],
		});
		bone.rotation && (part.rotation = {
			x: bone.rotation[0],
			y: bone.rotation[1],
			z: bone.rotation[2],
		});
		for (let n = 0; n < bone.cubes.length; n++) {
			let box = bone.cubes[n];
			switch(parent) {
				case "body":
					box.origin[0] -= -4;
					box.origin[1] -= 12;
					box.origin[2] -= -2;
					break;
				case "head":
					box.origin[0] -= -4;
					box.origin[1] -= 24;
					box.origin[2] -= -4;
					break;
				case "rightArm":
					box.origin[0] -= -8;
					box.origin[1] -= 12;
					box.origin[2] -= -2;
					break;
				case "leftArm":
					box.origin[0] -= 4;
					box.origin[1] -= 12;
					box.origin[2] -= -2;
					break;
				case "rightLeg":
					box.origin[0] -= -3.9;
					box.origin[2] -= -2;
					break;
				case "leftLeg":
					box.origin[0] -= -0.1;
					box.origin[2] -= -2;
					break;
			}
			part.bones.push({
				type: "box",
				coords: {
					x: box.origin[0],
					y: parent.indexOf("Leg") == -1 ? -box.origin[1] : box.origin[1],
					z: box.origin[2]
				},
				size: {
					x: box.size[0],
					y: box.size[1],
					z: box.size[2]
				},
				uv: {
					x: box.uv[0],
					y: box.uv[1]
				}
			});
		}
	}
	return project;
}

let EntityEditor = {
	data: {},
	reset: function() {
		this.data.worker = ProjectEditor.addEntity();
		ProjectEditor.setOpenedState(true);
		this.data.worker.Visual.createModel();
		this.data.group = this.data.item = -1;
	},
	create: function() {
		let autosaveable = !ProjectEditor.isOpened();
		if (!this.data.worker) this.reset();
		autosaveable && ProjectEditor.initializeAutosave(this.data.worker);
		this.data.hasVisual = this.data.worker.Visual.getModelCount() > 0
			&& this.data.worker.Visual.getModel(0).getAssigmentSize() > 0;
		updateEntityRender(this.data.worker);
		
		let button = new ControlButton();
		button.setIcon("menu");
		button.setOnClickListener(function() {
			EntityEditor.menu();
			menu.dismiss();
		});
		button.show();
		
		let menu = new MenuWindow();
		let group = menu.addGroup("entity");
		group.addItem("entity", null);
		group.addItem("blockModuleIdentifier", null);
		group.addItem("entityModuleDraw", null);
		group.addItem("entityModuleUpdate", null);
		group = menu.addGroup("entityBoneBones");
		if (this.data.hasVisual) {
			group.addItem("entityBoneBones", this.bone.select);
			group.addItem("entityBoxAdd", this.bone.add);
			group.addItem("blockModuleVariation", this.bone.rename);
			group.addItem("entityBoneOffset", this.bone.offset);
			group.addItem("entityBoneRotate", this.bone.rotate);
			group.addItem("entityBoxRemove", this.bone.remove);
			group = menu.addGroup("entityBoxBoxes");
			if (this.data.item >= 0) {
				group.addItem("entityBoxBoxes", this.box.select);
				group.addItem("entityBoxAdd", this.box.add);
				group.addItem("entityBoxMove", this.box.move);
				group.addItem("entityBoxResize", this.box.resize);
				group.addItem("entityBoxUv", this.box.vertex);
				group.addItem("entityBoxRemove", this.box.remove);
			} else group.addItem("entityBoxAdd", this.box.add);
		} else group.addItem("entityBoxAdd", this.bone.add);
		// menu.selectGroup(0);
		menu.show();
	},
	menu: function(view) {
		let control = new ControlWindow();
		control.setOnClickListener(function() {
			EntityEditor.create();
		});
		control.addItem("menuProjectLoad", translate("Open"), function() {
			selectFile([".nde"/*, ".js"*/, ".json"], EntityEditor.open);
		});
		control.addItem("menuProjectSave", translate("Export"), function() {
			saveFile(EntityEditor.data.name, [".nde"/*, ".js"*/], EntityEditor.save);
		});
		control.addItem("entityModuleSelect", translate("Select"), function() {
			showHint(translate("Tap block"));
			control.dismiss();
			selectMode = 6;
			
			let button = new ControlButton();
			button.setIcon("menuModuleBack");
			button.setOnClickListener(function() {
				EntityEditor.create();
				selectMode = 0;
			});
			button.show();
		});
		control.addItem("menuProjectLeave", translate("Exit"), function() {
			confirm(translate("Warning!"),
				translate("Are you sure want to exit? Unsave data will be lost."),
				function() {
					control.dismiss();
					Popups.closeAll();
					StartEditor.menu();
					ProjectEditor.setOpenedState(false);
					ProjectEditor.getProject().callAutosave();
					delete EntityEditor.data.worker;
				});
		});
		control.show();
	},
	open: function(file) {
		let name = file.getName();
		if (name.endsWith(".nde")) {
			let project = compileData(Files.read(file));
			if (!project) return showHint(translate("Empty project"));
			EntityEditor.reset();
			EntityEditor.data.worker.loadProject(project);
			updateEntityRender(EntityEditor.data.worker);
			EntityEditor.create();
			showHint(translate("Import done"));
		} else if (name.endsWith(".js")) {
			// TODO
		} else if (name.endsWith(".json")) {
			let project = compileData(Files.read(file)),
				geometry = geometryToModel2(project["geometry.bonnie"]);
			updateEntityRender(EntityEditor.data.worker);
		}
	},
	save: function(file, i) {
		EntityEditor.data.name = i;
		let name = file.getName(),
			project = EntityEditor.data.worker.getProject();
		if (name.endsWith(".nde")) {
			Files.write(file, JSON.stringify(project));
			showHint(translate("Export done"));
		} else if (name.endsWith(".js")) {
			Files.write(file, model2ToScript(project));
			showHint(translate("Export done"));
		}
	},
	project: function(view) {},
	bone: {
		select: function(view) {
			let model = EntityEditor.data.worker.Visual.getModel(0);
			let popup = new ListingPopup();
			popup.setTitle(translate("Bones"));
			// popup.setOnShowListener(function() {
				// selectMode = 7;
				// updateEntityRender(BlockEditor.data.worker);
			// });
			// popup.setOnHideListener(function() {
				// selectMode = 0;
				// updateEntityRender(BlockEditor.data.worker);
			// });
			popup.setOnSelectListener(function(index) {
				EntityEditor.data.group = index;
				let hasBoxes = EntityEditor.data.item > 0;
				EntityEditor.data.item = model.getIndex(index).getBoxCount() > 0 ? 0 : -1;
				if (hasBoxes && EntityEditor.data.item == -1) EntityEditor.create();
				else if (!hasBoxes && !EntityEditor.data.item) EntityEditor.create();
				updateEntityRender(EntityEditor.data.worker);
			});
			for (let i = 0; i < EntityEditor.data.worker.Visual.getModel(0).getAssigmentSize(); i++)
				popup.addButtonElement(EntityEditor.data.worker.Visual.getModel(0).getName(i));
			popup.selectButton(EntityEditor.data.group);
			popup.setSelectMode(true);
			Popups.open(popup, "bone_select");
		},
		add: function(view) {
			// Can't adding bones without tree assigment
			if (EntityEditor.data.hasVisual) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let index = (EntityEditor.data.group = EntityEditor.data.worker.Visual.getModel(0).addBone());
					(EntityEditor.data.item = -1, EntityEditor.create());
					showHint(translate("Bone %s added", index + 1));
					updateEntityRender(EntityEditor.data.worker);
				});
				popup.addButtonElement(translate("Copy current"), function() {
					let model = EntityEditor.data.worker.Visual.getModel(0);
					let last = EntityEditor.data.group, index = (EntityEditor.data.group = model.cloneAssigment(last));
					EntityEditor.data.item = model.getIndex(last).getBoxCount() > 0 ? 0 : -1;
					showHint(translate("Bone %s cloned to %s", [last + 1, index + 1]));
					updateEntityRender(EntityEditor.data.worker);
				});
				Popups.open(popup, "bone_add");
			} else {
				EntityEditor.data.group = EntityEditor.data.worker.Visual.getModel(0).addBone();
				EntityEditor.data.item = -1;
				EntityEditor.create();
				showHint(translate("First bone added"));
				updateEntityRender(EntityEditor.data.worker);
			}
		},
		rename: function(view) {
			let selected = EntityEditor.data.group,
				model = EntityEditor.data.worker.Visual.getModel(0),
				name = model.getName(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Rename"));
			popup.addEditElement(translate("Name"), name);
			popup.addButtonElement(translate("Save"), function() {
				let values = popup.getAllEditsValues();
				model.getIndex(selected).setName(compileData(values[0], "string"));
				updateEntityRender(EntityEditor.data.worker);
				showHint(translate("Data saved"));
			}).setBackground("ground");
			Popups.open(popup, "bone_rename");
		},
		offset: function(view) {
			let selected = EntityEditor.data.group,
				model = EntityEditor.data.worker.Visual.getModel(0),
				offset = model.getIndex(selected).getOffset();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Offset"));
			popup.setBaseMathes([1, 16, 32]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).offset(0, value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(offset.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).offset(1, value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(offset.y);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).offset(2, value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(offset.z);
			Popups.open(popup, "bone_offset");
		},
		rotate: function(view) {
			let selected = EntityEditor.data.group,
				model = EntityEditor.data.worker.Visual.getModel(0),
				rotate = model.getIndex(selected).getRotation();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Rotate"));
			popup.setBaseMathes([-45, -10, 1, 10]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).rotate(0, value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(rotate.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).rotate(1, value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(rotate.y);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).rotate(2, value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(rotate.z);
			Popups.open(popup, "bone_rotate");
		},
		remove: function(view) {
			// Can't removing bones without tree assigment
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this bone?"),
				function() {
					let selected = EntityEditor.data.group,
						model = EntityEditor.data.worker.Visual.getModel(0);
					model.removeAssigment(selected);
					EntityEditor.data.group = selected > 0 ? selected - 1 : -1;
					if (EntityEditor.data.group >= 0) EntityEditor.data.item = model.getIndex
								(EntityEditor.data.group).getBoxCount() > 0 ? 0 : -1;
					if (model.getAssigmentSize() == 0 || EntityEditor.data.item == -1) EntityEditor.create();
					Popups.closeAllByTag("bone");
					Popups.closeAllByTag("box");
					showHint(translate("Bone deleted"));
				});
		}
	},
	box: {
		select: function (view) {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			// popup.setOnShowListener(function () {
				// selectMode = 8;
				// updateEntityRender(EntityEditor.data.worker);
			// });
			// popup.setOnHideListener(function () {
				// selectMode = 0;
				// updateEntityRender(EntityEditor.data.worker);
			// });
			popup.setOnSelectListener(function (index) {
				EntityEditor.data.item = index;
				updateEntityRender(EntityEditor.data.worker);
			});
			let model = EntityEditor.data.worker.Visual.getModel(0);
			for (let i = 0; i < model.getIndex(EntityEditor.data.group).getBoxCount(); i++) {
				popup.addButtonElement(translate("Box %s", i + 1));
			}
			popup.selectButton(EntityEditor.data.item);
			popup.setSelectMode(true);
			Popups.open(popup, "box_select");
		},
		add: function (view) {
			let model = EntityEditor.data.worker.Visual.getModel(0),
				selected = EntityEditor.data.item, group = EntityEditor.data.group;
			if (EntityEditor.data.item >= 0) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function (index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function () {
					let index = (EntityEditor.data.item = model.getIndex(group).addBox());
					showHint(translate("Box %s added", index + 1));
					updateEntityRender(EntityEditor.data.worker);
				});
				popup.addButtonElement(translate("Copy current"), function () {
					let last = EntityEditor.data.item, index = (EntityEditor.data.item = model.getIndex(group).cloneBox(last));
					showHint(translate("Box %s cloned to %s", [last + 1, index + 1]));
					updateEntityRender(EntityEditor.data.worker);
				});
				Popups.open(popup, "box_add");
			} else {
				EntityEditor.data.item = model.getIndex(group).addBox();
				EntityEditor.create();
				showHint(translate("First box added"));
				updateEntityRender(EntityEditor.data.worker);
			}
		},
		resize: function (view) {
			let selected = EntityEditor.data.group, item = EntityEditor.data.item,
				model = EntityEditor.data.worker.Visual.getModel(0),
				box = model.getIndex(selected).getBox(item), coords = box.getCoords();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Scretch"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				box.scretch(index == 0 ? "x1" : "x2", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.x1);
			group.addItem(coords.x2);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				box.scretch(index == 0 ? "y1" : "y2", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.y1);
			group.addItem(coords.y2);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				box.scretch(index == 0 ? "z1" : "z2", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.z1);
			group.addItem(coords.z2);
			Popups.open(popup, "box_resize");
		},
		move: function (view) {
			let selected = EntityEditor.data.group, item = EntityEditor.data.item,
				model = EntityEditor.data.worker.Visual.getModel(0),
				box = model.getIndex(selected).getBox(item), coords = box.getCoords();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function (index, value) {
				box.move("x", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.x1);
			group = popup.addGroup("y");
			group.setOnChangeListener(function (index, value) {
				box.move("y", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.y1);
			group = popup.addGroup("z");
			group.setOnChangeListener(function (index, value) {
				box.move("z", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.z1);
			Popups.open(popup, "box_move");
		},
		vertex: function (view) {
			let selected = EntityEditor.data.group, item = EntityEditor.data.item,
				model = EntityEditor.data.worker.Visual.getModel(0),
				box = model.getIndex(selected).getBox(item), vertex = box.getVertex();
			let popup = new CoordsPopup();
			popup.setTitle(translate("UV"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function (index, value) {
				box.vertex("x", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(vertex.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function (index, value) {
				box.vertex("y", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(vertex.y);
			Popups.open(popup, "box_vertex");
		},
		remove: function () {
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this box?"),
				function() {
					let selected = EntityEditor.data.group, item = EntityEditor.data.item,
						model = EntityEditor.data.worker.Visual.getModel(0);
					model.getIndex(selected).removeBox(item);
					EntityEditor.data.item = item > 0 ? item - 1 : -1;
					if (EntityEditor.data.item == -1) EntityEditor.create();
					Popups.closeAllByTag("box");
					showHint(translate("Box deleted"));
				});
		}
	}
};
