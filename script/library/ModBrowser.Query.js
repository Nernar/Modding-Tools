/*
BUILD INFO:
  dir: ModBrowser.Query
  target: out/ModBrowser.Query.js
  files: 9
*/



// file: header.js

/*

   Copyright 2020-2022 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

LIBRARY({
	name: "ModBrowser.Query",
	version: 1,
	api: "AdaptedScript",
	dependencies: ["Connectivity:1"],
	shared: true
});

IMPORT("Connectivity:1");

ModBrowser = {};




// file: network/Query.js

ModBrowser.Query = function() {
	this.query = {};
};

ModBrowser.Query.prototype = new Connectivity.Reader;

ModBrowser.Query.prototype.getQuery = function() {
	return this.query || null;
};

ModBrowser.Query.prototype.formatQuery = function() {
	let query = this.getQuery();
	if (!query) return null;
	let result = [];
	for (let item in query) {
		let value = query[item];
		result.push(item + (value !== null && value !== undefined
			? "=" + value : ""));
	}
	return result.length > 0 ? result.join("&") : null;
};

ModBrowser.Query.prototype.setAddress = function(address) {
	let query = this.formatQuery();
	if (query) address += "?" + query;
	this.setUrl(new java.net.URL(address));
};

ModBrowser.Query.prototype.setAddressRelative = function(page) {
	this.setAddress("https://icmods.mineprogramming.org/api/" + page);
};

ModBrowser.Query.prototype.setIsHorizon = function(value) {
	let query = this.getQuery();
	if (query) {
		if (value === undefined || value == true) {
			query.horizon = null;
		} else delete query.horizon;
	}
};

ModBrowser.Query.prototype.getJSON = function() {
	return JSON.parse(this.getResult());
};

ModBrowser.Query.Sort = {};
ModBrowser.Query.Sort.POPULAR = "popular";
ModBrowser.Query.Sort.NEW = "new";
ModBrowser.Query.Sort.REDACTION = "redaction";
ModBrowser.Query.Sort.UPDATED = "updated";




// file: network/Count.js

ModBrowser.Query.Count = function() {
	this.setAddressRelative("count");
};

ModBrowser.Query.Count.prototype = new ModBrowser.Query;




// file: network/Version.js

ModBrowser.Query.Version = function(id) {
	if (id !== undefined) {
		this.setId(id);
	}
};

ModBrowser.Query.Version.prototype = new ModBrowser.Query;

ModBrowser.Query.Version.prototype.updateAddress = function() {
	this.setAddressRelative("version");
};

ModBrowser.Query.Version.prototype.getId = function() {
	let query = this.getQuery();
	return query ? query.id | 0 : 0;
};

ModBrowser.Query.Version.prototype.setId = function(id) {
	let query = this.getQuery();
	if (query) {
		if (id >= 0) {
			query.id = id;
		} else delete query.id;
	}
	this.updateAddress();
};




// file: network/List.js

ModBrowser.Query.List = function() {
	this.setLanguage("en");
	this.setLimit(20);
	this.setOffset(0);
};

ModBrowser.Query.List.prototype = new ModBrowser.Query;

ModBrowser.Query.List.prototype.updateAddress = function() {
	this.setAddressRelative("list");
};

ModBrowser.Query.List.prototype.previous = function() {
	let query = this.getQuery();
	if (!query) return false;
	if (!query.hasOwnProperty("count")) {
		query.count = 20;
	}
	let count = query.start - query.count;
	if (query.hasOwnProperty("start")) {
		if (count > 0) {
			query.start -= query.count;
		} else {
			query.count -= query.start;
			delete query.start;
		}
	} else return false;
	this.updateAddress();
	return true;
};

ModBrowser.Query.List.prototype.next = function() {
	let query = this.getQuery();
	if (!query) return false;
	if (!query.hasOwnProperty("count")) {
		query.count = 20;
	}
	if (query.hasOwnProperty("start")) {
		query.start += query.count;
	} else query.start = 0;
	this.updateAddress();
	return true;
};

ModBrowser.Query.List.prototype.getLanguage = function() {
	let query = this.getQuery();
	return query ? query.lang | null : null;
};

ModBrowser.Query.List.prototype.setLanguage = function(lang) {
	let query = this.getQuery();
	if (query) {
		if (lang) {
			query.lang = lang;
		} else delete query.lang;
	}
	this.updateAddress();
};

ModBrowser.Query.List.prototype.getLimit = function() {
	let query = this.getQuery();
	return query ? query.count | 0 : 0;
};

ModBrowser.Query.List.prototype.setLimit = function(limit) {
	let query = this.getQuery();
	if (query) {
		if (limit > 0) {
			query.count = limit;
		} else delete query.count;
	}
	this.updateAddress();
};

ModBrowser.Query.List.prototype.getOffset = function() {
	let query = this.getQuery();
	return query ? query.start | 0 : 0;
};

ModBrowser.Query.List.prototype.setOffset = function(offset) {
	let query = this.getQuery();
	if (query) {
		if (offset >= 0) {
			query.start = offset;
		} else delete query.start;
	}
	this.updateAddress();
};

ModBrowser.Query.List.prototype.setRange = function(start, end) {
	this.setLimit(end - start);
	this.setOffset(start);
};

ModBrowser.Query.List.prototype.getSort = function() {
	let query = this.getQuery();
	return query ? query.sort | null : null;
};

ModBrowser.Query.List.prototype.setSort = function(sort) {
	let query = this.getQuery();
	if (query) {
		if (sort) {
			query.sort = sort;
		} else delete query.sort;
	}
	this.updateAddress();
};

ModBrowser.Query.List.prototype.getIds = function() {
	let query = this.getQuery();
	return query ? query.ids ? query.ids.split(",") : null : null;
};

ModBrowser.Query.List.prototype.setIds = function(ids) {
	let query = this.getQuery();
	if (query) {
		if ("" + ids == ids) {
			query.ids = id;
		} else if (ids && ids.length > 0) {
			query.ids = ids.join(",");
		} else delete query.ids;
	}
	this.updateAddress();
};




// file: network/Description.js

ModBrowser.Query.Description = function(id) {
	this.setLanguage("en");
	if (id !== undefined) {
		this.setId(id);
	}
};

ModBrowser.Query.Description.prototype = new ModBrowser.Query;

ModBrowser.Query.Description.prototype.updateAddress = function() {
	this.setAddressRelative("description");
};

ModBrowser.Query.Description.prototype.getLanguage = function() {
	let query = this.getQuery();
	return query ? query.lang | null : null;
};

ModBrowser.Query.Description.prototype.setLanguage = function(lang) {
	let query = this.getQuery();
	if (query) {
		if (lang) {
			query.lang = lang;
		} else delete query.lang;
	}
	this.updateAddress();
};

ModBrowser.Query.Description.prototype.getId = function() {
	let query = this.getQuery();
	return query ? query.id | 0 : 0;
};

ModBrowser.Query.Description.prototype.setId = function(id) {
	let query = this.getQuery();
	if (query) {
		if (id >= 0) {
			query.id = id;
		} else delete query.id;
	}
	this.updateAddress();
};

ModBrowser.Query.Description.prototype.getCommentLimit = function() {
	let query = this.getQuery();
	return query ? query.limit | 0 : 0;
};

ModBrowser.Query.Description.prototype.setCommentLimit = function(limit) {
	let query = this.getQuery();
	if (query) {
		if (limit >= 0) {
			query.comments_limit = limit;
		} else delete query.comments_limit;
	}
	this.updateAddress();
};




// file: network/Recommendation.js

ModBrowser.Query.Recommendation = function(id) {
	this.setLanguage("en");
	this.setLimit(4);
	if (id !== undefined) {
		this.setId(id);
	}
};

ModBrowser.Query.Recommendation.prototype = new ModBrowser.Query;

ModBrowser.Query.Recommendation.prototype.updateAddress = function() {
	this.setAddressRelative("recommendations");
};

ModBrowser.Query.Recommendation.prototype.getId = function() {
	let query = this.getQuery();
	return query ? query.id | 0 : 0;
};

ModBrowser.Query.Recommendation.prototype.setId = function(id) {
	let query = this.getQuery();
	if (query) {
		if (id >= 0) {
			query.id = id;
		} else delete query.id;
	}
	this.updateAddress();
};

ModBrowser.Query.Recommendation.prototype.getLanguage = function() {
	let query = this.getQuery();
	return query ? query.lang | null : null;
};

ModBrowser.Query.Recommendation.prototype.setLanguage = function(lang) {
	let query = this.getQuery();
	if (query) {
		if (lang) {
			query.lang = lang;
		} else delete query.lang;
	}
	this.updateAddress();
};

ModBrowser.Query.Recommendation.prototype.getLimit = function() {
	let query = this.getQuery();
	return query ? query.limit | 0 : 0;
};

ModBrowser.Query.Recommendation.prototype.setLimit = function(limit) {
	let query = this.getQuery();
	if (query) {
		if (limit > 0) {
			query.limit = limit;
		} else delete query.limit;
	}
	this.updateAddress();
};




// file: network/Search.js

ModBrowser.Query.Search = function(query) {
	this.setLanguage("en");
	this.setLimit(20);
	if ("" + query == query) {
		this.setRequest(query);
	} else if (Number.isInteger(query)) {
		this.setAuthor(query);
	}
};

ModBrowser.Query.Search.prototype = new ModBrowser.Query;

ModBrowser.Query.Search.prototype.updateAddress = function() {
	this.setAddressRelative("search");
};

ModBrowser.Query.Search.prototype.getLanguage = function() {
	let query = this.getQuery();
	return query ? query.lang | null : null;
};

ModBrowser.Query.Search.prototype.setLanguage = function(lang) {
	let query = this.getQuery();
	if (query) {
		if (lang) {
			query.lang = lang;
		} else delete query.lang;
	}
	this.updateAddress();
};

ModBrowser.Query.Search.prototype.getLimit = function() {
	let query = this.getQuery();
	return query ? query.limit | 0 : 0;
};

ModBrowser.Query.Search.prototype.setLimit = function(limit) {
	let query = this.getQuery();
	if (query) {
		if (limit > 0) {
			query.limit = limit;
		} else delete query.limit;
	}
	this.updateAddress();
};

ModBrowser.Query.Search.prototype.getRequest = function() {
	let query = this.getQuery();
	return query ? query.q | null : null;
};

ModBrowser.Query.Search.prototype.setRequest = function(request) {
	let query = this.getQuery();
	if (query) {
		if (request) {
			query.q = request;
		} else delete query.q;
	}
	this.updateAddress();
};

ModBrowser.Query.Search.prototype.getAuthor = function() {
	let query = this.getQuery();
	return query ? query.author | 0 : 0;
};

ModBrowser.Query.Search.prototype.setAuthor = function(id) {
	let query = this.getQuery();
	if (query) {
		if (id >= 0) {
			query.author = id;
		} else delete query.author;
	}
	this.updateAddress();
};

ModBrowser.Query.Search.prototype.getTag = function() {
	let query = this.getQuery();
	return query ? query.tag | null : null;
};

ModBrowser.Query.Search.prototype.setTag = function(tag) {
	let query = this.getQuery();
	if (query) {
		if (tag) {
			query.tag = tag;
		} else delete query.tag;
	}
	this.updateAddress();
};




// file: integration.js

ModBrowser.getDownloader = function(id, isHorizon) {
	if (id == undefined || id == null) {
		return null;
	}
	let downloader = new Connectivity.Downloader();
	if (isHorizon || isHorizon === undefined) {
		downloader.setAddress("https://icmods.mineprogramming.org/api/download?horizon&id=" + id);
	} else downloader.setAddress("https://icmods.mineprogramming.org/api/download?id=" + id);
	return downloader;
};

EXPORT("ModBrowser", ModBrowser);




