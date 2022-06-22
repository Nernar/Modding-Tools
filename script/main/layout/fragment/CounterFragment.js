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
	content.setPadding(getDisplayPercentHeight(12), getDisplayPercentHeight(12), getDisplayPercentHeight(12), getDisplayPercentHeight(12));
	content.setGravity($.Gravity.CENTER);
	this.setContainerView(content);
	
	let subtract = new android.widget.ImageView(getContext());
	new BitmapDrawable("controlAdapterMinus").attachAsImage(subtract);
	subtract.setOnClickListener(function(view) {
		tryout(function() {
			let current = self.modifiers[self.modifier];
			self.value = preround(self.value - (current > 0 ? 1 / current : current));
			self.onChange && self.onChange(self.value);
			self.updateCounter();
		});
	});
	subtract.setTag("counterSubtract");
	let params = new android.widget.LinearLayout.
		LayoutParams(getDisplayPercentHeight(60), getDisplayPercentHeight(60))
	content.addView(subtract, params);
	
	modifier.setPadding(getDisplayPercentHeight(12), 0, getDisplayPercentHeight(12), 0);
	modifier.setOnClickListener(function(view) {
		tryout(function() {
			self.modifier++;
			self.modifier == self.modifiers.length && (self.modifier = 0);
			self.updateCounter();
		});
	});
	modifier.setOnLongClickListener(function(view) {
		return tryout(function() {
			return self.holdDefault();
		}, false);
	});
	modifier.setTag("counterText");
	content.addView(modifier, new android.widget.LinearLayout.
		LayoutParams(getDisplayPercentHeight(160), $.ViewGroup.LayoutParams.MATCH_PARENT));
	
	let add = new android.widget.ImageView(getContext());
	new BitmapDrawable("controlAdapterPlus").attachAsImage(add);
	add.setOnClickListener(function(view) {
		tryout(function() {
			let current = self.modifiers[self.modifier];
			self.value = preround(self.value + (current > 0 ? 1 / current : current));
			self.onChange && self.onChange(self.value);
			self.updateCounter();
		});
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
