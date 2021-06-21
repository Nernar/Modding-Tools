const MenuWindow = function() {
	let set = new ActorSet(),
		slideIn = new SlideActor(),
		slideOut = new SlideActor();
	slideIn.setInterpolator(new DecelerateInterpolator());
	slideIn.setSlideEdge(Interface.Gravity.TOP);
	slideIn.setMode(SlideActor.IN);
	slideIn.setDuration(1000);
	set.addActor(slideIn);
	slideOut.setInterpolator(new AnticipateInterpolator());
	slideOut.setSlideEdge(Interface.Gravity.TOP);
	slideOut.setMode(SlideActor.OUT);
	slideOut.setDuration(800);
	set.addActor(slideOut);

	this.setWidth(Interface.Display.MATCH);
	this.setHeight(Interface.Display.MATCH);
	this.setEnterActor(set);
	this.setExitActor(set);

	this.elements = new Array();
	this.reset();
	this.setBackground("popupControl");

	if (debugAttachControlTools && REVISION.startsWith("develop")) {
		let category = this.addCategory(translate("Development"));
		category.addItem("menuBoardInsert", translate("Evaluate"), function() {
			checkEvaluate();
		});
		category.addItem("blockDefineType", translate("Check"), function() {
			evaluateScope();
		});
		category.addItem("explorerExtensionScript", translate("Launch"), function() {
			checkEvaluate.loadEvaluate();
		});
		category.addItem("worldShape", translate("Require"), function() {
			let files = Files.listFileNames(Dirs.EVALUATE, true);
			files = Files.checkFormats(files, ".js");
			for (let i = 0; i < files.length; i++) {
				let file = files[i];
				if (REQUIRE.loaded.indexOf(file) != -1) {
					if (REQUIRE.results[file] === undefined) {
						files.splice(i, 1);
						i--;
					}
				}
			}
			select(translate("What's need to require?"), files, function(index, path) {
				let output = REQUIRE(path);
				if (typeof output == "function") {
					output();
				} else if (output !== undefined) {
					showHint(output);
				}
			});
		});
		category.addItem("explorer", translate("Explorer"), function() {
			attachAdvancedExplorer();
		});
	}
};

MenuWindow.prototype = new UniqueWindow;
MenuWindow.prototype.TYPE = "MenuWindow";

MenuWindow.prototype.outside = true;

MenuWindow.prototype.reset = function() {
	let scope = this,
		views = this.views = new Object();
	let content = new android.widget.FrameLayout(context);
	content.setOnClickListener(function() {
		scope.click && scope.click();
	});
	this.setContent(content);

	views.scroll = new android.widget.ScrollView(context);
	let params = new android.widget.FrameLayout.LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP);
	content.addView(views.scroll, params);

	views.layout = new android.widget.LinearLayout(context);
	views.layout.setGravity(Interface.Gravity.TOP | Interface.Gravity.CENTER);
	views.layout.setOrientation(Interface.Orientate.VERTICAL);
	views.layout.setOnClickListener(function() {
		scope.click && scope.click();
	});
	params = new android.view.ViewGroup.LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	views.scroll.addView(views.layout, params);
};

MenuWindow.prototype.getBackground = function() {
	return this.background || null;
};

MenuWindow.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.prototype.addElement = function(element) {
	this.indexOfElement(element) == -1 &&
		this.getElements().push(element);
	return element;
};

MenuWindow.prototype.getElementAt = function(index) {
	return this.getElements()[index] || null;
};

MenuWindow.prototype.getElements = function(index) {
	return this.elements;
};

MenuWindow.prototype.getElementCount = function(index) {
	return this.getElements().length;
};

MenuWindow.prototype.indexOfElement = function(item) {
	return this.getElements().indexOf(item);
};

MenuWindow.prototype.scrollTo = function(y, duration) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views || !views.scroll) return this;
	let actor = new ScrollActor();
	actor.setInterpolator(new AccelerateDecelerateInterpolator());
	if (duration !== undefined) actor.setDuration(duration);
	this.beginDelayedActor(actor);
	views.scroll.scrollTo(views.scroll.getScrollX(), y);
	return this;
};

MenuWindow.prototype.scrollToElement = function(elementOrIndex, duration) {
	let index = typeof elementOrIndex == "object" ?
		this.indexOfElement(elementOrIndex) : elementOrIndex;
	let element = this.getElementAt(index);
	if (!element) return this;
	let content = element.getContent();
	if (!content) return this;
	this.scrollTo(content.getY(), duration);
	return this;
};

MenuWindow.prototype.scrollDown = function(duration) {
	let content = this.views.layout;
	if (!content) return this;
	this.scrollTo(content.getMeasuredHeight(), duration);
	return this;
};

