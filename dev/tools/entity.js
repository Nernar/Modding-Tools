const registerCustomEntity = function() {
	return -1 /* MobRegistry.registerEntity("__editorEntity__") */;
};

const TODO = registerCustomEntity();

const updateEntityRender = function(worker) {
	return tryout(function() {
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
		autosavePeriod == 0 && ProjectProvider.getProject().callAutosave();
	}, false);
};

const model2ToScript = function(obj) {
	let script = new String();
	script += "let model = new EntityModel();\n";
	script += "let render = new Render();\n";
	for (let item in obj.elements) {
		let part = obj.elements[item],
			params = new Object();
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
		let bone = bones[item],
			parent = bone.parent ? bone.parent : bone.name;
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
			switch (parent) {
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
		this.data.worker = ProjectProvider.addEntity();
		ProjectProvider.setOpenedState(true);
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
		let autosaveable = !ProjectProvider.isOpened();
		if (!this.data.worker) this.reset();
		autosaveable && ProjectProvider.initializeAutosave(this.data.worker);
		this.data.hasVisual = this.data.worker.Visual.getModelCount() > 0 &&
			this.data.worker.Visual.getModel(0).getAssigmentSize() > 0;
		let button = new ControlButton();
		button.setIcon("entity");
		button.setOnClickListener(function() {
			EntityEditor.menu();
			sidebar.hide();
		});
		button.show();
		let sidebar = new SidebarWindow(),
			group = sidebar.addGroup("entity");
		group.addItem("entityDefineIdentifier", this.rename);
		if (this.data.worker.Visual.getModelCount() > 0) {
			group.addItem("entityDefineTexture", this.texture);
		}
		group.addItem("entityUpdate", this.reload);
		group.setOnItemFetchListener(function(group, item, groupIndex, itemIndex) {
			if (!EntityEditor.data.worker.Visual.getModelCount() > 0) {
				if (itemIndex > 0) itemIndex++;
			}
			if (itemIndex == 0) {
				return translate("Changes entity identifier");
			} else if (itemIndex == 1) {
				return translate("Set up path texture");
			} else if (itemIndex == 2) {
				return translate("Updates render");
			}
		});
		group = sidebar.addGroup("entityBone");
		group.setOnItemFetchListener(function(group, item, groupIndex, itemIndex) {
			if (EntityEditor.data.hasVisual) {
				if (itemIndex == 0) {
					return translate("Selects currently bone");
				} else if (itemIndex == 1) {
					return translate("Creates and clones bones");
				} else if (itemIndex == 2) {
					return translate("Renames bone in tree");
				} else if (itemIndex == 3) {
					return translate("Changes offset between center and bone");
				} else if (itemIndex == 4) {
					return translate("Rotates bone around offset");
				} else if (itemIndex == 5) {
					return translate("Removes bone");
				}
			} else if (itemIndex == 0) {
				return translate("Creates first bone");
			}
		});
		if (this.data.hasVisual) {
			group.addItem("entityBoneSelect", this.Bone.select);
			group.addItem("entityBoneAdd", this.Bone.add);
			group.addItem("entityBoneName", this.Bone.rename);
			group.addItem("entityBoneOffset", this.Bone.offset);
			group.addItem("entityBoneRotate", this.Bone.rotate);
			group.addItem("entityBoneRemove", this.Bone.remove);
			if (this.Bone.hasSelection()) {
				group = sidebar.addGroup("entityBoxSelect");
				if (this.Box.hasSelection()) {
					group.addItem("entityBoxSelect", this.Box.select);
					group.addItem("entityBoxAdd", this.Box.add);
					group.addItem("entityBoxMove", this.Box.move);
					group.addItem("entityBoxScretch", this.Box.resize);
					group.addItem("entityBoxUv", this.Box.vertex);
					group.addItem("entityBoxRemove", this.Box.remove);
				} else group.addItem("entityBoxAdd", this.Box.add);
				group.setOnItemFetchListener(function(group, item, groupIndex, itemIndex) {
					if (EntityEditor.Box.hasSelection()) {
						if (itemIndex == 0) {
							return translate("Selects currently box");
						} else if (itemIndex == 1) {
							return translate("Creates or clones box");
						} else if (itemIndex == 2) {
							return translate("Moves box location");
						} else if (itemIndex == 3) {
							return translate("Scretches box sizes");
						} else if (itemIndex == 4) {
							return translate("Changes box location in texture");
						} else if (itemIndex == 5) {
							return translate("Removes box");
						}
					} else if (itemIndex == 0) {
						return translate("Creates first box");
					}
				});
			}
		} else group.addItem("entityBoneAdd", this.Bone.add);
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
		sidebar.setOnGroupFetchListener(function(window, group, index) {
			if (index == 0) {
				return translate("Entity define properties");
			} else if (index == 1) {
				return translate("Visual model bones");
			} else if (index == 2) {
				return translate("Selected bone boxes");
			}
		});
		sidebar.show();
		updateEntityRender(this.data.worker);
	},
	menu: function() {
		prepareAdditionalInformation(3, 1);
		let control = new MenuWindow();
		attachWarningInformation(control);
		control.setOnClickListener(function() {
			EntityEditor.create();
		}).addHeader();
		attachAdditionalInformation(control);
		let category = control.addCategory(translate("Editor"));
		category.addItem("menuProjectLoad", translate("Open"), function() {
			selectFile([".dnp", ".js", ".json"], function(file) {
				EntityEditor.replace(file);
			});
		});
		category.addItem("menuProjectImport", translate("Import"), function() {
			showHint(translate("Not developed yet"));
		}).setBackground("popupSelectionLocked");
		category.addItem("menuProjectSave", translate("Export"), function() {
			saveFile(EntityEditor.data.name, [".dnp", ".js", ".json"], function(file, i) {
				EntityEditor.save(file, i);
			});
		});
		category.addItem("menuProjectLeave", translate("Back"), function() {
			control.hide();
			Popups.closeAll(), EntityEditor.unselect();
			ProjectProvider.setOpenedState(false);
			ProjectProvider.getProject().callAutosave();
			checkValidate(function() {
				delete EntityEditor.data.worker;
				ProjectEditor.menu();
			});
		});
		attachAdditionalInformation(control);
		category = control.addCategory(translate("Entity"));
		category.addItem("entityDraw", translate("Summon"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't summon entity at menu"));
				return;
			}
			showHint(translate("Tap block"));
			control.hide();
			selectMode = 6;
			let button = new ControlButton();
			button.setIcon("menuBack");
			button.setOnClickListener(function() {
				EntityEditor.create();
				selectMode = 0;
			});
			button.show();
		});
		category.addItem("entityUpdate", translate("Reload"), function() {
			selectMode = 0;
			EntityEditor.reload();
		});
		attachAdditionalInformation(control);
		control.show();
		finishAttachAdditionalInformation();
	},
	open: function(source) {
		if (typeof source != "object") {
			source = ProjectProvider.getEditorById(source);
		}
		let index = ProjectProvider.indexOf(source);
		if (!source) {
			showHint(translate("Can't find opened editor at %s position", source));
			return false;
		}
		Popups.closeAll();
		let worker = this.data.worker = new EntityWorker(source);
		if (index == -1) index = ProjectProvider.getCount();
		ProjectProvider.setupEditor(index, worker);
		EntityEditor.unselect();
		EntityEditor.create();
		ProjectProvider.setOpenedState(true);
		MenuWindow.hideCurrently();
		return true;
	},
	replace: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					EntityEditor.open(selected);
					showHint(translate("Loaded success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				}, "entity", true);
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
			let popup = new ListingPopup();
			popup.setTitle(translate("Bones"));
			popup.setSelectMode(true);
			// popup.setOnDismissListener(function() {
			// selectMode = 0;
			// updateEntityRender(BlockEditor.data.worker);
			// });
			let model = EntityEditor.data.worker.Visual.getModel(0);
			for (let i = 0; i < EntityEditor.data.worker.Visual.getModel(0).getAssigmentSize(); i++) {
				popup.addButtonElement(EntityEditor.data.worker.Visual.getModel(0).getName(i));
			}
			popup.selectButton(EntityEditor.data.group);
			popup.setOnSelectListener(function(index) {
				// selectMode = 7;
				let previous = EntityEditor.data.group;
				EntityEditor.data.group = index;
				EntityEditor.data.item = model.getIndex(index).getBoxCount() > 0 ? 0 : -1;
				if (previous != index) EntityEditor.create();
				updateEntityRender(EntityEditor.data.worker);
			});
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
			}).setBackground("popup");
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
					if (EntityEditor.data.group >= 0) EntityEditor.data.item = model.getIndex(EntityEditor.data.group).getBoxCount() > 0 ? 0 : -1;
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
			popup.setSelectMode(true);
			// popup.setOnDismissListener(function() {
			// selectMode = 0;
			// updateEntityRender(EntityEditor.data.worker);
			// });
			let model = EntityEditor.data.worker.Visual.getModel(0);
			for (let i = 0; i < model.getIndex(EntityEditor.data.group).getBoxCount(); i++) {
				popup.addButtonElement(translate("Box %s", i + 1));
			}
			popup.setOnSelectListener(function(index) {
				// selectMode = 8;
				EntityEditor.data.item = index;
				updateEntityRender(EntityEditor.data.worker);
			});
			popup.selectButton(EntityEditor.data.item);
			Popups.open(popup, "box_select");
		},
		add: function() {
			let model = EntityEditor.data.worker.Visual.getModel(0),
				selected = EntityEditor.data.item,
				group = EntityEditor.data.group;
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
					let last = EntityEditor.data.item,
						index = EntityEditor.data.item = model.getIndex(group).cloneBox(last);
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
			let selected = EntityEditor.data.group,
				item = EntityEditor.data.item,
				model = EntityEditor.data.worker.Visual.getModel(0),
				box = model.getIndex(selected).getBox(item),
				coords = box.getCoords();
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
			let selected = EntityEditor.data.group,
				item = EntityEditor.data.item,
				model = EntityEditor.data.worker.Visual.getModel(0),
				box = model.getIndex(selected).getBox(item),
				coords = box.getCoords();
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
			let selected = EntityEditor.data.group,
				item = EntityEditor.data.item,
				model = EntityEditor.data.worker.Visual.getModel(0),
				box = model.getIndex(selected).getBox(item),
				vertex = box.getVertex();
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
					let selected = EntityEditor.data.group,
						item = EntityEditor.data.item,
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
		}).setBackground("popup");
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
		}).setBackground("popup");
		Popups.open(popup, "texture");
	}
};
