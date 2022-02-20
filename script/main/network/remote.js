const RemoteMod = function(obj) {
	if (obj != undefined) {
		this.fromJSON(obj);
	}
};
Object.defineProperty(RemoteMod.prototype, "id", {
	value: 0,
	writable: true,
	enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "icon", {
    value: null,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "title", {
    value: null,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "description", {
    value: null,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "optimized", {
    value: false,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "version", {
    value: null,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "updated", {
    value: null,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "premium", {
    value: false,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "pack", {
    value: false,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "likes", {
    value: 0,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "dislikes", {
    value: 0,
    writable: true,
    enumerable: true
});
Object.defineProperty(RemoteMod.prototype, "fromJSON", {
	value: function(obj) {
		if (!obj) {
			return;
		}
		this.id = obj.id;
		this.icon = obj.icon;
		this.title = obj.title;
		this.description = obj.description;
		this.optimized = !!obj.horizon_optimized;
		this.version = obj.version_name;
		this.updated = obj.last_update;
		this.premium = !!obj.vip;
		this.pack = !!obj.pack;
		this.likes = obj.likes;
		this.dislikes = obj.dislikes;
	},
	enumerable: true
});

Object.defineProperty(RemoteMod, "fetchList", {
	value: function(list) {
		if (!Array.isArray(list)) {
			return null;
		}
		let mods = new Array();
		for (let i = 0; i < list.length; i++) {
			mods.push(new RemoteMod(list[i]));
		}
		return mods;
	},
	enumerable: true
});