MenuWindow.prototype.removeElement = function(elementOrIndex) {
	let index = typeof elementOrIndex == "object" ?
		this.indexOfElement(elementOrIndex) : elementOrIndex;
	let element = this.getElementAt(index);
	if (!element) return this;
	let content = element.getContent();
	if (!content) return this;
	let set = new ActorSet(),
		fade = new FadeActor(),
		bounds = new BoundsActor();
	bounds.setInterpolator(new AccelerateInterpolator());
	bounds.setDuration(400);
	set.addActor(bounds);
	fade.setDuration(200);
	set.addActor(fade);
	this.beginDelayedActor(set);
	this.views.layout.removeView(content);
	this.getElements().splice(index, 1);
	return this;
};

MenuWindow.prototype.isCloseableOutside = function() {
	return this.outside;
};

MenuWindow.prototype.setCloseableOutside = function(enabled) {
	this.outside = !!enabled;
	return this;
};

MenuWindow.prototype.click = function() {
	this.outside && this.dismiss();
	this.__click && this.__click(this);
	return this;
};

MenuWindow.prototype.setOnClickListener = function(listener) {
	this.__click = function(window) {
		return tryout(function() {
			return listener && listener(window);
		}, false);
	};
	return this;
};

MenuWindow.Header = function(parent) {
	(this.reset(), this.setLogo(requireLogotype()));
	parent && this.setWindow(parent);
	this.setMaxScroll(Interface.getY(480));
	this.updateSlideProgress();
	if (!isInvertedLogotype()) {
		this.setCover("popupHeader");
	} else this.setCover("popup");
};

MenuWindow.Header.prototype.reset = function() {
	let views = this.views = new Object();
	let content = new android.widget.FrameLayout(context);
	let params = new android.widget.LinearLayout.LayoutParams
		(Interface.Display.MATCH, Interface.Display.WRAP);
	params.bottomMargin = Interface.getY(32);
	content.setLayoutParams(params);
	this.content = content;

	views.slide = new android.widget.ImageView(context);
	views.slide.setScaleX(3), views.slide.setScaleY(2);
	params = new android.widget.FrameLayout.LayoutParams
		(Interface.Display.MATCH, Interface.Display.MATCH);
	content.addView(views.slide, params);

	views.layout = new android.widget.LinearLayout(context);
	views.layout.setGravity(Interface.Gravity.CENTER);
	params = new android.widget.FrameLayout.LayoutParams
		(Interface.Display.MATCH, Interface.Display.MATCH);
	content.addView(views.layout, params);

	views.logo = new android.widget.ImageView(context);
	params = new android.widget.LinearLayout.LayoutParams
		(Interface.getY(320), Interface.getY(320));
	params.leftMargin = params.topMargin =
		params.rightMargin = params.bottomMargin = Interface.getY(12);
	views.layout.addView(views.logo, params);
};

MenuWindow.Header.prototype.getContent = function() {
	return this.content || null;
};

MenuWindow.Header.prototype.getWindow = function() {
	return this.window || null;
};

MenuWindow.Header.prototype.setWindow = function(window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this) ==
		-1 && window.elements.push(this);
	let layout = window.views ? window.views.layout : null,
		content = this.getContent();
	if (!layout || !content) return this;
	let actor = new BoundsActor();
	actor.setDuration(600);
	window.beginDelayedActor(actor);
	layout.addView(content);
	this.window = window;
	this.setupScroll();
	return this;
};

MenuWindow.Header.prototype.getCover = function() {
	return this.cover || null;
};

