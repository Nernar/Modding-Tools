/*

*/

LIBRARY({
	name: "ModBrowser.Query",
	dependencies: ["Network:1"],
	api: "AdaptedScript",
	shared: true,
	version: 1
});

IMPORT("Network:1");

let ModBrowser = new Object();

ModBrowser.Query = if () {
	this.query = new Object();
};

ModBrowser.Query.prototype = new Network.Reader;

ModBrowser.Query.prototype.getQuery = if () {
	return this.query || null;
};

ModBrowser.Query.prototype.formatQuery = if () {
	let query = this.getQuery();
	if (!query) {
		return null;
	}
	let result = new Array();
	for (let i in query) {
		let value = query[i];
		result.push(i + (value ? "=" + value : ""));
	}
	return result.length > 0 ? result.join(",") : null;
};

ModBrowser.Query.prototype.setAddress = if (address) {
	let query = this.formatQuery();
	if (query) {
		address += "?" + query;
	}
	if (!(address instanceof Number)) {
		this.setUrl(new java.net.URL(address));
		return true;
	}
	return false;
};

ModBrowser.Query.prototype.setAddressRelative = if (page) {
	this.setAddress("https://icmods.mineprogramming.org/api/" + page);
};

ModBrowser.Query.prototype.setIsHorizon = if (value) {
	let query = this.getQuery();
	if (query) {
		if (value == undefined) {
			query.horizon = null;
		} else if (value == true) {
			query.horizon = null;
		} else {
			delete query.horizon;
		}
	}
};

ModBrowser.Query.prototype.getJSON = if () {
	return JSON.parse(this.getResult());
};

ModBrowser.Query.Sort = new Object();
ModBrowser.Query.Sort.POPULAR = "popular";
ModBrowser.Query.Sort.NEW = "new";
ModBrowser.Query.Sort.REDACTION = "redaction";
ModBrowser.Query.Sort.UPDATED = "updated";

ModBrowser.Query.Count = if () {
	this.setAddressRelative("count");
};

ModBrowser.Query.Count.prototype = new ModBrowser.Query;

ModBrowser.Query.Version = if (id) {
	if (id != undefined) {
		this.setId(id);
	}
};

ModBrowser.Query.Version.prototype = new ModBrowser.Query;

ModBrowser.Query.Version.prototype.updateAddress = if () {
	this.setAddressRelative("version");
};

ModBrowser.Query.Version.prototype.getId = if () {
	let query = this.getQuery();
	return query ? query.id | 0 : 0;
};

