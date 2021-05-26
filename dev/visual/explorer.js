const ExplorerWindow = function() {
	this.setWidth(Ui.Display.MATCH);
	this.setHeight(Ui.Display.MATCH);
	this.setFocusable(true);
	this.file = new java.io.File(__dir__);
	this.reset();
	this.setBackground("popupBackground");
	this.elements = new Array();
};

ExplorerWindow.prototype = assign(UniqueWindow.prototype);
ExplorerWindow.prototype.TYPE = "ExplorerWindow";

ExplorerWindow.prototype.multiple = false;

ExplorerWindow.prototype.reset = function() {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.FrameLayout(context);
	this.setContent(content);
	
	views.layout = new android.widget.RelativeLayout(context);
	views.layout.setId(java.lang.String("rootLayout").hashCode());
	let params = android.widget.RelativeLayout.LayoutParams
			(Ui.Display.MATCH, Ui.Display.MATCH);
	content.addView(views.layout, params);
	
	views.files = new android.widget.ListView(context);
	views.files.setId(java.lang.String("filesList").hashCode());
	views.files.setOnItemClickListener(function(parent, view, position, id) {
		scope.selectItem(position) && scope.checkIfCanBeApproved();
	});
	views.files.setOnItemLongClickListener(function(parent, view, position, id) {
		scope.selectItem(position) && scope.checkIfCanBeApproved();
		scope.miltiple && scope.setMode(Ui.Choice.MULTIPLE);
		return true;
	});
	params = android.widget.RelativeLayout.LayoutParams
				(Ui.Display.MATCH, Ui.Display.MATCH);
	this.setRootDirectory(), this.resetAdapter();
	views.files.setEmptyView(this.makeEmptyView());
	views.layout.addView(views.files, params);
};

ExplorerWindow.prototype.getBackground = function() {
	return this.background || null;
};

ExplorerWindow.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

ExplorerWindow.prototype.addElement = function(element) {
	this.indexOfElement(element) == -1 &&
		this.getElements().push(element);
	return element;
};

ExplorerWindow.prototype.getElementAt = function(index) {
	return this.getElements()[index] || null;
};

ExplorerWindow.prototype.getElements = function(index) {
	return this.elements;
};

ExplorerWindow.prototype.getElementCount = function(index) {
	return this.getElements().length;
};

ExplorerWindow.prototype.indexOfElement = function(item) {
	return this.getElements().indexOf(item);
};

