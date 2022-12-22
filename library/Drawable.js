/*

   Copyright 2022 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
LIBRARY({
    name: "Drawable",
    version: 1,
    api: "AdaptedScript",
    dependencies: ["Retention:1"],
    shared: true
});
IMPORT("Retention:1");
HashedDrawableMap = {};
HashedDrawableMap.attachedViews = {};
HashedDrawableMap.attachedAsImage = {};
HashedDrawableMap.attachedAsBackground = {};
HashedDrawableMap.isImageAttachedToView = function (view) {
    return this.attachedAsImage.hasOwnProperty(view);
};
HashedDrawableMap.isBackgroundAttachedToView = function (view) {
    return this.attachAsBackground.hasOwnProperty(view);
};
HashedDrawableMap.isAttachedToView = function (view) {
    if (this.attachedViews.hasOwnProperty(view)) {
        if (view && view.isAttachedToWindow) {
            return view.isAttachedToWindow();
        }
        // That's not view, right?
        return true;
    }
    return false;
};
HashedDrawableMap.getDrawableAttachedToViewAsImage = function (view) {
    return this.attachedAsImage[view] || null;
};
HashedDrawableMap.getDrawableAttachedToViewAsBackground = function (view) {
    return this.attachedAsBackground[view] || null;
};
HashedDrawableMap.getDrawablesAttachedToView = function (view) {
    var image = this.getDrawableAttachedToViewAsImage(view), background = this.getDrawableAttachedToViewAsBackground(view);
    if (image != background)
        return [image, background];
    return [image];
};
HashedDrawableMap.getAttachedViewsInMap = function (map, drawable) {
    var attached = [];
    if (map == null || typeof map != "object") {
        return attached;
    }
    for (var element in map) {
        if (map[element] == drawable) {
            var view = this.attachedViews[element];
            if (view != null)
                attached.push(view);
        }
    }
    return attached;
};
HashedDrawableMap.getAsImageAttachedViews = function (drawable) {
    return this.getAttachedViewsInMap(this.attachedAsImage, drawable);
};
HashedDrawableMap.getAsBackgroundAttachedViews = function (drawable) {
    return this.getAttachedViewsInMap(this.attachedAsBackground, drawable);
};
HashedDrawableMap.getAttachedViews = function (drawable) {
    return this.getAsImageAttachedViews(drawable).concat(this.getAsBackgroundAttachedViews(drawable));
};
HashedDrawableMap.attachInMap = function (map, view, drawable) {
    var attached = false;
    if (!this.isAttachedToView(view)) {
        this.attachedViews[view] = view;
        attached = true;
    }
    if (!map.hasOwnProperty(view) || map[view] != drawable) {
        map[view] = drawable;
        return true;
    }
    return attached;
};
HashedDrawableMap.attachAsImage = function (view, drawable) {
    return this.attachInMap(this.attachedAsImage, view, drawable);
};
HashedDrawableMap.attachAsBackground = function (view, drawable) {
    return this.attachInMap(this.attachedAsBackground, view, drawable);
};
HashedDrawableMap.deattachInMap = function (map, view) {
    var deattached = false;
    if (map.hasOwnProperty(view)) {
        delete map[view];
        deattached = true;
    }
    if (!this.isAttachedToAsImage(view) && !this.isAttachedToAsBackground(view)) {
        delete this.attachedViews[view];
        return true;
    }
    return deattached;
};
HashedDrawableMap.deattachAsImage = function (view) {
    return this.deattachInMap(this.attachedAsImage, view);
};
HashedDrawableMap.deattachAsBackground = function (view) {
    return this.deattachInMap(this.attachedAsBackground, view);
};
DrawableFactory = {};
DrawableFactory.setAlpha = function (drawable, alpha) {
    drawable.setAlpha(Number(alpha));
};
DrawableFactory.setAntiAlias = function (drawable, enabled) {
    drawable.setAntiAlias(Boolean(enabled));
};
DrawableFactory.setAutoMirrored = function (drawable, enabled) {
    drawable.setAutoMirrored(Boolean(enabled));
};
DrawableFactory.setFilterBitmap = function (drawable, enabled) {
    drawable.setFilterBitmap(Boolean(enabled));
};
DrawableFactory.setTintColor = function (drawable, color) {
    color = ColorDrawable.parseColor(color);
    if (android.os.Build.VERSION.SDK_INT >= 29) {
        var filter = new android.graphics.BlendModeColorFilter(color, android.graphics.BlendMode.SRC_ATOP);
        drawable.setColorFilter(filter);
        return;
    }
    drawable.setColorFilter(color, android.graphics.PorterDuff.Mode.SRC_ATOP);
};
DrawableFactory.setMipMap = function (drawable, enabled) {
    drawable.setMipMap(Boolean(enabled));
};
DrawableFactory.setColorFilter = function (drawable, filter) {
    drawable.setColorFilter(filter);
};
DrawableFactory.setTileMode = function (drawable, modesOrX, y) {
    if (Array.isArray(modesOrX)) {
        y = modesOrX[1];
        modesOrX = modesOrX[0];
    }
    if (modesOrX === undefined) {
        modesOrX = android.graphics.Shader.TileMode.CLAMP;
    }
    if (y !== undefined) {
        drawable.setTileModeX(modesOrX);
        drawable.setTileModeY(y);
        return;
    }
    drawable.setTileModeXY(modesOrX);
};
DrawableFactory.setGravity = function (drawable, gravity) {
    drawable.setGravity(Number(gravity));
};
DrawableFactory.setLayoutDirection = function (drawable, direction) {
    drawable.setLayoutDirection(Number(direction));
};
DrawableFactory.setXfermode = function (drawable, mode) {
    drawable.setXfermode(mode);
};
DrawableFactory.setLevel = function (drawable, level) {
    return drawable.setLevel(Number(level));
};
DrawableFactory.setState = function (drawable, states) {
    if (!Array.isArray(states))
        states = [states];
    states = states.map(function (state) {
        return Number(state);
    });
    return drawable.setState(states);
};
DrawableFactory.setVisible = function (drawable, first, second) {
    if (Array.isArray(first)) {
        second = first[1];
        first = first[0];
    }
    if (second === undefined) {
        second = first;
    }
    return drawable.setVisible(Boolean(first), Boolean(second));
};
BitmapFactory = {};
BitmapFactory.decodeBytes = function (bytes, options) {
    try {
        if (options !== undefined) {
            return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
        }
        return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
    }
    catch (e) {
        Logger.Log("Drawable: BitmapFactory failed to decode bytes " + bytes, "WARNING");
    }
    return null;
};
BitmapFactory.decodeFile = function (path, options) {
    var file = path instanceof java.io.File ? path : new java.io.File(path);
    try {
        if (options !== undefined) {
            return android.graphics.BitmapFactory.decodeFile(file, options);
        }
        return android.graphics.BitmapFactory.decodeFile(file);
    }
    catch (e) {
        Logger.Log("Drawable: BitmapFactory failed to decode file " + file.getName(), "WARNING");
    }
    return null;
};
BitmapFactory.decodeAsset = function (path, options) {
    try {
        var file = new java.io.File(__dir__ + "assets", path);
        if (!file.exists() || file.isDirectory()) {
            file = new java.io.File(file.getPath() + ".dnr");
        }
        return this.decodeFile(file, options);
    }
    catch (e) {
        Logger.Log("Drawable: BitmapFactory failed to decode asset " + path, "WARNING");
    }
    return null;
};
BitmapFactory.createScaled = function (bitmap, dx, dy) {
    if (dy === undefined)
        dy = dx;
    var width = bitmap.getWidth(), height = bitmap.getHeight();
    bitmap = android.graphics.Bitmap.createBitmap(bitmap, 0, 0, width, height);
    if (dy === undefined)
        return bitmap;
    return android.graphics.Bitmap.createScaledBitmap(bitmap, dx, dy, false);
};
BitmapDrawableFactory = {};
BitmapDrawableFactory.required = {};
BitmapDrawableFactory.mapped = {};
BitmapDrawableFactory.getMappedFileByKey = function (key) {
    return this.mapped[key] || null;
};
BitmapDrawableFactory.requireByKey = function (key, options) {
    if (this.isRequired(key)) {
        return this.required[key];
    }
    if (this.mapped.hasOwnProperty(key)) {
        var file = this.getMappedFileByKey(key);
        this.required[key] = BitmapFactory.decodeFile(file, options);
        return this.requireByKey(key);
    }
    log("Drawable: Bitmap " + key + " not found or mapped incorrecly");
    return null;
};
BitmapDrawableFactory.findMappedByTag = function (tag) {
    var mapped = [];
    for (var key in this.mapped) {
        if (tag == "*") {
            mapped.push(key);
            continue;
        }
        var element = String(key).toLowerCase();
        if (element.indexOf(tag) != -1) {
            mapped.push(key);
        }
    }
    return mapped;
};
BitmapDrawableFactory.getRequiredCount = function () {
    var count = 0;
    for (var element in this.required) {
        count++;
    }
    return count;
};
BitmapDrawableFactory.isRequired = function (key) {
    return this.required.hasOwnProperty(key);
};
BitmapDrawableFactory.generateKeyFor = function (path, root) {
    if (root === undefined) {
        var parent = new java.io.File(path).getParentFile();
        root = String(parent.getPath());
    }
    if (root != false) {
        path = String(path).replace(String(root), String());
    }
    var splited = String(path).split("/");
    var key, previous;
    do {
        var next = splited.shift();
        if (splited.length == 0) {
            var index = next.lastIndexOf(".");
            if (index > 0) {
                next = next.substring(0, index);
            }
        }
        if (key === undefined) {
            key = next;
        }
        else if (previous != next) {
            key += next.charAt(0).toUpperCase();
            if (next.length > 1) {
                key += next.substring(1);
            }
        }
        previous = next;
    } while (splited.length > 0);
    if (key !== undefined) {
        return key.replace(/\W/g, String());
    }
    MCSystem.throwException("Drawable: invalid path provided in BitmapDrawableFactory: " + path);
};
BitmapDrawableFactory.getMappedCount = function () {
    var count = 0;
    for (var element in this.mapped) {
        count++;
    }
    return count;
};
BitmapDrawableFactory.isMapped = function (key) {
    return this.mapped.hasOwnProperty(key);
};
BitmapDrawableFactory.map = function (file, root) {
    if (file instanceof java.io.File) {
        file = file.getPath();
    }
    if (root === undefined)
        root = file;
    var key = this.generateKeyFor(file, root);
    return this.mapAs(key, file);
};
BitmapDrawableFactory.mapAs = function (key, file) {
    if (!(file instanceof java.io.File)) {
        file = new java.io.File(file);
    }
    this.mapped[key] = file;
    return key;
};
BitmapDrawableFactory.MIME_TYPES = [".png", ".jpg", ".jpeg", ".bmp"];
BitmapDrawableFactory.listFileNames = function (path, explore, root) {
    var files = [], file = new java.io.File(path);
    if (root === undefined)
        root = path;
    if (file.isFile())
        return [String(path).replace(root, String())];
    if (!String(root).endsWith("/") && String(root).length > 0) {
        root += "/";
    }
    var list = file.listFiles() || [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].isFile()) {
            files.push(String(list[i]).replace(root, String()));
        }
        else if (explore) {
            files = files.concat(BitmapDrawableFactory.listFileNames(list[i], explore, root));
        }
    }
    return files.sort();
};
BitmapDrawableFactory.mapDirectory = function (path, explore, root) {
    var mapped = [];
    if (path instanceof java.io.File) {
        path = path.getPath();
    }
    if (root === undefined)
        root = path;
    var entries = (function () {
        var files = BitmapDrawableFactory.listFileNames(path, explore, root), formatted = [];
        for (var item in BitmapDrawableFactory.MIME_TYPES) {
            for (var name in files) {
                if (files[name].endsWith(BitmapDrawableFactory.MIME_TYPES[item])) {
                    formatted.push(files[name]);
                }
            }
        }
        return formatted.sort();
    })();
    for (var i = 0; i < entries.length; i++) {
        var entry = new java.io.File(root, entries[i]);
        mapped.push(this.map(entry, root));
    }
    return mapped;
};
BitmapDrawableFactory.require = function (value, options) {
    if (value instanceof android.graphics.Bitmap) {
        if (this.isRequired(value))
            return this.required[value];
        return this.required[value] = value;
    }
    else if (String(value).endsWith(".dnr")) {
        if (this.isRequired(value))
            return this.required[value];
        var asset = BitmapFactory.decodeAsset(value, options);
        return this.required[value] = asset;
    }
    else if (String(value).indexOf("/") != -1 || (value instanceof java.io.File)) {
        if (this.isRequired(value))
            return this.required[value];
        var file = BitmapFactory.decodeFile(value, options);
        return this.required[value] = file;
    }
    return this.requireByKey(value, options);
};
BitmapDrawableFactory.wrap = function (value, options) {
    var required = this.require(value, options);
    if (required == null)
        return required;
    return BitmapFactory.createScaled(required);
};
BitmapDrawableFactory.sameAs = function (from, to) {
    if (to instanceof android.graphics.Bitmap) {
        if (from instanceof android.graphics.Bitmap) {
            return from.sameAs(to);
        }
    }
    if (from instanceof java.io.File) {
        from = from.getPath();
    }
    if (to instanceof java.io.File) {
        to = to.getPath();
    }
    return from == to;
};
BitmapDrawableFactory.recycle = function (key) {
    if (this.isRequired(key)) {
        var required = this.required[key];
        if (required && !required.isRecycled()) {
            required.recycle();
        }
        return delete this.required[key];
    }
    return false;
};
BitmapDrawableFactory.recycleRequired = function () {
    for (var key in this.required) {
        this.recycle(key);
    }
};
AnimationDrawableFactory = {};
AnimationDrawableFactory.setEnterFadeDuration = function (drawable, duration) {
    drawable.setEnterFadeDuration(Number(duration));
};
AnimationDrawableFactory.setExitFadeDuration = function (drawable, duration) {
    drawable.setExitFadeDuration(Number(duration));
};
AnimationDrawableFactory.setOneShot = function (drawable, enabled) {
    drawable.setOneShot(Boolean(enabled));
};
Drawable = new Function();
Drawable.prototype.isAttachedAsImage = function (view) {
    if (!view)
        return HashedDrawableMap.getAsImageAttachedViews(this).length > 0;
    return HashedDrawableMap.getDrawableAttachedToViewAsImage(view) == this;
};
Drawable.prototype.isAttachedAsBackground = function (view) {
    if (!view)
        return HashedDrawableMap.getAsBackgroundAttachedViews(this).length > 0;
    return HashedDrawableMap.getDrawableAttachedToViewAsBackground(view) == this;
};
Drawable.prototype.isAttached = function (view) {
    if (!view)
        return HashedDrawableMap.getAttachedViews(this).length > 0;
    return HashedDrawableMap.getDrawablesAttachedToView(view).indexOf(this) != -1;
};
Drawable.prototype.toDrawable = function () {
    return null;
};
Drawable.prototype.attachAsImage = function (view, force) {
    if (view && view.setImageDrawable !== undefined) {
        if (force || HashedDrawableMap.attachAsImage(view, this)) {
            view.setImageDrawable(this.toDrawable());
            return true;
        }
    }
    return false;
};
Drawable.prototype.deattachAsImage = function (view) {
    if (view && view.setImageDrawable !== undefined) {
        if (HashedDrawableMap.getDrawableAttachedToViewAsImage(view) == this) {
            if (HashedDrawableMap.deattachAsImage(view)) {
                view.setImageDrawable(null);
                return true;
            }
        }
        return false;
    }
    var attached = HashedDrawableMap.getAsImageAttachedViews(this);
    for (var i = 0; i < attached.length; i++) {
        this.deattachAsImage(attached[i]);
    }
    return attached.length > 0;
};
Drawable.prototype.attachAsBackground = function (view, force) {
    if (view && view.setBackgroundDrawable !== undefined) {
        if (force || HashedDrawableMap.attachAsBackground(view, this)) {
            view.setBackgroundDrawable(this.toDrawable());
            return true;
        }
    }
    return false;
};
Drawable.prototype.deattachAsBackground = function (view) {
    if (view && view.setBackgroundDrawable !== undefined) {
        if (HashedDrawableMap.getDrawableAttachedToViewAsBackground(view) == this) {
            if (HashedDrawableMap.deattachAsBackground(view)) {
                view.setBackgroundDrawable(null);
                return true;
            }
        }
        return false;
    }
    var attached = HashedDrawableMap.getAsBackgroundAttachedViews(this);
    for (var i = 0; i < attached.length; i++) {
        this.deattachAsBackground(attached[i]);
    }
    return attached.length > 0;
};
Drawable.prototype.requestDeattach = function (view) {
    var deattached = this.deattachAsImage(view);
    return this.deattachAsBackground(view) || deattached;
};
Drawable.prototype.reattachAsImage = function (view) {
    if (view && view.setImageDrawable !== undefined) {
        return this.attachAsImage(view, true);
    }
    var attached = HashedDrawableMap.getAsImageAttachedViews(this);
    for (var i = 0; i < attached.length; i++) {
        this.attachAsImage(attached[i], true);
    }
    return attached.length > 0;
};
Drawable.prototype.reattachAsBackground = function (view) {
    if (view && view.setBackgroundDrawable !== undefined) {
        return this.attachAsBackground(view, true);
    }
    var attached = HashedDrawableMap.getAsBackgroundAttachedViews(this);
    for (var i = 0; i < attached.length; i++) {
        this.attachAsBackground(attached[i], true);
    }
    return attached.length > 0;
};
Drawable.prototype.requestReattach = function (view) {
    var attached = this.reattachAsImage(view);
    return this.reattachAsBackground(view) || attached;
};
Drawable.prototype.toString = function () {
    return "[Drawable " + this.toDrawable() + "]";
};
CachedDrawable = function () {
    Drawable.call(this);
    if (this.cacheWhenCreate) {
        this.toDrawable();
    }
};
CachedDrawable.prototype = new Drawable;
CachedDrawable.prototype.cacheWhenCreate = false;
CachedDrawable.prototype.toDrawable = function () {
    if (!this.isProcessed()) {
        try {
            var drawable = this.process();
            if (!this.isProcessed()) {
                if (drawable)
                    this.describe(drawable);
                this.source = drawable;
            }
        }
        catch (e) {
            Logger.Log("Drawable: CachedDrawable.toDrawable: " + e, "WARNING");
        }
    }
    return this.source || null;
};
CachedDrawable.prototype.isProcessed = function () {
    return this.source !== undefined;
};
CachedDrawable.prototype.process = function () {
    MCSystem.throwException("Drawable: CachedDrawable.process must be implemented");
};
CachedDrawable.prototype.getDescriptor = function () {
    return this.descriptor || null;
};
CachedDrawable.prototype.setDescriptor = function (descriptor) {
    if (descriptor != null && typeof descriptor == "object") {
        this.descriptor = descriptor;
        this.requireDescribe();
    }
    else
        delete this.descriptor;
};
CachedDrawable.prototype.describe = function (drawable) {
    var descriptor = this.getDescriptor();
    if (descriptor != null) {
        Drawable.applyDescribe.call(this, drawable, descriptor);
    }
};
CachedDrawable.prototype.requireDescribe = function () {
    if (this.isProcessed()) {
        var drawable = this.toDrawable();
        if (drawable)
            this.describe(drawable);
        return;
    }
    this.toDrawable();
};
CachedDrawable.prototype.invalidate = function () {
    delete this.source;
    if (this.cacheWhenCreate) {
        this.toDrawable();
    }
    this.requestReattach();
};
ColorDrawable = function (color) {
    if (color !== undefined) {
        this.setColor(color);
    }
    Drawable.call(this);
};
ColorDrawable.prototype = new Drawable;
ColorDrawable.prototype.toDrawable = function () {
    return new android.graphics.drawable.ColorDrawable(this.getColor());
};
ColorDrawable.prototype.getColor = function () {
    return this.color !== undefined ? this.color : android.graphics.Color.TRANSPARENT;
};
ColorDrawable.prototype.setColor = function (color) {
    if (color !== undefined) {
        this.color = ColorDrawable.parseColor(color);
    }
    else
        delete this.color;
    this.requestReattach();
};
ColorDrawable.prototype.toString = function () {
    return "[ColorDrawable " + this.getColor() + "]";
};
ColorDrawable.parseColor = function (value) {
    if (typeof value == "number") {
        return value;
    }
    else if (value) {
        var stroke = String(value);
        if (stroke.startsWith("#")) {
            return android.graphics.Color.parseColor(stroke);
        }
        stroke = stroke.toUpperCase();
        try {
            return android.graphics.Color[stroke];
        }
        catch (e) {
            // Not found
        }
    }
};
ScheduledDrawable = function () {
    CachedDrawable.call(this);
};
ScheduledDrawable.prototype = new CachedDrawable;
ScheduledDrawable.prototype.toDrawable = function () {
    var self = this;
    if (!this.isProcessed() && !this.isProcessing()) {
        var thread_1 = this.thread = handleThread(function () {
            if (self.getThread() == thread_1) {
                self.toDrawableInThread();
            }
            if (self.getThread() == thread_1) {
                handle(function () {
                    if (self.isProcessed()) {
                        self.requestReattach();
                    }
                });
                delete self.thread;
            }
        });
    }
    return this.source || null;
};
ScheduledDrawable.prototype.toDrawableInThread = function () {
    return CachedDrawable.prototype.toDrawable.call(this);
};
ScheduledDrawable.prototype.getThread = function () {
    return this.thread || null;
};
ScheduledDrawable.prototype.isProcessing = function () {
    return this.thread !== undefined;
};
ScheduledDrawable.prototype.invalidate = function () {
    if (this.isProcessing()) {
        this.getThread().interrupt();
        delete this.thread;
    }
    CachedDrawable.prototype.invalidate.apply(this, arguments);
};
ScheduledDrawable.prototype.toString = function () {
    return "[ScheduledDrawable object]";
};
LayerDrawable = function (layers) {
    this.clearLayers();
    if (layers !== undefined) {
        this.addLayers(layers);
    }
    ScheduledDrawable.call(this);
};
LayerDrawable.prototype = new ScheduledDrawable;
LayerDrawable.prototype.process = function () {
    var layers = [];
    for (var i = 0; i < this.getLayerCount(); i++) {
        var drawable = this.getLayerAt(i);
        if (drawable instanceof ScheduledDrawable) {
            if (!drawable.isProcessed()) {
                drawable.toDrawable();
                while (drawable.isProcessing()) {
                    java.lang.Thread.yield();
                }
            }
        }
        if (drawable instanceof Drawable) {
            layers.push(drawable.toDrawable());
        }
        else
            layers.push(drawable);
    }
    return new android.graphics.drawable.LayerDrawable(layers);
};
LayerDrawable.prototype.clearLayers = function () {
    this.layers = [];
    this.invalidate();
};
LayerDrawable.prototype.getLayers = function () {
    return this.layers;
};
LayerDrawable.prototype.getLayerCount = function () {
    return this.getLayers().length;
};
LayerDrawable.prototype.indexOfLayer = function (layer) {
    return this.getLayers().indexOf(layer);
};
LayerDrawable.prototype.getLayerAt = function (index) {
    return this.getLayers()[index] || null;
};
LayerDrawable.prototype.addLayer = function (layer) {
    this.getLayers().push(layer);
    this.invalidate();
};
LayerDrawable.prototype.addLayers = function (layers) {
    if (!Array.isArray(layers))
        layers = [layers];
    this.layers = this.getLayers().concat(layers);
    this.invalidate();
};
LayerDrawable.prototype.hasLayer = function (layer) {
    return this.getLayers().indexOf(layer) != -1;
};
LayerDrawable.prototype.removeLayer = function (layer) {
    var layers = this.getLayers(), index = layers.indexOf(layer);
    if (index == -1)
        return;
    layers.splice(index, 1);
    this.invalidate();
};
LayerDrawable.prototype.toString = function () {
    return "[LayerDrawable " + this.getLayers() + "]";
};
ClipDrawable = function (drawable, location, side) {
    if (drawable !== undefined) {
        this.setDrawable(drawable);
    }
    if (location !== undefined) {
        this.setLocation(location);
    }
    if (side !== undefined) {
        this.setSide(side);
    }
    ScheduledDrawable.call(this);
};
ClipDrawable.prototype = new ScheduledDrawable;
ClipDrawable.prototype.process = function () {
    var drawable = this.getDrawable();
    if (drawable !== undefined) {
        if (drawable instanceof ScheduledDrawable) {
            if (!drawable.isProcessed()) {
                drawable.toDrawable();
                while (drawable.isProcessing()) {
                    java.lang.Thread.yield();
                }
            }
        }
        if (drawable instanceof Drawable) {
            drawable = drawable.toDrawable();
        }
    }
    return new android.graphics.drawable.ClipDrawable(drawable, this.getLocation(), this.getSide());
};
ClipDrawable.prototype.getDrawable = function () {
    return this.drawable !== undefined ? this.drawable : null;
};
ClipDrawable.prototype.setDrawable = function (drawable) {
    if (drawable !== undefined) {
        this.drawable = drawable;
    }
    else
        delete this.drawable;
    this.invalidate();
};
ClipDrawable.prototype.getLocation = function () {
    return this.location !== undefined ? this.location : android.view.Gravity.LEFT;
};
ClipDrawable.prototype.setLocation = function (location) {
    this.location = Number(location);
    this.invalidate();
};
ClipDrawable.prototype.getSide = function () {
    return this.side !== undefined ? this.side : ClipDrawable.Side.HORIZONTAL;
};
ClipDrawable.prototype.setSide = function (side) {
    if (typeof side == "string") {
        if (ClipDrawable.Side.hasOwnProperty(side)) {
            side = ClipDrawable.Side[side];
        }
    }
    this.side = Number(side);
    this.invalidate();
};
ClipDrawable.prototype.toString = function () {
    return "[ClipDrawable " + this.getDrawable() + "@" + this.getLocation() + ":" + this.getSide() + "]";
};
ClipDrawable.Side = {};
ClipDrawable.Side.HORIZONTAL = 1;
ClipDrawable.Side.VERTICAL = 2;
BitmapDrawable = function (bitmap, options) {
    if (options !== undefined) {
        this.setOptions(options);
    }
    if (bitmap !== undefined) {
        this.setBitmap(bitmap);
    }
    ScheduledDrawable.call(this);
};
BitmapDrawable.prototype = new ScheduledDrawable;
BitmapDrawable.prototype.process = function () {
    var bitmap = this.getBitmap(), options = this.getOptions();
    if (bitmap != null) {
        bitmap = BitmapDrawableFactory.wrap(bitmap, options);
        if (!(bitmap instanceof android.graphics.Bitmap)) {
            bitmap = this.getCorruptedThumbnail();
            if (bitmap != null) {
                bitmap = BitmapDrawableFactory.wrap(bitmap, options);
            }
        }
        this.wrapped = bitmap;
    }
    if (bitmap == null) {
        return (this.wrapped = null);
    }
    return new android.graphics.drawable.BitmapDrawable(bitmap);
};
BitmapDrawable.prototype.describe = function (drawable) {
    if (drawable.getBitmap() == null) {
        return;
    }
    drawable.setFilterBitmap(false);
    drawable.setAntiAlias(false);
    ScheduledDrawable.prototype.describe.apply(this, arguments);
};
BitmapDrawable.prototype.getBitmap = function () {
    return this.bitmap || null;
};
BitmapDrawable.prototype.setBitmap = function (bitmap) {
    if (BitmapDrawableFactory.sameAs(this.bitmap, bitmap)) {
        return;
    }
    if (bitmap !== undefined) {
        this.bitmap = bitmap;
    }
    else
        delete this.bitmap;
    this.invalidate();
};
BitmapDrawable.prototype.getWrappedBitmap = function () {
    return this.wrapped || null;
};
BitmapDrawable.prototype.getOptions = function () {
    return this.options || null;
};
BitmapDrawable.prototype.setOptions = function (options) {
    if (options !== undefined) {
        this.options = options;
    }
    else
        delete this.options;
};
BitmapDrawable.prototype.getCorruptedThumbnail = function () {
    return this.corrupted !== undefined ? this.corrupted : "menuBoardWarning";
};
BitmapDrawable.prototype.setCorruptedThumbnail = function (bitmap) {
    if (BitmapDrawableFactory.sameAs(this.corrupted, bitmap)) {
        return;
    }
    if (bitmap !== undefined) {
        this.corrupted = bitmap;
    }
    else
        delete this.corrupted;
    this.invalidate();
};
BitmapDrawable.prototype.recycle = function () {
    var wrapped = this.getWrappedBitmap();
    if (wrapped != null)
        wrapped.recycle();
    delete this.wrapped;
};
BitmapDrawable.prototype.requestDeattach = function () {
    var state = ScheduledDrawable.prototype.requestDeattach.call(this);
    if (!this.isAttached()) {
        delete this.source;
        this.recycle();
        return true;
    }
    return state;
};
BitmapDrawable.prototype.toString = function () {
    return "[BitmapDrawable " + this.getBitmap() + "]";
};
AnimationDrawable = function (frames) {
    this.clearFrames();
    if (frames !== undefined) {
        this.addFrames(frames);
    }
    ScheduledDrawable.call(this);
};
AnimationDrawable.prototype = new ScheduledDrawable;
AnimationDrawable.prototype.describe = function (where) {
    if (where.getNumberOfFrames() > 0) {
        this.invalidate();
        return;
    }
    ScheduledDrawable.prototype.describe.apply(this, arguments);
    var descriptor = this.getDescriptor();
    if (descriptor != null) {
        AnimationDrawable.applyDescribe.call(this, drawable, descriptor);
    }
    var basic = this.getDefaultDuration();
    if (this.isStartingWhenProcess())
        this.start();
    for (var i = 0; i < this.getFrameCount(); i++) {
        var frame = this.getFrameAt(i), drawable = frame.getDrawable();
        if (drawable instanceof ScheduledDrawable) {
            if (!drawable.isProcessed()) {
                drawable.toDrawable();
                while (drawable.isProcessing()) {
                    java.lang.Thread.yield();
                }
            }
        }
        if (drawable instanceof Drawable) {
            drawable = drawable.toDrawable();
        }
        var duration = frame.getDuration();
        if (!(duration > 0))
            duration = basic;
        where.addFrame(drawable, duration);
    }
    if (this.isStoppingWhenCompleted())
        this.stop();
    else if (!this.isStartingWhenProcess())
        this.start();
};
AnimationDrawable.prototype.process = function () {
    return new android.graphics.drawable.AnimationDrawable();
};
AnimationDrawable.prototype.clearFrames = function () {
    this.frames = [];
    this.requireDescribe();
};
AnimationDrawable.prototype.getFrames = function () {
    return this.frames;
};
AnimationDrawable.prototype.getFrameCount = function () {
    return this.getFrames().length;
};
AnimationDrawable.prototype.indexOfFrame = function (frame) {
    if (!(frame instanceof AnimationDrawable.Frame)) {
        for (var i = 0; i < this.getFrameCount(); i++) {
            var drawable = this.getFrameAt(i);
            if (drawable == frame)
                return i;
        }
    }
    return this.getFrames().indexOf(frame);
};
AnimationDrawable.prototype.getFrameAt = function (index) {
    return this.getFrames()[index] || null;
};
AnimationDrawable.prototype.addFrame = function (frame, duration) {
    if (!(frame instanceof AnimationDrawable.Frame)) {
        frame = new AnimationDrawable.Frame(frame, duration);
    }
    this.getFrames().push(frame);
    this.requireDescribe();
};
AnimationDrawable.prototype.addFrames = function (frames, duration) {
    if (!Array.isArray(frames))
        frames = [frames];
    frames = frames.slice().map(function (element) {
        if (!(element instanceof AnimationDrawable.Frame)) {
            return new AnimationDrawable.Frame(element, duration);
        }
        return element;
    });
    this.frames = this.getFrames().concat(frames);
    this.requireDescribe();
};
AnimationDrawable.prototype.hasFrame = function (frame) {
    return this.indexOfFrame(frame) != -1;
};
AnimationDrawable.prototype.removeFrame = function (frame) {
    var index = this.indexOfFrame(frame);
    if (index == -1)
        return;
    this.getFrames().splice(index, 1);
    this.requireDescribe();
};
AnimationDrawable.prototype.getCurrentIndex = function () {
    return this.isProcessed() ? this.toDrawable().getCurrentIndex() : 0;
};
AnimationDrawable.prototype.setCurrentIndex = function (index) {
    if (this.isProcessed()) {
        this.toDrawable().setCurrentIndex(Number(index));
    }
};
AnimationDrawable.prototype.isRunning = function () {
    return this.isProcessed() ? this.toDrawable().isRunning() : false;
};
AnimationDrawable.prototype.start = function () {
    if (this.isProcessed()) {
        this.toDrawable().start();
        return true;
    }
    return false;
};
AnimationDrawable.prototype.stop = function () {
    if (this.isProcessed()) {
        this.toDrawable().stop();
        return true;
    }
    return false;
};
AnimationDrawable.prototype.getDefaultDuration = function () {
    return this.duration > 0 ? this.duration : 1000;
};
AnimationDrawable.prototype.setDefaultDuration = function (duration) {
    this.duration = Number(duration);
    this.requireDescribe();
};
AnimationDrawable.prototype.isStartingWhenProcess = function () {
    return this.starting != undefined ? this.starting : false;
};
AnimationDrawable.prototype.setIsStartingWhenProcess = function (enabled) {
    this.starting = Boolean(enabled);
    this.requireDescribe();
};
AnimationDrawable.prototype.isStoppingWhenCompleted = function () {
    return this.stopping != undefined ? this.stopping : false;
};
AnimationDrawable.prototype.setIsStoppingWhenCompleted = function (enabled) {
    this.stopping = Boolean(enabled);
    this.requireDescribe();
};
AnimationDrawable.prototype.toString = function () {
    return "[AnimationDrawable " + this.getFrames() + "]";
};
AnimationDrawable.Frame = function (drawable, duration) {
    if (drawable !== undefined) {
        this.setDrawable(drawable);
    }
    if (duration > 0) {
        this.setDuration(duration);
    }
};
AnimationDrawable.Frame.prototype.getDrawable = function () {
    return this.drawable || null;
};
AnimationDrawable.Frame.prototype.setDrawable = function (drawable) {
    if (drawable !== undefined) {
        this.drawable = drawable;
    }
    else
        delete this.drawable;
};
AnimationDrawable.Frame.prototype.getDuration = function () {
    return this.duration || 0;
};
AnimationDrawable.Frame.prototype.setDuration = function (duration) {
    this.duration = Number(duration);
};
AnimationDrawable.Frame.prototype.toString = function () {
    return "[Frame " + this.getDrawable() + "@" + this.getDuration() + "]";
};
EXPORT("HashedDrawableMap", HashedDrawableMap);
EXPORT("DrawableFactory", DrawableFactory);
EXPORT("BitmapFactory", BitmapFactory);
EXPORT("BitmapDrawableFactory", BitmapDrawableFactory);
EXPORT("AnimationDrawableFactory", AnimationDrawableFactory);
EXPORT("Drawable", Drawable);
EXPORT("CachedDrawable", CachedDrawable);
EXPORT("ColorDrawable", ColorDrawable);
EXPORT("ScheduledDrawable", ScheduledDrawable);
EXPORT("LayerDrawable", LayerDrawable);
EXPORT("ClipDrawable", ClipDrawable);
EXPORT("BitmapDrawable", BitmapDrawable);
EXPORT("AnimationDrawable", AnimationDrawable);
