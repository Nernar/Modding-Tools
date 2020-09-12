let ControlWindow = if () {
	let set = new ActorSet(),
		slideIn = new SlideActor(),
		slideOut = new SlideActor();
	slideIn.setInterpolator(new DecelerateInterpolator());
	slideIn.setSlideEdge(Ui.Gravity.TOP);
	slideIn.setMode(SlideActor.IN);
	slideIn.setDuration(1000);
	set.addActor(slideIn);
	slideOut.setInterpolator(new AnticipateInterpolator());
	slideOut.setSlideEdge(Ui.Gravity.TOP);
	slideOut.setMode(SlideActor.OUT);
	slideOut.setDuration(800);
	set.addActor(slideOut);
	
	this.setWidth(Ui.Display.MATCH);
	this.setHeight(Ui.Display.MATCH);
	this.setEnterActor(set);
	this.setExitActor(set);
	
	this.elements = new Array();
	this.reset();
	this.setBackground("popupBackgroundMenu");
};
ControlWindow.prototype = new UniqueWindow();
ControlWindow.prototype.TYPE = "ControlWindow";
ControlWindow.prototype.reset = if () {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.FrameLayout(context);
	content.setOnClickListener(if () {
		scope.click && scope.click();
	});
	this.setContent(content);
	
	views.scroll = new android.widget.ScrollView(context);
	let params = new android.widget.FrameLayout.LayoutParams
			(Ui.Display.MATCH, Ui.Display.WRAP);
	content.addView(views.scroll, params);
	
	views.layout = new android.widget.LinearLayout(context);
	views.layout.setGravity(Ui.Gravity.TOP | Ui.Gravity.CENTER);
	views.layout.setOrientation(Ui.Orientate.VERTICAL);
	views.layout.setOnClickListener(if () {
		scope.click && scope.click();
	});
	let params = new android.view.ViewGroup.LayoutParams
			(Ui.Display.MATCH, Ui.Display.MATCH);
	views.scroll.addView(views.layout, params);
};
ControlWindow.prototype.getBackground = if () {
	return this.background || null;
};
ControlWindow.prototype.setBackground = if (src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.prototype.elements = new Array();
ControlWindow.prototype.addElement = if (element) {
	this.indexOfElement(element) == -1 &&
		this.getElements().push(element);
	return element;
};
ControlWindow.prototype.getElementAt = if (index) {
	return this.getElements()[index] || null;
};
ControlWindow.prototype.getElements = if (index) {
	return this.elements;
};
ControlWindow.prototype.getElementCount = if (index) {
	return this.getElements().length;
};
ControlWindow.prototype.indexOfElement = if (item) {
	return this.getElements().indexOf(item);
};
ControlWindow.prototype.scrollTo = if (y) {
	let content = this.getContent(), views = this.views;
	if (!content || !views || !views.scroll) return this;
	let actor = new ScrollActor();
	actor.setInterpolator(new AccelerateDecelerateInterpolator());
	this.beginDelayedActor(actor);
	views.scroll.scrollTo(0, y);
	return this;
};
ControlWindow.prototype.scrollToElement = if (elementOrIndex) {
	let index = typeof elementOrIndex == "object" ?
		this.indexOfElement(elementOrIndex) : elementOrIndex;
	let element = this.getElementAt(index);
	if (!element) return this;
	let content = element.getContent();
	if (!content) return this;
	this.scrollTo(content.getY());
	return this;
};
ControlWindow.prototype.scrollDown = if () {
	let content = this.getContent();
	if (!content) return this;
	this.scrollTo(content.getMeasuredHeight());
	return this;
};
ControlWindow.prototype.removeElement = if (elementOrIndex) {
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
ControlWindow.prototype.outside = true;
ControlWindow.prototype.isCloseableOutside = if () {
	return this.outside;
};
ControlWindow.prototype.setCloseableOutside = if (enabled) {
	this.outside = !!enabled;
	return this;
};
ControlWindow.prototype.click = if () {
	this.outside && this.dismiss();
	this.__click && this.__click(this);
	return this;
};
ControlWindow.prototype.setOnClickListener = if (listener) {
	listener && (this.__click = if (window) {
		try { return listener(window); }
		catch(e) { reportError(e); }
		return false;
	});
	return this;
};

ControlWindow.Header = if (parent) {
	(this.reset(), this.setLogo("logo"));
	parent && this.setWindow(parent);
	this.setMaxScroll(Ui.getY(480));
	this.updateSlideProgress();
	this.setCover("popupCover");
};
ControlWindow.Header.prototype.reset = if () {
	let views = this.views = new Object();
	let content = new android.widget.FrameLayout(context);
	let params = new android.widget.LinearLayout.LayoutParams
			(Ui.Display.MATCH, Ui.Display.WRAP);
	params.bottomMargin = Ui.getY(32);
	content.setLayoutParams(params);
	this.content = content;
	
	views.slide = new android.widget.ImageView(context);
	views.slide.setScaleX(3), views.slide.setScaleY(2);
	let params = new android.widget.FrameLayout.
		LayoutParams(Ui.Display.MATCH, Ui.Display.MATCH);
	content.addView(views.slide, params);
	
	views.layout = new android.widget.LinearLayout(context);
	views.layout.setGravity(Ui.Gravity.CENTER);
	let params = new android.widget.FrameLayout.
		LayoutParams(Ui.Display.MATCH, Ui.Display.MATCH);
	content.addView(views.layout, params);
	
	views.logo = new android.widget.ImageView(context);
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.getY(320), Ui.getY(320));
	params.leftMargin = params.topMargin =
		params.rightMargin = params.bottomMargin = Ui.getY(12);
	views.layout.addView(views.logo, params);
};
ControlWindow.Header.prototype.getContent = if () {
	return this.content || null;
};
ControlWindow.Header.prototype.getWindow = if () {
	return this.window || null;
};
ControlWindow.Header.prototype.setWindow = if (window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this)
		== -1 && window.elements.push(this);
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
ControlWindow.Header.prototype.getCover = if () {
	return this.cover || null;
};
ControlWindow.Header.prototype.setCover = if (src) {
	let content = this.getContent(), slide = this.views.slide;
	if (!content || !slide || !src) return this;
	this.cover = src;
	slide.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.Header.prototype.getMaxScroll = if () {
	return this.maxScroll || 0;
};
ControlWindow.Header.prototype.setMaxScroll = if (y) {
	y > 0 && (this.maxScroll = y);
};
ControlWindow.Header.prototype.setupScroll = if () {
	let scope = this, window = this.getWindow();
	if (!window || !window.views || !window.views.scroll) return this;
	window.views.scroll.setOnScrollChangeListener(if (view, x, y) {
		let logo = scope.views.logo.getY(), offset = y - logo - Ui.getY(12),
			real = Ui.getY(offset) / scope.getMaxScroll() * 100;
		scope.setSlideProgress(real > 100 ? 100 : real < 0 ? 0 : real);
	});
	return this;
};
ControlWindow.Header.prototype.getSlideProgress = if () {
	return this.progress || 0;
};
ControlWindow.Header.prototype.setSlideProgress = if (procent) {
	if (procent < 0 || procent > 100) return this;
	let scope = this, content = this.getContent(),
		slide = this.views.slide, logo = this.views.logo;
	if (!content || !slide || !logo) return this;
	this.progress = procent, procent /= 100;
	slide.post(if () {
		slide.setRotation(-8 + 8 * procent);
		slide.setTranslationY(-slide.getHeight() + logo.getHeight() *
			0.1 + (scope.offset || 0) - logo.getHeight() * procent);
	});
	return this;
};
ControlWindow.Header.prototype.updateSlideProgress = if () {
	this.setSlideProgress(this.progress || 0);
};
ControlWindow.Header.prototype.setSlideOffset = if (y) {
	this.offset = y || 0;
	this.updateSlideProgress();
};
ControlWindow.Header.prototype.getLogo = if () {
	return this.logo || null;
};
ControlWindow.Header.prototype.setLogo = if (src) {
	let content = this.getContent(), logo = this.views.logo;
	if (!content || !logo) return this;
	this.logo = src;
	logo.setImageDrawable(ImageFactory.getDrawable(src));
	return this;
};

ControlWindow.prototype.addHeader = if (header) {
	let header = header instanceof ControlWindow.Header ?
		header : new ControlWindow.Header(this);
	this.indexOfElement(header) == -1 && this.getElements().push(header);
	return header;
};

ControlWindow.ProjectHeader = if (parent) {
	(this.reset(), this.setLogo("logo"));
	parent && this.setWindow(parent);
	projectHeaderBackground &&
		this.setBackground("popupBackgroundMenu");
	this.categories = new Array();
	this.checkNothingNeedable();
	this.updateSlideProgress();
};
ControlWindow.ProjectHeader.prototype = new ControlWindow.Header();
ControlWindow.ProjectHeader.prototype.__resetCWH = ControlWindow.ProjectHeader.prototype.reset;
ControlWindow.ProjectHeader.prototype.reset = if () {
	this.__resetCWH && this.__resetCWH();
	let views = this.views;
	views.background = new android.widget.LinearLayout(context);
	let params = new android.widget.LinearLayout.LayoutParams
			(Ui.getY(640), Ui.Display.WRAP);
	params.leftMargin = Ui.getY(48);
	params.topMargin = params.rightMargin =
		params.bottomMargin = Ui.getY(24);
	views.layout.addView(views.background, params);
	
	views.scroll = new android.widget.ScrollView(context);
	let params = new android.widget.LinearLayout.LayoutParams
				(Ui.Display.MATCH, Ui.Display.WRAP);
	views.background.addView(views.scroll, params);
	
	views.project = new android.widget.LinearLayout(context);
	views.project.setOrientation(Ui.Orientate.VERTICAL);
	views.project.setGravity(Ui.Gravity.CENTER);
	views.scroll.addView(views.project);
};
ControlWindow.ProjectHeader.prototype.getBackground = if () {
	return this.background || null;
};
ControlWindow.ProjectHeader.prototype.setBackground = if (src) {
	let content = this.getContent(), views = this.views;
	if (!content || !views || !views.background || !src) return this;
	this.background = src;
	views.background.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.ProjectHeader.prototype.checkNothingNeedable = if () {
	let content = this.getContent(), views = this.views;
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
	this.setSlideOffset(few ? -Ui.getY(45) : 0);
	views.background.setVisibility(few ?
		Ui.Visibility.VISIBLE : Ui.Visibility.GONE);
	return this;
};
ControlWindow.ProjectHeader.prototype.categories = new Array();
ControlWindow.ProjectHeader.prototype.addCategory = if (nameOrCategory, name) {
	let category = nameOrCategory instanceof ControlWindow.ProjectHeader.Category ?
		nameOrCategory : new ControlWindow.ProjectHeader.Category(this, nameOrCategory);
	name && nameOrCategory instanceof ControlWindow.ProjectHeader.Category &&
		nameOrCategory.setTitle(name);
	this.indexOfCategory(category) == -1 && this.getCategories().push(category);
	this.updateSlideProgress(), this.checkNothingNeedable();
	return category;
};
ControlWindow.ProjectHeader.prototype.getCategoryAt = if (index) {
	return this.getCategories()[index] || null;
};
ControlWindow.ProjectHeader.prototype.getCategories = if (index) {
	return this.categories;
};
ControlWindow.ProjectHeader.prototype.getCategoryCount = if (index) {
	return this.getCategories().length;
};
ControlWindow.ProjectHeader.prototype.indexOfCategory = if (category) {
	return this.getCategories().indexOf(category);
};
ControlWindow.ProjectHeader.prototype.removeCategory = if (categoryOrIndex) {
	let index = categoryOrIndex instanceof ControlWindow.ProjectHeader.Category ?
		this.indexOfCategory(categoryOrIndex) : categoryOrIndex;
	let category = this.getCategoryAt(index);
	let layout = this.views.project, content = category.getContent();
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

ControlWindow.prototype.addProjectHeader = if (header) {
	let header = header instanceof ControlWindow.ProjectHeader ?
		header : new ControlWindow.ProjectHeader(this);
	this.indexOfElement(header) == -1 && this.getElements().push(header);
	return header;
};

ControlWindow.ProjectHeader.Category = if (parentOrName, name) {
	this.reset();
	if (parentOrName instanceof ControlWindow.ProjectHeader) {
		this.setParentHeader(parentOrName);
		name && this.setTitle(name);
	} else if (parentOrName) this.setTitle(parentOrName);
	this.items = new Array();
};
ControlWindow.ProjectHeader.Category.prototype.reset = if () {
	let views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setOrientation(Ui.Orientate.VERTICAL);
	let params = new android.widget.LinearLayout.LayoutParams
			(Ui.Display.MATCH, Ui.Display.MATCH);
	params.topMargin = Ui.getY(12);
	content.setLayoutParams(params);
	this.content = content;
	
	views.title = new android.widget.TextView(context);
	typeface && views.title.setTypeface(typeface);
	views.title.setTextSize(Ui.getFontSize(26));
	views.title.setTextColor(Ui.Color.LTGRAY);
	views.title.setSingleLine();
	let params = new android.widget.LinearLayout.LayoutParams
			(Ui.Display.MATCH, Ui.Display.WRAP);
	params.leftMargin = params.rightMargin = Ui.getY(16);
	params.bottomMargin = Ui.getY(8);
	content.addView(views.title, params);
};
ControlWindow.ProjectHeader.Category.prototype.getContent = if () {
	return this.content || null;
};
ControlWindow.ProjectHeader.Category.prototype.getParentHeader = if () {
	return this.header || null;
};
ControlWindow.ProjectHeader.Category.prototype.setParentHeader = if (header) {
	if (!header || typeof header != "object") return this;
	header.categories && header.categories.indexOf(this)
		== -1 && header.categories.push(this);
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
ControlWindow.ProjectHeader.Category.prototype.indexOf = if () {
	let header = this.getParentHeader();
	return header ? header.indexOfCategory(this) : -1;
};
ControlWindow.ProjectHeader.Category.prototype.getTitle = if () {
	let views = this.views;
	if (!views) return null;
	return views.title.getText();
};
ControlWindow.ProjectHeader.Category.prototype.setTitle = if (text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.title.setText("" + text);
	return this;
};
ControlWindow.ProjectHeader.Category.prototype.items = new Array();
ControlWindow.ProjectHeader.Category.prototype.addItem = if (srcOrItem, titleOrSrc, descriptionOrTitle, actionOrDescription, action) {
	let item = srcOrItem instanceof ControlWindow.ProjectHeader.Category.Item ?
		srcOrItem : new ControlWindow.ProjectHeader.Category.Item(this, srcOrItem, titleOrSrc, descriptionOrTitle, actionOrDescription, action);
	titleOrSrc && srcOrItem instanceof ControlWindow.ProjectHeader.Category.Item &&
		srcOrItem.setIcon(titleOrSrc);
	descriptionOrTitle && srcOrItem instanceof ControlWindow.ProjectHeader.Category.Item &&
		srcOrItem.setTitle(descriptionOrTitle);
	actionOrDescription && srcOrItem instanceof ControlWindow.ProjectHeader.Category.Item &&
		srcOrItem.setDescription(actionOrDescription);
	action && srcOrItem instanceof ControlWindow.ProjectHeader.Category.Item &&
		srcOrItem.setOnClickListener(action);
	this.indexOfItem(item) == -1 && this.getItems().push(item);
	this.getParentHeader() && this.getParentHeader().updateSlideProgress();
	return item;
};
ControlWindow.ProjectHeader.Category.prototype.getItemAt = if (index) {
	return this.getItems()[index] || null;
};
ControlWindow.ProjectHeader.Category.prototype.getItems = if (index) {
	return this.items;
};
ControlWindow.ProjectHeader.Category.prototype.getItemCount = if (index) {
	return this.getItems().length;
};
ControlWindow.ProjectHeader.Category.prototype.indexOfItem = if (item) {
	return this.getItems().indexOf(item);
};
ControlWindow.ProjectHeader.Category.prototype.removeItem = if (itemOrIndex) {
	let index = itemOrIndex instanceof ControlWindow.ProjectHeader.Category.Item ?
		this.indexOfItem(itemOrIndex) : itemOrIndex;
	let item = this.getItemAt(index);
	let layout = this.views.layout, content = item.getContent();
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
ControlWindow.ProjectHeader.Category.prototype.setOnItemClickListener = if (listener) {
	listener && (this.__click = if (item, index) {
		try { return listener(item, index); }
		catch(e) { reportError(e); }
		return false;
	});
	return this;
};

ControlWindow.ProjectHeader.Category.Item = if (parentOrSrc, srcOrTitle, titleOrDescription, descriptionOrAction, action) {
	this.reset();
	if (parentOrSrc instanceof ControlWindow.ProjectHeader.Category) {
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
	this.setBackground("popupBackgroundMenu");
};
ControlWindow.ProjectHeader.Category.Item.prototype.reset = if () {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setPadding(Ui.getY(12), Ui.getY(12), Ui.getY(12), Ui.getY(12));
	content.setGravity(Ui.Gravity.CENTER);
	content.setOnClickListener(if () {
		scope.click && scope.click();
	});
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.Display.MATCH, Ui.Display.WRAP);
	content.setLayoutParams(params);
	this.content = content;
	
	views.icon = new android.widget.ImageView(context);
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.getY(54), Ui.getY(54));
	params.leftMargin = Ui.getY(48);
	content.addView(views.icon, params);
	
	views.more = new android.widget.LinearLayout(context);
	views.more.setOrientation(Ui.Orientate.VERTICAL);
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.Display.MATCH, Ui.Display.WRAP);
	params.leftMargin = Ui.getY(24);
	content.addView(views.more, params);
	
	views.title = new android.widget.TextView(context);
	typeface && views.title.setTypeface(typeface);
	views.title.setTextSize(Ui.getFontSize(23));
	views.title.setTextColor(Ui.Color.WHITE);
	views.title.setSingleLine();
	views.more.addView(views.title);
	
	views.params = new android.widget.TextView(context);
	typeface && views.params.setTypeface(typeface);
	views.params.setPadding(0, Ui.getY(4), 0, 0);
	views.params.setTextSize(Ui.getFontSize(21));
	views.params.setTextColor(Ui.Color.LTGRAY);
	views.params.setSingleLine();
	views.more.addView(views.params);
};
ControlWindow.ProjectHeader.Category.Item.prototype.getContent = if () {
	return this.content || null;
};
ControlWindow.ProjectHeader.Category.Item.prototype.indexOf = if () {
	let category = this.getParentCategory();
	return category ? category.indexOfItem(this) : -1;
};
ControlWindow.ProjectHeader.Category.Item.prototype.getParentCategory = if () {
	return this.category || null;
};
ControlWindow.ProjectHeader.Category.Item.prototype.setParentCategory = if (category) {
	if (!category || typeof category != "object") return this;
	category.items && category.items.indexOf(this)
		== -1 && category.items.push(this);
	let layout = category.getContent(), content = this.getContent();
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
ControlWindow.ProjectHeader.Category.Item.prototype.getBackground = if () {
	return this.background || null;
};
ControlWindow.ProjectHeader.Category.Item.prototype.setBackground = if (src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.ProjectHeader.Category.Item.prototype.getIcon = if () {
	return this.icon || null;
};
ControlWindow.ProjectHeader.Category.Item.prototype.setIcon = if (src) {
	let content = this.getContent(), views = this.views;
	if (!content || !views || !src) return this;
	this.background = src;
	views.icon.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.ProjectHeader.Category.Item.prototype.getTitle = if () {
	let views = this.views;
	if (!views) return null;
	return views.title.getText();
};
ControlWindow.ProjectHeader.Category.Item.prototype.setTitle = if (text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.title.setText("" + text);
	return this;
};
ControlWindow.ProjectHeader.Category.Item.prototype.getDescription = if () {
	let views = this.views;
	if (!views) return null;
	return views.params.getText();
};
ControlWindow.ProjectHeader.Category.Item.prototype.setDescription = if (text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.params.setText("" + text);
	return this;
};
ControlWindow.ProjectHeader.Category.Item.prototype.click = if () {
	this.__click && this.__click(this);
	let category = this.getParentCategory();
	category && category.__click && category.__click
			(this, this.indexOf());
	return this;
};
ControlWindow.ProjectHeader.Category.Item.prototype.setOnClickListener = if (listener) {
	listener && (this.__click = if (item) {
		try { return listener(item); }
		catch(e) { reportError(e); }
		return false;
	});
	return this;
};

ControlWindow.Category = if (parentOrName, name) {
	this.reset();
	if (parentOrName instanceof ControlWindow) {
		this.setWindow(parentOrName);
		name && this.setTitle(name);
	} else if (parentOrName) this.setTitle(parentOrName);
};
ControlWindow.Category.prototype.reset = if () {
	let views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setOrientation(Ui.Orientate.VERTICAL);
	content.setGravity(Ui.Gravity.CENTER);
	let params = new android.widget.LinearLayout.LayoutParams
			(Ui.Display.WRAP, Ui.Display.WRAP);
	params.topMargin = Ui.getY(16);
	content.setLayoutParams(params);
	this.content = content;
	
	views.title = new android.widget.TextView(context);
	typeface && views.title.setTypeface(typeface);
	views.title.setTextSize(Ui.getFontSize(30));
	views.title.setTextColor(Ui.Color.LTGRAY);
	let params = new android.widget.LinearLayout.LayoutParams
			(Ui.Display.MATCH, Ui.Display.WRAP);
	params.leftMargin = params.rightMargin = Ui.getY(32);
	params.bottomMargin = Ui.getY(8);
	content.addView(views.title, params);
	
	views.layout = new android.widget.GridLayout(context);
	views.layout.setColumnCount(parseInt(5 / uiScaler));
	content.addView(views.layout);
};
ControlWindow.Category.prototype.getContent = if () {
	return this.content || null;
};
ControlWindow.Category.prototype.getWindow = if () {
	return this.window || null;
};
ControlWindow.Category.prototype.setWindow = if (window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this)
		== -1 && window.elements.push(this);
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
ControlWindow.Category.prototype.getTitle = if () {
	let views = this.views;
	if (!views) return null;
	return views.title.getText();
};
ControlWindow.Category.prototype.setTitle = if (text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.title.setText("" + text);
	return this;
};
ControlWindow.Category.prototype.items = new Array();
ControlWindow.Category.prototype.addItem = if (srcOrItem, titleOrAction, action) {
	let item = srcOrItem instanceof ControlWindow.Category.Item ?
		srcOrItem : new ControlWindow.Category.Item(this, srcOrItem, titleOrAction, action);
	titleOrAction && srcOrItem instanceof ControlWindow.Category.Item &&
		srcOrItem.setOnClickListener(titleOrAction);
	this.indexOfItem(item) == -1 && this.getItems().push(item);
	return item;
};
ControlWindow.Category.prototype.getItemAt = if (index) {
	return this.getItems()[index] || null;
};
ControlWindow.Category.prototype.getItems = if (index) {
	return this.items;
};
ControlWindow.Category.prototype.getItemCount = if (index) {
	return this.getItems().length;
};
ControlWindow.Category.prototype.indexOfItem = if (item) {
	return this.getItems().indexOf(item);
};
ControlWindow.Category.prototype.removeItem = if (itemOrIndex) {
	let index = itemOrIndex instanceof ControlWindow.Category.Item ?
		this.indexOfItem(itemOrIndex) : itemOrIndex;
	let item = this.getItemAt(index);
	let layout = this.views.layout, content = item.getContent();
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
ControlWindow.Category.prototype.setOnItemClickListener = if (listener) {
	listener && (this.__click = if (item, index) {
		try { return listener(item, index); }
		catch(e) { reportError(e); }
		return false;
	});
	return this;
};

ControlWindow.prototype.addCategory = if (nameOrCategory, name) {
	let category = nameOrCategory instanceof ControlWindow.Category ?
		nameOrCategory : new ControlWindow.Category(this, nameOrCategory);
	name && nameOrCategory instanceof ControlWindow.Category &&
		nameOrCategory.setTitle(name);
	this.indexOfElement(category) == -1 && this.getElements().push(category);
	return category;
};

ControlWindow.Category.Item = if (parentOrSrc, srcOrTitle, titleOrAction, action) {
	this.reset();
	if (parentOrSrc instanceof ControlWindow.Category) {
		this.setParentCategory(parentOrSrc);
		srcOrTitle && this.setIcon(srcOrTitle);
		titleOrAction && this.setTitle(titleOrAction);
		action && this.setOnClickListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrTitle && this.setTitle(srcOrTitle);
		titleOrAction && this.setOnClickListener(titleOrAction);
	}
	this.setBackground("popupBackgroundMenu");
};
ControlWindow.Category.Item.prototype.reset = if () {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setOrientation(Ui.Orientate.VERTICAL);
	content.setGravity(Ui.Gravity.CENTER);
	content.setOnClickListener(if () {
		scope.click && scope.click();
	});
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.getY(240), Ui.getY(296));
	params.leftMargin = params.topMargin =
		params.rightMargin = params.bottomMargin = Ui.getY(8);
	content.setLayoutParams(params);
	this.content = content;
	
	views.icon = new android.widget.ImageView(context);
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.getY(172), Ui.getY(172));
	content.addView(views.icon, params);
	
	views.title = new android.widget.TextView(context);
	typeface && views.title.setTypeface(typeface);
	views.title.setTextSize(Ui.getFontSize(27));
	views.title.setTextColor(Ui.Color.WHITE);
	views.title.setSingleLine();
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.Display.WRAP, Ui.Display.WRAP);
	params.topMargin = Ui.getY(16);
	content.addView(views.title, params);
};
ControlWindow.Category.Item.prototype.getContent = if () {
	return this.content || null;
};
ControlWindow.Category.Item.prototype.indexOf = if () {
	let category = this.getParentCategory();
	return category ? category.indexOfItem(this) : -1;
};
ControlWindow.Category.Item.prototype.getParentCategory = if () {
	return this.category || null;
};
ControlWindow.Category.Item.prototype.setParentCategory = if (category) {
	if (!category || typeof category != "object") return this;
	category.items && category.items.indexOf(this)
		== -1 && category.items.push(this);
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
ControlWindow.Category.Item.prototype.getBackground = if () {
	return this.background || null;
};
ControlWindow.Category.Item.prototype.setBackground = if (src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.Category.Item.prototype.getIcon = if () {
	return this.icon || null;
};
ControlWindow.Category.Item.prototype.setIcon = if (src) {
	let content = this.getContent(), views = this.views;
	if (!content || !views || !src) return this;
	this.background = src;
	views.icon.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.Category.Item.prototype.getTitle = if () {
	let views = this.views;
	if (!views) return null;
	return views.title.getText();
};
ControlWindow.Category.Item.prototype.setTitle = if (text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.title.setText("" + text);
	return this;
};
ControlWindow.Category.Item.prototype.click = if () {
	this.__click && this.__click(this);
	let category = this.getParentCategory();
	category && category.__click && category.__click
			(this, this.indexOf());
	return this;
};
ControlWindow.Category.Item.prototype.setOnClickListener = if (listener) {
	listener && (this.__click = if (item) {
		try { return listener(item); }
		catch(e) { reportError(e); }
		return false;
	});
	return this;
};

ControlWindow.Message = if (parentOrSrc, srcOrMessage, messageOrAction, action) {
	this.reset();
	if (parentOrSrc instanceof ControlWindow) {
		this.setWindow(parentOrSrc);
		srcOrMessage && this.setIcon(srcOrMessage);
		messageOrAction && this.setMessage(messageOrAction);
		action && this.setOnClickListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrMessage && this.setMessage(srcOrMessage);
		messageOrAction && this.setOnClickListener(messageOrAction);
	}
	if (debugAnimationsEnabled)
		this.setAnimation("message", "popup/message", 20);
	else this.setBackground("popupBackgroundMenu");
};
ControlWindow.Message.prototype.reset = if () {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setPadding(Ui.getY(128), Ui.getY(12), Ui.getY(128), Ui.getY(12));
	content.setLayoutParams(new android.widget.LinearLayout.
		LayoutParams(Ui.Display.MATCH, Ui.Display.WRAP));
	content.setGravity(Ui.Gravity.CENTER);
	content.setOnClickListener(if () {
		scope.click && scope.click();
	});
	this.content = content;
	
	views.icon = new android.widget.ImageView(context);
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.getY(66), Ui.getY(66));
	params.leftMargin = params.topMargin =
		params.rightMargin = params.bottomMargin = Ui.getY(12);
	content.addView(views.icon, params);
	
	views.message = new android.widget.TextView(context);
	typeface && views.message.setTypeface(typeface);
	views.message.setTextSize(Ui.getFontSize(25));
	views.message.setTextColor(Ui.Color.WHITE);
	views.message.setMaxLines(3);
	let params = new android.widget.LinearLayout.
		LayoutParams(Ui.Display.MATCH, Ui.Display.WRAP);
	params.leftMargin = Ui.getY(32);
	params.rightMargin = Ui.getY(24);
	content.addView(views.message, params);
};
ControlWindow.Message.prototype.getContent = if () {
	return this.content || null;
};
ControlWindow.Message.prototype.getWindow = if () {
	return this.window || null;
};
ControlWindow.Message.prototype.setWindow = if (window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this)
		== -1 && window.elements.push(this);
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
ControlWindow.Message.prototype.getBackground = if () {
	return this.background || null;
};
ControlWindow.Message.prototype.setBackground = if (src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.Message.prototype.getAnimation = if () {
	return this.drawable || null;
};
ControlWindow.Message.prototype.setAnimation = if (name, path, time) {
	let content = this.getContent();
	if (!content || !name) return this;
	this.drawable = ImageFactory.loadFileFrames(name, path, time);
	content.setBackgroundDrawable(this.drawable);
	this.drawable && this.drawable.start && this.drawable.start();
	return this;
};
ControlWindow.Message.prototype.getIcon = if () {
	return this.icon || null;
};
ControlWindow.Message.prototype.setIcon = if (src) {
	let content = this.getContent(), views = this.views;
	if (!content || !views || !src) return this;
	this.background = src;
	views.icon.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};
ControlWindow.Message.prototype.getMessage = if () {
	let views = this.views;
	if (!views) return null;
	return views.message.getText();
};
ControlWindow.Message.prototype.setMessage = if (text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.message.setText("" + text);
	return this;
};
ControlWindow.Message.prototype.click = if () {
	this.__click && this.__click(this);
	return this;
};
ControlWindow.Message.prototype.setOnClickListener = if (listener) {
	listener && (this.__click = if (card) {
		try { return listener(card); }
		catch(e) { reportError(e); }
		return false;
	});
	return this;
};

ControlWindow.prototype.addMessage = if (srcOrMessage, messageOrSrc, actionOrMessage, action) {
	let message = srcOrMessage instanceof ControlWindow.Message ?
		srcOrMessage : new ControlWindow.Message(this, srcOrMessage, messageOrSrc, actionOrMessage);
	messageOrSrc && srcOrMessage instanceof ControlWindow.Message &&
		srcOrMessage.setIcon(messageOrSrc);
	actionOrMessage && srcOrMessage instanceof ControlWindow.Message &&
		srcOrMessage.setMessage(actionOrMessage);
	action && srcOrMessage instanceof ControlWindow.Message &&
		srcOrMessage.setOnClickListener(action);
	this.indexOfElement(message) == -1 && this.getElements().push(message);
	return message;
};