ExplorerWindow.prototype.removeElement = function(elementOrIndex) {
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

ExplorerWindow.prototype.setPath = function(path) {
	this.file = new java.io.File(path);
	let dirs = Files.listDirectoryNames(path);
	let files = Files.listFileNames(path);
	if (this.filter && this.filter.length >= 0)
		files = Files.checkFormats(files, this.filter);
	this.setItems(dirs.concat(files));
};

ExplorerWindow.prototype.setFilter = function(filter) {
	if (!Array.isArray(filter)) filter = [filter];
	this.filter = filter.slice();
};

ExplorerWindow.prototype.getDirectory = function() {
	return this.file;
};

ExplorerWindow.prototype.setRootDirectory = function(path) {
	this.root = String(path || Dirs.EXTERNAL);
	(!this.root.endsWith("/")) && (this.root += "/");
};

ExplorerWindow.prototype.getRootDirectory = function() {
	return this.root;
};

ExplorerWindow.prototype.setItems = function(array) {
	this.adapter.setRoot(this.file.getPath());
	this.adapter.setItems(array);
};

ExplorerWindow.prototype.setMode = function(mode) {
	this.adapter.setMode(mode);
};

ExplorerWindow.prototype.selectItem = function(index) {
	if (this.adapter.isDirectory(index) == true) {
		let file = this.adapter.getFile(index);
		this.setPath(file.getPath());
		this.__explore && this.__explore(file);
		return false;
	}
	this.adapter.selectItem(index);
	return true;
};

ExplorerWindow.prototype.isMultipleSelectable = function() {
	return this.multiple;
};

ExplorerWindow.prototype.setMultipleSelectable = function(enabled) {
	this.multiple = !!enabled;
};

ExplorerWindow.prototype.resetAdapter = function() {
	this.adapter = new ExplorerAdapter();
	this.views.files.setAdapter(this.adapter.self);
};

ExplorerWindow.prototype.getAdapter = function() {
	return this.adapter;
};

ExplorerWindow.prototype.getApproved = function() {
	return this.adapter.getApprovedFiles();
};

ExplorerWindow.prototype.isCanBeApproved = function() {
	return this.adapter.isCanBeApproved() == true;
};

ExplorerWindow.prototype.checkIfCanBeApproved = function() {
	this.__approve && this.__approve(this.getApproved());
};

ExplorerWindow.prototype.makeEmptyView = function() {
	let layout = new android.widget.LinearLayout(context);
	layout.setOrientation(Ui.Orientate.VERTICAL);
	layout.setGravity(Ui.Gravity.CENTER);
	layout.setId(android.R.id.empty);
	let params = android.view.ViewGroup.LayoutParams(Ui.Display.MATCH, Ui.Display.MATCH);
	layout.setLayoutParams(params);
	
	let icon = new android.widget.ImageView(context);
	icon.setImageDrawable(ImageFactory.getDrawable("explorerFolder"));
	params = android.widget.LinearLayout.LayoutParams(Ui.getY(180), Ui.getY(180));
	layout.addView(icon, params);
	
	let info = new android.widget.TextView(context);
	typeface && info.setTypeface(typeface);
	info.setText(translate("No items."));
	info.setTextSize(Ui.getFontSize(36));
	info.setTextColor(Ui.Color.WHITE);
	info.setId(java.lang.String("fileError").hashCode());
	info.setPadding(Ui.getY(20), Ui.getY(20), Ui.getY(20), Ui.getY(20));
	return (layout.addView(info), layout);
};

ExplorerWindow.prototype.setOnApproveListener = function(listener) {
	let scope = this;
	listener && (this.__approve = function(files) {
		try { listener(scope, files); }
		catch (e) { reportError(e); }
	});
	return this;
};

ExplorerWindow.prototype.setOnExploreListener = function(listener) {
	let scope = this;
	listener && (this.__explore = function(file) {
		try { listener(scope, file); }
		catch (e) { reportError(e); }
	});
	return this;
};

ExplorerWindow.prototype.setOnSelectListener = function(listener) {
	let scope = this, adapter = this.getAdapter();
	adapter.setOnSelectListener(function(item, previous) {
		try {
			let file = adapter.getFile(item);
			listener && listener(scope, file, item, previous);
		} catch (e) {
			reportError(e);
		} 
	});
};

ExplorerWindow.prototype.setOnUnselectListener = function(listener) {
	let scope = this, adapter = this.getAdapter();
	adapter.setOnUnselectListener(function(item) {
		try {
			let file = adapter.getFile(item);
			listener && listener(scope, file, item);
		} catch (e) {
			reportError(e);
		} 
	});
};

ExplorerWindow.Approve = function(parentOrSrc, srcOrAction, action) {
	this.reset();
	if (parentOrSrc instanceof ExplorerWindow) {
		this.setWindow(parentOrSrc);
		srcOrAction && this.setIcon(srcOrAction);
		action && this.setOnApproveListener(action);
	} else {
		parentOrSrc && this.setIcon(parentOrSrc);
		srcOrAction && this.setOnApproveListener(srcOrAction);
	}
	this.checkIfCanBeApproved();
	this.setBackground("popupBackgroundControl");
};

ExplorerWindow.Approve.prototype.reset = function() {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.ImageView(context);
	content.setVisibility(Ui.Visibility.GONE);
	content.setPadding(Ui.getY(20), Ui.getY(20), Ui.getY(20), Ui.getY(20));
	content.setId(java.lang.String("actionButton").hashCode());
	content.setScaleType(Ui.Scale.CENTER_CROP);
	content.setOnClickListener(function() {
		scope.approve();
	});
	let params = android.widget.RelativeLayout.LayoutParams
							(Ui.getY(120), Ui.getY(120));
	params.setMargins(Ui.getY(40), Ui.getY(40), Ui.getY(40), Ui.getY(40));
	params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_BOTTOM);
	params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
	params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_LEFT);
	this.content = (content.setLayoutParams(params), content);
};

ExplorerWindow.Approve.prototype.getContent = function() {
	return this.content || null;
};

ExplorerWindow.Approve.prototype.getWindow = function() {
	return this.window || null;
};

