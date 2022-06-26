const Unicode = {};

Unicode.isValidCode = function(code) {
	return java.lang.Character.isValidCodePoint(code);
};

Unicode.isWhitespace = function(code) {
	return java.lang.Character.isWhitespace(code);
};

Unicode.isMayDisplayed = function(code) {
	return java.lang.Character.isDefined(code) && !this.isWhitespace(code);
};

Unicode.toCharArray = function(string) {
	return new java.lang.String(string).toCharArray();
};

Unicode.fromCharArray = function(array) {
	return java.lang.String.copyValueOf(array);
};

Unicode.toCode = function(char) {
	if (!(char instanceof java.lang.Character)) {
		char = new java.lang.Character(char);
	}
	return char.hashCode();
};

Unicode.toCodePoints = function(string) {
	if (!(string instanceof java.lang.String)) {
		string = new java.lang.String(string);
	}
	let points = [];
	for (let i = 0; i < string.length(); i++) {
		point.push(string.codePointAt(i));
	}
	return points;
};

Unicode.toChars = function(code) {
	return java.lang.Character.toChars(code);
};

Unicode.codeToString = function(code) {
	let chars = this.toChars(code);
	return this.fromCharArray(chars);
};

Unicode.pointsToString = function(points) {
	let string = String();
	for (let i = 0; i < points.length; i++) {
		string += this.codeToString(points[i]);
	}
	return string;
};

Unicode.Charset = function(name, start, end) {
	this.name = String(name);
	this.start = Number(start);
	this.end = Number(end);
};

Unicode.Charset.prototype.getName = function() {
	return this.name;
};

Unicode.Charset.prototype.getBeginCode = function() {
	return this.start;
};

Unicode.Charset.prototype.getFinishCode = function() {
	return this.end;
};

Unicode.Charset.prototype.getRange = function() {
	return [this.getBeginCode(), this.getFinishCode()];
};

Unicode.Charset.prototype.isAssignedCode = function(code) {
	let range = this.getRange();
	return code >= range[0] && code <= range[1];
};

Unicode.Charset.prototype.getHexRange = function() {
	let digit = this.getRange();
	return digit.map(function(code) {
		return java.lang.Integer.toHexString(code);
	});
};

Unicode.Charset.prototype.toHexRange = function() {
	return this.getHexRange().join("-");
};

Unicode.charts = [];

Unicode.getAvailabledCharsets = function() {
	return this.charts;
};

Unicode.registerCharset = function(chartOrName, start, end) {
	if (!(chartOrName instanceof Unicode.Charset)) {
		chartOrName = new Unicode.Charset(chartOrName, start, end);
	}
	return this.charts.push(chartOrName);
};

Unicode.getCharsetFor = function(code) {
	if (typeof code != "number") {
		code = this.toCode(code);
	}
	let charsets = this.getAvailabledCharsets();
	for (let i = 0; i < charsets.length; i++) {
		let charset = charsets[i];
		if (charset.isAssignedCode(code)) {
			return charset;
		}
	}
	return null;
};

Unicode.hasCharsetFor = function(code) {
	return this.getCharsetFor(code) !== null;
};