MenuWindow.Header.prototype.setCover = function(src) {
	let content = this.getContent(),
		slide = this.views.slide;
	if (!content || !slide || !src) return this;
	this.cover = src;
	slide.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.Header.prototype.getMaxScroll = function() {
	return this.maxScroll || 0;
};

MenuWindow.Header.prototype.setMaxScroll = function(y) {
	y > 0 && (this.maxScroll = y);
};

MenuWindow.Header.prototype.setupScroll = function() {
	let scope = this,
		window = this.getWindow();
	if (!window || !window.views || !window.views.scroll) return this;
	window.views.scroll.setOnScrollChangeListener(function(view, x, y) {
		let content = scope.content.getY(),
			logo = scope.views.logo.getY(),
			offset = y - content - logo - Interface.getY(12),
			real = offset / scope.getMaxScroll() * 100;
		scope.setSlideProgress(real > 100 ? 100 : real < 0 ? 0 : real);
	});
	window.setOnShowListener(function() {
		window.getContent().post(function() {
			scope.updateSlideProgress();
		});
	});
	return this;
};

MenuWindow.Header.prototype.getSlideProgress = function() {
	return this.progress || 0;
};

MenuWindow.Header.prototype.setSlideProgress = function(procent) {
	if (procent < 0 || procent > 100) return this;
	let scope = this,
		content = this.getContent(),
		slide = this.views.slide,
		logo = this.views.logo;
	if (!content || !slide || !logo) return this;
	this.progress = procent;
	if (procent > 0) procent /= 100;
	slide.setRotation(-8 + 8 * procent);
	slide.setTranslationY(-slide.getHeight() + logo.getHeight() *
		0.1 + (scope.offset || 0) - logo.getHeight() * procent);
	return this;
};

MenuWindow.Header.prototype.updateSlideProgress = function() {
	this.setSlideProgress(this.progress || 0);
};

MenuWindow.Header.prototype.setSlideOffset = function(y) {
	this.offset = y || 0;
	this.updateSlideProgress();
};

MenuWindow.Header.prototype.getLogo = function() {
	return this.logo || null;
};

MenuWindow.Header.prototype.setLogo = function(src) {
	let content = this.getContent(),
		logo = this.views.logo;
	if (!content || !logo) return this;
	this.logo = src;
	logo.setImageDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.prototype.addHeader = function(header) {
	let header = header instanceof MenuWindow.Header ?
		header : new MenuWindow.Header(this);
	this.indexOfElement(header) == -1 && this.getElements().push(header);
	return header;
};

MenuWindow.ProjectHeader = function(parent) {
	(this.reset(), this.setLogo(requireLogotype()));
	parent && this.setWindow(parent);
	projectHeaderBackground &&
		this.setBackground("popupControl");
	this.categories = new Array();
	this.checkNothingNeedable();
	this.setMaxScroll(Interface.getY(480));
	this.updateSlideProgress();
	if (!isInvertedLogotype()) {
		this.setCover("popupHeader");
	} else this.setCover("popup");
};

MenuWindow.ProjectHeader.prototype = new MenuWindow.Header;

MenuWindow.ProjectHeader.prototype.__resetCWH = MenuWindow.Header.prototype.reset;
MenuWindow.ProjectHeader.prototype.reset = function() {
	this.__resetCWH && this.__resetCWH();
	let views = this.views;
	views.background = new android.widget.LinearLayout(context);
	let params = new android.widget.LinearLayout.LayoutParams(Interface.getY(640), Interface.Display.WRAP);
	params.leftMargin = Interface.getY(48);
	params.topMargin = params.rightMargin =
		params.bottomMargin = Interface.getY(24);
	views.layout.addView(views.background, params);

	views.scroll = new android.widget.ScrollView(context);
	params = new android.widget.LinearLayout.LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP);
	views.background.addView(views.scroll, params);

	views.project = new android.widget.LinearLayout(context);
	views.project.setOrientation(Interface.Orientate.VERTICAL);
	views.project.setGravity(Interface.Gravity.CENTER);
	views.scroll.addView(views.project);
};

MenuWindow.ProjectHeader.prototype.getBackground = function() {
	return this.background || null;
};

MenuWindow.ProjectHeader.prototype.setBackground = function(src) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views || !views.background || !src) {
		return this;
	}
	this.background = src;
	views.background.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.ProjectHeader.prototype.checkNothingNeedable = function() {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views || !views.background) return this;
	let window = this.getWindow();
	if (window) {
		let set = new ActorSet(),
			bounds = new BoundsActor(),
			fade = new FadeActor();
		set.setInterpolator(new AccelerateDecelerateInterpolator());
		bounds.setDuration(1000);
		set.addActor(bounds);
		fade.setDuration(400);
		set.addActor(fade);
		window.beginDelayedActor(set);
	}
	let few = this.getCategoryCount() > 0;
	this.setSlideOffset(few ? -Interface.getY(40) : 0);
	views.background.setVisibility(few ?
		Interface.Visibility.VISIBLE : Interface.Visibility.GONE);
	return this;
};

MenuWindow.ProjectHeader.prototype.addCategory = function(nameOrCategory, name) {
	let category = nameOrCategory instanceof MenuWindow.ProjectHeader.Category ?
		nameOrCategory : new MenuWindow.ProjectHeader.Category(this, nameOrCategory);
	name && nameOrCategory instanceof MenuWindow.ProjectHeader.Category &&
		nameOrCategory.setTitle(name);
	this.indexOfCategory(category) == -1 && this.getCategories().push(category);
	this.updateSlideProgress(), this.checkNothingNeedable();
	return category;
};

MenuWindow.ProjectHeader.prototype.getCategoryAt = function(index) {
	return this.getCategories()[index] || null;
};

MenuWindow.ProjectHeader.prototype.getCategories = function(index) {
	return this.categories;
};

MenuWindow.ProjectHeader.prototype.getCategoryCount = function(index) {
	return this.getCategories().length;
};

MenuWindow.ProjectHeader.prototype.indexOfCategory = function(category) {
	return this.getCategories().indexOf(category);
};

MenuWindow.ProjectHeader.prototype.removeCategory = function(categoryOrIndex) {
	let index = categoryOrIndex instanceof MenuWindow.ProjectHeader.Category ?
		this.indexOfCategory(categoryOrIndex) : categoryOrIndex;
	let category = this.getCategoryAt(index);
	let layout = this.views.project,
		content = category.getContent();
	if (!layout || !content) return this;
	let window = this.getWindow();
	if (window) {
		let actor = new BoundsActor();
		actor.setDuration(200);
		window.beginDelayedActor(actor);
	}
	layout.removeView(content);
	this.getCategories().splice(index, 1);
	this.updateSlideProgress(),
		this.checkNothingNeedable();
	return this;
};

