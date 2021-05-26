const registerCustomEntity = function() {
	return -1/* MobRegistry.registerEntity("__editorEntity__")*/;
};

const TODO = registerCustomEntity();

const updateEntityRender = function(worker) {
	try {
		if (!worker || !Level.isLoaded()) {
			return false;
		}
		/* let model = eval(model2ToScript(EntityEditor.project));
		let texture = new Texture("mob/bonnie.png");
		model.setTexture(texture);
		TODO.customizeVisual({
			getModels: function() {
				return { "main": model };
			}
		}); */
		autosavePeriod == 0 && ProjectEditor.getProject().callAutosave();
	} catch (e) {
		reportError(e);
	}
	return false;
};

const model2ToScript = function(obj) {
	let script = new String();
	script += "let model = new EntityModel();\n";
	script += "let render = new Render();\n";
	for (let item in obj.elements) {
		let part = obj.elements[item], params = new Object();
		part.offset && (params.offset = part.offset);
		part.rotation && (params.rotation = part.rotation);
		let bones = part.bones.slice();
		script += "render.setPart(\"" + item + "\", " + JSON.stringify(bones, null, "\t") + ", " + JSON.stringify(params, null, "\t") + ");\n";
		// script += "render.getPart(\"" + item + "\").setOffset(" + part.offset.x + ", " + part.offset.y + ", " + part.offset.z + ");\n";
	}
	script += "model.setRender(render);";
	return script;
};

