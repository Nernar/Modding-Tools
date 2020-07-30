var ServerDownloader = new Function();
ServerDownloader.prototype = new ServerConnect();
ServerDownloader.prototype.size = 8192;
ServerDownloader.prototype.getSize = function() {
	return this.size || null;
};
ServerDownloader.prototype.setSize = function(size) {
	if (size) this.size = size;
	else delete this.size;
};
ServerDownloader.prototype.getReadedCount = function() {
	return this.count ? this.count : this.inProcess() ? 0 : -1;
};
ServerDownloader.prototype.getStreamReader = function() {
	var stream = this.getStream();
	if (!stream) return null;
	var size = this.getSize();
	if (!size) return new java.io.BufferedInputStream(stream);
	return new java.io.BufferedInputStream(stream, size);
};
ServerDownloader.prototype.getFile = function() {
	return this.file || null;
};
ServerDownloader.prototype.setFile = function(file) {
	if (file) this.file = file;
	else delete this.file;
};
ServerDownloader.prototype.setPath = function(path) {
	var file = new java.io.File(path);
	if (file) this.setFile(file);
};
ServerDownloader.prototype.getOutputStream = function() {
	var file = this.getFile();
	if (!file) return null;
	var stream = new java.io.FileOutputStream(file);
	if (!stream) return null;
	return new java.io.BufferedOutputStream(stream);
};
ServerDownloader.prototype.inProcess = function() {
	return !!this.processing;
};
ServerDownloader.prototype.getThread = function() {
	return this.thread || null;
};
ServerDownloader.prototype.download = function() {
	var stream = this.getStreamReader(), output = this.getOutputStream();
	if (!stream) throw "Can't download stream, because one of params is missing";
	if (!output) throw "Can't download stream, because file out is missing";
	this.connect(), this.count = 0;
	this.processing = true;
	var data = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
	while (this.inProcess()) {
		var count = input.read(data);
		if (count == -1) break;
		else {
			output.write(data, 0, count);
			this.count += count;
		}
	}
	this.processing = false;
	this.disconnect();
	output.flush();
	output.close();
	stream.close();
};
ServerDownloader.prototype.downloadAsync = function(post) {
	var scope = this;
	this.thread = handleThread(function() {
		scope.read();
		delete scope.thread;
		post && post();
	});
};
ServerDownloader.prototype.assureYield = function() {
	try {
		if (!this.getThread()) return false;
		while (this.inProcess()) java.lang.Thread.yield();
		return this.getReadedCount() >= 0;
	} catch(e) {
		return false;
	}
};
