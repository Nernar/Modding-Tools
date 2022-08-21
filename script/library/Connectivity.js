/*
BUILD INFO:
  dir: Connectivity
  target: Connectivity.js
  files: 6
*/



// file: header.js

/*

   Copyright 2020-2022 Nernar (github.com/nernar)

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
	name: "Connectivity",
	version: 1,
	api: "AdaptedScript",
	shared: true
});




// file: network/Connectivity.js

/**
 * @constructor
 * Creates a connection to specific remote address.
 * @param {string} [address] address
 */
Connectivity = function(address) {
	this.callback = {};
	address && this.setAddress(address);
};

/**
 * Returns url was set by connection.
 * @returns {Object|null} java url
 */
Connectivity.prototype.getUrl = function() {
	return this.url || null;
};

/**
 * Sets current url as an java object.
 * If you need set address, use appropriate method.
 * @param {Object|null} url java url
 */
Connectivity.prototype.setUrl = function(url) {
	if ("" + url == url) {
		Logger.Log("Connectivity: You should use Connectivity.setAddress instead of Connectivity.setUrl for string values", "WARNING");
		this.setAddress(url);
		return;
	}
	if (this.callback.hasOwnProperty("onUrlChanged")) {
		this.callback.onUrlChanged.call(this, url);
	}
	this.url = url;
};

/**
 * Use to specify remote address as a string.
 * @param {string} address address
 */
Connectivity.prototype.setAddress = function(address) {
	this.setUrl(new java.net.URL(address));
};

/**
 * Event receiver, use to track actions.
 * @param {Object} callback callback
 */
Connectivity.prototype.setCallback = function(callback) {
	if (callback && callback instanceof Object) {
		this.callback = callback;
		return;
	}
	this.callback = {};
};

/**
 * Opens and returns a data stream.
 * If url isn't specified, [[null]] is returned.
 * @returns {Object|null} java stream
 */
Connectivity.prototype.getStream = function() {
	try {
		return this.url ? this.url.openStream() : null;
	} catch (e) {
		let connection = this.getConnection();
		return connection ? connection.getInputStream() : null;
	}
};

/**
 * If connection doesn't exist, creates a new one.
 */
Connectivity.prototype.validateConnection = function() {
	if (this.connection == null || this.connection === undefined) {
		this.connection = this.url ? this.url.openConnection() : null;
		if (this.callback.hasOwnProperty("onCreateConnection")) {
			this.callback.onCreateConnection.call(this, this.connection);
		}
	}
};

/**
 * Opens or returns an existing connection.
 * @param {boolean} [force] if [[true]], willn't open a new connection
 * @returns {Object|null} java connection
 */
Connectivity.prototype.getConnection = function(force) {
	if (!force) this.validateConnection();
	return this.connection || null;
};

/**
 * Returns true if connection exists.
 * @returns {boolean} has connection
 */
Connectivity.prototype.hasConnection = function() {
	return this.getConnection(true) !== null;
};

/**
 * Connects to created url if it's created.
 * @throws if connection creation failed
 */
Connectivity.prototype.connect = function() {
	let connection = this.getConnection();
	if (connection) connection.connect();
	else MCSystem.throwException("Connectivity: Couldn't find any opened connection to connect");
	if (this.callback.hasOwnProperty("onConnect")) {
		this.callback.onConnect.call(this, connection);
	}
};

/**
 * Disconnects from existing connection.
 * If connection doesn't exist, nothing happens.
 */
Connectivity.prototype.disconnect = function() {
	let connection = this.getConnection();
	if (!connection) return;
	connection.disconnect();
	delete this.connection;
	if (this.callback.hasOwnProperty("onDisconnect")) {
		this.callback.onDisconnect.call(this, connection);
	}
};

/**
 * Gets length of output connection.
 * If connection failed, returns [[-1]].
 * @returns {number} bytes count
 */
Connectivity.prototype.getLength = function() {
	let connected = this.hasConnection();
	if (!connected) this.connect();
	let connection = this.getConnection(),
		length = connection ? connection.getContentLength() : -1;
	if (this.callback.hasOwnProperty("getLength")) {
		this.callback.getLength.call(this, length);
	}
	connected && this.disconnect();
	return length;
};

