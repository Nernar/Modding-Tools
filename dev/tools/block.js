let textures = [];
function addTextureMod(name) {
	return textures.push({
		name: name,
		items: []
	}) - 1;
}

function addTexture(index, name, data) {
	typeof data != "number" && (data = parseInt(data));
	textures[index].items.push([name, data]);
}

function selectTexture(index, onSelect) {
	let mod = textures[index];
	if (!mod) return showHint(translate("Unknown mod"));
	let edit = new android.widget.EditText(context);
	edit.setHint(translate("search filter"));
	edit.setTextColor(Ui.Color.WHITE);
	edit.setHintTextColor(Ui.Color.LTGRAY);
	edit.addTextChangedListener({
		onTextChanged: function(text) {
			try {
				let adapter = alert.getListView().getAdapter();
				adapter.getFilter().filter(text, {
					onFilterComplete: function(count) {}
				});
			} catch(e) {
				reportError(e);
			}
		}
	});
	edit.setBackgroundDrawable(null);
	edit.setCursorVisible(false);
	edit.setMaxLines(1);
	
	let builder = new android.app.AlertDialog.Builder(context, android.R.style.Theme_Holo_Dialog);
	builder.setTitle(mod.name);
	builder.setNegativeButton(translate("Cancel"), null);
	if (mod.items.length > 0) {
		let converted = [];
		for (let i in mod.items)
			converted.push(mod.items[i][0] + ", " + mod.items[i][1]);
		builder.setItems(converted, function(d, i) {
			try {
				let adapter = alert.getListView().getAdapter(),
					texture = ("" + adapter.getItem(i)).split(", ");
				onSelect(texture[0], parseInt(texture[1]));
			} catch(e) {
				reportError(e);
			}
		});
		builder.setView(edit);
	} else
		builder.setMessage(translate("This mod not included any texture."));
	let alert = builder.create();
	alert.show();
}

function checkMapping(x, y, z, render) {
	let exists = false, saved = getSavedMappings();
	for (let i = 0; i < saved.length; i++) {
		let map = saved[i];
		if (map.x == x && map.y == y && map.z == z)
			exists = true;
	}
	BlockRenderer.mapAtCoords(x, y, z, render);
	getCurrentMappings().push({ x: x, y: y, z: z });
	if (!exists) {
		saved.push({ x: x, y: y, z: z });
		showHint(translate("Added mapping to %s, %s, %s", [x, y, z]));
	}
}
checkMapping.mapped = new Array();
checkMapping.current = new Array();

function getSavedMappings() {
	return checkMapping.mapped;
}

function copyMappings() {
	return getSavedMappings().slice();
}

function getCurrentMappings() {
	return checkMapping.current;
}

function hasMappings() {
	return getSavedMappings().length > 0;
}

function removeUnusedMappings() {
	let current = getCurrentMappings(),
		saved = getSavedMappings(), hasOne = false;
	for (let i = 0; i < saved.length; i++) {
		let exists = false, map = saved[i];
		for (let c = 0; c < current.length; c++) {
			let item = current[c];
			if (map.x == item.x && map.y == item.y && map.z == item.z)
				exists = true;
		}
		if (!exists) {
			BlockRenderer.unmapAtCoords(map.x, map.y, map.z);
			saved.splice(i, 1), current.splice(i, 1), (i--, hasOne = true);
			showHint(translate("Removed mapping from %s, %s, %s", [map.x, map.y, map.z]));
		}
	}
	return hasOne;
}

function removeMappings() {
	let saved = getSavedMappings(), count = 0;
	for (let i = 0; i < saved.length; i++) {
		let map = saved[i];
		BlockRenderer.unmapAtCoords(map.x, map.y, map.z);
		saved.splice(i, 1), (i--, count++);
	}
	checkMapping.current = new Array();
	if (count > 0) {
		showHint(translate("Removed %s mappings", count));
	}
	return count > 0;
}