const geometryToModel2 = function(obj) {
	let project = {
		texture: {
			width: obj.texturewidth,
			height: obj.textureheight
		},
		elements: {
			body: {
				bones: new Array()
			},
			head: {
				bones: new Array()
			},
			leftArm: {
				bones: new Array()
			},
			rightArm: {
				bones: new Array()
			},
			leftLeg: {
				bones: new Array()
			},
			rightLeg: {
				bones: new Array()
			}
		}
	};
	let parents = {
		hat: "head"
	};
	let bones = obj.bones;
	for (let item in bones) {
		let bone = bones[item], parent = bone.parent ? bone.parent : bone.name;
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
};

const EntityEditor = {
	data: new Object(),
	reset: function() {
		this.data.worker = ProjectEditor.addEntity();
		ProjectEditor.setOpenedState(true);
		this.data.worker.Visual.createModel();
		this.unselect();
	},
	unselect: function() {
		this.data.group = this.data.item = -1;
		Popups.closeIfOpened("bone_select");
		Popups.closeIfOpened("box_select");
		delete this.data.selected;
	},
	create: function() {
		let autosaveable = !ProjectEditor.isOpened();
		if (!this.data.worker) this.reset();
		autosaveable && ProjectEditor.initializeAutosave(this.data.worker);
		this.data.hasVisual = this.data.worker.Visual.getModelCount() > 0
			&& this.data.worker.Visual.getModel(0).getAssigmentSize() > 0;
		let button = new ControlButton();
		button.setIcon("menu");
		button.setOnClickListener(function() {
			EntityEditor.menu();
			sidebar.dismiss();
		});
		button.show();
		let sidebar = new SidebarWindow(),
			group = sidebar.addGroup("entity");
		group.addItem("entity", null);
		group.addItem("blockModuleIdentifier", this.rename);
		if (this.data.worker.Visual.getModelCount() > 0) {
			group.addItem("entityModuleDraw", this.texture);
		}
		group.addItem("entityModuleUpdate", this.reload);
		group = sidebar.addGroup("entityBoneBones");
		if (this.data.hasVisual) {
			group.addItem("entityBoneBones", this.Bone.select);
			group.addItem("entityBoxAdd", this.Bone.add);
			group.addItem("blockModuleVariation", this.Bone.rename);
			group.addItem("entityBoneOffset", this.Bone.offset);
			group.addItem("entityBoneRotate", this.Bone.rotate);
			group.addItem("entityBoxRemove", this.Bone.remove);
			group = sidebar.addGroup("entityBoxBoxes");
			if (this.data.item >= 0) {
				group.addItem("entityBoxBoxes", this.Box.select);
				group.addItem("entityBoxAdd", this.Box.add);
				group.addItem("entityBoxMove", this.Box.move);
				group.addItem("entityBoxResize", this.Box.resize);
				group.addItem("entityBoxUv", this.Box.vertex);
				group.addItem("entityBoxRemove", this.Box.remove);
			} else group.addItem("entityBoxAdd", this.Box.add);
		} else group.addItem("entityBoxAdd", this.Bone.add);
		if (this.data.selected >= 0) sidebar.select(this.data.selected);
		sidebar.setOnGroupSelectListener(function(window, group, index, previous, count) {
			EntityEditor.data.selected = index;
			updateEntityRender(EntityEditor.data.worker);
		});
		sidebar.setOnGroupUndockListener(function(window, group, index, previous) {
			if (!previous) {
				delete EntityEditor.data.selected;
				selectMode = 0, updateEntityRender(EntityEditor.data.worker);
			}
		});
		sidebar.show();
		updateEntityRender(this.data.worker);
	},
	menu: function() {
		let control = new ControlWindow();
		control.setOnClickListener(function() {
			EntityEditor.create();
		}).addHeader();
		let category = control.addCategory(translate("Editor"));
		category.addItem("menuProjectLoad", translate("Open"), function() {
			selectFile([".dnp", ".js", ".json"], function(file) {
				EntityEditor.replace(file);
			});
		});
		category.addItem("menuProjectImport", translate("Import"), function() {
			showHint(translate("This content will be availabled soon"));
		}).setBackground("popupSelectionLocked");
		category.addItem("menuProjectSave", translate("Export"), function() {
			saveFile(EntityEditor.data.name, [".dnp", ".js", ".json"], function(file, i) {
				EntityEditor.save(file, i);
			});
		});
		category.addItem("menuProjectLeave", translate("Back"), function() {
			control.dismiss();
			Popups.closeAll(), EntityEditor.unselect();
			ProjectEditor.setOpenedState(false);
			ProjectEditor.getProject().callAutosave();
			checkValidate(function() {
				delete EntityEditor.data.worker;
				StartEditor.menu();
			});
		});
		checkForAdditionalInformation(control);
		category = control.addCategory(translate("Entity"));
		category.addItem("entityModuleSelect", translate("Summon"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't summon entity at menu"));
				return;
			}
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
		category.addItem("entityModuleUpdate", translate("Reload"), function() {
			selectMode = 0;
			EntityEditor.reload();
		});
		resetAdditionalInformation();
		control.show();
	},
	open: function(source) {
		if (!(source instanceof Object)) {
			source = ProjectEditor.getEditorById(source);
		}
		let index = ProjectEditor.indexOf(source);
		if (!source) {
			showHint(translate("Can't find opened editor at %s position", source));
			return false;
		}
		Popups.closeAll();
		let worker = this.data.worker = new EntityWorker(source);
		if (index == -1) index = ProjectEditor.getCount();
		ProjectEditor.setupEditor(index, worker);
		ProjectEditor.setOpenedState(true);
		EntityEditor.unselect();
		EntityEditor.create();
		return true;
	},
	replace: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				handle(function() {
					active = Date.now() - active;
					selectProjectData(result, function(selected) {
						active = Date.now() - active;
						EntityEditor.open(selected);
						showHint(translate("Loaded success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					}, "entity", true);
				});
			});
		}
	},
	save: function(file, i) {
		let name = (EntityEditor.data.name = i, file.getName()),
			project = EntityEditor.data.worker.getProject();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		}
	},
	reload: function() {
		if (updateEntityRender(EntityEditor.data.worker)) {
			showHint(translate("Assigment updated"));
		} else showHint(translate("Nothing to update"));
	},
	Bone: {
		hasSelection: function() {
			return EntityEditor.data.group >= 0;
		},
		select: function() {
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
			for (let i = 0; i < EntityEditor.data.worker.Visual.getModel(0).getAssigmentSize(); i++) {
				popup.addButtonElement(EntityEditor.data.worker.Visual.getModel(0).getName(i));
			}
			popup.selectButton(EntityEditor.data.group);
			popup.setSelectMode(true);
			Popups.open(popup, "bone_select");
		},
		add: function() {
			// Can't adding bones without tree assigment
			if (EntityEditor.data.hasVisual) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let index = EntityEditor.data.group = EntityEditor.data.worker.Visual.getModel(0).addBone();
					(EntityEditor.data.item = -1, EntityEditor.create());
					showHint(translate("Bone %s added", index + 1));
					updateEntityRender(EntityEditor.data.worker);
				});
				if (EntityEditor.Bone.hasSelection()) {
					popup.addButtonElement(translate("Copy current"), function() {
						let model = EntityEditor.data.worker.Visual.getModel(0),
							last = EntityEditor.data.group,
							index = EntityEditor.data.group = model.cloneAssigment(last);
						EntityEditor.data.item = model.getIndex(last).getBoxCount() > 0 ? 0 : -1;
						showHint(translate("Bone %s cloned to %s", [last + 1, index + 1]));
						updateEntityRender(EntityEditor.data.worker);
					});
				}
				Popups.open(popup, "bone_add");
			} else {
				EntityEditor.data.group = EntityEditor.data.worker.Visual.getModel(0).addBone();
				EntityEditor.data.item = -1;
				EntityEditor.create();
				showHint(translate("First bone added"));
				updateEntityRender(EntityEditor.data.worker);
			}
		},
		rename: function() {
			if (!EntityEditor.Bone.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group,
				model = EntityEditor.data.worker.Visual.getModel(0),
				name = model.getName(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Rename"));
			popup.addEditElement(translate("Name"), name);
			popup.addButtonElement(translate("Save"), function() {
				let values = popup.getAllEditsValues();
				model.getIndex(selected).setName(String(values[0]));
				updateEntityRender(EntityEditor.data.worker);
				showHint(translate("Data saved"));
			}).setBackground("ground");
			Popups.open(popup, "bone_rename");
		},
		offset: function() {
			if (!EntityEditor.Bone.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
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
		rotate: function() {
			if (!EntityEditor.Bone.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
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
		remove: function() {
			if (!EntityEditor.Bone.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
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
	Box: {
		hasSelection: function() {
			return EntityEditor.data.item >= 0;
		},
		select: function() {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			// popup.setOnShowListener(function() {
				// selectMode = 8;
				// updateEntityRender(EntityEditor.data.worker);
			// });
			// popup.setOnHideListener(function() {
				// selectMode = 0;
				// updateEntityRender(EntityEditor.data.worker);
			// });
			popup.setOnSelectListener(function(index) {
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
		add: function() {
			let model = EntityEditor.data.worker.Visual.getModel(0),
				selected = EntityEditor.data.item, group = EntityEditor.data.group;
			if (EntityEditor.Box.hasSelection()) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let index = (EntityEditor.data.item = model.getIndex(group).addBox());
					showHint(translate("Box %s added", index + 1));
					updateEntityRender(EntityEditor.data.worker);
				});
				popup.addButtonElement(translate("Copy current"), function() {
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
		resize: function() {
			if (!EntityEditor.Box.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
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
		move: function() {
			if (!EntityEditor.Box.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group, item = EntityEditor.data.item,
				model = EntityEditor.data.worker.Visual.getModel(0),
				box = model.getIndex(selected).getBox(item), coords = box.getCoords();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				box.move("x", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.x1);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				box.move("y", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.y1);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				box.move("z", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(coords.z1);
			Popups.open(popup, "box_move");
		},
		vertex: function() {
			if (!EntityEditor.Box.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group, item = EntityEditor.data.item,
				model = EntityEditor.data.worker.Visual.getModel(0),
				box = model.getIndex(selected).getBox(item), vertex = box.getVertex();
			let popup = new CoordsPopup();
			popup.setTitle(translate("UV"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				box.vertex("x", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(vertex.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				box.vertex("y", value);
				updateEntityRender(EntityEditor.data.worker);
			});
			group.addItem(vertex.y);
			Popups.open(popup, "box_vertex");
		},
		remove: function() {
			if (!EntityEditor.Box.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
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
	},
	rename: function() {
		let define = EntityEditor.data.worker.Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("Rename"));
		popup.addEditElement(translate("ID"), define.getIdentificator());
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			define.setIdentificator(String(values[0]));
			showHint(translate("Data saved"));
		}).setBackground("ground");
		Popups.open(popup, "rename");
	},
	texture: function() {
		let model = EntityEditor.data.worker.Visual.getModel(0);
		let popup = new ListingPopup();
		popup.setTitle(translate("Texture"));
		popup.addEditElement(translate("Path"), model.getTexture() || "entity/pig.png");
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			model.setTexture(String(values[0]));
			showHint(translate("Data saved"));
		}).setBackground("ground");
		Popups.open(popup, "texture");
	}
};