ExplorerWindow.Approve.prototype.setWindow = function(window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this)
		== -1 && window.elements.push(this);
	let layout = window.views ? window.views.layout : null,
			content = this.getContent(), scope = this;
	if (!layout || !content) return this;
	let actor = new BoundsActor();
	actor.setDuration(600);
	window.beginDelayedActor(actor);
	layout.addView(content);
	window.setOnApproveListener(function() {
		scope.checkIfCanBeApproved();
	});
	this.window = window;
	return this;
};

ExplorerWindow.Approve.prototype.getBackground = function() {
	return this.background || null;
};

ExplorerWindow.Approve.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

ExplorerWindow.Approve.prototype.getIcon = function() {
	return this.icon || null;
};

ExplorerWindow.Approve.prototype.setIcon = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.icon = src;
	content.setImageDrawable(ImageFactory.getDrawable(src));
	return this;
};

ExplorerWindow.Approve.prototype.approve = function() {
	let window = this.getWindow();
	this.__approve && this.__approve(this, window ? window.getApproved() : null);
	return this;
};

ExplorerWindow.Approve.prototype.checkIfCanBeApproved = function() {
	let content = this.getContent(), window = this.getWindow();
	if (window) {
		let actor = new FadeActor();
		actor.setDuration(400);
		window.beginDelayedActor(actor);
	}
	content.setVisibility(window && window.isCanBeApproved() ?
		Ui.Visibility.VISIBLE : Ui.Visibility.GONE);
};

ExplorerWindow.Approve.prototype.setOnApproveListener = function(listener) {
	listener && (this.__approve = function(approve, files) {
		try { listener(approve, files); }
		catch (e) { reportError(e); }
	});
	return this;
};

ExplorerWindow.prototype.addApprove = function(srcOrApprove, actionOrSrc, action) {
	let approve = srcOrApprove instanceof ExplorerWindow.Approve ?
		srcOrApprove : new ExplorerWindow.Approve(this, srcOrApprove, actionOrSrc);
	actionOrSrc && srcOrApprove instanceof ExplorerWindow.Approve &&
		srcOrApprove.setIcon(actionOrSrc);
	action && srcOrApprove instanceof ExplorerWindow.Approve &&
		srcOrApprove.setOnApproveListener(action);
	this.indexOfElement(approve) == -1 && this.getElements().push(approve);
	return approve;
};

ExplorerWindow.Path = function(parentOrAction, action) {
	this.reset();
	if (parentOrAction instanceof ExplorerWindow) {
		this.setWindow(parentOrAction);
		action && this.setOnExploreListener(action);
	} else parentOrAction && this.setOnExploreListener(parentOrAction);
	this.setBackground("popupBackground");
	this.pathes = new Array();
};

ExplorerWindow.Path.prototype.reset = function() {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.LinearLayout(context);
	content.setId(java.lang.String("pathLayout").hashCode());
	content.setOrientation(Ui.Orientate.VERTICAL);
	content.setGravity(Ui.Gravity.BOTTOM);
	content.setOnClickListener(function() {
		scope.__outside && scope.__outside(scope);
	});
	let params = new android.widget.RelativeLayout.LayoutParams
			(Ui.Display.MATCH, Ui.getY(110));
	this.content = (content.setLayoutParams(params), content);
	
	views.scroll = new android.widget.HorizontalScrollView(context);
	params = android.widget.LinearLayout.LayoutParams
				(Ui.Display.MATCH, Ui.Display.WRAP);
	content.addView(views.scroll, params);
	
	views.layout = new android.widget.LinearLayout(context);
	views.layout.setPadding(Ui.getY(10), 0, Ui.getY(10), 0);
	params = android.view.ViewGroup.LayoutParams
			(Ui.Display.MATCH, Ui.Display.WRAP);
	views.scroll.addView(views.layout, params);
};

ExplorerWindow.Path.prototype.getContent = function() {
	return this.content || null;
};

ExplorerWindow.Path.prototype.getWindow = function() {
	return this.window || null;
};

