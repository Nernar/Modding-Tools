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
	if (isInstant) return name !== null && data >= 0;
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
		builder.setTitle(String(mod.name));
		let wrong = new android.widget.LinearLayout(context);
		wrong.setOrientation(Interface.Orientate.VERTICAL);
		wrong.setGravity(Interface.Gravity.CENTER);
		wrong.setPadding(0, Interface.getY(64), 0, Interface.getY(64));
		let icon = new android.widget.ImageView(context),
			drawable = AnimationDrawable.parseJson(["blockDefineTexture", "blockDefineWrong"]);
		drawable.setDefaultDuration(1500);
		drawable.attachAsImage(icon);
		params = android.widget.LinearLayout.LayoutParams(Interface.getY(180), Interface.getY(180));
		wrong.addView(icon, params);
		let info = new findAssertionPackage().android.widget.ToneTypingTextView(context);
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

const mapRenderBlock = function(tool) {
	return tryout(function() {
		let worker = tool.getWorker();
		if (!Level.isLoaded()) {
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
					hasRenderer = true;
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
									box.x2, box.y2, box.z2, texture);
								continue;
							} else if (texture.length == 1) {
								texture = texture[0];
								if (texture.length > 1) {
									model.addBox(box.x1, box.y1, box.z1, box.x2,
										box.y2, box.z2, texture[0], texture[1]);
									continue;
								} else if (texture.length == 1) {
									model.addBox(box.x1, box.y1, box.z1, box.x2,
										box.y2, box.z2, texture[0], 0);
									continue;
								}
							}
						}
						model.addBox(box.x1, box.y1, box.z1, box.x2, box.y2, box.z2);
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
					let box = boxes[i];
					hasCollision = true;
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
					} else if (tool.getSelectedGroup() == 2) {
						model.addBox(box.x1, box.y1, box.z1, box.x2,
							box.y2, box.z2, "renderer_shape", Number(transparentBoxes));
					}
					collision.addBox(box.x1, box.y1, box.z1,
						box.x2, box.y2, box.z2);
				}
				render.addEntry(model);
			}
		}
		if (shape && selectMode != 9 && selectMode != 10) {
			if (selectMode == 5) {
				render.addEntry(new BlockRenderer.Model(shape.x1, shape.y1,
					shape.z1, shape.x2, shape.y2, shape.z2, "renderer_shape", Number(transparentBoxes)));
			} else if (!hasRenderer && (!hasCollision || tool.getSelectedGroup() != 2)) {
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
	}) || false;
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
	if (runned instanceof Error) retraceOrReport(runned);
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

let BlockTool = null;

Callback.addCallback("LevelLoaded", function() {
	if (BlockTool && BlockTool.isAttached()) {
		handle(function() {
			BlockTool.describe();
		});
	}
});

Callback.addCallback("LevelLeft", function() {
	if (BlockTool && BlockTool.isAttached()) {
		handle(function() {
			BlockTool.describe();
		});
	}
});

Callback.addCallback("ItemUse", function(coords, item, block) {
	if (BlockTool && selectMode == 1) {
		handleThread(function() {
			let render = new ICRender.Model(),
				model = new BlockRenderer.Model(block.id, block.data);
			render.addEntry(model);
			BlockRenderer.enableCoordMapping(block.id, block.data, render);
			let worker = BlockTool.getWorker();
			worker.Define.addMapping(coords.x, coords.y, coords.z);
			handle(function() {
				if (mapRenderBlock(BlockTool)) {
					BlockTool.describeMenu();
				}
			});
		});
	}
});

