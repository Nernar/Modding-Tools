const EditorFragment = function() {
	Fragment.apply(this, arguments);
	if (isHorizon && android.os.Build.VERSION.SDK_INT >= 21) {
		this.resetContainer();
	} else {
		this.resetLegacyContainer();
	}
};

EditorFragment.prototype = new Fragment;

EditorFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(context);
	this.setContainerView(container);
	
	let text = new Packages.io.github.rosemoe.sora.widget.CodeEditor(context);
	text.setTypefaceText(typefaceJetBrains);
	/*
		processor.setWordwrap(true);
		processor.setUndoEnabled(true);
		processor.setPinLineNumber(true);
		processor.setTabWidth(4);
		processor.setLineNumberEnabled(false);
		processor.setBlockLineEnabled(true);
		processor.setBlockLineWidth(0.1f);
		processor.setLigatureEnabled(false);
		processor.setScalable(false);
		processor.setScaleTextSizes(10f, 20f);
		processor.setNonPrintablePaintingFlags(0);
		processor.setFirstLineNumberAlwaysVisible(false);
		processor.setCursorBlinkPeriod(800);
		processor.setHighlightCurrentLine(false);
		processor.setHighlightCurrentBlock(false);
		processor.setEditable(false);
		processor.setEdgeEffectColor(-1);
	*/
	let drawable = new android.graphics.drawable.ColorDrawable(Interface.Color.YELLOW);
	text.setSelectionHandleStyle(new findAssertionPackage().editor.style.HandleStyleSideDrop(context, drawable));
	text.setColorScheme(new Packages.io.github.rosemoe.sora.widget.schemes.SchemeDarcula());
	text.setAutoCompletionItemAdapter(EditorFragment.COMPLETION_ADAPTER);
	text.getComponent(Packages.io.github.rosemoe.sora.widget.component.EditorAutoCompletion).setParentView(context.getWindow().getDecorView());
	let textAction = new android.widget.LinearLayout(context);
	new BitmapDrawable("popup").attachAsBackground(textAction);
	textAction.setGravity(Interface.Gravity.CENTER);
	let textActionButtonParams = new android.widget.LinearLayout.
		LayoutParams(Interface.toComplexUnitDip(40), Interface.toComplexUnitDip(40));
	textActionButtonParams.leftMargin = textActionButtonParams.rightMargin =
		textActionButtonParams.topMargin = textActionButtonParams.bottomMargin = Interface.toComplexUnitDip(8);
	let copyBtn = new android.widget.Button(context);
	new BitmapDrawable("explorerSelectionApprove").attachAsBackground(copyBtn);
	copyBtn.setOnClickListener(function(self) {
		text.copyText();
		text.setSelection(text.getCursor().getRightLine(), text.getCursor().getRightColumn());
		textAction.dismiss();
	});
	textAction.addView(copyBtn, textActionButtonParams);
	let cutBtn = new android.widget.Button(context);
	new BitmapDrawable("explorerSelectionWhole").attachAsBackground(cutBtn);
	cutBtn.setOnClickListener(function(self) {
		text.copyText();
		if (text.getCursor().isSelected()) {
			text.deleteText();
		}
		textAction.dismiss();
	});
	textAction.addView(cutBtn, textActionButtonParams);
	let pasteBtn = new android.widget.Button(context);
	new BitmapDrawable("explorerSelectionSame").attachAsBackground(pasteBtn);
	pasteBtn.setOnClickListener(function(self) {
		text.pasteText();
		text.setSelection(text.getCursor().getRightLine(), text.getCursor().getRightColumn());
		textAction.dismiss();
	});
	textAction.addView(pasteBtn, textActionButtonParams);
	let selectAllBtn = new android.widget.Button(context);
	new BitmapDrawable("explorerSelectionInvert").attachAsBackground(selectAllBtn);
	selectAllBtn.setOnClickListener(function(self) {
		text.selectAll();
		textAction.show();
	});
	textAction.addView(selectAllBtn, textActionButtonParams);
	textAction = new findAssertionPackage().editor.component.EditorTextActionWindow(text, textAction, pasteBtn, copyBtn, cutBtn);
	textAction.setParentView(context.getWindow().getDecorView());
	text.replaceComponent(Packages.io.github.rosemoe.sora.widget.component.EditorTextActionWindow, textAction);
	let magnifierRoot = new android.widget.FrameLayout(context);
	magnifierRoot.setElevation(Interface.toComplexUnitDip(4));
	let magnifier = new android.widget.ImageView(context);
	magnifierRoot.addView(magnifier, new android.widget.FrameLayout.
		LayoutParams(Interface.Display.MATCH, Interface.Display.MATCH));
	magnifier = new findAssertionPackage().editor.component.Magnifier(text, magnifierRoot, magnifier);
	magnifier.setParentView(context.getWindow().getDecorView());
	text.replaceComponent(Packages.io.github.rosemoe.sora.widget.component.Magnifier, magnifier);
	text.setTag("editor");
	container.addView(text);
};

