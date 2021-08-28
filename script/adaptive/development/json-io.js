const $ = new JavaImporter();
$.importPackage(org.mozilla.javascript);
$.importPackage(Packages.com.cedarsoftware.util.io);

const JsonIo = new Object();

JsonIo.Writer = $.JsonWriter;
JsonIo.Reader = $.JsonReader;
JsonIo.Object = $.JsonObject;

const shouldReturnPrimitive = function(value) {
	switch (typeof value) {
		case "number":
			return Number(value);
		case "boolean":
			return Boolean(value);
		case "string":
			return String(value);
	}
	return $.ScriptRuntime.toObject(this, value);
};

// Conversion between json & scriptable section

const writeNativeObjectToJsonIo = function(object, primitiveArrays) {
	if (object === null || object === undefined) {
		MCSystem.throwException("Code bug: passed to writeNativeObject value must be defined");
	}
	let json = new JsonIo.Object();
	for (let element in object) {
		let someone = writeScriptableToJsonIo(object[element], primitiveArrays);
		someone !== undefined && json.put(element, someone);
	}
	return json;
};

const writeNativeArrayToJsonIo = function(array, primitiveArrays) {
	if (array === null || array === undefined) {
		MCSystem.throwException("Code bug: passed to writeNativeArray value must be defined");
	}
	let output = new java.util.ArrayList();
	for (let i = 0; i < array.length; i++) {
		let someone = writeScriptableToJsonIo(array[i], primitiveArrays);
		someone !== undefined && output.add(someone);
	}
	let json = new JsonIo.Object();
	if (primitiveArrays !== false) {
		output = output.toArray();
	}
	json.put("@items", output);
	return json;
};

const writeScriptableToJsonIo = function(who, primitiveArrays) {
	return tryout(function() {
		if (who === null) {
			return null;
		}
		switch (typeof who) {
			case "number":
			case "boolean":
			case "string":
				return $.ScriptRuntime.toPrimitive(who);
			case "object":
				if (Array.isArray(who)) {
					return writeNativeArrayToJsonIo(who, primitiveArrays);
				}
				if (who instanceof $.Scriptable || who.toString() == "[object Object]") {
					return writeNativeObjectToJsonIo(who, primitiveArrays);
				}
				return require(function() {
					return $.Context.jsToJava(who, getClass(who));
				}, new Function(), who);
			case "function":
				return require(function() {
					return who.toSource();
				}, function(e) {
					log("toSource not called on " + e);
				}, null);
			case "undefined":
				return undefined;
		}
		MCSystem.throwException("Undefined type " + typeof who + " of " + who);
	}, function(e) {
		if (e instanceof java.lang.RuntimeException) {
			throw e;
		}
		reportTrace(e);
		log("Unsupported scriptable to json value " + who);
	});
};

JsonIo.toJson = writeScriptableToJsonIo;

const readJsonIoToNativeObject = function(json, allowClasses) {
	if (!(json instanceof JsonIo.Object)) {
		MCSystem.throwException("Code bug: passed to readNativeObject value must be JsonIo.Object");
	}
	let iterator = json.keySet().iterator(),
		object = new Object();
	while (iterator.hasNext()) {
		let key = iterator.next(),
			someone = readJsonIoToScriptable(json.get(key), allowClasses);
		someone !== undefined && (object[key] = someone);
	}
	return object;
};

const readJsonIoToNativeArray = function(json, allowClasses) {
	if (json === null || json === undefined) {
		MCSystem.throwException("Code bug: passed to readNativeArray value must be defined");
	}
	let array = new Array();
	if (json instanceof java.util.List) {
		for (let i = 0; i < json.size(); i++) {
			let someone = readJsonIoToScriptable(json.get(i), allowClasses);
			someone !== undefined && array.push(someone);
		}
	} else {
		for (let i = 0; i < json.length; i++) {
			let someone = readJsonIoToScriptable(json[i], allowClasses);
			someone !== undefined && array.push(someone);
		}
	}
	return array;
};

const readJsonIoToScriptable = function(json, allowClasses) {
	if (!(json instanceof JsonIo.Object)) {
		return tryout(function() {
			if (typeof json != "undefined") {
				if (json == null) {
					return null;
				}
				return shouldReturnPrimitive(json);
			}
		}, function(e) {
			if (allowClasses) {
				return json;
			}
			reportTrace(e);
			log("Unsupported class passed to JsonIo.fromJson: " + json + ", nothing will happened");
		});
	}
	if (json.isPrimitive()) {
		return shouldReturnPrimitive(json.getPrimitiveValue());
	}
	if (json.isArray()) {
		return readJsonIoToNativeArray(json.getArray(), allowClasses);
	}
	return readJsonIoToNativeObject(json, allowClasses);
};

JsonIo.fromJson = readJsonIoToScriptable;

// Stream scriptable read-write section

let jsonIoWriterEnum = 0;
JsonIo.COMPLETED = jsonIoWriterEnum++;
JsonIo.UNCLOSED = jsonIoWriterEnum++;
JsonIo.UNCHANGED = jsonIoWriterEnum++;

const getJsonIoWriter = function(stream, args) {
	if (stream === null || stream === undefined) {
		MCSystem.throwException("JsonIo.getWriter stream must be defined");
	}
	if (args !== undefined) {
		return new JsonIo.Writer(stream, json);
	}
	return new JsonIo.Writer(stream);
};

const writeJsonIoToStream = function(stream, json, args) {
	if (json === undefined) {
		log("Undefined passed to JsonIo.writeStream, nothing will happened");
		return JsonIo.UNCHANGED;
	}
	let writer = getJsonIoWriter(stream, args);
	writer.write(json);
	writer.flush();
	return tryout(function() {
		writer.close();
		return JsonIo.COMPLETED;
	}, new Function(), JsonIo.UNCLOSED);
};

const writeScriptableToStream = function(stream, who, args, primitiveArrays) {
	if (!(who instanceof JsonIo.Object)) {
		who = writeScriptableToJsonIo(who, primitiveArrays);
	}
	return writeJsonIoToStream(stream, who, args);
};

JsonIo.getWriter = getJsonIoWriter;
JsonIo.writeStream = writeScriptableToStream;

const getJsonIoReader = function(streamOrString, args) {
	if (streamOrString === null || streamOrString === undefined) {
		return new JsonIo.Reader();
	}
	if (args !== undefined) {
		return new JsonIo.Reader(streamOrString, args);
	}
	return new JsonIo.Reader(streamOrString);
};

const readJsonIoFromStream = function(streamOrString, args) {
	let reader = getJsonIoReader(streamOrString, args),
		json = reader.readObject();
	tryout(function() {
		reader.close();
	}, new Function());
	return json;
};

const readScriptableFromStream = function(streamOrString, args, allowClasses) {
	let json = readJsonIoFromStream(streamOrString, args);
	return readJsonIoToScriptable(json, allowClasses);
};

JsonIo.getReader = getJsonIoReader;
JsonIo.readStream = readScriptableFromStream;

SHARE("JsonIo", JsonIo);