// See https://www.ssec.wisc.edu/~tomw/java/unicode.html for details
Unicode.registerCharset("Basic Latin", 0, 127);
Unicode.registerCharset("Latin-1 Supplement", 128, 255);
Unicode.registerCharset("Latin Extended-A", 256, 383);
Unicode.registerCharset("Latin Extended-B", 384, 591);
Unicode.registerCharset("IPA Extensions", 592, 687);
Unicode.registerCharset("Spacing Modifier Letters", 688, 767);
Unicode.registerCharset("Combining Diacritical Marks", 768, 879);
Unicode.registerCharset("Greek", 880, 1023);
Unicode.registerCharset("Cyrillic", 1024, 1279);
Unicode.registerCharset("Armenian", 1328, 1423);
Unicode.registerCharset("Hebrew", 1424, 1535);
Unicode.registerCharset("Arabic", 1536, 1791);
Unicode.registerCharset("Syriac", 1792, 1871);
Unicode.registerCharset("Thaana", 1920, 1983);
Unicode.registerCharset("Devanagari", 2304, 2431);
Unicode.registerCharset("Bengali", 2432, 2559);
Unicode.registerCharset("Gurmukhi", 2560, 2687);
Unicode.registerCharset("Gujarati", 2688, 2815);
Unicode.registerCharset("Oriya", 2816, 2943);
Unicode.registerCharset("Tamil", 2944, 3071);
Unicode.registerCharset("Telugu", 3072, 3199);
Unicode.registerCharset("Kannada", 3200, 3327);
Unicode.registerCharset("Malayalam", 3328, 3455);
Unicode.registerCharset("Sinhala", 3456, 3583);
Unicode.registerCharset("Thai", 3584, 3711);
Unicode.registerCharset("Lao", 3712, 3839);
Unicode.registerCharset("Tibetan", 3840, 4095);
Unicode.registerCharset("Myanmar", 4096, 4255);
Unicode.registerCharset("Georgian", 4256, 4351);
Unicode.registerCharset("Hangul Jamo", 4352, 4607);
Unicode.registerCharset("Ethiopic", 4608, 4991);
Unicode.registerCharset("Cherokee", 5024, 5119);
Unicode.registerCharset("Unified Canadian Aboriginal Syllabics", 5120, 5759);
Unicode.registerCharset("Ogham", 5760, 5791);
Unicode.registerCharset("Runic", 5792, 5887);
Unicode.registerCharset("Khmer", 6016, 6143);
Unicode.registerCharset("Mongolian", 6144, 6319);
Unicode.registerCharset("Latin Extended Additional", 7680, 7935);
Unicode.registerCharset("Greek Extended", 7936, 8191);
Unicode.registerCharset("General Punctuation", 8192, 8303);
Unicode.registerCharset("Superscripts and Subscripts", 8304, 8351);
Unicode.registerCharset("Currency Symbols", 8352, 8399);
Unicode.registerCharset("Combining Marks for Symbols", 8400, 8447);
Unicode.registerCharset("Letterlike Symbols", 8448, 8527);
Unicode.registerCharset("Number Forms", 8528, 8591);
Unicode.registerCharset("Arrows", 8592, 8703);
Unicode.registerCharset("Mathematical Operators", 8704, 8959);
Unicode.registerCharset("Miscellaneous Technical", 8960, 9215);
Unicode.registerCharset("Control Pictures", 9216, 9279);
Unicode.registerCharset("Optical Character Recognition", 9280, 9311);
Unicode.registerCharset("Enclosed Alphanumerics", 9312, 9471);
Unicode.registerCharset("Box Drawing", 9472, 9599);
Unicode.registerCharset("Block Elements", 9600, 9631);
Unicode.registerCharset("Geometric Shapes", 9632, 9727);
Unicode.registerCharset("Miscellaneous Symbols", 9728, 9983);
Unicode.registerCharset("Dingbats", 9984, 10175);
Unicode.registerCharset("Braille Patterns", 10240, 10495);
Unicode.registerCharset("CJK Radicals Supplement", 11904, 12031);
Unicode.registerCharset("Kangxi Radicals", 12032, 12255);
Unicode.registerCharset("Ideographic Description Characters", 12272, 12287);
Unicode.registerCharset("CJK Symbols and Punctuation", 12288, 12351);
Unicode.registerCharset("Hiragana", 12352, 12447);
Unicode.registerCharset("Katakana", 12448, 12543);
Unicode.registerCharset("Bopomofo", 12544, 12591);
Unicode.registerCharset("Hangul Compatibility Jamo", 12592, 12687);
Unicode.registerCharset("Kanbun", 12688, 12703);
Unicode.registerCharset("Bopomofo Extended", 12704, 12735);
Unicode.registerCharset("Enclosed CJK Letters and Months", 12800, 13055);
Unicode.registerCharset("CJK Compatibility", 13056, 13311);
Unicode.registerCharset("CJK Unified Ideographs Extension A", 13312, 19893);
Unicode.registerCharset("CJK Unified Ideographs", 19968, 40959);
Unicode.registerCharset("Yi Syllables", 40960, 42127);
Unicode.registerCharset("Yi Radicals", 42128, 42191);
Unicode.registerCharset("Hangul Syllables", 44032, 55203);
// Unicode.registerCharset("High Surrogates", 55296, 56191);
// Unicode.registerCharset("High Private Use Surrogates", 56192, 56319);
// Unicode.registerCharset("Low Surrogates", 56320, 57343);
// Unicode.registerCharset("Private Use", 57344, 63743);
Unicode.registerCharset("CJK Compatibility Ideographs", 63744, 64255);
Unicode.registerCharset("Alphabetic Presentation Forms", 64256, 64335);
Unicode.registerCharset("Arabic Presentation Forms-A", 64336, 65023);
Unicode.registerCharset("Combining Half Marks", 65056, 65071);
Unicode.registerCharset("CJK Compatibility Forms", 65072, 65103);
Unicode.registerCharset("Small Form Variants", 65104, 65135);
Unicode.registerCharset("Arabic Presentation Forms-B", 65136, 65278);
Unicode.registerCharset("Specials", 65279, 65279);
Unicode.registerCharset("Halfwidth and Fullwidth Forms", 65280, 65519);
Unicode.registerCharset("Specials", 65520, 65533);

