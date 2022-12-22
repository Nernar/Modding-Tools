/**
 * Connects and perform basic stream manipulation.
 */
declare class Connectivity {
    protected callback: {
        onUrlChanged?: (url: java.net.URL) => void;
        onCreateConnection?: (connection: java.io.InputStream | java.net.URLConnection) => void;
        onConnect?: (connection: java.io.InputStream | java.net.URLConnection) => void;
        onDisconnect?: (connection: java.io.InputStream | java.net.URLConnection) => void;
        getLength?: (length: number) => void;
    };
    /**
     * Creates a connection to specific remote address.
     * @param address of remote
     */
    constructor(address?: string);
    /**
     * Returns url was set by connection.
     */
    getUrl(): java.net.URL;
    /**
     * Sets current url as an java object.
     * If you need set address, use appropriate method.
     */
    setUrl(url: java.net.URL | string): void;
    /**
     * Use to specify remote address as a string.
     */
    setAddress(address: string): void;
    /**
     * Event receiver, use to track actions.
     */
    setCallback(callback?: typeof this.callback): void;
    /**
     * Opens and returns a data stream.
     * If url isn't specified, `null` is returned.
     */
    getStream(): java.io.InputStream;
    /**
     * If connection doesn't exist, creates a new one.
     * Method will be used automatically when it needed
     * by corresponding {@link Connectivity.getConnection}.
     */
    validateConnection(): void;
    /**
     * Opens or returns an existing connection.
     * @param force `true` means just return currently connection
     */
    getConnection(force?: boolean): java.io.InputStream | java.net.URLConnection;
    /**
     * Returns `true` if connection currently exists.
     */
    hasConnection(): boolean;
    /**
     * Connects to created url if it's created.
     * @throws if connection not actually found
     */
    connect(): void;
    /**
     * Disconnects from existing connection.
     * If connection doesn't exist, nothing happens.
     */
    disconnect(): boolean;
    /**
     * Gets length of output connection.
     * If connection failed, returns `-1`.
     */
    getLength(): number;
    /**
     * Checks if there's has network connection, it is not
     * know internet actually availabled or not.
     */
    static isOnline(): boolean;
}
declare namespace Connectivity {
    /**
     * Directly reads stream as multiline string.
     */
    class Reader extends Connectivity {
        protected callback: {
            onUrlChanged?: (url: java.net.URL) => void;
            onCreateConnection?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            onConnect?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            onDisconnect?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            getLength?: (length: number) => void;
            onCharsetChanged?: (charset: string) => void;
            onPrepare?: () => void;
            onReadLine?: (readed: string[], line: string) => void;
            onComplete?: (readed: string[]) => void;
        };
        /**
         * Creates a connection to read text data.
         * @param address of remote
         */
        constructor(address?: string);
        /**
         * Returns current charset of being read data.
         */
        getCharset(): string;
        /**
         * Sets charset for new connections.
         * If charset is `null`, system encoding will be used.
         * @see {@link https://wikipedia.org/wiki/Character_encoding character encoding} for more details
         */
        setCharset(charset?: string): void;
        /**
         * Returns stream reader, or `null` if create failed.
         */
        getStreamReader(): java.io.InputStreamReader;
        /**
         * Returns `true` if read process is running.
         */
        inProcess(): boolean;
        /**
         * Returns currently read data as an array.
         * Returns `null` if read process hasn't been started.
         */
        getCurrentlyReaded(): string[];
        /**
         * Returns number of readed lines.
         * Returns `-1` if there is no connection.
         */
        getReadedCount(): number;
        /**
         * Returns readed result, or `null` if none.
         */
        toResult(): string;
        /**
         * Reading process, isn't recommended run on main thread.
         * Wait until work is ended, and method will be return result.
         * @throws error will occur if there's no connection
         */
        read(): string;
    }
    /**
     * Connects to perform data transfering to output.
     * @abstract must be overwritten with any prototype
     */
    abstract class Writer extends Connectivity {
        protected callback: {
            onUrlChanged?: (url: java.net.URL) => void;
            onCreateConnection?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            onConnect?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            onDisconnect?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            getLength?: (length: number) => void;
            onPrepare?: (size: number) => void;
            onProgress?: (count: number, size: number) => void;
            onComplete?: (size: number) => void;
        };
        /**
         * Loads a data stream into specified stream.
         * @abstract must be overwritten with any prototype
         * @see {@link getOutputStream} method for details
         * @param address of remote
         */
        constructor(address?: string);
        /**
         * Returns buffer size for reading data.
         * Returns `-1` if value resetted.
         */
        getBufferSize(): number;
        /**
         * Sets read buffer size.
         */
        setBufferSize(size?: number): void;
        /**
         * Returns length of readed data.
         * Returns `-1` if there is no connection.
         */
        getReadedCount(): number;
        /**
         * Returns a buffered stream reader, can be overwritten in prototypes.
         */
        getStreamReader(): java.io.BufferedInputStream;
        /**
         * Returns output stream, must be overwritten by any prototype.
         */
        abstract getOutputStream(): java.io.OutputStream;
        /**
         * Returns `true` if download process is running.
         */
        inProcess(): boolean;
        /**
         * Loads a stream into given output data stream.
         * @throws error will occur if there's no connection
         * @throws error if output stream is invalid
         */
        download(): void;
    }
    /**
     * Perform transfering stream to filesystem.
     */
    class Downloader extends Writer {
        protected callback: {
            onUrlChanged?: (url: java.net.URL) => void;
            onCreateConnection?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            onConnect?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            onDisconnect?: (connection: java.io.InputStream | java.net.URLConnection) => void;
            getLength?: (length: number) => void;
            onPrepare?: (size: number) => void;
            onProgress?: (count: number, size: number) => void;
            onComplete?: (size: number) => void;
            onFileChanged?: (file: java.io.File) => void;
        };
        /**
         * Loads a stream to specified file path.
         * @param address of remote
         * @param path file path
         */
        constructor(address?: string, path?: string);
        /**
         * Returns currently specified file.
         */
        getFile(): java.io.File;
        /**
         * Sets java file to write stream.
         * If argument isn't given, resets it.
         */
        setFile(file?: java.io.File): void;
        /**
         * Returns currently file path.
         * Returns `null` if file isn't specified.
         */
        getPath(): string;
        /**
         * Sets path to file, replaces current output file.
         */
        setPath(path: string): void;
        /**
         * Returns output stream from file.
         * @throws error when input file is not specified
         */
        getOutputStream(): java.io.BufferedOutputStream;
    }
    /**
     * A quick way to create thread, errors are handled.
     * @param action action to handle
     * @param callback fail callback
     * @param connect will be passed into callback scope
     * @throws error if action isn't specified
     */
    function handle(action: Function, callback?: () => void | {
        onFail?: () => void;
    }, connect?: object): void;
    /**
     * A quick way to get content length from connection.
     * @param address url address
     * @param callback action or callback
     * @see {@link Connectivity.getLength} for details
     */
    function lengthUrl(address: string, callback?: (length: number) => void | object | any): boolean;
    /**
     * A quick way to read data from connection.
     * @param address url address
     * @param callback action or callback
     * @see {@link Reader.read} for details
     */
    function readUrl(address: string, callback: (readed: string) => void | object | any): boolean;
    /**
     * A quick way to download file from connection.
     * @param address url address
     * @param path file path
     * @param callback action or callback
     * @see {@link Downloader.download} for details
     */
    function downloadUrl(address: string, path: string, callback: () => void | object | any): boolean;
}