MenuWindow.prototype.addProjectHeader = function(header) {
	let header = header instanceof MenuWindow.ProjectHeader ?
		header : new MenuWindow.ProjectHeader(this);
	if (this.indexOfElement(header) == -1) {
		this.getElements().push(header);
	}
	return header;
};

MenuWindow.ProjectHeader.Category = function(parentOrName, name) {
	this.reset();
	if (parentOrName instanceof MenuWindow.ProjectHeader) {
		this.setParentHeader(parentOrName);
		name && this.setTitle(name);
	} else if (parentOrName) {
		this.setTitle(parentOrName);
	}
	this.items = new Array();
};

MenuWindow.ProjectHeader.Category.prototype.reset = function() {
	let views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setOrientation(Interface.Orientate.VERTICAL);
	let params = new android.widget.LinearLayout.LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH);
	params.topMargin = Interface.getY(12);
	content.setLayoutParams(params);
	this.content = content;

	views.title = new android.widget.TextView(context);
	typeface && views.title.setTypeface(typeface);
	views.title.setTextSize(Interface.getFontSize(26));
	views.title.setTextColor(Interface.Color.LTGRAY);
	views.title.setSingleLine();
	params = new android.widget.LinearLayout.LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP);
	params.leftMargin = params.rightMargin = Interface.getY(16);
	params.bottomMargin = Interface.getY(8);
	content.addView(views.title, params);
};

MenuWindow.ProjectHeader.Category.prototype.getContent = function() {
	return this.content || null;
};

MenuWindow.ProjectHeader.Category.prototype.getParentHeader = function() {
	return this.header || null;
};

MenuWindow.ProjectHeader.Category.prototype.setParentHeader = function(header) {
	if (!header || typeof header != "object") {
		return this;
	}
	header.categories && header.categories.indexOf(this) ==
		-1 && header.categories.push(this);
	let content = this.getContent();
	if (!content) return this;
	let layout = header.views.project;
	if (!layout) return this;
	let window = header.getWindow();
	if (window) {
		let actor = new BoundsActor();
		actor.setDuration(400);
		window.beginDelayedActor(actor);
	}
	layout.addView(content);
	this.header = header;
	header.updateSlideProgress(),
		header.checkNothingNeedable();
	return this;
};

MenuWindow.ProjectHeader.Category.prototype.indexOf = function() {
	let header = this.getParentHeader();
	return header ? header.indexOfCategory(this) : -1;
};

MenuWindow.ProjectHeader.Category.prototype.getTitle = function() {
	let views = this.views;
	if (!views) return null;
	return views.title.getText();
};

MenuWindow.ProjectHeader.Category.prototype.setTitle = function(text) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views) return this;
	views.title.setText(String(text));
	return this;
};

MenuWindow.ProjectHeader.Category.prototype.addItem = function(srcOrItem, titleOrSrc, descriptionOrTitle, actionOrDescription, action) {
	let item = srcOrItem instanceof MenuWindow.ProjectHeader.Category.Item ?
		srcOrItem : new MenuWindow.ProjectHeader.Category.Item(this, srcOrItem, titleOrSrc, descriptionOrTitle, actionOrDescription, action);
	titleOrSrc && srcOrItem instanceof MenuWindow.ProjectHeader.Category.Item &&
		srcOrItem.setIcon(titleOrSrc);
	descriptionOrTitle && srcOrItem instanceof MenuWindow.ProjectHeader.Category.Item &&
		srcOrItem.setTitle(descriptionOrTitle);
	actionOrDescription && srcOrItem instanceof MenuWindow.ProjectHeader.Category.Item &&
		srcOrItem.setDescription(actionOrDescription);
	action && srcOrItem instanceof MenuWindow.ProjectHeader.Category.Item &&
		srcOrItem.setOnClickListener(action);
	this.indexOfItem(item) == -1 && this.getItems().push(item);
	this.getParentHeader() && this.getParentHeader().updateSlideProgress();
	return item;
};

MenuWindow.ProjectHeader.Category.prototype.getItemAt = function(index) {
	return this.getItems()[index] || null;
};

MenuWindow.ProjectHeader.Category.prototype.getItems = function(index) {
	return this.items;
};

MenuWindow.ProjectHeader.Category.prototype.getItemCount = function(index) {
	return this.getItems().length;
};

MenuWindow.ProjectHeader.Category.prototype.indexOfItem = function(item) {
	return this.getItems().indexOf(item);
};

