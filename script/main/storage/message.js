const AdditionalMessage = function(src, message, chance, condition) {
	if (src !== undefined) this.setIcon(src);
	if (message !== undefined) this.setMessage(message);
	if (chance !== undefined) this.setChance(chance);
	if (condition !== undefined) this.setCondition(condition);
};

AdditionalMessage.MAX_MESSAGE_SYMBOLS = 256;
AdditionalMessage.DEFAULT_SRC = "menuBoard";

AdditionalMessage.prototype.src = AdditionalMessage.DEFAULT_SRC;

AdditionalMessage.prototype.getMessage = function() {
	return this.message || null;
};

AdditionalMessage.prototype.getLocalizedMessage = function() {
	return translate(this.getMessage());
};

AdditionalMessage.prototype.setMessage = function(message) {
	if (!(message instanceof String)) {
		message = String(message);
	}
	if (message.length > AdditionalMessage.MAX_MESSAGE_SYMBOLS) {
		message = message.substring(AdditionalMessage.MAX_MESSAGE_SYMBOLS);
	}
	this.message = message;
};

AdditionalMessage.prototype.getIcon = function() {
	return this.src || null;
};

AdditionalMessage.prototype.setIcon = function(src) {
	this.src = src;
};

AdditionalMessage.prototype.getChance = function() {
	return this.hasOwnProperty("chance") ? this.chance : 1;
};

AdditionalMessage.prototype.setChance = function(chance) {
	if (chance < 0 || chance > 1) {
		MCSystem.throwException("AdditionalMessage.setChance can't use values outside [0; 1]");
	}
	this.chance = chance;
};

AdditionalMessage.prototype.getCondition = function() {
	return this.condition || null;
};

AdditionalMessage.prototype.setCondition = function(condition) {
	if (!condition instanceof Function) {
		MCSystem.throwException("AdditionalMessage.setCondition can take functions only");
	}
	this.condition = function() {
		return tryout.call(this, condition);
	};
};

AdditionalMessage.prototype.tryToDisplay = function() {
	let condition = this.getCondition();
	if (condition !== null) {
		if (condition.call(this) != true) {
			return false;
		}
	}
	let chance = this.getChance();
	if (chance < 1) {
		return Math.random() < chance;
	}
	return true;
};

const AdditionalClickableMessage = function(src, message, chance, action, condition) {
	AdditionalMessage.call(this, src, message, chance, condition);
	if (action !== undefined) this.setAction(action);
};

AdditionalClickableMessage.prototype = new AdditionalMessage;

AdditionalClickableMessage.prototype.getAction = function() {
	return this.action || null;
};

AdditionalClickableMessage.prototype.setAction = function(action) {
	if (!action instanceof Function) {
		MCSystem.throwException("AdditionalClickableMessage.setAction only can take functions");
	}
	this.action = function(message) {
		tryout.call(this, function() {
			action(message);
		});
	};
};

const AdditionalMessageFactory = new Object();

AdditionalMessageFactory.registered = new Array();

AdditionalMessageFactory.getRegistered = function() {
	return this.registered || null;
};

AdditionalMessageFactory.getRegisteredCount = function() {
	return this.getRegistered().length;
};

AdditionalMessageFactory.indexOf = function(message) {
	return this.getRegistered().indexOf(message);
};

AdditionalMessageFactory.getMessageAt = function(index) {
	return this.getRegistered()[index] || null;
};

AdditionalMessageFactory.hasMessage = function(message) {
	return this.indexOf(message) != -1;
};

AdditionalMessageFactory.removeMessage = function(messageOrIndex) {
	if (String(messageOrIndex) == "[object Object]") {
		messageOrIndex = this.indexOf(messageOrIndex);
	}
	if (messageOrIndex == -1) return false;
	this.getRegistered().splice(messageOrIndex, 1);
	return true;
};

AdditionalMessageFactory.register = function(srcOrMessage, message, chance, condition) {
	if (!(srcOrMessage instanceof AdditionalMessage)) {
		srcOrMessage = new AdditionalMessage(srcOrMessage, message, chance, condition);
	}
	return this.getRegistered().push(srcOrMessage) - 1;
};

