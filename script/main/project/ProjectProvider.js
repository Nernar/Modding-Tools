/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */

const ProjectProvider = {};

ProjectProvider.getProject = function() {
	return this.opened || null;
};

ProjectProvider.getEditorById = function(index) {
	let project = this.getProject();
	if (!project) return null;
	let obj = project.getAll();
	return obj[index] || null;
};

ProjectProvider.isInitialized = function() {
	return this.getProject() != null;
};

ProjectProvider.create = function() {
	let opened = this.opened = new Project();
	return (opened.time = Date.now(), opened);
};

ProjectProvider.addWorker = function(worker) {
	this.setupEditor(this.opened.object.push(worker.getProject()) - 1, worker);
	return worker;
};

ProjectProvider.isOpened = function() {
	let project = this.getProject();
	if (!project) return false;
	return project.isOpened;
};

ProjectProvider.getCount = function() {
	let project = this.getProject();
	if (!project) return 0;
	return project.getCount();
};

ProjectProvider.setOpenedState = function(state) {
	let project = this.getProject();
	if (!project) return;
	project.isOpened = !!state;
};

ProjectProvider.getCurrentType = function() {
	let project = this.getProject();
	if (!project || !project.isOpened) {
		return "none";
	}
	return project.getCurrentType();
};

ProjectProvider.initializeAutosave = function() {
	let project = this.getProject();
	if (project.isAutosaving) return;
	if (!autosave || this.thread || autosavePeriod <= 0) {
		project.updateCurrentWorker();
		return;
	}
	this.thread = handleThread(function() {
		do {
			java.lang.Thread.sleep(autosavePeriod * 1000);
			project.callAutosave();
			while (project.isAutosaving) {
				java.lang.Thread.sleep(1);
			}
		} while (project.isOpened);
		delete ProjectProvider.thread;
	});
};

ProjectProvider.indexOf = function(obj) {
	let project = this.getProject();
	if (!project) return -1;
	return project.getAll().indexOf(obj);
};

ProjectProvider.setupEditor = function(id, worker) {
	let project = this.getProject();
	if (!project) return;
	project.setCurrentlyId(id);
	project.switchToWorker(worker);
};
