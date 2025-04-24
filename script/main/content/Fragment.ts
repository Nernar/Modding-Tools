class Fragment {
	constructor() {
		this.views = {};
	}

	private views: { [key: string]: android.view.View };
	private container: Nullable<android.view.View>;
	getContainer() {
		return this.container || null;
	}
	setContainerView(view: Nullable<android.view.View>) {
		this.container = view;
		return this;
	}
	getViews() {
		return this.views || null;
	}
	findViewByKey(key) {
		return this.views[key] || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	findViewById(id) {
		let container = this.getContainer();
		if (container == null) return null;
		return container.findViewById(id) || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	findViewByTag(tag) {
		let container = this.getContainer();
		if (container == null) return null;
		return container.findViewWithTag(tag) || null;
	}
	findView(stroke) {
		let byKey = this.findViewByKey(stroke);
		if (isAndroid()) {
			return byKey || this.findViewById(stroke) || this.findViewByTag(stroke);
		}
		return byKey;
	}

	private parent: Nullable<Fragment | FocusableWindow>;
	getParent() {
		return this.parent || null;
	}
	getIndex() {
		let parent = this.getParent();
		if (parent && parent instanceof LayoutFragment) {
			return parent.indexOf(this);
		}
		return -1;
	}
	getWindow() {
		let fragment = this.getParent();
		while (fragment && fragment instanceof Fragment) {
			fragment = fragment.getParent();
		}
		return fragment;
	}

	private token: Nullable<string>;
	getToken() {
		return this.token || null;
	}
	setToken(token) {
		if (token != null) {
			this.token = token;
		} else {
			delete this.token;
		}
		return this;
	}
	findParentFragment(token) {
		let parent = this.getParent();
		if (parent instanceof Fragment) {
			if (parent.getToken() == token) {
				return parent;
			}
			return parent.findParentFragment(token);
		}
		return null;
	}
	findFragmentInParent(token) {
		let parent = this.getParent();
		if (parent instanceof Fragment) {
			if (parent instanceof LayoutFragment) {
				let fragment = parent.findFragment(token);
				if (fragment != null) {
					return fragment;
				}
			}
			return parent.findFragmentInParent(token);
		}
		return null;
	}
	findFragment(token: any) {
		throw new Error("Method not implemented.");
	}

	protected onAttach: any;
	protected onDeattach: any;
	attach(parent) {
		if (parent == null || parent == this.parent) {
			if (parent == null) {
				MCSystem.throwException("Modding Tools: Fragment.attach(*) was called with an invalid parent: " + parent);
			}
			return;
		}
		this.parent = parent;
		this.onAttach && this.onAttach.apply(this, arguments);
	}
	setOnAttachListener(listener) {
		if (listener != null) {
			this.onAttach = listener;
		} else {
			delete this.onAttach;
		}
		return this;
	}
	deattach() {
		if (this.parent != null) {
			this.onDeattach && this.onDeattach.apply(this, arguments);
		}
		delete this.parent;
	}
	setOnDeattachListener(listener) {
		if (listener != null) {
			this.onDeattach = listener;
		} else {
			delete this.onDeattach;
		}
		return this;
	}

	protected onUpdate: any;
	protected updateFragment: any;
	update() {
		this.updateFragment && this.updateFragment.apply(this, arguments);
		this.onUpdate && this.onUpdate.apply(this, arguments);
	}
	updateWith(when) {
		if (typeof when != "function" || when(this)) {
			this.update.apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
	setOnUpdateListener(listener) {
		if (listener != null) {
			this.onUpdate = listener;
		} else {
			delete this.onUpdate;
		}
		return this;
	}

	private selectable: boolean = false;
	isSelectable() {
		return this.selectable;
	}
	setIsSelectable(selectable) {
		this.selectable = !!selectable;
		return this;
	}

	/**
	 * @requires `isAndroid()`
	 */
	isRequiresFocusable() {
		return false;
	}
	/**
	 * @requires `isCLI()`
	 */
	draw(hovered: boolean) {
		return "";
	}
	/**
	 * @requires `isCLI()`
	 */
	observe(keys: number[]) {
		return false;
	}

	private hoverable: boolean = true;
	/**
	 * @requires `isCLI()`
	 */
	isHoverable() {
		return this.hoverable;
	}
	/**
	 * @requires `isCLI()`
	 */
	setIsHoverable(hoverable: boolean) {
		this.hoverable = !!hoverable;
		return this;
	}
	/**
	 * @requires `isCLI()`
	 */
	hover() {
		return this.isHoverable();
	}

	static parseJson: (instanceOrJson: any, json: any, preferredFragment: any) => any;
}

const registerFragmentJson = (function() {
	let fragments = {};

	Fragment.parseJson = function(instanceOrJson, json, preferredFragment) {
		if (!(instanceOrJson instanceof Fragment)) {
			json = instanceOrJson;
			instanceOrJson = null;
		}
		if (json != null && typeof json == "object" && json.type != null) {
			preferredFragment = json.type;
		}
		if (preferredFragment == null || !fragments.hasOwnProperty(preferredFragment)) {
			Logger.Log("Modding Tools: Unresolved fragment " + JSON.stringify(preferredFragment) + ", please make sure that \"type\" property is used anywhere...", "WARNING");
			return instanceOrJson;
		}
		return fragments[preferredFragment].parseJson.call(this, instanceOrJson || new fragments[preferredFragment](), json);
	};

	return function(id, fragment) {
		if (fragments.hasOwnProperty(id)) {
			Logger.Log("Modding Tools: Fragment json " + JSON.stringify(id) + " is already occupied!", "WARNING");
			return false;
		}
		if (typeof fragment != "function" || !(fragment.prototype instanceof Fragment)) {
			Logger.Log("Modding Tools: Passed fragment " + fragment + " for json " + JSON.stringify(id) + " must contain prototype of Fragment!", "WARNING");
			return false;
		}
		if (typeof fragment.parseJson != "function") {
			Logger.Log("Modding Tools: Nothing to call by parseJson, please consider that your fragment contains required json property!", "WARNING");
			return false;
		}
		fragments[id] = fragment;
		return true;
	};
})();
