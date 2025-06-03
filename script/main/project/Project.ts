class Project {
	object: Scriptable[];
	private worker: Worker;
	isAutosaving: boolean;
	time: string | number | Date;
	private currentId = -1;
	constructor(obj?: object | object[]) {
		this.object = Array.isArray(obj) ? obj : [];
	}
	getAll() {
		return this.object;
	}
	getCount() {
		return this.getAll().length;
	}
	getCurrentlyId() {
		return this.currentId;
	}
	setCurrentlyId(id: number) {
		this.currentId = Number(id);
	}
	getCurrentObject() {
		let id = this.getCurrentlyId(),
			obj = this.getAll()[id];
		if (obj) return obj;
		delete this.worker;
		this.currentId = -1;
		return null;
	}
	getCurrentType() {
		let object = this.getCurrentObject();
		return object ? object.type : null;
	}
	getCurrentWorker() {
		return this.worker || null;
	}
	switchToWorker(worker: Worker) {
		this.worker = worker;
		this.updateCurrentWorker();
	}
	updateCurrentWorker() {
		let id = this.getCurrentlyId(),
			worker = this.getCurrentWorker();
		if (!worker || id < 0) return;
		this.getAll()[id] = worker.getProject();
	}
	isOpened = false
	callAutosave() {
		if (!autosave || this.isAutosaving) {
			this.updateCurrentWorker();
			return;
		}
		try {
			this.isAutosaving = true;
			this.updateCurrentWorker();
			exportProject(autosaveProjectable ? this.getAll() : this.getCurrentObject(), true,
					Dirs.PROJECT_AUTOSAVE + this.getProjectTime() + ".dnp",
					_ => delete this.isAutosaving);
		} catch (e) {
			reportError(e);
			delete this.isAutosaving;
		}
	}
	getProjectTime() {
		let time = new Date(this.time);
		if (!this.time) {
			return translate("Autosave %s", random(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1));
		}
		return monthToName(time.getMonth()) + " " + time.getDate() + ", " + time.getFullYear() + " " +
			(time.getHours() >= 10 ? time.getHours() : "0" + time.getHours()) + "-" +
			(time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()) + "-" +
			(time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds());
	}
	getByType(type: string): Scriptable[] {
		let objects = this.getAll(),
			values = [];
		for (let offset = 0; offset < this.getCount(); offset++) {
			if (objects[offset].type == type) {
				values.push(offset);
			}
		}
		return values;
	}
	getIdByObject(obj: Scriptable) {
		let content = this.getAll();
		return content.indexOf(obj);
	}
}
