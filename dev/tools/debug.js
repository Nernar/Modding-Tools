const LogViewer = {
	FREQUENCY: 250,
	show: function() {
		handle(function() {
			let popup = new ListingPopup();
			popup.setTitle(translate("Currently log"));
			let horizontal = new android.widget.HorizontalScrollView(context);
			popup.views.content.addView(horizontal);
			let text = new android.widget.TextView(context);
			text.setPadding(Ui.getY(10), 0, Ui.getY(10), 0);
			text.setTextSize(Ui.getFontSize(12));
			text.setTextColor(Ui.Color.WHITE);
			if (typeface) text.setTypeface(typeface);
			horizontal.addView(text);
			let seek = new android.widget.SeekBar(context);
			seek.setMax(39);
			seek.setProgress((LogViewer.FREQUENCY - 50) / 50);
			seek.setOnSeekBarChangeListener({
				onProgressChanged: function(view, progress) {
					try {
						LogViewer.FREQUENCY = preround(progress * 50 + 50);
					} catch (e) {
						reportError(e);
					}
				}
			});
			let params = new android.widget.LinearLayout.
				LayoutParams(Ui.Display.MATCH, Ui.Display.MATCH);
			params.weight = 0.1;
			popup.getContent().addView(seek, params);
			handleThread(function() {
				let log = java.lang.Class.forName("zhekasmirnov.launcher.api.log.ICLog", true, context.getClass().getClassLoader()),
					filter = log.getMethod("getLogFilter").invoke(null);
				do {
					if (popup.isExpanded()) {
						let result = filter.buildFilteredLog(false);
						handle(function() {
							text.setText(result);
							if (text.getMeasuredHeight() - popup.views.scroll.getScrollY() < Ui.Display.HEIGHT) {
								popup.views.scroll.scrollTo(horizontal.getScrollX(), text.getMeasuredHeight());
							}
						});
						Ui.sleepMilliseconds(LogViewer.FREQUENCY);
					}
				} while (popup.name && Popups.hasOpenedByName(popup.name));
			});
			Popups.open(popup, "innercore_log");
		});
	}
};
