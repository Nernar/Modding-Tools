const Frame = function(fragment) {
	if (fragment instanceof Fragment) {
		this.setFragment(fragment);
	}
};

Frame.prototype.getFragment = function() {
	return this.fragment || null;
};

Frame.prototype.setFragment = function(fragment) {
	let already = this.getFragment();
	if (already != null) MCSystem.throwException("ModdingTools: frame already has fragment");
	this.fragment = fragment;
};

Frame.prototype.getContainer = function() {
	let fragment = this.getFragment();
	if (fragment == null) return null;
	return fragment.getContainer();
};

(function() {
	let obtain = function(on, when, what) {
		if (on instanceof LayoutFragment) {
			let fragments = on.getFragments();
			for (let i = 0; i < fragments.length; i++) {
				obtain(fragments[i], when, what);
			}
		}
		if (typeof when != "function" || when(on)) {
			what(on);
		}
	};
	
	Frame.prototype.obtain = function(when, what) {
		let fragment = this.getFragment();
		if (fragment == null) {
			log("ModdingTools: Frame.obtain called before any fragment attached");
			return;
		}
		obtain(fragment, when, what);
	};
})();
