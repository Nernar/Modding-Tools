/**
 * @requires `isAndroid()`
 */
const LogViewer = {};

LogViewer.span = function(text, color) {
	let spannable = new android.text.SpannableString(text);
	spannable.setSpan(new android.text.style.ForegroundColorSpan(color), 0, text.length, android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
	return spannable;
};

LogViewer.append = function(text, scroll, horizontal, prefix, message, color) {
	text.post(function() {
		if (color !== undefined && color != 0) {
			text.append(LogViewer.span("\n" + (prefix != "undefined" ? prefix + "/" + message : message), color));
		} else {
			text.append("\n" + (prefix != "undefined" ? prefix + "/" + message : message));
		}
		scroll.scrollTo(horizontal.getScrollX(), text.getMeasuredHeight());
	});
};

LogViewer.handle = function(text, scroll, horizontal, message) {
	if (message == null) {
		return;
	}
	if (message.type.level == 3) {
		return this.append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("RED"));
	}
	if (message.strPrefix == "WARNING") {
		return this.append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("YELLOW"));
	}
	if (message.type.level == 2 || message.strPrefix == "INFO") {
		return this.append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("GREEN"));
	} else if (message.type.level == 1 || message.strPrefix == "DEBUG") {
		return this.append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("GRAY"));
	}
	if (message.strPrefix == "MOD") {
		return this.append(text, scroll, horizontal, message.strPrefix, message.message);
	}
	return this.append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("LTGRAY"));
};

LogViewer.show = function() {
	let popup = new ExpandablePopup("log");
	popup.setTitle(translate("Currently log"));
   	popup.getFragment().getContainerScroll().setLayoutParams(new android.widget.LinearLayout.LayoutParams
   		(getDisplayPercentWidth(25), getDisplayPercentHeight(35)));
	let horizontal = new android.widget.HorizontalScrollView(getContext());
	let text = new android.widget.TextView(getContext());
	text.setPadding(toComplexUnitDip(6), 0, toComplexUnitDip(6), 0);
	text.setTextSize(toComplexUnitSp(5));
   	text.setTextColor($.Color.WHITE);
	text.setTypeface(android.graphics.Typeface.MONOSPACE);
	text.setText(NAME + " " + REVISION);
	popup.getFragment().getContainerLayout().addView(horizontal);
	horizontal.addView(text);
	let filter = InnerCorePackages.api.log.ICLog.getLogFilter();
	let messagesField = getClass(filter).__javaObject__.getDeclaredField("logMessages");
	messagesField.setAccessible(true);
	let messages = messagesField.get(filter);
	popup.show();
	let count = messages.size();
	handleThread(function() {
		while (popup.isOpened()) {
			if (popup.isExpanded()) {
				let next = messages.size();
				if (next > count) {
					for (let i = count; i < next; i++) {
						LogViewer.handle(text, popup.getFragment().getContainerScroll(), horizontal, messages.get(i));
					}
					count = next;
				}
			}
			java.lang.Thread.yield();
		}
	});
};
