const NarrationFragment = function() {
	Fragment.apply(this, arguments);
	this.resetContainer();
	this.setBackground($.Color.BLACK);
};

NarrationFragment.prototype = new Fragment;

NarrationFragment.prototype.resetContainer = function() {
	let content = new android.widget.LinearLayout(getContext());
	content.setGravity($.Gravity.CENTER);
	this.setContainerView(content);
	
	let typing = new Packages.io.nernar.android.widget.ToneTypingTextView(getContext());
	typeface && typing.setTypeface(typeface);
	typing.setTextSize(toComplexUnitSp(17));
	typing.setGravity($.Gravity.CENTER);
	let params = new android.widget.LinearLayout.
		LayoutParams($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	params.leftMargin = params.rightMargin = params.topMargin =
		params.bottomMargin = toComplexUnitDip(84);
	typing.setTag("narrationTypingField");
	content.addView(typing, params);
};

NarrationFragment.prototype.getTypingField = function() {
	return this.findViewByTag("narrationTypingField");
};

NarrationFragment.prototype.setBackground = function(colorOrDrawable) {
	let content = this.getContainer();
	if (colorOrDrawable !== undefined && colorOrDrawable !== null) {
		if (!(colorOrDrawable instanceof android.graphics.drawable.Drawable)) {
			colorOrDrawable = new android.graphics.drawable.ColorDrawable(colorOrDrawable);
		}
	}
	content.setBackgroundDrawable(colorOrDrawable || null);
};

NarrationFragment.prototype.changeVoice = function(voice) {
	if (!(voice instanceof NarrationVoice)) {
		MCSystem.throwException("ModdingTools: that isn't narration voice instance");
	}
	let typing = this.getTypingField();
	typing.setTypingDelay(voice.getDuration());
	typing.setDefaultTone(voice.getTone());
	typing.setDefaultToneDuration(voice.getVoiceDuration());
	typing.setTextColor(voice.getColor());
	this.voice = voice;
};

NarrationFragment.prototype.type = function(message) {
	this.getTypingField().setText(message);
};

NarrationFragment.prototype.getVoice = function() {
	return this.voice;
};

const NarrationWindow = function() {
	let window = UniqueWindow.apply(this, arguments);
	window.setWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
	window.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);
	let fade = new android.transition.Fade();
	fade.setDuration(400);
	window.setEnterTransition(fade);
	fade = new android.transition.Fade();
	fade.setDuration(800);
	window.setExitTransition(fade);
	window.setFragment(new NarrationFragment());
	window.fields = [];
	let fragment = window.getFragment();
	fragment.getContainer().setOnClickListener(function() {
		window.continue();
	});
	let field = fragment.getTypingField();
	field.setOnTypingListener({
		onTypingStarted: function() {
			window.onTypingStarted.apply(window, arguments);
		},
		onSequenceIncreased: function() {
			window.onSequenceIncreased.apply(window, arguments);
		},
		onTypingCompleted: function() {
			window.onTypingCompleted.apply(window, arguments);
		}
	});
	field.setOnResolveToneObserver({
		onResolveCharacterToneable: function() {
			return window.onResolveCharacterToneable.apply(window, arguments);
		},
		onResolveCharacterTone: function() {
			return window.onResolveCharacterTone.apply(window, arguments);
		},
		onResolveCharacterToneDuration: function() {
			return window.onResolveCharacterToneDuration.apply(window, arguments);
		}
	});
	return window;
};

NarrationWindow.prototype = new UniqueWindow;
NarrationWindow.prototype.TYPE = "NarrationWindow";

NarrationWindow.prototype.onTypingStarted = function(sequence) {
	let fragment = this.getFragment();
	fragment.changeVoice(this.getCurrentFieldVoice());
	let narration = this.getObserver();
	if (narration && narration.onTypingStarted) {
		narration.onTypingStarted.apply(this, arguments);
	}
	let field = this.getCurrentFieldObserver();
	if (field && field.onTypingStarted) {
		field.onTypingStarted.apply(this, arguments);
	}
};

NarrationWindow.prototype.onSequenceIncreased = function(sequence) {
	let narration = this.getObserver();
	if (narration && narration.onSequenceIncreased) {
		narration.onSequenceIncreased.apply(this, arguments);
	}
	let field = this.getCurrentFieldObserver();
	if (field && field.onSequenceIncreased) {
		field.onSequenceIncreased.apply(this, arguments);
	}
};

