/*

   Copyright 2021-2022 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

	   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

LIBRARY({
	name: "JsonIo",
	version: 1,
	api: "AdaptedScript",
	shared: true
});

(function() {
	let $ = new JavaImporter();
	$.importPackage(org.mozilla.javascript);
	$.importPackage(Packages.com.cedarsoftware.util.io);
	
	let JsonIo = {};
	
	JsonIo.Writer = $.JsonWriter;
	JsonIo.Reader = $.JsonReader;
	JsonIo.Object = $.JsonObject;
	
	let shouldReturnPrimitive = function(value) {
		if (value instanceof java.lang.CharSequence) {
			return "" + value;
		}
		if (value instanceof java.lang.Number) {
			return value - 0;
		}
		if (value instanceof java.lang.Boolean) {
			return !!value;
		}
		return $.ScriptRuntime.toObject(this, value);
	};
	
	/**
	 * Conversion between json & scriptable section
	 */
	
	let writeNativeObjectToJsonIo = function(object, primitiveArrays) {
		if (object === null || object === undefined) {
			MCSystem.throwException("JsonIo: passed to writeNativeObject value must be defined");
		}
		let json = new JsonIo.Object();
		for (let element in object) {
			let someone = writeScriptableToJsonIo(object[element], primitiveArrays);
			someone !== undefined && json.put(element, someone);
		}
		return json;
	};
	
	let writeNativeArrayToJsonIo = function(array, primitiveArrays) {
		if (array === null || array === undefined) {
			MCSystem.throwException("JsonIo: passed to writeNativeArray value must be defined");
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
	
	let writeScriptableToJsonIo = function(who, primitiveArrays) {
		try {
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
					try {
						return $.Context.jsToJava(who, getClass(who));
					} catch (e) {
						return who;
					}
				case "function":
					try {
						return who.toSource();
					} catch (e) {
						log("JsonIo: toSource not called on " + who);
						log("JsonIo: " + e);
						return null;
					}
				case "undefined":
					return;
			}
		} catch (e) {
			log("JsonIo: unsupported scriptable to json value " + who);
			log("JsonIo: " + e);
			return null;
		}
		MCSystem.throwException("JsonIo: undefined type " + typeof who + " of " + who);
	};
	
	JsonIo.toJson = writeScriptableToJsonIo;
	
	let readJsonIoToNativeObject = function(json, allowClasses) {
		if (!(json instanceof java.util.Map)) {
			MCSystem.throwException("JsonIo: passed to readNativeObject value must be java.util.Map");
		}
		let iterator = json.keySet().iterator(),
			object = {};
		while (iterator.hasNext()) {
			let key = iterator.next(),
				someone = readJsonIoToScriptable(json.get(key), allowClasses);
			someone !== undefined && (object[key] = someone);
		}
		return object;
	};
	
	let readJsonIoToNativeArray = function(json, allowClasses) {
		if (json === null || json === undefined) {
			MCSystem.throwException("JsonIo: passed to readNativeArray value must be defined");
		}
		let array = [];
		if (json instanceof java.util.List || json instanceof java.util.Collection) {
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
	
	let readJsonIoToScriptable = function(json, allowClasses) {
		if (!(json instanceof JsonIo.Object)) {
			try {
				if (json == null) {
					return null;
				}
				if (json instanceof java.util.List || json instanceof java.util.Collection || getClass(json).__javaObject__.isArray()) {
					return readJsonIoToNativeArray(json, allowClasses);
				}
				if (json instanceof java.util.Map) {
					return readJsonIoToNativeObject(json, allowClasses);
				}
				return shouldReturnPrimitive(json);
			} catch (e) {
				if (allowClasses) {
					return json;
				}
				log("JsonIo: unsupported class passed to JsonIo.fromJson: " + json + ", nothing will happened");
				log("JsonIo: " + e);
			}
			return undefined;
		}
		if (json.isPrimitive()) {
			return shouldReturnPrimitive(json.getPrimitiveValue());
		}
		if (json.isArray() || json.isCollection()) {
			return readJsonIoToNativeArray(json.getArray(), allowClasses);
		}
		if (json.isMap()) {
			return readJsonIoToNativeObject(json, allowClasses);
		}
		let value = json.get("value");
		if (value != null) {
			return shouldReturnPrimitive(value);
		}
		return readJsonIoToNativeObject(json, allowClasses);
	};
	
	JsonIo.fromJson = readJsonIoToScriptable;
	
	/**
	 * Stream scriptable read-write section
	 */
	
	let jsonIoWriterEnum = 0;
	JsonIo.COMPLETED = jsonIoWriterEnum++;
	JsonIo.UNCLOSED = jsonIoWriterEnum++;
	JsonIo.UNCHANGED = jsonIoWriterEnum++;
	
	let getJsonIoWriter = function(stream, args) {
		if (stream === null || stream === undefined) {
			MCSystem.throwException("JsonIo: JsonIo.getWriter stream must be defined");
		}
		if (args !== undefined) {
		    if (!(args instanceof java.util.HashMap)) {
		        args = writeNativeObjectToJsonIo(args, false);
		    }
			return new JsonIo.Writer(stream, args);
		}
		return new JsonIo.Writer(stream);
	};
	
	let writeJsonIoToStream = function(stream, json, args) {
		if (json === undefined) {
			log("JsonIo: undefined passed to JsonIo.writeStream, nothing will happened");
			return JsonIo.UNCHANGED;
		}
		let writer = getJsonIoWriter(stream, args);
		writer.write(json);
		writer.flush();
		try {
			writer.close();
			return JsonIo.COMPLETED;
		} catch (e) {
			return JsonIo.UNCLOSED;
		}
	};
	
	let writeScriptableToStream = function(stream, who, args, primitiveArrays) {
		if (!(who instanceof JsonIo.Object)) {
			who = writeScriptableToJsonIo(who, primitiveArrays);
		}
		return writeJsonIoToStream(stream, who, args);
	};
	
	JsonIo.getWriter = getJsonIoWriter;
	JsonIo.writeStream = writeScriptableToStream;
	
	let getJsonIoReader = function(streamOrString, args) {
		if (streamOrString === null || streamOrString === undefined) {
			return new JsonIo.Reader();
		}
		if (!(streamOrString instanceof java.io.InputStream)) {
			args = args || null;
		}
		if (args !== undefined) {
		    if (!(args instanceof java.util.HashMap)) {
		        args = writeNativeObjectToJsonIo(args, false);
		    }
			return new JsonIo.Reader(streamOrString, args);
		}
		return new JsonIo.Reader(streamOrString);
	};
	
	let readJsonIoFromStream = function(streamOrString, args) {
		let reader = getJsonIoReader(streamOrString, args),
			json = reader.readObject();
		try {
			reader.close();
		} catch (e) {
			log("JsonIo: " + e);
		}
		return json;
	};
	
	let readScriptableFromStream = function(streamOrString, args, allowClasses) {
		let json = readJsonIoFromStream(streamOrString, args);
		return readJsonIoToScriptable(json, allowClasses);
	};
	
	JsonIo.getReader = getJsonIoReader;
	JsonIo.readStream = readScriptableFromStream;
	
	EXPORT("JsonIo", JsonIo);
})();
