const textures = new Array();

const addTextureMod = function(name) {
	return textures.push({
		name: name,
		items: new Array()
	}) - 1;
};

const addTexture = function(index, name, data) {
	if (typeof data != "number") {
		data = Number(data);
	}
	let slash = String(name).lastIndexOf("/");
	if (slash != -1) name = name.substring(slash + 1);
	if (isBlockTextureLoaded(name, data)) {
		textures[index].items.push([name, data]);
	}
};

const isBlockTextureLoaded = function(name, data) {
	let valid = isBlockTextureLoaded.isValid(name, data);
	return valid !== null ? Boolean(valid) : true;
};

isBlockTextureLoaded.isValid = requireMethod("mod.resource.ResourcePackManager", "isValidBlockTexture");

const selectTexture = function(index, onSelect) {
	handle(function() {
		let mod = textures[index];
		if (mod === undefined) {
			showHint(translate("Unknown mod"));
			return;
		}
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_DialogWhenLarge);
		builder.setTitle(mod.name);
		let wrong = new android.widget.LinearLayout(context);
		wrong.setOrientation(Interface.Orientate.VERTICAL);
		wrong.setGravity(Interface.Gravity.CENTER);
		wrong.setPadding(0, Interface.getY(64), 0, Interface.getY(64));
		let icon = new android.widget.ImageView(context);
		icon.setImageDrawable(ImageFactory.getDrawable("blockNoTextures"));
		params = android.widget.LinearLayout.LayoutParams(Interface.getY(180), Interface.getY(180));
		wrong.addView(icon, params);
		let info = new android.widget.TextView(context);
		typeface && info.setTypeface(typeface);
		info.setText(translate("Void itself."));
		info.setGravity(Interface.Gravity.CENTER);
		info.setTextSize(Interface.getFontSize(36));
		info.setTextColor(Interface.Color.WHITE);
		info.setPadding(Interface.getY(20), Interface.getY(20), Interface.getY(20), Interface.getY(20));
		wrong.addView(info);
		if (mod.items.length > 0) {
			let converted = new Array();
			for (let item in mod.items) {
				converted.push(mod.items[item][0] + ", " + mod.items[item][1]);
			}
			builder.setItems(converted, function(d, i) {
				tryout(function() {
					let adapter = dialog.getListView().getAdapter(),
						texture = String(adapter.getItem(i)).split(", ");
					onSelect && onSelect(texture[0], parseInt(texture[1]));
				});
			});
			if (mod.items.length > 1) {
				let layout = new android.widget.LinearLayout(context);
				layout.setGravity(Interface.Gravity.CENTER | Interface.Gravity.BOTTOM);
				layout.setOrientation(Interface.Orientate.VERTICAL);
				wrong.setVisibility(Interface.Visibility.GONE);
				info.setText(translate("Nothing finded."));
				layout.addView(wrong);
				let edit = new android.widget.EditText(context);
				edit.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
					android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
				edit.setHint(translate("search filter") + " " + translate("in %s textures", mod.items.length));
				edit.setTextColor(Interface.Color.WHITE);
				edit.setHintTextColor(Interface.Color.LTGRAY);
				edit.addTextChangedListener({
					onTextChanged: function(text) {
						tryout(function() {
							let adapter = dialog.getListView().getAdapter();
							adapter.getFilter().filter(text, {
								onFilterComplete: function(count) {
									tryout(function() {
										let actor = count > 0 ? new FadeActor() :
											new SlideActor(Interface.Gravity.TOP);
										actor.setInterpolator(new DecelerateInterpolator());
										actor.addListener({
											onTransitionStart: function(transition) {
												tryout(function() {
													dialog.getListView().setVisibility(Interface.Visibility.GONE);
												});
											},
											onTransitionEnd: function(transition) {
												tryout(function() {
													dialog.getListView().setVisibility(count > 0 ?
														Interface.Visibility.VISIBLE :
														Interface.Visibility.GONE);
												});
											}
										});
										actor.setDuration(800);
										actor.beginDelayedActor(layout);
										wrong.setVisibility(count > 0 ?
											Interface.Visibility.GONE :
											Interface.Visibility.VISIBLE);
									});
								}
							});
						});
					}
				});
				edit.setBackgroundDrawable(null);
				edit.setMaxLines(1);
				layout.addView(edit);
				builder.setView(layout);
			}
		} else builder.setView(wrong);
		let dialog = builder.create();
		if (mod.items.length > 0) {
			dialog.getWindow().setLayout(Interface.Display.WIDTH / 1.4, Interface.Display.HEIGHT / 1.1);
		} else dialog.getWindow().setLayout(Interface.Display.WIDTH / 1.4, Interface.Display.HEIGHT / 1.4);
		dialog.show();
	});
};