NarrationWindow.prototype.onResolveCharacterToneable = function(sequence) {
	let toneable, narration = this.getObserver();
	if (narration && narration.onResolveCharacterToneable) {
		let resolved = narration.onResolveCharacterToneable.apply(this, arguments);
		if (resolved !== undefined) toneable = resolved;
	}
	let field = this.getCurrentFieldObserver();
	if (field && field.onResolveCharacterToneable) {
		let resolved = field.onResolveCharacterToneable.apply(this, arguments);
		if (resolved !== undefined) toneable = resolved;
	}
	return toneable === undefined ? true : toneable;
};

NarrationWindow.prototype.onResolveCharacterTone = function(base, sequence) {
	let tone, narration = this.getObserver();
	if (narration && narration.onResolveCharacterTone) {
		let resolved = narration.onResolveCharacterTone.apply(this, arguments);
		if (resolved !== undefined) tone = resolved;
	}
	let field = this.getCurrentFieldObserver();
	if (field && field.onResolveCharacterTone) {
		let resolved = field.onResolveCharacterTone.apply(this, arguments);
		if (resolved !== undefined) tone = resolved;
	}
	return tone === undefined ? base : tone;
};

NarrationWindow.prototype.onResolveCharacterToneDuration = function(base, sequence) {
	let duration, narration = this.getObserver();
	if (narration && narration.onResolveCharacterToneDuration) {
		let resolved = narration.onResolveCharacterToneDuration.apply(this, arguments);
		if (resolved !== undefined) duration = resolved;
	}
	let field = this.getCurrentFieldObserver();
	if (field && field.onResolveCharacterToneDuration) {
		let resolved = field.onResolveCharacterToneDuration.apply(this, arguments);
		if (resolved !== undefined) duration = resolved;
	}
	return duration === undefined ? base : duration;
};

NarrationWindow.prototype.onTypingCompleted = function(size) {
	let narration = this.getObserver();
	if (narration && narration.onTypingCompleted) {
		narration.onTypingCompleted.apply(this, arguments);
	}
	let field = this.getCurrentFieldObserver();
	if (field && field.onTypingCompleted) {
		field.onTypingCompleted.apply(this, arguments);
	}
	this.continueDelayed();
};

NarrationWindow.prototype.continue = function() {
	if (this.hasMore()) this.next();
	else this.dismiss();
};

NarrationWindow.prototype.continueDelayed = function() {
	this.setTouchable(false);
	let instance = this;
	handle(function() {
		instance.continue();
		instance.setTouchable(true);
	}, this.getDelay());
};

NarrationWindow.prototype.getFields = function() {
	return this.fields;
};

NarrationWindow.prototype.getFieldCount = function() {
	return this.getFields().length;
};

NarrationWindow.prototype.next = function() {
	let fragment = this.getFragment();
	if (!this.hasMore()) return false;
	let field = this.getFields().shift();
	this.field = field;
	fragment.type(field.getMessage());
	return true;
};

NarrationWindow.prototype.getCurrentField = function() {
	return this.field;
};

NarrationWindow.prototype.getCurrentFieldObserver = function() {
	let field = this.getCurrentField();
	if (field) return field.getObserver();
};

NarrationWindow.prototype.getCurrentFieldVoice = function() {
	let field = this.getCurrentField();
	if (field) return field.getVoice();
	return Narrator;
};

NarrationWindow.prototype.hasMore = function() {
	return this.getFieldCount() > 0;
};

NarrationWindow.prototype.setDelay = function(number) {
	this.delay = Number(number);
};

NarrationWindow.prototype.getDelay = function() {
	return this.delay;
};

NarrationWindow.prototype.getCurrentVoice = function() {
	return this.getFragment().getVoice();
};

NarrationWindow.prototype.setObserver = function(object) {
	if (object != null) {
		this.observer = object;
	} else delete this.observer;
};

NarrationWindow.prototype.getObserver = function() {
	return this.observer;
};

NarrationWindow.prototype.attach = function() {
	if (!this.isOpened()) this.continueDelayed();
	UniqueWindow.prototype.attach.apply(this, arguments);
};

NarrationWindow.prototype.dismiss = function() {
	if (this.isOpened()) delete this.field;
	UniqueWindow.prototype.dismiss.apply(this, arguments);
};

NarrationWindow.Field = function(voice, message, observer) {
	if (voice !== undefined) this.setVoice(voice);
	if (message !== undefined) this.setMessage(message);
	if (observer !== undefined) this.setObserver(observer);
};

NarrationWindow.Field.prototype.setVoice = function(voice) {
	this.voice = voice;
};

NarrationWindow.Field.prototype.getVoice = function() {
	return this.voice;
};

NarrationWindow.Field.prototype.setMessage = function(message) {
	this.message = String(message);
};

