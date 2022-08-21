/*
BUILD INFO:
  dir: Files
  target: Files.js
  files: 38
*/



// file: header.js

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

toDigestMd5 = (function(){
	let digest = java.security.MessageDigest.getInstance("md5");
	return function(bytes) {
		digest.update(bytes);
		let byted = digest.digest()
		let sb = new java.lang.StringBuilder();
		for (let i = 0; i < byted.length; i++) {
			sb.append(java.lang.Integer.toHexString(0xFF & byted[i]));
		}
		return sb.toString();
	};
})();

Files = {};




// file: touch/./createFile.js

Files.createFile = function(path, name) {
	if (name == undefined) let file = new java.io.File(path);
	else file = new java.io.File(path, name);
	if (!file.exists()) file.createNewFile();
};




// file: touch/./createNewWithParent.js

Files.createNewWithParent = function(path, name) {
	if (name == undefined) let file = new java.io.File(path);
	else file = new java.io.File(path, name);
	file.getParentFile().mkdirs();
	file.createNewFile();
};




// file: touch/./shrinkPathes.js

Files.shrinkPathes = function(source, element) {
	if (source instanceof java.io.File) {
		source = source.getPath();
	}
	if (element instanceof java.io.File) {
		element = element.getPath();
	}
	return ("" + element).replace("" + source, "");
};




// file: touch/./restorePathCorrection.js

Files.restorePathCorrection = function(prefix, path) {
	if (path && new java.io.File(path).exists()) {
		return path;
	}
	return prefix ? path ? prefix + "/" + path : prefix : path;
};




// file: touch/./mkdirsRecursive.js

Files.mkdirsRecursive = function(path, output, explore) {
	let directories = this.listDirectories(path, explore),
		count = 0;
	for (let i = 0; i < directories.length; i++) {
		let source = this.shrinkPathes(path, directories[i]);
		if (source.length > 0) {
			let file = new java.io.File(output, source);
			if (!file.exists()) file.mkdirs();
			count++;
		}
	}
};




// file: touch/./deleteRecursive.js

Files.deleteRecursive = function(path, explore) {
	let file = new java.io.File(path);
	if (file.isDirectory()) {
		let list = file.listFiles();
		for (let i = 0; i < list.length; i++) {
			if (explore || !list[i].isDirectory()) {
				this.deleteRecursive(list[i].getPath(), explore);
			}
		}
	}
	file.delete();
};




// file: cd/./checkFormats.js

Files.checkFormats = function(list, formats) {
	let formatted = [];
	if (!Array.isArray(formats)) {
		formats = [formats];
	}
	for (let item in formats) {
		for (let name in list) {
			if (list[name].endsWith(formats[item])) {
				formatted.push(list[name]);
			}
		}
	}
	return formatted;
};




// file: cd/./getExtension.js

Files.getExtension = function(file) {
	let name = file.getName(),
		index = name.lastIndexOf(".");
	if (file.isDirectory() || index <= 0) {
		return null;
	}
	return name.substring(index + 1);
};




// file: cd/./getNameExtension.js

Files.getNameExtension = function(name) {
	let index = name.lastIndexOf(".");
	if (index <= 0) return null;
	return name.substring(index + 1);
};




// file: cd/./getNameWithoutExtension.js

Files.getNameWithoutExtension = function(name) {
	let index = name.lastIndexOf(".");
	if (index <= 0) return name;
	return name.substring(0, index);
};




// file: cd/./listFiles.js

Files.listFiles = function(path, explore) {
	let files = [],
		file = new java.io.File(path);
	if (file.isFile()) return [file];
	let list = file.listFiles() || [];
	for (let i = 0; i < list.length; i++) {
		if (list[i].isFile()) {
			files.push(list[i]);
		} else if (explore) {
			files = files.concat(this.listFiles(list[i], explore));
		}
	}
	return files.sort();
};




// file: cd/./listDirectories.js

Files.listDirectories = function(path, explore) {
	let directories = [],
		file = new java.io.File(path);
	if (file.isFile()) return directories;
	let list = file.listFiles() || [];
	for (let i = 0; i < list.length; i++) {
		if (list[i].isDirectory()) {
			directories.push(list[i]);
			if (explore) directories = directories.concat(this.listDirectories(list[i], explore));
		}
	}
	return directories.sort();
};




// file: cd/./listFileNames.js

