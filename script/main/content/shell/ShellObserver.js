const ShellObserver = {
	getCLI: function() {
		return SHELL;
	},
	isInteractive: function() {
		return isCLI() && Packages.io.nernar.instant.cli.CLI.interactive();
	},
	read: function(justNext) {
		if (!this.isInteractive()) {
			return null;
		}
		let symbol = SHELL.read(true);
		if (symbol < 0) {
			MCSystem.throwException("TTY closed unexpectly!");
		}
		let symbols = [];
		do {
			symbols.push(symbol);
			symbols.push(java.lang.Character.valueOf(symbol));
		} while (!justNext && (symbol = SHELL.read(false)) >= 0);
		return symbols;
	},
	trim: function() {
		let whitespace = 0;
		while (this.isInteractive() && SHELL.read(false) >= 0) {
			whitespace++;
		}
		return whitespace;
	},
	leave: function() {
		if (this.isInteractive()) {
			SHELL.reset();
		}
	},
	layers: [],
	includes: function(indexOrWho) {
		if (typeof indexOrWho == "number") {
			return indexOrWho >= 0 && indexOrWho < this.layers.length;
		}
		return this.layers.indexOf(indexOrWho) != -1;
 	},
	attach: function(index, who) {
		index = index < 0 ? 0 : index > this.layers.length ? this.layers.length : index;
		let layers = [];
		let i = 0;
		for (; i < index; i++) {
			if (this.layers[i] != who) {
				layers.push(this.layers[i]);
			}
		}
		layers.push(who);
		for (i++; i < this.layers.length; i++) {
			if (this.layers[i] != who) {
				layers.push(this.layers[i]);
			}
		}
		ShellObserver.layers = layers;
	},
	push: function(who) {
		return this.attach(this.layers.length, who);
	},
	unshift: function(who) {
		return this.attach(0, who);
	},
	dismiss: function(indexOrWho) {
		if (typeof indexOrWho != "number") {
			indexOrWho = this.layers.lastIndexOf(indexOrWho);
		}
		if (indexOrWho < 0 || indexOrWho >= this.layers.length) {
			return;
		}
		let who = this.layers[indexOrWho];
		for (let i = 0; i <= indexOrWho; i++) {
			if (this.layers[i] == who) {
				this.layers.splice(i--, 1);
				indexOrWho--;
			}
		}
	},
	pop: function() {
		return this.dismiss(this.layers.length - 1);
	},
	shift: function() {
		return this.dismiss(0);
	},
	free: function() {
		while (this.layers.length > 0) {
			let length = this.layers.length - 1;
			let who = this.layers[length];
			if (who instanceof FocusableWindow) {
				who.dismiss();
			}
			while (length < this.layers.length) {
				this.layers.pop();
			}
		}
	}
};