EditorFragment.prototype.resetLegacyContainer = function() {
	let container = new android.widget.FrameLayout(context);
	this.setContainerView(container);
	
	let text = new android.widget.EditText(context);
	text.setHint(translate("Hi, I'm evaluate stroke"));
	text.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
		android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
		android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	text.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
		android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
	text.setTextColor(android.graphics.Color.WHITE);
	text.setTextSize(Interface.getFontSize(21));
	text.setHorizontalScrollBarEnabled(true);
	text.setHorizontallyScrolling(true);
	text.setSingleLine(false);
	text.setMinLines(3);
	text.setTypeface(typefaceJetBrains);
	text.setTag("editor");
	container.addView(text);
};

EditorFragment.prototype.getEditorView = function() {
	return this.findViewByTag("editor");
};

EditorFragment.prototype.setText = function(text) {
	let view = this.getEditorView();
	if (view === null) return;
	view.setText(String(text));
};

EditorFragment.prototype.getText = function() {
	let view = this.getEditorView();
	if (view === null) return;
	return String(view.getText());
};

EditorFragment.prototype.isLegacyEditor = function() {
	return isHorizon;
};

if (isHorizon) {
	EditorFragment.COMPLETION_ADAPTER = new JavaAdapter(Packages.io.github.rosemoe.sora.widget.component.EditorCompletionAdapter, {
		getItemHeight: function() {
			return Interface.toComplexUnitDip(45);
		},
		getView: function(position, convertView, parent, isCurrentCursorPosition) {
			let holder = tryout.call(this, function() {
				if (convertView == null) {
					let tag = {};
					convertView = EditorFragment.COMPLETION_ADAPTER.newItem();
					tag.label = convertView.findViewWithTag("itemLabel");
					tag.description = convertView.findViewWithTag("itemDescription");
					tag.icon = convertView.findViewWithTag("itemIcon");
					tag.drawable = new BitmapDrawable();
					tag.drawable.setCorruptedThumbnail("explorerFileCorrupted");
					tag.drawable.attachAsImage(tag.icon);
					convertView.setTag(tag);
				}
				return convertView.getTag();
			});
			let completion = this.getItem(position);
			if (holder != null) {
				holder.label.setText(completion.label);
				holder.desc.setText(completion.desc);
				if (completion.icon != null) {
					holder.icon.setImageDrawable(completion.icon);
				} else {
					holder.drawable.attachAsImage(holder.icon);
				}
			}
			if (isCurrentCursorPosition) {
				new BitmapDrawable("popupSelectionSelected").attachAsBackground(convertView);
			} else {
				convertView.setBackgroundDrawable(null);
			}
		}
	});
	
	EditorFragment.COMPLETION_ADAPTER.newItem = function() {
		let layout = new android.widget.LinearLayout(context);
		layout.setGravity(Interface.Gravity.CENTER_VERTICAL);
		layout.setPadding(0, Interface.toComplexUnitDip(2), 0, Interface.toComplexUnitDip(2));
		
		let icon = new android.widget.ImageView(context);
		icon.setTag("itemIcon");
		let params = new android.widget.LinearLayout.LayoutParams(Interface.toComplexUnitDip(24), Interface.toComplexUnitDip(24));
		params.leftMargin = params.rightMargin = Interface.toComplexUnitDip(4);
		layout.addView(icon, params);
		
		let descriptor = new android.widget.LinearLayout(context);
		descriptor.setOrientation(Interface.Orientate.VERTICAL);
		descriptor.setGravity(Interface.Gravity.CENTER_VERTICAL);
		descriptor.setPadding(Interface.toComplexUnitDip(8), 0, Interface.toComplexUnitDip(8), 0);
		layout.addView(descriptor);
		
		let label = new android.widget.TextView(context);
		label.setTextSize(Interface.getFontSize(16));
		label.setTag("itemLabel");
		descriptor.addView(label);
		
		let description = new android.widget.TextView(context);
		description.setTextSize(Interface.getFontSize(12));
		description.setTag("itemDescription");
		params = new android.widget.LinearLayout.LayoutParams(Interface.Display.WRAP, Interface.Display.WRAP);
		params.topMargin = Interface.toComplexUnitDip(4);
		descriptor.addView(description, params);
	};
}