NarrationWindow.Field.prototype.getMessage = function() {
	return this.message;
};

NarrationWindow.Field.prototype.setObserver = function(object) {
	if (object != null) {
		this.observer = object;
	} else delete this.observer;
};

NarrationWindow.Field.prototype.getObserver = function() {
	return this.observer;
};

NarrationWindow.prototype.addField = function(fieldOrVoice, message, observer) {
	if (!(fieldOrVoice instanceof NarrationWindow.Field)) {
		fieldOrVoice = new NarrationWindow.Field(fieldOrVoice);
	}
	fieldOrVoice.setMessage(message);
	fieldOrVoice.setObserver(observer);
	this.fields.push(fieldOrVoice);
	return fieldOrVoice;
};

const NarrationVoice = function(name, duration, tone, voice, color) {
	if (name !== undefined) this.setName(name);
	if (duration !== undefined) this.setDuration(duration);
	if (tone !== undefined) this.setVoiceDuration(tone);
	if (voice !== undefined) this.setTone(voice);
	if (color !== undefined) this.setColor(color);
};

NarrationVoice.prototype.setName = function(name) {
	this.name = String(name);
};

NarrationVoice.prototype.getName = function() {
	return this.name;
};

NarrationVoice.prototype.getLocalizedName = function() {
	return translateCode(this.getName());
};

NarrationVoice.prototype.setDuration = function(duration) {
	this.duration = Number(duration);
};

NarrationVoice.prototype.getDuration = function() {
	return this.duration;
};

NarrationVoice.prototype.setVoiceDuration = function(duration) {
	this.tone = Number(duration);
};

NarrationVoice.prototype.getVoiceDuration = function() {
	return this.tone;
};

NarrationVoice.prototype.setTone = function(tone) {
	this.voice = Number(tone);
};

NarrationVoice.prototype.getTone = function() {
	return this.voice;
};

NarrationVoice.prototype.setColor = function(color) {
	this.color = color;
};

NarrationVoice.prototype.getColor = function() {
	return this.color;
};

REQUIRE("the-begin-narration.dns");

const Narrator = new NarrationVoice(2060773161, 400, 175, 24, $.Color.RED);
const Human = new NarrationVoice(68147221, 20, 20, 34, $.Color.WHITE);
const YiellingHuman = new NarrationVoice(68147221, 10, 20, 30, $.Color.WHITE);
const Monster = new NarrationVoice(1970600048, 15, 15, 37, $.Color.WHITE);
const ScariedMonster = new NarrationVoice(1970600048, 150, 125, 29, $.Color.WHITE);
const Chara = new NarrationVoice(65071019, 25, 25, 23, $.Color.WHITE);
const Author = new NarrationVoice(1972506027, 60, 40, 20, $.Color.GREEN);

return function() {
	let narration = new NarrationWindow();
	narration.addField(Narrator, "...");
	narration.addField(Human, "...");
	narration.addField(Human, translateCode(2057560) + "...");
	narration.addField(Human, translateCode(2050569) + ".");
	narration.addField(YiellingHuman, Monster.getLocalizedName().toUpperCase() + "!");
	narration.addField(Chara, translateCode(-1478856006, Monster.getLocalizedName()));
	narration.addField(ScariedMonster, translateCode(79462) + "...", {
		onResolveCharacterTone: function(base, char) {
			return char == "." ? 23 : base;
		}
	});
	narration.addField(Chara, translateCode(857634239, [translateCode(2333), Human.getLocalizedName()]));
	narration.addField(Monster, Human.getLocalizedName() + "?");
	narration.addField(Monster, translateCode(543270481) + "?");
	narration.addField(Chara, translateCode(-115671214, Human.getLocalizedName()));
	narration.addField(Monster, translateCode(2119) + "?..");
	narration.addField(Monster, translateCode(1640602775) + "?");
	narration.addField(Chara, translateCode(1823643522, Human.getLocalizedName()));
	narration.addField(Human, translateCode(-753049471) + "...");
	narration.addField(Chara, translateCode(1214760478, [Human.getLocalizedName(), translateCode(2050569)]));
	narration.addField(Human, "... " + translateCode(-845363641) + ".");
	narration.addField(Narrator, "...");
	narration.addField(Author, translateCode(-214916102) + ": " + translateCode(2480147) + " 1, " + translateCode(-1891298259) + " 7");
	narration.setObserver({
		onResolveCharacterToneDuration: function(base, char) {
			return char == "." ? 250 : base;
		}
	});
	narration.setDelay(1200);
	handle(function() {
		narration.attach();
	});
};
