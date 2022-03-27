const minifySource = function(text, callback) {
	handleThread(function() {
		let data = new java.lang.StringBuilder();
		data.append(java.net.URLEncoder.encode("input", "UTF-8"));
		data.append("=");
		data.append(java.net.URLEncoder.encode(text, "UTF-8"));
		let bytes = data.toString().getBytes("UTF-8");
		
		let reader = new Network.Reader("https://www.toptal.com/developers/javascript-minifier/raw");
		reader.setCallback({
			onComplete: function(reader) {
				showHint(translate("Completed"));
			}
		});
		
		let connection = reader.getConnection();
		connection.setRequestMethod("POST");
		connection.setDoOutput(true);
		connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		connection.setRequestProperty("charset", "utf-8");
		connection.setRequestProperty("Content-Length", String(bytes.length));
		
		let sendScript = new java.io.DataOutputStream(connection.getOutputStream());
		sendScript.write(bytes);
		
		let code = connection.getResponseCode();
		if (code == 200) {
			let result = reader.read();
			callback && callback(result);
			return;
		}
		print(code);
	});
};

return function() {
	selectFile(".js", function(input) {
		let text = Files.read(input);
		minifySource(text, function(result) {
			let name = Files.getNameWithoutExtension(input.getName()) + ".min.js",
				file = new java.io.File(input.getParentFile().getPath(), name);
			Files.write(file, result);
		});
	});
};