const checkMapping = function(x, y, z, render) {
	let exists = false,
		saved = getSavedMappings();
	for (let i = 0; i < saved.length; i++) {
		let map = saved[i];
		if (map.x == x && map.y == y && map.z == z) {
			exists = true;
			break;
		}
	}
	BlockRenderer.mapAtCoords(x, y, z, render);
	getCurrentMappings().push({ x: x, y: y, z: z });
	if (!exists) {
		saved.push({ x: x, y: y, z: z });
		showHint(translate("Added mapping to %s, %s, %s", [x, y, z]));
	}
};

checkMapping.mapped = new Array();
checkMapping.current = new Array();

const getSavedMappings = function() {
	return checkMapping.mapped;
};

const copyMappings = function() {
	return getSavedMappings().slice();
};

const getCurrentMappings = function() {
	return checkMapping.current;
};

const hasMappings = function() {
	return getSavedMappings().length > 0;
};

const removeUnusedMappings = function() {
	let current = getCurrentMappings(),
		saved = getSavedMappings(),
		hasOne = false;
	for (let i = 0; i < saved.length; i++) {
		let exists = false,
			map = saved[i];
		for (let c = 0; c < current.length; c++) {
			let item = current[c];
			if (map.x == item.x && map.y == item.y && map.z == item.z) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			BlockRenderer.unmapAtCoords(map.x, map.y, map.z);
			saved.splice(i, 1), current.splice(i, 1), (i--, hasOne = true);
			showHint(translate("Removed mapping from %s, %s, %s", [map.x, map.y, map.z]));
		}
	}
	return hasOne;
};

const removeMappings = function() {
	let saved = getSavedMappings(),
		count = 0;
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
};

const CUSTOM_BLOCKS_ID_OFFSET = 8192;

const mapRenderBlock = function(worker) {
	return tryout(function() {
		if (!worker || !Level.isLoaded()) {
			return false;
		}
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
					let box = boxes[i];
					if (selectMode == 3 && drawSelection) {
						let selected = BlockEditor.data.renderer;
						model.addBox(box.x1, box.y1, box.z1,
							box.x2, box.y2, box.z2, i == selected ? "renderer_select" :
							"renderer_unselect", Number(transparentBoxes));
					} else if (selectMode == 9) {
						let selected = BlockEditor.data.rendererInst,
							innersection = models[m].checkBoxesInnersection(selected, i);
						model.addBox(box.x1, box.y1, box.z1,
							box.x2, box.y2, box.z2, i == selected ? "renderer_select" :
							innersection ? "renderer_innersection" : "renderer_unselect", Number(transparentBoxes));
					} else {
						let texture = box.texture;
						if (texture) {
							if (texture.length > 1) {
								model.addBox(box.x1, box.y1, box.z1,
									box.x2, box.y2, box.z2, box.texture);
							} else {
								model.addBox(box.x1, box.y1, box.z1, box.x2,
									box.y2, box.z2, box.texture[0][0], box.texture[0][1]);
							}
						} else {
							model.addBox(box.x1, box.y1, box.z1, box.x2,
								box.y2, box.z2, "missing_block", 0);
						}
					}
					hasRenderer = true;
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
					let box = boxes[i];
					if (selectMode == 11 && drawSelection) {
						let selected = BlockEditor.data.collision;
						model.addBox(box.x1, box.y1, box.z1,
							box.x2, box.y2, box.z2, i == selected ? "renderer_select" :
							"renderer_unselect", Number(transparentBoxes));
					} else if (selectMode == 10) {
						let selected = BlockEditor.data.collisionInst,
							innersection = collisions[m].checkBoxesInnersection(selected, i);
						model.addBox(box.x1, box.y1, box.z1,
							box.x2, box.y2, box.z2, i == selected ? "renderer_select" :
							innersection ? "renderer_innersection" : "renderer_unselect", Number(transparentBoxes));
					} else if (BlockEditor.data.selected == 2) {
						model.addBox(box.x1, box.y1, box.z1, box.x2,
							box.y2, box.z2, "renderer_shape", Number(transparentBoxes));
					}
					collision.addBox(box.x1, box.y1, box.z1,
						box.x2, box.y2, box.z2);
					hasCollision = true;
				}
				render.addEntry(model);
			}
		}
		if (shape && selectMode != 9 && selectMode != 10) {
			if (selectMode == 5) {
				render.addEntry(new BlockRenderer.Model(shape.x1, shape.y1,
					shape.z1, shape.x2, shape.y2, shape.z2, "renderer_shape", Number(transparentBoxes)));
			} else if (!hasRenderer && (!hasCollision || BlockEditor.data.selected != 2)) {
				render.addEntry(new BlockRenderer.Model(shape.x1, shape.y1, shape.z1,
					shape.x2, shape.y2, shape.z2, "renderer_shape", Number(transparentBoxes)));
			}
		}
		for (let i = 0; i < mapped.length; i++) {
			let map = mapped[i],
				x = map.x,
				y = map.y,
				z = map.z;
			checkMapping(x, y, z, render);
			let id = Level.getTile(x, y, z);
			if (id >= CUSTOM_BLOCKS_ID_OFFSET) {
				let meta = Level.getData(x, y, z);
				BlockRenderer.setCustomCollisionShape(id, meta, form);
			}
		}
		autosavePeriod == 0 && ProjectProvider.getProject().callAutosave();
		removeUnusedMappings();
		checkMapping.current = new Array();
		return true;
	}, false);
};

