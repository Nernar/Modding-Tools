/**
 * @type
 */
const AngleCircleFragment = function() {
	TextFragment.apply(this, arguments);
	this.setValue(0);
};

AngleCircleFragment.prototype = new TextFragment;
AngleCircleFragment.prototype.TYPE = "AngleCircleFragment";

AngleCircleFragment.prototype.resetContainer = function() {
	let view = new android.widget.TextView(getContext());
	view.setPadding(toComplexUnitDip(16), toComplexUnitDip(8),
		toComplexUnitDip(16), toComplexUnitDip(8));
	new BitmapDrawable("controlCircle").attachAsBackground(view);
	let self = this;
	let x = 0;
	let y = 0;
	let currently = 0;
	let previous = 0;
	let moved = false;
	view.setOnTouchListener(function(view, event) {
		if (event.getAction() == android.view.MotionEvent.ACTION_DOWN) {
			x = view.getWidth() / 2 - event.getX();
			y = view.getHeight() / 2 - event.getY();
			previous = currently = self.value;
			moved = false;
		} else if (event.getAction() == android.view.MotionEvent.ACTION_MOVE) {
			try {
				let rawX = event.getX() - x;
				let rawY = event.getY() - y;
				self.value = Math.floor((Math.PI / 2 + Math.atan(rawY / rawX)) * 100) / 100;
				if (self.value != previous) {
					previous = self.value;
					self.updateAngle();
				}
				if (!moved) {
					moved = Math.abs(rawX) > toComplexUnitDip(8);
				}
			} catch (e) {
				log("Modding Tools: AngleCircleFragment.onTouch: " + e);
			}
		} else if (event.getAction() == android.view.MotionEvent.ACTION_UP) {
			try {
				if (!moved) {
					if (self.holdDefault && event.getDownTime() > 1000) {
						return self.holdDefault();
					}
					self.radians = !self.radians;
					self.updateAngle();
				} else if (currently != previous) {
					self.onChange && self.onChange(self.value, self.value * 180 / Math.PI);
				}
			} catch (e) {
				reportError(e);
			}
		}
		view.getParent().requestDisallowInterceptTouchEvent(true);
		return true;
	});
	view.setTextSize(toComplexUnitDp(22));
	view.setGravity($.Gravity.CENTER);
	view.setTextColor($.Color.WHITE);
	view.setTypeface(typeface);
	view.setMaxLines(1);
	view.setLayoutParams(new android.view.ViewGroup.LayoutParams
		(toComplexUnitDip(188), toComplexUnitDip(188)));
	this.setContainerView(view);
};

AngleCircleFragment.prototype.getTextView = function() {
	return this.getContainer();
};

AngleCircleFragment.prototype.getValue = function() {
	return this.value || 0;
};

AngleCircleFragment.prototype.setValue = function(value) {
	value = value - 0;
	if (isNaN(value)) {
		Logger.Log("Modding Tools: Angle circle value passed NaN or incorrect value, it may be string or number", "WARNING");
		return this;
	}
	this.value = value;
	this.updateAngle();
	return this;
};

AngleCircleFragment.prototype.updateAngle = function() {
	if (this.radians) {
		this.setText("" + this.value);
	} else {
		this.setText(Math.floor(this.value * 180 / Math.PI) + "'");
	}
	return this;
};

AngleCircleFragment.prototype.setOnChangeListener = function(action) {
	this.onChange = action;
	return this;
};

AngleCircleFragment.prototype.setOnResetListener = function(action) {
	this.onReset = action;
	return this;
};

AngleCircleFragment.prototype.holdDefault = function() {
	if (typeof this.onReset == "function") {
		this.value = preround(this.onReset() || 0);
		this.onChange && this.onChange(this.value, this.value * 180 / Math.PI);
		this.updateAngle();
		return true;
	}
	return false;
};

AngleCircleFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof AngleCircleFragment)) {
		json = instanceOrJson;
		instanceOrJson = new AngleCircleFragment();
	}
	instanceOrJson = TextFragment.parseJson.call(this, instanceOrJson, json);
	json = calloutOrParse(this, json, instanceOrJson);
	if (json === null || typeof json != "object") {
		return instanceOrJson;
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

registerFragmentJson("angle_circle", AngleCircleFragment);
registerFragmentJson("angleCircle", AngleCircleFragment);