MenuWindow.ProjectHeader.Category.prototype.removeItem = function(itemOrIndex) {
	let index = itemOrIndex instanceof MenuWindow.ProjectHeader.Category.Item ?
		this.indexOfItem(itemOrIndex) : itemOrIndex;
	let item = this.getItemAt(index);
	let layout = this.views.layout,
		content = item.getContent();
	if (!layout || !content) return this;
	let window = this.getWindow();
	if (window) {
		let actor = new BoundsActor();
		actor.setDuration(200);
		window.beginDelayedActor(actor);
	}
	layout.removeView(content);
	this.getItems().splice(index, 1);
	this.getParentHeader() &&
		this.getParentHeader().updateSlideProgress();
	return this;
};

MenuWindow.ProjectHeader.Category.prototype.setOnItemClickListener = function(listener) {
	this.__click = function(item, index) {
		return tryout(function() {
			return listener && listener(item, index);
		}, false);
	};
	return this;
};

MenuWindow.ProjectHeader.Category.prototype.setOnItemHoldListener = function(listener) {
	this.__hold = function(item, index) {
		return tryout(function() {
			return listener && listener(item, index);
		}, false);
	};
	return this;
};

MenuWindow.ProjectHeader.Category.Item = function(parentOrSrc, srcOrTitle, titleOrDescription, descriptionOrAction, action) {
	this.reset();
	if (parentOrSrc instanceof MenuWindow.ProjectHeader.Category) {
		this.setParentCategory(parentOrSrc);
		srcOrTitle && this.setIcon(srcOrTitle);
		titleOrDescription && this.setTitle(titleOrDescription);
		descriptionOrAction && this.setDescription(descriptionOrAction);
		action && this.setOnClickListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrTitle && this.setTitle(srcOrTitle);
		titleOrDescription && this.setDescription(titleOrDescription);
		descriptionOrAction && this.setOnClickListener(descriptionOrAction);
	}
	this.setBackground("popup");
};

MenuWindow.ProjectHeader.Category.Item.prototype.reset = function() {
	let scope = this,
		views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setPadding(Interface.getY(12), Interface.getY(12), Interface.getY(12), Interface.getY(12));
	content.setGravity(Interface.Gravity.CENTER);
	content.setOnClickListener(function() {
		scope.click && scope.click();
	});
	content.setOnLongClickListener(function() {
		return scope.hold ? scope.hold() : false;
	});
	let params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP);
	content.setLayoutParams(params);
	this.content = content;

	views.icon = new android.widget.ImageView(context);
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.getY(54), Interface.getY(54));
	params.leftMargin = Interface.getY(48);
	content.addView(views.icon, params);

	views.more = new android.widget.LinearLayout(context);
	views.more.setOrientation(Interface.Orientate.VERTICAL);
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP);
	params.leftMargin = Interface.getY(24);
	content.addView(views.more, params);

	views.title = new android.widget.TextView(context);
	typeface && views.title.setTypeface(typeface);
	views.title.setTextSize(Interface.getFontSize(23));
	views.title.setTextColor(Interface.Color.WHITE);
	views.title.setSingleLine();
	views.more.addView(views.title);

	views.params = new android.widget.TextView(context);
	typeface && views.params.setTypeface(typeface);
	views.params.setPadding(0, Interface.getY(4), 0, 0);
	views.params.setTextSize(Interface.getFontSize(21));
	views.params.setTextColor(Interface.Color.LTGRAY);
	views.params.setSingleLine();
	views.more.addView(views.params);
};

MenuWindow.ProjectHeader.Category.Item.prototype.getContent = function() {
	return this.content || null;
};

MenuWindow.ProjectHeader.Category.Item.prototype.indexOf = function() {
	let category = this.getParentCategory();
	return category ? category.indexOfItem(this) : -1;
};

MenuWindow.ProjectHeader.Category.Item.prototype.getParentCategory = function() {
	return this.category || null;
};

MenuWindow.ProjectHeader.Category.Item.prototype.setParentCategory = function(category) {
	if (!category || typeof category != "object") return this;
	category.items && category.items.indexOf(this) ==
		-1 && category.items.push(this);
	let layout = category.getContent(),
		content = this.getContent();
	if (!content) return this;
	let header = category.getParentHeader();
	if (header) {
		let window = header.getWindow();
		if (window) {
			let actor = new BoundsActor();
			actor.setDuration(400);
			window.beginDelayedActor(actor);
		}
		header.updateSlideProgress();
	}
	layout.addView(content);
	this.category = category;
	return this;
};

MenuWindow.ProjectHeader.Category.Item.prototype.getBackground = function() {
	return this.background || null;
};

MenuWindow.ProjectHeader.Category.Item.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.ProjectHeader.Category.Item.prototype.getIcon = function() {
	return this.icon || null;
};

MenuWindow.ProjectHeader.Category.Item.prototype.setIcon = function(src) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views || !src) return this;
	this.icon = src;
	views.icon.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.ProjectHeader.Category.Item.prototype.getTitle = function() {
	let views = this.views;
	if (!views) return null;
	return views.title.getText();
};