const ToolbarFragment = function() {
	Fragment.apply(this, arguments);
	this.resetContainer();
	this.setBackground("popup");
	this.setTitle(translate(NAME));
	this.setBackButtonImage("controlBack");
};

ToolbarFragment.prototype = new Fragment;

ToolbarFragment.prototype.resetContainer = function() {
	let container = new android.widget.RelativeLayout(getContext());
	container.setPadding(toComplexUnitDip(10), toComplexUnitDip(8),
		toComplexUnitDip(10), toComplexUnitDip(8));
	container.setMinimumWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
	let params = android.widget.FrameLayout.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	container.setLayoutParams(params);
	this.setContainerView(container);
	
	let menu = new android.widget.LinearLayout(getContext());
	menu.setId(java.lang.String("containerItems").hashCode());
	menu.setTag("containerItems");
	params = android.widget.RelativeLayout.LayoutParams
		($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
	params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
	params.leftMargin = toComplexUnitDip(32);
	container.addView(menu, params);
	
	let button = new ToolbarFragment.Item();
	this.views.backButton = button;
	button = button.getContainer();
	button.setVisibility($.View.GONE);
	button.setId(java.lang.String("backButton").hashCode());
	button.setTag("backButton");
	let self = this;
	button.setOnClickListener(function() {
		tryout(function() {
			self.onBackClick && self.onBackClick();
		});
	});
	params = android.widget.RelativeLayout.LayoutParams
		(toComplexUnitDip(54), toComplexUnitDip(54));
	params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_LEFT);
	params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
	container.addView(button, params);
	
	let bar = new android.widget.LinearLayout(getContext());
	bar.setOrientation($.LinearLayout.VERTICAL);
	bar.setId(java.lang.String("toolbarBar").hashCode());
	bar.setTag("toolbarBar");
	params = android.widget.RelativeLayout.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	params.addRule(android.widget.RelativeLayout.RIGHT_OF, button.getId());
	params.addRule(android.widget.RelativeLayout.LEFT_OF, menu.getId());
	params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
	params.leftMargin = toComplexUnitDip(24);
	container.addView(bar, params);
	
	let title = new android.widget.TextView(getContext());
	title.setVisibility($.View.GONE);
	typeface && title.setTypeface(typeface);
	title.setSingleLine(true);
	title.setMaxLines(1);
	title.setTextColor($.Color.WHITE);
	title.setTextSize(toComplexUnitSp(11));
	title.setTag("toolbarTitle");
	bar.addView(title);
	
	let subtitle = new android.widget.TextView(getContext());
	subtitle.setVisibility($.View.GONE);
	typeface && subtitle.setTypeface(typeface);
	subtitle.setSingleLine(true);
	subtitle.setMaxLines(1);
	subtitle.setTextColor($.Color.LTGRAY);
	subtitle.setTextSize(toComplexUnitSp(9));
	subtitle.setTag("toolbarSubtitle");
	bar.addView(subtitle);
};

