var ServerReader = new Function();
ServerReader.prototype = new ServerConnect();
ServerReader.prototype.charset = "UTF-8";
ServerReader.prototype.getCharset = function() {
	return this.charset || null;
};
ServerReader.prototype.setCharset = function(charset) {
	if (charset) this.charset = charset;
	else delete this.charset;
};
ServerReader.prototype.getStreamReader = function() {
	var stream = this.getStream();
	if (!stream) return null;
	var charset = this.getCharset();
	if (!charset) return new java.io.InputStreamReader(stream);
	return new java.io.InputStreamReader(stream, charset);
};
ServerReader.prototype.inProcess = function() {
	return !!this.processing;
};
ServerReader.prototype.getCurrentlyReaded = function() {
	return this.result || null;
};
ServerReader.prototype.getReadedCount = function() {
	var readed = this.getCurrentlyReaded();
	return readed ? readed.length : -1;
};
ServerReader.prototype.getResult = function() {
	var readed = this.getCurrentlyReaded();
	if (!readed) return null;
	return readed.join("\n");
};
ServerReader.prototype.getThread = function() {
	return this.thread || null;
};
ServerReader.prototype.read = function() {
	var stream = this.getStreamReader();
	if (!stream) throw "ServerReader: Can't read stream, because one of params is missing";
	var result = this.result = new Array(),
		reader = new java.io.BufferedReader(stream);
	this.processing = true;
	while (this.inProcess()) {
		var line = reader.readLine();
		if (line == null) break;
		else result.push(line);
	}
	delete this.processing;
	reader.close();
	return this.getResult();
};
ServerReader.prototype.readAsync = function(post) {
	var scope = this;
	this.thread = handleThread(function() {
		scope.read();
		delete scope.thread;
		post && post(scope.getResult());
	});
};
ServerReader.prototype.assureYield = function() {
	try {
		if (!this.getThread()) return false;
		while (this.inProcess()) java.lang.Thread.yield();
		return this.getReadedCount() >= 0;
	} catch(e) {
		return false;
	}
};
