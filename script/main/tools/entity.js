const registerCustomEntity = function() {
	return CoreEngine.MobRegistry.registerEntity("__editorEntity__");
};

let TODO = null;

Callback.addCallback("CoreConfigured", function() {
	TODO = registerCustomEntity();
});

const updateEntityRender = function(tool) {
	return tryout(function() {
		if (!tool || !TODO || !LevelInfo.isLoaded()) {
			return false;
		}
		let worker = tool.getWorker();
		let model = eval(model2ToScript(EntityEditor.project));
		let texture = new CoreEngine.Texture("mob/bonnie.png");
		model.setTexture(texture);
		TODO.customizeVisual({
			getModels: function() {
				return { "main": model };
			}
		});
		autosavePeriod == 0 && ProjectProvider.getProject().callAutosave();
	}, false);
};

const model2ToScript = function(obj) {
	let script = String();
	script += "let model = new EntityModel();\n";
	script += "let render = new Render();\n";
	for (let item in obj.elements) {
		let part = obj.elements[item],
			params = new Object();
		part.offset && (params.offset = part.offset);
		part.rotation && (params.rotation = part.rotation);
		let bones = part.bones.slice();
		script += "render.setPart(\"" + item + "\", " + JSON.stringify(bones, null, "\t") + ", " + JSON.stringify(params, null, "\t") + ");\n";
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
					box.origin[0] -= -.1;
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

const ENTITY_TOOL = (function() {
	return new EditorTool({
		controlDescriptor: {
			logotype: function(tool, control) {
				return "entity";
			},
			collapsedClick: function(tool, control) {
				EditorTool.prototype.controlDescriptor.collapsedClick.apply(this, arguments);
			}
		},
		menuDescriptor: {
			elements: [function(tool, json, menu) {
				if (LevelInfo.isLoaded()) {
					return {
						type: "category",
						title: translate("Entity"),
						items: [{
							icon: "entityDraw",
							title: translate("Summon"),
							click: function(tool, item) {
								showHint(translate("Tap block"));
								selectMode = 6;
								tool.describeControl();
								tool.collapse();
							}
						}, {
							icon: "entityUpdate",
							title: translate("Reload"),
							click: function(tool, item) {
								if (selectMode != 0) {
									selectMode = 0;
									tool.describe();
								}
								EntityEditor.reload();
							}
						}]
					};
				}
				// in menu
			}]
		},
		sidebarDescriptor: {
			groups: [{
				icon: "entity",
				items: [{
					icon: "entityDefineIdentifier"
				}, function(tool, json, group, sidebar) {
					if (EntityEditor.data.hasVisual) {
						return {
							icon: "entityDefineTexture"
						};
					}
				}, {
					icon: "entityUpdate"
				}]
			}, function(tool, json, sidebar) {
				let selector = [{
					icon: "entityBone",
					items: [{
						icon: "entityBoneAdd"
					}]
				}];
				if (EntityEditor.data.hasVisual) {
					selector[0].items.unshift({
						icon: "entityBoneSelect"
					});
					selector[0].items = selector[0].items.concat([{
						icon: "entityBoneName"
					}, {
						icon: "entityBoneOffset"
					}, {
						icon: "entityBoneRotate"
					}, {
						icon: "entityBoneRemove"
					}]);
					if (EntityEditor.Bone.hasSelection()) {
						selector.push({
							icon: "entityBoxSelect",
							items: [{
								icon: "entityBoxAdd"
							}]
						});
						if (EntityEditor.Box.hasSelection()) {
							selector[1].items.unshift({
								icon: "entityBoxSelect"
							});
							selector[1].items = selector[1].items.concat([{
								icon: "entityBoxMove"
							}, {
								icon: "entityBoxScretch"
							}, {
								icon: "entityBoxUv"
							}, {
								icon: "entityBoxRemove"
							}]);
						}
					}
				}
				return selector;
			}]
		},
		onSelectItem: function(sidebar, group, item, groupIndex, itemIndex) {
			if (groupIndex == 0) {
				if (EntityEditor.data.hasVisual) {
					if (itemIndex > 0) itemIndex++;
				}
				if (itemIndex == 0) {
					return EntityEditor.rename(this);
				} else if (itemIndex == 1) {
					return EntityEditor.texture(this);
				} else if (itemIndex == 2) {
					return EntityEditor.reload(this);
				}
			} else if (EntityEditor.data.hasVisual) {
				if (groupIndex == 1) {
					if (itemIndex == 0) {
						return EntityEditor.Bone.select(this);
					} else if (itemIndex == 1) {
						return EntityEditor.Bone.add(this);
					} else if (itemIndex == 2) {
						return EntityEditor.Bone.rename(this);
					} else if (itemIndex == 3) {
						return EntityEditor.Bone.offset(this);
					} else if (itemIndex == 4) {
						return EntityEditor.Bone.rotate(this);
					} else if (itemIndex == 5) {
						return EntityEditor.Bone.remove(this);
					}
				} else if (groupIndex == 2) {
					if (EntityEditor.Box.hasSelection()) {
						if (itemIndex == 0) {
							return EntityEditor.Box.select(this);
						} else if (itemIndex == 1) {
							return EntityEditor.Box.add(this);
						} else if (itemIndex == 2) {
							return EntityEditor.Box.move(this);
						} else if (itemIndex == 3) {
							return EntityEditor.Box.resize(this);
						} else if (itemIndex == 4) {
							return EntityEditor.Box.vertex(this);
						} else if (itemIndex == 5) {
							return EntityEditor.Box.remove(this);
						}
					} else if (itemIndex == 0) {
						return EntityEditor.Box.add(this);
					}
				}
			} else if (groupIndex == 1 && itemIndex == 0) {
				return EntityEditor.Bone.add(this);
			}
			showHint(translate("Not developed yet"));
		},
		onFetchGroup: function(sidebar, group, index) {
			if (index == 0) {
				return translate("Entity define properties");
			} else if (index == 1) {
				return translate("Visual model bones");
			} else if (index == 2) {
				return translate("Selected bone boxes");
			}
			return translate("Deprecated translation");
		},
		onFetchItem: function(sidebar, group, item, groupIndex, itemIndex) {
			if (groupIndex == 0) {
				if (EntityEditor.data.hasVisual) {
					if (itemIndex > 0) itemIndex++;
				}
				if (itemIndex == 0) {
					return translate("Changes entity identifier");
				} else if (itemIndex == 1) {
					return translate("Set up path texture");
				} else if (itemIndex == 2) {
					return translate("Updates render");
				}
			} else if (groupIndex == 1) {
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
			} else if (groupIndex == 2) {
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
			}
			return translate("Deprecated translation");
		},
		onSelectGroup: function(sidebar, group, index, last, count) {
			updateEntityRender(this);
		},
		onUndockGroup: function(sidebar, group, index, previous) {
			if (!previous) {
				selectMode = 0;
				updateEntityRender(this);
			}
		},
		getExtensions: function(type) {
			let source = EditorTool.prototype.getExtensions.apply(this, arguments);
			if (type != EditorTool.ExtensionType.EXPORT) {
				source = source.concat([".json"]);
			}
			return source;
		},
		replace: function(file) {
			EditorTool.prototype.replace.apply(this, arguments);
		},
		getWorkerFor: function(source) {
			if (source !== undefined) {
				return new EntityWorker(source);
			}
			return ProjectProvider.addEntity();
		},
		unselect: function(force) {
			delete EntityEditor.data.group;
			Popups.closeIfOpened("bone_select");
			delete EntityEditor.data.item;
			Popups.closeIfOpened("box_select");
			updateEntityRender(this);
			EditorTool.prototype.unselect.apply(this, arguments);
		}
	});
})();

const attachEntityTool = function(source, post) {
	ENTITY_TOOL.attach();
	ENTITY_TOOL.queue();
	handleThread(function() {
		let accepted = ENTITY_TOOL.open(source);
		handle(function() {
			if (accepted) {
				tryout(function() {
					post && post(ENTITY_TOOL);
					EntityEditor.attach(ENTITY_TOOL);
					accepted = false;
				});
			}
			if (accepted) {
				ENTITY_TOOL.leave();
			}
		});
	});
};

const EntityEditor = {
	data: new Object(),
	resetIfNeeded: function(tool) {
		let worker = tool.getWorker();
		if (worker.Visual.getModelCount() == 0) {
			worker.Visual.createModel();
		}
	},
	attach: function(tool) {
		let worker = tool.getWorker();
		this.resetIfNeeded(tool);
		this.data.hasVisual = worker.Visual.getModelCount() > 0;
		updateEntityRender(tool);
		if (!tool.isAttached()) {
			tool.attach();
		}
		tool.describe();
		tool.control();
	},
	reload: function(tool) {
		let worker = tool.getWorker();
		if (updateEntityRender(tool)) {
			showHint(translate("Assigment updated"));
		} else showHint(translate("Nothing to update"));
	},
	Bone: {
		hasSelection: function() {
			return EntityEditor.data.group >= 0;
		},
		select: function(tool) {
			let popup = new ListingPopup();
			popup.setTitle(translate("Bones"));
			popup.setSelectMode(true);
			popup.setOnDismissListener(function() {
				selectMode = 0;
				updateEntityRender(tool);
			});
			let model = tool.getWorker().Visual.getModel(0);
			for (let i = 0; i < model.getAssigmentSize(); i++) {
				popup.addButtonElement(model.getName(i));
			}
			popup.selectButton(EntityEditor.data.group);
			popup.setOnSelectListener(function(index) {
				// selectMode = 7;
				let previous = EntityEditor.data.group;
				EntityEditor.data.group = index;
				if (model.getIndex(index).getBoxCount() > 0) {
					EntityEditor.data.item = 0;
				} else delete EntityEditor.data.item;
				if (previous != index) tool.describeSidebar();
				updateEntityRender(tool);
			});
			Popups.open(popup, "bone_select");
		},
		add: function(tool) {
			// Can't normally adding bones without tree assigment
			let model = tool.getWorker().Visual.getModel(0);
			if (EntityEditor.data.hasVisual) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let selected = EntityEditor.Bone.hasSelection(),
						index = EntityEditor.data.group = model.addBone();
					if (!selected) tool.describeSidebar();
					showHint(translate("Bone %s added", index + 1));
					updateEntityRender(tool);
				});
				if (EntityEditor.Bone.hasSelection()) {
					popup.addButtonElement(translate("Copy current"), function() {
						let last = EntityEditor.data.group,
							index = EntityEditor.data.group = model.cloneAssigment(last);
						if (model.getIndex(last).getBoxCount() > 0) {
							EntityEditor.data.item = 0;
						} else delete EntityEditor.data.item;
						showHint(translate("Bone %s cloned to %s", [last + 1, index + 1]));
						updateEntityRender(tool);
					});
				}
				Popups.open(popup, "bone_add");
			} else {
				EntityEditor.data.group = model.addBone();
				delete EntityEditor.data.item;
				EntityEditor.attach(tool);
				showHint(translate("First bone added"));
			}
		},
		rename: function(tool) {
			if (!EntityEditor.Bone.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group,
				model = tool.getWorker().Visual.getModel(0),
				name = model.getName(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Rename"));
			popup.addEditElement(translate("Name"), name);
			popup.addButtonElement(translate("Save"), function() {
				let values = popup.getAllEditsValues();
				model.getIndex(selected).setName(String(values[0]));
				updateEntityRender(tool);
				showHint(translate("Data saved"));
			});
			Popups.open(popup, "bone_rename");
		},
		offset: function(tool) {
			if (!EntityEditor.Bone.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group,
				model = tool.getWorker().Visual.getModel(0),
				offset = model.getIndex(selected).getOffset();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Offset"));
			popup.setBaseMathes([1, 16, 32]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).offset(0, value);
				updateEntityRender(tool);
			});
			group.addItem(offset.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).offset(1, value);
				updateEntityRender(tool);
			});
			group.addItem(offset.y);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).offset(2, value);
				updateEntityRender(tool);
			});
			group.addItem(offset.z);
			Popups.open(popup, "bone_offset");
		},
		rotate: function(tool) {
			if (!EntityEditor.Bone.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group,
				model = tool.getWorker().Visual.getModel(0),
				rotate = model.getIndex(selected).getRotation();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Rotate"));
			popup.setBaseMathes([-45, -10, 1, 10]);
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).rotate(0, value);
				updateEntityRender(tool);
			});
			group.addItem(rotate.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).rotate(1, value);
				updateEntityRender(tool);
			});
			group.addItem(rotate.y);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				model.getIndex(selected).rotate(2, value);
				updateEntityRender(tool);
			});
			group.addItem(rotate.z);
			Popups.open(popup, "bone_rotate");
		},
		remove: function(tool) {
			if (!EntityEditor.Bone.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			// Can't normally removing bones without tree assigment
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this bone?"),
				function() {
					let selected = EntityEditor.data.group,
						model = tool.getWorker().Visual.getModel(0);
					model.removeAssigment(selected);
					if (selected > 0) {
						EntityEditor.data.group = selected - 1;
					} else delete EntityEditor.data.group;
					if (EntityEditor.data.group >= 0) {
						if (model.getIndex(EntityEditor.data.group).getBoxCount() > 0) {
							EntityEditor.data.item = 0;
						} else delete EntityEditor.data.item;
					}
					if (model.getAssigmentSize() == 0 || EntityEditor.data.item === undefined) {
						EntityEditor.attach(tool);
					}
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
		select: function(tool) {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			popup.setSelectMode(true);
			popup.setOnDismissListener(function() {
				selectMode = 0;
				updateEntityRender(tool);
			});
			let model = tool.getWorker().Visual.getModel(0);
			for (let i = 0; i < model.getIndex(EntityEditor.data.group).getBoxCount(); i++) {
				popup.addButtonElement(translate("Box %s", i + 1));
			}
			popup.setOnSelectListener(function(index) {
				// selectMode = 8;
				EntityEditor.data.item = index;
				updateEntityRender(tool);
			});
			popup.selectButton(EntityEditor.data.item);
			Popups.open(popup, "box_select");
		},
		add: function(tool) {
			let model = tool.getWorker().Visual.getModel(0),
				selected = EntityEditor.data.item,
				group = EntityEditor.data.group;
			if (EntityEditor.Box.hasSelection()) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let selected = EntityEditor.Box.hasSelection(),
						index = (EntityEditor.data.item = model.getIndex(group).addBox());
					if (!selected) tool.describeSidebar();
					showHint(translate("Box %s added", index + 1));
					updateEntityRender(tool);
				});
				popup.addButtonElement(translate("Copy current"), function() {
					let last = EntityEditor.data.item,
						index = EntityEditor.data.item = model.getIndex(group).cloneBox(last);
					showHint(translate("Box %s cloned to %s", [last + 1, index + 1]));
					updateEntityRender(tool);
				});
				Popups.open(popup, "box_add");
			} else {
				EntityEditor.data.item = model.getIndex(group).addBox();
				EntityEditor.attach();
				showHint(translate("First box added"));
			}
		},
		resize: function(tool) {
			if (!EntityEditor.Box.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group,
				item = EntityEditor.data.item,
				model = tool.getWorker().Visual.getModel(0),
				box = model.getIndex(selected).getBox(item),
				coords = box.getCoords();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Scretch"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				box.scretch(index == 0 ? "x1" : "x2", value);
				updateEntityRender(tool);
			});
			group.addItem(coords.x1);
			group.addItem(coords.x2);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				box.scretch(index == 0 ? "y1" : "y2", value);
				updateEntityRender(tool);
			});
			group.addItem(coords.y1);
			group.addItem(coords.y2);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				box.scretch(index == 0 ? "z1" : "z2", value);
				updateEntityRender(tool);
			});
			group.addItem(coords.z1);
			group.addItem(coords.z2);
			Popups.open(popup, "box_resize");
		},
		move: function(tool) {
			if (!EntityEditor.Box.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group,
				item = EntityEditor.data.item,
				model = tool.getWorker().Visual.getModel(0),
				box = model.getIndex(selected).getBox(item),
				coords = box.getCoords();
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				box.move("x", value);
				updateEntityRender(tool);
			});
			group.addItem(coords.x1);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				box.move("y", value);
				updateEntityRender(tool);
			});
			group.addItem(coords.y1);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				box.move("z", value);
				updateEntityRender(tool);
			});
			group.addItem(coords.z1);
			Popups.open(popup, "box_move");
		},
		vertex: function(tool) {
			if (!EntityEditor.Box.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = EntityEditor.data.group,
				item = EntityEditor.data.item,
				model = tool.getWorker().Visual.getModel(0),
				box = model.getIndex(selected).getBox(item),
				vertex = box.getVertex();
			let popup = new CoordsPopup();
			popup.setTitle(translate("UV"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				box.vertex("x", value);
				updateEntityRender(tool);
			});
			group.addItem(vertex.x);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				box.vertex("y", value);
				updateEntityRender(tool);
			});
			group.addItem(vertex.y);
			Popups.open(popup, "box_vertex");
		},
		remove: function(tool) {
			if (!EntityEditor.Box.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this box?"),
				function() {
					let selected = EntityEditor.data.group,
						item = EntityEditor.data.item,
						model = tool.getWorker().Visual.getModel(0);
					model.getIndex(selected).removeBox(item);
					if (item > 0) {
						EntityEditor.data.item = item - 1;
					} else delete EntityEditor.data.item;
					if (model.getBoxCount() == 0) {
						EntityEditor.attach(tool);
					}
					Popups.closeAllByTag("box");
					showHint(translate("Box deleted"));
				});
		}
	},
	rename: function(tool) {
		let worker = tool.getWorker();
		let popup = new ListingPopup();
		popup.setTitle(translate("Rename"));
		popup.addEditElement(translate("ID"), worker.Define.getIdentificator());
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			worker.Define.setIdentificator(String(values[0]));
			showHint(translate("Data saved"));
		});
		Popups.open(popup, "rename");
	},
	texture: function(tool) {
		let model = tool.getWorker().Visual.getModel(0);
		let popup = new ListingPopup();
		popup.setTitle(translate("Texture"));
		popup.addEditElement(translate("Path"), model.getTexture() || "entity/pig.png");
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			model.setTexture(String(values[0]));
			showHint(translate("Data saved"));
		});
		Popups.open(popup, "texture");
	}
};