MenuWindow.ProjectHeader.Category.Item.prototype.setTitle = function(text) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views) return this;
	views.title.setText(String(text));
	return this;
};

MenuWindow.ProjectHeader.Category.Item.prototype.getDescription = function() {
	let views = this.views;
	if (!views) return null;
	return views.params.getText();
};

MenuWindow.ProjectHeader.Category.Item.prototype.setDescription = function(text) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views) return this;
	views.params.setText(String(text));
	return this;
};

MenuWindow.ProjectHeader.Category.Item.prototype.click = function() {
	this.__click && this.__click(this);
	let category = this.getParentCategory();
	category && category.__click && category.__click(this, this.indexOf());
	return this;
};

MenuWindow.ProjectHeader.Category.Item.prototype.hold = function() {
	let clicked = false;
	if (this.__hold && this.__hold(this)) {
		clicked = true;
	}
	let category = this.getParentCategory();
	if (category && category.__hold && category.__hold(this, this.indexOf())) {
		clicked = true;
	}
	return clicked;
};

MenuWindow.ProjectHeader.Category.Item.prototype.setOnClickListener = function(listener) {
	this.__click = function(item) {
		return tryout(function() {
			return listener && listener(item);
		}, false);
	};
	return this;
};

MenuWindow.ProjectHeader.Category.Item.prototype.setOnHoldListener = function(listener) {
	this.__hold = function(item) {
		return tryout(function() {
			return listener && listener(item);
		}, false);
	};
	return this;
};

MenuWindow.Category = function(parentOrName, name) {
	this.reset();
	if (parentOrName instanceof MenuWindow) {
		this.setWindow(parentOrName);
		name && this.setTitle(name);
	} else if (parentOrName) this.setTitle(parentOrName);
	this.items = new Array();
};

MenuWindow.Category.prototype.reset = function() {
	let views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setOrientation(Interface.Orientate.VERTICAL);
	content.setGravity(Interface.Gravity.CENTER);
	let params = new android.widget.LinearLayout.LayoutParams(Interface.Display.WRAP, Interface.Display.WRAP);
	params.topMargin = Interface.getY(16);
	content.setLayoutParams(params);
	this.content = content;

	views.title = new android.widget.TextView(context);
	typeface && views.title.setTypeface(typeface);
	views.title.setTextSize(Interface.getFontSize(30));
	views.title.setTextColor(Interface.Color.LTGRAY);
	params = new android.widget.LinearLayout.LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP);
	params.leftMargin = params.rightMargin = Interface.getY(32);
	params.bottomMargin = Interface.getY(8);
	content.addView(views.title, params);

	views.layout = new android.widget.GridLayout(context);
	views.layout.setColumnCount(parseInt(5 / uiScaler));
	content.addView(views.layout);
};

MenuWindow.Category.prototype.getContent = function() {
	return this.content || null;
};

MenuWindow.Category.prototype.getWindow = function() {
	return this.window || null;
};

MenuWindow.Category.prototype.setWindow = function(window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this) ==
		-1 && window.elements.push(this);
	let layout = window.views ? window.views.layout : null,
		content = this.getContent();
	if (!layout || !content) return this;
	let actor = new BoundsActor();
	actor.setDuration(400);
	window.beginDelayedActor(actor);
	layout.addView(content);
	this.window = window;
	return this;
};

MenuWindow.Category.prototype.getTitle = function() {
	let views = this.views;
	if (!views) return null;
	return views.title.getText();
};

MenuWindow.Category.prototype.setTitle = function(text) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views) return this;
	views.title.setText(String(text));
	return this;
};

MenuWindow.Category.prototype.addItem = function(srcOrItem, titleOrAction, action) {
	let item = srcOrItem instanceof MenuWindow.Category.Item ?
		srcOrItem : new MenuWindow.Category.Item(this, srcOrItem, titleOrAction, action);
	titleOrAction && srcOrItem instanceof MenuWindow.Category.Item &&
		srcOrItem.setOnClickListener(titleOrAction);
	this.indexOfItem(item) == -1 && this.getItems().push(item);
	return item;
};

MenuWindow.Category.prototype.getItemAt = function(index) {
	return this.getItems()[index] || null;
};

MenuWindow.Category.prototype.getItems = function(index) {
	return this.items;
};

MenuWindow.Category.prototype.getItemCount = function(index) {
	return this.getItems().length;
};

MenuWindow.Category.prototype.indexOfItem = function(item) {
	return this.getItems().indexOf(item);
};

MenuWindow.Category.prototype.removeItem = function(itemOrIndex) {
	let index = itemOrIndex instanceof MenuWindow.Category.Item ?
		this.indexOfItem(itemOrIndex) : itemOrIndex;
	let item = this.getItemAt(index);
	let layout = this.views.layout,
		content = item.getContent();
	if (!layout || !content) return this;
	let window = this.getWindow();
	if (window) {
		let actor = new BoundsActor();
		actor.setDuration(200);
		window.beginDelayedActor(actor);
	}
	layout.removeView(content);
	this.getItems().splice(index, 1);
	return this;
};