Files.listFileNames = function(path, explore, root) {
	let files = [],
		file = new java.io.File(path);
	if (root === undefined) root = path;
	if (file.isFile()) return [("" + path).replace(root, "")];
	if (!("" + root).endsWith("/") && ("" + root).length > 0) {
		root += "/";
	}
	let list = file.listFiles() || [];
	for (let i = 0; i < list.length; i++) {
		if (list[i].isFile()) {
			files.push(("" + list[i]).replace(root, ""));
		} else if (explore) {
			files = files.concat(this.listFileNames(list[i], explore, root));
		}
	}
	return files.sort();
};




// file: cd/./listDirectoryNames.js

Files.listDirectoryNames = function(path, explore, root) {
	let directories = [],
		file = new java.io.File(path);
	if (file.isFile()) return directories;
	let list = file.listFiles() || [];
	if (root === undefined) root = path;
	if (!("" + root).endsWith("/") && ("" + root).length > 0) {
		root += "/";
	}
	for (let i = 0; i < list.length; i++) {
		if (list[i].isDirectory()) {
			directories.push(("" + list[i]).replace(root, ""));
			if (explore) directories = directories.concat(this.listDirectoryNames(list[i], explore, root));
		}
	}
	return directories.sort();
};




// file: io/./read.js

Files.read = function(file, massive) {
	if (!file.exists()) return massive ? [] : null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		result = [],
		line;
	while (line = reader.readLine()) {
		result.push("" + line);
	}
	return massive ? result : result.join("\n");
};




// file: io/./readLine.js

Files.readLine = function(file, index) {
	if (!file.exists()) return null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		count = -1,
		line;
	while (count < index && (line = reader.readLine())) {
		count++;
	}
	return count == index ? "" + line : null;
};




// file: io/./readLines.js

Files.readLines = function(file, startInd, endInd) {
	if (!file.exists()) return null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		result = [],
		count = -1,
		line;
	while (count <= endInd && (line = reader.readLine())) {
		if (count >= startInd) {
			result.push("" + line);
		}
		count++;
	}
	return result.length > 0 ? result : null;
};




// file: io/./readBytes.js

Files.readBytes = function(file) {
	if (!file.exists()) return null;
	let stream = new java.io.FileInputStream(file);
	let output = new java.io.ByteArrayOutputStream();
	let arr = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
	while (true) {
		let read = stream.read(arr);
		if (read < 0) return output.toByteArray();
		output.write(arr, 0, read);
	}
};




// file: io/./writeBytes.js

Files.writeBytes = function(file, bytes) {
	file.createNewFile();
	let stream = new java.io.FileOutputStream(file);
	stream.write(bytes);
	stream.close();
};




// file: io/./write.js

Files.write = function(file, text) {
	Files.writeBytes(file, java.lang.String(text).getBytes());
};




// file: io/./addText.js

Files.addText = function(file, text) {
	if (!file.exists()) file.createNewFile();
	Files.write(file, Files.read(file) + text);
};




// file: io/./writeStreamToFile.js

Files.writeStreamToFile = function(stream, file) {
	let bis = new java.io.BufferedInputStream(stream),
		fos = new java.io.FileOutputStream(file),
		bos = new java.io.BufferedOutputStream(fos),
		buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096),
		line;
	while ((line = bis.read(buffer)) >= 0) {
		bos.write(buffer, 0, line);
	}
	bis.close();
	bos.close();
};




// file: cp/./copy.js

Files.copy = function(file, path) {
	let result = new java.io.File(path);
	if (!result.exists()) this.createNewWithParent(result);
	this.writeBytes(result, this.readBytes(file));
};




// file: cp/./copyRecursive.js

Files.copyRecursive = function(path, output, explore, includeDirectories) {
	let files = this.listFiles(path, explore),
		count = 0;
	if (includeDirectories !== false) {
		count += this.mkdirsRecursive(path, output, explore);
	}
	for (let i = 0; i < files.length; i++) {
		let source = this.shrinkPathes(path, files[i]);
			file = new java.io.File(output, source);
		this.copy(files[i], file.getPath());
		count++;
	}
	return count;
};




// file: cp/./append.js

Files.append = function(file, path) {
	let result = new java.io.File(path);
	if (result.exists()) {
		this.addText(result, "\n" + this.read(file));
	} else {
		this.createNewWithParent(result);
		this.writeBytes(result, this.readBytes(file));
	}
};




