/**
 * @type
 */
const AsyncSequence = function(obj) {
	Sequence.apply(this, arguments);
};

AsyncSequence.prototype = new Sequence;

AsyncSequence.prototype.isRequiredProgress = function() {
	return showProcesses && this.requiresProgress !== false;
};

AsyncSequence.prototype.setIsRequiredProgress = function(requires) {
	if (requires !== undefined) {
		this.requiresProgress = requires;
	} else {
		delete this.requiresProgress;
	}
};

AsyncSequence.prototype.access = function(script, value) {
	return UNWRAP("sequence/" + script, this, {
		TARGET: value,
		// DEPRECATED: Legacy variable, that will be deleted soon and remained for compatibility.
		INSTANCE: Object.getPrototypeOf(this),
		// DEPRECATED: Legacy variable, that will be deleted soon and remained for compatibility.
		SELF: this
	});
};

AsyncSequence.prototype.section = function(count, index) {
	this.shrink(count, index);
};

AsyncSequence.prototype.change = function(count, index) {
	this.shrink(count, index);
};

AsyncSequence.prototype.finish = function(count, index) {
	this.shrink(count, index);
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
AsyncSequence.prototype.encount = function(count) {
	this.setFixedCount(count);
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
AsyncSequence.prototype.seek = function(addition) {
	if (addition !== undefined) {
		this.require(this.index + addition);
	}
};

// DEPRECATED: Legacy method, that will be deleted soon and remained for compatibility.
AsyncSequence.prototype.sleep = function(ms) {
	java.lang.Thread.sleep(ms);
};

AsyncSequence.access = function(script, what, then, sequence) {
	if (!(sequence instanceof AsyncSequence)) {
		sequence = new AsyncSequence();
	}
	let evaluated = false;
	sequence.process = function(element, value, index) {
		if (evaluated) {
			MCSystem.throwException("Modding Tools: Invalid sequence length: " + index + ".." + sequence.getFixedCount());
		}
		let result = sequence.access(script, value);
		then && then(result);
		evaluated = true;
		return sequence.getFixedCount();
	};
	sequence.execute(what);
	return sequence;
};
