var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
/**
 * Connects and perform basic stream manipulation.
 */
var Connectivity = /** @class */ (function () {
    /**
     * Creates a connection to specific remote address.
     * @param address of remote
     */
    function Connectivity(address) {
        this.callback = {};
        address && this.setAddress(address);
    }
    /**
     * Returns url was set by connection.
     */
    Connectivity.prototype.getUrl = function () {
        return this.url || null;
    };
    /**
     * Sets current url as an java object.
     * If you need set address, use appropriate method.
     */
    Connectivity.prototype.setUrl = function (url) {
        if (typeof url == "string") {
            Logger.Log("Connectivity: You should use Connectivity.setAddress instead of Connectivity.setUrl for string values", "WARNING");
            return this.setAddress(url);
        }
        if (this.callback.hasOwnProperty("onUrlChanged")) {
            this.callback.onUrlChanged.call(this, url);
        }
        this.url = url;
    };
    /**
     * Use to specify remote address as a string.
     */
    Connectivity.prototype.setAddress = function (address) {
        this.setUrl(new java.net.URL(address));
    };
    /**
     * Event receiver, use to track actions.
     */
    Connectivity.prototype.setCallback = function (callback) {
        if (callback && callback instanceof Object) {
            this.callback = callback;
            return;
        }
        this.callback = {};
    };
    /**
     * Opens and returns a data stream.
     * If url isn't specified, `null` is returned.
     */
    Connectivity.prototype.getStream = function () {
        var connection = this.getConnection();
        if (connection instanceof java.net.URLConnection) {
            return connection ? connection.getInputStream() : null;
        }
        return this.url ? this.url.openStream() : null;
    };
    /**
     * If connection doesn't exist, creates a new one.
     * Method will be used automatically when it needed
     * by corresponding {@link Connectivity.getConnection}.
     */
    Connectivity.prototype.validateConnection = function () {
        if (!(this.connection instanceof java.io.InputStream || this.connection instanceof java.net.URLConnection)) {
            this.connection = this.url ? this.url.openConnection() : null;
            if (this.callback.hasOwnProperty("onCreateConnection")) {
                this.callback.onCreateConnection.call(this, this.connection);
            }
        }
    };
    /**
     * Opens or returns an existing connection.
     * @param force `true` means just return currently connection
     */
    Connectivity.prototype.getConnection = function (force) {
        if (!force)
            this.validateConnection();
        return this.connection || null;
    };
    /**
     * Returns `true` if connection currently exists.
     */
    Connectivity.prototype.hasConnection = function () {
        return this.connection != null;
    };
    /**
     * Connects to created url if it's created.
     * @throws if connection not actually found
     */
    Connectivity.prototype.connect = function () {
        var connection = this.getConnection();
        if (!this.hasConnection()) {
            // @ts-ignore
            MCSystem.throwException("Connectivity: Could not find any opened connection to connect!");
        }
        if (connection instanceof java.net.URLConnection) {
            connection.connect();
        }
        if (this.callback.hasOwnProperty("onConnect")) {
            this.callback.onConnect.call(this, connection);
        }
    };
    /**
     * Disconnects from existing connection.
     * If connection doesn't exist, nothing happens.
     */
    Connectivity.prototype.disconnect = function () {
        if (!this.hasConnection()) {
            return false;
        }
        var connection = this.getConnection();
        if (connection instanceof java.net.HttpURLConnection) {
            connection.disconnect();
        }
        delete this.connection;
        if (this.callback.hasOwnProperty("onDisconnect")) {
            this.callback.onDisconnect.call(this, connection);
        }
        return true;
    };
    /**
     * Gets length of output connection.
     * If connection failed, returns `-1`.
     */
    Connectivity.prototype.getLength = function () {
        var justConnected = this.hasConnection();
        if (!justConnected)
            this.connect();
        var connection = this.getConnection();
        if (!(connection instanceof java.net.URLConnection)) {
            return -1;
        }
        var length = connection.getContentLength();
        if (this.callback.hasOwnProperty("getLength")) {
            this.callback.getLength.call(this, length);
        }
        if (!justConnected)
            this.disconnect();
        return length;
    };
    /**
     * Checks if there's has network connection, it is not
     * know internet actually availabled or not.
     */
    Connectivity.isOnline = function () {
        var service = UI.getContext().getSystemService("connectivity");
        if (service == null) {
            return false;
        }
        var network = service.getActiveNetworkInfo();
        return network != null && network.isConnectedOrConnecting();
    };
    return Connectivity;
}());
(function (Connectivity) {
    /**
     * Directly reads stream as multiline string.
     */
    var Reader = /** @class */ (function (_super) {
        __extends(Reader, _super);
        /**
         * Creates a connection to read text data.
         * @param address of remote
         */
        function Reader(address) {
            var _this = _super.call(this, address) || this;
            _this.callback = {};
            /**
             * @internal
             */
            _this.charset = "UTF-8";
            /**
             * @internal
             */
            _this.processing = false;
            return _this;
        }
        /**
         * Returns current charset of being read data.
         */
        Reader.prototype.getCharset = function () {
            return this.charset || null;
        };
        /**
         * Sets charset for new connections.
         * If charset is `null`, system encoding will be used.
         * @see {@link https://wikipedia.org/wiki/Character_encoding character encoding} for more details
         */
        Reader.prototype.setCharset = function (charset) {
            this.charset = charset;
            if (typeof charset != "string") {
                delete this.charset;
            }
            if (this.callback.hasOwnProperty("onCharsetChanged")) {
                this.callback.onCharsetChanged.call(this, this.charset);
            }
        };
        /**
         * Returns stream reader, or `null` if create failed.
         */
        Reader.prototype.getStreamReader = function () {
            var stream = this.getStream();
            if (stream == null) {
                return null;
            }
            var charset = this.getCharset();
            if (charset == null) {
                return new java.io.InputStreamReader(stream);
            }
            return new java.io.InputStreamReader(stream, charset);
        };
        /**
         * Returns `true` if read process is running.
         */
        Reader.prototype.inProcess = function () {
            return this.processing;
        };
        /**
         * Returns currently read data as an array.
         * Returns `null` if read process hasn't been started.
         */
        Reader.prototype.getCurrentlyReaded = function () {
            return this.result || null;
        };
        /**
         * Returns number of readed lines.
         * Returns `-1` if there is no connection.
         */
        Reader.prototype.getReadedCount = function () {
            var readed = this.getCurrentlyReaded();
            return readed == null ? -1 : readed.length;
        };
        /**
         * Returns readed result, or `null` if none.
         */
        Reader.prototype.toResult = function () {
            var _a;
            return (_a = this.getCurrentlyReaded()) === null || _a === void 0 ? void 0 : _a.join("\n");
        };
        /**
         * Reading process, isn't recommended run on main thread.
         * Wait until work is ended, and method will be return result.
         * @throws error will occur if there's no connection
         */
        Reader.prototype.read = function () {
            var stream = this.getStreamReader();
            if (stream == null) {
                // @ts-ignore
                MCSystem.throwException("Connectivity: Connectivity.Reader: Stream is not specified!");
            }
            this.result = [];
            var reader = new java.io.BufferedReader(stream);
            this.processing = true;
            if (this.callback.hasOwnProperty("onPrepare")) {
                this.callback.onPrepare.call(this);
            }
            while (this.inProcess()) {
                var line = reader.readLine();
                if (line == null) {
                    break;
                }
                else {
                    this.result.push(line);
                }
                if (this.callback.hasOwnProperty("onReadLine")) {
                    this.callback.onReadLine.call(this, this.result, line);
                }
            }
            if (this.callback.hasOwnProperty("onComplete")) {
                this.callback.onComplete.call(this, this.result);
            }
            this.processing = false;
            reader.close();
            return this.toResult();
        };
        return Reader;
    }(Connectivity));
    Connectivity.Reader = Reader;
    /**
     * Connects to perform data transfering to output.
     * @abstract must be overwritten with any prototype
     */
    var Writer = /** @class */ (function (_super) {
        __extends(Writer, _super);
        /**
         * Loads a data stream into specified stream.
         * @abstract must be overwritten with any prototype
         * @see {@link getOutputStream} method for details
         * @param address of remote
         */
        function Writer(address) {
            var _this = _super.call(this, address) || this;
            _this.callback = {};
            /**
             * @internal
             */
            _this.size = 8192;
            /**
             * @internal
             */
            _this.processing = false;
            return _this;
        }
        /**
         * Returns buffer size for reading data.
         * Returns `-1` if value resetted.
         */
        Writer.prototype.getBufferSize = function () {
            return this.size <= 0 ? -1 : this.size;
        };
        /**
         * Sets read buffer size.
         */
        Writer.prototype.setBufferSize = function (size) {
            if (typeof size == "undefined") {
                this.size = 8192;
                return;
            }
            this.size = size;
        };
        /**
         * Returns length of readed data.
         * Returns `-1` if there is no connection.
         */
        Writer.prototype.getReadedCount = function () {
            if (typeof this.count == "undefined") {
                return -1;
            }
            return this.count;
        };
        /**
         * Returns a buffered stream reader, can be overwritten in prototypes.
         */
        Writer.prototype.getStreamReader = function () {
            var stream = this.getStream();
            if (stream == null) {
                return null;
            }
            var size = this.getBufferSize();
            if (size == -1) {
                return new java.io.BufferedInputStream(stream);
            }
            return new java.io.BufferedInputStream(stream, size);
        };
        /**
         * Returns `true` if download process is running.
         */
        Writer.prototype.inProcess = function () {
            return this.processing;
        };
        /**
         * Loads a stream into given output data stream.
         * @throws error will occur if there's no connection
         * @throws error if output stream is invalid
         */
        Writer.prototype.download = function () {
            var stream = this.getStreamReader();
            if (stream == null) {
                // @ts-ignore
                MCSystem.throwException("Connectivity: Could not download(), input stream is missing!");
            }
            var output = this.getOutputStream();
            if (output == null) {
                // @ts-ignore
                MCSystem.throwException("Connectivity: Could not download(), output stream is missing!");
            }
            this.connect();
            this.count = 0;
            this.processing = true;
            var size = this.getLength();
            if (this.callback.hasOwnProperty("onPrepare")) {
                this.callback.onPrepare.call(this, size);
            }
            var data = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
            while (this.inProcess()) {
                var count = stream.read(data);
                if (count == -1) {
                    break;
                }
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
        return Writer;
    }(Connectivity));
    Connectivity.Writer = Writer;
    /**
     * Perform transfering stream to filesystem.
     */
    var Downloader = /** @class */ (function (_super) {
        __extends(Downloader, _super);
        /**
         * Loads a stream to specified file path.
         * @param address of remote
         * @param path file path
         */
        function Downloader(address, path) {
            var _this = _super.call(this, address) || this;
            _this.callback = {};
            path && _this.setPath(path);
            return _this;
        }
        /**
         * Returns currently specified file.
         */
        Downloader.prototype.getFile = function () {
            return this.file || null;
        };
        /**
         * Sets java file to write stream.
         * If argument isn't given, resets it.
         */
        Downloader.prototype.setFile = function (file) {
            this.file = file;
            if (!(file instanceof java.io.File)) {
                delete this.file;
            }
            if (this.callback.hasOwnProperty("onFileChanged")) {
                this.callback.onFileChanged.call(this, file);
            }
        };
        /**
         * Returns currently file path.
         * Returns `null` if file isn't specified.
         */
        Downloader.prototype.getPath = function () {
            var file = this.getFile();
            return file == null ? null : file.getPath();
        };
        /**
         * Sets path to file, replaces current output file.
         */
        Downloader.prototype.setPath = function (path) {
            this.setFile(new java.io.File(path));
        };
        /**
         * Returns output stream from file.
         * @throws error when input file is not specified
         */
        Downloader.prototype.getOutputStream = function () {
            var file = this.getFile();
            if (file == null) {
                // @ts-ignore
                MCSystem.throwException("Connectivity: Connectivity.Downloader: Input file is not specified!");
            }
            if (!file.exists()) {
                file.getParentFile().mkdirs();
                file.createNewFile();
            }
            var stream = new java.io.FileOutputStream(file);
            return new java.io.BufferedOutputStream(stream);
        };
        return Downloader;
    }(Writer));
    Connectivity.Downloader = Downloader;
    /**
     * A quick way to create thread, errors are handled.
     * @param action action to handle
     * @param callback fail callback
     * @param connect will be passed into callback scope
     * @throws error if action isn't specified
     */
    function handle(action, callback, connect) {
        new java.lang.Thread(new java.lang.Runnable({
            run: function () {
                try {
                    action();
                }
                catch (e) {
                    try {
                        if (callback && typeof callback == "object") {
                            // @ts-expect-error
                            if (callback.hasOwnProperty("onFail")) {
                                if (connect) {
                                    // @ts-expect-error
                                    return callback.onFail.call(connect);
                                }
                                else {
                                    // @ts-expect-error
                                    return callback.onFail();
                                }
                            }
                        }
                        else if (typeof callback == "function") {
                            if (connect) {
                                callback.call(connect);
                            }
                            else {
                                callback();
                            }
                        }
                        Logger.Log("Connectivity: Failed to read network data from a server", "WARNING");
                    }
                    catch (t) {
                        Logger.Log("Connectivity: A fatal error occurred while trying to network connect", "ERROR");
                    }
                }
            }
        })).start();
    }
    Connectivity.handle = handle;
    /**
     * A quick way to get content length from connection.
     * @param address url address
     * @param callback action or callback
     * @see {@link Connectivity.getLength} for details
     */
    function lengthUrl(address, callback) {
        if (!Connectivity.isOnline()) {
            if (callback && typeof callback == "object") {
                // @ts-expect-error
                if (callback.hasOwnProperty("isNotConnected")) {
                    // @ts-expect-error
                    callback.isNotConnected();
                }
            }
            return false;
        }
        var connect = new Connectivity(address);
        if (callback && typeof callback == "object") {
            connect.setCallback(callback);
        }
        handle(function () {
            if (callback) {
                if (typeof callback == "object") {
                    connect.getLength();
                }
                else {
                    callback(connect.getLength());
                }
            }
            else {
                Logger.Log("Connectivity: Network action after doing stream length is missed", "WARNING");
                connect.getLength();
            }
            // @ts-expect-error
        }, callback, connect);
        return true;
    }
    Connectivity.lengthUrl = lengthUrl;
    /**
     * A quick way to read data from connection.
     * @param address url address
     * @param callback action or callback
     * @see {@link Reader.read} for details
     */
    function readUrl(address, callback) {
        if (!Connectivity.isOnline()) {
            if (callback && typeof callback == "object") {
                // @ts-expect-error
                if (callback.hasOwnProperty("isNotConnected")) {
                    // @ts-expect-error
                    callback.isNotConnected();
                }
            }
            return false;
        }
        var reader = new Connectivity.Reader(address);
        if (callback && typeof callback == "object") {
            reader.setCallback(callback);
        }
        handle(function () {
            if (callback) {
                if (typeof callback == "object") {
                    reader.read();
                }
                else {
                    callback(reader.read());
                }
            }
            else {
                Logger.Log("Connectivity: Network action after doing stream reading is missed", "WARNING");
                reader.read();
            }
            // @ts-expect-error
        }, callback, reader);
        return true;
    }
    Connectivity.readUrl = readUrl;
    /**
     * A quick way to download file from connection.
     * @param address url address
     * @param path file path
     * @param callback action or callback
     * @see {@link Downloader.download} for details
     */
    function downloadUrl(address, path, callback) {
        if (!Connectivity.isOnline()) {
            if (callback && typeof callback == "object") {
                // @ts-expect-error
                if (callback.hasOwnProperty("isNotConnected")) {
                    // @ts-expect-error
                    callback.isNotConnected();
                }
            }
            return false;
        }
        var writer = new Connectivity.Downloader(address, path);
        if (callback && typeof callback == "object") {
            callback && writer.setCallback(callback);
        }
        handle(function () {
            writer.download();
            if (typeof callback == "function") {
                return callback();
            }
        }, callback, writer);
        return true;
    }
    Connectivity.downloadUrl = downloadUrl;
})(Connectivity || (Connectivity = {}));
EXPORT("Connectivity", Connectivity);