const attachBlockTool = function(source, post) {
	let tool = new EditorTool({
		controlDescriptor: {
			logotype: function(tool, control) {
				if (selectMode == 1 || selectMode == 9 || selectMode == 10) {
					return "blockSlice";
				}
				return "block";
			},
			collapsedClick: function(tool, control) {
				if (selectMode == 1 || selectMode == 9 || selectMode == 10) {
					let previous = selectMode;
					selectMode = 0;
					if (previous != 1) {
						Popups.closeAllByTag("innersection");
						delete BlockEditor.data.rendererInst;
						delete BlockEditor.data.collisionInst;
						mapRenderBlock(tool);
					}
					tool.describeControl();
					tool.control();
					return;
				}
				EditorTool.prototype.controlDescriptor.collapsedClick.apply(this, arguments);
			}
		},
		menuDescriptor: {
			elements: [function(tool, json, menu) {
				if (Level.isLoaded()) {
					return {
						type: "category",
						title: translate("Block"),
						items: [{
							icon: "blockMapping",
							title: translate("Map"),
							click: function(tool, item) {
								showHint(translate("Tap block"));
								selectMode = 1;
								tool.describeControl();
								tool.collapse();
							}
						}, function(tool, category) {
							if (hasMappings()) {
								let hasRemoveMessage = false;
								return {
									icon: "blockRemove",
									title: translate("Unmap"),
									click: function(tool, item) {
										if (!hasRemoveMessage) {
											let message = menu.addMessage("blockSlice", translate("All mappings will be removed.") + " " + translate("Touch here to confirm."),
												function() {
													let worker = tool.getWorker();
													worker.Define.params.mapped = new Array();
													mapRenderBlock(tool);
													tool.describeMenu();
													delete message;
												});
											handle(function() {
												if (message !== undefined) {
													menu.scrollToElement(message);
												}
											}, 500);
											handle(function() {
												if (message !== undefined) {
													menu.removeElement(message);
												}
												hasRemoveMessage = false;
											}, 5000);
											hasRemoveMessage = true;
										}
									}
								};
							}
						}, function(tool, category) {
							if (BlockEditor.data.hasRender || BlockEditor.data.hasCollision) {
								return {
									icon: "blockInsection",
									title: translate("In-section"),
									click: function(tool, item) {
										showHint(translate("Manually view boxes innersection"));
										Popups.closeAll();
										BlockEditor.innersection();
										tool.describeControl();
										tool.collapse();
									}
								};
							}
						}, {
							icon: "blockUpdate",
							title: translate("Reload"),
							click: function(tool, item) {
								if (selectMode != 0) {
									selectMode = 0;
									tool.describe();
								}
								BlockEditor.reload();
							}
						}]
					};
				}
				return {
					type: "message",
					icon: "blockSlice",
					message: translate("To manipulate with in-world block visualization load any world firstly.") + " " + translate("There's will appear mapping section, innersection checkout and render controls.")
				};
			}]
		},
		sidebarDescriptor: {
			groups: [{
				icon: "block",
				items: [{
					icon: "blockDefineIdentifier"
				}, {
					icon: "blockDefineVariation"
				}, {
					icon: {
						bitmap: "blockDefineTexture",
						tint: Interface.Color.RED
					}
				}, {
					icon: "blockDefineType"
				}, {
					icon: "blockDefineShape"
				}, function() {
					if (Level.isLoaded()) {
						return {
							icon: "blockUpdate"
						};
					}
				}]
			}, {
				icon: "blockBoxSelect",
				items: function(tool, group) {
					if (BlockEditor.data.hasRender) {
						let selector = [{
							icon: "blockBoxSelect"
						}, {
							icon: "blockBoxAdd"
						}];
						if (BlockEditor.Renderer.hasSelection()) {
							return selector.concat([{
								icon: "blockBoxScretch"
							}, {
								icon: "blockBoxMove"
							}, {
								icon: "blockBoxMirror"
							}, function(tool, group) {
								if (REVISION.startsWith("develop")) {
									return {
										icon: {
											bitmap: "blockBoxRotate",
											tint: Interface.Color.RED
										}
									};
								}
							}, {
								icon: "blockBoxTexture"
							}, {
								icon: "blockBoxRemove"
							}]);
						}
						return selector;
					}
					return {
						icon: "blockBoxAdd"
					};
				}
			}, {
				icon: "blockDefineShape",
				items: function(tool, group) {
					if (BlockEditor.data.hasCollision) {
						let selector = [{
							icon: "blockBoxSelect"
						}, {
							icon: "blockBoxAdd"
						}];
						if (BlockEditor.Collision.hasSelection()) {
							return selector.concat([{
								icon: "blockBoxScretch"
							}, {
								icon: "blockBoxMove"
							}, {
								icon: "blockBoxMirror"
							}, function(tool, group) {
								if (REVISION.startsWith("develop")) {
									return {
										icon: {
											bitmap: "blockBoxRotate",
											tint: Interface.Color.RED
										}
									};
								}
							}, {
								icon: "blockBoxRemove"
							}]);
						}
						return selector;
					}
					return {
						icon: "blockBoxAdd"
					};
				}
			}]
		},
		onSelectItem: function(sidebar, group, item, groupIndex, itemIndex) {
			if (groupIndex == 0) {
				if (itemIndex == 0) {
					return BlockEditor.rename(this);
				} else if (itemIndex == 1) {
					return BlockEditor.variation(this);
				} else if (itemIndex == 2) {
					// TODO: Interact with block textures
				} else if (itemIndex == 3) {
					return BlockEditor.type(this);
				} else if (itemIndex == 4) {
					return BlockEditor.shape(this);
				} else if (itemIndex == 5) {
					return BlockEditor.reload(this);
				}
			} else if (groupIndex == 1) {
				if (BlockEditor.data.hasRender) {
					if (!REVISION.startsWith("develop")) {
						if (itemIndex > 4) itemIndex++;
					}
					if (itemIndex == 0) {
						return BlockEditor.Renderer.select(this);
					} else if (itemIndex == 1) {
						return BlockEditor.Renderer.add(this);
					} else if (itemIndex == 2) {
						return BlockEditor.Renderer.resize(this);
					} else if (itemIndex == 3) {
						return BlockEditor.Renderer.move(this);
					} else if (itemIndex == 4) {
						return BlockEditor.Renderer.mirror(this);
					} else if (itemIndex == 5) {
						return BlockEditor.Renderer.rotate(this);
					} else if (itemIndex == 6) {
						return BlockEditor.Renderer.texture(this);
					} else if (itemIndex == 7) {
						return BlockEditor.Renderer.remove(this);
					}
				} else if (itemIndex == 0) {
					return BlockEditor.Renderer.add(this);
				}
			} else if (groupIndex == 2) {
				if (BlockEditor.data.hasCollision) {
					if (!REVISION.startsWith("develop")) {
						if (itemIndex > 4) itemIndex++;
					}
					if (itemIndex == 0) {
						return BlockEditor.Collision.select(this);
					} else if (itemIndex == 1) {
						return BlockEditor.Collision.add(this);
					} else if (itemIndex == 2) {
						return BlockEditor.Collision.resize(this);
					} else if (itemIndex == 3) {
						return BlockEditor.Collision.move(this);
					} else if (itemIndex == 4) {
						return BlockEditor.Collision.mirror(this);
					} else if (itemIndex == 5) {
						return BlockEditor.Collision.rotate(this);
					} else if (itemIndex == 6) {
						return BlockEditor.Collision.remove(this);
					}
				} else if (itemIndex == 0) {
					return BlockEditor.Collision.add(this);
				}
			}
			showHint(translate("Not developed yet"));
		},
		onFetchGroup: function(sidebar, group, index) {
			if (index == 0) {
				return translate("Block define properties");
			} else if (index == 1) {
				return translate("Render models");
			} else if (index == 2) {
				return translate("Collision models");
			}
			return translate("Deprecated translation");
		},
		onFetchItem: function(sidebar, group, item, groupIndex, itemIndex) {
			if (groupIndex == 0) {
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
			} else if (groupIndex == 1) {
				if (BlockEditor.data.hasRender) {
					if (!REVISION.startsWith("develop")) {
						if (itemIndex > 4) itemIndex++;
					}
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
			} else if (groupIndex == 2) {
				if (BlockEditor.data.hasCollision) {
					if (!REVISION.startsWith("develop")) {
						if (itemIndex > 4) itemIndex++;
					}
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
			}
			return translate("Deprecated translation");
		},
		onSelectGroup: function(sidebar, group, index, last, count) {
			mapRenderBlock(this);
		},
		onUndockGroup: function(sidebar, group, index, previous) {
			if (!previous) {
				selectMode = 0;
				mapRenderBlock(this);
			}
		},
		getExtensions: function(type) {
			let source = EditorTool.prototype.getExtensions.apply(this, arguments);
			if (type != EditorTool.ExtensionType.EXPORT) source = source.concat([".json", ".ndb"]);
			return source;
		},
		replace: function(file) {
			let name = file.getName(),
				instance = this;
			if (name.endsWith(".json")) {
				let active = Date.now();
				convertJsonBlock(Files.read(file), function(result) {
					instance.fromProject(result);
					showHint(translate("Converted success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			} else if (name.endsWith(".ndb")) {
				let active = Date.now();
				tryout(function() {
					let obj = compileData(Files.read(file)),
						result = convertNdb(obj);
					instance.fromProject(result);
					showHint(translate("Imported success") + " " +
						translate("as %ss", preround((Date.now() - active) / 1000, 1)));
				});
			}
			EditorTool.prototype.replace.apply(this, arguments);
		},
		merge: function(file) {
			let merger = this.getMerger();
			if (!this.hasMerger()) MCSystem.throwException(null);
			let name = file.getName(),
				project = this.toProject(),
				instance = this;
			if (name.endsWith(".json")) {
				let active = Date.now();
				convertJsonBlock(Files.read(file), function(result) {
					merger(project, result, function(output) {
						instance.fromProject(output);
						showHint(translate("Merged success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
				});
			} else if (name.endsWith(".ndb")) {
				let active = Date.now();
				handleThread(function() {
					let obj = compileData(Files.read(file)),
						result = convertNdb(obj);
					merger(project, result, function(output) {
						instance.fromProject(output);
						showHint(translate("Merged success") + " " +
							translate("as %ss", preround((Date.now() - active) / 1000, 1)));
					});
				});
			}
			EditorTool.prototype.merge.apply(this, arguments);
		},
		getWorkerFor: function(source) {
			if (source !== undefined) {
				return new BlockWorker(source);
			}
			return ProjectProvider.addBlock();
		},
		getMerger: function() {
			return mergeConvertedBlock;
		},
		getConverter: function() {
			return new BlockConverter();
		},
		hasParser: function() {
			return true;
		},
		unselect: function(force) {
			delete BlockEditor.data.renderer;
			Popups.closeIfOpened("renderer_select");
			delete BlockEditor.data.collision;
			Popups.closeIfOpened("collision_select");
			mapRenderBlock(this);
			EditorTool.prototype.unselect.apply(this, arguments);
		}
	});
	tool.attach();
	checkValidate(function() {
		tool.queue();
		handleThread(function() {
			let accepted = tool.open(source);
			handle(function() {
				if (accepted) {
					tryout(function() {
						post && post(tool);
						BlockEditor.attach(tool);
						accepted = false;
					});
				}
				if (accepted) {
					tool.leave();
				}
			});
		});
	});
};

const BlockEditor = {
	data: new Object(),
	resetIfNeeded: function(tool) {
		let worker = tool.getWorker();
		if (worker.Renderer.getModelCount() == 0) {
			worker.Renderer.createModel();
		}
		if (worker.Collision.getModelCount() == 0) {
			worker.Collision.createModel();
		}
		if (worker.Define.getMappedCount() == 0) {
			if (!saveCoords) {
				removeMappings();
				removeUnusedMappings();
			} else worker.Define.params.mapped = copyMappings();
		}
	},
	attach: function(tool) {
		let worker = tool.getWorker();
		this.resetIfNeeded(tool);
		this.data.hasRender = worker.Renderer.getModelCount() > 0 &&
			worker.Renderer.getModel(0).getBoxCount() > 0;
		this.data.hasCollision = worker.Collision.getModelCount() > 0 &&
			worker.Collision.getModel(0).getBoxCount() > 0;
		mapRenderBlock(tool);
		if (!tool.isAttached()) {
			tool.attach();
		}
		BlockTool = tool;
		tool.describe();
		tool.control();
	},
	reload: function(tool) {
		let worker = tool.getWorker();
		if (mapRenderBlock(tool)) {
			showHint(translate("Render updated"));
		} else if (!removeUnusedMappings()) {
			showHint(translate("Nothing to update"));
		}
	},
	innersection: function(tool) {
		let renderer, collision;
		if (this.data.hasRender) {
			renderer = new ListingPopup();
			renderer.setIsMayDismissed(false);
			renderer.setTitle(translate("Renderer"));
			renderer.setSelectMode(true);
			renderer.setOnSelectListener(function(index) {
				selectMode = 9;
				BlockEditor.data.rendererInst = index;
				mapRenderBlock(tool);
				if (collision) collision.unselect();
			});
			for (let i = 0; i < tool.getWorker().Renderer.getModel(0).getBoxCount(); i++) {
				renderer.addButtonElement(translate("Box %s", i + 1));
			}
			renderer.selectButton(0);
			Popups.open(renderer, "innersection_renderer");
		}
		if (this.data.hasCollision) {
			collision = new ListingPopup();
			collision.setIsMayDismissed(false);
			collision.setTitle(translate("Collision"));
			collision.setSelectMode(true);
			collision.setOnSelectListener(function(index) {
				selectMode = 10;
				BlockEditor.data.collisionInst = index;
				mapRenderBlock(tool);
				if (renderer) renderer.unselect();
			});
			for (let i = 0; i < tool.getWorker().Collision.getModel(0).getBoxCount(); i++) {
				collision.addButtonElement(translate("Box %s", i + 1));
			}
			if (!this.data.hasRender) {
				collision.selectButton(0);
			}
			Popups.open(collision, "innersection_collision");
		}
	},
	shape: function(tool) {
		let params = tool.getWorker().Define.params,
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
			mapRenderBlock(tool);
		});
		popup.setOnDismissListener(function() {
			selectMode = 0;
			mapRenderBlock(tool);
		});
		let group = popup.addGroup("x");
		group.setOnChangeListener(function(index, value) {
			shape["x" + (index + 1)] = value;
			selectMode = 5;
			mapRenderBlock(tool);
		});
		group.addItem(shape.x1);
		group.addItem(shape.x2);
		group = popup.addGroup("y");
		group.setOnChangeListener(function(index, value) {
			shape["y" + (index + 1)] = value;
			selectMode = 5;
			mapRenderBlock(tool);
		});
		group.addItem(shape.y1);
		group.addItem(shape.y2);
		group = popup.addGroup("z");
		group.setOnChangeListener(function(index, value) {
			shape["z" + (index + 1)] = value;
			selectMode = 5;
			mapRenderBlock(tool);
		});
		group.addItem(shape.z1);
		group.addItem(shape.z2);
		Popups.open(popup, "shape");
	},
	rename: function(tool) {
		let define = tool.getWorker().Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("Rename"));
		popup.addEditElement(translate("ID"), define.getIdentificator());
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues();
			define.setIdentificator(String(values[0]));
			showHint(translate("Data saved"));
		});
		Popups.open(popup, "rename");
	},
	variation: function(tool) {
		let define = tool.getWorker().Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("Data"));
		popup.addEditElement(translate("Define"), define.getDefineData() || "[{}]");
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues(),
				result = compileData(values[0]);
			if (result.lineNumber !== undefined) {
				confirm(translate("Compilation failed"),
					translate("Looks like, you entered invalid array. Check it with following exception:") +
					" " + formatExceptionReport(result) + "\n\n" + translate("Force save define data?"),
					function() {
						define.setDefineData(String(values[0]));
						showHint(translate("Data saved"));
					});
				return;
			}
			define.setDefineData(String(values[0]));
			showHint(translate("Data saved"));
		});
		Popups.open(popup, "variation");
	},
	type: function(tool) {
		let define = tool.getWorker().Define;
		let popup = new ListingPopup();
		popup.setTitle(translate("Type"));
		popup.addEditElement(translate("Special"), define.getSpecialType() || "{}");
		popup.addButtonElement(translate("Save"), function() {
			let values = popup.getAllEditsValues(),
				result = compileData(values[0]);
			if (result.lineNumber !== undefined) {
				confirm(translate("Compilation failed"),
					translate("Looks like, you entered invalid object. Check it with following exception:") +
					" " + formatExceptionReport(result) + "\n\n" + translate("Force save special type?"),
					function() {
						define.setSpecialType(String(values[0]));
						showHint(translate("Data saved"));
					});
				return;
			}
			define.setSpecialType(String(values[0]));
			showHint(translate("Data saved"));
		});
		Popups.open(popup, "type");
	},
	Renderer: {
		hasSelection: function(tool) {
			return BlockEditor.data.renderer >= 0;
		},
		select: function(tool) {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			popup.setSelectMode(true);
			popup.setOnDismissListener(function() {
				selectMode = 0;
				mapRenderBlock(tool);
			});
			for (let i = 0; i < tool.getWorker().Renderer.getModel(0).getBoxCount(); i++) {
				popup.addButtonElement(translate("Box %s", i + 1));
			}
			popup.setOnSelectListener(function(index) {
				selectMode = 3;
				let selected = BlockEditor.Renderer.hasSelection();
				BlockEditor.data.renderer = index;
				if (!selected) tool.describeSidebar();
				mapRenderBlock(tool);
			});
			popup.selectButton(BlockEditor.data.renderer);
			Popups.open(popup, "renderer_select");
		},
		add: function(tool) {
			if (BlockEditor.data.hasRender) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let selected = BlockEditor.Renderer.hasSelection(),
						index = (BlockEditor.data.renderer = tool.getWorker().Renderer.getModel(0).addBox(1, 0));
					if (!selected) tool.describeSidebar();
					showHint(translate("Box %s added", index + 1));
					mapRenderBlock(tool);
				});
				if (BlockEditor.Renderer.hasSelection()) {
					popup.addButtonElement(translate("Copy current"), function() {
						let last = BlockEditor.data.renderer,
							index = (BlockEditor.data.renderer = tool.getWorker().Renderer.getModel(0).cloneBox(last));
						showHint(translate("Box %s cloned to %s", [last + 1, index + 1]));
						mapRenderBlock(tool);
					});
				}
				Popups.open(popup, "renderer_add");
			} else {
				BlockEditor.data.renderer = tool.getWorker().Renderer.getModel(0).addBox(1, 0);
				BlockEditor.attach(tool);
				showHint(translate("First box added"));
			}
		},
		resize: function(tool) {
			let selected = BlockEditor.data.renderer,
				box = tool.getWorker().Renderer.getModel(0).getBox(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Scretch"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Renderer.getModel(0).scretchBox(selected, index == 0 ? "x1" : "x2", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.x1);
			group.addItem(box.x2);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Renderer.getModel(0).scretchBox(selected, index == 0 ? "y1" : "y2", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.y1);
			group.addItem(box.y2);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Renderer.getModel(0).scretchBox(selected, index == 0 ? "z1" : "z2", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.z1);
			group.addItem(box.z2);
			Popups.open(popup, "renderer_resize");
		},
		move: function(tool) {
			let selected = BlockEditor.data.renderer,
				box = tool.getWorker().Renderer.getModel(0).getBox(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Renderer.getModel(0).moveBox(selected, "x", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.x1);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Renderer.getModel(0).moveBox(selected, "y", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.y1);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Renderer.getModel(0).moveBox(selected, "z", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.z1);
			Popups.open(popup, "renderer_move");
		},
		mirror: function(tool) {
			let selected = BlockEditor.data.renderer,
				box = tool.getWorker().Renderer.getModel(0).getBox(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Mirror"));
			popup.addButtonElement("X", function() {
				tool.getWorker().Renderer.getModel(0).mirrorBoxAtX(selected);
				mapRenderBlock(tool);
			});
			popup.addButtonElement("Y", function() {
				tool.getWorker().Renderer.getModel(0).mirrorBoxAtY(selected);
				mapRenderBlock(tool);
			});
			popup.addButtonElement("Z", function() {
				tool.getWorker().Renderer.getModel(0).mirrorBoxAtZ(selected);
				mapRenderBlock(tool);
			});
			Popups.open(popup, "renderer_mirror");
		},
		rotate: function(tool) {
			let selected = BlockEditor.data.renderer,
				box = tool.getWorker().Renderer.getModel(0).getBox(selected);
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
				tool.getWorker().Renderer.getModel(0).rotateBox(selected, orientate, index);
				showHint(translate("Box rotated at %s angle", (index + 1) * 90));
				mapRenderBlock(tool);
			});
			Popups.open(popup, "renderer_rotate");
		},
		texture: function(tool) {
			let selected = BlockEditor.data.renderer,
				box = tool.getWorker().Renderer.getModel(0).getBox(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Texture"));
			popup.setOnClickListener(function(index) {
				index > 1 && selectTexture(index - 2, function(name, data) {
					tool.getWorker().Renderer.getModel(0).textureBox(selected, name, data);
					mapRenderBlock(tool);
					Popups.updateAtName("box_texture");
					showHint(translate("Texture changed"));
					edit.update();
				});
			});
			popup.addButtonElement(translate("Enter array"), function() {
				if (edit.switchVisibility()) {
					button.switchVisibility();
				}
			});
			let edit = popup.addEditElement(translate("Texture")).switchVisibility();
			edit.update = function() {
				handleThread(function() {
					if (box.texture && Array.isArray(box.texture)) {
						let stringify = box.texture.slice().map(function(element) {
							let texture = typeof element[0] == "string" ? "\"" + element[0] + "\"" : element[0];
							return (texture === undefined ? "0" : texture) + (element.length > 1 ? ", " + element[1] : new String());
						});
						handle(function() {
							edit.setValue(stringify.join("\n"));
						});
					} else handle(function() {
						edit.setValue("0");
					});
				});
			};
			let button = popup.addButtonElement(translate("Save"), function() {
				let array = popup.getEdit(0).getValue().split("\n");
				array = compileData("[[" + array.join("],[") + "]]");
				if (array.lineNumber !== undefined) {
					confirm(translate("Compilation failed"),
						translate("Looks like, you entered invalid array. Check it with following exception:") +
						" " + formatExceptionReport(array));
				} else if (!Array.isArray(array)) {
					showHint(translate("That's isn't array"), Interface.Color.YELLOW);
				} else {
					for (let i = 0; i < array.length; i++) {
						let texture = array[i];
						if (!Array.isArray(texture)) {
							showHint(translate("Textures array must be contains only arrays inside"), Interface.Color.YELLOW);
							return;
						}
						if (texture.length != 2) {
							showHint(translate("Every element in textures array must have 2 length"), Interface.Color.YELLOW);
							return;
						}
						if ((typeof texture[0] != "number" && typeof texture[0] != "string") || (texture.length == 2 && typeof texture[1] != "number")) {
							showHint(translate("Every element in textures array may incudes only strings or numbers"), Interface.Color.YELLOW);
							return;
						}
					}
					tool.getWorker().Renderer.getModel(0).textureBox(selected, array);
					mapRenderBlock(tool);
					showHint(translate("Textures changed"));
					edit.update();
				}
			}).switchVisibility();
			for (let i = 0; i < textures.length; i++) {
				popup.addButtonElement(textures[i].name);
			}
			edit.update();
			Popups.open(popup, "renderer_texture");
		},
		remove: function(tool) {
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this box?"),
				function() {
					let worker = tool.getWorker();
					worker.Renderer.getModel(0).removeBox(BlockEditor.data.renderer);
					BlockEditor.data.renderer = BlockEditor.data.renderer > 0 ? BlockEditor.data.renderer - 1 : 0;
					if (worker.Renderer.getModel(0).getBoxCount() == 0) {
						BlockEditor.attach(tool);
					}
					Popups.closeAllByTag("renderer");
					showHint(translate("Box deleted"));
					mapRenderBlock(tool);
				});
		}
	},
	Collision: {
		hasSelection: function(tool) {
			return BlockEditor.data.collision >= 0;
		},
		select: function(tool) {
			let popup = new ListingPopup();
			popup.setTitle(translate("Boxes"));
			popup.setSelectMode(true);
			popup.setOnDismissListener(function() {
				selectMode = 0;
				mapRenderBlock(tool);
			});
			for (let i = 0; i < tool.getWorker().Collision.getModel(0).getBoxCount(); i++) {
				popup.addButtonElement(translate("Box %s", i + 1));
			}
			popup.setOnSelectListener(function(index) {
				selectMode = 11;
				let selected = BlockEditor.Collision.hasSelection();
				BlockEditor.data.collision = index;
				if (!selected) tool.describeSidebar();
				mapRenderBlock(tool);
			});
			popup.selectButton(BlockEditor.data.collision);
			Popups.open(popup, "collision_select");
		},
		add: function(tool) {
			if (BlockEditor.data.hasCollision) {
				let popup = new ListingPopup();
				popup.setTitle(translate("Create"));
				popup.setOnSelectListener(function(index) {
					Popups.updateAll();
				});
				popup.addButtonElement(translate("New of"), function() {
					let selected = BlockEditor.Collision.hasSelection(),
						index = (BlockEditor.data.collision = tool.getWorker().Collision.getModel(0).addBox());
					if (!selected) tool.describeSidebar();
					showHint(translate("Box %s added", index + 1));
					mapRenderBlock(tool);
				});
				if (BlockEditor.Collision.hasSelection()) {
					popup.addButtonElement(translate("Copy current"), function() {
						let last = BlockEditor.data.collision,
							index = (BlockEditor.data.collision = tool.getWorker().Collision.getModel(0).cloneBox(last));
						showHint(translate("Box %s cloned to %s", [last + 1, index + 1]));
						mapRenderBlock(tool);
					});
				}
				Popups.open(popup, "collision_add");
			} else {
				BlockEditor.data.collision = tool.getWorker().Collision.getModel(0).addBox();
				BlockEditor.attach(tool);
				showHint(translate("First box added"));
			}
		},
		resize: function(tool) {
			let selected = BlockEditor.data.collision,
				box = tool.getWorker().Collision.getModel(0).getBox(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Scretch"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Collision.getModel(0).scretchBox(selected, index == 0 ? "x1" : "x2", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.x1);
			group.addItem(box.x2);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Collision.getModel(0).scretchBox(selected, index == 0 ? "y1" : "y2", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.y1);
			group.addItem(box.y2);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Collision.getModel(0).scretchBox(selected, index == 0 ? "z1" : "z2", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.z1);
			group.addItem(box.z2);
			Popups.open(popup, "collision_resize");
		},
		move: function(tool) {
			let selected = BlockEditor.data.collision,
				box = tool.getWorker().Collision.getModel(0).getBox(selected);
			let popup = new CoordsPopup();
			popup.setTitle(translate("Move"));
			let group = popup.addGroup("x");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Collision.getModel(0).moveBox(selected, "x", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.x1);
			group = popup.addGroup("y");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Collision.getModel(0).moveBox(selected, "y", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.y1);
			group = popup.addGroup("z");
			group.setOnChangeListener(function(index, value) {
				tool.getWorker().Collision.getModel(0).moveBox(selected, "z", value);
				mapRenderBlock(tool);
			});
			group.addItem(box.z1);
			Popups.open(popup, "collision_move");
		},
		mirror: function(tool) {
			let selected = BlockEditor.data.collision,
				box = tool.getWorker().Collision.getModel(0).getBox(selected);
			let popup = new ListingPopup();
			popup.setTitle(translate("Mirror"));
			popup.addButtonElement("X", function() {
				tool.getWorker().Collision.getModel(0).mirrorBoxAtX(selected);
				mapRenderBlock(tool);
			});
			popup.addButtonElement("Y", function() {
				tool.getWorker().Collision.getModel(0).mirrorBoxAtY(selected);
				mapRenderBlock(tool);
			});
			popup.addButtonElement("Z", function() {
				tool.getWorker().Collision.getModel(0).mirrorBoxAtY(selected);
				mapRenderBlock(tool);
			});
			Popups.open(popup, "collision_mirror");
		},
		rotate: function(tool) {
			let selected = BlockEditor.data.collision,
				box = tool.getWorker().Collision.getModel(0).getBox(selected);
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
				tool.getWorker().Collision.getModel(0).rotateBox(selected, orientate, index);
				showHint(translate("Box rotated at %s angle", (index + 1) * 90));
				mapRenderBlock(tool);
			});
			Popups.open(popup, "collision_rotate");
		},
		remove: function(tool) {
			confirm(translate("Deleting"),
				translate("Are you sure want to delete this box?"),
				function() {
					let worker = tool.getWorker();
					worker.Collision.getModel(0).removeBox(BlockEditor.data.collision);
					BlockEditor.data.collision = BlockEditor.data.collision > 0 ? BlockEditor.data.collision - 1 : 0;
					if (worker.Collision.getModel(0).getBoxCount() == 0) {
						BlockEditor.attach(tool);
					}
					Popups.closeAllByTag("collision");
					showHint(translate("Box deleted"));
					mapRenderBlock(tool);
				});
		}
	}
};
