const SliderFragment = function() {
	TextFragment.apply(this, arguments);
	this.resetContainer();
	this.modifier = 0;
	this.modifiers = [16, 1];
	this.setValue(0);
};

SliderFragment.prototype = new TextFragment;
SliderFragment.prototype.TYPE = "SliderFragment";

SliderFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(context);
	view.setPadding(Interface.getY(24), Interface.getY(12), Interface.getY(24), Interface.getY(12));
	let self = this;
	let x = 0;
	let y = 0;
	let currently = 0;
	let previous = 0;
	let moved = false;
	view.setOnTouchListener(function(view, event) {
		if (event.getAction() == android.view.MotionEvent.ACTION_DOWN) {
			x = event.getX();
			y = event.getY();
			previous = currently = self.value;
			moved = false;
		} else if (event.getAction() == android.view.MotionEvent.ACTION_MOVE) {
			tryout(function() {
				let current = self.modifiers[self.modifier];
				let raw = event.getX() - x;
				let offset = raw + Interface.getY(60);
				let size = (current > 0 ? 1 / current : current) * (offset < 0 ? -1 : 1) * (Math.pow(2, Math.abs(offset) / Interface.getY(120)) - 1);
				self.value = preround((current == 1 ? size : Math.floor(size * current) / current) + currently);
				if (self.value != previous) {
					previous = self.value;
					self.updateCounter();
				}
				if (!moved) {
					moved = Math.abs(raw) > Interface.getY(12);
				}
			});
		} else if (event.getAction() == android.view.MotionEvent.ACTION_UP) {
			tryout(function() {
				if (!moved) {
					self.modifier++;
					self.modifier >= self.modifiers.length && (self.modifier = 0);
					self.updateCounter();
				} else if (currently != previous) {
					self.onChange && self.onChange(self.value);
				}
			});
			// TODO: return self.holdDefault()
		}
		return true;
	});
	view.setTextSize(Interface.getFontSize(21));
	view.setGravity(Interface.Gravity.CENTER);
	view.setTextColor(Interface.Color.WHITE);
	view.setTypeface(typeface);
	view.setMaxLines(1);
	view.setLayoutParams(new android.view.ViewGroup.
		LayoutParams(Interface.getY(280), Interface.getY(60)));
	this.setContainerView(view);
};

SliderFragment.prototype.getTextView = function() {
	return this.getContainer();
};

SliderFragment.prototype.setValue = function(value) {
	value = parseFloat(value);
	if (isNaN(value)) {
		Logger.Log("ModdingTools: slider value passed NaN or incorrect value, it may be string or number", "INFO");
		return this;
	}
	this.value = value;
	this.updateCounter();
	return this;
};

SliderFragment.prototype.setModifier = function(modifier) {
	this.modifier = parseInt(modifier);
	if (this.modifier < 0) {
		this.modifier = 0;
	}
	if (this.modifier > this.modifiers.length - 1) {
		this.modifier = this.modifiers.length - 1;
	}
	this.updateCounter();
	return this;
};

SliderFragment.prototype.setModifiers = function(modifiers) {
	if (!Array.isArray(modifiers) || modifiers.length == 0) {
		Logger.Log("ModdingTools: slider modifiers passed in incorrect format, please consider that it must be [..]", "INFO");
		return this;
	}
	this.modifier = 0;
	this.modifiers = modifiers;
	this.updateCounter();
	return this;
};

SliderFragment.prototype.updateCounter = function() {
	let current = this.modifiers[this.modifier];
	this.setText(current == 1 ? "" + this.value :
		current > 0 ? preround(this.value * current) + " : " + current :
		preround(this.value / current) + " * " + (-current));
	return this;
};

SliderFragment.prototype.setOnChangeListener = function(action) {
	this.onChange = action;
	return this;
};

SliderFragment.prototype.setOnResetListener = function(action) {
	this.onReset = action;
	return this;
};

SliderFragment.prototype.holdDefault = function() {
	if (typeof this.onReset == "function") {
		this.value = preround(this.onReset() || 0);
		this.onChange && this.onChange(this.value);
		this.updateCounter();
		return true;
	}
	return false;
};

SliderFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof SliderFragment)) {
		json = instanceOrJson;
		instanceOrJson = new SliderFragment();
	}
	instanceOrJson = TextFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("modifiers")) {
		instanceOrJson.setModifiers(calloutOrParse(json, json.modifiers, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("modifier")) {
		instanceOrJson.setModifier(calloutOrParse(json, json.modifier, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("value")) {
		instanceOrJson.setValue(calloutOrParse(json, json.value, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("change")) {
		instanceOrJson.setOnChangeListener(parseCallback(json, json.change, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("reset")) {
		instanceOrJson.setOnResetListener(parseCallback(json, json.reset, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

registerFragmentJson("slider", SliderFragment);
