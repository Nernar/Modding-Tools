/*

   Copyright 2016-2022 Nernar (github.com/nernar)

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
toDigestMd5 = (function () {
    var digest = java.security.MessageDigest.getInstance("md5");
    return function (bytes) {
        digest.update(bytes);
        var byted = digest.digest();
        var sb = new java.lang.StringBuilder();
        for (var i = 0; i < byted.length; i++) {
            sb.append(java.lang.Integer.toHexString(0xFF & byted[i]));
        }
        return sb.toString();
    };
})();
Files = {};
Files.createFile = function (path, name) {
    var file = name == undefined ? new java.io.File(path) : new java.io.File(path, name);
    if (!file.exists())
        file.createNewFile();
};
Files.createNewWithParent = function (path, name) {
    var file = name == undefined ? new java.io.File(path) : new java.io.File(path, name);
    file.getParentFile().mkdirs();
    file.createNewFile();
};
Files.deleteRecursive = function (path, explore) {
    var file = new java.io.File(path);
    if (file.isDirectory()) {
        var list = file.listFiles();
        for (var i = 0; i < list.length; i++) {
            if (explore || !list[i].isDirectory()) {
                this.deleteRecursive(list[i].getPath(), explore);
            }
        }
    }
    file.delete();
};
Files.mkdirsRecursive = function (path, output, explore) {
    var directories = this.listDirectories(path, explore), count = 0;
    for (var i = 0; i < directories.length; i++) {
        var source = this.shrinkPathes(path, directories[i]);
        if (source.length > 0) {
            var file = new java.io.File(output, source);
            if (!file.exists())
                file.mkdirs();
            count++;
        }
    }
};
Files.restorePathCorrection = function (prefix, path) {
    if (path && new java.io.File(path).exists()) {
        return path;
    }
    return prefix ? path ? prefix + "/" + path : prefix : path;
};
Files.shrinkPathes = function (source, element) {
    if (source instanceof java.io.File) {
        source = source.getPath();
    }
    if (element instanceof java.io.File) {
        element = element.getPath();
    }
    return ("" + element).replace("" + source, "");
};
Files.checkFormats = function (list, formats) {
    var formatted = [];
    if (!Array.isArray(formats)) {
        formats = [formats];
    }
    for (var item in formats) {
        for (var name in list) {
            if (list[name].endsWith(formats[item])) {
                formatted.push(list[name]);
            }
        }
    }
    return formatted;
};
Files.getExtension = function (file) {
    var name = file.getName(), index = name.lastIndexOf(".");
    if (file.isDirectory() || index <= 0) {
        return null;
    }
    return name.substring(index + 1);
};
Files.getNameExtension = function (name) {
    var index = name.lastIndexOf(".");
    if (index <= 0)
        return null;
    return name.substring(index + 1);
};
Files.getNameWithoutExtension = function (name) {
    var index = name.lastIndexOf(".");
    if (index <= 0)
        return name;
    return name.substring(0, index);
};
Files.listDirectories = function (path, explore) {
    var directories = [], file = new java.io.File(path);
    if (file.isFile())
        return directories;
    var list = file.listFiles() || [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].isDirectory()) {
            directories.push(list[i]);
            if (explore)
                directories = directories.concat(this.listDirectories(list[i], explore));
        }
    }
    return directories.sort();
};
Files.listDirectoryNames = function (path, explore, root) {
    var directories = [], file = new java.io.File(path);
    if (file.isFile())
        return directories;
    var list = file.listFiles() || [];
    if (root === undefined)
        root = path;
    if (!("" + root).endsWith("/") && ("" + root).length > 0) {
        root += "/";
    }
    for (var i = 0; i < list.length; i++) {
        if (list[i].isDirectory()) {
            directories.push(("" + list[i]).replace(root, ""));
            if (explore)
                directories = directories.concat(this.listDirectoryNames(list[i], explore, root));
        }
    }
    return directories.sort();
};
Files.listFileNames = function (path, explore, root) {
    var files = [], file = new java.io.File(path);
    if (root === undefined)
        root = path;
    if (file.isFile())
        return [("" + path).replace(root, "")];
    if (!("" + root).endsWith("/") && ("" + root).length > 0) {
        root += "/";
    }
    var list = file.listFiles() || [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].isFile()) {
            files.push(("" + list[i]).replace(root, ""));
        }
        else if (explore) {
            files = files.concat(this.listFileNames(list[i], explore, root));
        }
    }
    return files.sort();
};
Files.listFiles = function (path, explore) {
    var files = [], file = new java.io.File(path);
    if (file.isFile())
        return [file];
    var list = file.listFiles() || [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].isFile()) {
            files.push(list[i]);
        }
        else if (explore) {
            files = files.concat(this.listFiles(list[i], explore));
        }
    }
    return files.sort();
};
Files.addText = function (file, text) {
    if (!file.exists())
        file.createNewFile();
    Files.write(file, Files.read(file) + text);
};
Files.read = function (file, massive) {
    if (!file.exists())
        return massive ? [] : null;
    var reader = java.io.BufferedReader(new java.io.FileReader(file)), result = [], line;
    while (line = reader.readLine()) {
        result.push("" + line);
    }
    return massive ? result : result.join("\n");
};
Files.readBytes = function (file) {
    if (!file.exists())
        return null;
    var stream = new java.io.FileInputStream(file);
    var output = new java.io.ByteArrayOutputStream();
    var arr = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
    while (true) {
        var read = stream.read(arr);
        if (read < 0)
            return output.toByteArray();
        output.write(arr, 0, read);
    }
};
Files.readLine = function (file, index) {
    if (!file.exists())
        return null;
    var reader = java.io.BufferedReader(new java.io.FileReader(file)), count = -1, line;
    while (count < index && (line = reader.readLine())) {
        count++;
    }
    return count == index ? "" + line : null;
};
Files.readLines = function (file, startInd, endInd) {
    if (!file.exists())
        return null;
    var reader = java.io.BufferedReader(new java.io.FileReader(file)), result = [], count = -1, line;
    while (count <= endInd && (line = reader.readLine())) {
        if (count >= startInd) {
            result.push("" + line);
        }
        count++;
    }
    return result.length > 0 ? result : null;
};
Files.write = function (file, text) {
    Files.writeBytes(file, java.lang.String(text).getBytes());
};
Files.writeBytes = function (file, bytes) {
    file.createNewFile();
    var stream = new java.io.FileOutputStream(file);
    stream.write(bytes);
    stream.close();
};
Files.writeStreamToFile = function (stream, file) {
    var bis = new java.io.BufferedInputStream(stream), fos = new java.io.FileOutputStream(file), bos = new java.io.BufferedOutputStream(fos), buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096), line;
    while ((line = bis.read(buffer)) >= 0) {
        bos.write(buffer, 0, line);
    }
    bis.close();
    bos.close();
};
Files.append = function (file, path) {
    var result = new java.io.File(path);
    if (result.exists()) {
        this.addText(result, "\n" + this.read(file));
    }
    else {
        this.createNewWithParent(result);
        this.writeBytes(result, this.readBytes(file));
    }
};
Files.appendRecursive = function (path, output, explore, includeDirectories) {
    var files = this.listFiles(path, explore), count = 0;
    if (includeDirectories !== false) {
        count += this.mkdirsRecursive(path, output, explore);
    }
    for (var i = 0; i < files.length; i++) {
        var source = this.shrinkPathes(path, files[i]);
        file = new java.io.File(output, source);
        this.append(files[i], file.getPath());
        count++;
    }
    return count;
};
Files.copy = function (file, path) {
    var result = new java.io.File(path);
    if (!result.exists())
        this.createNewWithParent(result);
    this.writeBytes(result, this.readBytes(file));
};
Files.copyRecursive = function (path, output, explore, includeDirectories) {
    var files = this.listFiles(path, explore), count = 0;
    if (includeDirectories !== false) {
        count += this.mkdirsRecursive(path, output, explore);
    }
    for (var i = 0; i < files.length; i++) {
        var source = this.shrinkPathes(path, files[i]);
        file = new java.io.File(output, source);
        this.copy(files[i], file.getPath());
        count++;
    }
    return count;
};
Files.cut = function (file, path) {
    Files.copy(file, path);
    file.delete();
};
Files.asMD5 = function (file, simpleCompare) {
    if (!(file instanceof java.io.File)) {
        file = new java.io.File(file);
    }
    if (simpleCompare) {
        var size = java.lang.String(file.length());
        return toDigestMd5(size.getBytes());
    }
    return toDigestMd5(this.readBytes(file));
};
Files.compare = function (left, right, simpleCompare) {
    left = this.asMD5(left, simpleCompare);
    right = this.asMD5(right, simpleCompare);
    return left == right;
};
Files.compareRecursive = function (input, target, explore, simpleCompare, includeDirectories) {
    var left = this.listFileNames(input, explore), right = this.listFileNames(target, explore), changes = [];
    if (includeDirectories !== false) {
        var first = this.listDirectoryNames(input, explore), second = this.listDirectoryNames(target, explore);
        for (var i = 0; i < second.length; i++) {
            var output = new java.io.File(target, second[i]);
            if (first.indexOf(second[i]) == -1) {
                changes.push(output);
            }
        }
    }
    for (var i = 0; i < right.length; i++) {
        var output = new java.io.File(target, right[i]);
        if (left.indexOf(right[i]) == -1) {
            changes.push(output);
            continue;
        }
        var file = new java.io.File(input, left[i]);
        if (!this.compare(output, file, simpleCompare)) {
            changes.push(output);
        }
    }
    return changes;
};
Files.copyAndCompare = function (from, to, explore, simpleCompare, includeDirectories) {
    this.copyRecursive(from, to, explore, includeDirectories);
    return this.isCompared(to, from, explore, simpleCompare, includeDirectories);
};
Files.isCompared = function (input, target, explore, simpleCompare, includeDirectories) {
    return this.compareRecursive(input, target, explore, simpleCompare, includeDirectories).length == 0;
};
Files.isIdentical = function (left, right, explore, simpleCompare, includeDirectories) {
    return this.isCompared(left, right, explore, simpleCompare, includeDirectories) &&
        this.isCompared(right, left, explore, simpleCompare, includeDirectories);
};
Files.packZip = function (shrink, who, output) {
    var fos = new java.io.FileOutputStream(output), bos = new java.io.BufferedOutputStream(fos), zip = new java.util.zip.ZipOutputStream(bos);
    for (var i = 0; i < who.length; i++) {
        var path = this.shrinkPathes(shrink, who[i]);
        this.writeFileToZip(who[i], path, zip);
    }
    zip.close();
};
Files.unpackZip = function (source, output) {
    var zip = new java.util.zip.ZipFile(source), entries = zip.entries();
    while (entries.hasMoreElements()) {
        var element = entries.nextElement(), result = new java.io.File(output, element.getName());
        if (element.isDirectory()) {
            result.mkdirs();
        }
        else {
            result.getParentFile().mkdirs();
            this.writeStreamToFile(zip.getInputStream(element), result);
        }
    }
    zip.close();
};
Files.writeFileToZip = function (path, absolute, zip) {
    var fis = new java.io.FileInputStream(path), bis = new java.io.BufferedInputStream(fis, 4096), entry = new java.util.zip.ZipEntry(absolute), buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096), line;
    zip.putNextEntry(entry);
    while ((line = bis.read(buffer, 0, 4096)) >= 0) {
        zip.write(buffer, 0, line);
    }
    bis.close();
};
EXPORT("Files", Files);