ExplorerWindow.Path.prototype.setWindow = function(window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this)
		== -1 && window.elements.push(this);
	let layout = window.views ? window.views.layout : null,
		content = this.getContent(), files = window.views ?
		window.views.files : null, scope = this;
	if (!layout || !content || !files) return this;
	let actor = new BoundsActor();
	actor.setDuration(600);
	window.beginDelayedActor(actor);
	let params = files.getLayoutParams();
	params.addRule(android.widget.RelativeLayout.BELOW, content.getId());
	layout.addView(content, 0);
	window.setOnExploreListener(function(window, file) {
		scope.__explore && scope.__explore(file);
		scope.updatePath();
	});
	this.window = window;
	return this;
};

ExplorerWindow.Path.prototype.getBackground = function() {
	return this.background || null;
};

ExplorerWindow.Path.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

ExplorerWindow.Path.prototype.addPathElement = function(view, extendsArrow) {
	if (!view) return;
	extendsArrow = extendsArrow === undefined ?
		(!!this.lastPath) : extendsArrow;
	(this.lastPath = view, extendsArrow && this.attachArrowToPath());
	view.setId(java.lang.String("path" + this.pathes.length).hashCode());
	this.pathes.push(this.views.layout.addView(view));
};

ExplorerWindow.Path.prototype.makePathClick = function(path) {
	let scope = this;
	return function() {
		let file = new java.io.File(path);
		file.exists() && scope.setPath(file.getPath());
	};
};

ExplorerWindow.Path.prototype.addPathIcon = function(src, file) {
	let path = new android.widget.ImageView(context);
	path.setImageDrawable(ImageFactory.getDrawable(src));
	path.setPadding(Ui.getY(10), Ui.getY(10), Ui.getY(10), Ui.getY(10));
	path.setScaleType(Ui.Scale.CENTER_CROP);
	path.setOnClickListener(this.makePathClick(file));
	let params = android.widget.LinearLayout.LayoutParams(Ui.getY(60), Ui.getY(60));
	return (path.setLayoutParams(params), this.addPathElement(path));
};

ExplorerWindow.Path.prototype.addPathText = function(text, file) {
	let path = new android.widget.TextView(context);
	text !== undefined && path.setText(text);
	typeface && path.setTypeface(typeface);
	path.setTextColor(Ui.Color.WHITE);
	path.setGravity(Ui.Gravity.CENTER);
	path.setTextSize(Ui.getFontSize(21));
	path.setPadding(Ui.getY(10), Ui.getY(10), Ui.getY(10), Ui.getY(10));
	path.setOnClickListener(this.makePathClick(file));
	let params = android.widget.LinearLayout.LayoutParams(Ui.Display.WRAP, Ui.Display.MATCH);
	return (path.setLayoutParams(params), this.addPathElement(path));
};

ExplorerWindow.Path.prototype.attachArrowToPath = function() {
	let path = new android.widget.ImageView(context);
	path.setImageDrawable(ImageFactory.getDrawable("explorerSelectionDivider"));
	path.setPadding(Ui.getY(10), Ui.getY(20), Ui.getY(10), Ui.getY(20));
	path.setScaleType(Ui.Scale.CENTER_CROP);
	let params = android.widget.LinearLayout.LayoutParams(Ui.getY(30), Ui.getY(60));
	return (path.setLayoutParams(params), this.addPathElement(path, false));
};

ExplorerWindow.Path.prototype.setPath = function(path) {
	let window = this.getWindow();
	window && window.setPath(path);
	this.updatePath();
};

ExplorerWindow.Path.prototype.updatePath = function() {
	let views = this.views, window = this.getWindow(),
		path = (window ? window.file.getPath() : Dirs.EXTERNAL) + "/";
	this.pathes = new Array();
	views.layout.removeAllViews();
	delete this.lastPath;
	let current = window ? window.root : Dirs.EXTERNAL + "/",
		pathFilter = path.replace(current, new String()),
		pathDivided = pathFilter.split("/");
	pathDivided.pop(), this.addPathIcon("explorerSelectionHome", current);
	for (let i = 0; i < pathDivided.length; i++) {
		current += pathDivided[i] + "/";
		if (pathDivided[i].length == 0) continue;
		this.addPathText(pathDivided[i], current);
	}
};

ExplorerWindow.Path.prototype.setOnExploreListener = function(listener) {
	let scope = this;
	listener && (this.__explore = function(file) {
		try { listener(scope, file); }
		catch (e) { reportError(e); }
	});
	return this;
};