/**
 * Checks if there's has internet connection.
 * @returns {boolean} has connection
 */
Connectivity.isOnline = function() {
	let service = UI.getContext().getSystemService("connectivity");
	if (service == null) {
		return false;
	}
	let network = service.getActiveNetworkInfo();
	if (network == null || !network.isConnectedOrConnecting()) {
		return false;
	}
	return true;
};




// file: network/Reader.js

/**
 * @constructor
 * Creates a connection to read text data.
 * @param {string} [address] address
 */
Connectivity.Reader = function(address) {
	address && this.setAddress(address);
};

Connectivity.Reader.prototype = new Connectivity;
Connectivity.Reader.prototype.charset = "UTF-8";

/**
 * Returns current charset of being read data.
 * @returns {string|null} charset
 */
Connectivity.Reader.prototype.getCharset = function() {
	return this.charset || null;
};

/**
 * Sets charset for new connections.
 * If charset is [[null]], system encoding will be used.
 * @param {string|null} character encoding
 * See {@link https://wikipedia.org/wiki/Character_encoding|character encoding} for more details.
 */
Connectivity.Reader.prototype.setCharset = function(charset) {
	if (charset) {
		this.charset = charset;
	} else delete this.charset;
	if (this.callback.hasOwnProperty("onCharsetChanged")) {
		this.callback.onCharsetChanged.call(this, this.charset);
	}
};

/**
 * Returns stream reader, or [[null]] if create failed.
 * @returns {Object|null} java stream reader
 */
Connectivity.Reader.prototype.getStreamReader = function() {
	let stream = this.getStream();
	if (!stream) return null;
	let charset = this.getCharset();
	if (!charset) {
		return new java.io.InputStreamReader(stream);
	}
	return new java.io.InputStreamReader(stream, charset);
};

/**
 * Returns [[true]] if read process is running.
 * @returns {boolean} in process
 */
Connectivity.Reader.prototype.inProcess = function() {
	return !!this.processing;
};

/**
 * Returns currently read data as an array.
 * Returns [[null]] if read process hasn't been started.
 * @returns {Object|null} readed array
 */
Connectivity.Reader.prototype.getCurrentlyReaded = function() {
	return this.result || null;
};

/**
 * Returns number of readed lines.
 * Returns [[-1]] if there is no connection.
 * @returns {number} readed lines count
 */
Connectivity.Reader.prototype.getReadedCount = function() {
	let readed = this.getCurrentlyReaded();
	return readed ? readed.length : -1;
};

/**
 * Returns readed result, or [[null]] if none.
 * @returns {string|null} result
 */
Connectivity.Reader.prototype.getResult = function() {
	let readed = this.getCurrentlyReaded();
	if (!readed) return null;
	return readed.join("\n");
};

/**
 * Reading process, isn't recommended run on main thread.
 * Wait until work is ended, and method will be return result.
 * @throws error will occur if there's no connection
 * @returns {string} read lines
 */
Connectivity.Reader.prototype.read = function() {
	let stream = this.getStreamReader();
	if (!stream) {
		MCSystem.throwException("Connectivity: Couldn't read stream, because one of params is missing");
	}
	let result = this.result = [],
		reader = new java.io.BufferedReader(stream);
	this.processing = true;
	if (this.callback.hasOwnProperty("onPrepare")) {
		this.callback.onPrepare.call(this);
	}
	while (this.inProcess()) {
		let line = reader.readLine();
		if (line == null) break;
		else result.push(line);
		if (this.callback.hasOwnProperty("onReadLine")) {
			this.callback.onReadLine.call(this, result, line);
		}
	}
	if (this.callback.hasOwnProperty("onComplete")) {
		this.callback.onComplete.call(this);
	}
	delete this.processing;
	reader.close();
	return this.getResult();
};




// file: network/Writer.js

/**
 * @constructor
 * Loads a data stream into specified stream.
 * Must be overwritten with any prototype.
 * See [[getOutputStream()]] method for details.
 * @param {string} [address] address
 */
Connectivity.Writer = function(address) {
	address && this.setAddress(address);
};