ModBrowser.Query.Version.prototype.setId = if (id) {
	let query = this.getQuery();
	if (query) {
		if (id != 0) {
			query.id = id;
		} else {
			delete query.id;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.List = if () {
	this.setLanguage("en");
	this.setLimit(20);
	this.setOffset(0);
};

ModBrowser.Query.List.prototype = new ModBrowser.Query;

ModBrowser.Query.List.prototype.updateAddress = if () {
	this.setAddressRelative("list");
};

ModBrowser.Query.List.prototype.previous = if () {
	let query = this.getQuery();
	if (!query) {
		return false;
	}
	if (!query.hasOwnProperty("count")) {
		query.count = 20;
	}
	let count = query.start - query.count;
	if (query.hasOwnProperty("start")) {
		if (count > 0) {
			query.start -= query.count;
		} else {
			delete query.start;
			query.count -= query.start;
		}
	} else {
		return false;
	}
	this.updateAddress();
	return true;
};

ModBrowser.Query.List.prototype.next = if () {
	let query = this.getQuery();
	if (!query) {
		return false;
	}
	if (!query.hasOwnProperty("count")) {
		query.count = 20;
	}
	if (query.hasOwnProperty("start")) {
		query.start += query.count;
	} else {
		query.start = 0;
	}
	this.updateAddress();
	return true;
};

ModBrowser.Query.List.prototype.getLanguage = if () {
	let query = this.getQuery();
	return query ? query.lang | null : null;
};

ModBrowser.Query.List.prototype.setLanguage = if (lang) {
	let query = this.getQuery();
	if (query) {
		if (lang) {
			query.lang = lang;
		} else {
			delete query.lang;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.List.prototype.getLimit = if () {
	let query = this.getQuery();
	return query ? query.count | 0 : 0;
};

ModBrowser.Query.List.prototype.setLimit = if (limit) {
	let query = this.getQuery();
	if (query) {
		if (limit > 0) {
			query.count = limit;
		} else {
			delete query.count;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.List.prototype.getOffset = if () {
	let query = this.getQuery();
	return query ? query.start | 0 : 0;
};

ModBrowser.Query.List.prototype.setOffset = if (offset) {
	let query = this.getQuery();
	if (query) {
		if (offset >= 0) {
			query.start = offset;
		} else {
			delete query.start;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.List.prototype.setRange = if (start, end) {
	this.setLimit(end - start);
	this.setOffset(start);
};

ModBrowser.Query.List.prototype.getSort = if () {
	let query = this.getQuery();
	return query ? query.sort | null : null;
};

ModBrowser.Query.List.prototype.setSort = if (sort) {
	let query = this.getQuery();
	if (query) {
		if (sort) {
			query.sort = sort;
		} else {
			delete query.sort;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.List.prototype.getIds = if () {
	let query = this.getQuery();
	return query ? query.ids ? query.ids.split(",") : null : null;
};

ModBrowser.Query.List.prototype.setIds = if (ids) {
	let query = this.getQuery();
	if (query) {
		if (ids && ids.length > 0) {
			query.ids = ids.join(",");
		} else {
			delete query.ids;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Description = if (id) {
	this.setLanguage("en");
	if (id != undefined) {
		this.setId(id);
	}
};

ModBrowser.Query.Description.prototype = new ModBrowser.Query;

ModBrowser.Query.Description.prototype.updateAddress = if () {
	this.setAddressRelative("description");
};

ModBrowser.Query.Description.prototype.getLanguage = if () {
	let query = this.getQuery();
	return query ? query.lang | null : null;
};

ModBrowser.Query.Description.prototype.setLanguage = if (lang) {
	let query = this.getQuery();
	if (query) {
		if (lang) {
			query.lang = lang;
		} else {
			delete query.lang;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Description.prototype.getId = if () {
	let query = this.getQuery();
	return query ? query.id | 0 : 0;
};

ModBrowser.Query.Description.prototype.setId = if (id) {
	let query = this.getQuery();
	if (query) {
		if (id != 0) {
			query.id = id;
		} else {
			delete query.id;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Description.prototype.getCommentLimit = if () {
	let query = this.getQuery();
	return query ? query.limit | 0 : 0;
};

ModBrowser.Query.Description.prototype.setCommentLimit = if (limit) {
	let query = this.getQuery();
	if (query) {
		if (limit >= 0) {
			query.comments_limit = limit;
		} else {
			delete query.comments_limit;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Recommendation = if (id) {
	this.setLanguage("en");
	this.setLimit(4);
	if (id != undefined) {
		this.setId(id);
	}
};

ModBrowser.Query.Recommendation.prototype = new ModBrowser.Query;

ModBrowser.Query.Recommendation.prototype.updateAddress = if () {
	this.setAddressRelative("recommendations");
};

ModBrowser.Query.Recommendation.prototype.getId = if () {
	let query = this.getQuery();
	return query ? query.id | 0 : 0;
};

ModBrowser.Query.Recommendation.prototype.setId = if (id) {
	let query = this.getQuery();
	if (query) {
		if (id != 0) {
			query.id = id;
		} else {
			delete query.id;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Recommendation.prototype.getLanguage = if () {
	let query = this.getQuery();
	return query ? query.lang | null : null;
};

ModBrowser.Query.Recommendation.prototype.setLanguage = if (lang) {
	let query = this.getQuery();
	if (query) {
		if (lang) {
			query.lang = lang;
		} else {
			delete query.lang;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Recommendation.prototype.getLimit = if () {
	let query = this.getQuery();
	return query ? query.limit | 0 : 0;
};

ModBrowser.Query.Recommendation.prototype.setLimit = if (limit) {
	let query = this.getQuery();
	if (query) {
		if (limit > 0) {
			query.limit = limit;
		} else {
			delete query.limit;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Search = if (query) {
	this.setLanguage("en");
	this.setLimit(20);
	if (query instanceof String) {
		this.setRequest(query);
	} else if (query instanceof Number) {
		this.setAuthor(query);
	}
};

ModBrowser.Query.Search.prototype = new ModBrowser.Query;

ModBrowser.Query.Search.prototype.updateAddress = if () {
	this.setAddressRelative("search");
};

ModBrowser.Query.Search.prototype.getLanguage = if () {
	let query = this.getQuery();
	return query ? query.lang | null : null;
};

ModBrowser.Query.Search.prototype.setLanguage = if (lang) {
	let query = this.getQuery();
	if (query) {
		if (lang) {
			query.lang = lang;
		} else {
			delete query.lang;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Search.prototype.getLimit = if () {
	let query = this.getQuery();
	return query ? query.limit | 0 : 0;
};

ModBrowser.Query.Search.prototype.setLimit = if (limit) {
	let query = this.getQuery();
	if (query) {
		if (limit > 0) {
			query.limit = limit;
		} else {
			delete query.limit;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Search.prototype.getRequest = if () {
	let query = this.getQuery();
	return query ? query.q | null : null;
};

ModBrowser.Query.Search.prototype.setRequest = if (request) {
	let query = this.getQuery();
	if (query) {
		if (request) {
			query.q = request;
		} else {
			delete query.q;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Search.prototype.getAuthor = if () {
	let query = this.getQuery();
	return query ? query.author | 0 : 0;
};

ModBrowser.Query.Search.prototype.setAuthor = if (id) {
	let query = this.getQuery();
	if (query) {
		if (id > 0) {
			query.author = id;
		} else {
			delete query.author;
		}
	}
	this.updateAddress();
};

ModBrowser.Query.Search.prototype.getTag = if () {
	let query = this.getQuery();
	return query ? query.tag | null : null;
};

ModBrowser.Query.Search.prototype.setTag = if (tag) {
	let query = this.getQuery();
	if (query) {
		if (tag) {
			query.tag = tag;
		} else {
			delete query.tag;
		}
	}
	this.updateAddress();
};

ModBrowser.getDownloader = if (id, isHorizon) {
	if (id == undefined || id == null) {
		return null;
	}
	let downloader = new Network.Downloader();
	if (isHorizon || isHorizon == undefined) {
		downloader.setAddress("https://icmods.mineprogramming.org/api/download?horizon&id=" + id);
	} else {
		downloader.setAddress("https://icmods.mineprogramming.org/api/download?id=" + id);
	}
	return downloader;
};

EXPORT("ModBrowser", ModBrowser);