const convertJsonBlock = function(string, action) {
	if (!ModelConverter) return;
	let runned = compileData("(function() {\n" + ModelConverter + "\n" +
		"myFunction();\nreturn {\nvalue: document.getElementById(\"frm2\").value,\n" +
		"logged: console.logged.join(\"\\n\")\n};\n})()",
		"object", {
			document: {
				elements: {
					name: {
						value: string
					},
					frm2: new Object()
				},
				getElementById: function(id) {
					return this.elements[id];
				}
			},
			console: {
				logged: new Array(),
				log: function(e) {
					this.logged.push(e.message);
				}
			}
		});
	if (runned instanceof Error) reportError(runned);
	else if (runned && runned.value) {
		let compiled = compileScript(runned);
		if (compiled && compiled[0]) {
			action && action(compiled[0]);
		} else {
			confirm(translate("Compilation failed"),
				translate("Converter generated invalid script, they can't be runned.") + " " +
				translate("Retry compile with another converted model.") + " " +
				translate("Save exported result?"),
				function() {
					saveFile(translate("converted"), [".js"], function(file) {
						Files.write(file, runned.value);
					});
				});
		}
		if (runned.logged) {
			confirm(translate("Script report"),
				translate("Script logging have several messages:") + "\n" + runned.logged);
		}
	}
};

const mergeConvertedBlock = function(project, source, action) {
	handleThread(function() {
		if (source === null || source === undefined) {
			action && action(project);
			return;
		}
		if (!Array.isArray(source)) source = [source];
		if (project === null || project === undefined) {
			project = new Object();
		}
		source.forEach(function(element, index) {
			if (element === null || element === undefined) {
				return;
			}
			if (element.define !== undefined) {
				let id = element.define.id;
				if (id !== undefined) {
					if (project.define === undefined) project.define = new Object();
					let currently = project.define.id;
					if (currently === undefined || currently.length < id.length) {
						project.define.id = id;
					}
				}
				let data = element.define.data;
				if (data !== undefined) {
					if (project.define === undefined) project.define = new Object();
					let currently = project.define.data;
					if (currently === undefined || currently.length < data.length) {
						project.define.data = data;
					}
				}
				let special = element.define.special;
				if (special !== undefined) {
					if (project.define === undefined) project.define = new Object();
					let currently = project.define.special;
					if (currently === undefined || currently.length < special.length) {
						project.define.special = special;
					}
				}
				let mapped = element.define.mapped;
				if (mapped !== undefined) {
					if (project.define === undefined) project.define = new Object();
					project.define.mapped = merge(project.define.mapped, mapped);
				}
			}
			if (element.renderer !== undefined) {
				let model = element.renderer[0];
				if (model !== undefined) {
					if (project.renderer === undefined) project.renderer = new Array();
					project.renderer[0] = merge(project.renderer[0], model);
				}
			}
			if (element.collision !== undefined) {
				let shape = element.collision[0];
				if (shape !== undefined) {
					if (project.collision === undefined) project.collision = new Array();
					project.collision[0] = merge(project.collision[0], shape);
				}
			}
		});
		action && action(project);
	});
};