Connectivity.Writer.prototype = new Connectivity;
Connectivity.Writer.prototype.size = 8192;

/**
 * Returns buffer size for reading data.
 * Returns [[-1]] if default value setted.
 * @returns {number} buffer size
 */
Connectivity.Writer.prototype.getBufferSize = function() {
	return this.size || -1;
};

/**
 * Sets read buffer size.
 * @param {number|null} size buffer size
 */
Connectivity.Writer.prototype.setBufferSize = function(size) {
	if (size) this.size = size;
	else delete this.size;
};

/**
 * Returns length of readed data 
 * Returns [[-1]] if there is no connection.
 * @returns {number} readed data length
 */
Connectivity.Writer.prototype.getReadedCount = function() {
	return this.count ? this.count : this.inProcess() ? 0 : -1;
};

/**
 * Returns a stream reader, can be overwritten in prototypes.
 * @returns {Object|null} java input stream
 */
Connectivity.Writer.prototype.getStreamReader = function() {
	let stream = this.getStream();
	if (!stream) return null;
	let size = this.getBufferSize();
	if (!size) {
		return new java.io.BufferedInputStream(stream);
	}
	return new java.io.BufferedInputStream(stream, size);
};

/**
 * Returns output stream, must be overwritten by any prototype.
 * @throws error if not overwritten by prototype
 */
Connectivity.Writer.prototype.getOutputStream = function() {
	MCSystem.throwException("Connectivity: Connectivity.Writer.getOutputStream must be implemented");
};

/**
 * Returns [[true]] if download process is running.
 * @returns {boolean} in process
 */
Connectivity.Writer.prototype.inProcess = function() {
	return !!this.processing;
};

/**
 * Loads a file into given output data stream.
 * @throws error will occur if there's no connection
 * @throws error if output stream is invalid
 */
Connectivity.Writer.prototype.download = function() {
	let stream = this.getStreamReader(),
		output = this.getOutputStream();
	if (!stream) {
		MCSystem.throwException("Connectivity: Couldn't download stream, because input stream is missing");
	}
	if (!output) {
		MCSystem.throwException("Connectivity: Couldn't download stream, because output stream is missing");
	}
	this.connect(), this.count = 0;
	this.processing = true;
	let size = this.getLength();
	if (this.callback.hasOwnProperty("onPrepare")) {
		this.callback.onPrepare.call(this, size);
	}
	let data = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
	while (this.inProcess()) {
		let count = stream.read(data);
		if (count == -1) {
			break;
		} else {
			output.write(data, 0, count);
			if (this.callback.hasOwnProperty("onProgress")) {
				this.callback.onProgress.call(this, count, size);
			}
			this.count += count;
		}
	}
	if (this.callback.hasOwnProperty("onComplete")) {
		this.callback.onComplete.call(this, size);
	}
	this.processing = false;
	this.disconnect();
	output.flush();
	output.close();
	stream.close();
};




// file: network/Downloader.js

/**
 * @constructor
 * Loads a stream to file.
 * @param {string} [address] address
 * @param {string} [path] file path
 */
Connectivity.Downloader = function(address, path) {
	address && this.setAddress(address);
	path && this.setPath(path);
};

Connectivity.Downloader.prototype = new Connectivity.Writer;

/**
 * Returns currently specified file.
 * @returns {Object|null} java file
 */
Connectivity.Downloader.prototype.getFile = function() {
	return this.file || null;
};

/**
 * Sets java file to stream.
 * If argument isn't given, removes it.
 * @param {Object|null} file java file
 */
Connectivity.Downloader.prototype.setFile = function(file) {
	if (file) {
		this.file = file;
	} else delete this.file;
	if (this.callback.hasOwnProperty("onFileChanged")) {
		this.callback.onFileChanged.call(this, file);
	}
};

/**
 * Returns currently file path.
 * Returns [[null]] if file isn't specified.
 * @returns {string|null} specified path
 */
Connectivity.Downloader.prototype.getPath = function() {
	let file = this.getFile();
	return file ? file.getPath() : null;
};

/**
 * Sets path to file, replaces current file.
 * @param {string} path file path
 */
