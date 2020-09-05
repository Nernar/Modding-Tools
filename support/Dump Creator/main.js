IDRegistry.genBlockID("test");
Block.createBlock("test", [{
	name: "Block",
	texture: [["stone", 0]]
}]);

MobRegistry.registerEntity("test");

let __makeAndSaveDump__ = function() {
	let scope = __mod__.compiledModSources.get(0).evaluateStringInScope("this");
	
	// put here objects or methods, they not be dumped (you may to erase it)
	const dumpIgnores = ["VanillaItemID.*", "VanillaBlockID.*", "VanillaTileID.*", "BlockID.*", "ItemID.*",
		"World.__inworld.*", "World.__inmenu.*", "ToolAPI.blockMaterials.*", "ToolAPI.toolMaterials.*",
		"ToolAPI.toolData.*", "ToolAPI.blockData.*", "LiquidRegistry.liquids", "LiquidRegistry.FullByEmpty.*",
		"LiquidRegistry.EmptyByFull.*", "Block.dropFunctions.*", "Block.idSource", "Item.idSource",
		"IDData.item", "IDData.block"];
	
	// this objects overrides result (maybe type changed)
	const dumpOverrides = [["Block.placeFuncs", "new Array(8193)"], ["MobRegistry.customEntities.*", "new Object();"]];
	
	// formatting helper values
	let previousHasName = true, previousType = "undefined";
	
	let dumpObj = function(obj, name) {
		let arr = [];
		for(let i in obj) {
			try {
				// ignores current & selected objects (+ classes)
				if(i == "class" || !name && i == "__makeAndSaveDump__") continue;
				if(dumpIgnores.indexOf(name ? name + "." + i : i) != -1) continue;
				else if(dumpIgnores.indexOf(name + ".*") != -1) continue;
				
				let action = obj[i];
				let type = typeof action;
				
				// formatting differents objects offset
				if(previousType == "object" && !name && type == "function") {
					arr.push("");
					previousHasName = true;
				} else if(!previousType == "function" && !name && type == "object") {
					arr.push("");
					previousHasName = true;
				}
				previousType = type;
				if(!previousHasName && !name) {
					arr.push("");
					previousHasName = true;
				} else if(name)
				    previousHasName = false; 
				
				// checks overrides & continues
				let overrided = false;
				dumpOverrides.forEach(function(override) {
					if(override[0] == (name ? name + "." + i : i)) {
						arr.push((name ? name + "." + i : "var i") + " = " + override[1] + ";");
						overrided = true;
					} else if(name && override[0] == name + ".*") {
						arr.push(name + "." + i + " = " + override[1] + ";");
						overrided = true;
					}
				});
				if(overrided) continue;
				
				switch(type) {
					case "string":
						arr.push((name ? name + "." + i : "var " + i) + " = \"" + action + "\";");
						break;
					case "boolean":
					case "number":
						arr.push((name ? name + "." + i : "var " + i) + " = " + action + ";");
						break;
					case "object":
						if(action == null) arr.push((name ? name + "." + i : "var " + i) + " = null;");
						else if(action == scope) arr.push((name ? name + "." + i : "var " + i) + " = this;");
						else if(action.length + "" != "undefined") arr.push((name ? name + "." + i : "var " + i) + " = " + JSON.stringify(action) + ";");
						else {
							arr.push((name ? name + "." + i : "var " + i) + " = {};");
							let dump = dumpObj(action, name ? name + "." + i : i);
							dump && arr.push(dump);
						}
						break;
					case "function":
						try {
							let args = action.toString().split("(")[1].split(")")[0], value = dumpReturn(action, name ? name + "." + i : i, args.split(", "), obj);
							arr.push((name ? name + "." + i + " = function" : "function " + i) + "(" + args + ") {" + value + "}" + (name ? ";" : ""));
						} catch(e) {
							arr.push((name ? name + "." + i + " = function" : "function " + i) + "() {}" + (name ? ";" : ""));
						}
						break;
					default:
						arr.push((name ? name + "." + i : "var " + i) + " = null;");
				}
			} catch(e) {
				previousType = "unknown";
				if (e.message.startsWith("Invalid JavaScript value of type")) {
					let clazz = "new " + e.message.split(" ")[5] + "()";
					arr.push((name ? name + "." + i : "var " + i) + " = " + clazz + ";");
					previousType = "class";
				} else arr.push((name ? name + "." + i : "var " + i) + "; // " + e.message);
			}
		}
		return arr.join("\n");
	};
	
	// create instances for test some results
	TileEntity.addTileEntity(0, 0, 0);
	
	let baseParams = {
		ent: Entity.getAll()[2],
		path: "test",
		name: "test",
		text: "some text",
		obj: { key: "value" },
		file: new java.io.File(__dir__ + "test"),
		dir: __dir__ + "test.json",
		blockID: 1,
		rarityMultiplier: [[0, 1]],
		type: 10,
		clone: 0,
		skin: "zombie.png",
		modName: "Dump Creator",
		numericID: 1,
		x: 0,
		z: 0,
		y: 0,
		entity: Entity.getAll()[3],
		coords1: { x: 0, y: 0, z: 0 },
		coords2: { x: 2, y: 1, z: 0 },
		coords: { x: 0, y: 0, z: 0 },
		angle: { yaw: 0, pitch: 0 },
		pos1: { x: 0, y: 0, z: 0 },
		pos2: { x: 2, y: 1, z: 0 },
		ent1: Entity.getAll()[4],
		ent2: Entity.getAll()[5],
		maxRange: 10,
		handleNames: false,
		handleEnchant: false,
		slot: 0,
		projectile: 0,
		loadPart: 0,
		id: 1,
		data: 0,
		encode: false,
		namedID: "test",
		count: 1,
		func: new Function(),
		item: 280,
		enchant: 0,
		fullBlock: { id: 1, data: 0 },
		toolItem: { id: 280, data: 0 },
		coords: { x: 0, y: 1, z: 0 },
		ignoreNative: false,
		itemID: 280,
		key: "lava",
		width: 16,
		height: 16,
		liquid: "lava",
		gameMode: 1,
		fov: 70,
		age: 0,
		health: 10,
		message: "Hello, World!",
		texture: new Texture("images/mob/ce_default_entity_texture.png"),
		render: 3,
		effectId: 6,
		effectData: 1,
		effectTime: 5,
		tileEntity: TileEntity.getTileEntity(0, 0, 0),
		heal: 20,
		w: 0.8,
		h: 1.6
	};
	
	// can't be launched from current callback
	const callIgnores = [];
	
	let dumpReturn = function(obj, name, args, root) {
		// override return non-callable methods
		// if(name == "Entity.spawn") return "return -1;";
		// if(name == "ToolAPI.getToolData") return "return 0;";
		// if(name == "RenderMesh") return "return {};";
		// if(name.startsWith("ToolAPI.toolData") && name.endsWith("calcDestroyTime")) return "return 0;";
		
		for(let i = 0; i < callIgnores.length; i++) {
			if(callIgnores[i] == name) return "/* ignored because crash */";
		}
		
		// is stable, because i'm cannot set some arguments
		// if(name.indexOf("get") == -1) return "";
		
		let returned, arr = [], result;
		args && args.forEach(function(e, i) {
			baseParams[e] + "" != "undefined" && arr.push(baseParams[e]);
		});
		
		// overrides (different name parameters)
		if(name == "Player.setArmorSlot") arr[1] = 298;
		if(name == "Entity.remove") arr[0] = Entity.getAll()[6];
		if(name == "Block.getBlockAtlasTextureCoords") arr[0] = "stone";
		if(name == "alert") arr[0] = "You're welcome!";
		
		let file = new java.io.File(__dir__, ".last");
		file.createNewFile();
		let stream = new java.io.FileOutputStream(file);
		let parsed = "(" + arr.join(", ") + ")(" + args.join(", ") + ")";
		stream.write(new java.lang.String(name + parsed).getBytes());
		stream.close();
		
		try {
			result = obj.apply(root, arr);
			switch(typeof result) {
				case "string":
					returned = "\"" + result + "\"";
					break;
				case "number":
				case "boolean":
					returned = result;
					break;
				case "object":
					if(result == null) returned = "null";
					else returned = JSON.stringify(result);
					break;
				case "function":
					let args = result.toString().split("(")[1].split(")")[0];
					returned = "function(" + args + ") {}";
					break;
				default:
					returned = "undefined";
			}
		} catch(e) {
			if(e.message.startsWith("Java class \"[Ljava.lang.reflect.Constructor;\"")) {
				let arr = {};
				for(let i in result) arr[i] = result;
				returned = JSON.stringify(arr);
			} else if(e.message == "Cannot find default value for object.") {
				returned = new java.lang.String(result);
			} // else return "/* " + e.message + " */";
		}
		return returned && returned != "undefined" ? "return " + returned + ";" : "";
	};
	
	Threading.initThread("dump", function() {
		let file = new java.io.File(__dir__, "dump.txt");
	    file.createNewFile();
	    let stream = new java.io.FileOutputStream(file);
	    stream.write(new java.lang.String(dumpObj(scope)).getBytes());
	    stream.close();
		
		// make toast about them
	    alert("Dump generated");
	});
};

Callback.addCallback(getCoreAPILevel() > 8 ? "LevelDisplayed" : "LevelLoaded", function() {
	if (!ModAPI.requireAPI("DevEditor")) __makeAndSaveDump__();
});
