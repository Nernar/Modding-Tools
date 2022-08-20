const CounterFragment = function() {
	SliderFragment.apply(this, arguments);
};

CounterFragment.prototype = new SliderFragment;
CounterFragment.prototype.TYPE = "CounterFragment";

CounterFragment.prototype.resetContainer = function() {
	SliderFragment.prototype.resetContainer.apply(this, arguments);
	let modifier = this.getContainer();
	let self = this;
	
	let content = new android.widget.LinearLayout(getContext());
	content.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
		toComplexUnitDip(8), toComplexUnitDip(8));
	content.setGravity($.Gravity.CENTER);
	this.setContainerView(content);
	
	let subtract = new android.widget.ImageView(getContext());
	new BitmapDrawable("controlAdapterMinus").attachAsImage(subtract);
	subtract.setOnClickListener(function() {
		try {
			let current = self.modifiers[self.modifier];
			self.value = preround(self.value - (current > 0 ? 1 / current : current));
			self.onChange && self.onChange(self.value);
			self.updateCounter();
		} catch (e) {
			reportError(e);
		}
	});
	subtract.setTag("counterSubtract");
	let params = new android.widget.LinearLayout.
		LayoutParams(toComplexUnitDip(40), toComplexUnitDip(40))
	content.addView(subtract, params);
	
	modifier.setPadding(toComplexUnitDip(8), 0, toComplexUnitDip(8), 0);
	modifier.setOnClickListener(function() {
		try {
			self.modifier++;
			self.modifier == self.modifiers.length && (self.modifier = 0);
			self.updateCounter();
		} catch (e) {
			reportError(e);
		}
	});
	modifier.setOnLongClickListener(function() {
		try {
			return !!self.holdDefault();
		} catch (e) {
			reportError(e);
		}
		return false;
	});
	modifier.setTag("counterText");
	content.addView(modifier, new android.widget.LinearLayout.
		LayoutParams(toComplexUnitDip(104), $.ViewGroup.LayoutParams.MATCH_PARENT));
	
	let add = new android.widget.ImageView(getContext());
	new BitmapDrawable("controlAdapterPlus").attachAsImage(add);
	add.setOnClickListener(function() {
		try {
			let current = self.modifiers[self.modifier];
			self.value = preround(self.value + (current > 0 ? 1 / current : current));
			self.onChange && self.onChange(self.value);
			self.updateCounter();
		} catch (e) {
			reportError(e);
		}
	});
	add.setTag("counterAdd");
	content.addView(add, params);
};

CounterFragment.prototype.getTextView = function() {
	return this.findViewByTag("counterText");
};

CounterFragment.prototype.getSubtractView = function() {
	return this.findViewByTag("counterSubtract");
};

CounterFragment.prototype.getAddView = function() {
	return this.findViewByTag("counterAdd");
};

CounterFragment.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof CounterFragment)) {
		json = instanceOrJson;
		instanceOrJson = new CounterFragment();
	}
	return SliderFragment.parseJson.call(this, instanceOrJson, json);
};

registerFragmentJson("counter", CounterFragment);
