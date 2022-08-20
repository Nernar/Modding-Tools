if (typeof String.prototype.repeat != "function") {
	String.prototype.repeat = function(count) {
		if (count < 0) {
			MCSystem.throwException("Value must be equals or more then zero");
		}
		if (count == 0) return "";
		var result = "", pattern = this.valueOf();
		while (count > 1) {
			if (count & 1) result += pattern;
			count >>= 1, pattern += pattern;
		}
		return result + pattern;
	};
}
