/*

   Copyright 2016-2023 Nernar (github.com/nernar)

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
    name: "Files",
    version: 1,
    api: "Preloader",
    shared: true
});
constructSafe = function (method) {
    var strategies = [];
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] != null) {
            strategies[i - 1] = STRATEGIES[arguments[i]];
        }
    }
    return function () {
        var malformed = Array.prototype.slice.apply(arguments);
        for (var strategy = void 0, i = 0, l = Math.min(strategies.length, malformed.length); i < l; i++) {
            if ((strategy = strategies[i]) === undefined) {
                continue;
            }
            var displace = void 0;
            try {
                if (Array.isArray(strategy)) {
                    for (var outline = void 0, k = 0; k < strategy.length; i++) {
                        outline = strategy.call(STRATEGIES, malformed[i], displace);
                        displace = outline !== undefined ? outline : displace;
                    }
                }
                else {
                    displace = strategy.call(STRATEGIES, malformed[i]);
                }
            }
            catch (e) {
                log("Files: " + method + " condition " + strategy + " is not meet requirements of '" + malformed[i] + "'");
                return e;
            }
            if (displace !== undefined) {
                malformed[i] = displace;
            }
        }
        return this[method].apply(this, malformed);
    };
};
STRATEGIES = {
    is: function (pathOrFile) {
        if (!Files.of(pathOrFile).exists()) {
            throw null;
        }
    },
    isFile: function (pathOrFile) {
        if (!((pathOrFile = Files.of(pathOrFile)).exists() && pathOrFile.isFile())) {
            throw null;
        }
    },
    isFileOrNew: function (pathOrFile) {
        if ((pathOrFile = Files.of(pathOrFile)).exists()) {
            if (!pathOrFile.isFile()) {
                throw null;
            }
        }
        else {
            this.isFileDirectoryOrNew(pathOrFile);
            Files.ensureFile(pathOrFile);
        }
    },
    isDirectory: function (pathOrFile) {
        if (!((pathOrFile = Files.of(pathOrFile)).exists() && pathOrFile.isDirectory())) {
            throw null;
        }
    },
    isDirectoryOrNew: function (pathOrFile) {
        if ((pathOrFile = Files.of(pathOrFile)).exists()) {
            if (!pathOrFile.isDirectory()) {
                throw null;
            }
        }
        else {
            Files.ensureDirectory(pathOrFile);
        }
    },
    isFileDirectory: function (pathOrFile) {
        if ((pathOrFile = Files.of(pathOrFile).getParentFile()) != null && !(pathOrFile.exists() && pathOrFile.isDirectory())) {
            throw null;
        }
    },
    isFileDirectoryOrNew: function (pathOrFile) {
        if ((pathOrFile = Files.of(pathOrFile).getParentFile()) != null) {
            this.isDirectoryOrNew(pathOrFile);
        }
    },
    isHashingAlgorithm: function (algorithm) {
        if (algorithm != null && !(algorithm instanceof java.security.MessageDigest || (algorithm = ("" + algorithm).toLowerCase()) == "md5" || algorithm == "sha-1" || algorithm == "sha-256")) {
            throw null;
        }
    }
};
toBytes = function (object) {
    if (object === null || object === undefined) {
        return java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 0);
    }
    if (object instanceof java.lang.Object) {
        if (("" + object).substring(0, 2) == "[B") {
            return object;
        }
        return object.toString().getBytes();
    }
    try {
        object = java.lang.String.valueOf(object);
    }
    catch (e) {
        object = new java.lang.String("" + object);
    }
    return object.getBytes();
};
var Files = {
    of: /** @type {(...paths: any) => java.io.File} */ (function (paths) {
        if (arguments.length > 1) {
            paths = this.join.apply(this, arguments);
        }
        else if (paths instanceof java.io.File) {
            return paths;
        }
        else if (Array.isArray(paths)) {
            paths = this.join.apply(this, paths);
        }
        return new java.io.File("" + paths);
    }),
    is: /** @type {(pathOrFile: any) => boolean} */ (undefined),
    isFile: /** @type {(pathOrFile: any) => boolean} */ (undefined),
    isFileOrNew: /** @type {(pathOrFile: any) => boolean} */ (undefined),
    isDirectory: /** @type {(pathOrFile: any) => boolean} */ (undefined),
    isDirectoryOrNew: /** @type {(pathOrFile: any) => boolean} */ (undefined),
    isFileDirectory: /** @type {(pathOrFile: any) => boolean} */ (undefined),
    isFileDirectoryOrNew: /** @type {(pathOrFile: any) => boolean} */ (undefined),
    isHashingAlgorithm: /** @type {(algorithm: any) => boolean} */ (undefined),
    basename: /** @type {(pathOrFile: any, extension?: Nullable<string | boolean>) => string} */ (function (pathOrFile, extension) {
        pathOrFile = this.of(pathOrFile);
        if (extension === true) {
            extension = this.extension(pathOrFile);
        }
        pathOrFile = "" + pathOrFile.getName();
        if (extension != null && extension.length > 0) {
            extension = extension.charAt(0) == "." ? extension : "." + extension;
            pathOrFile = pathOrFile.substring(0, pathOrFile.length - extension.length);
        }
        return pathOrFile;
    }),
    dirname: /** @type {(pathOrFile: any) => Nullable<string>} */ (function (pathOrFile) {
        if ((pathOrFile = this.of(pathOrFile).getParentFile()) == null) {
            return null;
        }
        return "" + pathOrFile.getPath();
    }),
    extension: /** @type {(pathOrFile: any, extension?: Nullable<string>) => Nullable<string>} */ (function (pathOrFile, extension) {
        if (this.isDirectory(pathOrFile = this.of(pathOrFile))) {
            return extension !== undefined ? "" + pathOrFile.getPath() : null;
        }
        pathOrFile = extension !== undefined ? "" + pathOrFile.getPath() : "" + pathOrFile.getName();
        var index = pathOrFile.lastIndexOf(".");
        if (extension !== undefined) {
            if (extension != null && extension.charAt(0) != ".") {
                extension = "." + extension;
            }
            if (index > 0) {
                pathOrFile = pathOrFile.substring(0, index);
            }
            return extension != null ? pathOrFile + extension : pathOrFile;
        }
        return index > 0 ? pathOrFile.substring(index + 1) : null;
    }),
    join: /** @type {(...paths: any) => Nullable<string>} */ (function () {
        var path = null;
        for (var subpath = void 0, i = 0; i < arguments.length; i++) {
            if ((subpath = arguments[i]) == null) {
                continue;
            }
            if (subpath instanceof java.io.File) {
                path = path != null ? path + subpath.getPath() : "" + subpath.getAbsolutePath();
            }
            else {
                if (Array.isArray(subpath)) {
                    subpath = this.join.apply(this, subpath);
                }
                if (subpath == null || subpath.length == 0) {
                    continue;
                }
                path = path != null ? path + "/" + subpath : "" + subpath;
            }
        }
        return path != null ? path.replace(/\/+/g, "/") : null;
    }),
    resolve: /** @type {(pathOrFile: any, ...where: any) => Nullable<string>} */ (function (pathOrFile) {
        if (pathOrFile != null && this.is(pathOrFile)) {
            return "" + pathOrFile;
        }
        for (var subpath = void 0, i = 1; i < arguments.length; i++) {
            if ((subpath = this.join(arguments[i], pathOrFile)) != null && this.is(subpath)) {
                return subpath;
            }
        }
        return null;
    }),
    relative: /** @type {(pathOrFile: any, directoryPathOrFile: any) => Nullable<string>} */ (function (pathOrFile, directoryPathOrFile) {
        var path = "" + (pathOrFile = this.of(pathOrFile)).getAbsolutePath();
        var directory = "" + (directoryPathOrFile = this.of(directoryPathOrFile)).getAbsolutePath();
        if (path.startsWith(directory)) {
            return path.substring(directory.length).replace(/^\/+/, "");
        }
        var offset = 0;
        while ((directoryPathOrFile = directoryPathOrFile.getParentFile()) != null) {
            offset++;
            if (path.startsWith(directory = "" + directoryPathOrFile.getAbsolutePath())) {
                path = path.substring(directory.length);
                for (var i = 0; i < offset; i++) {
                    path = "../" + path;
                }
                return path.replace(/^\/+/, "");
            }
        }
        return null;
    }),
    ensureFile: /** @type {(pathOrFile: any) => void} */ (function (pathOrFile) {
        if ((pathOrFile = this.of(pathOrFile)).exists() && pathOrFile.isDirectory()) {
            this.removeUnsafe(pathOrFile);
        }
        this.ensureFileDirectory(pathOrFile);
        if (!pathOrFile.exists()) {
            pathOrFile.createNewFile();
        }
    }),
    ensureDirectory: /** @type {(pathOrFile: any) => void} */ (function (pathOrFile) {
        if ((pathOrFile = this.of(pathOrFile)).exists() && !pathOrFile.isDirectory()) {
            this.removeUnsafe(pathOrFile);
        }
        if (!pathOrFile.exists()) {
            pathOrFile.mkdirs();
        }
    }),
    ensureFileDirectory: /** @type {(pathOrFile: any) => void} */ (function (pathOrFile) {
        if (!(pathOrFile = this.of(pathOrFile)).exists() && (pathOrFile = pathOrFile.getParentFile()) != null) {
            this.ensureDirectory(pathOrFile);
        }
    }),
    walkUnsafe: /** @type {(pathOrFile: any, callback: (file: java.io.File, relative: Nullable<string>) => void, filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string, reverseDirectories?: boolean) => void} */ (function (pathOrFile, callback, filter, maxDepth, relativePath, reverseDirectories) {
        function walk(pathOrFile, maxDepth, relativePath) {
            if (pathOrFile.isDirectory()) {
                if (reverseDirectories !== true && (filter == null || filter === "directory" || (typeof filter != "string" && filter.call(Files, pathOrFile, relativePath || null)))) {
                    callback.call(Files, pathOrFile, relativePath || null);
                }
                if (maxDepth === undefined || maxDepth > 0) {
                    var files = pathOrFile.listFiles();
                    for (var i = 0; i < files.length; i++) {
                        walk(files[i], maxDepth !== undefined ? maxDepth - 1 : undefined, Files.join(relativePath, files[i].getName()));
                    }
                }
                if (reverseDirectories === true && (filter == null || filter === "directory" || (typeof filter != "string" && filter.call(Files, pathOrFile, relativePath || null)))) {
                    callback.call(Files, pathOrFile, relativePath || null);
                }
            }
            else if (filter == null || filter === "file" || (typeof filter != "string" && filter.call(Files, pathOrFile, relativePath || null))) {
                callback.call(Files, pathOrFile, relativePath || null);
            }
        }
        if ((pathOrFile = this.of(pathOrFile)).isDirectory()) {
            var files = pathOrFile.listFiles();
            for (var i = 0; i < files.length; i++) {
                walk(files[i], maxDepth, this.join(relativePath, files[i].getName()));
            }
        }
        else {
            walk(pathOrFile, maxDepth, relativePath);
        }
    }),
    walk: /** @type {(pathOrFile: any, callback: (file: java.io.File, relative: Nullable<string>) => void, filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string, reverseDirectories?: boolean) => Nullable<void>} */ (constructSafe("walkUnsafe", "is")),
    listUnsafe: /** @type {(pathOrFile: any, mode?: "relative" | "name" | "nameWithoutExtension" | "relativeWithoutExtension" | "file", filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string, reverseDirectories?: boolean) => (string | java.io.File)[]} */ (function (pathOrFile, mode, filter, maxDepth, relativePath, reverseDirectories) {
        var files = [];
        this.walkUnsafe(pathOrFile, function (file, relativePath) {
            files.push(mode === "relative" ? relativePath : mode === "name" || mode === "nameWithoutExtension" ? this.basename(file, mode === "nameWithoutExtension") : mode === "relativeWithoutExtension" ? this.join(this.dirname(relativePath), this.basename(file, true)) : file);
        }, filter, maxDepth, relativePath, reverseDirectories);
        return files;
    }),
    list: /** @type {(pathOrFile: any, mode?: "relative" | "name" | "nameWithoutExtension" | "relativeWithoutExtension" | "file", filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string, reverseDirectories?: boolean) => Nullable<(string | java.io.File)[]>} */ (constructSafe("listUnsafe", "is")),
    listFilesUnsafe: /** @type {(pathOrFile: any, mode?: "relative" | "name" | "nameWithoutExtension" | "relativeWithoutExtension" | "file", extensions?: string | string[], filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => (string | java.io.File)[]} */ (function (pathOrFile, mode, extensions, filter, maxDepth, relativePath) {
        if (extensions != null && !Array.isArray(extensions)) {
            extensions = ["" + extensions];
        }
        return this.listUnsafe(pathOrFile, mode, ((filter == null || typeof filter == "string") && extensions == null) ? "file" : function (file) {
            return file.isFile() && (extensions == null || extensions.indexOf(this.extension(file)) != -1) && (filter == null || typeof filter == "string" || filter.apply(this, arguments));
        }, maxDepth, relativePath);
    }),
    listFiles: /** @type {(pathOrFile: any, mode?: "relative" | "name" | "nameWithoutExtension" | "relativeWithoutExtension" | "file", extensions?: string | string[], filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => Nullable<(string | java.io.File)[]>} */ (constructSafe("listFilesUnsafe", "is")),
    listDirectoriesUnsafe: /** @type {(pathOrFile: any, mode?: "relative" | "name" | "file", filter?: "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string, reverseDirectories?: boolean) => (string | java.io.File)[]} */ (function (pathOrFile, mode, filter, maxDepth, relativePath, reverseDirectories) {
        return this.listUnsafe(pathOrFile, mode, filter == null || typeof filter == "string" ? "directory" : function (file) {
            return file.isDirectory() && filter.apply(this, arguments);
        }, maxDepth, relativePath, reverseDirectories);
    }),
    listDirectories: /** @type {(pathOrFile: any, mode?: "relative" | "name" | "file", filter?: "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string, reverseDirectories?: boolean) => Nullable<(string | java.io.File)[]>} */ (constructSafe("listDirectoriesUnsafe", "isDirectory")),
    readUnsafe: /** @type {(pathOrFile: any) => Nullable<string>} */ (function (pathOrFile) {
        var reader = new java.io.FileReader(this.of(pathOrFile));
        reader = new java.io.BufferedReader(reader);
        var result = reader.readLine();
        var line;
        while ((line = reader.readLine()) != null) {
            result += "\n" + line;
        }
        return result != null ? "" + result : null;
    }),
    read: /** @type {(pathOrFile: any) => Nullable<string>} */ (constructSafe("readUnsafe", "isFile")),
    readLineUnsafe: /** @type {(pathOrFile: any, line: number) => Nullable<string>} */ (function (pathOrFile, line) {
        var reader = new java.io.FileReader(this.of(pathOrFile));
        reader = new java.io.BufferedReader(reader);
        if (line > 1) {
            var offset = 1;
            while (offset != line && reader.readLine() != null) {
                offset++;
            }
        }
        line = reader.readLine();
        try {
            reader.close();
        }
        catch (e) { }
        return line != null ? "" + line : null;
    }),
    readLine: /** @type {(pathOrFile: any, line: number) => Nullable<string>} */ (constructSafe("readLineUnsafe", "isFile")),
    readAsLinesUnsafe: /** @type {(pathOrFile: any, fromLine?: number, toLine?: Number, limitLength?: number) => string[]} */ (function (pathOrFile, fromLine, toLine, limitLength) {
        var reader = new java.io.FileReader(this.of(pathOrFile));
        reader = new java.io.BufferedReader(reader);
        var offset = 1;
        if (fromLine !== undefined && fromLine > 1) {
            while (offset < fromLine && reader.readLine() != null) {
                offset++;
            }
        }
        var result = [];
        if (fromLine === undefined || offset == fromLine) {
            var line = void 0;
            while ((line = reader.readLine()) != null) {
                result.push("" + line);
                if (toLine !== undefined && ++offset == toLine) {
                    break;
                }
                else if (limitLength == result.length) {
                    result.pop();
                }
            }
        }
        try {
            reader.close();
        }
        catch (e) { }
        return result;
    }),
    readAsLines: /** @type {(pathOrFile: any, fromLine?: number, toLine?: Number, limitLength?: number) => Nullable<string[]>} */ (constructSafe("readAsLinesUnsafe", "isFile")),
    readAsBytesUnsafe: /** @type {(pathOrFile: any) => native.Array<number>} */ (function (pathOrFile) {
        var stream = new java.io.FileInputStream(this.of(pathOrFile));
        var output = new java.io.ByteArrayOutputStream();
        var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
        var offset;
        while (true) {
            if ((offset = stream.read(bytes)) < 0) {
                break;
            }
            output.write(bytes, 0, offset);
        }
        return output.toByteArray();
    }),
    readAsBytes: /** @type {(pathOrFile: any) => Nullable<native.Array<number>>} */ (constructSafe("readAsBytesUnsafe", "isFile")),
    writeUnsafe: /** @type {(pathOrFile: any, textOrBytes: any) => void} */ (function (pathOrFile, textOrBytes) {
        (pathOrFile = this.of(pathOrFile)).createNewFile();
        var stream = new java.io.FileOutputStream(pathOrFile);
        stream.write(toBytes(textOrBytes));
        try {
            stream.close();
        }
        catch (e) { }
    }),
    write: /** @type {(pathOrFile: any, textOrBytes: any) => Nullable<void>} */ (constructSafe("writeUnsafe", "isFileOrNew")),
    writeLinesUnsafe: /** @type {(pathOrFile: any, lines: any[]) => void} */ (function (pathOrFile, lines) {
        (pathOrFile = this.of(pathOrFile)).createNewFile();
        var writer = new java.io.FileWriter(pathOrFile);
        writer = new java.io.BufferedWriter(writer);
        writer = new java.io.PrintWriter(writer);
        lines = Array.isArray(lines) ? lines : arguments;
        for (var i = (lines == arguments) - 0, l = lines.length; i < l; i++) {
            writer.println("" + lines[i]);
        }
        try {
            writer.close();
        }
        catch (e) { }
    }),
    writeLines: /** @type {(pathOrFile: any, lines: any[]) => Nullable<void>} */ (constructSafe("writeLinesUnsafe", "isFileOrNew")),
    writeFromStreamUnsafe: /** @type {(stream: java.io.InputStream, pathOrFile: any) => void} */ (function (stream, pathOrFile) {
        var input = new java.io.BufferedInputStream(stream);
        (pathOrFile = this.of(pathOrFile)).createNewFile();
        var output = new java.io.FileOutputStream(pathOrFile);
        output = new java.io.BufferedOutputStream(output);
        var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
        var offset;
        while ((offset = input.read(bytes)) >= 0) {
            output.write(bytes, 0, offset);
        }
        try {
            input.close();
        }
        catch (e) { }
        try {
            output.close();
        }
        catch (e) { }
    }),
    writeFromStream: /** @type {(stream: java.io.InputStream, pathOrFile: any) => Nullable<void>} */ (constructSafe("writeFromStreamUnsafe", null, "isFileOrNew")),
    appendUnsafe: /** @type {(pathOrFile: any, textOrBytes: any, newLine?: boolean | number) => void} */ (function (pathOrFile, textOrBytes, newLine) {
        var writer = new java.io.FileOutputStream(this.of(pathOrFile), true);
        while (newLine > 0) {
            writer.write(10);
            newLine--;
        }
        writer.write(toBytes(textOrBytes));
        try {
            writer.close();
        }
        catch (e) { }
    }),
    append: /** @type {(pathOrFile: any, textOrBytes: any, newLine?: boolean | number) => Nullable<void>} */ (constructSafe("appendUnsafe", "isFileOrNew")),
    writeStreamToStream: /** @type {(inputStream: java.io.InputStream, outputStream: java.io.OutputStream) => void} */ (function (inputStream, outputStream) {
        inputStream = new java.nio.channels.Channels.newChannel(inputStream);
        outputStream = new java.nio.channels.Channels.newChannel(outputStream);
        var bytes = java.nio.ByteBuffer.allocateDirect(16384);
        while (inputStream.read(bytes) != -1) {
            bytes.flip();
            outputStream.write(bytes);
            bytes.compact();
        }
        bytes.flip();
        while (bytes.hasRemaining()) {
            outputStream.write(bytes);
        }
    }),
    removeUnsafe: /** @type {(pathOrFile: any, filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => void} */ (function (pathOrFile, filter, maxDepth, relativePath) {
        if (filter !== "directory") {
            this.walkUnsafe(pathOrFile, function (file) {
                file.delete();
            }, filter == null || typeof filter == "string" ? "file" : function (file) {
                return file.isFile() && filter.apply(this, arguments);
            }, maxDepth, relativePath);
        }
        if (filter !== "file") {
            this.walkUnsafe(pathOrFile, function (file) {
                file.delete();
            }, filter == null || typeof filter == "string" ? "directory" : function (file) {
                return file.isDirectory() && filter.apply(this, arguments);
            }, maxDepth, relativePath, true);
        }
    }),
    remove: /** @type {(pathOrFile: any, filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => Nullable<void>} */ (constructSafe("removeUnsafe", "is")),
    copyUnsafe: /** @type {(fromPathOrFile: any, toPathOrFile: any, filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string, appendInstead?: boolean) => void} */ (function (fromPathOrFile, toPathOrFile, filter, maxDepth, relativePath, appendInstead) {
        this.walkUnsafe(fromPathOrFile, function (input, relativePath) {
            var output = this.of(toPathOrFile, relativePath);
            if (input.isDirectory()) {
                this.ensureDirectory(output);
            }
            else {
                this.ensureFile(output);
                if (appendInstead !== true) {
                    output.createNewFile();
                }
                var inputStream = new java.io.FileInputStream(input);
                var outputStream = new java.io.FileOutputStream(output);
                this.writeStreamToStream(inputStream, outputStream);
                try {
                    inputStream.close();
                }
                catch (e) { }
                try {
                    outputStream.close();
                }
                catch (e) { }
            }
        }, filter == null ? "file" : filter, maxDepth, relativePath);
    }),
    copy: /** @type {(fromPathOrFile: any, toPathOrFile: any, filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string, appendInstead?: boolean) => Nullable<void>} */ (constructSafe("copyUnsafe", "is", "isFileDirectoryOrNew")),
    digestUnsafe: /** @type {() => ((pathOrFile: any, algorithm?: "md5" | "sha-1" | "sha-256" | java.security.MessageDigest, filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => string)} */ (function () {
        var digests = {};
        function toDigest(object) {
            if (object instanceof java.security.MessageDigest) {
                return object;
            }
            object = (object ? "" + object : "md5").toLowerCase();
            return digests[object] || (digests[object] = java.security.MessageDigest.getInstance(object));
        }
        return function (pathOrFile, algorithm, filter, maxDepth, relativePath) {
            algorithm = toDigest(algorithm);
            try {
                algorithm.reset();
            }
            catch (e) { }
            this.walkUnsafe(pathOrFile, function (file) {
                var stream = new java.io.FileInputStream(file);
                var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
                var offset;
                while (true) {
                    if ((offset = stream.read(bytes)) < 0) {
                        break;
                    }
                    algorithm.update(bytes, 0, offset);
                }
            }, filter == null || typeof filter == "string" ? "file" : function (file) {
                return file.isFile() && filter.apply(this, arguments);
            }, maxDepth, relativePath);
            algorithm = algorithm.digest();
            var stroke = "";
            for (var i = 0; i < algorithm.length; i++) {
                stroke += java.lang.Integer.toHexString(0xFF & algorithm[i]);
            }
            return stroke;
        };
    })(),
    digest: /** @type {(pathOrFile: any, algorithm?: "md5" | "sha-1" | "sha-256" | java.security.MessageDigest, filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => Nullable<string>} */ (constructSafe("digestUnsafe", "is", "isHashingAlgorithm")),
    compareUnsafe: /** @type {(leftPathOrFile: any, rightPathOrFile: any, algorithm?: "md5" | "sha-1" | "sha-256" | java.security.MessageDigest, filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => boolean} */ (function (leftPathOrFile, rightPathOrFile, algorithm, filter, maxDepth, relativePath) {
        return this.digestUnsafe(leftPathOrFile, algorithm, filter, maxDepth, relativePath) == this.digestUnsafe(rightPathOrFile, algorithm, filter, maxDepth, relativePath);
    }),
    compare: /** @type {(leftPathOrFile: any, rightPathOrFile: any, algorithm?: "md5" | "sha-1" | "sha-256" | java.security.MessageDigest, filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => Nullable<boolean>} */ (constructSafe("compareUnsafe", "is", "is", "isHashingAlgorithm")),
    putEntryToZipUnsafe: /** @type {(zipOutputStream: java.util.zip.ZipOutputStream, pathOrFile: any, filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => void} */ (function (zipOutputStream, pathOrFile, filter, maxDepth, relativePath) {
        this.walkUnsafe(pathOrFile, function (file, relativePath) {
            var stream = new java.io.FileInputStream(file);
            stream = new java.io.BufferedInputStream(stream, 4096);
            file = new java.util.zip.ZipEntry(relativePath || file.getName());
            zipOutputStream.putNextEntry(file);
            var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
            var offset;
            while ((offset = stream.read(bytes, 0, 4096)) >= 0) {
                zipOutputStream.write(bytes, 0, offset);
            }
        }, filter == null || typeof filter == "string" ? "file" : function (file) {
            return file.isFile() && filter.apply(this, arguments);
        }, maxDepth, relativePath);
    }),
    putEntryToZip: /** @type {(zipOutputStream: java.util.zip.ZipOutputStream, pathOrFile: any, filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => Nullable<void>} */ (constructSafe("putEntryToZipUnsafe", null, "is")),
    packAsZipUnsafe: /** @type {(zipPathOrFile: any, pathOrFile: any, filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => void} */ (function (zipPathOrFile, pathOrFile, filter, maxDepth, relativePath) {
        var output = new java.io.FileOutputStream(this.of(zipPathOrFile));
        output = new java.io.BufferedOutputStream(output);
        output = new java.util.zip.ZipOutputStream(output);
        this.putEntryToZipUnsafe(output, pathOrFile, filter, maxDepth, relativePath);
        try {
            output.close();
        }
        catch (e) { }
    }),
    packAsZip: /** @type {(zipPathOrFile: any, pathOrFile: any, filter?: "file" | (file: java.io.File, relative: Nullable<string>) => boolean, maxDepth?: number | boolean, relativePath?: string) => Nullable<void>} */ (constructSafe("packAsZipUnsafe", "isFileOrNew", "is")),
    unpackZipUnsafe: /** @type {(zipPathOrFile: any, toPathOrFile: any, filter?: "file" | "directory" | (entry: java.util.zip.ZipEntry, relative: string) => boolean, appendInstead?: boolean) => void} */ (function (zipPathOrFile, toPathOrFile, filter, appendInstead) {
        zipPathOrFile = new java.util.zip.ZipFile(zipPathOrFile);
        var entries = zipPathOrFile.entries();
        while (entries.hasMoreElements()) {
            var element = entries.nextElement();
            var output = this.of(toPathOrFile, element.getName());
            if (!(filter == null || typeof filter == "string" || filter.call(this, element, output))) {
                continue;
            }
            if (element.isDirectory() && filter !== "file") {
                this.ensureDirectory(output);
            }
            else if (filter !== "directory") {
                this.ensureFile(output);
                if (appendInstead !== true) {
                    output.createNewFile();
                }
                this.writeFromStreamUnsafe(zipPathOrFile.getInputStream(element), output);
            }
        }
        try {
            zipPathOrFile.close();
        }
        catch (e) { }
    }),
    unpackZip: /** @type {(zipPathOrFile: any, toPathOrFile: any, filter?: "file" | "directory" | (file: java.io.File, relative: Nullable<string>) => boolean, appendInstead?: boolean) => Nullable<void>} */ (constructSafe("unpackZipUnsafe", "isFile", "isFileDirectoryOrNew"))
};
(function () {
    for (var method in STRATEGIES) {
        Files[method] = (function (method) {
            return function () {
                try {
                    var value = STRATEGIES[method].apply(STRATEGIES, arguments);
                    return value !== undefined ? value : true;
                }
                catch (e) { }
                return false;
            };
        })(method);
    }
})();
EXPORT("Files", Files);