// file: cp/./appendRecursive.js

Files.appendRecursive = function(path, output, explore, includeDirectories) {
	let files = this.listFiles(path, explore),
		count = 0;
	if (includeDirectories !== false) {
		count += this.mkdirsRecursive(path, output, explore);
	}
	for (let i = 0; i < files.length; i++) {
		let source = this.shrinkPathes(path, files[i]);
		file = new java.io.File(output, source);
		this.append(files[i], file.getPath());
		count++;
	}
	return count;
};




// file: cp/./cut.js

Files.cut = function(file, path) {
	Files.copy(file, path);
	file.delete();
};




// file: md5/./asMD5.js

Files.asMD5 = function(file, simpleCompare) {
	if (!(file instanceof java.io.File)) {
		file = new java.io.File(file);
	}
	if (simpleCompare) {
		let size = java.lang.String(file.length());
		return toDigestMd5(size.getBytes());
	}
	return toDigestMd5(this.readBytes(file));
};




// file: md5/./compare.js

Files.compare = function(left, right, simpleCompare) {
	left = this.asMD5(left, simpleCompare);
	right = this.asMD5(right, simpleCompare);
	return left == right;
};




// file: md5/./compareRecursive.js

Files.compareRecursive = function(input, target, explore, simpleCompare, includeDirectories) {
	let left = this.listFileNames(input, explore),
		right = this.listFileNames(target, explore),
		changes = [];
	if (includeDirectories !== false) {
		let first = this.listDirectoryNames(input, explore),
			second = this.listDirectoryNames(target, explore);
		for (let i = 0; i < second.length; i++) {
			let output = new java.io.File(target, second[i]);
			if (first.indexOf(second[i]) == -1) {
				changes.push(output);
			}
		}
	}
	for (let i = 0; i < right.length; i++) {
		let output = new java.io.File(target, right[i]);
		if (left.indexOf(right[i]) == -1) {
			changes.push(output);
			continue;
		}
		let file = new java.io.File(input, left[i])
		if (!this.compare(output, file, simpleCompare)) {
			changes.push(output);
		}
	}
	return changes;
};




// file: md5/./isCompared.js

Files.isCompared = function(input, target, explore, simpleCompare, includeDirectories) {
	return this.compareRecursive(input, target, explore, simpleCompare, includeDirectories).length == 0;
};




// file: md5/./isIdentical.js

Files.isIdentical = function(left, right, explore, simpleCompare, includeDirectories) {
	return this.isCompared(left, right, explore, simpleCompare, includeDirectories) &&
		this.isCompared(right, left, explore, simpleCompare, includeDirectories);
};




// file: md5/./copyAndCompare.js

Files.copyAndCompare = function(from, to, explore, simpleCompare, includeDirectories) {
	this.copyRecursive(from, to, explore, includeDirectories);
	return this.isCompared(to, from, explore, simpleCompare, includeDirectories);
};




// file: zip/./writeFileToZip.js

Files.writeFileToZip = function(path, absolute, zip) {
	let fis = new java.io.FileInputStream(path),
		bis = new java.io.BufferedInputStream(fis, 4096),
		entry = new java.util.zip.ZipEntry(absolute),
		buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096),
		line;
	zip.putNextEntry(entry);
	while ((line = bis.read(buffer, 0, 4096)) >= 0) {
		zip.write(buffer, 0, line);
	}
	bis.close();
};




// file: zip/./unpackZip.js

Files.unpackZip = function(source, output) {
	let zip = new java.util.zip.ZipFile(source),
		entries = zip.entries();
	while (entries.hasMoreElements()) {
		let element = entries.nextElement(),
			result = new java.io.File(output, element.getName());
		if (element.isDirectory()) {
			result.mkdirs();
		} else {
			result.getParentFile().mkdirs();
			this.writeStreamToFile(zip.getInputStream(element), result);
		}
	}
	zip.close();
};




// file: zip/./packZip.js

Files.packZip = function(shrink, who, output) {
	let fos = new java.io.FileOutputStream(output),
		bos = new java.io.BufferedOutputStream(fos),
		zip = new java.util.zip.ZipOutputStream(bos); 
	for (let i = 0; i < who.length; i++) {
		let path = this.shrinkPathes(shrink, who[i]);
		this.writeFileToZip(who[i], path, zip);
	}
	zip.close();
};




// file: integration.js

EXPORT("Files", Files);