ToolbarFragment.prototype.getBackground = function() {
	return this.background || null;
};

ToolbarFragment.prototype.setBackground = function(drawable) {
	let container = this.getContainer();
	if (!(drawable instanceof Drawable)) {
		drawable = Drawable.parseJson.call(this, drawable);
	}
	drawable.attachAsBackground(container);
	this.background = drawable;
};

ToolbarFragment.prototype.getBackButtonFragment = function() {
	return this.views.backButton;
};

ToolbarFragment.prototype.setOnBackButtonClickListener = function(listener) {
	this.getBackButtonFragment().setOnClickListener(listener);
};

ToolbarFragment.prototype.setOnBackButtonHoldListener = function(listener) {
	this.getBackButtonFragment().setOnHoldListener(listener);
};

ToolbarFragment.prototype.getBackButtonImage = function() {
	return this.getBackButtonFragment().getImage();
};

ToolbarFragment.prototype.setBackButtonImage = function(src) {
	this.getBackButtonFragment().setImage(src);
};

ToolbarFragment.prototype.getBackButtonBackground = function() {
	return this.getBackButtonFragment().getBackground();
};

ToolbarFragment.prototype.setBackButtonBackground = function(src) {
	this.getBackButtonFragment().setBackground(src);
};

ToolbarFragment.prototype.isBackButtonEnabled = function() {
	return this.backButtonEnabled !== undefined ? this.backButtonEnabled : false;
};

ToolbarFragment.prototype.setBackButtonEnabled = function(enabled) {
	if (typeof enabled != "boolean") {
		enabled = Boolean(enabled);
	}
	let button = this.getBackButtonFragment();
	button = button.getContainer();
	button.setVisibility(enabled ? $.View.VISIBLE : $.View.GONE);
	this.backButtonEnabled = enabled;
};

ToolbarFragment.prototype.getTitleView = function() {
	return this.findViewByTag("toolbarTitle");
};

ToolbarFragment.prototype.getTitle = function() {
	let view = this.getTitleView();
	return String(view.getText());
};

ToolbarFragment.prototype.setTitle = function(title) {
	if (typeof title != "string") {
		title = String(title).trim();
	}
	let view = this.getTitleView();
	view.setText(title);
	view.setVisibility(title.length > 0 ? $.View.VISIBLE : $.View.GONE);
};

ToolbarFragment.prototype.getSubtitleView = function() {
	return this.findViewByTag("toolbarSubtitle");
};

ToolbarFragment.prototype.getSubtitle = function() {
	let view = this.getSubtitleView();
	return String(view.getText());
};

ToolbarFragment.prototype.setSubtitle = function(subtitle) {
	if (typeof subtitle != "string") {
		subtitle = String(subtitle).trim();
	}
	let view = this.getSubtitleView();
	view.setText(subtitle);
	view.setVisibility(subtitle.length > 0 ? $.View.VISIBLE : $.View.GONE);
};

ToolbarFragment.prototype.getItemContainer = function() {
	return this.findViewByTag("containerItems");
};

ToolbarFragment.prototype.addItem = function(view, index) {
	let items = this.getItemContainer();
	if (index >= 0) {
		items.addView(view, index);
	} else items.addView(view);
};

ToolbarFragment.prototype.clearItems = function() {
	let items = this.getItemContainer();
	items.removeAllViews();
};

ToolbarFragment.prototype.removeItem = function(view) {
	let items = this.getItemContainer();
	items.removeView(view);
};

ToolbarFragment.prototype.getItemAt = function(index) {
	let items = this.getItemContainer();
	return items.getChildAt(index);
};

ToolbarFragment.prototype.indexOfItem = function(view) {
	let items = this.getItemContainer();
	return items.indexOfChild(view);
};

ToolbarFragment.prototype.getItemCount = function() {
	let items = this.getItemContainer();
	if (items == null) return -1;
	return items.getChildCount();
};

ToolbarFragment.prototype.actorIfMay = function(actor) {
	let container = this.getContainer();
	container = container.getParent();
	if (container == null) return false;
	android.transition.TransitionManager.beginDelayedTransition(container, actor);
	return true;
};

