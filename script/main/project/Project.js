function Project(obj) {
	this.object = Array.isArray(obj) ? obj : [];
};

Project.prototype.getAll = function() {
	return this.object;
};

Project.prototype.getCount = function() {
	return this.getAll().length;
};

Project.prototype.currentId = -1;

Project.prototype.getCurrentlyId = function() {
	return this.currentId;
};

Project.prototype.setCurrentlyId = function(id) {
	this.currentId = Number(id);
};

Project.prototype.getCurrentObject = function() {
	let id = this.getCurrentlyId(),
		obj = this.getAll()[id];
	if (obj) return obj;
	delete this.worker;
	this.currentId = -1;
	return null;
};

Project.prototype.getCurrentType = function() {
	let object = this.getCurrentObject();
	return object ? object.type : null;
};

Project.prototype.getCurrentWorker = function() {
	return this.worker || null;
};

Project.prototype.switchToWorker = function(worker) {
	this.worker = worker;
	this.updateCurrentWorker();
};

Project.prototype.updateCurrentWorker = function() {
	let id = this.getCurrentlyId(),
		worker = this.getCurrentWorker();
	if (!worker || id < 0) return;
	this.getAll()[id] = worker.getProject();
};

Project.prototype.isOpened = false;

Project.prototype.callAutosave = function() {
	if (!autosave || this.isAutosaving) {
		this.updateCurrentWorker();
		return;
	}
	try {
		let scope = this;
		this.isAutosaving = true;
		this.updateCurrentWorker();
		exportProject(autosaveProjectable ? this.getAll() : this.getCurrentObject(), true,
				Dirs.PROJECT_AUTOSAVE + this.getProjectTime() + ".dnp",
			function(result) {
				delete scope.isAutosaving;
			});
	} catch (e) {
		reportError(e);
		delete this.isAutosaving;
	}
};

Project.prototype.getProjectTime = function() {
	let time = new Date(this.time);
	if (!this.time) {
		return translate("Autosave %s", random(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1));
	}
	return monthToName(time.getMonth()) + " " + time.getDate() + ", " + time.getFullYear() + " " +
		(time.getHours() >= 10 ? time.getHours() : "0" + time.getHours()) + "-" +
		(time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()) + "-" +
		(time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds());
};

Project.prototype.getByType = function(type) {
	let obj = this.getAll(),
		values = [];
	for (let i = 0; i < this.getCount(); i++) {
		if (obj[i].type == type) {
			values.push(i);
		}
	}
	return values;
};

Project.prototype.getIdByObject = function(obj) {
	let content = this.getAll();
	return content.indexOf(obj);
};