function mapRenderBlock(worker) {
	try {
		if (!Level.isLoaded()) return false;
		let render = new ICRender.Model(),
			form = new ICRender.CollisionShape(),
			mapped = worker.Define.getMapped(),
			models = worker.Renderer.getModels(),
			collisions = worker.Collision.getModels(),
			shape = worker.Define.params.shape,
			hasRenderer = hasCollision = false;
		if (models.length > 0 && selectMode != 10) {
			for (let m = 0; m < models.length; m++) {
				let model = BlockRenderer.createModel(),
					boxes = models[m].getBoxes();
				for (let i = 0; i < boxes.length; i++) {
					let box = (hasRenderer = true, boxes[i]);
					if (selectMode == 3 && drawSelection) {
						let selected = BlockEditor.data.renderer;
						model.addBox(box.x1, box.y1, box.z1,
							box.x2, box.y2, box.z2, i == selected ? "renderer_select" :
							"renderer_unselect", transparentBoxes ? 1 : 0);
					} else if (selectMode == 9) {
						let selected = BlockEditor.data.rendererInst,
							innersection = models[m].checkBoxesInnersection(selected, i);
						model.addBox(box.x1, box.y1, box.z1,
							box.x2, box.y2, box.z2, i == selected ? "renderer_select" :
							innersection ? "renderer_innersection" : "renderer_unselect", transparentBoxes ? 1 : 0);
					} else {
						let texture = box.texture;
						if (texture) {
							if (texture.length > 1)
								model.addBox(box.x1, box.y1, box.z1,
									box.x2, box.y2, box.z2, box.texture);
							else
								model.addBox(box.x1, box.y1, box.z1, box.x2,
									box.y2, box.z2, box.texture[0][0], box.texture[0][1]);
						} else
							model.addBox(box.x1, box.y1, box.z1, box.x2,
								box.y2, box.z2, "missing_block", 0);
					}
				}
				render.addEntry(model);
			}
		}
		if (collisions.length > 0 && selectMode != 9) {
			for (let m = 0; m < collisions.length; m++) {
				let model = BlockRenderer.createModel(),
					collision = form.addEntry(),
					boxes = collisions[m].getBoxes();
				for (let i = 0; i < boxes.length; i++) {
					let box = (hasCollision = true, boxes[i]);
					if (selectMode == 11 && drawSelection) {
						let selected = BlockEditor.data.collision;
						model.addBox(box.x1, box.y1, box.z1,
							box.x2, box.y2, box.z2, i == selected ? "renderer_select" :
							"renderer_unselect", transparentBoxes ? 1 : 0);
					} else if (selectMode == 10) {
						let selected = BlockEditor.data.collisionInst,
							innersection = collisions[m].checkBoxesInnersection(selected, i);
						model.addBox(box.x1, box.y1, box.z1,
							box.x2, box.y2, box.z2, i == selected ? "renderer_select" :
							innersection ? "renderer_innersection" : "renderer_unselect", transparentBoxes ? 1 : 0);
					} else if (MenuWindow.isSelected(2))
						model.addBox(box.x1, box.y1, box.z1, box.x2,
							box.y2, box.z2, "renderer_shape", transparentBoxes ? 1 : 0);
					collision.addBox(box.x1, box.y1, box.z1,
						box.x2, box.y2, box.z2);
				}
				render.addEntry(model);
			}
		}
		if (shape && selectMode != 9 && selectMode != 10) {
			if (selectMode == 5) render.addEntry(new BlockRenderer.Model(shape.x1, shape.y1,
				shape.z1, shape.x2, shape.y2, shape.z2, "renderer_shape", transparentBoxes ? 1 : 0));
			else if (!hasRenderer && (!hasCollision || !MenuWindow.isSelected(2)))
				render.addEntry(new BlockRenderer.Model(shape.x1, shape.y1, shape.z1,
					shape.x2, shape.y2, shape.z2, "renderer_shape", transparentBoxes ? 1 : 0));
		}
		// Usage only by id and meta, but it rewrite fully
		// BlockRenderer.setCustomCollisionShape(id, meta, form);
		for (let i = 0; i < mapped.length; i++)
			checkMapping(mapped[i].x, mapped[i].y, mapped[i].z, render);
		autosavePeriod == 0 && ProjectEditor.getProject().callAutosave();
		removeUnusedMappings(), checkMapping.current = new Array();
		return true;
	} catch(e) {
		reportError(e);
	}
	return false;
}

