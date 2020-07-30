var ServerConnect = function(address) {
	this.callback = new Object();
	address && this.setAddress(address);
};
ServerConnect.prototype.getUrl = function() {
	return this.url || null;
};
ServerConnect.prototype.setUrl = function(url) {
	if (url instanceof String) {
		Logger.Log("You should use ServerConnect.setAddress(address) instead of ServerConnect.setUrl(url) for string values", "Dev-Core");
		this.setAddress(url);
		return;
	}
	this.url = url;
};
ServerConnect.prototype.setAddress = function(address) {
	this.url = new java.net.URL(address);
};
ServerConnect.prototype.callback = new Object();
ServerConnect.prototype.setCallback = function(callback) {
	this.callback = callback || new Object();
};
ServerConnect.prototype.getStream = function() {
	return this.url ? this.url.openStream() : null;
};
ServerConnect.prototype.getConnection = function(force) {
	if (!force) this.validateConnection();
	return this.connection || null;
};
ServerConnect.prototype.hasConnection = function() {
	return !!this.connection;
};
ServerConnect.prototype.validateConnection = function() {
	if (!this.connection)
		this.connection = this.url ? this.url.openConnection() : null;
	return this.connection;
};
ServerConnect.prototype.connect = function() {
	var connection = this.getConnection();
	if (connection) connection.connect();
	else throw "Can't find any opened connection to connect";
};
ServerConnect.prototype.disconnect = function() {
	var connection = this.getConnection();
	if (!connection) return;
	connection.disconnect();
	delete this.connection;
};
ServerConnect.prototype.getSize = function() {
	var connected = this.hasConnection();
	if (!connected) this.connect();
	var connection = this.getConnection(),
		length = connection ? connection.getContentLength() : -1;
	connected && this.disconnect();
	return length;
};
ServerConnect.prototype.getFormattedSize = function() {
	return Files.prepareFormattedSize(this.getSize());
};