Connectivity.Downloader.prototype.setPath = function(path) {
	let file = new java.io.File(path);
	if (file) this.setFile(file);
};

/**
 * Returns output stream from file.
 * If file isn't specified, will return [[null]].
 * @returns {Object|null} output stream
 */
Connectivity.Downloader.prototype.getOutputStream = function() {
	let file = this.getFile();
	if (!file) return null;
	if (!file.exists()) {
		file.getParentFile().mkdirs();
		file.createNewFile();
	}
	let stream = new java.io.FileOutputStream(file);
	if (!stream) return null;
	return new java.io.BufferedOutputStream(stream);
};




// file: integration.js

/**
 * A quick way to create thread, errors are handled.
 * @param {Function} action action to handle
 * @param {Object|Function} [callback] fail callback
 * @param {any} connect will be passed into callback
 * @throws error if action isn't specified
 */
Connectivity.handle = function(action, callback, connect) {
	if (!(action instanceof Function)) {
		MCSystem.throwException("Connectivity: Nothing to network handle");
	}
	handleThread(function() {
		try {
			action();
		} catch (e) {
			try {
				if (callback && callback instanceof Object) {
					if (callback.hasOwnProperty("onFail")) {
						callback.onFail.call(connect);
						return;
					}
				} else if (callback instanceof Function) {
					callback.call(connect);
				}
				Logger.Log("Connectivity: Failed to read network data from a server", "WARNING");
			} catch (t) {
				Logger.Log("Connectivity: A fatal error occurred while trying to network connect", "ERROR");
			}
		}
	});
};

/**
 * A quick way to length content from connection.
 * @param {string} address url address
 * @param {Object|Function} callback action or callback
 * @returns {boolean} has process started
 */
Connectivity.lengthUrl = function(address, callback) {
	if (!Connectivity.isOnline()) {
		if (callback && callback instanceof Object) {
			if (callback.hasOwnProperty("isNotConnected")) {
				callback.isNotConnected();
			}
		}
		return false;
	}
	let connect = new Connectivity.Connect(address);
	if (callback && callback instanceof Object) {
		callback && connect.setCallback(callback);
	}
	this.handle(function() {
		if (callback) {
			if (callback instanceof Object) {
				connect.getLength();
			} else callback(connect.getLength());
		} else {
			Logger.Log("Connectivity: Network action after doing stream length is missed", "WARNING")
			connect.getLength();
		}
	}, callback, connect);
	return true;
};

/**
 * A quick way to read data from connection.
 * @param {string} address url address
 * @param {Object|Function} callback action or callback
 * @returns {boolean} has process started
 */
Connectivity.readUrl = function(address, callback) {
	if (!Connectivity.isOnline()) {
		if (callback && callback instanceof Object) {
			if (callback.hasOwnProperty("isNotConnected")) {
				callback.isNotConnected();
			}
		}
		return false;
	}
	let reader = new Connectivity.Reader(address);
	if (callback && callback instanceof Object) {
		callback && reader.setCallback(callback);
	}
	this.handle(function() {
		if (callback) {
			if (callback instanceof Object) {
				reader.read();
			} else callback(reader.read());
		} else {
			Logger.Log("Connectivity: Network action after doing stream reading is missed", "WARNING")
			reader.read();
		}
	}, callback, reader);
	return true;
};

/**
 * A quick way to download file from connection.
 * @param {string} address url address
 * @param {string} path file path
 * @param {Object|Function} [callback] action or callback
 * @returns {boolean} has process started
 */
Connectivity.downloadUrl = function(address, path, callback) {
	if (!Connectivity.isOnline()) {
		if (callback && callback instanceof Object) {
			if (callback.hasOwnProperty("isNotConnected")) {
				callback.isNotConnected();
			}
		}
		return false;
	}
	let writer = new Connectivity.Downloader(address, path);
	if (callback && callback instanceof Object) {
		callback && writer.setCallback(callback);
	}
	this.handle(function() {
		if (callback instanceof Function) {
			callback(writer.download());
			return;
		}
		writer.download();
	}, callback, writer);
	return true;
};

EXPORT("Connectivity", Connectivity);