let BlockEditor = {
	data: new Object(),
	reset: function() {
		this.data.worker = ProjectEditor.addBlock();
		ProjectEditor.setOpenedState(true);
		this.data.worker.Renderer.createModel();
		this.data.worker.Collision.createModel();
		if (!saveCoords) removeMappings(), removeUnusedMappings();
		else this.data.worker.Define.params.mapped = copyMappings();
		this.unselect();
	},
	unselect: function() {
		this.data.renderer = this.data.collision = -1;
		Popups.closeIfOpened("renderer_select");
		Popups.closeIfOpened("collision_select");
		delete this.data.selected;
	},
	create: function() {
		let autosaveable = !ProjectEditor.isOpened();
		if (!this.data.worker) this.reset();
		autosaveable && ProjectEditor.initializeAutosave();
		this.data.hasRender = this.data.worker.Renderer.getModelCount() > 0
			&& this.data.worker.Renderer.getModel(0).getBoxCount() > 0;
		this.data.hasCollision = this.data.worker.Collision.getModelCount() > 0
			&& this.data.worker.Collision.getModel(0).getBoxCount() > 0;
		
		let button = new ControlButton();
		button.setIcon("menu");
		button.setOnClickListener(function() {
			BlockEditor.menu();
			menu.dismiss();
		});
		button.show();
		
		let menu = new MenuWindow();
		let group = menu.addGroup("block");
		group.addItem("blockModuleIdentifier", this.rename);
		group.addItem("blockModuleVariation", this.variation);
		group.addItem("blockModuleTexture", null).setBackground("popupSelectionLocked");
		group.addItem("blockModuleType", this.type);
		group.addItem("blockModuleShape", this.shape);
		group.addItem("blockRenderReload", this.reload);
		group = menu.addGroup("blockBoxBoxes");
		if (this.data.hasRender) {
			group.addItem("blockBoxBoxes", this.Renderer.select);
			group.addItem("blockBoxAdd", this.Renderer.add);
			group.addItem("blockBoxResize", this.Renderer.resize);
			group.addItem("blockBoxMove", this.Renderer.move);
			group.addItem("blockBoxMirror", this.Renderer.mirror);
			if (__code__.startsWith("develop")) {
				group.addItem("blockBoxRotate", this.Renderer.rotate);
			}
			group.addItem("blockBoxTexture", this.Renderer.texture);
			group.addItem("blockBoxRemove", this.Renderer.remove);
		} else group.addItem("blockBoxAdd", this.Renderer.add);
		group = menu.addGroup("blockModuleShape");
		if (this.data.hasCollision) {
			group.addItem("blockBoxBoxes", this.Collision.select);
			group.addItem("blockBoxAdd", this.Collision.add);
			group.addItem("blockBoxResize", this.Collision.resize);
			group.addItem("blockBoxMove", this.Collision.move);
			group.addItem("blockBoxMirror", this.Collision.mirror);
			if (__code__.startsWith("develop")) {
				group.addItem("blockBoxRotate", this.Collision.rotate);
			}
			group.addItem("blockBoxRemove", this.Collision.remove);
		} else group.addItem("blockBoxAdd", this.Collision.add);
		this.data.selected >= 0 && menu.selectGroup(this.data.selected);
		menu.setOnSelectListener(function(group, index, selected, count) {
			if (selected) (mapRenderBlock(BlockEditor.data.worker),
				BlockEditor.data.selected = index);
			else {
				delete BlockEditor.data.selected;
				selectMode = 0, mapRenderBlock(BlockEditor.data.worker);
			}
		});
		menu.show();
		
		mapRenderBlock(this.data.worker);
	},
	menu: function(view) {
		let control = new ControlWindow();
		control.setOnClickListener(function() {
			BlockEditor.create();
		}).addHeader();
		let category = control.addCategory(translate("Editor"));
		category.addItem("menuProjectLoad", translate("Open"), function() {
			let formats = [".dnp", ".ndb", ".js"];
			if (ModelConverter) formats.push(".json");
			selectFile(formats, function(file) {
				BlockEditor.replace(file);
			});
		});
		category.addItem("menuProjectImport", translate("Import"), function() {
			let formats = [".dnp", ".ndb", ".js"];
			if (ModelConverter) formats.push(".json");
			selectFile(formats, function(file) {
				BlockEditor.add(file);
			});
		});
		category.addItem("menuProjectSave", translate("Export"), function() {
			saveFile(BlockEditor.data.name, [".dnp", ".js"], function(file, i) {
				BlockEditor.save(file, i);
			});
		});
		category.addItem("menuProjectLeave", translate("Back"), function() {
			control.dismiss();
			Popups.closeAll(), BlockEditor.unselect();
			ProjectEditor.setOpenedState(false);
			ProjectEditor.getProject().callAutosave();
			delete BlockEditor.data.worker;
			StartEditor.menu();
		});
		checkForAdditionalInformation(control);
		category = control.addCategory(translate("Block"));
		category.addItem("blockRenderTexture", translate("Map"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't map render at menu"));
				return;
			}
			showHint(translate("Tap block"));
			control.dismiss();
			selectMode = 1;
			
			let button = new ControlButton();
			button.setIcon("menuModuleBack");
			button.setOnClickListener(function() {
				BlockEditor.create();
				selectMode = 0;
			});
			button.show();
		});
		category.addItem("blockRenderReload", translate("Remap"), function() {
			selectMode = 0;
			if (mapRenderBlock(BlockEditor.data.worker))
				showHint(translate("Render updated"));
			else if (!removeUnusedMappings())
				showHint(translate("Nothing to update"));
		});
		let hasRemoveMessage = false;
		category.addItem("blockRenderRemove", translate("Unmap"), function() {
			if (!hasMappings()) {
				showHint(translate("Nothing to remove"));
				return;
			}
			if (!hasRemoveMessage) {
				let message = control.addMessage("menuModuleWarning", translate("All mappings will be removed.") + " " + translate("Touch here to confirm."),
					function() {
						BlockEditor.data.worker.Define.params.mapped = new Array();
						if (!removeMappings()) showHint(translate("Nothing to remove"));
						control.removeElement(message);
					});
				handle(function() {
					control.scrollToElement(message);
				}, 500);
				handle(function() {
					control.removeElement(message);
					hasRemoveMessage = false;
				}, 5000);
				hasRemoveMessage = true;
			}
		});
		category.addItem("blockModuleType", translate("In-section"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't check innersection at menu"));
				return;
			}
			if (!BlockEditor.data.hasRender && !BlockEditor.data.hasCollision) {
				showHint(translate("Nothing to check"));
				return;
			}
			showHint(translate("Manually view boxes innersection"));
			Popups.closeAll(), control.dismiss();
			
			let button = new ControlButton();
			button.setIcon("menuModuleBack");
			button.setOnClickListener(function() {
				Popups.closeAllByTag("innersection");
				delete BlockEditor.data.rendererInst;
				delete BlockEditor.data.collisionInst;
				selectMode = 0, BlockEditor.create();
			});
			button.show();
			
			let renderer;
			if (BlockEditor.data.hasRender) {
				renderer = new ListingPopup();
				renderer.setTitle(translate("Renderer"));
				renderer.setSelectMode(true);
				renderer.setOnSelectListener(function(index) {
					selectMode = 9;
					BlockEditor.data.rendererInst = index;
					mapRenderBlock(BlockEditor.data.worker);
					collision && collision.unselect();
				});
				for (let i = 0; i < BlockEditor.data.worker.Renderer.getModel(0).getBoxCount(); i++)
					renderer.addButtonElement(translate("Box %s", i + 1));
				renderer.selectButton(0);
				Popups.open(renderer, "innersection_renderer");
			}
			
			let collision;
			if (BlockEditor.data.hasCollision) {
				collision = new ListingPopup();
				collision.setTitle(translate("Collision"));
				collision.setSelectMode(true);
				collision.setOnSelectListener(function(index) {
					selectMode = 10;
					BlockEditor.data.collisionInst = index;
					mapRenderBlock(BlockEditor.data.worker);
					renderer && renderer.unselect();
				});
				for (let i = 0; i < BlockEditor.data.worker.Collision.getModel(0).getBoxCount(); i++)
					collision.addButtonElement(translate("Box %s", i + 1));
				if (!BlockEditor.data.hasRender) collision.selectButton(0);
				Popups.open(collision, "innersection_collision");
			}
		});
		checkForAdditionalInformation(control);
		resetAdditionalInformation();
		control.show();
	},
	open: function(index) {
		let obj = ProjectEditor.getEditorById(index);
		if (!obj) {
			showHint(translate("Can't find opened editor at %s position", index));
			return false;
		}
		let worker = this.data.worker = new BlockWorker(obj);
		ProjectEditor.setupEditor(index, worker);
		ProjectEditor.setOpenedState(true);
		BlockEditor.unselect(), BlockEditor.create();
		return true;
	},
	add: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				handle(function() {
					active = Date.now() - active;
					selectProjectData(result, function(selected) {
						active = Date.now() - active;
						let current = BlockEditor.data.worker.getProject();
						selected.forEach(function(element, index) {
							current = assign(current, element);
						});
						BlockEditor.data.worker.loadProject(current);
						mapRenderBlock(BlockEditor.data.worker);
						showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
					});
				});
			});
		} else if (name.endsWith(".json")) {
			let active = Date.now();
			convertJsonBlock(Files.read(file), function(result) {
				let current = BlockEditor.data.worker.getProject(),
					assigned = assign(current, result);
				BlockEditor.data.worker.loadProject(assigned);
				mapRenderBlock(BlockEditor.data.worker);
				showHint(translate("Converted success") + " " + translate("as %s ms", Date.now() - active));
			});
		} else if (name.endsWith(".ndb")) {
			let active = Date.now();
			handle(function() {
				let current = BlockEditor.data.worker.getProject(),
					obj = compileData(Files.read(file)),
					result = convertNdb(obj),
					assigned = assign(current, result);
				BlockEditor.data.worker.loadProject(assigned);
				mapRenderBlock(BlockEditor.data.worker);
				showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
			});
		}
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
						BlockEditor.data.worker.loadProject(selected);
						mapRenderBlock(BlockEditor.data.worker);
						showHint(translate("Loaded success") + " " + translate("as %s ms", Date.now() - active));
					}, true);
				});
			});
		} else if (name.endsWith(".json")) {
			let active = Date.now();
			convertJsonBlock(Files.read(file), function(result) {
				BlockEditor.data.worker.loadProject(result);
				mapRenderBlock(BlockEditor.data.worker);
				showHint(translate("Converted success") + " " + translate("as %s ms", Date.now() - active));
			});
		} else if (name.endsWith(".ndb")) {
			let active = Date.now();
			handle(function() {
				let current = BlockEditor.data.worker.getProject(),
					obj = compileData(Files.read(file)),
					result = convertNdb(obj);
				BlockEditor.data.worker.loadProject(result);
				mapRenderBlock(BlockEditor.data.worker);
				showHint(translate("Imported success") + " " + translate("as %s ms", Date.now() - active));
			});
		}
		Popups.closeAll();
		BlockEditor.unselect();
	},
	save: function(file, i) {
		let name = (BlockEditor.data.name = i, file.getName()),
			project = BlockEditor.data.worker.getProject();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			handle(function() {
				let converter = new BlockConverter();
				converter.attach(project);
				converter.executeAsync(function(result) {
					handle(function() {
						Files.write(file, result);
						showHint(translate("Converted success") + " " + translate("as %s ms", Date.now() - active));
					});
				});
			});
		}
	},
	reload: function(view) {
		if (mapRenderBlock(BlockEditor.data.worker)) {
			showHint(translate("Render updated"));
		} else showHint(translate("Nothing to update"));
	},
	Renderer: {
		hasSelection: function() {
			return BlockEditor.data.renderer >= 0;
		},
		select: function(view) {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			popup.setSelectMode(true);
			popup.setOnHideListener(function() {
				selectMode = 0;
				mapRenderBlock(BlockEditor.data.worker);
			});
			for (let i = 0; i < BlockEditor.data.worker.Renderer.getModel(0).getBoxCount(); i++)
				popup.addButtonElement(translate("Box %s", i + 1));
			popup.setOnSelectListener(function(index) {
				selectMode = 3;
				BlockEditor.data.renderer = index;
				mapRenderBlock(BlockEditor.data.worker);
			});
			popup.selectButton(BlockEditor.data.renderer);
			Popups.open(popup, "renderer_select");
		},
		add: function(view) {
			if (BlockEditor.data.hasRender) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let index = (BlockEditor.data.renderer = BlockEditor.data.worker.Renderer.getModel(0).addBox(1, 0));
					showHint(translate("Box %s added", index + 1));
					mapRenderBlock(BlockEditor.data.worker);
				});
				popup.addButtonElement(translate("Copy current"), function() {
					let last = BlockEditor.data.renderer, index = (BlockEditor.data.renderer = BlockEditor.data.worker.Renderer.getModel(0).cloneBox(last));
					showHint(translate("Box %s cloned to %s", [last + 1, index + 1]));
					mapRenderBlock(BlockEditor.data.worker);
				});
				Popups.open(popup, "renderer_add");
			} else {
				BlockEditor.data.renderer = BlockEditor.data.worker.Renderer.getModel(0).addBox(1, 0);
				BlockEditor.create();
				showHint(translate("First box added"));
				mapRenderBlock(BlockEditor.data.worker);
			}
		},
		resize: function(view) {
			if (!BlockEditor.Renderer.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.renderer,
				box = BlockEditor.data.worker.Renderer.getModel(0).getBox(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Scretch"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Renderer.getModel(0).scretchBox(selected, index == 0 ? "x1" : "x2", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.x1);
			group.addItem(box.x2);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Renderer.getModel(0).scretchBox(selected, index == 0 ? "y1" : "y2", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.y1);
			group.addItem(box.y2);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Renderer.getModel(0).scretchBox(selected, index == 0 ? "z1" : "z2", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.z1);
			group.addItem(box.z2);
			Popups.open(popup, "renderer_resize");
		},
		move: function(view) {
			if (!BlockEditor.Renderer.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.renderer,
				box = BlockEditor.data.worker.Renderer.getModel(0).getBox(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Renderer.getModel(0).moveBox(selected, "x", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.x1);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Renderer.getModel(0).moveBox(selected, "y", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.y1);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Renderer.getModel(0).moveBox(selected, "z", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.z1);
			Popups.open(popup, "renderer_move");
		},
		mirror: function(view) {
			if (!BlockEditor.Renderer.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.renderer,
				box = BlockEditor.data.worker.Renderer.getModel(0).getBox(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Mirror"));
			popup.addButtonElement("X", function() {
				BlockEditor.data.worker.Renderer.getModel(0).mirrorBoxAtX(selected);
				mapRenderBlock(BlockEditor.data.worker);
			});
			popup.addButtonElement("Y", function() {
				BlockEditor.data.worker.Renderer.getModel(0).mirrorBoxAtY(selected);
				mapRenderBlock(BlockEditor.data.worker);
			});
			popup.addButtonElement("Z", function() {
				BlockEditor.data.worker.Renderer.getModel(0).mirrorBoxAtZ(selected);
				mapRenderBlock(BlockEditor.data.worker);
			});
			Popups.open(popup, "renderer_mirror");
		},
		rotate: function(view) {
			if (!BlockEditor.Renderer.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.renderer,
				box = BlockEditor.data.worker.Renderer.getModel(0).getBox(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Rotate"));
			popup.addEditElement(translate("Side"), "X");
			popup.addButtonElement(translate("At %s angle", 90));
			popup.addButtonElement(translate("At %s angle", 180));
			popup.addButtonElement(translate("At %s angle", 270));
			popup.setOnClickListener(function(index) {
				let values = popup.getAllEditsValues(),
					side = compileData(values[0], "string").toLowerCase(),
					orientate = side == "z" ? 2 : side == "y" ? 1 : 0;
				BlockEditor.data.worker.Renderer.getModel(0).rotateBox(selected, orientate, index);
				showHint(translate("Box rotated at %s angle", (index + 1) * 90));
				mapRenderBlock(BlockEditor.data.worker);
			});
			Popups.open(popup, "renderer_rotate");
		},
		texture: function(view) {
			if (!BlockEditor.Renderer.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.renderer,
				box = BlockEditor.data.worker.Renderer.getModel(0).getBox(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Texture"));
			popup.setOnClickListener(function(index) {
				index > 1 && selectTexture(index - 2, function(name, data) {
					BlockEditor.data.worker.Renderer.getModel(0).textureBox(selected, name, data);
					mapRenderBlock(BlockEditor.data.worker);
					Popups.updateAtName("box_texture");
					showHint(translate("Texture changed"));
				});
			});
			popup.addButtonElement(translate("Enter array"), function() {
				edit.switchVisibility() && button.switchVisibility();
			});
			let edit = popup.addEditElement(translate("Texture"), JSON.stringify(box.texture)).
				switchVisibility().setBackground("ground");
			let button = popup.addButtonElement(translate("Save"), function() {
				let array = compileData(popup.getEdit(0).getValue());
				if (!array) showHint(translate("Array is incorrect"), Ui.Color.YELLOW);
				else {
					BlockEditor.data.worker.Renderer.getModel(0).textureBox(selected, array);
					mapRenderBlock(BlockEditor.data.worker);
					showHint(translate("Texture changed"));
				}
			}).switchVisibility().setBackground("ground");
			for (let i = 0; i < textures.length; i++) {
				popup.addButtonElement(textures[i].name);
			}
			Popups.open(popup, "renderer_texture");
		},
		remove: function() {
			if (!BlockEditor.Renderer.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this box?"),
				function() {
					BlockEditor.data.worker.Renderer.getModel(0).removeBox(BlockEditor.data.renderer);
					BlockEditor.data.renderer = BlockEditor.data.renderer > 0 ? BlockEditor.data.renderer - 1 : 0;
					if (BlockEditor.data.worker.Renderer.getModel(0).getBoxCount() == 0) BlockEditor.create();
					else mapRenderBlock(BlockEditor.data.worker);
					Popups.closeAllByTag("renderer");
					showHint(translate("Box deleted"));
				});
		}
	},
	Collision: {
		hasSelection: function() {
			return BlockEditor.data.collision >= 0;
		},
		select: function(view) {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			popup.setSelectMode(true);
			popup.setOnHideListener(function() {
				selectMode = 0;
				mapRenderBlock(BlockEditor.data.worker);
			});
			for (let i = 0; i < BlockEditor.data.worker.Collision.getModel(0).getBoxCount(); i++) {
				popup.addButtonElement(translate("Box %s", i + 1));
			}
			popup.setOnSelectListener(function(index) {
				selectMode = 11;
				BlockEditor.data.collision = index;
				mapRenderBlock(BlockEditor.data.worker);
			});
			popup.selectButton(BlockEditor.data.collision);
			Popups.open(popup, "collision_select");
		},
		add: function(view) {
			if (BlockEditor.data.hasCollision) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let index = (BlockEditor.data.collision = BlockEditor.data.worker.Collision.getModel(0).addBox());
					showHint(translate("Box %s added", index + 1));
					mapRenderBlock(BlockEditor.data.worker);
				});
				popup.addButtonElement(translate("Copy current"), function() {
					let last = BlockEditor.data.collision, index = (BlockEditor.data.collision = BlockEditor.data.worker.Collision.getModel(0).cloneBox(last));
					showHint(translate("Box %s cloned to %s", [last + 1, index + 1]));
					mapRenderBlock(BlockEditor.data.worker);
				});
				Popups.open(popup, "collision_add");
			} else {
				BlockEditor.data.collision = BlockEditor.data.worker.Collision.getModel(0).addBox();
				BlockEditor.create();
				showHint(translate("First box added"));
				mapRenderBlock(BlockEditor.data.worker);
			}
		},
		resize: function(view) {
			if (!BlockEditor.Collision.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.collision,
				box = BlockEditor.data.worker.Collision.getModel(0).getBox(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Scretch"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Collision.getModel(0).scretchBox(selected, index == 0 ? "x1" : "x2", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.x1);
			group.addItem(box.x2);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Collision.getModel(0).scretchBox(selected, index == 0 ? "y1" : "y2", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.y1);
			group.addItem(box.y2);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Collision.getModel(0).scretchBox(selected, index == 0 ? "z1" : "z2", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.z1);
			group.addItem(box.z2);
			Popups.open(popup, "collision_resize");
		},
		move: function(view) {
			if (!BlockEditor.Collision.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.collision,
				box = BlockEditor.data.worker.Collision.getModel(0).getBox(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Collision.getModel(0).moveBox(selected, "x", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.x1);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Collision.getModel(0).moveBox(selected, "y", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.y1);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				BlockEditor.data.worker.Collision.getModel(0).moveBox(selected, "z", value);
				mapRenderBlock(BlockEditor.data.worker);
			});
			group.addItem(box.z1);
			Popups.open(popup, "collision_move");
		},
		mirror: function(view) {
			if (!BlockEditor.Collision.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.collision,
				box = BlockEditor.data.worker.Collision.getModel(0).getBox(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Mirror"));
			popup.addButtonElement("X", function() {
				BlockEditor.data.worker.Collision.getModel(0).mirrorBoxAtX(selected);
				mapRenderBlock(BlockEditor.data.worker);
			});
			popup.addButtonElement("Y", function() {
				BlockEditor.data.worker.Collision.getModel(0).mirrorBoxAtY(selected);
				mapRenderBlock(BlockEditor.data.worker);
			});
			popup.addButtonElement("Z", function() {
				BlockEditor.data.worker.Collision.getModel(0).mirrorBoxAtY(selected);
				mapRenderBlock(BlockEditor.data.worker);
			});
			Popups.open(popup, "collision_mirror");
		},
		rotate: function(view) {
			if (!BlockEditor.Collision.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			let selected = BlockEditor.data.collision,
				box = BlockEditor.data.worker.Collision.getModel(0).getBox(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Rotate"));
			popup.addEditElement(translate("Side"), "X");
			popup.addButtonElement(translate("At %s angle", 90));
			popup.addButtonElement(translate("At %s angle", 180));
			popup.addButtonElement(translate("At %s angle", 270));
			popup.setOnClickListener(function(index) {
				let values = popup.getAllEditsValues(),
					side = compileData(values[0], "string").toLowerCase(),
					orientate = side == "z" ? 2 : side == "y" ? 1 : 0;
				BlockEditor.data.worker.Collision.getModel(0).rotateBox(selected, orientate, index);
				showHint(translate("Box rotated at %s angle", (index + 1) * 90));
				mapRenderBlock(BlockEditor.data.worker);
			});
			Popups.open(popup, "collision_rotate");
		},
		remove: function() {
			if (!BlockEditor.Collision.hasSelection()) {
				showHint(translate("Nothing chosen"));
				return;
			}
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this box?"),
				function() {
					BlockEditor.data.worker.Collision.getModel(0).removeBox(BlockEditor.data.collision);
					BlockEditor.data.collision = BlockEditor.data.collision > 0 ? BlockEditor.data.collision - 1 : 0;
					if (BlockEditor.data.worker.Collision.getModel(0).getBoxCount() == 0) BlockEditor.create();
					else mapRenderBlock(BlockEditor.data.worker);
					Popups.closeAllByTag("collision");
					showHint(translate("Box deleted"));
				});
		}
	},
	shape: function(view) {
		let params = BlockEditor.data.worker.Define.params,
			shape = params.shape = params.shape || {
				x1: 0, y1: 0, z1: 0,
				x2: 1, y2: 1, z2: 1
			};
		let popup = new CoordsPopup();
		popup.setTitle(translate("Shape"));
		popup.setOnShowListener(function() {
			selectMode = 5;
			mapRenderBlock(BlockEditor.data.worker);
		});
		popup.setOnHideListener(function() {
			selectMode = 0;
			mapRenderBlock(BlockEditor.data.worker);
		});
		let group = popup.addGroup("x");
		group.setOnChangeListener(function(index, value) {
			shape["x" + (index + 1)] = value;
			selectMode = 5;
			mapRenderBlock(BlockEditor.data.worker);
		});
		group.addItem(shape.x1);
		group.addItem(shape.x2);
		group = popup.addGroup("y");
		group.setOnChangeListener(function(index, value) {
			shape["y" + (index + 1)] = value;
			selectMode = 5;
			mapRenderBlock(BlockEditor.data.worker);
		});
		group.addItem(shape.y1);
		group.addItem(shape.y2);
		group = popup.addGroup("z");
		group.setOnChangeListener(function(index, value) {
			shape["z" + (index + 1)] = value;
			selectMode = 5;
			mapRenderBlock(BlockEditor.data.worker);
		});
		group.addItem(shape.z1);
		group.addItem(shape.z2);
		Popups.open(popup, "shape");
	},
	rename: function(view) {
		let define = BlockEditor.data.worker.Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("Rename"));
		popup.addEditElement(translate("ID"), define.getIdentificator());
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			define.setIdentificator(values[0]);
			showHint(translate("Data saved"));
		}).setBackground("ground");
		Popups.open(popup, "rename");
	},
	variation: function(view) {
		let define = BlockEditor.data.worker.Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("Data"));
		popup.addEditElement(translate("Define"), define.getDefineData() || "[]");
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues(),
				result = compileData(values[0]);
			if (result instanceof Error) {
				confirm(translate("Compilation failed"),
					translate("Looks like, you entered invalid array. Check it with following exception:") + "\n" + result.message +
					"\n\n" + translate("Force save define data?"), function() {
						define.setDefineData(values[0]);
						showHint(translate("Data saved"));
					});
				return;
			}
			define.setDefineData(values[0]);
			showHint(translate("Data saved"));
		}).setBackground("ground");
		Popups.open(popup, "variation");
	},
	type: function(view) {
		let define = BlockEditor.data.worker.Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("Type"));
		popup.addEditElement(translate("Special"), define.getSpecialType() || "{}");
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues(),
				result = compileData(values[0]);
			if (result instanceof Error) {
				confirm(translate("Compilation failed"),
					translate("Looks like, you entered invalid object. Check it with following exception:") + "\n" + result.message +
					"\n\n" + translate("Force save special type?"), function() {
						define.setSpecialType(values[0]);
						showHint(translate("Data saved"));
					});
				return;
			}
			define.setSpecialType(values[0]);
			showHint(translate("Data saved"));
		}).setBackground("ground");
		Popups.open(popup, "type");
	}
};
