const TextFragmentMixin = {
	getTextView() {
		MCSystem.throwException("Modding Tools: TextFragmentMixin.getTextView (in " + this.TYPE + ") must be implemented!");
	},
	/**
	 * @requires `isCLI()`
	 */
	render(hovered) {
		return this.text;
	},
	getText() {
		if (isAndroid()) {
			let view = this.getTextView();
			return "" + view.getText();
		}
		return this.text || null;
	},
	append(text) {
		if (isAndroid()) {
			let view = this.getTextView();
			view.append("" + text);
		} else {
			this.text += text;
		}
		return this;
	},
	setText(text) {
		if (isAndroid()) {
			let view = this.getTextView();
			view.setText("" + text);
		} else {
			this.text = "" + text;
		}
		return this;
	}
};

const ImageFragmentMixin = {
	getImageView() {
		MCSystem.throwException("Modding Tools: ImageFragmentMixin.getImageView (in " + this.TYPE + ") must be implemented!");
	},
	/**
	 * @requires `isCLI()`
	 */
	render(hovered) {
		let image = this.getImage();
		if (!(image instanceof Drawable)) {
			let color = ColorDrawable.parseColor(image, false);
			if (color != null) {
				return color + " ";
			}
			return BitmapDrawableFactory.requireByKey(image)
				|| BitmapDrawableFactory.requireByKey("menuBoardWarning") || "";
		}
		return "";
	},
	getImage() {
		return this.image || null;
	},
	setImage(src) {
		if (isAndroid()) {
			let image = this.getImageView();
			if (!(src instanceof Drawable)) {
				src = Drawable.parseJson.call(this, src);
			}
			$.ViewCompat.setTransitionName(image, src);
			src.attachAsImage(image);
		}
		this.image = src;
		return this;
	}
};
