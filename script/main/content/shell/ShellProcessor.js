const ShellProcessor = {
	getWidth: function(who) {
		let width = 0;
		for (let i = 0; i < who.length; i++) {
			width = Math.max(width, who[i].length);
		}
		return width;
	},
	normalize: function(who, space) {
		let width = this.getWidth(who);
		space = space ? "" + space : " ";
		return who.map(function(value) {
			return value.length < width ? value + space.repeat(width - value.length) : value;
		});
	},
	append: function(who, what, space) {
		space = space ? "" + space : " ";
		if (what.length > who.length) {
			let width = this.getWidth(who);
			space = space.repeat(width);
			let i = 0;
			for (; i < who.length; i++) {
				who[i] += what[i];
			}
			for (; i < what.length; i++) {
				who.push(space + what[i]);
			}
		} else {
			for (let i = 0; i < what.length; i++) {
				who[i] += what[i];
			}
		}
		return who;
	}
};