AdditionalMessageFactory.registerClickable = function(srcOrMessage, message, chance, action, condition) {
	if (!(srcOrMessage instanceof AdditionalClickableMessage)) {
		srcOrMessage = new AdditionalClickableMessage(srcOrMessage, message, chance, action, condition);
	}
	return this.getRegistered().push(srcOrMessage) - 1;
};

AdditionalMessageFactory.resetAll = function() {
	this.registered = new Array();
};

AdditionalMessageFactory.randomize = function(limit) {
	let registered = this.getRegistered();
	if (registered === null) return new Array();
	let randomized = new Array();
	if (limit === undefined) limit = -1;
	registered = registered.sort(function(a, b) {
		return .5 - Math.random();
	});
	for (let i = 0; i < registered.length; i++) {
		let message = registered[i];
		if (message.tryToDisplay()) randomized.push(message);
		if (limit != -1 && randomized.length >= limit) break;
	}
	return randomized;
};

AdditionalMessageFactory.Session = function(count, limit) {
	if (count !== undefined) this.setCount(count);
	if (limit !== undefined) this.setLimit(limit);
	this.complete();
};

AdditionalMessageFactory.Session.prototype.count = 1;
AdditionalMessageFactory.Session.prototype.limit = -1;

AdditionalMessageFactory.Session.prototype.getCount = function() {
	return this.count > 0 ? this.count : 1;
};

AdditionalMessageFactory.Session.prototype.setCount = function(count) {
	this.count = preround(count, 0);
	return this;
};

AdditionalMessageFactory.Session.prototype.getLimit = function() {
	return this.limit !== undefined ? this.limit : -1;
};

AdditionalMessageFactory.Session.prototype.setLimit = function(limit) {
	this.limit = preround(limit, 0);
	return this;
};

AdditionalMessageFactory.Session.prototype.toResult = function() {
	if (!this.hasOwnProperty("randomized")) {
		this.queue();
	}
	return this.randomized;
};

AdditionalMessageFactory.Session.prototype.getMessageCount = function() {
	return this.toResult().length;
};

AdditionalMessageFactory.Session.prototype.queue = function() {
	this.randomized = AdditionalMessageFactory.randomize(this.getLimit());
	let indexed = this.indexed = new Object();
	for (let i = 0; i < this.getCount(); i++) {
		indexed[i + 1] = new Array();
	}
	for (let i = 0; i < this.getMessageCount(); i++) {
		let position = i % this.getCount() + 1;
		indexed[position].push(this.randomized[i]);
	}
	let values = new Array();
	for (let index in indexed) {
		values.push(indexed[index]);
	}
	values = values.sort(function(a, b) {
		return .5 - Math.random();
	});
	for (let i = 0; i < values.length; i++) {
		indexed[i + 1] = values[i];
	}
};

AdditionalMessageFactory.Session.prototype.attachNext = function(control) {
	if (!this.hasMore()) return this.complete();
	let randomized = this.toResult();
	if (randomized.length == 0) return false;
	this.position++;
	if (this.indexed.hasOwnProperty(this.position)) {
		let indexed = this.indexed[this.position];
		if (Array.isArray(indexed)) {
			for (let i = 0; i < indexed.length; i++) {
				this.attach(control, indexed[i]);
			}
		}
	}
	return this.hasMore();
};

AdditionalMessageFactory.Session.prototype.hasMore = function() {
	return this.position < this.getCount();
};

AdditionalMessageFactory.Session.prototype.attach = function(control, message) {
	if (control === undefined || control === null) {
		MCSystem.throwException("Can't attach session to null or undefined");
	}
	if (message === undefined || message === null) {
		return false;
	}
	if (message instanceof AdditionalClickableMessage) {
		control.addMessage(message.getIcon(), message.getMessage(), message.getAction());
	} else control.addMessage(message.getIcon(), message.getMessage());
	return true;
};

AdditionalMessageFactory.Session.prototype.complete = function() {
	this.position = 0;
	delete this.randomized;
	delete this.indexed;
};