ExplorerWindow.Path.prototype.setOnOutsideListener = function(listener) {
	listener && (this.__outside = function(scope) {
		try { listener(scope); }
		catch (e) { reportError(e); }
	});
	return this;
};

ExplorerWindow.prototype.addPath = function(actionOrPath, action) {
	let path = actionOrPath instanceof ExplorerWindow.Path ?
		actionOrPath : new ExplorerWindow.Path(this, actionOrPath);
	action && actionOrPath instanceof ExplorerWindow.Path &&
		actionOrPath.setOnExploreListener(action);
	this.indexOfElement(path) == -1 && this.getElements().push(path);
	return path;
};

ExplorerWindow.Rename = function(parentOrAction, action) {
	this.reset();
	if (parentOrAction instanceof ExplorerWindow) {
		this.setWindow(parentOrAction);
		action && this.setOnApproveListener(action);
	} else parentOrAction && this.setOnApproveListener(parentOrAction);
	this.setHint(translate("File name"));
	this.setTitle(translate("Export"));
	this.setBackground("popupBackground");
	this.formats = new Array();
};

ExplorerWindow.Rename.prototype.formatIndex = -1;

ExplorerWindow.Rename.prototype.reset = function() {
	let scope = this, views = this.views = new Object();
	let content = new android.widget.RelativeLayout(context);
	content.setId(java.lang.String("renameLayout").hashCode());
	let params = android.widget.RelativeLayout.LayoutParams
			(Ui.Display.MATCH, Ui.Display.WRAP);
	params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_BOTTOM);
	this.content = (content.setLayoutParams(params), content);
	
	views.approve = new android.widget.TextView(context);
	typeface && views.approve.setTypeface(typeface);
	views.approve.setSingleLine();
	views.approve.setTextColor(Ui.Color.GREEN);
	views.approve.setTextSize(Ui.getFontSize(27));
	views.approve.setId(java.lang.String("renameApprove").hashCode());
	views.approve.setPadding(Ui.getY(24), Ui.getY(24), Ui.getY(24), Ui.getY(24));
	views.approve.setOnClickListener(function() {
		scope.approve();
	});
	params = android.widget.RelativeLayout.LayoutParams
			(Ui.Display.WRAP, Ui.Display.WRAP);
	params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
	params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
	params.leftMargin = Ui.getY(24);
	content.addView(views.approve, params);
	
	views.format = new android.widget.TextView(context);
	typeface && views.format.setTypeface(typeface);
	views.format.setSingleLine();
	views.format.setTextColor(Ui.Color.WHITE);
	views.format.setTextSize(Ui.getFontSize(30));
	views.format.setId(java.lang.String("renameFormat").hashCode());
	views.format.setPadding(Ui.getY(16), Ui.getY(16), Ui.getY(16), Ui.getY(16));
	views.format.setOnClickListener(function() {
		scope.nextFormat();
	});
	params = android.widget.RelativeLayout.LayoutParams
			(Ui.Display.WRAP, Ui.Display.WRAP);
	params.addRule(android.widget.RelativeLayout.LEFT_OF, views.approve.getId());
	params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
	content.addView(views.format, params);
	
	views.name = new android.widget.EditText(context);
	views.name.setInputType(android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	views.name.setId(java.lang.String("renameValue").hashCode());
	views.name.setHintTextColor(Ui.Color.LTGRAY);
	views.name.setTextColor(Ui.Color.WHITE);
	views.name.setTextSize(Ui.getFontSize(24));
	typeface && views.name.setTypeface(typeface);
	params = android.widget.RelativeLayout.LayoutParams
			(Ui.Display.MATCH, Ui.Display.WRAP);
	params.addRule(android.widget.RelativeLayout.LEFT_OF, views.format.getId());
	params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
	params.setMargins(Ui.getY(8), Ui.getY(8), Ui.getY(8), Ui.getY(8));
	content.addView(views.name, params);
};

ExplorerWindow.Rename.prototype.getContent = function() {
	return this.content || null;
};

ExplorerWindow.Rename.prototype.getWindow = function() {
	return this.window || null;
};

