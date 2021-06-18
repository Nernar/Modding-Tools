const TypingTextView = function(scope, attrs, style) {
	let duration, charIndex, previous, sequence, track, tone, toneMinimum, toneMaximum, toneStatic, toneDuration, punctuationMultiplier, questionMultiplier, spaceMultiplier, callback;
	let instance = new JavaAdapter(android.widget.TextView, {
		alreadyPostedSequenceTyping: false,
		typerHandler: new android.os.Handler(),
		typerRunnable: new java.lang.Runnable(function() {
			let char = instance.getCurrentTyperChar();
			if (tone && instance.canMakeCharSound(char) == true) {
				let range = instance.getTyperToneRange();
				track.write(toneDuration, range[0], range[1], range.length > 2 ? range[2] : toneStatic);
			}
			instance.append(String(char));
			callback && callback.onCharacterTyped(char, charIndex, sequence);
			instance.postNextCharRecursive();
		}),
		postNextCharRecursive: function() {
			charIndex++;
			if (this.hasMoreTyperChar() == true) {
				let char = this.getCurrentTyperChar(),
					duration = instance.getCharDuration(previous, char);
				instance.typerHandler.postDelayed(instance.typerRunnable, duration);
				previous = char;
			} else this.completeTyperSequence();
		},
		getCurrentTyperChar: function() {
			if (typeof sequence == "string") {
				if (typeof charIndex == "number") {
					if (sequence.length > charIndex) {
						return sequence.charAt(charIndex);
					}
				}
			}
			return null;
		},
		hasMoreTyperChar: function() {
			return this.getCurrentTyperChar() != null;
		},
		getCharDuration: function(previous, char) {
			let resolved = callback ? callback.onResolveCharacterDuration(previous, char, charIndex, sequence) : -1;
			if (resolved !== undefined && resolved >= 0) return Number(resolved);
			return previous !== undefined ? /[\.\,\-]/.test(previous) ? duration * punctuationMultiplier :
				/[\?\!\;\:]/.test(previous) ? duration * questionMultiplier :
				/\s/.test(previous) ? duration * spaceMultiplier : duration : duration;
		},
		setTyperPunctuationMultiplier: function(number) {
			punctuationMultiplier = Number(number);
		},
		getTyperPunctuationMultiplier: function() {
			return punctuationMultiplier;
		},
		setTyperQuestionMultiplier: function(number) {
			questionMultiplier = Number(number);
		},
		getTyperQuestionMultiplier: function() {
			return questionMultiplier;
		},
		setTyperSpaceMultiplier: function(number) {
			spaceMultiplier = Number(number);
		},
		getTyperSpaceMultiplier: function() {
			return spaceMultiplier;
		},
		canMakeCharSound: function(char) {
			let resolved = callback ? callback.onResolveCharacterToneable(char, charIndex, sequence) : undefined;
			if (resolved !== undefined) return Boolean(resolved);
			return /\S/.test(char);
		},
		completeTyperSequence: function() {
			this.typerHandler.removeCallbacks(this.typerRunnable);
			if (sequence !== undefined) this.setText(sequence);
			callback && callback.onFinishTyping(sequence, charIndex);
			if (track !== undefined) delete track;
		},
		setTyperIndex: function(index) {
			if (typeof sequence == "string") {
				this.setText(sequence.substring(0, index));
				callback && callback.onStartTyping(index, sequence);
				this.typerHandler.removeCallbacks(this.typerRunnable);
				if (track !== undefined) track.release(), delete track;
				charIndex = Number(index) - 1;
				if (tone) track = playTuneDirectly();
				if (charIndex < 0) delete previous;
				else previous = sequence.charAt(charIndex);
				this.postNextCharRecursive();
			}
		},
		beginDelayedTyper: function() {
			this.setTyperIndex(0);
		},
		getTyperIndex: function() {
			return charIndex;
		},
		setTyperText: function(typeableSequence) {
			sequence = String(typeableSequence);
			if (!this.alreadyPostedSequenceTyping) {
				this.alreadyPostedSequenceTyping = true;
				this.post(function() {
					instance.alreadyPostedSequenceTyping = false;
					instance.beginDelayedTyper();
				});
			}
		},
		getTyperText: function() {
			return sequence;
		},
		setTyperDuration: function(ms) {
			duration = Number(ms);
		},
		getTyperDuration: function() {
			return duration;
		},
		setTyperToneEnabled: function(enabled) {
			tone = Boolean(enabled);
		},
		isTyperToneEnabled: function() {
			return tone;
		},
		setTyperToneStatable: function(enabled) {
			toneStatic = Boolean(enabled);
		},
		isTyperToneStatable: function() {
			return toneStatic;
		},
		setTyperMinimumTone: function(number) {
			toneMinimum = Number(number);
		},
		getTyperMinimumTone: function() {
			return toneMinimum;
		},
		setTyperMaximumTone: function(number) {
			toneMaximum = Number(number);
		},
		getTyperMaximumTone: function() {
			return toneMaximum;
		},
		setTyperToneRange: function(minimum, maximum) {
			this.setTyperMinimumTone(minimum);
			this.setTyperMaximumTone(maximum);
		},
		getTyperToneRange: function() {
			let resolved = callback ? callback.onResolveToneRange(toneMinimum, toneMaximum, charIndex, sequence) : undefined;
			if (resolved !== undefined) return resolved;
			return [toneMinimum, toneMaximum];
		},
		setTyperToneDuration: function(ms) {
			toneDuration = Number(ms);
		},
		getTyperToneDuration: function() {
			return toneDuration;
		},
		setTyperCallback: function(object) {
			if (object instanceof TypingTextView.Callback) {
				callback = object;
			} else if (object != null) {
				callback = new TypingTextView.Callback(object);
			} else callback = undefined;
		},
		getTyperCallback: function() {
			return callback;
		},
		getTyperPreviousChar: function() {
			return previous;
		}
	}, scope, attrs || null, style || 0);
	return instance;
};

TypingTextView.Callback = function(object) {
	if (object !== undefined && object !== null) {
		for (let element in this) {
			if (!object[element]) continue;
			this.change(element, object);
		}
	}
};

TypingTextView.Callback.prototype.change = function(element, object) {
	this[element] = function() {
		let args = arguments;
		tryout.call(object, function() {
			object[element].apply(this, args);
		});
	};
};

TypingTextView.Callback.prototype.onStartTyping = new Function();
TypingTextView.Callback.prototype.onCharacterTyped = new Function();
TypingTextView.Callback.prototype.onResolveCharacterDuration = new Function();
TypingTextView.Callback.prototype.onResolveCharacterToneable = new Function();
TypingTextView.Callback.prototype.onResolveToneRange = new Function();
TypingTextView.Callback.prototype.onFinishTyping = new Function();

const createTypingTextView = function(callback) {
	let instance = new TypingTextView(context);
	instance.setTyperPunctuationMultiplier(4);
	instance.setTyperQuestionMultiplier(6);
	instance.setTyperSpaceMultiplier(2);
	instance.setTyperDuration(60);
	if (callback !== undefined && callback !== null) {
		instance.setTyperCallback(callback);
	}
	return instance;
};