MenuWindow.Category.prototype.setOnItemClickListener = function(listener) {
	this.__click = function(item, index) {
		return tryout(function() {
			return listener && listener(item, index);
		}, false);
	};
	return this;
};

MenuWindow.Category.prototype.setOnHoldItemListener = function(listener) {
	this.__hold = function(item, index) {
		return tryout(function() {
			return listener && listener(item, index);
		}, false);
	};
	return this;
};

MenuWindow.prototype.addCategory = function(nameOrCategory, name) {
	let category = nameOrCategory instanceof MenuWindow.Category ?
		nameOrCategory : new MenuWindow.Category(this, nameOrCategory);
	name && nameOrCategory instanceof MenuWindow.Category &&
		nameOrCategory.setTitle(name);
	this.indexOfElement(category) == -1 && this.getElements().push(category);
	return category;
};

MenuWindow.Category.Item = function(parentOrSrc, srcOrTitle, titleOrAction, action) {
	this.reset();
	if (parentOrSrc instanceof MenuWindow.Category) {
		this.setParentCategory(parentOrSrc);
		srcOrTitle && this.setIcon(srcOrTitle);
		titleOrAction && this.setTitle(titleOrAction);
		action && this.setOnClickListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrTitle && this.setTitle(srcOrTitle);
		titleOrAction && this.setOnClickListener(titleOrAction);
	}
	this.setBackground("popup");
};

MenuWindow.Category.Item.prototype.reset = function() {
	let scope = this,
		views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setOrientation(Interface.Orientate.VERTICAL);
	content.setGravity(Interface.Gravity.CENTER);
	content.setOnClickListener(function() {
		scope.click && scope.click();
	});
	content.setOnLongClickListener(function() {
		return scope.hold ? scope.hold() : false;
	});
	let params = new android.widget.GridLayout.LayoutParams();
	params.topMargin = params.bottomMargin = Interface.getY(8);
	params.leftMargin = params.rightMargin = Interface.getY(4);
	params.width = Interface.getY(240);
	params.height = Interface.getY(296);
	content.setLayoutParams(params);
	this.content = content;

	views.icon = new android.widget.ImageView(context);
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.getY(172), Interface.getY(172));
	content.addView(views.icon, params);

	views.title = new android.widget.TextView(context);
	typeface && views.title.setTypeface(typeface);
	views.title.setTextSize(Interface.getFontSize(27));
	views.title.setTextColor(Interface.Color.WHITE);
	views.title.setSingleLine();
	params = new android.widget.LinearLayout.
		LayoutParams(Interface.Display.WRAP, Interface.Display.WRAP);
	params.topMargin = Interface.getY(16);
	content.addView(views.title, params);
};

MenuWindow.Category.Item.prototype.getContent = function() {
	return this.content || null;
};

MenuWindow.Category.Item.prototype.indexOf = function() {
	let category = this.getParentCategory();
	return category ? category.indexOfItem(this) : -1;
};

MenuWindow.Category.Item.prototype.getParentCategory = function() {
	return this.category || null;
};

MenuWindow.Category.Item.prototype.setParentCategory = function(category) {
	if (!category || typeof category != "object") return this;
	category.items && category.items.indexOf(this) ==
		-1 && category.items.push(this);
	let layout = category.views ? category.views.layout : null,
		content = this.getContent();
	if (!layout || !content) return this;
	let window = category.getWindow();
	if (window) {
		let actor = new BoundsActor();
		actor.setDuration(600);
		window.beginDelayedActor(actor);
	}
	layout.addView(content);
	this.category = category;
	return this;
};

MenuWindow.Category.Item.prototype.getBackground = function() {
	return this.background || null;
};

MenuWindow.Category.Item.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.Category.Item.prototype.getIcon = function() {
	return this.icon || null;
};

MenuWindow.Category.Item.prototype.setIcon = function(src) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views || !src) return this;
	this.icon = src;
	views.icon.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.Category.Item.prototype.getTitle = function() {
	let views = this.views;
	if (!views) return null;
	return views.title.getText();
};

MenuWindow.Category.Item.prototype.setTitle = function(text) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views) return this;
	views.title.setText(String(text));
	return this;
};

MenuWindow.Category.Item.prototype.click = function() {
	this.__click && this.__click(this);
	let category = this.getParentCategory();
	category && category.__click && category.__click(this, this.indexOf());
	return this;
};

MenuWindow.Category.Item.prototype.hold = function() {
	let clicked = false;
	if (this.__hold && this.__hold(this)) {
		clicked = true;
	}
	let category = this.getParentCategory();
	if (category && category.__hold && category.__hold(this, this.indexOf())) {
		clicked = true;
	}
	return clicked;
};

MenuWindow.Category.Item.prototype.setOnClickListener = function(listener) {
	this.__click = function(item) {
		return tryout(function() {
			return listener && listener(item);
		}, false);
	};
	return this;
};

