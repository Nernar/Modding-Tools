/**
 * @type
 */
const SliderFragment = function() {
	TextFragment.apply(this, arguments);
	this.modifier = 0;
	this.modifiers = [16, 1];
	this.setValue(0);
};

SliderFragment.prototype = new TextFragment;
SliderFragment.prototype.TYPE = "SliderFragment";

SliderFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(getContext());
	view.setPadding(toComplexUnitDip(16), toComplexUnitDip(8),
		toComplexUnitDip(16), toComplexUnitDip(8));
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
			try {
				let current = self.modifiers[self.modifier];
				let raw = event.getX() - x;
				let offset = raw + toComplexUnitDip(40);
				let size = (current > 0 ? 1 / current : current) * (offset < 0 ? -1 : 1) * (Math.pow(2, Math.abs(offset) / toComplexUnitDip(80)) - 1);
				self.value = preround((current == 1 ? Math.floor(size) : Math.floor(size * current) / current) + currently);
				if (self.value != previous) {
					previous = self.value;
					self.updateCounter();
				}
				if (!moved) {
					moved = Math.abs(raw) > toComplexUnitDip(8);
				}
			} catch (e) {
				log("Modding Tools: SliderFragment.onTouch: " + e);
			}
		} else if (event.getAction() == android.view.MotionEvent.ACTION_UP) {
			try {
				if (!moved) {
					if (self.reset && event.getDownTime() > 1000) {
						return !!self.reset();
					}
					self.modifier++;
					self.modifier >= self.modifiers.length && (self.modifier = 0);
					self.updateCounter();
				} else if (currently != previous) {
					self.change(self.value, currently);
				}
			} catch (e) {
				reportError(e);
			}
		}
		view.getParent().requestDisallowInterceptTouchEvent(true);
		return true;
	});
	view.setTextSize(toComplexUnitDp(8));
	view.setGravity($.Gravity.CENTER);
	view.setTextColor($.Color.WHITE);
	view.setTypeface(typeface);
	view.setMaxLines(1);
	view.setLayoutParams(new android.view.ViewGroup.LayoutParams
		(toComplexUnitDip(188), toComplexUnitDip(40))
	);
	this.setContainerView(view);
};

SliderFragment.prototype.getTextView = function() {
	return this.getContainer();
};

SliderFragment.prototype.getValue = function() {
	return this.value || 0;
};

SliderFragment.prototype.setValue = function(value) {
	value = value - 0;
	if (isNaN(value)) {
		Logger.Log("Modding Tools: Passed NaN to SliderFragment.setValue(*), it may be string or number", "WARNING");
		return false;
	}
	this.value = preround(value);
	this.updateCounter();
	return true;
};

SliderFragment.prototype.setSuffix = function(suffix) {
	if (suffix != null) {
		this.suffix = "" + suffix;
	} else {
		delete this.suffix;
	}
	this.updateCounter();
	return this;
};

SliderFragment.prototype.setModifier = function(modifier) {
	this.modifier = modifier - 0;
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
		Logger.Log("Modding Tools: SliderFragment.setModifiers(*) in incorrect format, please consider that it must be [..]", "WARNING");
		return this;
	}
	this.modifier = 0;
	this.modifiers = modifiers;
	this.updateCounter();
	return this;
};

SliderFragment.prototype.updateCounter = function() {
	let current = this.modifiers[this.modifier];
	this.setText((current == 1 ? "" + this.value :
		current > 0 ? preround(this.value * current) + " : " + current :
		preround(this.value / current) + " * " + (-current)) + (this.suffix || ""));
	return this;
};

SliderFragment.prototype.change = function(value, previous) {
	previous == null && (previous = this.value);
	if (this.setValue(value)) {
		let parent = this.getParent();
		parent && parent.changeItemInLayout && parent.changeItemInLayout(this, value, value - previous);
		this.onChange && this.onChange(value, value - previous);
	}
};

SliderFragment.prototype.reset = function() {
	let value = this.onReset && this.onReset(this.value);
	if (value != true && (value == null || isNaN(value))) {
		let parent = this.getParent();
		value = parent && parent.resetItemInLayout && parent.resetItemInLayout(this, value);
	}
	if (value != true && (value == null || isNaN(value))) {
		return false;
	}
	value == true || this.change(value);
	return true;
};

SliderFragment.prototype.setOnChangeListener = function(listener) {
	if (typeof listener == "function") {
		this.onChange = listener.bind(this);
	} else {
		delete this.onChange;
	}
	return this;
};

SliderFragment.prototype.setOnResetListener = function(listener) {
	if (typeof listener == "function") {
		this.onReset = listener.bind(this);
	} else {
		delete this.onReset;
	}
	return this;
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
	if (json.hasOwnProperty("suffix")) {
		instanceOrJson.setSuffix(calloutOrParse(json, json.suffix, [this, instanceOrJson]));
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
