/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */

const Archives = {};

Archives.getFile = function(zip) {
	return new java.util.zip.ZipFile(zip);
};

Archives.getEntry = function(zip, name) {
	return new java.util.zip.ZipFile(zip).getEntry(name);
};

Archives.contains = function(zip, name) {
	return Archives.getEntry(zip, name) != null;
};

Archives.unpack = function(file, path) {
	let zip = new java.util.zip.ZipFile(file),
		elements = zip.entries();
	new java.io.File(path).mkdirs();
	while (elements.hasMoreElements()) {
		let element = elements.nextElement(),
			source = zip.getInputStream(element),
			result = new java.io.File(path, element.getName()),
			bis = new java.io.BufferedInputStream(source);
		if (!element.isDirectory()) {
			result.getParentFile().mkdir();
			let bos = new java.io.BufferedOutputStream(new java.io.FileOutputStream(result)),
				buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096),
				line = 0;
			while ((line = bis.read(buf)) >= 0) {
				bos.write(buf, 0, line);
			}
			bis.close();
			bos.close();
		} else result.mkdirs();
	}
	zip.close();
};