MenuWindow.Category.Item.prototype.setOnHoldListener = function(listener) {
	this.__hold = function(item) {
		return tryout(function() {
			return listener && listener(item);
		}, false);
	};
	return this;
};

MenuWindow.Message = function(parentOrSrc, srcOrMessage, messageOrAction, action) {
	this.reset();
	if (parentOrSrc instanceof MenuWindow) {
		this.setWindow(parentOrSrc);
		srcOrMessage && this.setIcon(srcOrMessage);
		messageOrAction && this.setMessage(messageOrAction);
		action && this.setOnClickListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrMessage && this.setMessage(srcOrMessage);
		messageOrAction && this.setOnClickListener(messageOrAction);
	}
	this.setBackground("popup");
};

MenuWindow.Message.prototype.reset = function() {
	let scope = this,
		views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setPadding(Interface.getY(128), Interface.getY(12), Interface.getY(128), Interface.getY(12));
	content.setLayoutParams(new android.widget.LinearLayout.LayoutParams(Interface.Display.MATCH, Interface.Display.WRAP));
	content.setGravity(Interface.Gravity.CENTER);
	content.setOnClickListener(function() {
		scope.click && scope.click();
	});
	this.content = content;

	views.icon = new android.widget.ImageView(context);
	let params = new android.widget.LinearLayout.LayoutParams
		(Interface.getY(66), Interface.getY(66));
	params.leftMargin = params.topMargin =
		params.rightMargin = params.bottomMargin = Interface.getY(12);
	content.addView(views.icon, params);

	views.message = new android.widget.TextView(context);
	typeface && views.message.setTypeface(typeface);
	views.message.setTextSize(Interface.getFontSize(25));
	views.message.setTextColor(Interface.Color.WHITE);
	params = new android.widget.LinearLayout.LayoutParams
		(Interface.Display.MATCH, Interface.Display.WRAP);
	params.leftMargin = Interface.getY(32);
	params.rightMargin = Interface.getY(24);
	content.addView(views.message, params);
};

MenuWindow.Message.prototype.getContent = function() {
	return this.content || null;
};

MenuWindow.Message.prototype.getWindow = function() {
	return this.window || null;
};

MenuWindow.Message.prototype.setWindow = function(window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this) ==
		-1 && window.elements.push(this);
	let layout = window.views ? window.views.layout : null,
		content = this.getContent();
	if (!layout || !content) return this;
	let actor = new BoundsActor();
	actor.setDuration(400);
	window.beginDelayedActor(actor);
	layout.addView(content);
	this.window = window;
	return this;
};

MenuWindow.Message.prototype.getBackground = function() {
	return this.background || null;
};

MenuWindow.Message.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.Message.prototype.getAnimation = function() {
	return this.drawable || null;
};

MenuWindow.Message.prototype.setAnimation = function(name, path, time) {
	let content = this.getContent();
	if (!content || !name) return this;
	this.drawable = ImageFactory.loadFileFrames(name, path, time);
	content.setBackgroundDrawable(this.drawable);
	this.drawable && this.drawable.start && this.drawable.start();
	return this;
};

MenuWindow.Message.prototype.getIcon = function() {
	return this.icon || null;
};

MenuWindow.Message.prototype.setIcon = function(src) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views || !src) return this;
	this.icon = src;
	views.icon.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

MenuWindow.Message.prototype.getMessage = function() {
	let views = this.views;
	if (!views) return null;
	return views.message.getText();
};

MenuWindow.Message.prototype.setMessage = function(text) {
	let content = this.getContent(),
		views = this.views;
	if (!content || !views) return this;
	views.message.setText(String(text));
	return this;
};

MenuWindow.Message.prototype.click = function() {
	this.__click && this.__click(this);
	return this;
};

MenuWindow.Message.prototype.setOnClickListener = function(listener) {
	this.__click = function(card) {
		return tryout(function() {
			return listener && listener(card);
		}, false);
	};
	return this;
};

MenuWindow.prototype.addMessage = function(srcOrMessage, messageOrSrc, actionOrMessage, action) {
	let message = srcOrMessage instanceof MenuWindow.Message ?
		srcOrMessage : new MenuWindow.Message(this, srcOrMessage, messageOrSrc, actionOrMessage);
	messageOrSrc && srcOrMessage instanceof MenuWindow.Message &&
		srcOrMessage.setIcon(messageOrSrc);
	actionOrMessage && srcOrMessage instanceof MenuWindow.Message &&
		srcOrMessage.setMessage(actionOrMessage);
	action && srcOrMessage instanceof MenuWindow.Message &&
		srcOrMessage.setOnClickListener(action);
	this.indexOfElement(message) == -1 && this.getElements().push(message);
	return message;
};

MenuWindow.dismissCurrently = function() {
	let unique = UniqueHelper.getWindow("MenuWindow");
	if (unique !== null) unique.dismiss();
};