const BlockEditor = {
	data: new Object(),
	reset: function() {
		this.data.worker = ProjectProvider.addBlock();
		ProjectProvider.setOpenedState(true);
		this.data.worker.Renderer.createModel();
		this.data.worker.Collision.createModel();
		if (!saveCoords) {
			removeMappings();
			removeUnusedMappings();
		}
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
		let autosaveable = !ProjectProvider.isOpened();
		if (!this.data.worker) this.reset();
		autosaveable && ProjectProvider.initializeAutosave();
		this.data.hasRender = this.data.worker.Renderer.getModelCount() > 0 &&
			this.data.worker.Renderer.getModel(0).getBoxCount() > 0;
		this.data.hasCollision = this.data.worker.Collision.getModelCount() > 0 &&
			this.data.worker.Collision.getModel(0).getBoxCount() > 0;
		let button = new ControlButton();
		button.setIcon("block");
		button.setOnClickListener(function() {
			BlockEditor.menu();
			sidebar.dismiss();
		});
		button.show();
		let sidebar = new SidebarWindow(),
			group = sidebar.addGroup("block");
		group.addItem("blockDefineIdentifier", this.rename);
		group.addItem("blockDefineVariation", this.variation);
		group.addItem("blockDefineTexture", null).setBackground("popupSelectionLocked");
		group.addItem("blockDefineType", this.type);
		group.addItem("blockDefineShape", this.shape);
		group.addItem("blockUpdate", this.reload);
		group.setOnItemFetchListener(function(group, item, groupIndex, itemIndex) {
			if (itemIndex == 0) {
				return translate("Changes block identifier");
			} else if (itemIndex == 1) {
				return translate("Sets block few variations");
			} else if (itemIndex == 2) {
				return translate("Changes variation textures");
			} else if (itemIndex == 3) {
				return translate("Adds special type properties");
			} else if (itemIndex == 4) {
				return translate("Scretches basic collision box");
			} else if (itemIndex == 5) {
				return translate("Updates mapped blocks");
			}
		});
		group = sidebar.addGroup("blockBoxSelect");
		if (this.data.hasRender) {
			group.addItem("blockBoxSelect", this.Renderer.select);
			group.addItem("blockBoxAdd", this.Renderer.add);
			group.addItem("blockBoxScretch", this.Renderer.resize);
			group.addItem("blockBoxMove", this.Renderer.move);
			group.addItem("blockBoxMirror", this.Renderer.mirror);
			group.addItem("blockBoxTexture", this.Renderer.texture);
			group.addItem("blockBoxRemove", this.Renderer.remove);
		} else group.addItem("blockBoxAdd", this.Renderer.add);
		group.setOnItemFetchListener(function(group, item, groupIndex, itemIndex) {
			if (BlockEditor.data.hasRender) {
				if (itemIndex > 4) itemIndex++;
				if (itemIndex == 0) {
					return translate("Selects currently box");
				} else if (itemIndex == 1) {
					return translate("Creates or clones box");
				} else if (itemIndex == 2) {
					return translate("Scretches box sizes");
				} else if (itemIndex == 3) {
					return translate("Moves box location");
				} else if (itemIndex == 4) {
					return translate("Mirrors box belong side");
				} else if (itemIndex == 5) {
					return translate("Rotates box into specified angle");
				} else if (itemIndex == 6) {
					return translate("Changes box texture");
				} else if (itemIndex == 7) {
					return translate("Removes box");
				}
			} else if (itemIndex == 0) {
				return translate("Creates first box");
			}
		});
		group = sidebar.addGroup("blockDefineShape");
		if (this.data.hasCollision) {
			group.addItem("blockBoxSelect", this.Collision.select);
			group.addItem("blockBoxAdd", this.Collision.add);
			group.addItem("blockBoxScretch", this.Collision.resize);
			group.addItem("blockBoxMove", this.Collision.move);
			group.addItem("blockBoxMirror", this.Collision.mirror);
			group.addItem("blockBoxRemove", this.Collision.remove);
		} else group.addItem("blockBoxAdd", this.Collision.add);
		group.setOnItemFetchListener(function(group, item, groupIndex, itemIndex) {
			if (BlockEditor.data.hasCollision) {
				if (itemIndex > 4) itemIndex++;
				if (itemIndex == 0) {
					return translate("Selects currently box");
				} else if (itemIndex == 1) {
					return translate("Creates or clones box");
				} else if (itemIndex == 2) {
					return translate("Scretches box sizes");
				} else if (itemIndex == 3) {
					return translate("Moves box location");
				} else if (itemIndex == 4) {
					return translate("Mirrors box belong side");
				} else if (itemIndex == 5) {
					return translate("Rotates box into specified angle");
				} else if (itemIndex == 6) {
					return translate("Removes box");
				}
			} else if (itemIndex == 0) {
				return translate("Creates first box");
			}
		});
		if (this.data.selected >= 0) sidebar.select(this.data.selected);
		sidebar.setOnGroupSelectListener(function(window, group, index, previous, count) {
			BlockEditor.data.selected = index;
			mapRenderBlock(BlockEditor.data.worker);
		});
		sidebar.setOnGroupUndockListener(function(window, group, index, previous) {
			if (!previous) {
				delete BlockEditor.data.selected;
				selectMode = 0, mapRenderBlock(BlockEditor.data.worker);
			}
		});
		sidebar.setOnGroupFetchListener(function(window, group, index) {
			if (index == 0) {
				return translate("Block define properties");
			} else if (index == 1) {
				return translate("Render models");
			} else if (index == 2) {
				return translate("Collision models");
			}
		});
		sidebar.show();
		mapRenderBlock(this.data.worker);
	},
	menu: function() {
		prepareAdditionalInformation(3, 1);
		let control = new MenuWindow();
		attachWarningInformation(control);
		control.setOnClickListener(function() {
			BlockEditor.create();
		}).addHeader();
		attachAdditionalInformation(control);
		let category = control.addCategory(translate("Editor"));
		category.addItem("menuProjectLoad", translate("Open"), function() {
			let formats = [".dnp", ".ndb", ".js"];
			if (ModelConverter) formats.push(".json");
			selectFile(formats, function(file) {
				BlockEditor.replace(file);
			});
		});
		category.addItem("menuProjectImport", translate("Merge"), function() {
			let formats = [".dnp", ".ndb", ".js"];
			if (ModelConverter) formats.push(".json");
			selectFile(formats, function(file) {
				BlockEditor.merge(file);
			});
		});
		category.addItem("menuProjectSave", translate("Export"), function() {
			saveFile(BlockEditor.data.name, [".dnp", ".js"], function(file, i) {
				BlockEditor.save(file, i);
			});
		});
		category.addItem("menuProjectLeave", translate("Back"), function() {
			control.dismiss();
			Popups.closeAll();
			BlockEditor.unselect();
			ProjectProvider.setOpenedState(false);
			ProjectProvider.getProject().callAutosave();
			checkValidate(function() {
				delete BlockEditor.data.worker;
				ProjectEditor.menu();
			});
		});
		attachAdditionalInformation(control);
		category = control.addCategory(translate("Block"));
		category.addItem("blockMapping", translate("Map"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't map render at menu"));
				return;
			}
			showHint(translate("Tap block"));
			control.dismiss();
			selectMode = 1;
			let button = new ControlButton();
			button.setIcon("menuBack");
			button.setOnClickListener(function() {
				BlockEditor.create();
				selectMode = 0;
			});
			button.show();
		});
		let hasRemoveMessage = false;
		category.addItem("blockRemove", translate("Unmap"), function() {
			if (!hasMappings()) {
				showHint(translate("Nothing to remove"));
				return;
			}
			if (!hasRemoveMessage) {
				let message = control.addMessage("blockSlice", translate("All mappings will be removed.") + " " + translate("Touch here to confirm."),
					function() {
						BlockEditor.data.worker.Define.params.mapped = new Array();
						if (!removeMappings()) {
							showHint(translate("Nothing to remove"));
						}
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
		category.addItem("blockInsection", translate("In-section"), function() {
			if (!Level.isLoaded()) {
				showHint(translate("Can't check innersection at menu"));
				return;
			}
			if (!BlockEditor.data.hasRender && !BlockEditor.data.hasCollision) {
				showHint(translate("Nothing to check"));
				return;
			}
			showHint(translate("Manually view boxes innersection"));
			Popups.closeAll();
			control.dismiss();
			let button = new ControlButton();
			button.setIcon("menuBack");
			button.setOnClickListener(function() {
				Popups.closeAllByTag("innersection");
				delete BlockEditor.data.rendererInst;
				delete BlockEditor.data.collisionInst;
				selectMode = 0;
				BlockEditor.create();
			});
			button.show();
			let renderer, collision;
			if (BlockEditor.data.hasRender) {
				renderer = new ListingPopup();
				renderer.setTitle(translate("Renderer"));
				renderer.setSelectMode(true);
				renderer.setOnSelectListener(function(index) {
					selectMode = 9;
					BlockEditor.data.rendererInst = index;
					mapRenderBlock(BlockEditor.data.worker);
					if (collision) collision.unselect();
				});
				for (let i = 0; i < BlockEditor.data.worker.Renderer.getModel(0).getBoxCount(); i++) {
					renderer.addButtonElement(translate("Box %s", i + 1));
				}
				renderer.selectButton(0);
				Popups.open(renderer, "innersection_renderer");
			}
			if (BlockEditor.data.hasCollision) {
				collision = new ListingPopup();
				collision.setTitle(translate("Collision"));
				collision.setSelectMode(true);
				collision.setOnSelectListener(function(index) {
					selectMode = 10;
					BlockEditor.data.collisionInst = index;
					mapRenderBlock(BlockEditor.data.worker);
					if (renderer) renderer.unselect();
				});
				for (let i = 0; i < BlockEditor.data.worker.Collision.getModel(0).getBoxCount(); i++) {
					collision.addButtonElement(translate("Box %s", i + 1));
				}
				if (!BlockEditor.data.hasRender) {
					collision.selectButton(0);
				}
				Popups.open(collision, "innersection_collision");
			}
		});
		category.addItem("blockUpdate", translate("Reload"), function() {
			selectMode = 0;
			BlockEditor.reload();
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
		let worker = this.data.worker = new BlockWorker(source);
		if (index == -1) index = ProjectProvider.getCount();
		ProjectProvider.setupEditor(index, worker);
		BlockEditor.unselect();
		BlockEditor.create();
		ProjectProvider.setOpenedState(true);
		MenuWindow.dismissCurrently();
		return true;
	},
	merge: function(file) {
		let name = file.getName(),
			project = BlockEditor.data.worker.getProject();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					mergeConvertedBlock(project, selected, function(output) {
						BlockEditor.data.worker.loadProject(output);
						mapRenderBlock(BlockEditor.data.worker);
						showHint(translate("Merged success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
				}, "block");
			});
		} else if (name.endsWith(".json")) {
			let active = Date.now();
			convertJsonBlock(Files.read(file), function(result) {
				mergeConvertedBlock(project, result, function(output) {
					BlockEditor.data.worker.loadProject(output);
					mapRenderBlock(BlockEditor.data.worker);
					showHint(translate("Merged success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			});
		} else if (name.endsWith(".ndb")) {
			let active = Date.now();
			handleThread(function() {
				let obj = compileData(Files.read(file)),
					result = convertNdb(obj);
				mergeConvertedBlock(project, result, function(output) {
					BlockEditor.data.worker.loadProject(output);
					mapRenderBlock(BlockEditor.data.worker);
					showHint(translate("Merged success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			});
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			importScript(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					mergeConvertedBlock(project, selected, function(output) {
						BlockEditor.data.worker.loadProject(output);
						mapRenderBlock(BlockEditor.data.worker);
						showHint(translate("Merged success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
				}, "block");
			});
		}
	},
	replace: function(file) {
		let name = file.getName();
		if (name.endsWith(".dnp")) {
			let active = Date.now();
			importProject(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					BlockEditor.open(selected);
					showHint(translate("Loaded success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				}, "block", true);
			});
		} else if (name.endsWith(".json")) {
			let active = Date.now();
			convertJsonBlock(Files.read(file), function(result) {
				BlockEditor.open(result);
				showHint(translate("Converted success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".ndb")) {
			let active = Date.now();
			tryout(function() {
				let current = BlockEditor.data.worker.getProject(),
					obj = compileData(Files.read(file)),
					result = convertNdb(obj);
				BlockEditor.open(result);
				showHint(translate("Imported success") + " " +
					translate("as %ss", preround((Date.now() - active) / 1000, 1)));
			});
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			importScript(file.getPath(), function(result) {
				active = Date.now() - active;
				selectProjectData(result, function(selected) {
					active = Date.now() - active;
					BlockEditor.open(selected);
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				}, "block", true);
				
			});
		}
	},
	save: function(file, i) {
		let name = (BlockEditor.data.name = i, file.getName()),
			project = BlockEditor.data.worker.getProject();
		if (name.endsWith(".dnp")) {
			exportProject(project, false, file.getPath());
		} else if (name.endsWith(".js")) {
			let active = Date.now();
			tryout(function() {
				let converter = new BlockConverter();
				converter.attach(project);
				converter.executeAsync(function(link, result) {
					if (link.hasResult()) {
						Files.write(file, result);
						showHint(translate("Converted success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					} else reportError(link.getLastException());
				});
			});
		}
	},
	reload: function() {
		if (mapRenderBlock(BlockEditor.data.worker)) {
			showHint(translate("Render updated"));
		} else if (!removeUnusedMappings()) {
			showHint(translate("Nothing to update"));
		}
	},
	Renderer: {
		hasSelection: function() {
			return BlockEditor.data.renderer >= 0;
		},
		select: function() {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			popup.setSelectMode(true);
			popup.setOnDismissListener(function() {
				selectMode = 0;
				mapRenderBlock(BlockEditor.data.worker);
			});
			for (let i = 0; i < BlockEditor.data.worker.Renderer.getModel(0).getBoxCount(); i++) {
				popup.addButtonElement(translate("Box %s", i + 1));
			}
			popup.setOnSelectListener(function(index) {
				selectMode = 3;
				BlockEditor.data.renderer = index;
				mapRenderBlock(BlockEditor.data.worker);
			});
			popup.selectButton(BlockEditor.data.renderer);
			Popups.open(popup, "renderer_select");
		},
		add: function() {
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
				if (BlockEditor.Renderer.hasSelection()) {
					popup.addButtonElement(translate("Copy current"), function() {
						let last = BlockEditor.data.renderer,
							index = (BlockEditor.data.renderer = BlockEditor.data.worker.Renderer.getModel(0).cloneBox(last));
						showHint(translate("Box %s cloned to %s", [last + 1, index + 1]));
						mapRenderBlock(BlockEditor.data.worker);
					});
				}
				Popups.open(popup, "renderer_add");
			} else {
				BlockEditor.data.renderer = BlockEditor.data.worker.Renderer.getModel(0).addBox(1, 0);
				BlockEditor.create();
				showHint(translate("First box added"));
				mapRenderBlock(BlockEditor.data.worker);
			}
		},
		resize: function() {
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
		move: function() {
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
		mirror: function() {
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
		rotate: function() {
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
		texture: function() {
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
				if (edit.switchVisibility()) {
					button.switchVisibility();
				}
			});
			let edit = popup.addEditElement(translate("Texture"), JSON.stringify(box.texture)).
			switchVisibility().setBackground("popup");
			let button = popup.addButtonElement(translate("Save"), function() {
				let array = compileData(popup.getEdit(0).getValue());
				if (array.lineNumber !== undefined) {
					confirm(translate("Compilation failed"),
						translate("Looks like, you entered invalid array. Check it with following exception:") + "\n" + array.message);
				} else if (!Array.isArray(array)) {
					showHint(translate("That's isn't array"), Interface.Color.YELLOW);
				} else {
					for (let i = 0; i < array.length; i++) {
						let texture = array[i];
						if (!Array.isArray(texture)) {
							showHint(translate("Textures array must be contains only arrays inside"), Interface.Color.YELLOW);
							return;
						}
						if (texture.length == 0 || texture.length > 2) {
							showHint(translate("Every element in textures array must have 1 or 2 length"), Interface.Color.YELLOW);
							return;
						}
						for (let s = 0; s < texture.length; s++) {
							let side = texture[s];
							if (typeof side != "number" && typeof side != "string") {
								showHint(translate("Every element in textures array may incudes only strings or numbers"), Interface.Color.YELLOW);
								return;
							}
						}
					}
					BlockEditor.data.worker.Renderer.getModel(0).textureBox(selected, array);
					mapRenderBlock(BlockEditor.data.worker);
					showHint(translate("Textures changed"));
				}
			}).switchVisibility().setBackground("popup");
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
					if (BlockEditor.data.worker.Renderer.getModel(0).getBoxCount() == 0) {
						BlockEditor.create();
					} else mapRenderBlock(BlockEditor.data.worker);
					Popups.closeAllByTag("renderer");
					showHint(translate("Box deleted"));
				});
		}
	},
	Collision: {
		hasSelection: function() {
			return BlockEditor.data.collision >= 0;
		},
		select: function() {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			popup.setSelectMode(true);
			popup.setOnDismissListener(function() {
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
		add: function() {
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
				if (BlockEditor.Collision.hasSelection()) {
					popup.addButtonElement(translate("Copy current"), function() {
						let last = BlockEditor.data.collision,
							index = (BlockEditor.data.collision = BlockEditor.data.worker.Collision.getModel(0).cloneBox(last));
						showHint(translate("Box %s cloned to %s", [last + 1, index + 1]));
						mapRenderBlock(BlockEditor.data.worker);
					});
				}
				Popups.open(popup, "collision_add");
			} else {
				BlockEditor.data.collision = BlockEditor.data.worker.Collision.getModel(0).addBox();
				BlockEditor.create();
				showHint(translate("First box added"));
				mapRenderBlock(BlockEditor.data.worker);
			}
		},
		resize: function() {
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
		move: function() {
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
		mirror: function() {
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
		rotate: function() {
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
					if (BlockEditor.data.worker.Collision.getModel(0).getBoxCount() == 0) {
						BlockEditor.create();
					} else {
						mapRenderBlock(BlockEditor.data.worker);
					}
					Popups.closeAllByTag("collision");
					showHint(translate("Box deleted"));
				});
		}
	},
	shape: function() {
		let params = BlockEditor.data.worker.Define.params,
			shape = params.shape = params.shape || {
				x1: 0,
				y1: 0,
				z1: 0,
				x2: 1,
				y2: 1,
				z2: 1
			};
		let popup = new CoordsPopup();
		popup.setTitle(translate("Shape"));
		popup.setOnShowListener(function() {
			selectMode = 5;
			mapRenderBlock(BlockEditor.data.worker);
		});
		popup.setOnDismissListener(function() {
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
	rename: function() {
		let define = BlockEditor.data.worker.Define;
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
	variation: function() {
		let define = BlockEditor.data.worker.Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("Data"));
		popup.addEditElement(translate("Define"), define.getDefineData() || "[{}]");
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues(),
				result = compileData(values[0]);
			if (result instanceof Error) {
				confirm(translate("Compilation failed"),
					translate("Looks like, you entered invalid array. Check it with following exception:") + "\n" + result.message +
					"\n\n" + translate("Force save define data?"),
					function() {
						define.setDefineData(String(values[0]));
						showHint(translate("Data saved"));
					});
				return;
			}
			define.setDefineData(String(values[0]));
			showHint(translate("Data saved"));
		}).setBackground("popup");
		Popups.open(popup, "variation");
	},
	type: function() {
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
					"\n\n" + translate("Force save special type?"),
					function() {
						define.setSpecialType(String(values[0]));
						showHint(translate("Data saved"));
					});
				return;
			}
			define.setSpecialType(String(values[0]));
			showHint(translate("Data saved"));
		}).setBackground("popup");
		Popups.open(popup, "type");
	}
};
