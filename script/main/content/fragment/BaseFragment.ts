class Aboba {
	do() {
	}
}

abstract class BaseFragment extends Fragment {
	readonly TYPE: string = "BaseFragment";
	constructor() {
		super();
		this.marks = [];
		if (this.resetContainer != null && isAndroid()) {
			this.resetContainer();
			// let container = this.getContainer();
			// if (container != null && container instanceof android.view.ViewGroup) {
				// let view = new android.widget.TextView(getContext());
				// view.setTextSize(toComplexUnitDp(6));
				// view.setTextColor($.Color.LTGRAY);
				// view.setTypeface(typeface);
				// view.setText(":: " + this.TYPE + " ::");
				// container.addView(view);
			// }
		}
		if (arguments.length > 0) {
			this.mark.apply(this, arguments);
		} else {
			this.remark();
		}
	}

	abstract resetContainer(): void;
	getContainerRoot() {
		return this.getContainer();
	}
	override setContainerView(view: Nullable<android.view.View>) {
		super.setContainerView(view);
		isAndroid() && this.resetListeners();
		return this;
	}
	resetListeners() {
		let container = this.getContainer();
		if (container == null) {
			return;
		}
		container.setOnClickListener(() => {
			try {
				this.click && this.click();
			} catch (e) {
				reportError(e);
			}
		});
		container.setOnLongClickListener(() => {
			try {
				if (this.hold && this.hold()) {
					return true;
				}
			} catch (e) {
				reportError(e);
			}
			return false;
		});
	}

	private background: Nullable<Drawable>;
	getBackground(tag?: Nullable<string>) {
		if (tag == null || tag.length == 0) {
			return this.background || null;
		}
		return this[tag + "Background"] || null;
	}
	setBackground(src, tag?: Nullable<string>, layout?: Nullable<android.view.View>) {
		if (isAndroid()) {
			if (layout == null) {
				layout = this.getContainerRoot();
			}
			if (layout != null) {
				if (!(src instanceof Drawable)) {
					src = Drawable.parseJson.call(this, src);
				}
				src.attachAsBackground(layout);
			}
		}
		if (tag == null || tag.length == 0) {
			this.background = src;
		} else {
			this[tag + "Background"] = src;
		}
		return this;
	}

	render(hovered: boolean) {
		return "";
	}
	override draw(hovered: boolean) {
		if (hovered || this.isVisible()) {
			return this.render.apply(this, arguments);
		}
		return "";
	}
	override hover() {
		return this.isHoverable() && this.isVisible();
	}

	private visible: boolean = true;
	isVisible() {
		return this.visible || false;
	}
	setVisibility(visible: boolean) {
		if (this.visible == visible) {
			return this;
		}
		if (isAndroid()) {
			this.getContainer().setVisibility(visible ? $.View.VISIBLE : $.View.GONE);
		}
		this.visible = visible;
		return this;
	}
	switchVisibility() {
		return this.setVisibility(!this.visible);
	}

	protected onClick: any;
	protected onHold: any;
	override observe(keys: number[]) {
		if (keys.indexOf(10) != -1 || keys.indexOf(13) != -1) {
			return this.onClick ? this.onClick() : false;
		}
		if (keys.indexOf(9) != -1) {
			return (this.onHold && this.onHold()) == true;
		}
		return false;
	}
	click() {
		this.onClick && this.onClick();
	}
	setOnClickListener(listener) {
		if (listener != null) {
			this.onClick = listener;
		} else {
			delete this.onClick;
		}
		return this;
	}
	hold() {
		return this.onHold && this.onHold();
	}
	setOnHoldListener(listener) {
		if (listener != null) {
			this.onHold = listener;
		} else {
			delete this.onHold;
		}
		return this;
	}