ToolbarFragment.prototype.hide = function() {
	let view = this.getContainer(),
		actor = new android.transition.Slide($.Gravity.TOP);
	actor.setDuration(750);
	this.actorIfMay(actor);
	view.setVisibility($.View.GONE);
};

ToolbarFragment.prototype.show = function() {
	let view = this.getContainer(),
		actor = new android.transition.Slide($.Gravity.TOP);
	actor.setDuration(750);
	this.actorIfMay(actor);
	view.setVisibility($.View.VISIBLE);
};

ToolbarFragment.Item = function() {
	SidebarFragment.Group.Item.apply(this, arguments);
};

ToolbarFragment.Item.prototype = new SidebarFragment.Group.Item;

const ListHolderAdapter = function(proto) {
	return merge(new JavaAdapter(android.widget.BaseAdapter, android.widget.Adapter, merge({
		getCount: function() {
			return tryout.call(this, function() {
				return this.getItemCount();
			}, 0);
		},
		getItemId: function(position) {
			return position;
		},
		getItem: function(position) {
			return tryout.call(this, function() {
				let items = this.getItems();
				if (items === null) return null;
				return items.length > position ? items[position] : null;
			}, null);
		},
		getView: function(position, convertView, parent) {
			return tryout.call(this, function() {
				let holder = tryout.call(this, function() {
					if (convertView == null) {
						convertView = this.createView(position, parent);
						let instance = this.createHolder(convertView);
						convertView.setTag(instance);
						return instance;
					}
					return convertView.getTag();
				}, function(e) {
					throw e;
				});
				this.describe(holder, position, convertView, parent);
				convertView.setTag(holder);
				return convertView;
			}, null);
		}
	}, proto)), this);
};

ListHolderAdapter.prototype.createView = function(position, parent) {
	let view = new android.widget.TextView(getContext());
	view.setPadding(toComplexUnitDip(10), toComplexUnitDip(5),
		toComplexUnitDip(10), toComplexUnitDip(5));
	typeface && view.setTypeface(typeface);
	view.setTextColor($.Color.WHITE);
	view.setTextSize(toComplexUnitSp(9));
	return view;
};

ListHolderAdapter.prototype.createHolder = function(view) {
	let holder = {};
	holder.text = view;
	return holder;
};

ListHolderAdapter.prototype.describe = function(holder, position, view, parent) {
	let content = this.getItem(position);
	holder.text.setText(String(content));
};

ListHolderAdapter.prototype.getItems = function() {
	return this.array || null;
};

ListHolderAdapter.prototype.getItemCount = function() {
	let items = this.getItems();
	if (items === null) return 0;
	return items.length || 0;
};

ListHolderAdapter.prototype.setItems = function(array) {
	this.array = array;
	this.notifyDataSetChanged();
};

ListHolderAdapter.prototype.toAdapter = function() {
	return this.self;
};

const ImageSourceFragment = function() {
	FrameFragment.apply(this, arguments);
	let self = this;
	this.postHideControl = new java.lang.Runnable(function() {
		tryout(function() {
			self.getToolbar().hide();
		});
	});
};

ImageSourceFragment.prototype = new FrameFragment;

ImageSourceFragment.prototype.resetContainer = function() {
	FrameFragment.prototype.resetContainer.call(this);
	let frame = this.getContainer();
	
	let source = new android.widget.ImageView(getContext());
	source.setScaleType($.ImageView.ScaleType.CENTER);
	source.setTag("sourceImage")
	let params = new android.widget.FrameLayout.LayoutParams
		($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT);
	frame.addView(source, params);
	
	let toolbar = new ToolbarFragment();
	this.views.toolbar = toolbar;
	toolbar.setBackButtonEnabled(true);
	let self = this;
	toolbar.setOnBackButtonClickListener(function() {
		self.onBackClick && self.onBackClick();
	});
	let scale = new ToolbarFragment.Item();
	scale.getContainer().setTag(scale);
	scale.setImage("controlScaleCenter");
	scale.setOnClickListener(function() {
		self.requireControl();
		if (self.onScaleChange) {
			let change = self.onScaleChange();
			if (change !== undefined) self.setScaleType(change);
		}
		self.changeScaleType();
	});
	scale = scale.getContainer();
	toolbar.addItem(scale);
	toolbar.hide();
	toolbar = toolbar.getContainer();
	toolbar.setTag("toolbar");
	frame.addView(toolbar);
};

