const BrowserWorker = function() {
	this.callback = new Object();
};
Object.defineProperty(BrowserWorker.prototype, "setCallback", {
	value: function(callback) {
		if (callback && callback instanceof Object) {
			this.callback = callback;
			return;
		}
		this.callback = new Object();
	},
	enumerable: true
});
Object.defineProperty(BrowserWorker.prototype, "getCount", {
	value: function() {
		return BrowserWorker.getCount(this.callback);
	},
	enumerable: true
});
Object.defineProperty(BrowserWorker.prototype, "getVersion", {
	value: function(id) {
		if (id == undefined || id == null) {
			return null;
		}
		let query = new ModBrowser.Query.Version();
		query.setCallback(this.callback);
		query.setIsHorizon(isHorizon);
		query.setId(id);
		return query.read();
	},
	enumerable: true
});
Object.defineProperty(BrowserWorker.prototype, "catchLastAvailabledId", {
	value: function(language) {
		let query = new ModBrowser.Query.List();
		query.setIsHorizon(isHorizon);
		query.setLanguage(language || Translation.getLanguage());
		query.setSort(ModBrowser.Query.Sort.NEW);
		query.setLimit(1);
		let callback = this.callback;
		query.setCallback(callback);
		query.read();
		let json = query.getJSON();
		return json[0].id;
	},
	enumerable: true
});
Object.defineProperty(BrowserWorker.prototype, "fetchList", {
	value: function(limit, language, force) {
		if (!force && this.mods) {
			return this.mods;
		}
		let query = new ModBrowser.Query.List();
		query.setIsHorizon(isHorizon);
		query.setLanguage(language || Translation.getLanguage());
		let callback = this.callback;
		query.setCallback(callback);
		let mods = this.mods = new Array();
		if (limit != undefined) {
			query.setLimit(limit);
		}
		let count = 0;
		do {
			query.read();
			let json = query.getJSON();
			for (let i = 0; i < json.length; i++) {
				if (callback.hasOwnProperty("onFetchMod")) {
					callback.onFetchMod(mods, json[i]);
				}
				mods.push(json[i]);
			}
			count += json.length;
			query.setOffset(count);
		} while (count % (isHorizon ? query.getLimit() : query.getLimit() + 1) == 0);
		return mods;
	},
	enumerable: true
});
Object.defineProperty(BrowserWorker.prototype, "getDescription", {
	value: function(id, language) {
		if (id == undefined || id == null) {
			return null;
		}
		let query = new ModBrowser.Query.Description();
		query.setLanguage(language || Translation.getLanguage());
		query.setCommentLimit(999);
		query.setIsHorizon(isHorizon);
		query.setId(id);
		return query.getJSON();
	},
	enumerable: true
});
Object.defineProperty(BrowserWorker.prototype, "download", {
	value: function(id, file) {
		if (id == undefined || id == null) {
			return null;
		}
		if (!(file instanceof String)) {
			file = file.getPath();
		}
		let downloader = ModBrowser.getDownloader(id, isHorizon);
		downloader.setCallback(this.callback);
		downloader.setPath(file + ".icmod");
		downloader.download();
	},
	enumerable: true
});
Object.defineProperty(BrowserWorker.prototype, "getList", {
	value: function() {
		if (!this.mods) {
			return this.fetchList();
		}
		return this.mods;
	},
	enumerable: true
});

Object.defineProperty(BrowserWorker, "fetchList", {
	value: function(callback) {
		let worker = new BrowserWorker();
		if (callback != undefined) {
			worker.setCallback(callback);
		}
		let list = worker.getList();
		return RemoteMod.fetchList(list);
	},
	enumerable: true
});
Object.defineProperty(BrowserWorker, "getCount", {
    value: function(callback) {
        let query = new ModBrowser.Query.Count();
        if (callback != undefined) {
        	query.setCallback(callback);
        }
        query.setIsHorizon(isHorizon);
        return parseInt(query.read());
    },
    enumerable: true
});