	private marks: any[];
	protected onRemark: any;
	getMarks() {
		return this.marks || null;
	}
	hasMark(mark) {
		return this.marks.indexOf(mark) != -1;
	}
	mark(marks) {
		let length = this.marks.length;
		if (Array.isArray(marks) || arguments.length > 1) {
			if (arguments.length > 1) {
				marks = arguments;
			}
			for (let offset = 0; offset < marks.length; offset++) {
				if (this.marks.indexOf(marks[offset]) == -1) {
					this.marks.push(marks[offset]);
				}
			}
		} else {
			if (this.marks.indexOf(marks) == -1) {
				this.marks.push(marks);
			}
		}
		if (length != this.marks.length) {
			this.remark();
		}
		return this;
	}
	unmark(marks) {
		let length = this.marks.length;
		if (Array.isArray(marks) || arguments.length > 1) {
			if (arguments.length > 1) {
				marks = arguments;
			}
			for (let offset = 0; offset < marks.length; offset++) {
				let index = this.marks.indexOf(marks[offset]);
				index == -1 || this.marks.splice(index, 1);
			}
		} else {
			let index = this.marks.indexOf(marks);
			index == -1 || this.marks.splice(index, 1);
		}
		if (length != this.marks.length) {
			this.remark();
		}
		return this;
	}
	remark() {
		this.onRemark && this.onRemark();
	}
	setOnRemarkListener(listener) {
		if (listener != null) {
			this.onRemark = listener;
		} else {
			delete this.onRemark;
		}
		return this;
	}
}

namespace BaseFragment {
	export function parseJson(instanceOrJson: BaseFragment | IBaseFragment, json?: IBaseFragment): BaseFragment {
		if (!(instanceOrJson instanceof BaseFragment)) {
			MCSystem.throwException("BaseFragment.parseJson is callable only with non-abstract instances!");
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json == null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("attach")) {
			instanceOrJson.setOnAttachListener(parseCallback(json, json.attach, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("deattach")) {
			instanceOrJson.setOnDeattachListener(parseCallback(json, json.deattach, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("update")) {
			instanceOrJson.setOnUpdateListener(parseCallback(json, json.update, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("token")) {
			instanceOrJson.setToken(calloutOrParse(json, json.token, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("selectable")) {
			instanceOrJson.setIsSelectable(calloutOrParse(json, json.selectable, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("hoverable")) {
			instanceOrJson.setIsHoverable(calloutOrParse(json, json.hoverable, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("visible")) {
			instanceOrJson.setVisibility(calloutOrParse(json, json.visible, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("mark") || json.hasOwnProperty("marks")) {
			instanceOrJson.mark(calloutOrParse(json, json.mark || json.marks, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("background")) {
			instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("click")) {
			instanceOrJson.setOnClickListener(parseCallback(json, json.click, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("hold")) {
			instanceOrJson.setOnHoldListener(parseCallback(json, json.hold, [this, instanceOrJson]));
		}
		return instanceOrJson;
	}
}

interface IBaseFragment<ABC = IBaseFragment<any>> {
	selectionType(json: IBaseFragment<IBaseFragment<any>>, selectionType: any, arg2: any[]): any;
	selectedBackground(json: IBaseFragment<IBaseFragment<any>>, selectedBackground: any, arg2: any[]): any;
	unselectedBackground(json: IBaseFragment<IBaseFragment<any>>, unselectedBackground: any, arg2: any[]): any;
	selected(json: IBaseFragment<IBaseFragment<any>>, selected: any, arg2: any[]): unknown;
	select(json: IBaseFragment<IBaseFragment<any>>, select: any, arg2: any): any;
	unselect(json: IBaseFragment<IBaseFragment<any>>, unselect: any, arg2: any): any;
	type?: Nullable<string>;
	attach?: (parent: Fragment | FocusableWindow) => void;
	deattach?: () => void;
	update?: (...args: any) => void;
	token?: CallableJsonProperty1<ABC, Nullable<string>>;
	selectable?: CallableJsonProperty1<ABC, boolean>;
	hoverable?: CallableJsonProperty1<ABC, boolean>;
	visible?: CallableJsonProperty1<ABC, boolean>;
	mark?: CallableJsonProperty1<ABC, Nullable<string>>;
	marks?: CallableJsonProperty1<ABC, Nullable<string | string[]>>;
	background?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
	click?: () => void;
	hold?: () => boolean | void;
}
