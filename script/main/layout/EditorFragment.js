/**
 * @requires `isAndroid()`
 * @type
 */
const EditorFragment = function() {
	Fragment.apply(this, arguments);
	if (isAndroid()) {
		if (isHorizon && android.os.Build.VERSION.SDK_INT >= 21) {
			try {
				this.resetContainer();
				return;
			} catch (e) {
				Logger.Log("Modding Tools#EditorFragment: " + e, "WARNING");
			}
		}
		this.resetLegacyContainer();
	}
};

EditorFragment.prototype = new Fragment;

EditorFragment.prototype.resetContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);

	let text = new Packages.io.github.rosemoe.sora.widget.CodeEditor(getContext());
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
	let drawable = new android.graphics.drawable.ColorDrawable($.Color.YELLOW);
	text.setSelectionHandleStyle(new Packages.io.nernar.editor.style.HandleStyleSideDrop(getContext(), drawable));
	text.setColorScheme(new Packages.io.github.rosemoe.sora.widget.schemes.SchemeDarcula());
	text.setAutoCompletionItemAdapter(EditorFragment.COMPLETION_ADAPTER);
	text.getComponent(Packages.io.github.rosemoe.sora.widget.component.EditorAutoCompletion).setParentView(getContext().getWindow().getDecorView());
	let textAction = new android.widget.LinearLayout(getContext());
	new BitmapDrawable("popup").attachAsBackground(textAction);
	textAction.setGravity($.Gravity.CENTER);
	let textActionButtonParams = new android.widget.LinearLayout.
		LayoutParams(toComplexUnitDip(40), toComplexUnitDip(40));
	textActionButtonParams.leftMargin = textActionButtonParams.rightMargin =
		textActionButtonParams.topMargin = textActionButtonParams.bottomMargin = toComplexUnitDip(8);
	let copyBtn = new android.widget.Button(getContext());
	new BitmapDrawable("explorerSelectionApprove").attachAsBackground(copyBtn);
	copyBtn.setOnClickListener(function(self) {
		text.copyText();
		text.setSelection(text.getCursor().getRightLine(), text.getCursor().getRightColumn());
		textAction.dismiss();
	});
	textAction.addView(copyBtn, textActionButtonParams);
	let cutBtn = new android.widget.Button(getContext());
	new BitmapDrawable("explorerSelectionWhole").attachAsBackground(cutBtn);
	cutBtn.setOnClickListener(function(self) {
		text.copyText();
		if (text.getCursor().isSelected()) {
			text.deleteText();
		}
		textAction.dismiss();
	});
	textAction.addView(cutBtn, textActionButtonParams);
	let pasteBtn = new android.widget.Button(getContext());
	new BitmapDrawable("explorerSelectionSame").attachAsBackground(pasteBtn);
	pasteBtn.setOnClickListener(function(self) {
		text.pasteText();
		text.setSelection(text.getCursor().getRightLine(), text.getCursor().getRightColumn());
		textAction.dismiss();
	});
	textAction.addView(pasteBtn, textActionButtonParams);
	let selectAllBtn = new android.widget.Button(getContext());
	new BitmapDrawable("explorerSelectionInvert").attachAsBackground(selectAllBtn);
	selectAllBtn.setOnClickListener(function(self) {
		text.selectAll();
		textAction.show();
	});
	textAction.addView(selectAllBtn, textActionButtonParams);
	textAction = new Packages.io.nernar.editor.component.EditorTextActionWindow(text, textAction, pasteBtn, copyBtn, cutBtn);
	textAction.setParentView(getContext().getWindow().getDecorView());
	text.replaceComponent(Packages.io.github.rosemoe.sora.widget.component.EditorTextActionWindow, textAction);
	let magnifierRoot = new android.widget.FrameLayout(getContext());
	magnifierRoot.setElevation(toComplexUnitDip(4));
	let magnifier = new android.widget.ImageView(getContext());
	magnifierRoot.addView(magnifier, new android.widget.FrameLayout.
		LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));
	magnifier = new Packages.io.nernar.editor.component.Magnifier(text, magnifierRoot, magnifier);
	magnifier.setParentView(getContext().getWindow().getDecorView());
	text.replaceComponent(Packages.io.github.rosemoe.sora.widget.component.Magnifier, magnifier);
	text.setTag("editor");
	container.addView(text);
};

EditorFragment.prototype.resetLegacyContainer = function() {
	let container = new android.widget.FrameLayout(getContext());
	this.setContainerView(container);

	let text = new android.widget.EditText(getContext());
	text.setHint(translate("Hi, I'm evaluate stroke"));
	text.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
		android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
		android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	text.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
		android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
	text.setTextColor(android.graphics.Color.WHITE);
	text.setTextSize(toComplexUnitDp(8));
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
	if (view == null) return;
	view.setText("" + text);
};

EditorFragment.prototype.getText = function() {
	let view = this.getEditorView();
	if (view == null) return null;
	return "" + view.getText();
};

EditorFragment.prototype.isLegacyEditor = function() {
	return isHorizon;
};

if (isHorizon && isAndroid()) {
	try {
		EditorFragment.COMPLETION_ADAPTER = new JavaAdapter(Packages.io.github.rosemoe.sora.widget.component.EditorCompletionAdapter, {
			getItemHeight: function() {
				return toComplexUnitDip(45);
			},
			getView: function(position, convertView, parent, isCurrentCursorPosition) {
				let holder;
				try {
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
					holder = convertView.getTag();
				} catch (e) {
					log("Modding Tools#EditorFragment.COMPLETION_ADAPTER.getItem: " + e);
					return convertView;
				}
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
			let layout = new android.widget.LinearLayout(getContext());
			layout.setGravity($.Gravity.CENTER_VERTICAL);
			layout.setPadding(0, toComplexUnitDip(2), 0, toComplexUnitDip(2));

			let icon = new android.widget.ImageView(getContext());
			icon.setTag("itemIcon");
			let params = new android.widget.LinearLayout.LayoutParams
				(toComplexUnitDip(24), toComplexUnitDip(24));
			params.leftMargin = params.rightMargin = toComplexUnitDip(4);
			layout.addView(icon, params);

			let descriptor = new android.widget.LinearLayout(getContext());
			descriptor.setOrientation($.LinearLayout.VERTICAL);
			descriptor.setGravity($.Gravity.CENTER_VERTICAL);
			descriptor.setPadding(toComplexUnitDip(8), 0, toComplexUnitDip(8), 0);
			layout.addView(descriptor);

			let label = new android.widget.TextView(getContext());
			label.setTextSize(toComplexUnitDp(12));
			label.setTag("itemLabel");
			descriptor.addView(label);

			let description = new android.widget.TextView(getContext());
			description.setTextSize(toComplexUnitDp(9));
			description.setTag("itemDescription");
			params = new android.widget.LinearLayout.LayoutParams
				($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.topMargin = toComplexUnitDip(4);
			descriptor.addView(description, params);
		};
	} catch (e) {
		Logger.Log("Modding Tools#EditorFragment.COMPLETION_ADAPTER: " + e, "ERROR");
	}
}
