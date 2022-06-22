TerrainGeneratorFactory = Packages.io.nernar.innercore.terrain.TerrainGeneratorFactory;

const attachTerrainWindow = function() {
	let popup = new ListingPopup();
	popup.setTitle(translate("Terrain"));
	let isDirty = false;
	let seed = 100;
	popup.addButtonElement(translate("New seed"), function() {
		seed = Date.now() % 1000000;
		showHint("Changed seed to " + seed);
		isDirty = true;
	});
	let source = new android.widget.ImageView(getContext());
	source.setScaleType($.ImageView.ScaleType.FIT_CENTER);
	source.setMinimumHeight(getDisplayHeight() * 0.625);
	let params = new android.widget.FrameLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT);
	popup.getFragment().getContainerLayout().addView(source, params);
	popup.addButtonElement(translate("Save") + " & " + translate("Redraw"), function() {
		json = edit.getValue();
		isDirty = true;
	});
	let edit = popup.addEditElement("...", JSON.stringify({
		layers: [
			{
				minY: 0,
				maxY: 128,
				yConversion: [[0, 0.5], [1, -0.5]],
				material: { base: 1 },
				noise: { octaves: { count: 4, scale: 20 } },
				materials: [
					{
						base: 3,
						diffuse: 0.1,
						noise: { octaves: [{ scale: 0.1, weight: 0.6 }, { scale: 0.2, weight: 0.3 }] }
					}
				]
			}
		]
	}, null, "\t"));
	let json = edit.getValue();
	popup.setWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
	popup.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);
	popup.getFragment().getTitleView().setVisibility($.View.GONE);
	Popups.open(popup, "terrain");
	let invalidate = false;
	handleThread(function() {
		let handler = TerrainGeneratorFactory.handleNoiseString(json, 3.2);
		handler.redraw();
		let drawable = new android.graphics.drawable.BitmapDrawable(handler.getBitmap());
		drawable.setFilterBitmap(false);
		drawable.setAntiAlias(false);
		acquire(function() {
			source.setImageDrawable(drawable);
		});
		while (popup.isOpened()) {
			if (isDirty) {
				let date = Date.now();
				tryout(function() {
					handler.parseString(json);
					handler.setSeed(seed);
					showHint("Parsed as " + (Date.now() - date) + "ms");
				});
				handler.redraw();
				invalidate = true;
				showHint("Redrawed as " + (Date.now() - date) + "ms");
				isDirty = false;
			}
			java.lang.Thread.yield();
		}
	});
	handleThread(function() {
		while (popup.isOpened()) {
			if (isDirty || invalidate) {
				invalidate = false;
				acquire(function() {
					source.invalidate();
				});
			}
			java.lang.Thread.yield();
		}
	});
};

return function() {
	attachTerrainWindow();
};