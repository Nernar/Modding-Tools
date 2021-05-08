const AdditionalMessage = function(title, message, src) {
	this.getTitle = function() {
		return this.title;
	};
	this.getLocalizedTitle = function() {
		return translate(this.getTitle());
	};
	
	this.setTitle = function(title) {
		if (!title instanceof String) {
			title = "" + title;
		}
		if (title.length > AdditionalMessage.MAX_TITLE_SYMBOLS) {
			title = title.substring(AdditionalMessage.MAX_TITLE_SYMBOLS);
		}
		this.title = title;
	};
	
	title && this.setTitle(title);
	
	this.getMessage = function() {
		return this.message;
	};
	this.getLocalizedMessage = function() {
		return translate(this.getMessage());
	};
	
	this.setMessage = function(message) {
		if (!message instanceof String) {
			message = "" + message;
		}
		if (message.length > AdditionalMessage.MAX_MESSAGE_SYMBOLS) {
			message = message.substring(AdditionalMessage.MAX_MESSAGE_SYMBOLS);
		}
		this.message = message;
	};
	
	message && this.setMessage(message);
	
	this.src = AdditionalMessage.DEFAULT_SRC;
	
	this.getIcon = function() {
		return this.src || null;
	};
	this.getBitmap = function() {
		return ImageFactory.getBitmap(this.getIcon());
	};
	this.getDrawable = function() {
		return ImageFactory.getDrawable(this.getIcon());
	};
	
	this.setIcon = function(src, force) {
		if (force || ImageFactory.isLoaded(src)) {
			this.src = src;
		}
	};
	
	src && this.setIcon(src);
	
	this.getChance = function() {
		return this.hasOwnProperty("chance") ? this.chance : 1;
	};
	
	this.setChance = function(chance) {
		if (chance < 0 || chance > 1) {
			throw new Error("AdditionalMessage.setChance can't use values outside [0; 1]");
		}
		this.chance = chance;
	};
	
	const SCOPE = this;
	
	this.getCondition = function() {
		return this.condition || null;
	};
	
	this.setCondition = function(condition) {
		if (!condition instanceof Function) {
			throw new Error("AdditionalMessage.setCondition only can take functions");
		}
		this.condition = function() {
			try { condition.apply(SCOPE); }
			catch(e) { reportError(e); }
		};
	};
	
	this.tryToDisplay = function() {
		let condition = this.getCondition();
		if (condition != null) {
			if (condition() != true) {
				return false;
			}
		}
		let chance = this.getChance();
		if (chance < 1) {
			return Math.random() < chance;
		}
		return true;
	};
};

AdditionalMessage.MAX_TITLE_SYMBOLS = 64;
AdditionalMessage.MAX_MESSAGE_SYMBOLS = 256;
AdditionalMessage.DEFAULT_SRC = "menuModuleWarning";

const AdditionalClickableMessage = function(title, message, src, action) {
	AdditionalMessage.prototype.constructor.apply(this, title, message, src);
	
	const SCOPE = this;
	
	this.getAction = function() {
		return this.action || null;
	};
	
	this.setAction = function(action) {
		if (!action instanceof Function) {
			throw new Error("AdditionalClickableMessage.setAction only can take functions");
		}
		this.action = function(message) {
			try { action.apply(SCOPE, message); }
			catch(e) { reportError(e); }
		};
	};
};

AdditionalClickableMessage.prototype = new AdditionalMessage;

const AdditionalMessageFactory = {
	registered: new Array(),
	
	getRegistered: function() {
		return this.registered || null;
	},
	getRegistetedCount: function() {
		return this.getRegisteted().length;
	},
	
	indexOf: function(message) {
		return this.getRegistered().indexOf(message);
	},
	getMessageAt: function(index) {
		return this.getRegistered()[index] || null;
	},
	hasMessage: function(message) {
		return this.indexOf(message) != -1;
	},
	removeMessageAt: function(index) {
		this.getRegistered().splice(index, 1);
		return this.getRegistetedCount();
	},
	
	register: function(title, message, src) {
		if (!title instanceof AdditionalMessage) {
			let message = new AdditionalMessage(title, message, src);
			return this.getRegistered().push(message) - 1;
		}
		return this.getRegistered().push(title) - 1;
	},
	registerClickable: function(title, message, src, action) {
		if (!title instanceof AdditionalClickableMessage) {
			let message = new AdditionalClickableMessage(title, message, src, action);
			return this.getRegistered().push(message) - 1;
		}
		return this.getRegistered().push(title) - 1;
	}
};

const AdditionalSessionRandomizer = function() {
	
};
