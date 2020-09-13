/*
	 _   _      _                      _    _      _ _     
	| \ | |    | |                    | |  | |    (_) |    
	|  \| | ___| |___      _____  _ __| | _| |     _| |__  
	| . ` |/ _ \ __\ \ /\ / / _ \| '__| |/ / |    | | '_ \ 
	| |\  |  __/ |_ \ V  V / (_) | |  |   <| |____| | |_) |
	|_| \_|\___|\__| \_/\_/ \___/|_|  |_|\_\______|_|_.__/ 
														   
														   
   Copyright 2020 Nernar (github.com/nernar)
   
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
	name: "Network",
	api: "AdaptedScript",
	shared: false,
	version: 1
});

/**
 * @constructor
 * Creates a connection to specific remote address.
 * @param {string} [address] address
 */
let Network = function(address) {
	this.callback = new Object();
	address && this.setAddress(address);
};

/**
 * Returns url was set by connection.
 * @returns {Object||null} java url
 */
Network.prototype.getUrl = function() {
	return this.url || null;
};

/**
 * Sets current url as an java object.
 * If you need set address, use appropriate method.
 * @param {Object|null} url java url
 */
Network.prototype.setUrl = function(url) {
	if (url instanceof String) {
		Logger.Log("You should use Network.setAddress(address) instead of Network.setUrl(url) for string values", "Network");
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
 * @returns {boolean} is installed successfully
 */
Network.prototype.setAddress = function(address) {
	if (!(address instanceof Number)) {
		this.setUrl(new java.net.URL(address));
		return true;
	}
	return false;
};

/**
 * Event receiver, use to track actions.
 * @param {Object} callback callback
 */
Network.prototype.setCallback = function(callback) {
	if (callback && callback instanceof Object) {
		this.callback = callback;
		return;
	}
	this.callback = new Object();
};

/**
 * Opens and returns a data stream.
 * If url isn't specified, [[null]] is returned.
 * @returns {Object|null} java stream
 */
Network.prototype.getStream = function() {
	return this.url ? this.url.openStream() : null;
};

/**
 * If connection doesn't exist, creates a new one.
 */
Network.prototype.validateConnection = function() {
	if (this.connection == null || this.connection == undefined) {
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
Network.prototype.getConnection = function(force) {
	if (!force) this.validateConnection();
	return this.connection || null;
};

/**
 * Returns true if connection exists.
 * @returns {boolean} has connection
 */
Network.prototype.hasConnection = function() {
	return this.getConnection(true) != null;
};

/**
 * Connects to created url if it's created.
 * @throws if connection creation failed
 */
Network.prototype.connect = function() {
	let connection = this.getConnection();
	if (connection) connection.connect();
	else throw new Error("Can't find any opened connection to connect");
	if (this.callback.hasOwnProperty("onConnect")) {
		this.callback.onConnect.call(this, connection);
	}
};

/**
 * Disconnects from existing connection.
 * If connection doesn't exist, nothing happens.
 */
Network.prototype.disconnect = function() {
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
Network.prototype.getLength = function() {
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
 * @param {Object} [context] interface context
 * @returns {boolean} has connection
 */
Network.isOnline = function(context) {
	if (context == undefined || context == null) {
		context = UI.getContext();
	}
	let service = context.getSystemService("connectivity");
	if (service == null) {
		return false;
	}
	let network = service.getActiveNetworkInfo();
	if (network == null || !network.isConnectedOrConnecting()) {
		return false;
	}
	return true;
};

/**
 * @constructor
 * Creates a connection to read text data.
 * @param {string} [address] address
 */
Network.Reader = function(address) {
	address && this.setAddress(address);
};

Network.Reader.prototype = new Network;
Network.Reader.prototype.charset = "UTF-8";

/**
 * Returns current charset of being read data.
 * @returns {string|null} charset
 */
Network.Reader.prototype.getCharset = function() {
	return this.charset || null;
};

/**
 * Sets charset for new connections.
 * If charset is [[null]], system encoding will be used.
 * @param {string|null} character encoding
 * See {@link https://wikipedia.org/wiki/Character_encoding|character encoding} for more details.
 */
Network.Reader.prototype.setCharset = function(charset) {
	if (charset) this.charset = charset;
	else delete this.charset;
	if (this.callback.hasOwnProperty("onCharsetChanged")) {
		this.callback.onCharsetChanged.call(this, this.charset);
	}
};

/**
 * Returns stream reader, or [[null]] if create failed.
 * @returns {Object|null} java stream reader
 */
Network.Reader.prototype.getStreamReader = function() {
	let stream = this.getStream();
	if (!stream) return null;
	let charset = this.getCharset();
	if (!charset) return new java.io.InputStreamReader(stream);
	return new java.io.InputStreamReader(stream, charset);
};

/**
 * Returns [[true]] if read process is running.
 * @returns {boolean} in process
 */
Network.Reader.prototype.inProcess = function() {
	return !!this.processing;
};

/**
 * Returns currently read data as an array.
 * Returns [[null]] if read process hasn't been started.
 * @returns {Object|null} readed array
 */
Network.Reader.prototype.getCurrentlyReaded = function() {
	return this.result || null;
};

/**
 * Returns number of readed lines.
 * Returns [[-1]] if there is no connection.
 * @returns {number} readed lines count
 */
Network.Reader.prototype.getReadedCount = function() {
	let readed = this.getCurrentlyReaded();
	return readed ? readed.length : -1;
};

/**
 * Returns readed result, or [[null]] if none.
 * @returns {string|null} result
 */
Network.Reader.prototype.getResult = function() {
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
Network.Reader.prototype.read = function() {
	let stream = this.getStreamReader();
	if (!stream) throw new Error("Can't read stream, because one of params is missing");
	let result = this.result = new Array(),
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

/**
 * @constructor
 * Loads a data stream into specified stream.
 * Must be overwritten with any prototype.
 * See [[getOutputStream()]] method for details.
 * @param {string} [address] address
 */
Network.Writer = function(address) {
	address && this.setAddress(address);
};

Network.Writer.prototype = new Network;
Network.Writer.prototype.size = 8192;

/**
 * Returns buffer size for reading data.
 * Returns [[-1]] if default value setted.
 * @returns {number} buffer size
 */
Network.Writer.prototype.getBufferSize = function() {
	return this.size || -1;
};

/**
 * Sets read buffer size.
 * @param {number|null} size buffer size
 */
Network.Writer.prototype.setBufferSize = function(size) {
	if (size) this.size = size;
	else delete this.size;
};

/**
 * Returns length of readed data 
 * Returns [[-1]] if there is no connection.
 * @returns {number} readed data length
 */
Network.Writer.prototype.getReadedCount = function() {
	return this.count ? this.count : this.inProcess() ? 0 : -1;
};

/**
 * Returns a stream reader, can be overwritten in prototypes.
 * @returns {Object|null} java input stream
 */
Network.Writer.prototype.getStreamReader = function() {
	let stream = this.getStream();
	if (!stream) return null;
	let size = this.getBufferSize();
	if (!size) return new java.io.BufferedInputStream(stream);
	return new java.io.BufferedInputStream(stream, size);
};

/**
 * Returns output stream, must be overwritten by any prototype.
 * @throws error if not overwritten by prototype
 */
Network.Writer.prototype.getOutputStream = function() {
	throw new Error("You must install a method getOutputStream()");
};

/**
 * Returns [[true]] if download process is running.
 * @returns {boolean} in process
 */
Network.Writer.prototype.inProcess = function() {
	return !!this.processing;
};

/**
 * Loads a file into given output data stream.
 * @throws error will occur if there's no connection
 * @throws error if output stream is invalid
 */
Network.Writer.prototype.download = function() {
	let stream = this.getStreamReader(), output = this.getOutputStream();
	if (!stream) throw new Error("Can't download stream, because input stream is missing");
	if (!output) throw new Error("Can't download stream, because output stream is missing");
	this.connect(), this.count = 0;
	this.processing = true;
	let size = this.getLength();
	if (this.callback.hasOwnProperty("onPrepare")) {
		this.callback.onPrepare.call(this, size);
	}
	let data = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
	while (this.inProcess()) {
		let count = input.read(data);
		if (count == -1) break;
		else {
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

/**
 * @constructor
 * Loads a stream to file.
 * @param {string} [address] address
 * @param {string} [path] file path
 */
Network.Downloader = function(address, path) {
	address && this.setAddress(address);
	path && this.setPath(path);
};

Network.Downloader.prototype = new Network.Writer;

/**
 * Returns currently specified file.
 * @returns {Object|null} java file
 */
Network.Downloader.prototype.getFile = function() {
	return this.file || null;
};

/**
 * Sets java file to stream.
 * If argument isn't given, removes it.
 * @param {Object|null} file java file
 */
Network.Downloader.prototype.setFile = function(file) {
	if (file) this.file = file;
	else delete this.file;
	if (this.callback.hasOwnProperty("onFileChanged")) {
		this.callback.onFileChanged.call(this, file);
	}
};

/**
 * Returns currently file path.
 * Returns [[null]] if file isn't specified.
 * @returns {string|null} specified path
 */
Network.Downloader.prototype.getPath = function() {
	let file = this.getFile();
	return file ? file.getPath() : null;
};

/**
 * Sets path to file, replaces current file.
 * @param {string} path file path
 */
Network.Downloader.prototype.setPath = function(path) {
	let file = new java.io.File(path);
	if (file) this.setFile(file);
};

/**
 * Returns output stream from file.
 * If file isn't specified, will return [[null]].
 * @returns {Object|null} output stream
 */
Network.Downloader.prototype.getOutputStream = function() {
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

/**
 * A quick way to create thread, errors are handled.
 * @param {Function} action action to handle
 * @param {Object|Function} [callback] fail callback
 * @param {any} connect will be passed into callback
 * @throws error if action isn't specified
 */
Network.handle = function(action, callback, connect) {
	if (!(action instanceof Function)) {
		throw new Error("Nothing to handle");
	}
	new java.lang.Thread(function() {
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
				Logger.Log("Failed to read data from a server", "Warning");
			} catch (t) {
				Logger.Log("A fatal error occurred while trying to connect", "Error");
			}
			Logger.LogError(e);
		}
	}).start();
};

/**
 * A quick way to length content from connection.
 * @param {string} address url address
 * @param {Object|Function} callback action or callback
 * @returns {boolean} has process started
 */
Network.lengthUrl = function(address, callback) {
	if (!Network.isOnline()) {
		if (callback && callback instanceof Object) {
			if (callback.hasOwnProperty("isNotConnected")) {
				callback.isNotConnected();
			}
		}
		return false;
	}
	let connect = new Network.Connect(address);
	if (callback && callback instanceof Object) {
		callback && connect.setCallback(callback);
	}
	this.handle(function() {
		if (callback) {
			if (callback instanceof Object) {
				connect.getLength()
			} else {
				callback(connect.getLength());
			}
		} else {
			Logger.Log("Action after doing stream length is missed", "Warning")
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
Network.readUrl = function(address, callback) {
	if (!Network.isOnline()) {
		if (callback && callback instanceof Object) {
			if (callback.hasOwnProperty("isNotConnected")) {
				callback.isNotConnected();
			}
		}
		return false;
	}
	let reader = new Network.Reader(address);
	if (callback && callback instanceof Object) {
		callback && reader.setCallback(callback);
	}
	this.handle(function() {
		if (callback) {
			if (callback instanceof Object) {
				reader.read();
			} else {
				callback(reader.read());
			}
		} else {
			Logger.Log("Action after doing stream reading is missed", "Warning")
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
Network.downloadUrl = function(address, path, callback) {
	if (!Network.isOnline()) {
		if (callback && callback instanceof Object) {
			if (callback.hasOwnProperty("isNotConnected")) {
				callback.isNotConnected();
			}
		}
		return false;
	}
	let writer = new Network.Downloader(address, path);
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

EXPORT("Network", Network);
