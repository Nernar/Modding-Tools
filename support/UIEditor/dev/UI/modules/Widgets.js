
/*
  _____               ______    _ _ _
 |  __ \             |  ____|  | (_) |
 | |  | | _____   __ | |__   __| |_| |_ ___  _ __
 | |  | |/ _ \ \ / / |  __| / _` | | __/ _ \| '__|
 | |__| |  __/\ V /  | |___| (_| | | || (_) | |
 |_____/ \___| \_/   |______\__,_|_|\__\___/|_|


       Developed by Nernar (vk.com/nernar)
   This code is a copyright, do not distribute.

*/

var Widgets = {
    ctx: UI.getContext(),
    theme: 16974120,
    dialogTheme: 16974126,
    size: {
        wrap: android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT,
        match: android.widget.RelativeLayout.LayoutParams.MATCH_PARENT
    },
    display: {
        width: UI.getContext().getWindowManager().getDefaultDisplay().getWidth(),
        height: UI.getContext().getWindowManager().getDefaultDisplay().getHeight()
    },
    gravity: {
        top: android.view.Gravity.TOP,
        bottom: android.view.Gravity.BOTTOM,
        left: android.view.Gravity.LEFT,
        right: android.view.Gravity.RIGHT,
        center: android.view.Gravity.CENTER
    },
    visibility: {
        visible: android.view.View.VISIBLE,
        invisible: android.view.View.INVISIBLE,
        gone: android.view.View.GONE
    },
    color: android.graphics.Color,
    font: android.graphics.Typeface.createFromFile(new java.io.File(FileTools.root + "games/com.mojang/innercore/mc-typeface.ttf")),
    orientate: {
        vertical: android.widget.LinearLayout.VERTICAL,
        horizontal: android.widget.LinearLayout.HORIZONTAL
    },
    run: function(code) {
        this.ctx.runOnUiThread(function() {
            try {
                code();
            } catch(e) {
                android.widget.Toast.makeText(Widgets.ctx, e + " (#" + e.lineNumber + ")", android.widget.Toast.LENGTH_LONG).show();
            }
        });
    },
    resize: function(value, isWidth) {
        return isWidth
            ? (value * 1 / 800 * this.display.width)
            : (value * 1 / 480 * this.display.height);
    },
    check: function(image, isPath) {
        if(!isPath){return image && new java.io.File(__dir__ + "gui/UI/" + image + ".png").exists();}
        else {return image && new java.io.File(image).exists();}
    },
    bitmap: function(file, scale, isPath) {
        if(!this.check(file, isPath)) return null;
        var bitmap = "";
        if(isPath){ bitmap = FileTools.ReadImage(file); }else{  bitmap = FileTools.ReadImage(__dir__ + "gui/UI/" + file + ".png");  }
        return android.graphics.drawable.BitmapDrawable(android.graphics.Bitmap.createScaledBitmap(android.graphics.Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight()), bitmap.getWidth() * (scale || 1), bitmap.getHeight() * (scale || 1), false));
    },
    parse: function(color) {
        return this.color.parseColor(color);
    },
    params: function(width, height) {
        return android.widget.LinearLayout.LayoutParams(this.resize(width, true), this.resize(height, false));
    },
    remove: function(view) {
        if(view) {
            view.dismiss();
            view = null;
        }
    },
    window: function(view, gravity, x, y, width, height, focus) {
        var window = new android.widget.PopupWindow(view,
            this.resize(width) || this.size.wrap,
            this.resize(height) || this.size.wrap, focus || false);
        if(gravity == null) gravity = this.gravity.center;
        window.setBackgroundDrawable(this.bitmap("background"));
        window.showAtLocation(this.ctx.getWindow().getDecorView(),
            gravity, x || 0, y || 0);
        return window;
    },
    linear: function(views, orientation, gravity, params, color) {
        var layout = new android.widget.LinearLayout(this.ctx);
        layout.setOrientation((orientation != null) ? orientation : this.orientate.vertical);
        if(params) layout.setLayoutParams(params);
        layout.setGravity((gravity != null) ? gravity : Widgets.gravity.center);
        for(a in views)
            layout.addView(views[a]);
        return layout;
    },
    scroll: function(view, orientation, params) {
        var scroll = null;
        if(orientation == null || orientation == this.orientate.vertical) {
            scroll = new android.widget.ScrollView(this.ctx);
        } else {
            scroll = new android.widget.HorizontalScrollView(this.ctx);
        }
        if(params) scroll.setLayoutParams(params);
        if(view) scroll.addView(view);
        return scroll;
    },
    button: function(text, size, params, color) {
        var button = new android.widget.Button(this.ctx);
        button.setText((text != null) ? text : "");
        if(size != null) button.setTextSize(this.resize(size));
        button.setTextColor(color || this.color.WHITE);
        button.setTypeface(this.font);
        button.setBackgroundDrawable(null);
        if(params) button.setLayoutParams(params);
        return button;
    },
    image: function(file, scale, params, isPath) {
        var image = new android.widget.ImageView(this.ctx);
        if(file) image.setImageDrawable(this.bitmap(file, scale, isPath));
        if(params) image.setLayoutParams(params);
        return image;
    },
    text: function(msg, size, gravity, params, color) {
        var text = new android.widget.TextView(this.ctx);
        text.setText((msg != null) ? msg : "");
        if(size != null) text.setTextSize(this.resize(size));
        text.setTextColor(color || this.color.WHITE);
        text.setGravity(gravity || this.gravity.left);
        text.setTypeface(this.font);
        if(params) text.setLayoutParams(params);
        return text;
    },
    edit: function(msg, hint, size, params, type, single, gravity, color, hintColor) {
        var edit = new android.widget.EditText(this.ctx);
        if(msg != null) edit.setText(msg);
        if(hint != null) edit.setHint(hint);
        if(size != null) edit.setTextSize(this.resize(size));
        if(single) edit.setSingleLine(single);
        if(type) edit.setInputType(type);
        edit.setBackgroundDrawable(null);
        edit.setTextColor(color || this.color.WHITE);
        edit.setHintTextColor(hintColor || this.color.RED);
        edit.setGravity(gravity || this.gravity.center);
        edit.setTypeface(this.font);
        if(params) edit.setLayoutParams(params);
        return edit;
    },
    list: function(items, params) {
        var adapter = new android.widget.ArrayAdapter(this.ctx, android.R.layout.simple_list_item_1, items);
        var list = new android.widget.ListView(this.ctx, null, this.theme);
        list.setAdapter(adapter);
        if(params) list.setLayoutParams(params);
        return {
            adapter: adapter,
            view: list
        };
    }
};