ImageSourceFragment.prototype.getImageView = function() {
	return this.findViewByTag("sourceImage");
};

ImageSourceFragment.prototype.getSource = function() {
	return this.source || null;
};

ImageSourceFragment.prototype.setSource = function(src) {
	let toolbar = this.getToolbar();
	toolbar.setTitle(Files.getNameWithoutExtension(src.getName()));
	toolbar.setSubtitle(src.getParentFile().getName() + "/");
	let view = this.getImageView();
	if (!(src instanceof BitmapDrawable)) {
		src = new BitmapDrawable(src);
	}
	src.attachAsImage(view);
	this.source = src;
};

ImageSourceFragment.prototype.getScaleType = function() {
	return this.scale !== undefined ? this.scale : $.ImageView.ScaleType.CENTER;
};

ImageSourceFragment.prototype.setScaleType = function(scale) {
	let view = this.getImageView();
	view.setScaleType(scale);
	this.scale = scale;
};

ImageSourceFragment.prototype.getToolbar = function() {
	return this.views.toolbar;
};

ImageSourceFragment.prototype.getPostHideControl = function() {
	return this.postHideControl || null;
};

ImageSourceFragment.prototype.requireControl = function() {
	let toolbar = this.getToolbar();
	toolbar.show();
	let runnable = this.getPostHideControl();
	toolbar = toolbar.getContainer();
	toolbar.removeCallbacks(runnable);
	toolbar.postDelayed(runnable, 5000);
};

ImageSourceFragment.prototype.changeScaleType = function() {
	let toolbar = this.getToolbar(),
		scale = toolbar.getItemAt(0);
	scale = scale.getTag();
	switch (this.getScaleType()) {
		case $.ImageView.ScaleType.CENTER:
			return scale.setImage("controlScaleCenter");
		case $.ImageView.ScaleType.CENTER_CROP:
			return scale.setImage("controlScaleCrop");
		case $.ImageView.ScaleType.FIT_CENTER:
			return scale.setImage("controlScaleInside");
	}
	scale.setImage("controlScaleFit");
};

ImageSourceFragment.prototype.setOnBackClickListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onBackClick;
	}
	this.onBackClick = function() {
		tryout(listener);
	};
	return true;
};

ImageSourceFragment.prototype.setOnScaleChangeListener = function(listener) {
	if (typeof listener != "function") {
		return delete this.onScaleChange;
	}
	this.onScaleChange = function() {
		return tryout(listener);
	};
	return true;
};

const ImageSourceWindow = function() {
	UniqueWindow.apply(this, arguments);
	this.setFragment(new ImageSourceFragment());
	let self = this;
	this.getFragment().setOnClickListener(function() {
		self.getFragment().requireControl();
	});
	this.getFragment().setOnBackClickListener(function() {
		self.hide();
	});
	this.getFragment().setOnScaleChangeListener(function() {
		switch (self.getFragment().getScaleType()) {
			case $.ImageView.ScaleType.CENTER:
				return $.ImageView.ScaleType.CENTER_CROP;
			case $.ImageView.ScaleType.CENTER_CROP:
				return $.ImageView.ScaleType.FIT_CENTER;
			case $.ImageView.ScaleType.FIT_CENTER:
				return $.ImageView.ScaleType.FIT_XY;
		}
		return $.ImageView.ScaleType.CENTER;
	});
	this.getFragment().setBackground($.Color.BLACK);
	this.setWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
	this.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);
};

ImageSourceWindow.prototype = new UniqueWindow;
ImageSourceWindow.prototype.TYPE = "ImageSourceWindow";

ImageSourceWindow.prototype.getSource = function() {
	let source = this.getFragment().getSource();
	if (source === null) return source;
	return source.getBitmap();
};