ExplorerWindow.Rename.prototype.setWindow = function(window) {
	if (!window || typeof window != "object") return this;
	window.elements && window.elements.indexOf(this)
		== -1 && window.elements.push(this);
	let layout = window.views ? window.views.layout : null,
		content = this.getContent(), files = window.views ?
		window.views.files : null, scope = this;
	if (!layout || !content || !files) return this;
	let actor = new FadeActor();
	actor.setDuration(400);
	window.beginDelayedActor(actor);
	let params = files.getLayoutParams();
	params.addRule(android.widget.RelativeLayout.ABOVE, content.getId());
	layout.addView(content, 0);
	window.setOnApproveListener(function(window, files) {
		files && files[0] && scope.setCurrentName(files[0].getName());
		window && window.adapter && window.adapter.unselectAll();
	});
	this.window = window;
	return this;
};

ExplorerWindow.Rename.prototype.getBackground = function() {
	return this.background || null;
};

ExplorerWindow.Rename.prototype.setBackground = function(src) {
	let content = this.getContent();
	if (!content || !src) return this;
	this.background = src;
	content.setBackgroundDrawable(ImageFactory.getDrawable(src));
	return this;
};

ExplorerWindow.Rename.prototype.getCurrentName = function() {
	let name = String(this.views ? this.views.name ?
		this.views.name.getText().toString() : new String() : new String());
	if (name.length == 0) name = translate("project");
	return name + this.getCurrentFormat();
};

ExplorerWindow.Rename.prototype.setCurrentName = function(text) {
	if (!text) return;
	let format = Files.getNameExtension(text);
	if (format) this.setFormat("." + format);
	this.setName(Files.getNameWithoutExtension(text))
	return this;
};

ExplorerWindow.Rename.prototype.setName = function(text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.name.setText(String(text));
	return this;
};

ExplorerWindow.Rename.prototype.getCurrentFile = function() {
	let window = this.getWindow(),
		directory = window ? window.getDirectory() : null;
	if (!directory) return null;
	return new java.io.File(directory, this.getCurrentName());
};

ExplorerWindow.Rename.prototype.approve = function() {
	this.__approve && this.__approve(this, this.getCurrentFile(), this.getCurrentName());
	return this;
};

ExplorerWindow.Rename.prototype.nextFormat = function() {
	if (!this.formats || this.formats.length == 0)
		return;
	if (this.formatIndex > this.formats.length - 2) {
		this.formatIndex = 0;
	} else this.formatIndex++;
	this.setFormat(this.formatIndex);
	return this;
};

ExplorerWindow.Rename.prototype.setFormat = function(indexOrFormat) {
	let index = typeof indexOrFormat == "number" ?
		indexOrFormat : this.formats.indexOf(indexOrFormat);
	let format = this.views ? this.views.format : null;
	if (!format || index < 0) return;
	this.formatIndex = index;
	format.setText(this.formats[index]);
	return this;
};

ExplorerWindow.Rename.prototype.getCurrentFormat = function() {
	return this.formats[this.formatIndex];
};

ExplorerWindow.Rename.prototype.setAvailabledTypes = function(types) {
	this.formats = types;
	this.formatIndex = -1;
	this.nextFormat();
	return this;
};

ExplorerWindow.Rename.prototype.getTitle = function() {
	let views = this.views;
	if (!views) return null;
	return views.approve.getText();
};

ExplorerWindow.Rename.prototype.setTitle = function(text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.approve.setText(String(text).toUpperCase());
	return this;
};

ExplorerWindow.Rename.prototype.getHint = function() {
	let views = this.views;
	if (!views) return null;
	return views.name.getHint();
};

ExplorerWindow.Rename.prototype.setHint = function(text) {
	let content = this.getContent(), views = this.views;
	if (!content || !views) return this;
	views.name.setHint(String(text));
	return this;
};

ExplorerWindow.Rename.prototype.setOnApproveListener = function(listener) {
	listener && (this.__approve = function(rename, file, name) {
		try { listener(rename, file, name); }
		catch (e) { reportError(e); }
	});
	return this;
};

ExplorerWindow.prototype.addRename = function(actionOrRename, action) {
	let rename = actionOrRename instanceof ExplorerWindow.Rename ?
		actionOrRename : new ExplorerWindow.Rename(this, actionOrRename);
	action && actionOrRename instanceof ExplorerWindow.Rename &&
		actionOrRename.setOnApproveListener(action);
	this.indexOfElement(rename) == -1 && this.getElements().push(rename);
	return rename;
};