ImageSourceWindow.prototype.setSource = function(src) {
	let fragment = this.getFragment();
	fragment.setSource(src);
};

const openImageFile = function(file) {
	let source = new ImageSourceWindow();
	source.setSource(file);
	return source.show();
};

Translation.addTranslation("Do you really want to delete %s?", {
	ru: "Вы действительно хотите удалить %s?"
});

const attachAdvancedExplorer = function(path, mayWrap, action) {
	handle(function() {
		let explorer = new ExplorerWindow(mayWrap);
		explorer.setMultipleSelectable(true);
		let bar = explorer.addPath(function() {
			approve.checkIfCanBeApproved();
		});
		bar.setOnOutsideListener(function(bar) {
			explorer.dismiss();
		});
		let approve = explorer.addApprove("controlEdit", function(approve, files) {
			confirm(translate("Warning!"), translate("Do you really want to delete %s?",
				translateCounter(files.length, "nothing", "%s1 file", "%s" + (files.length % 10) + " files", "%s files")),
				function() {
					for (let i = 0; i < files.length; i++) {
						Files.deleteRecursive(files[i].getPath(), true);
					}
					bar.setPath(explorer.getDirectory());
				});
		});
		explorer.setOnSelectListener(function(popup, file) {
			let result = tryout(function() {
				return Boolean(action && action(explorer, file));
			}, false);
			if (result !== false) return;
			let extension = Files.getExtensionType(file);
			openSupportedFileIfMay(file, extension);
		});
		bar.setPath(path !== undefined ? path : __dir__);
		explorer.show();
	});
};

SHARE("attachAdvancedExplorer", attachAdvancedExplorer);

Translation.addTranslation("Archive", {
	ru: "Архив"
});
Translation.addTranslation("JSON", {});
Translation.addTranslation("Text", {
	ru: "Текст"
});
Translation.addTranslation("Order", {
	ru: "Список"
});
Translation.addTranslation("Script", {
	ru: "Скрипт"
});
Translation.addTranslation("Project", {
	ru: "Проект"
});
Translation.addTranslation("Font", {
	ru: "Шрифт"
});
Translation.addTranslation("Image", {
	ru: "Изображение"
});
Translation.addTranslation("Video", {
	ru: "Видео"
});
Translation.addTranslation("Audio", {
	ru: "Аудио"
});

const openSupportedFileIfMay = function(file, extension) {
	switch (extension) {
		case Files.ExtensionType.ARCHIVE:
			confirm(translate("Warning!"), null, function() {
				let name = Files.getNameWithoutExtension(file.getName());
				if (name == file.getName()) name += " unpacked";
				let output = new java.io.File(file.getParent(), name);
				if (output.exists()) {
					MCSystem.throwException("ModdingTools: output file is already exists");
				}
				handleThread(function() {
					tryout(function() {
						Archives.unpack(file, output.getPath());
					}, function(e) {
						if (e.message == "java.io.util.ZipFile: Not a zip archive") {
							return;
						}
						throw e;
					});
				});
			});
			break;
		case Files.ExtensionType.JSON:
		case Files.ExtensionType.TEXT:
		case Files.ExtensionType.ORDER:
		case Files.ExtensionType.SCRIPT:
			break;
		case Files.ExtensionType.PROJECT:
			break;
		case Files.ExtensionType.FONT:
			break;
		case Files.ExtensionType.IMAGE:
			openImageFile(file);
			break;
		case Files.ExtensionType.VIDEO:
			break;
		case Files.ExtensionType.AUDIO:
			break;
		default:
			let items = [],
				extensions = [];
			for (let key in Files.ExtensionType) {
				let extension = Files.ExtensionType[key];
				if (extension == "folder" || extension == "unknown" || extension == "none") continue;
				items.push(extension.charAt(0).toUpperCase() + extension.substring(1));
				extensions.push(extension);
			}
			items = items.map(function(extension) {
				if (extension == "Json") {
					extension = "JSON";
				}
				return translate(extension);
			});
			select(null, items, function(i) {
				openSupportedFileIfMay(file, extensions[i]);
			});
			break;
	}
};

SHARE("openSupportedFileIfMay", openSupportedFileIfMay);