const ExplorerAdapter = function(array, root, mode) {
	array && this.setItems(array);
	root && this.setRoot(root);
	mode >= 0 && this.setMode(mode);
};

ExplorerAdapter.prototype = new JavaAdapter(android.widget.BaseAdapter, android.widget.Adapter, {
	array: new Array(),
	approves: new Array(),
	choice: Ui.Choice.NONE,
	direct: __dir__,
	getCount: function() {
		return this.array.length;
	},
	getItem: function(position) {
		let item = this.array[position], file = this.getFile(position),
		    extension = Files.getExtension(file), date = new java.util.Date(file.
			lastModified()), format = new java.text.SimpleDateFormat(), obj = {
			    name: extension ? item.replace("." + extension, new String()) : item,
			    date: (format.applyPattern("d MMM, yyyy"), format.format(date)),
			    time: (format.applyPattern("k:mm"), format.format(date)),
				type: Files.getExtensionType(file), isDirectory: file.isDirectory(),
				isApproved: this.isApproved(position) == true, file: file
		    };
		if (obj.isDirectory) obj.filesCount = file.list().length;
		else obj.size = Files.prepareSize(file);
		if (extension) obj.extension = extension.toUpperCase();
		return obj;
	},
	getItemId: function(position) {
		return position;
	},
	getItems: function() {
		return this.array;
	},
	getApproved: function() {
		return this.approves;
	},
	getApprovedCount: function() {
		return this.approves.length;
	},
	getMode: function() {
		return this.mode;
	},
	getFile: function(position) {
		position = parseInt(position);
		return new java.io.File(this.direct, this.array[position]);
	},
	getApprovedFiles: function() {
		let files = new Array(), approves = this.getApproved();
		for (let i = 0; i < this.getApprovedCount(); i++) {
			files.push(this.getFile(approves[i]));
		}
		return files;
	},
	getView: function(position, convertView, parent) {
		let view = convertView ? convertView : this.makeItemLayout(),
		    item = this.getItem(position);
		view.post(function() {
		    view.setBackgroundDrawable(item.isApproved ?
		        ImageFactory.getDrawable("popupSelectionSelected") : null);
		    view.findViewById(java.lang.String("fileName")
		        .hashCode()).setText(item.name);
		    view.findViewById(java.lang.String("fileSize").hashCode())
		        .setText((item.extension ? item.extension : new String()) + (item.extension
			        && item.size ? " / " : new String()) + (item.size ? item.size : new String()) +
				    (item.isDirectory ? translateCounter(item.filesCount, "no files", "%s1 file",
					"%s" + (item.filesCount % 10) + " files", "%s files", [item.filesCount]) : new String()));
		    view.findViewById(java.lang.String("fileDate")
		        .hashCode()).setText(item.date);
		    let info = view.findViewById(java.lang.String("fileInfo").hashCode());
		    if (item.type == "image") info.setText(ImageFactory.checkSize(item.file));
		    else info.setText(item.time);
		    let icon = view.findViewById(java.lang.String("fileIcon").hashCode());
		    icon.setImageDrawable(ImageFactory.getDrawable(item.isDirectory ? "explorerFolder" : item.type ?
				"explorerExtension" + item.type.charAt(0).toUpperCase() + item.type.substring(1) : "explorerFile"));
		});
		return view;
	},
	isApproved: function(position) {
		position = parseInt(position);
		return this.approves.indexOf(position) != -1;
	},
	isCanBeApproved: function() {
		return this.getApprovedCount() > 0;
	},
	isDirectory: function(position) {
		return this.getFile(position).isDirectory();
	},
	makeItemLayout: function() {
		let layout = new android.widget.RelativeLayout(context);
		let params = android.view.ViewGroup.LayoutParams(Ui.Display.MATCH, Ui.Display.WRAP);
		layout.setLayoutParams(params);
		
		let icon = new android.widget.ImageView(context);
		icon.setPadding(Ui.getY(20), Ui.getY(20), Ui.getY(20), Ui.getY(20));
		icon.setScaleType(Ui.Scale.CENTER_CROP);
		icon.setId(java.lang.String("fileIcon").hashCode());
		params = android.widget.RelativeLayout.LayoutParams(Ui.getY(75), Ui.getY(100));
		params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_LEFT);
		params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
		params.rightMargin = Ui.getY(15);
		layout.addView(icon, params);
		
		let additional = new android.widget.LinearLayout(context);
		additional.setOrientation(Ui.Orientate.VERTICAL);
		additional.setGravity(Ui.Gravity.RIGHT);
		additional.setPadding(Ui.getY(30), 0, Ui.getY(30), 0);
		additional.setId(java.lang.String("additionalInfo").hashCode());
		params = android.widget.RelativeLayout.LayoutParams(Ui.Display.WRAP, Ui.Display.WRAP);
		params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
		params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
		layout.addView(additional, params);
		
		let date = new android.widget.TextView(context);
		typeface && date.setTypeface(typeface);
		date.setGravity(Ui.Gravity.RIGHT);
		date.setTextSize(Ui.getFontSize(21));
		date.setTextColor(Ui.Color.LTGRAY);
		date.setId(java.lang.String("fileDate").hashCode());
		additional.addView(date);
		
		let info = new android.widget.TextView(context);
		typeface && info.setTypeface(typeface);
		info.setGravity(Ui.Gravity.RIGHT);
		info.setTextSize(Ui.getFontSize(21));
		info.setTextColor(Ui.Color.LTGRAY);
		info.setId(java.lang.String("fileInfo").hashCode());
		additional.addView(info);
		
		let uniqal = new android.widget.LinearLayout(context);
		uniqal.setOrientation(Ui.Orientate.VERTICAL);
		uniqal.setId(java.lang.String("uniqalInfo").hashCode());
		params = android.widget.RelativeLayout.LayoutParams(Ui.Display.WRAP, Ui.Display.WRAP);
		params.addRule(android.widget.RelativeLayout.LEFT_OF, java.lang.String("additionalInfo").hashCode());
		params.addRule(android.widget.RelativeLayout.RIGHT_OF, java.lang.String("fileIcon").hashCode());
		params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
		uniqal.post(function() { uniqal.requestLayout(); });
		layout.addView(uniqal, params);
		
		let name = new android.widget.TextView(context);
		typeface && name.setTypeface(typeface);
		name.setTextSize(Ui.getFontSize(22.5));
		name.setTextColor(Ui.Color.WHITE);
		name.setId(java.lang.String("fileName").hashCode());
		uniqal.addView(name);
		
		let size = new android.widget.TextView(context);
		typeface && size.setTypeface(typeface);
		size.setTextSize(Ui.getFontSize(21));
		size.setTextColor(Ui.Color.LTGRAY);
		size.setId(java.lang.String("fileSize").hashCode());
		uniqal.addView(size);
		return layout;
	},
	setItems: function(array) {
		this.array = array;
		this.unselectAll();
	},
	setMode: function(mode) {
		this.choice = mode;
	},
	setRoot: function(root) {
		this.direct = root;
	},
	setOnSelectListener: function(listener) {
		this.__select = listener;
	},
	setOnUnselectListener: function(listener) {
		this.__unselect = listener;
	},
	selectItem: function(position) {
		position = parseInt(position);
		if (this.previous !== undefined) {
			let last = this.approves.indexOf(this.previous);
			if (last != -1 && this.choice == Ui.Choice.SINGLE) {
				this.approves.splice(last, 1);
			}
		}
		if (position !== undefined) {
		    let selected = this.approves.indexOf(position);
			if (this.choice == Ui.Choice.SINGLE) {
			    this.__select && this.__select(position, selected);
				this.approves.push(position);
				this.previous = position;
		    } else if (selected != -1) {
				this.__unselect && this.__unselect(position, selected);
			    this.approves.splice(selected, 1);
				this.getApprovedCount() == 0 && this.setMode(Ui.Choice.SINGLE);
		    } else {
				this.__select && this.__select(position, selected);
				this.approves.push(position);
			}
		}
		this.notifyDataSetChanged();
	},
	selectAll: function() {
		this.approves = new Array();
		for (let i = 0; i < this.getCount(); i++) {
			approves.push(this.getItemId(i));
		}
		this.notifyDataSetChanged();
	},
	unselectAll: function() {
		this.approves = new Array();
		this.notifyDataSetChanged();
	}
});
